import React, { useState, useEffect, useRef } from 'react';
import { Cuboid as Cube, Hand, Eye, Headphones, Users, Target, BookOpen, Trophy, Settings, Maximize, RotateCcw } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

interface SpatialDashboardProps {
  onNavigate: (destination: string) => void;
  onQuestSelect: (quest: any) => void;
  onSkillSelect: (skill: any) => void;
}

interface SpatialElement {
  id: string;
  type: 'quest_orb' | 'skill_tree' | 'achievement_display' | 'companion' | 'portal';
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  interactive: boolean;
  data: any;
}

interface GestureState {
  leftHand: {
    position: { x: number; y: number; z: number };
    gesture: 'open' | 'closed' | 'pointing' | 'pinch';
  } | null;
  rightHand: {
    position: { x: number; y: number; z: number };
    gesture: 'open' | 'closed' | 'pointing' | 'pinch';
  } | null;
}

const SpatialDashboard: React.FC<SpatialDashboardProps> = ({
  onNavigate,
  onQuestSelect,
  onSkillSelect
}) => {
  const { playerStats, quests, skillTrees } = useGame();
  const [isActive, setIsActive] = useState(false);
  const [spatialElements, setSpatialElements] = useState<SpatialElement[]>([]);
  const [gestureState, setGestureState] = useState<GestureState>({
    leftHand: null,
    rightHand: null
  });
  const [selectedElement, setSelectedElement] = useState<SpatialElement | null>(null);
  const [viewMode, setViewMode] = useState<'3D' | 'VR' | 'AR'>('3D');
  const [handTrackingEnabled, setHandTrackingEnabled] = useState(false);
  
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);

  useEffect(() => {
    initializeSpatialEnvironment();
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (isActive) {
      generateSpatialElements();
    }
  }, [isActive, quests, skillTrees]);

  const initializeSpatialEnvironment = async () => {
    try {
      // Check for WebXR support
      if ('xr' in navigator) {
        const vrSupported = await (navigator as any).xr.isSessionSupported('immersive-vr');
        const arSupported = await (navigator as any).xr.isSessionSupported('immersive-ar');
        
        if (vrSupported) {
          setViewMode('VR');
        } else if (arSupported) {
          setViewMode('AR');
        }
      }
      
      // Initialize 3D scene (using Three.js concepts)
      await initialize3DScene();
      
      // Check for hand tracking
      if ('navigator' in window && 'mediaDevices' in navigator) {
        setHandTrackingEnabled(true);
      }
      
    } catch (error) {
      console.error('Failed to initialize spatial environment:', error);
      // Fallback to 2D mode
      setViewMode('3D');
    }
  };

  const initialize3DScene = async () => {
    // Initialize 3D scene (simplified - in production use Three.js or Babylon.js)
    const scene = {
      camera: {
        position: { x: 0, y: 1.6, z: 5 },
        rotation: { x: 0, y: 0, z: 0 }
      },
      lighting: {
        ambient: { intensity: 0.4, color: '#ffffff' },
        directional: { intensity: 0.8, position: { x: 5, y: 10, z: 5 } }
      },
      environment: 'learning_space'
    };

    sceneRef.current = scene;
  };

  const generateSpatialElements = () => {
    const elements: SpatialElement[] = [];
    
    // Generate quest orbs
    quests.slice(0, 6).forEach((quest, index) => {
      const angle = (index / 6) * Math.PI * 2;
      const radius = 3;
      
      elements.push({
        id: `quest_orb_${quest.id}`,
        type: 'quest_orb',
        position: {
          x: Math.cos(angle) * radius,
          y: 1.5 + Math.sin(index) * 0.3,
          z: Math.sin(angle) * radius
        },
        rotation: { x: 0, y: angle, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        interactive: true,
        data: quest
      });
    });
    
    // Generate skill trees
    skillTrees.forEach((tree, index) => {
      elements.push({
        id: `skill_tree_${tree.id}`,
        type: 'skill_tree',
        position: {
          x: (index - skillTrees.length / 2) * 4,
          y: 0,
          z: -6
        },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1.5, y: 2, z: 1.5 },
        interactive: true,
        data: tree
      });
    });
    
    // Add achievement display
    elements.push({
      id: 'achievement_display',
      type: 'achievement_display',
      position: { x: 0, y: 3, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      interactive: true,
      data: { level: playerStats.level, experience: playerStats.experience }
    });
    
    // Add AI companion
    elements.push({
      id: 'ai_companion',
      type: 'companion',
      position: { x: 2, y: 1.6, z: 2 },
      rotation: { x: 0, y: -Math.PI / 4, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      interactive: true,
      data: { name: 'Athena', status: 'ready' }
    });
    
    setSpatialElements(elements);
  };

  const handleElementInteraction = (element: SpatialElement, interactionType: string) => {
    setSelectedElement(element);
    
    switch (element.type) {
      case 'quest_orb':
        if (interactionType === 'grab' || interactionType === 'click') {
          onQuestSelect(element.data);
        }
        break;
      case 'skill_tree':
        if (interactionType === 'point' || interactionType === 'click') {
          onSkillSelect(element.data);
        }
        break;
      case 'portal':
        if (interactionType === 'walk_through') {
          onNavigate(element.data.destination);
        }
        break;
      case 'companion':
        if (interactionType === 'wave' || interactionType === 'click') {
          // Activate AI companion
          console.log('AI Companion activated');
        }
        break;
    }
  };

  const renderSpatialElement = (element: SpatialElement) => {
    const style = {
      position: 'absolute' as const,
      left: `${50 + element.position.x * 5}%`,
      top: `${50 - element.position.y * 10}%`,
      transform: `scale(${element.scale.x}) rotateY(${element.rotation.y}rad)`,
      zIndex: Math.round(10 - element.position.z)
    };

    switch (element.type) {
      case 'quest_orb':
        return (
          <div
            key={element.id}
            style={style}
            onClick={() => handleElementInteraction(element, 'click')}
            className="cursor-pointer transform transition-all duration-300 hover:scale-110"
          >
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${
              element.data.completed 
                ? 'from-green-500 to-emerald-600' 
                : element.data.status === 'in_progress'
                ? 'from-blue-500 to-indigo-600'
                : 'from-purple-500 to-pink-600'
            } flex items-center justify-center shadow-lg animate-bounce-gentle`}>
              <span className="text-2xl">
                {element.data.subject === 'Mathematics' ? '📐' :
                 element.data.subject === 'Physics' ? '⚛️' :
                 element.data.subject === 'Chemistry' ? '🧪' :
                 element.data.subject === 'Biology' ? '🧬' : '🎯'}
              </span>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/70 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
              {element.data.title}
            </div>
          </div>
        );
        
      case 'skill_tree':
        return (
          <div
            key={element.id}
            style={style}
            onClick={() => handleElementInteraction(element, 'click')}
            className="cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            <div className="w-24 h-32 bg-gradient-to-t from-green-800 to-green-400 rounded-lg flex flex-col items-center justify-end p-2 shadow-lg">
              <div className="text-3xl mb-2">🌳</div>
              <div className="text-white text-xs text-center font-medium">
                {element.data.subject}
              </div>
              <div className="text-white/80 text-xs">
                Lv.{element.data.level}
              </div>
            </div>
          </div>
        );
        
      case 'achievement_display':
        return (
          <div
            key={element.id}
            style={style}
            className="transform transition-all duration-300"
          >
            <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-4 shadow-lg text-center">
              <Trophy className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-white font-bold">Level {element.data.level}</div>
              <div className="text-yellow-100 text-xs">{element.data.experience} XP</div>
            </div>
          </div>
        );
        
      case 'companion':
        return (
          <div
            key={element.id}
            style={style}
            onClick={() => handleElementInteraction(element, 'click')}
            className="cursor-pointer transform transition-all duration-300 hover:scale-110"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-3xl">🦉</span>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
              {element.data.name}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const render3DView = () => (
    <div className="relative w-full h-96 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 rounded-xl overflow-hidden">
      {/* 3D Scene Container */}
      <div className="absolute inset-0">
        {/* Render spatial elements */}
        {spatialElements.map(renderSpatialElement)}
        
        {/* Grid Floor */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
          <div className="grid grid-cols-10 grid-rows-10 h-full">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="border border-white/10"></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Spatial UI Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Hand Tracking Indicators */}
        {handTrackingEnabled && gestureState.leftHand && (
          <div
            className="absolute w-8 h-8 bg-blue-400/50 rounded-full border-2 border-blue-400 pointer-events-none"
            style={{
              left: `${gestureState.leftHand.position.x * 100}%`,
              top: `${gestureState.leftHand.position.y * 100}%`
            }}
          >
            <Hand className="w-4 h-4 text-white m-2" />
          </div>
        )}
        
        {/* Interaction Hints */}
        {selectedElement && (
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-4 pointer-events-auto">
            <h4 className="text-white font-semibold mb-2">{selectedElement.data.title || selectedElement.type}</h4>
            <div className="space-y-1 text-sm text-white/80">
              {selectedElement.type === 'quest_orb' && (
                <>
                  <p>🎯 {selectedElement.data.description}</p>
                  <p>⚡ Rewards: {selectedElement.data.rewards?.experience} XP</p>
                  <p>👆 Click or grab to start quest</p>
                </>
              )}
              {selectedElement.type === 'skill_tree' && (
                <>
                  <p>🌳 {selectedElement.data.subject} Knowledge Tree</p>
                  <p>📊 Level {selectedElement.data.level}</p>
                  <p>👆 Click to explore skills</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* 3D Controls */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
          <div className="flex items-center justify-center space-x-4">
            <button 
              onClick={() => {/* Rotate camera left */}}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setHandTrackingEnabled(!handTrackingEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                handTrackingEnabled ? 'bg-green-600 text-white' : 'bg-white/20 text-white'
              }`}
            >
              <Hand className="w-4 h-4" />
            </button>
            <button 
              onClick={() => {/* Toggle spatial audio */}}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
            >
              <Headphones className="w-4 h-4" />
            </button>
            <button 
              onClick={() => {/* Enter fullscreen */}}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-center mt-2">
            <p className="text-white/80 text-sm">
              {handTrackingEnabled 
                ? 'Use hand gestures to interact with objects'
                : 'Click objects to interact • Enable hand tracking for gesture control'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVRView = () => (
    <div className="relative w-full h-96 bg-black rounded-xl overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-8xl mb-4">🥽</div>
          <h3 className="text-2xl font-bold mb-2">VR Spatial Dashboard</h3>
          <p className="text-white/70 mb-4">Put on your VR headset to enter the immersive learning space</p>
          <button
            onClick={() => initializeVRSession()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-200"
          >
            Enter VR Learning Space
          </button>
        </div>
      </div>
    </div>
  );

  const initializeVRSession = async () => {
    try {
      const session = await (navigator as any).xr.requestSession('immersive-vr');
      // Initialize VR session with spatial elements
      console.log('VR session started');
    } catch (error) {
      console.error('VR session failed:', error);
    }
  };

  const renderARView = () => (
    <div className="relative w-full h-96 bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-8xl mb-4">📱</div>
          <h3 className="text-2xl font-bold mb-2">AR Spatial Dashboard</h3>
          <p className="text-white/70 mb-4">Use your device camera to place learning elements in your real space</p>
          <button
            onClick={() => initializeARSession()}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all duration-200"
          >
            Start AR Learning Space
          </button>
        </div>
      </div>
    </div>
  );

  const initializeARSession = async () => {
    try {
      const session = await (navigator as any).xr.requestSession('immersive-ar');
      // Initialize AR session with spatial elements
      console.log('AR session started');
    } catch (error) {
      console.error('AR session failed:', error);
    }
  };

  const cleanup = () => {
    // Cleanup 3D resources
    if (rendererRef.current) {
      rendererRef.current.dispose();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Cube className="w-8 h-8 text-purple-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Spatial Learning Dashboard</h1>
            <p className="text-purple-300">Navigate your learning journey in 3D space</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
          <span className="text-white/70 text-sm">
            {viewMode} Mode {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="flex space-x-2">
        {['3D', 'VR', 'AR'].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              viewMode === mode
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {mode === '3D' ? '💻' : mode === 'VR' ? '🥽' : '📱'} {mode}
          </button>
        ))}
      </div>

      {/* Spatial Environment */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        {!isActive ? (
          <div className="text-center py-12">
            <Cube className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Enter Spatial Learning Mode</h3>
            <p className="text-white/70 mb-6">Experience your learning journey in immersive 3D space</p>
            <button
              onClick={() => setIsActive(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-200"
            >
              Activate Spatial Dashboard
            </button>
          </div>
        ) : (
          <>
            {viewMode === '3D' && render3DView()}
            {viewMode === 'VR' && renderVRView()}
            {viewMode === 'AR' && renderARView()}
          </>
        )}
      </div>

      {/* Spatial Controls */}
      {isActive && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2 flex items-center">
              <Hand className="w-4 h-4 mr-2 text-blue-400" />
              Gesture Controls
            </h4>
            <div className="space-y-1 text-xs text-white/70">
              <p>👆 Point to select objects</p>
              <p>✊ Grab to pick up quest orbs</p>
              <p>👋 Wave to activate AI companion</p>
              <p>🤏 Pinch to zoom and manipulate</p>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2 flex items-center">
              <Eye className="w-4 h-4 mr-2 text-green-400" />
              Spatial Elements
            </h4>
            <div className="space-y-1 text-xs text-white/70">
              <p>🔮 Quest orbs: Start learning adventures</p>
              <p>🌳 Skill trees: Explore knowledge domains</p>
              <p>🏆 Achievement display: View progress</p>
              <p>🦉 AI companion: Get personalized help</p>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2 flex items-center">
              <Settings className="w-4 h-4 mr-2 text-purple-400" />
              Spatial Settings
            </h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-xs text-white/70">
                <input
                  type="checkbox"
                  checked={handTrackingEnabled}
                  onChange={(e) => setHandTrackingEnabled(e.target.checked)}
                  className="rounded"
                />
                <span>Hand tracking</span>
              </label>
              <label className="flex items-center space-x-2 text-xs text-white/70">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded"
                />
                <span>Spatial audio</span>
              </label>
              <label className="flex items-center space-x-2 text-xs text-white/70">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded"
                />
                <span>Physics interactions</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpatialDashboard;