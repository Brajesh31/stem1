import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Camera, 
  Mic, 
  Smartphone,
  Target,
  Award,
  Eye,
  Upload,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Globe,
  Zap
} from 'lucide-react';
import { livingLabService } from '../../services/livingLabService';
import { useAppDispatch } from '../../store';
import { addNotification } from '../../store/slices/uiSlice';
import type { VillageLabMission, SubmittedData } from '../../types/livingLab';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';

const VillageLab: React.FC = () => {
  const dispatch = useAppDispatch();
  const [missions, setMissions] = useState<VillageLabMission[]>([]);
  const [activeMission, setActiveMission] = useState<VillageLabMission | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [collectedData, setCollectedData] = useState<Record<string, any>>({});
  const [capturedImages, setCapturedImages] = useState<File[]>([]);
  const [isCollecting, setIsCollecting] = useState(false);
  const [sensorPermissions, setSensorPermissions] = useState({
    camera: false,
    location: false,
    microphone: false
  });
  const [researcherStats, setResearcherStats] = useState({
    level: 3,
    dataPoints: 1250,
    missionsCompleted: 8,
    scientificContributions: 5,
    rank: 'Field Researcher'
  });

  useEffect(() => {
    loadMissions();
    checkSensorPermissions();
  }, []);

  const loadMissions = async () => {
    try {
      const availableMissions = await livingLabService.getAvailableMissions(8);
      setMissions(availableMissions);
    } catch (error) {
      console.error('Failed to load missions:', error);
    }
  };

  const checkSensorPermissions = async () => {
    // Check camera permission
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setSensorPermissions(prev => ({ ...prev, camera: true }));
    } catch (error) {
      console.log('Camera permission not granted');
    }

    // Check location permission
    try {
      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      setSensorPermissions(prev => ({ ...prev, location: true }));
    } catch (error) {
      console.log('Location permission not granted');
    }

    // Check microphone permission
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setSensorPermissions(prev => ({ ...prev, microphone: true }));
    } catch (error) {
      console.log('Microphone permission not granted');
    }
  };

  const startMission = (mission: VillageLabMission) => {
    setActiveMission(mission);
    setCurrentStep(0);
    setCollectedData({});
    setCapturedImages([]);
  };

  const collectSensorData = async (sensorType: 'camera' | 'gps' | 'microphone' | 'accelerometer') => {
    setIsCollecting(true);
    try {
      const data = await livingLabService.collectSensorData(sensorType);
      
      if (sensorType === 'camera' && data.imageBlob) {
        const file = new File([data.imageBlob], `mission_${activeMission?.id}_${Date.now()}.jpg`, {
          type: 'image/jpeg'
        });
        setCapturedImages(prev => [...prev, file]);
      } else {
        setCollectedData(prev => ({
          ...prev,
          [sensorType]: data
        }));
      }

      dispatch(addNotification({
        type: 'success',
        title: 'Data Collected',
        message: `Successfully collected ${sensorType} data for your mission!`
      }));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Collection Failed',
        message: `Failed to collect ${sensorType} data. Please check permissions.`
      }));
    } finally {
      setIsCollecting(false);
    }
  };

  const updateDataField = (fieldId: string, value: any) => {
    setCollectedData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const submitMission = async () => {
    if (!activeMission) return;

    try {
      const submission = await livingLabService.submitMissionData(
        activeMission.id,
        collectedData,
        capturedImages
      );

      // Update mission status
      setMissions(prev => prev.map(mission => 
        mission.id === activeMission.id 
          ? { ...mission, status: 'completed', submittedData: [submission] }
          : mission
      ));

      // Update researcher stats
      setResearcherStats(prev => ({
        ...prev,
        dataPoints: prev.dataPoints + activeMission.rewards.dataPoints,
        missionsCompleted: prev.missionsCompleted + 1,
        scientificContributions: prev.scientificContributions + (submission.contributesToScience ? 1 : 0)
      }));

      dispatch(addNotification({
        type: 'success',
        title: 'Mission Completed!',
        message: `You earned ${activeMission.rewards.dataPoints} Data Points and contributed to real science!`
      }));

      setActiveMission(null);
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Submission Failed',
        message: 'Failed to submit mission data. It has been saved offline.'
      }));
    }
  };

  const getMissionIcon = (type: string) => {
    switch (type) {
      case 'monsoon_watch': return '🌧️';
      case 'biodiversity_brigade': return '🦋';
      case 'pollinator_patrol': return '🐝';
      case 'water_quality': return '💧';
      case 'soil_analysis': return '🌱';
      case 'weather_station': return '🌤️';
      default: return '🔬';
    }
  };

  const getMissionColor = (type: string): string => {
    switch (type) {
      case 'monsoon_watch': return 'text-blue-400 bg-blue-500/20 border-blue-400/30';
      case 'biodiversity_brigade': return 'text-green-400 bg-green-500/20 border-green-400/30';
      case 'pollinator_patrol': return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30';
      case 'water_quality': return 'text-cyan-400 bg-cyan-500/20 border-cyan-400/30';
      case 'soil_analysis': return 'text-orange-400 bg-orange-500/20 border-orange-400/30';
      case 'weather_station': return 'text-purple-400 bg-purple-500/20 border-purple-400/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-400/30';
    }
  };

  const renderMissionCard = (mission: VillageLabMission) => (
    <div key={mission.id} className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${getMissionColor(mission.type)}`}>
            <span className="text-2xl">{getMissionIcon(mission.type)}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{mission.title}</h3>
            <p className="text-white/70 text-sm">{mission.subject}</p>
          </div>
        </div>
        <div className="text-right">
          <Badge variant={mission.status === 'completed' ? 'success' : mission.status === 'in_progress' ? 'warning' : 'info'}>
            {mission.status.replace('_', ' ').toUpperCase()}
          </Badge>
          <div className="text-xs text-white/60 mt-1">
            Scientific Value: {mission.scientificValue}/100
          </div>
        </div>
      </div>

      <p className="text-white/80 text-sm mb-4">{mission.description}</p>

      {/* Required Sensors */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-white mb-2">Required Equipment</h4>
        <div className="flex flex-wrap gap-2">
          {mission.requiredSensors.map((sensor) => (
            <span key={sensor} className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              sensorPermissions[sensor as keyof typeof sensorPermissions] 
                ? 'bg-green-500/20 text-green-300' 
                : 'bg-red-500/20 text-red-300'
            }`}>
              {sensor === 'camera' && <Camera className="w-3 h-3" />}
              {sensor === 'gps' && <MapPin className="w-3 h-3" />}
              {sensor === 'microphone' && <Mic className="w-3 h-3" />}
              {sensor === 'accelerometer' && <Smartphone className="w-3 h-3" />}
              <span className="capitalize">{sensor}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Rewards */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-white mb-2">Research Rewards</h4>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1 text-blue-300">
            <Target className="w-4 h-4" />
            <span>{mission.rewards.dataPoints} Data Points</span>
          </div>
          <div className="flex items-center space-x-1 text-purple-300">
            <Award className="w-4 h-4" />
            <span>{mission.rewards.researcherBadges.length} Badges</span>
          </div>
          {mission.rewards.virtualEquipment && (
            <div className="flex items-center space-x-1 text-yellow-300">
              <Zap className="w-4 h-4" />
              <span>Unlock: {mission.rewards.virtualEquipment}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <Button
        onClick={() => startMission(mission)}
        disabled={mission.status === 'completed' || !mission.requiredSensors.every(sensor => 
          sensorPermissions[sensor as keyof typeof sensorPermissions]
        )}
        variant={mission.status === 'completed' ? 'success' : 'primary'}
        className="w-full"
        icon={mission.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <Target className="w-5 h-5" />}
      >
        {mission.status === 'completed' ? 'Mission Completed' : 'Begin Research Mission'}
      </Button>
    </div>
  );

  const renderDataCollectionInterface = () => {
    if (!activeMission) return null;

    const currentField = activeMission.dataFields[currentStep];
    const isLastStep = currentStep >= activeMission.dataFields.length - 1;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{activeMission.title}</h2>
                <p className="text-blue-100 mt-1">Citizen Science Mission</p>
              </div>
              <button
                onClick={() => setActiveMission(null)}
                className="text-white/80 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-blue-100 mb-2">
                <span>Data Collection Progress</span>
                <span>Step {currentStep + 1} of {activeMission.dataFields.length}</span>
              </div>
              <ProgressBar
                value={((currentStep + 1) / activeMission.dataFields.length) * 100}
                variant="success"
                size="sm"
              />
            </div>
          </div>

          {/* Data Collection Form */}
          <div className="p-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-green-500/10 border border-blue-400/30 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-white mb-3">{currentField.name}</h3>
              <p className="text-white/70 mb-4">{currentField.helpText}</p>
              
              {currentField.scientificUnit && (
                <div className="bg-blue-500/20 rounded-lg p-3 mb-4">
                  <p className="text-blue-300 text-sm">
                    📊 <strong>Scientific Unit:</strong> {currentField.scientificUnit}
                  </p>
                </div>
              )}

              {/* Data Input Based on Field Type */}
              {currentField.type === 'text' && (
                <textarea
                  value={collectedData[currentField.id] || ''}
                  onChange={(e) => updateDataField(currentField.id, e.target.value)}
                  placeholder={`Enter ${currentField.name.toLowerCase()}...`}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              )}

              {currentField.type === 'number' && (
                <div className="space-y-3">
                  <input
                    type="number"
                    value={collectedData[currentField.id] || ''}
                    onChange={(e) => updateDataField(currentField.id, parseFloat(e.target.value))}
                    placeholder={`Enter ${currentField.name.toLowerCase()}`}
                    min={currentField.validation?.min}
                    max={currentField.validation?.max}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {currentField.scientificUnit && (
                    <p className="text-white/60 text-sm">Unit: {currentField.scientificUnit}</p>
                  )}
                </div>
              )}

              {currentField.type === 'multiple_choice' && (
                <div className="space-y-2">
                  {currentField.validation?.options?.map((option) => (
                    <button
                      key={option}
                      onClick={() => updateDataField(currentField.id, option)}
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                        collectedData[currentField.id] === option
                          ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                          : 'border-white/20 bg-white/5 text-white/80 hover:bg-white/10'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {currentField.type === 'image' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => collectSensorData('camera')}
                      disabled={isCollecting || !sensorPermissions.camera}
                      variant="primary"
                      loading={isCollecting}
                      icon={<Camera className="w-4 h-4" />}
                    >
                      Take Photo
                    </Button>
                    <Button
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            setCapturedImages(prev => [...prev, file]);
                          }
                        };
                        input.click();
                      }}
                      variant="secondary"
                      icon={<Upload className="w-4 h-4" />}
                    >
                      Upload Photo
                    </Button>
                  </div>
                  
                  {capturedImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {capturedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Captured ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <div className="absolute top-1 right-1 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {currentField.type === 'location' && (
                <div className="space-y-3">
                  <Button
                    onClick={() => collectSensorData('gps')}
                    disabled={isCollecting || !sensorPermissions.location}
                    variant="primary"
                    loading={isCollecting}
                    icon={<MapPin className="w-4 h-4" />}
                  >
                    Capture Location
                  </Button>
                  
                  {collectedData.gps && (
                    <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3">
                      <p className="text-green-300 text-sm">
                        📍 Location captured: {collectedData.gps.latitude?.toFixed(6)}, {collectedData.gps.longitude?.toFixed(6)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex space-x-4">
              <Button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                variant="secondary"
                className="flex-1"
              >
                Previous
              </Button>
              
              {isLastStep ? (
                <Button
                  onClick={submitMission}
                  disabled={!currentField.required || !collectedData[currentField.id]}
                  variant="success"
                  className="flex-1"
                  icon={<CheckCircle className="w-4 h-4" />}
                >
                  Submit Mission
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={currentField.required && !collectedData[currentField.id]}
                  variant="primary"
                  className="flex-1"
                >
                  Next Step
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-4xl">🔬</div>
          <div>
            <h1 className="text-3xl font-bold text-white">Village Laboratory</h1>
            <p className="text-green-300">Transform your environment into a living science lab</p>
          </div>
        </div>
        <Badge variant="success">Citizen Scientist</Badge>
      </div>

      {/* Researcher Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-400/30">
          <CardBody className="p-6 text-center">
            <Target className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{researcherStats.dataPoints}</div>
            <div className="text-blue-300 text-sm">Data Points</div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-400/30">
          <CardBody className="p-6 text-center">
            <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{researcherStats.missionsCompleted}</div>
            <div className="text-green-300 text-sm">Missions Completed</div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-400/30">
          <CardBody className="p-6 text-center">
            <Globe className="w-10 h-10 text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{researcherStats.scientificContributions}</div>
            <div className="text-purple-300 text-sm">Scientific Contributions</div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-400/30">
          <CardBody className="p-6 text-center">
            <Award className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
            <div className="text-xl font-bold text-white">Level {researcherStats.level}</div>
            <div className="text-yellow-300 text-sm">{researcherStats.rank}</div>
          </CardBody>
        </Card>
      </div>

      {/* Sensor Status */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Smartphone className="w-5 h-5 mr-2 text-blue-400" />
            Mobile Science Kit Status
          </h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { sensor: 'camera', label: 'Camera', icon: Camera, description: 'Photo documentation' },
              { sensor: 'location', label: 'GPS', icon: MapPin, description: 'Location tracking' },
              { sensor: 'microphone', label: 'Microphone', icon: Mic, description: 'Sound measurement' },
              { sensor: 'accelerometer', label: 'Motion Sensor', icon: Smartphone, description: 'Movement detection' }
            ].map(({ sensor, label, icon: Icon, description }) => (
              <div key={sensor} className={`p-4 rounded-lg border ${
                sensorPermissions[sensor as keyof typeof sensorPermissions]
                  ? 'border-green-400/30 bg-green-500/10'
                  : 'border-red-400/30 bg-red-500/10'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Icon className={`w-5 h-5 ${
                    sensorPermissions[sensor as keyof typeof sensorPermissions] ? 'text-green-400' : 'text-red-400'
                  }`} />
                  <span className="text-white font-medium text-sm">{label}</span>
                </div>
                <p className="text-white/60 text-xs">{description}</p>
                <div className={`mt-2 text-xs font-medium ${
                  sensorPermissions[sensor as keyof typeof sensorPermissions] ? 'text-green-300' : 'text-red-300'
                }`}>
                  {sensorPermissions[sensor as keyof typeof sensorPermissions] ? 'Ready' : 'Permission Needed'}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Available Missions */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Available Research Missions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {missions.map(renderMissionCard)}
        </div>
      </div>

      {/* Data Collection Interface */}
      {activeMission && renderDataCollectionInterface()}

      {/* Getting Started Guide */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Becoming a Village Scientist</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-white mb-2">Your Scientific Mission</h4>
              <ul className="space-y-1 text-sm text-white/70">
                <li>• Collect real environmental data from your surroundings</li>
                <li>• Use your mobile device as a scientific instrument</li>
                <li>• Contribute to actual scientific research projects</li>
                <li>• Earn recognition as a citizen scientist</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Data Quality Tips</h4>
              <ul className="space-y-1 text-sm text-white/70">
                <li>• Take clear, well-lit photographs</li>
                <li>• Record accurate measurements</li>
                <li>• Include detailed location information</li>
                <li>• Follow scientific observation protocols</li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default VillageLab;