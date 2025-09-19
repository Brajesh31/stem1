import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Scan, 
  Hand, 
  Eye, 
  Users, 
  Play, 
  Pause, 
  RotateCcw,
  Maximize,
  Settings
} from 'lucide-react';

interface ARExperiment {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: string;
  duration: number;
  objectives: string[];
  materials: string[];
  steps: string[];
  arFeatures: {
    objectRecognition: boolean;
    gestureControl: boolean;
    collaboration: boolean;
    measurement: boolean;
  };
}

const ARLab: React.FC = () => {
  const [isARSupported, setIsARSupported] = useState(false);
  const [isARActive, setIsARActive] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState<ARExperiment | null>(null);
  const [experiments, setExperiments] = useState<ARExperiment[]>([]);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    checkARSupport();
    loadExperiments();
  }, []);

  const checkARSupport = async () => {
    // Check for WebXR support
    if ('xr' in navigator) {
      try {
        const supported = await (navigator as any).xr.isSessionSupported('immersive-ar');
        setIsARSupported(supported);
      } catch (error) {
        console.log('WebXR not supported, falling back to camera-based AR');
        setIsARSupported(true); // Use camera-based AR as fallback
      }
    } else {
      // Fallback to camera-based AR
      setIsARSupported('mediaDevices' in navigator);
    }
  };

  const loadExperiments = () => {
    const mockExperiments: ARExperiment[] = [
      {
        id: '1',
        title: 'Molecular Structure Explorer',
        description: 'Visualize and manipulate 3D molecular structures using AR',
        subject: 'Chemistry',
        difficulty: 'Intermediate',
        duration: 30,
        objectives: [
          'Understand molecular bonding',
          'Explore different molecular shapes',
          'Learn about electron distribution'
        ],
        materials: ['Smartphone/Tablet', 'Printed molecular markers'],
        steps: [
          'Point camera at molecular marker',
          'Watch 3D molecule appear',
          'Use gestures to rotate and zoom',
          'Tap atoms to see properties'
        ],
        arFeatures: {
          objectRecognition: true,
          gestureControl: true,
          collaboration: false,
          measurement: true
        }
      },
      {
        id: '2',
        title: 'Solar System Simulation',
        description: 'Explore planets and their orbits in your room',
        subject: 'Physics',
        difficulty: 'Beginner',
        duration: 25,
        objectives: [
          'Learn planetary distances',
          'Understand orbital mechanics',
          'Compare planet sizes'
        ],
        materials: ['AR-capable device', 'Open space (2m x 2m)'],
        steps: [
          'Find open floor space',
          'Place virtual sun in center',
          'Watch planets orbit around you',
          'Tap planets for information'
        ],
        arFeatures: {
          objectRecognition: false,
          gestureControl: true,
          collaboration: true,
          measurement: true
        }
      },
      {
        id: '3',
        title: 'Human Anatomy Explorer',
        description: 'Examine human organs and systems in 3D',
        subject: 'Biology',
        difficulty: 'Advanced',
        duration: 45,
        objectives: [
          'Identify organ locations',
          'Understand system interactions',
          'Learn anatomical terminology'
        ],
        materials: ['AR device', 'Human body marker/poster'],
        steps: [
          'Scan human body outline',
          'Select organ system to explore',
          'Use gestures to dissect layers',
          'Take notes on observations'
        ],
        arFeatures: {
          objectRecognition: true,
          gestureControl: true,
          collaboration: true,
          measurement: false
        }
      },
      {
        id: '4',
        title: 'Physics Force Visualization',
        description: 'See invisible forces like gravity and magnetism',
        subject: 'Physics',
        difficulty: 'Intermediate',
        duration: 35,
        objectives: [
          'Visualize force fields',
          'Understand vector directions',
          'Experiment with force interactions'
        ],
        materials: ['AR device', 'Magnetic objects', 'Various masses'],
        steps: [
          'Place objects in AR space',
          'Activate force field visualization',
          'Move objects to see force changes',
          'Measure force magnitudes'
        ],
        arFeatures: {
          objectRecognition: true,
          gestureControl: true,
          collaboration: false,
          measurement: true
        }
      }
    ];

    setExperiments(mockExperiments);
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setCameraPermission('granted');
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      return stream;
    } catch (error) {
      console.error('Camera permission denied:', error);
      setCameraPermission('denied');
      throw error;
    }
  };

  const startARSession = async (experiment: ARExperiment) => {
    try {
      setSelectedExperiment(experiment);
      
      // Request camera permission if not granted
      if (cameraPermission !== 'granted') {
        await requestCameraPermission();
      }
      
      setIsARActive(true);
      
      // Initialize AR tracking (simplified implementation)
      initializeARTracking();
      
    } catch (error) {
      console.error('Failed to start AR session:', error);
    }
  };

  const stopARSession = () => {
    setIsARActive(false);
    setSelectedExperiment(null);
    
    // Stop camera stream
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const initializeARTracking = () => {
    // Simplified AR tracking implementation
    // In production, this would use libraries like AR.js, 8th Wall, or WebXR
    
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    const renderFrame = () => {
      if (!isARActive) return;
      
      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Add AR overlays (simplified)
      if (selectedExperiment) {
        drawAROverlays(ctx);
      }
      
      requestAnimationFrame(renderFrame);
    };
    
    video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      renderFrame();
    });
  };

  const drawAROverlays = (ctx: CanvasRenderingContext2D) => {
    // Simplified AR overlay rendering
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    
    // Draw tracking indicator
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 3;
    ctx.strokeRect(centerX - 50, centerY - 50, 100, 100);
    
    // Draw experiment-specific overlays
    if (selectedExperiment?.id === '1') {
      // Molecular structure placeholder
      ctx.fillStyle = 'rgba(0, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('H₂O Molecule', centerX, centerY + 60);
    }
  };

  const renderExperimentCard = (experiment: ARExperiment) => (
    <div key={experiment.id} className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-2">{experiment.title}</h3>
          <p className="text-white/70 text-sm mb-2">{experiment.description}</p>
          <div className="flex items-center space-x-4 text-xs text-white/60">
            <span>{experiment.subject}</span>
            <span>•</span>
            <span>{experiment.difficulty}</span>
            <span>•</span>
            <span>{experiment.duration} min</span>
          </div>
        </div>
        <div className="text-3xl">
          {experiment.subject === 'Chemistry' ? '🧪' :
           experiment.subject === 'Physics' ? '⚛️' :
           experiment.subject === 'Biology' ? '🧬' : '🔬'}
        </div>
      </div>

      {/* AR Features */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-white mb-2">AR Features</h4>
        <div className="flex flex-wrap gap-2">
          {experiment.arFeatures.objectRecognition && (
            <span className="flex items-center space-x-1 px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
              <Scan className="w-3 h-3" />
              <span>Object Recognition</span>
            </span>
          )}
          {experiment.arFeatures.gestureControl && (
            <span className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
              <Hand className="w-3 h-3" />
              <span>Gesture Control</span>
            </span>
          )}
          {experiment.arFeatures.collaboration && (
            <span className="flex items-center space-x-1 px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
              <Users className="w-3 h-3" />
              <span>Collaborative</span>
            </span>
          )}
          {experiment.arFeatures.measurement && (
            <span className="flex items-center space-x-1 px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full">
              <Eye className="w-3 h-3" />
              <span>Measurement</span>
            </span>
          )}
        </div>
      </div>

      {/* Objectives */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-white mb-2">Learning Objectives</h4>
        <ul className="space-y-1">
          {experiment.objectives.map((objective, index) => (
            <li key={index} className="text-xs text-white/70 flex items-center">
              <div className="w-1 h-1 bg-blue-400 rounded-full mr-2"></div>
              {objective}
            </li>
          ))}
        </ul>
      </div>

      {/* Action Button */}
      <button
        onClick={() => startARSession(experiment)}
        disabled={!isARSupported}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-500 hover:to-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        <Camera className="w-5 h-5" />
        <span>{isARSupported ? 'Start AR Lab' : 'AR Not Supported'}</span>
      </button>
    </div>
  );

  const renderARInterface = () => (
    <div className="fixed inset-0 bg-black z-50">
      {/* Video/Canvas Container */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        
        {/* AR Controls Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
              <h3 className="text-white font-medium">{selectedExperiment?.title}</h3>
            </div>
            <button
              onClick={stopARSession}
              className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-center space-x-4">
                <button className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors">
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Capture
                </button>
                <button className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
              
              {/* Instructions */}
              <div className="mt-3 text-center">
                <p className="text-white/80 text-sm">
                  Point camera at objects to see AR overlays
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Camera className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Augmented Reality Laboratory</h1>
            <p className="text-blue-300">Where the physical and digital realms merge for epic learning</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isARSupported ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-white/70 text-sm">
            {isARSupported ? 'Reality Augmentation Ready' : 'Standard Mode Active'}
          </span>
        </div>
      </div>

      {/* AR Support Notice */}
      {!isARSupported && (
        <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Camera className="w-6 h-6 text-yellow-400" />
            <div>
              <h3 className="text-yellow-300 font-semibold">AR Not Available</h3>
              <p className="text-yellow-200/80 text-sm">
                Your device doesn't support AR features. You can still view experiment instructions and objectives.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Experiments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {experiments.map(renderExperimentCard)}
      </div>

      {/* AR Interface */}
      {isARActive && renderARInterface()}

      {/* Getting Started Guide */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Entering the Augmented Learning Realm</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-white mb-2">Adventure Prerequisites</h4>
            <ul className="space-y-1 text-sm text-white/70">
              <li>• Camera-enabled device</li>
              <li>• Good lighting conditions</li>
              <li>• Stable internet connection</li>
              <li>• 2m x 2m open space (for some experiments)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Mastery Tips</h4>
            <ul className="space-y-1 text-sm text-white/70">
              <li>• Hold device steady</li>
              <li>• Move slowly when scanning</li>
              <li>• Ensure good lighting</li>
              <li>• Keep markers/objects clean</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARLab;