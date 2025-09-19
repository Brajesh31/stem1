import React, { useState, useEffect } from 'react';
import { Cuboid as Cube, Users, MapPin, Compass, Layers, Eye, Hand, Headphones, Wifi, Settings } from 'lucide-react';

interface VirtualEnvironment {
  id: string;
  name: string;
  description: string;
  type: 'classroom' | 'lab' | 'field_trip' | 'collaboration_space';
  capacity: number;
  currentUsers: number;
  subjects: string[];
  features: {
    spatialAudio: boolean;
    handTracking: boolean;
    environmentMapping: boolean;
    persistentObjects: boolean;
    multiUser: boolean;
  };
  thumbnail: string;
}

interface Avatar {
  id: string;
  name: string;
  appearance: {
    model: string;
    color: string;
    accessories: string[];
  };
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}

const SpatialComputing: React.FC = () => {
  const [environments, setEnvironments] = useState<VirtualEnvironment[]>([]);
  const [currentEnvironment, setCurrentEnvironment] = useState<VirtualEnvironment | null>(null);
  const [userAvatar, setUserAvatar] = useState<Avatar | null>(null);
  const [isInVR, setIsInVR] = useState(false);
  const [spatialFeatures, setSpatialFeatures] = useState({
    roomMapping: false,
    handTracking: false,
    eyeTracking: false,
    spatialAudio: false
  });

  useEffect(() => {
    loadVirtualEnvironments();
    checkSpatialCapabilities();
    initializeAvatar();
  }, []);

  const loadVirtualEnvironments = () => {
    const mockEnvironments: VirtualEnvironment[] = [
      {
        id: '1',
        name: 'Physics Laboratory',
        description: 'Interactive physics experiments in a virtual lab setting',
        type: 'lab',
        capacity: 12,
        currentUsers: 3,
        subjects: ['Physics', 'Mathematics'],
        features: {
          spatialAudio: true,
          handTracking: true,
          environmentMapping: true,
          persistentObjects: true,
          multiUser: true
        },
        thumbnail: '🔬'
      },
      {
        id: '2',
        name: 'Ancient Rome Field Trip',
        description: 'Explore the Roman Forum and Colosseum in their original glory',
        type: 'field_trip',
        capacity: 30,
        currentUsers: 8,
        subjects: ['History', 'Architecture'],
        features: {
          spatialAudio: true,
          handTracking: false,
          environmentMapping: true,
          persistentObjects: false,
          multiUser: true
        },
        thumbnail: '🏛️'
      },
      {
        id: '3',
        name: 'Chemistry Molecular Lab',
        description: 'Manipulate molecules and observe chemical reactions in 3D',
        type: 'lab',
        capacity: 8,
        currentUsers: 2,
        subjects: ['Chemistry', 'Biology'],
        features: {
          spatialAudio: false,
          handTracking: true,
          environmentMapping: false,
          persistentObjects: true,
          multiUser: true
        },
        thumbnail: '⚗️'
      },
      {
        id: '4',
        name: 'Mathematics Visualization Space',
        description: 'Explore geometric concepts and mathematical functions in 3D space',
        type: 'classroom',
        capacity: 20,
        currentUsers: 5,
        subjects: ['Mathematics', 'Geometry'],
        features: {
          spatialAudio: true,
          handTracking: true,
          environmentMapping: true,
          persistentObjects: true,
          multiUser: true
        },
        thumbnail: '📐'
      },
      {
        id: '5',
        name: 'Collaborative Project Space',
        description: 'Work together on projects with shared virtual whiteboards and tools',
        type: 'collaboration_space',
        capacity: 15,
        currentUsers: 7,
        subjects: ['All Subjects'],
        features: {
          spatialAudio: true,
          handTracking: true,
          environmentMapping: true,
          persistentObjects: true,
          multiUser: true
        },
        thumbnail: '🤝'
      },
      {
        id: '6',
        name: 'Solar System Explorer',
        description: 'Journey through space and explore planets up close',
        type: 'field_trip',
        capacity: 25,
        currentUsers: 12,
        subjects: ['Astronomy', 'Physics'],
        features: {
          spatialAudio: true,
          handTracking: false,
          environmentMapping: false,
          persistentObjects: false,
          multiUser: true
        },
        thumbnail: '🚀'
      }
    ];

    setEnvironments(mockEnvironments);
  };

  const checkSpatialCapabilities = async () => {
    // Check for WebXR support
    if ('xr' in navigator) {
      try {
        const vrSupported = await (navigator as any).xr.isSessionSupported('immersive-vr');
        const arSupported = await (navigator as any).xr.isSessionSupported('immersive-ar');
        
        setSpatialFeatures(prev => ({
          ...prev,
          roomMapping: arSupported,
          spatialAudio: vrSupported || arSupported
        }));
      } catch (error) {
        console.log('WebXR not fully supported');
      }
    }

    // Check for hand tracking (simplified)
    if ('getGamepads' in navigator) {
      setSpatialFeatures(prev => ({ ...prev, handTracking: true }));
    }

    // Check for eye tracking (experimental)
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'camera' as any });
        setSpatialFeatures(prev => ({ ...prev, eyeTracking: permission.state === 'granted' }));
      } catch (error) {
        console.log('Eye tracking not available');
      }
    }
  };

  const initializeAvatar = () => {
    const defaultAvatar: Avatar = {
      id: 'user-1',
      name: 'Student Avatar',
      appearance: {
        model: 'student',
        color: '#4F46E5',
        accessories: ['backpack', 'notebook']
      },
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 }
    };

    setUserAvatar(defaultAvatar);
  };

  const enterVirtualEnvironment = async (environment: VirtualEnvironment) => {
    try {
      setCurrentEnvironment(environment);
      
      // Check if WebXR is available
      if ('xr' in navigator) {
        const session = await (navigator as any).xr.requestSession('immersive-vr');
        setIsInVR(true);
        
        // Initialize VR session (simplified)
        initializeVRSession(session, environment);
      } else {
        // Fallback to 3D view in browser
        initializeBrowserView(environment);
      }
    } catch (error) {
      console.error('Failed to enter virtual environment:', error);
      // Fallback to browser view
      initializeBrowserView(environment);
    }
  };

  const initializeVRSession = (session: any, environment: VirtualEnvironment) => {
    // Simplified VR session initialization
    console.log('Initializing VR session for:', environment.name);
    
    // Set up spatial tracking
    if (environment.features.environmentMapping) {
      enableEnvironmentMapping();
    }
    
    // Enable hand tracking if supported
    if (environment.features.handTracking && spatialFeatures.handTracking) {
      enableHandTracking();
    }
    
    // Set up spatial audio
    if (environment.features.spatialAudio) {
      enableSpatialAudio();
    }
  };

  const initializeBrowserView = (environment: VirtualEnvironment) => {
    // Fallback 3D view in browser
    console.log('Initializing browser 3D view for:', environment.name);
    setIsInVR(false);
  };

  const enableEnvironmentMapping = () => {
    console.log('Environment mapping enabled');
    // In production, this would use WebXR's environment understanding
  };

  const enableHandTracking = () => {
    console.log('Hand tracking enabled');
    // In production, this would use WebXR hand tracking API
  };

  const enableSpatialAudio = () => {
    console.log('Spatial audio enabled');
    // In production, this would use Web Audio API with spatial positioning
  };

  const exitVirtualEnvironment = () => {
    setCurrentEnvironment(null);
    setIsInVR(false);
  };

  const customizeAvatar = (updates: Partial<Avatar['appearance']>) => {
    if (userAvatar) {
      setUserAvatar({
        ...userAvatar,
        appearance: { ...userAvatar.appearance, ...updates }
      });
    }
  };

  const getEnvironmentTypeIcon = (type: string) => {
    switch (type) {
      case 'lab': return '🔬';
      case 'classroom': return '🏫';
      case 'field_trip': return '🗺️';
      case 'collaboration_space': return '🤝';
      default: return '🌐';
    }
  };

  const getEnvironmentTypeColor = (type: string): string => {
    switch (type) {
      case 'lab': return 'text-blue-400 bg-blue-500/20 border-blue-400/30';
      case 'classroom': return 'text-green-400 bg-green-500/20 border-green-400/30';
      case 'field_trip': return 'text-purple-400 bg-purple-500/20 border-purple-400/30';
      case 'collaboration_space': return 'text-orange-400 bg-orange-500/20 border-orange-400/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-400/30';
    }
  };

  const renderEnvironmentCard = (environment: VirtualEnvironment) => (
    <div key={environment.id} className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-4xl">{environment.thumbnail}</div>
          <div>
            <h3 className="text-lg font-bold text-white">{environment.name}</h3>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEnvironmentTypeColor(environment.type)}`}>
              {environment.type.replace('_', ' ').toUpperCase()}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-white/60">Users</div>
          <div className="text-lg font-bold text-white">{environment.currentUsers}/{environment.capacity}</div>
        </div>
      </div>

      {/* Description */}
      <p className="text-white/70 text-sm mb-4">{environment.description}</p>

      {/* Subjects */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {environment.subjects.map((subject) => (
            <span key={subject} className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">
              {subject}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-white mb-2">Features</h4>
        <div className="flex flex-wrap gap-2">
          {environment.features.spatialAudio && (
            <span className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
              <Headphones className="w-3 h-3" />
              <span>Spatial Audio</span>
            </span>
          )}
          {environment.features.handTracking && (
            <span className="flex items-center space-x-1 px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
              <Hand className="w-3 h-3" />
              <span>Hand Tracking</span>
            </span>
          )}
          {environment.features.environmentMapping && (
            <span className="flex items-center space-x-1 px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
              <MapPin className="w-3 h-3" />
              <span>Room Mapping</span>
            </span>
          )}
          {environment.features.multiUser && (
            <span className="flex items-center space-x-1 px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full">
              <Users className="w-3 h-3" />
              <span>Multi-User</span>
            </span>
          )}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => enterVirtualEnvironment(environment)}
        disabled={environment.currentUsers >= environment.capacity}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-purple-500 hover:to-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {environment.currentUsers >= environment.capacity ? 'Environment Full' : 'Enter Environment'}
      </button>
    </div>
  );

  const renderVirtualEnvironmentView = () => (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 z-50">
      {/* VR/3D View Container */}
      <div className="relative w-full h-full">
        {/* Simulated 3D Environment */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-4">{currentEnvironment?.thumbnail}</div>
            <h2 className="text-3xl font-bold text-white mb-2">{currentEnvironment?.name}</h2>
            <p className="text-white/70 mb-6">Virtual environment simulation</p>
            
            {/* Simulated 3D Objects */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center text-2xl hover:bg-white/30 transition-colors cursor-pointer">
                  {i === 1 ? '🔬' : i === 2 ? '📊' : i === 3 ? '⚗️' : i === 4 ? '📐' : i === 5 ? '🧪' : '📚'}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* VR Controls Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white font-medium">{currentEnvironment?.name}</span>
                <span className="text-white/60 text-sm">
                  {currentEnvironment?.currentUsers} users online
                </span>
              </div>
            </div>
            <button
              onClick={exitVirtualEnvironment}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Exit
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-center space-x-4 mb-3">
                <button className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors">
                  <Hand className="w-5 h-5" />
                </button>
                <button className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors">
                  <Eye className="w-5 h-5" />
                </button>
                <button className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors">
                  <Headphones className="w-5 h-5" />
                </button>
                <button className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-white/80 text-sm">
                  {isInVR ? 'Use hand gestures to interact with objects' : 'Click objects to interact'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAvatarCustomization = () => (
    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Users className="w-5 h-5 mr-2 text-purple-400" />
        Avatar Customization
      </h3>
      
      {userAvatar && (
        <div className="space-y-4">
          {/* Avatar Preview */}
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-2">
              👤
            </div>
            <p className="text-white font-medium">{userAvatar.name}</p>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Avatar Color</label>
            <div className="flex space-x-2">
              {['#4F46E5', '#059669', '#DC2626', '#7C2D12', '#1F2937'].map((color) => (
                <button
                  key={color}
                  onClick={() => customizeAvatar({ color })}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    userAvatar.appearance.color === color ? 'border-white scale-110' : 'border-white/30'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Accessories */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Accessories</label>
            <div className="flex flex-wrap gap-2">
              {['backpack', 'notebook', 'glasses', 'hat', 'badge'].map((accessory) => (
                <button
                  key={accessory}
                  onClick={() => {
                    const currentAccessories = userAvatar.appearance.accessories;
                    const newAccessories = currentAccessories.includes(accessory)
                      ? currentAccessories.filter(a => a !== accessory)
                      : [...currentAccessories, accessory];
                    customizeAvatar({ accessories: newAccessories });
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    userAvatar.appearance.accessories.includes(accessory)
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {accessory}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Cube className="w-8 h-8 text-purple-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Learning Metaverse Realms</h1>
            <p className="text-purple-300">Step into immersive worlds where knowledge comes alive</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${spatialFeatures.roomMapping ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-white/70 text-sm">
            {spatialFeatures.roomMapping ? 'Metaverse Ready' : 'Basic Mode Active'}
          </span>
        </div>
      </div>

      {/* Capabilities Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { feature: 'roomMapping', label: 'Room Mapping', icon: MapPin },
          { feature: 'handTracking', label: 'Hand Tracking', icon: Hand },
          { feature: 'eyeTracking', label: 'Eye Tracking', icon: Eye },
          { feature: 'spatialAudio', label: 'Spatial Audio', icon: Headphones }
        ].map(({ feature, label, icon: Icon }) => (
          <div key={feature} className={`p-4 rounded-lg border ${
            spatialFeatures[feature as keyof typeof spatialFeatures] 
              ? 'border-green-400/30 bg-green-500/10' 
              : 'border-gray-400/30 bg-gray-500/10'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <Icon className={`w-5 h-5 ${
                spatialFeatures[feature as keyof typeof spatialFeatures] ? 'text-green-400' : 'text-gray-400'
              }`} />
              <span className="text-white font-medium text-sm">{label}</span>
            </div>
            <div className={`text-xs ${
              spatialFeatures[feature as keyof typeof spatialFeatures] ? 'text-green-300' : 'text-gray-400'
            }`}>
              {spatialFeatures[feature as keyof typeof spatialFeatures] ? 'Available' : 'Not Available'}
            </div>
          </div>
        ))}
      </div>

      {/* Avatar Customization */}
      {renderAvatarCustomization()}

      {/* Virtual Environments */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Immersive Learning Realms</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {environments.map(renderEnvironmentCard)}
        </div>
      </div>

      {/* Virtual Environment View */}
      {currentEnvironment && renderVirtualEnvironmentView()}

      {/* Getting Started Guide */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Entering the Learning Metaverse</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-white mb-2">For VR Adventurers</h4>
            <ul className="space-y-1 text-sm text-white/70">
              <li>• Ensure headset is properly calibrated</li>
              <li>• Clear play area of obstacles</li>
              <li>• Enable hand tracking if available</li>
              <li>• Adjust IPD for comfort</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">For Screen Adventurers</h4>
            <ul className="space-y-1 text-sm text-white/70">
              <li>• Use latest browser version</li>
              <li>• Enable camera permissions</li>
              <li>• Ensure stable internet connection</li>
              <li>• Use headphones for spatial audio</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpatialComputing;