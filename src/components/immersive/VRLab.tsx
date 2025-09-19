import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize, 
  Settings, 
  Users,
  Mic,
  Hand,
  Eye,
  Zap,
  Target,
  Award
} from 'lucide-react';
import { contentGenerator } from '../../services/contentGenerator';

interface VRLabProps {
  labType: 'chemistry' | 'physics' | 'biology' | 'mathematics';
  experiment: {
    id: string;
    title: string;
    objectives: string[];
    difficulty: number;
  };
  onComplete: (results: any) => void;
  onExit: () => void;
}

interface VRExperiment {
  id: string;
  title: string;
  description: string;
  type: 'chemistry' | 'physics' | 'biology' | 'mathematics';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  objectives: string[];
  equipment: VREquipment[];
  procedures: VRProcedure[];
  safetyNotes: string[];
  assessmentCriteria: string[];
}

interface VREquipment {
  id: string;
  name: string;
  model: string;
  position: { x: number; y: number; z: number };
  interactive: boolean;
  properties: any;
}

interface VRProcedure {
  step: number;
  instruction: string;
  expectedAction: string;
  hints: string[];
  safetyWarning?: string;
}

const VRLab: React.FC<VRLabProps> = ({ labType, experiment, onComplete, onExit }) => {
  const [isVRActive, setIsVRActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [experimentData, setExperimentData] = useState<VRExperiment | null>(null);
  const [userActions, setUserActions] = useState<any[]>([]);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [voiceCommands, setVoiceCommands] = useState(true);
  const [handTracking, setHandTracking] = useState(false);
  const vrSessionRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);

  useEffect(() => {
    initializeVRLab();
    return () => {
      cleanup();
    };
  }, []);

  const initializeVRLab = async () => {
    // Generate VR experiment based on lab type and experiment
    const vrExperiment = await generateVRExperiment();
    setExperimentData(vrExperiment);
    
    // Check for VR capabilities
    if ('xr' in navigator) {
      try {
        const supported = await (navigator as any).xr.isSessionSupported('immersive-vr');
        if (supported) {
          await initializeWebXR();
        } else {
          initializeFallback3D();
        }
      } catch (error) {
        console.error('VR initialization failed:', error);
        initializeFallback3D();
      }
    } else {
      initializeFallback3D();
    }
  };

  const generateVRExperiment = async (): Promise<VRExperiment> => {
    // Use AI to generate appropriate VR experiment
    const vrScenario = await contentGenerator.generateVRScenario(
      experiment.title,
      {
        learningStyle: 'kinesthetic',
        subjects: [labType],
        interactions: ['hands_on', 'collaborative']
      }
    );

    return {
      id: experiment.id,
      title: experiment.title,
      description: vrScenario.description,
      type: labType,
      difficulty: experiment.difficulty > 0.7 ? 'advanced' : experiment.difficulty > 0.4 ? 'intermediate' : 'beginner',
      duration: 45,
      objectives: experiment.objectives,
      equipment: generateVREquipment(labType),
      procedures: generateVRProcedures(labType),
      safetyNotes: generateSafetyNotes(labType),
      assessmentCriteria: [
        'Correct procedure execution',
        'Safety protocol adherence',
        'Data collection accuracy',
        'Conclusion validity'
      ]
    };
  };

  const generateVREquipment = (type: string): VREquipment[] => {
    const equipmentSets = {
      chemistry: [
        { id: 'beaker_1', name: 'Glass Beaker', model: 'beaker_250ml', position: { x: -2, y: 1, z: 0 }, interactive: true, properties: { capacity: 250, material: 'glass' } },
        { id: 'bunsen_burner', name: 'Bunsen Burner', model: 'burner_standard', position: { x: 0, y: 1, z: 0 }, interactive: true, properties: { maxTemp: 1500, fuel: 'gas' } },
        { id: 'periodic_table', name: 'Periodic Table', model: 'table_interactive', position: { x: 2, y: 1.5, z: -1 }, interactive: true, properties: { elements: 118 } },
        { id: 'safety_goggles', name: 'Safety Goggles', model: 'goggles_standard', position: { x: -1, y: 1.2, z: 0.5 }, interactive: true, properties: { required: true } }
      ],
      physics: [
        { id: 'pendulum', name: 'Simple Pendulum', model: 'pendulum_adjustable', position: { x: 0, y: 2, z: 0 }, interactive: true, properties: { length: 1, mass: 0.5 } },
        { id: 'force_meter', name: 'Force Meter', model: 'meter_digital', position: { x: 1, y: 1, z: 0 }, interactive: true, properties: { maxForce: 100, precision: 0.1 } },
        { id: 'inclined_plane', name: 'Inclined Plane', model: 'plane_adjustable', position: { x: -1, y: 0.5, z: 0 }, interactive: true, properties: { angle: 30, friction: 0.3 } },
        { id: 'masses', name: 'Mass Set', model: 'masses_various', position: { x: 2, y: 1, z: 0 }, interactive: true, properties: { masses: [0.1, 0.2, 0.5, 1.0] } }
      ],
      biology: [
        { id: 'microscope', name: 'Digital Microscope', model: 'microscope_advanced', position: { x: 0, y: 1, z: 0 }, interactive: true, properties: { magnification: [10, 40, 100, 400] } },
        { id: 'cell_samples', name: 'Cell Samples', model: 'samples_prepared', position: { x: -1, y: 1, z: 0 }, interactive: true, properties: { types: ['plant', 'animal', 'bacteria'] } },
        { id: 'petri_dishes', name: 'Petri Dishes', model: 'dishes_sterile', position: { x: 1, y: 1, z: 0 }, interactive: true, properties: { sterile: true, size: 'standard' } },
        { id: 'dna_model', name: '3D DNA Model', model: 'dna_interactive', position: { x: 0, y: 1.5, z: -1 }, interactive: true, properties: { rotatable: true, zoomable: true } }
      ],
      mathematics: [
        { id: 'geometric_shapes', name: 'Geometric Shapes', model: 'shapes_3d', position: { x: 0, y: 1, z: 0 }, interactive: true, properties: { shapes: ['cube', 'sphere', 'pyramid', 'cylinder'] } },
        { id: 'graphing_space', name: '3D Graphing Space', model: 'coordinate_system', position: { x: 0, y: 0, z: 0 }, interactive: true, properties: { dimensions: 3, gridSize: 10 } },
        { id: 'calculator', name: 'Virtual Calculator', model: 'calculator_scientific', position: { x: 1, y: 1, z: 0 }, interactive: true, properties: { functions: 'scientific' } },
        { id: 'measurement_tools', name: 'Measurement Tools', model: 'tools_precision', position: { x: -1, y: 1, z: 0 }, interactive: true, properties: { tools: ['ruler', 'protractor', 'compass'] } }
      ]
    };

    return equipmentSets[type] || equipmentSets.physics;
  };

  const generateVRProcedures = (type: string): VRProcedure[] => {
    const procedureSets = {
      chemistry: [
        {
          step: 1,
          instruction: 'Put on safety goggles before beginning the experiment',
          expectedAction: 'grab_and_wear_goggles',
          hints: ['Look for the safety goggles on the lab bench', 'Safety first in any chemistry experiment!'],
          safetyWarning: 'Always wear safety equipment in the lab'
        },
        {
          step: 2,
          instruction: 'Fill the beaker with 100ml of water',
          expectedAction: 'fill_beaker_water',
          hints: ['Use the graduated markings on the beaker', 'Pour slowly for accuracy']
        },
        {
          step: 3,
          instruction: 'Light the Bunsen burner and adjust the flame',
          expectedAction: 'light_bunsen_burner',
          hints: ['Turn the gas valve slowly', 'Adjust for a blue flame'],
          safetyWarning: 'Keep hands away from the flame'
        }
      ],
      physics: [
        {
          step: 1,
          instruction: 'Set up the pendulum with a 1-meter string length',
          expectedAction: 'adjust_pendulum_length',
          hints: ['Use the adjustment mechanism', 'Measure carefully for accurate results']
        },
        {
          step: 2,
          instruction: 'Release the pendulum from a 30-degree angle',
          expectedAction: 'release_pendulum',
          hints: ['Use the angle guide', 'Release smoothly without pushing']
        },
        {
          step: 3,
          instruction: 'Measure the period of oscillation',
          expectedAction: 'measure_period',
          hints: ['Count complete swings', 'Use the timer for accuracy']
        }
      ]
    };

    return procedureSets[type as keyof typeof procedureSets] || procedureSets.physics;
  };

  const generateSafetyNotes = (type: string): string[] => {
    const safetyNotes = {
      chemistry: [
        'Always wear safety goggles and gloves',
        'Never mix chemicals without proper guidance',
        'Keep the workspace clean and organized',
        'Report any spills or accidents immediately'
      ],
      physics: [
        'Ensure equipment is properly secured',
        'Be aware of moving parts and pendulums',
        'Handle electrical equipment with dry hands',
        'Follow proper measurement procedures'
      ],
      biology: [
        'Handle biological samples with care',
        'Maintain sterile conditions when required',
        'Dispose of materials properly',
        'Wash hands thoroughly after experiments'
      ],
      mathematics: [
        'Handle 3D models carefully',
        'Ensure measurement tools are calibrated',
        'Work systematically through calculations',
        'Double-check all measurements'
      ]
    };

    return safetyNotes[type as keyof typeof safetyNotes] || safetyNotes.physics;
  };

  const initializeWebXR = async () => {
    try {
      const session = await (navigator as any).xr.requestSession('immersive-vr', {
        requiredFeatures: ['local-floor'],
        optionalFeatures: ['hand-tracking', 'eye-tracking']
      });
      
      vrSessionRef.current = session;
      setIsVRActive(true);
      
      // Initialize VR scene
      await initializeVRScene(session);
      
      // Set up hand tracking if available
      if (session.inputSources.some((source: any) => source.hand)) {
        setHandTracking(true);
      }
      
    } catch (error) {
      console.error('WebXR session failed:', error);
      initializeFallback3D();
    }
  };

  const initializeFallback3D = () => {
    // Initialize 3D scene using Three.js or Babylon.js as fallback
    console.log('Initializing 3D fallback mode');
    setIsVRActive(false);
    
    // Create 3D scene in browser
    initializeBrowser3D();
  };

  const initializeVRScene = async (session: any) => {
    if (!experimentData) return;

    // Create VR scene based on experiment data
    const scene = {
      environment: labType,
      lighting: 'laboratory',
      equipment: experimentData.equipment,
      physics: true,
      collaboration: collaborators.length > 0
    };

    // Initialize scene objects
    for (const equipment of experimentData.equipment) {
      await createVRObject(equipment);
    }

    // Set up interaction handlers
    setupVRInteractions(session);
  };

  const initializeBrowser3D = () => {
    // Fallback 3D implementation for devices without VR
    const container = document.getElementById('vr-container');
    if (!container) return;

    // Create 3D scene using Three.js (simplified implementation)
    const scene = {
      camera: { position: { x: 0, y: 1.6, z: 3 } },
      lighting: 'ambient',
      objects: experimentData?.equipment || []
    };

    renderFallback3DScene(scene);
  };

  const createVRObject = async (equipment: VREquipment) => {
    // Create 3D object in VR space
    const object = {
      id: equipment.id,
      model: equipment.model,
      position: equipment.position,
      interactive: equipment.interactive,
      properties: equipment.properties
    };

    // Add to scene
    if (sceneRef.current) {
      sceneRef.current.add(object);
    }
  };

  const setupVRInteractions = (session: any) => {
    // Set up hand tracking interactions
    session.addEventListener('inputsourceschange', (event: any) => {
      for (const inputSource of event.added) {
        if (inputSource.hand) {
          setupHandTracking(inputSource);
        }
      }
    });

    // Set up voice commands
    if (voiceCommands) {
      setupVoiceCommands();
    }
  };

  const setupHandTracking = (inputSource: any) => {
    // Configure hand tracking for VR interactions
    const handTracker = {
      inputSource,
      joints: inputSource.hand.joints,
      gestures: ['grab', 'point', 'pinch', 'release']
    };

    // Track hand gestures
    setInterval(() => {
      const gesture = detectHandGesture(handTracker);
      if (gesture) {
        handleHandGesture(gesture);
      }
    }, 100);
  };

  const detectHandGesture = (handTracker: any): string | null => {
    // Simplified gesture detection
    // In production, use MediaPipe or similar
    return null;
  };

  const handleHandGesture = (gesture: string) => {
    switch (gesture) {
      case 'grab':
        handleObjectGrab();
        break;
      case 'point':
        handleObjectPoint();
        break;
      case 'pinch':
        handlePrecisionInteraction();
        break;
    }
  };

  const setupVoiceCommands = () => {
    if (!('webkitSpeechRecognition' in window)) return;

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      handleVoiceCommand(transcript);
    };

    recognition.start();
  };

  const handleVoiceCommand = (command: string) => {
    if (command.includes('next step')) {
      proceedToNextStep();
    } else if (command.includes('repeat')) {
      repeatCurrentStep();
    } else if (command.includes('help')) {
      showStepHints();
    } else if (command.includes('reset')) {
      resetExperiment();
    }
  };

  const handleObjectGrab = () => {
    // Handle object grabbing in VR
    recordUserAction('object_grab', { timestamp: Date.now() });
  };

  const handleObjectPoint = () => {
    // Handle pointing interactions
    recordUserAction('object_point', { timestamp: Date.now() });
  };

  const handlePrecisionInteraction = () => {
    // Handle precise interactions like adjusting dials
    recordUserAction('precision_interaction', { timestamp: Date.now() });
  };

  const recordUserAction = (action: string, data: any) => {
    setUserActions(prev => [...prev, { action, data, step: currentStep }]);
  };

  const proceedToNextStep = () => {
    if (!experimentData || currentStep >= experimentData.procedures.length - 1) {
      completeExperiment();
      return;
    }

    setCurrentStep(prev => prev + 1);
  };

  const repeatCurrentStep = () => {
    // Reset current step state
    const currentProcedure = experimentData?.procedures[currentStep];
    if (currentProcedure) {
      // Reset step-specific state
      console.log(`Repeating step: ${currentProcedure.instruction}`);
    }
  };

  const showStepHints = () => {
    const currentProcedure = experimentData?.procedures[currentStep];
    if (currentProcedure?.hints) {
      // Display hints in VR space
      displayVRHints(currentProcedure.hints);
    }
  };

  const displayVRHints = (hints: string[]) => {
    // Create floating text hints in VR space
    hints.forEach((hint, index) => {
      const hintObject = {
        type: 'text',
        content: hint,
        position: { x: -2 + index, y: 2, z: -1 },
        duration: 5000
      };
      
      // Add to VR scene
      if (sceneRef.current) {
        sceneRef.current.addTemporaryObject(hintObject);
      }
    });
  };

  const resetExperiment = () => {
    setCurrentStep(0);
    setUserActions([]);
    
    // Reset VR scene to initial state
    if (sceneRef.current) {
      sceneRef.current.reset();
    }
  };

  const completeExperiment = () => {
    const results = {
      experimentId: experiment.id,
      completedAt: new Date().toISOString(),
      totalTime: userActions.length > 0 ? 
        userActions[userActions.length - 1].data.timestamp - userActions[0].data.timestamp : 0,
      stepsCompleted: currentStep + 1,
      totalSteps: experimentData?.procedures.length || 0,
      userActions,
      safetyScore: calculateSafetyScore(),
      accuracyScore: calculateAccuracyScore(),
      collaborationScore: calculateCollaborationScore()
    };

    onComplete(results);
  };

  const calculateSafetyScore = (): number => {
    // Analyze user actions for safety compliance
    const safetyActions = userActions.filter(action => 
      action.action.includes('safety') || action.action.includes('goggles')
    );
    
    return Math.min(100, (safetyActions.length / (experimentData?.safetyNotes.length || 1)) * 100);
  };

  const calculateAccuracyScore = (): number => {
    // Analyze procedure execution accuracy
    const correctActions = userActions.filter(action => 
      action.step === currentStep && action.action.includes('correct')
    );
    
    return Math.min(100, (correctActions.length / userActions.length) * 100);
  };

  const calculateCollaborationScore = (): number => {
    // Score collaboration effectiveness
    return collaborators.length > 0 ? 85 : 0;
  };

  const renderFallback3DScene = (scene: any) => {
    // Render 3D scene for non-VR devices
    return (
      <div className="w-full h-96 bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg flex items-center justify-center relative overflow-hidden">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">
            {labType === 'chemistry' ? '🧪' : 
             labType === 'physics' ? '⚛️' : 
             labType === 'biology' ? '🔬' : '📐'}
          </div>
          <h3 className="text-xl font-bold mb-2">{experimentData?.title}</h3>
          <p className="text-blue-200 mb-4">3D Laboratory Simulation</p>
          
          {/* Simulated 3D Objects */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {experimentData?.equipment.slice(0, 6).map((equipment, index) => (
              <div 
                key={equipment.id}
                className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center text-2xl hover:bg-white/30 transition-colors cursor-pointer"
                onClick={() => recordUserAction('object_interact', { equipmentId: equipment.id })}
              >
                {labType === 'chemistry' ? ['🧪', '🔥', '📊', '🥽', '⚗️', '🧂'][index] :
                 labType === 'physics' ? ['⚖️', '📏', '🔧', '⚡', '🎯', '📐'][index] :
                 labType === 'biology' ? ['🔬', '🧬', '🦠', '🌱', '💊', '🩸'][index] :
                 ['📐', '📊', '🔢', '📏', '⭕', '📈'][index]}
              </div>
            ))}
          </div>
        </div>

        {/* 3D Scene Controls */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-center space-x-4">
              <button 
                onClick={() => recordUserAction('rotate_view', {})}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button 
                onClick={() => recordUserAction('zoom_in', {})}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
              >
                <Maximize className="w-4 h-4" />
              </button>
              <button 
                onClick={proceedToNextStep}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Next Step
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVRInterface = () => (
    <div className="fixed inset-0 bg-black z-50">
      {/* VR Scene Container */}
      <div id="vr-container" className="w-full h-full relative">
        {isVRActive ? (
          // WebXR VR View
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-8xl mb-4">🥽</div>
              <h2 className="text-3xl font-bold mb-2">VR Mode Active</h2>
              <p className="text-blue-200">Put on your VR headset to continue</p>
            </div>
          </div>
        ) : (
          // 3D Fallback View
          renderFallback3DScene({})
        )}

        {/* VR Controls Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white font-medium">{experimentData?.title}</span>
                <span className="text-white/60 text-sm">
                  Step {currentStep + 1}/{experimentData?.procedures.length}
                </span>
              </div>
            </div>
            <button
              onClick={onExit}
              className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Exit Lab
            </button>
          </div>

          {/* Current Step Instructions */}
          <div className="absolute top-20 left-4 right-4 pointer-events-auto">
            {experimentData && experimentData.procedures[currentStep] && (
              <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 max-w-md">
                <h3 className="text-white font-semibold mb-2">
                  Step {currentStep + 1}: {experimentData.procedures[currentStep].instruction}
                </h3>
                {experimentData.procedures[currentStep].safetyWarning && (
                  <div className="bg-red-500/20 border border-red-400/30 rounded p-2 mb-2">
                    <p className="text-red-200 text-sm">
                      ⚠️ {experimentData.procedures[currentStep].safetyWarning}
                    </p>
                  </div>
                )}
                <div className="flex space-x-2">
                  <button
                    onClick={showStepHints}
                    className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Hints
                  </button>
                  <button
                    onClick={proceedToNextStep}
                    className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Complete Step
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-center space-x-4 mb-3">
                <button 
                  onClick={() => setVoiceCommands(!voiceCommands)}
                  className={`p-3 rounded-full transition-colors ${
                    voiceCommands ? 'bg-green-600 text-white' : 'bg-white/20 text-white/60'
                  }`}
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button 
                  className={`p-3 rounded-full transition-colors ${
                    handTracking ? 'bg-blue-600 text-white' : 'bg-white/20 text-white/60'
                  }`}
                >
                  <Hand className="w-5 h-5" />
                </button>
                <button className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors">
                  <Eye className="w-5 h-5" />
                </button>
                <button className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-white/80 text-sm">
                  {isVRActive 
                    ? 'Use hand gestures and voice commands to interact'
                    : 'Click objects to interact • Use voice commands for guidance'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Collaboration Panel */}
          {collaborators.length > 0 && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-auto">
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 w-64">
                <h4 className="text-white font-semibold mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Lab Partners
                </h4>
                <div className="space-y-2">
                  {collaborators.map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white text-sm">{collaborator.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderLabInterface = () => (
    <div className="space-y-6">
      {/* Lab Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-4xl">
            {labType === 'chemistry' ? '🧪' : 
             labType === 'physics' ? '⚛️' : 
             labType === 'biology' ? '🔬' : '📐'}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Virtual {labType.charAt(0).toUpperCase() + labType.slice(1)} Lab</h1>
            <p className="text-blue-300">Immersive scientific exploration</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isVRActive ? 'bg-green-400' : 'bg-blue-400'}`}></div>
          <span className="text-white/70 text-sm">
            {isVRActive ? 'VR Mode' : '3D Mode'}
          </span>
        </div>
      </div>

      {/* Experiment Overview */}
      {experimentData && (
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">{experimentData.title}</h2>
          <p className="text-white/70 mb-4">{experimentData.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-white font-medium text-sm">Objectives</span>
              </div>
              <ul className="space-y-1">
                {experimentData.objectives.map((objective, index) => (
                  <li key={index} className="text-white/70 text-xs flex items-center">
                    <div className="w-1 h-1 bg-blue-400 rounded-full mr-2"></div>
                    {objective}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-medium text-sm">Equipment</span>
              </div>
              <div className="space-y-1">
                {experimentData.equipment.slice(0, 3).map((equipment) => (
                  <div key={equipment.id} className="text-white/70 text-xs">
                    {equipment.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="w-4 h-4 text-green-400" />
                <span className="text-white font-medium text-sm">Assessment</span>
              </div>
              <div className="space-y-1">
                {experimentData.assessmentCriteria.slice(0, 2).map((criteria, index) => (
                  <div key={index} className="text-white/70 text-xs">
                    {criteria}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsVRActive(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-500 hover:to-purple-500 transition-all duration-200"
          >
            Enter Virtual Laboratory
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {!isVRActive ? renderLabInterface() : renderVRInterface()}
    </>
  );
};

export default VRLab;