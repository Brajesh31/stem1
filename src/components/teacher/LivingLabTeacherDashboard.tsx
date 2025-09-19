import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Users, 
  BarChart3, 
  Target,
  Award,
  Eye,
  Settings,
  Plus,
  Download,
  Calendar,
  Globe,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';

interface MissionControlData {
  activeMissions: number;
  studentsParticipating: number;
  dataPointsCollected: number;
  scientificContributions: number;
  averageQualityScore: number;
  geographicCoverage: number; // km²
}

interface StudentSubmission {
  studentId: string;
  studentName: string;
  missionTitle: string;
  submittedAt: string;
  qualityScore: number;
  dataPoints: number;
  location: string;
  verified: boolean;
}

interface RegionalMap {
  submissions: {
    lat: number;
    lng: number;
    type: string;
    quality: number;
    studentName: string;
  }[];
  heatmapData: {
    lat: number;
    lng: number;
    intensity: number;
  }[];
}

const LivingLabTeacherDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'missions' | 'map' | 'analytics'>('overview');
  const [missionControlData, setMissionControlData] = useState<MissionControlData>({
    activeMissions: 12,
    studentsParticipating: 24,
    dataPointsCollected: 1847,
    scientificContributions: 8,
    averageQualityScore: 78,
    geographicCoverage: 45.2
  });

  const [recentSubmissions, setRecentSubmissions] = useState<StudentSubmission[]>([
    {
      studentId: '1',
      studentName: 'Priya Sharma',
      missionTitle: 'Water Quality Assessment',
      submittedAt: '2024-02-15T14:30:00Z',
      qualityScore: 92,
      dataPoints: 150,
      location: 'Village Well #3',
      verified: true
    },
    {
      studentId: '2',
      studentName: 'Arjun Patel',
      missionTitle: 'Biodiversity Survey',
      submittedAt: '2024-02-15T11:20:00Z',
      qualityScore: 85,
      dataPoints: 120,
      location: 'Community Garden',
      verified: true
    },
    {
      studentId: '3',
      studentName: 'Meera Singh',
      missionTitle: 'Pollinator Monitoring',
      submittedAt: '2024-02-15T09:45:00Z',
      qualityScore: 88,
      dataPoints: 180,
      location: 'Mustard Fields',
      verified: false
    }
  ]);

  const [customMission, setCustomMission] = useState({
    title: '',
    description: '',
    subject: 'Environmental Science',
    dataFields: [{ name: '', type: 'text', required: true }]
  });

  const createCustomMission = () => {
    if (!customMission.title || !customMission.description) return;

    console.log('Creating custom mission:', customMission);
    setCustomMission({
      title: '',
      description: '',
      subject: 'Environmental Science',
      dataFields: [{ name: '', type: 'text', required: true }]
    });
  };

  const addDataField = () => {
    setCustomMission(prev => ({
      ...prev,
      dataFields: [...prev.dataFields, { name: '', type: 'text', required: true }]
    }));
  };

  const updateDataField = (index: number, field: string, value: any) => {
    setCustomMission(prev => ({
      ...prev,
      dataFields: prev.dataFields.map((df, i) => 
        i === index ? { ...df, [field]: value } : df
      )
    }));
  };

  const verifySubmission = (submissionId: string) => {
    setRecentSubmissions(prev => prev.map(sub => 
      sub.studentId === submissionId 
        ? { ...sub, verified: true }
        : sub
    ));
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Mission Control Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-400/30">
          <CardBody className="p-6 text-center">
            <Target className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{missionControlData.activeMissions}</div>
            <div className="text-blue-300 text-sm">Active Missions</div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-400/30">
          <CardBody className="p-6 text-center">
            <Users className="w-10 h-10 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{missionControlData.studentsParticipating}</div>
            <div className="text-green-300 text-sm">Student Scientists</div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-400/30">
          <CardBody className="p-6 text-center">
            <BarChart3 className="w-10 h-10 text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{missionControlData.dataPointsCollected}</div>
            <div className="text-purple-300 text-sm">Data Points</div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-400/30">
          <CardBody className="p-6 text-center">
            <Globe className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{missionControlData.scientificContributions}</div>
            <div className="text-yellow-300 text-sm">Scientific Papers</div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-400/30">
          <CardBody className="p-6 text-center">
            <Award className="w-10 h-10 text-orange-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{missionControlData.averageQualityScore}%</div>
            <div className="text-orange-300 text-sm">Avg Quality</div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500/20 to-teal-600/20 border-teal-400/30">
          <CardBody className="p-6 text-center">
            <MapPin className="w-10 h-10 text-teal-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{missionControlData.geographicCoverage}</div>
            <div className="text-teal-300 text-sm">km² Covered</div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-green-500" />
              Recent Student Submissions
            </h2>
            <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>
              Export Data
            </Button>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          {recentSubmissions.map((submission) => (
            <div key={submission.studentId} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {submission.studentName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{submission.studentName}</h3>
                  <p className="text-white/70 text-sm">{submission.missionTitle}</p>
                  <div className="flex items-center space-x-3 text-xs text-white/60 mt-1">
                    <span>📍 {submission.location}</span>
                    <span>⏰ {new Date(submission.submittedAt).toLocaleString()}</span>
                    <span>🎯 {submission.dataPoints} points</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <ProgressBar
                    value={submission.qualityScore}
                    size="sm"
                    className="w-20"
                    variant={submission.qualityScore >= 80 ? 'success' : submission.qualityScore >= 60 ? 'warning' : 'danger'}
                  />
                  <span className="text-white font-medium">{submission.qualityScore}%</span>
                </div>
                
                <div className="flex space-x-2">
                  {submission.verified ? (
                    <Badge variant="success">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => verifySubmission(submission.studentId)}
                    >
                      Verify
                    </Button>
                  )}
                  <Button size="sm" variant="secondary">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );

  const renderMissionCreator = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-white">Create Custom Research Mission</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={customMission.title}
              onChange={(e) => setCustomMission(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Mission title..."
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <select
              value={customMission.subject}
              onChange={(e) => setCustomMission(prev => ({ ...prev, subject: e.target.value }))}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Environmental Science" className="bg-gray-800">Environmental Science</option>
              <option value="Biology" className="bg-gray-800">Biology</option>
              <option value="Chemistry" className="bg-gray-800">Chemistry</option>
              <option value="Physics" className="bg-gray-800">Physics</option>
              <option value="Geography" className="bg-gray-800">Geography</option>
            </select>
          </div>

          <textarea
            value={customMission.description}
            onChange={(e) => setCustomMission(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the research mission and what students should investigate..."
            rows={4}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />

          {/* Data Fields Configuration */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">Data Collection Fields</h3>
              <Button variant="secondary" size="sm" onClick={addDataField}>
                <Plus className="w-4 h-4 mr-1" />
                Add Field
              </Button>
            </div>
            
            <div className="space-y-3">
              {customMission.dataFields.map((field, index) => (
                <div key={index} className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) => updateDataField(index, 'name', e.target.value)}
                    placeholder="Field name..."
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <select
                    value={field.type}
                    onChange={(e) => updateDataField(index, 'type', e.target.value)}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="text" className="bg-gray-800">Text</option>
                    <option value="number" className="bg-gray-800">Number</option>
                    <option value="image" className="bg-gray-800">Image</option>
                    <option value="location" className="bg-gray-800">Location</option>
                    <option value="multiple_choice" className="bg-gray-800">Multiple Choice</option>
                  </select>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => updateDataField(index, 'required', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-white/80 text-sm">Required</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={createCustomMission}
            disabled={!customMission.title || !customMission.description}
            variant="primary"
            className="w-full"
            icon={<Target className="w-4 h-4" />}
          >
            Deploy Research Mission
          </Button>
        </CardBody>
      </Card>
    </div>
  );

  const renderDataMap = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-white flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-blue-500" />
            Live Data Collection Map
          </h2>
        </CardHeader>
        <CardBody>
          {/* Simulated Map Interface */}
          <div className="w-full h-96 bg-gradient-to-br from-green-900 to-blue-900 rounded-lg relative overflow-hidden">
            {/* Map Background */}
            <div className="absolute inset-0 opacity-30">
              <div className="grid grid-cols-10 grid-rows-10 h-full">
                {Array.from({ length: 100 }).map((_, i) => (
                  <div key={i} className="border border-white/10"></div>
                ))}
              </div>
            </div>
            
            {/* Data Points */}
            {recentSubmissions.map((submission, index) => (
              <div
                key={submission.studentId}
                className={`absolute w-4 h-4 rounded-full border-2 ${
                  submission.verified ? 'bg-green-400 border-green-300' : 'bg-yellow-400 border-yellow-300'
                } animate-pulse cursor-pointer`}
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${30 + index * 10}%`
                }}
                title={`${submission.studentName}: ${submission.missionTitle}`}
              />
            ))}
            
            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3">
              <h4 className="text-white font-medium text-sm mb-2">Data Points</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-white/80">Verified submissions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-white/80">Pending verification</span>
                </div>
              </div>
            </div>
            
            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <Button size="sm" variant="secondary">
                <Eye className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="secondary">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Map Statistics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-white">{missionControlData.geographicCoverage}</div>
              <div className="text-white/60 text-sm">km² Mapped</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-white">{recentSubmissions.length}</div>
              <div className="text-white/60 text-sm">Active Data Points</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-white">{recentSubmissions.filter(s => s.verified).length}</div>
              <div className="text-white/60 text-sm">Verified Points</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-white">{Math.round(missionControlData.averageQualityScore)}%</div>
              <div className="text-white/60 text-sm">Data Quality</div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-white">Living Lab Analytics</h2>
        </CardHeader>
        <CardBody className="space-y-6">
          {/* Engagement Metrics */}
          <div>
            <h3 className="font-semibold text-white mb-4">Student Engagement in Real-World Learning</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Village Lab Participation</h4>
                <ProgressBar value={85} label="Participation Rate" showPercentage variant="success" size="sm" />
                <p className="text-white/60 text-xs mt-1">24/28 students actively collecting data</p>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Innovation Challenge Engagement</h4>
                <ProgressBar value={72} label="Engagement Rate" showPercentage variant="warning" size="sm" />
                <p className="text-white/60 text-xs mt-1">20/28 students submitted designs</p>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Peer Collaboration</h4>
                <ProgressBar value={91} label="Collaboration Score" showPercentage variant="primary" size="sm" />
                <p className="text-white/60 text-xs mt-1">High cross-project interaction</p>
              </div>
            </div>
          </div>

          {/* Learning Outcomes */}
          <div>
            <h3 className="font-semibold text-white mb-4">Learning Outcomes & Real-World Connections</h3>
            <div className="space-y-3">
              {[
                { outcome: 'Scientific Method Application', score: 88, improvement: '+15%' },
                { outcome: 'Problem-Solving Skills', score: 92, improvement: '+22%' },
                { outcome: 'Environmental Awareness', score: 95, improvement: '+18%' },
                { outcome: 'Innovation Thinking', score: 78, improvement: '+25%' },
                { outcome: 'Community Engagement', score: 85, improvement: '+30%' }
              ].map((outcome, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white font-medium">{outcome.outcome}</span>
                  <div className="flex items-center space-x-3">
                    <ProgressBar value={outcome.score} size="sm" className="w-24" />
                    <span className="text-white">{outcome.score}%</span>
                    <span className="text-green-400 text-sm font-medium">{outcome.improvement}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Tracking */}
          <div>
            <h3 className="font-semibold text-white mb-4">Community Impact Tracking</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
                <h4 className="text-green-300 font-medium mb-3">Environmental Monitoring</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Water bodies monitored</span>
                    <span className="text-white">15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Species documented</span>
                    <span className="text-white">127</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Pollution incidents reported</span>
                    <span className="text-white">3</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-500/10 border border-orange-400/30 rounded-lg p-4">
                <h4 className="text-orange-300 font-medium mb-3">Innovation Impact</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Solutions prototyped</span>
                    <span className="text-white">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Designs implemented</span>
                    <span className="text-white">7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Community adoptions</span>
                    <span className="text-white">4</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-4xl">🌍</div>
          <div>
            <h1 className="text-3xl font-bold text-white">Living Laboratory - Teacher Mission Control</h1>
            <p className="text-green-300">Monitor real-world learning and guide student scientists</p>
          </div>
        </div>
        <Badge variant="success">Real-World Learning</Badge>
      </div>

      {/* Navigation */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-1">
        <div className="flex space-x-1">
          {[
            { id: 'overview', label: 'Mission Control', icon: BarChart3 },
            { id: 'missions', label: 'Create Missions', icon: Target },
            { id: 'map', label: 'Data Map', icon: MapPin },
            { id: 'analytics', label: 'Impact Analytics', icon: TrendingUp }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'missions' && renderMissionCreator()}
      {activeTab === 'map' && renderDataMap()}
      {activeTab === 'analytics' && renderAnalytics()}
    </div>
  );
};

export default LivingLabTeacherDashboard;