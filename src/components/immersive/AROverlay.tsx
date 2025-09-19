import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Scan, 
  Info, 
  Volume2, 
  Hand, 
  RotateCcw,
  Maximize,
  Share2,
  BookOpen,
  Target,
  Lightbulb
} from 'lucide-react';
import { contentGenerator } from '../../services/contentGenerator';

interface AROverlayProps {
  onObjectRecognized?: (object: string, content: any) => void;
  educationalContext: string;
  subject: string;
}

interface RecognizedObject {
  id: string;
  name: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  educationalContent?: any;
}

interface ARAnnotation {
  id: string;
  position: { x: number; y: number };
  content: string;
  type: 'fact' | 'question' | 'measurement' | 'interaction';
  icon: string;
}

const AROverlay: React.FC<AROverlayProps> = ({
  onObjectRecognized,
  educationalContext,
  subject
}) => {
  const [isARActive, setIsARActive] = useState(false);
  const [recognizedObjects, setRecognizedObjects] = useState<RecognizedObject[]>([]);
  const [annotations, setAnnotations] = useState<ARAnnotation[]>([]);
  const [selectedObject, setSelectedObject] = useState<RecognizedObject | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const startARSession = async () => {
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      setCameraPermission('granted');
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setIsARActive(true);
      startObjectDetection();
      
    } catch (error) {
      console.error('AR session failed:', error);
      setCameraPermission('denied');
    }
  };

  const startObjectDetection = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsScanning(true);
    
    // Start object detection loop
    detectionIntervalRef.current = setInterval(async () => {
      await detectObjects();
    }, 1000); // Detect every second
  };

  const detectObjects = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data for analysis
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Perform object detection
    const detectedObjects = await performObjectDetection(imageData);
    
    // Update recognized objects
    setRecognizedObjects(detectedObjects);
    
    // Generate educational content for new objects
    for (const obj of detectedObjects) {
      if (!obj.educationalContent) {
        const content = await contentGenerator.generateARContent(obj.name, educationalContext);
        obj.educationalContent = content;
        
        // Notify parent component
        onObjectRecognized?.(obj.name, content);
      }
    }
    
    // Generate AR annotations
    generateARAnnotations(detectedObjects);
  };

  const performObjectDetection = async (imageData: string): Promise<RecognizedObject[]> => {
    // In production, this would use:
    // - TensorFlow.js with COCO-SSD or custom model
    // - Google Cloud Vision API
    // - Azure Computer Vision
    // - Custom trained model for educational objects
    
    // Mock object detection for demo
    const mockObjects: RecognizedObject[] = [];
    
    // Simulate detecting common educational objects
    const educationalObjects = [
      { name: 'book', confidence: 0.95 },
      { name: 'calculator', confidence: 0.88 },
      { name: 'plant', confidence: 0.92 },
      { name: 'periodic_table', confidence: 0.85 },
      { name: 'microscope', confidence: 0.90 },
      { name: 'geometric_shape', confidence: 0.87 }
    ];
    
    // Randomly "detect" objects for demo
    if (Math.random() > 0.7) {
      const randomObject = educationalObjects[Math.floor(Math.random() * educationalObjects.length)];
      mockObjects.push({
        id: Date.now().toString(),
        name: randomObject.name,
        confidence: randomObject.confidence,
        boundingBox: {
          x: Math.random() * 0.6 + 0.2, // 20-80% of screen width
          y: Math.random() * 0.6 + 0.2, // 20-80% of screen height
          width: 0.2,
          height: 0.2
        }
      });
    }
    
    return mockObjects;
  };

  const generateARAnnotations = (objects: RecognizedObject[]) => {
    const newAnnotations: ARAnnotation[] = [];
    
    objects.forEach((obj) => {
      if (obj.educationalContent) {
        // Create annotations based on educational content
        const centerX = (obj.boundingBox.x + obj.boundingBox.width / 2) * 100;
        const centerY = (obj.boundingBox.y + obj.boundingBox.height / 2) * 100;
        
        // Main info annotation
        newAnnotations.push({
          id: `info_${obj.id}`,
          position: { x: centerX, y: centerY - 10 },
          content: obj.educationalContent.title,
          type: 'fact',
          icon: '📚'
        });
        
        // Interactive elements
        if (obj.educationalContent.interactiveElements?.length > 0) {
          newAnnotations.push({
            id: `interact_${obj.id}`,
            position: { x: centerX + 15, y: centerY },
            content: 'Tap to explore',
            type: 'interaction',
            icon: '👆'
          });
        }
        
        // Questions
        if (obj.educationalContent.explorationQuestions?.length > 0) {
          newAnnotations.push({
            id: `question_${obj.id}`,
            position: { x: centerX - 15, y: centerY },
            content: obj.educationalContent.explorationQuestions[0],
            type: 'question',
            icon: '❓'
          });
        }
      }
    });
    
    setAnnotations(newAnnotations);
  };

  const handleObjectTap = async (object: RecognizedObject) => {
    setSelectedObject(object);
    
    // Generate additional content if needed
    if (!object.educationalContent) {
      const content = await contentGenerator.generateARContent(object.name, educationalContext);
      object.educationalContent = content;
      setRecognizedObjects(prev => 
        prev.map(obj => obj.id === object.id ? { ...obj, educationalContent: content } : obj)
      );
    }
  };

  const stopARSession = () => {
    setIsARActive(false);
    setIsScanning(false);
    setRecognizedObjects([]);
    setAnnotations([]);
    setSelectedObject(null);
    
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    
    cleanup();
  };

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
  };

  const renderARInterface = () => (
    <div className="fixed inset-0 bg-black z-50">
      {/* Video Stream */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Canvas for object detection */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-0"
      />
      
      {/* AR Overlays */}
      <div className="absolute inset-0">
        {/* Object Bounding Boxes */}
        {recognizedObjects.map((obj) => (
          <div
            key={obj.id}
            onClick={() => handleObjectTap(obj)}
            className="absolute border-2 border-green-400 bg-green-400/20 cursor-pointer transition-all duration-200 hover:bg-green-400/40"
            style={{
              left: `${obj.boundingBox.x * 100}%`,
              top: `${obj.boundingBox.y * 100}%`,
              width: `${obj.boundingBox.width * 100}%`,
              height: `${obj.boundingBox.height * 100}%`
            }}
          >
            <div className="absolute -top-8 left-0 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
              {obj.name} ({Math.round(obj.confidence * 100)}%)
            </div>
          </div>
        ))}
        
        {/* AR Annotations */}
        {annotations.map((annotation) => (
          <div
            key={annotation.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            style={{
              left: `${annotation.position.x}%`,
              top: `${annotation.position.y}%`
            }}
          >
            <div className={`bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm max-w-xs ${
              annotation.type === 'fact' ? 'border-l-4 border-blue-400' :
              annotation.type === 'question' ? 'border-l-4 border-yellow-400' :
              annotation.type === 'interaction' ? 'border-l-4 border-green-400' :
              'border-l-4 border-purple-400'
            }`}>
              <div className="flex items-center space-x-2">
                <span>{annotation.icon}</span>
                <span>{annotation.content}</span>
              </div>
            </div>
          </div>
        ))}
        
        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-white font-medium">AR Learning Mode</span>
              <span className="text-white/60 text-sm">{recognizedObjects.length} objects detected</span>
            </div>
          </div>
          <button
            onClick={stopARSession}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Exit AR
          </button>
        </div>
        
        {/* Bottom Controls */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-center space-x-4">
              <button 
                onClick={() => setIsScanning(!isScanning)}
                className={`p-3 rounded-full transition-colors ${
                  isScanning ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                }`}
              >
                <Scan className="w-5 h-5" />
              </button>
              <button className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors">
                <RotateCcw className="w-5 h-5" />
              </button>
              <button className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors">
                <Maximize className="w-5 h-5" />
              </button>
              <button className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-center mt-3">
              <p className="text-white/80 text-sm">
                Point camera at objects to discover educational content
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Object Detail Modal */}
      {selectedObject && selectedObject.educationalContent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedObject.educationalContent.title}</h2>
                  <p className="text-blue-100 mt-1">Discovered through AR • {subject}</p>
                </div>
                <button
                  onClick={() => setSelectedObject(null)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Key Facts */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-blue-500" />
                  Key Facts
                </h3>
                <ul className="space-y-2">
                  {selectedObject.educationalContent.keyFacts?.map((fact: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300">{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Interactive Elements */}
              {selectedObject.educationalContent.interactiveElements?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Hand className="w-5 h-5 mr-2 text-green-500" />
                    Try This
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedObject.educationalContent.interactiveElements.map((element: string, index: number) => (
                      <div key={index} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3">
                        <p className="text-green-700 dark:text-green-300 text-sm">{element}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Related Concepts */}
              {selectedObject.educationalContent.relatedConcepts?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
                    Related Concepts
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedObject.educationalContent.relatedConcepts.map((concept: string, index: number) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Exploration Questions */}
              {selectedObject.educationalContent.explorationQuestions?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                    Think About This
                  </h3>
                  <div className="space-y-2">
                    {selectedObject.educationalContent.explorationQuestions.map((question: string, index: number) => (
                      <div key={index} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
                        <p className="text-yellow-700 dark:text-yellow-300">{question}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Fun Facts */}
              {selectedObject.educationalContent.funFacts?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">🌟 Fun Facts</h3>
                  <div className="space-y-2">
                    {selectedObject.educationalContent.funFacts.map((fact: string, index: number) => (
                      <div key={index} className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border border-pink-200 dark:border-pink-700 rounded-lg p-3">
                        <p className="text-pink-700 dark:text-pink-300">{fact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderARLauncher = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Camera className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Augmented Reality Explorer</h1>
            <p className="text-blue-300">Discover hidden knowledge in the world around you</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${cameraPermission === 'granted' ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-white/70 text-sm">
            {cameraPermission === 'granted' ? 'Camera Ready' : 'Camera Access Needed'}
          </span>
        </div>
      </div>

      {/* AR Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="text-4xl mb-4 text-center">🔍</div>
          <h3 className="text-lg font-semibold text-white mb-2">Object Recognition</h3>
          <p className="text-white/70 text-sm">Point your camera at any object to discover educational content and connections to your current studies.</p>
        </div>

        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="text-4xl mb-4 text-center">📚</div>
          <h3 className="text-lg font-semibold text-white mb-2">Contextual Learning</h3>
          <p className="text-white/70 text-sm">Get explanations, facts, and questions tailored to your current {subject} studies and learning level.</p>
        </div>

        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="text-4xl mb-4 text-center">🎯</div>
          <h3 className="text-lg font-semibold text-white mb-2">Interactive Exploration</h3>
          <p className="text-white/70 text-sm">Tap, rotate, and interact with virtual overlays to deepen your understanding of real-world objects.</p>
        </div>
      </div>

      {/* Launch AR */}
      <div className="text-center">
        <button
          onClick={startARSession}
          disabled={cameraPermission === 'denied'}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 mx-auto"
        >
          <Camera className="w-6 h-6" />
          <span>Launch AR Explorer</span>
        </button>
        
        {cameraPermission === 'denied' && (
          <p className="text-red-400 text-sm mt-3">
            Camera access is required for AR features. Please enable camera permissions and refresh the page.
          </p>
        )}
      </div>

      {/* Usage Tips */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">AR Learning Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-white mb-2">Best Results</h4>
            <ul className="space-y-1 text-sm text-white/70">
              <li>• Use good lighting conditions</li>
              <li>• Hold device steady when scanning</li>
              <li>• Point camera directly at objects</li>
              <li>• Try different angles for better recognition</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Supported Objects</h4>
            <ul className="space-y-1 text-sm text-white/70">
              <li>• Books and textbooks</li>
              <li>• Scientific equipment</li>
              <li>• Plants and natural objects</li>
              <li>• Mathematical tools and shapes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {!isARActive ? renderARLauncher() : renderARInterface()}
    </>
  );
};

export default AROverlay;