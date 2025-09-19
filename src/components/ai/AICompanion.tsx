import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Brain,
  Heart,
  Lightbulb,
  Target,
  Sparkles,
  Eye,
  Settings
} from 'lucide-react';
import { aiOrchestrator } from '../../services/aiOrchestrator';
import { emotionAnalyzer } from '../../services/emotionAnalyzer';
import { contentGenerator } from '../../services/contentGenerator';

interface AICompanionProps {
  studentId: string;
  currentContext: {
    topic: string;
    difficulty: number;
    subject: string;
    activity: string;
  };
  onContentRequest?: (content: any) => void;
  onModalityChange?: (modality: string) => void;
}

interface CompanionState {
  personality: 'encouraging' | 'challenging' | 'supportive' | 'analytical';
  emotionalTone: 'excited' | 'calm' | 'concerned' | 'proud';
  currentFocus: 'learning' | 'emotional_support' | 'guidance' | 'assessment';
  isListening: boolean;
  isSpeaking: boolean;
  emotionDetectionActive: boolean;
}

const AICompanion: React.FC<AICompanionProps> = ({
  studentId,
  currentContext,
  onContentRequest,
  onModalityChange
}) => {
  const [companionState, setCompanionState] = useState<CompanionState>({
    personality: 'encouraging',
    emotionalTone: 'excited',
    currentFocus: 'learning',
    isListening: false,
    isSpeaking: false,
    emotionDetectionActive: false
  });

  const [messages, setMessages] = useState<Array<{
    id: string;
    sender: 'student' | 'athena';
    content: string;
    timestamp: Date;
    type: 'text' | 'suggestion' | 'encouragement' | 'explanation';
  }>>([]);

  const [voiceInput, setVoiceInput] = useState('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<any>(null);
  const speechRecognition = useRef<any>(null);
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    initializeAICompanion();
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    // Monitor student's emotional state and adapt companion behavior
    if (companionState.emotionDetectionActive) {
      const emotionInterval = setInterval(async () => {
        const emotion = await emotionAnalyzer.getCurrentEmotion(studentId);
        setCurrentEmotion(emotion);
        adaptToEmotion(emotion);
      }, 5000);

      return () => clearInterval(emotionInterval);
    }
  }, [companionState.emotionDetectionActive, studentId]);

  const initializeAICompanion = async () => {
    // Initialize speech services
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      speechRecognition.current = new SpeechRecognition();
      speechRecognition.current.continuous = false;
      speechRecognition.current.interimResults = true;
      speechRecognition.current.lang = 'en-US';

      speechRecognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleVoiceInput(transcript);
      };
    }

    if ('speechSynthesis' in window) {
      speechSynthesis.current = window.speechSynthesis;
    }

    // Initialize emotion detection
    const emotionInitialized = await emotionAnalyzer.initialize();
    if (emotionInitialized) {
      setCompanionState(prev => ({ ...prev, emotionDetectionActive: true }));
      emotionAnalyzer.startAnalysis(studentId);
    }

    // Send initial greeting
    addMessage('athena', getContextualGreeting(), 'encouragement');
  };

  const cleanup = () => {
    if (speechRecognition.current) {
      speechRecognition.current.stop();
    }
    emotionAnalyzer.stopAnalysis();
  };

  const adaptToEmotion = async (emotion: any) => {
    let newPersonality = companionState.personality;
    let newTone = companionState.emotionalTone;
    let newFocus = companionState.currentFocus;

    // Adapt based on detected emotion
    if (emotion.frustration > 0.7) {
      newPersonality = 'supportive';
      newTone = 'calm';
      newFocus = 'emotional_support';
      
      // Proactive intervention
      addMessage('athena', 
        "I can see this is challenging. Remember, every expert was once a beginner. Would you like me to explain this concept differently?", 
        'encouragement'
      );
    } else if (emotion.boredom > 0.6) {
      newPersonality = 'challenging';
      newTone = 'excited';
      newFocus = 'learning';
      
      addMessage('athena', 
        "You're mastering this quickly! Ready for a bigger challenge? I can create a more advanced version of this activity.", 
        'suggestion'
      );
    } else if (emotion.engagement > 0.8) {
      newPersonality = 'encouraging';
      newTone = 'proud';
      newFocus = 'learning';
      
      addMessage('athena', 
        "Excellent focus! You're in the learning zone. Keep up this amazing momentum!", 
        'encouragement'
      );
    }

    setCompanionState(prev => ({
      ...prev,
      personality: newPersonality,
      emotionalTone: newTone,
      currentFocus: newFocus
    }));
  };

  const getContextualGreeting = (): string => {
    const greetings = [
      `Ready to explore ${currentContext.subject} together? I'm here to help you master every concept!`,
      `Welcome back, brave learner! Let's continue your ${currentContext.subject} adventure.`,
      `I've been preparing some exciting ways to understand ${currentContext.topic}. Shall we begin?`,
      `Your learning journey in ${currentContext.subject} is progressing beautifully. What would you like to explore today?`
    ];
    
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const handleVoiceInput = async (transcript: string) => {
    setVoiceInput(transcript);
    addMessage('student', transcript, 'text');
    
    // Process voice command
    const response = await processVoiceCommand(transcript);
    if (response) {
      addMessage('athena', response.message, response.type);
      
      if (response.action) {
        executeCompanionAction(response.action);
      }
    }
  };

  const processVoiceCommand = async (command: string): Promise<any> => {
    const lowerCommand = command.toLowerCase();
    
    // Navigation commands
    if (lowerCommand.includes('go to') || lowerCommand.includes('open')) {
      if (lowerCommand.includes('dashboard')) {
        return { message: "Taking you to your dashboard!", action: 'navigate_dashboard' };
      }
      if (lowerCommand.includes('quest')) {
        return { message: "Opening the quest board for you!", action: 'navigate_quests' };
      }
    }
    
    // Learning assistance commands
    if (lowerCommand.includes('explain') || lowerCommand.includes('help')) {
      const explanation = await contentGenerator.generateExplanation(
        currentContext.topic,
        {
          currentUnderstanding: 'needs_clarification',
          learningStyle: 'auditory', // Since they're using voice
          culturalBackground: 'general',
          difficultyLevel: currentContext.difficulty
        }
      );
      
      onContentRequest?.(explanation);
      return { 
        message: "I've generated a personalized explanation for you. Let me know if you need it explained differently!",
        type: 'explanation'
      };
    }
    
    // Emotional support commands
    if (lowerCommand.includes('frustrated') || lowerCommand.includes('stuck')) {
      return {
        message: "I understand this can be challenging. Let's break it down into smaller steps. You've got this!",
        type: 'encouragement',
        action: 'provide_support'
      };
    }
    
    // Quiz generation commands
    if (lowerCommand.includes('quiz') || lowerCommand.includes('practice')) {
      const quiz = await contentGenerator.generateQuiz(currentContext.topic, currentContext.difficulty);
      onContentRequest?.(quiz);
      return {
        message: "I've created a personalized practice quiz for you. Ready to test your knowledge?",
        type: 'suggestion'
      };
    }
    
    // Default conversational response
    return {
      message: "I'm here to help with your learning journey. You can ask me to explain concepts, create practice questions, or just chat about what you're learning!",
      type: 'text'
    };
  };

  const executeCompanionAction = (action: string) => {
    switch (action) {
      case 'navigate_dashboard':
        window.dispatchEvent(new CustomEvent('navigate', { detail: { tab: 'dashboard' } }));
        break;
      case 'navigate_quests':
        window.dispatchEvent(new CustomEvent('navigate', { detail: { tab: 'quests' } }));
        break;
      case 'provide_support':
        setCompanionState(prev => ({ ...prev, currentFocus: 'emotional_support' }));
        break;
    }
  };

  const addMessage = (sender: 'student' | 'athena', content: string, type: any) => {
    const newMessage = {
      id: Date.now().toString(),
      sender,
      content,
      timestamp: new Date(),
      type
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Speak the message if it's from Athena and voice is enabled
    if (sender === 'athena' && isVoiceEnabled) {
      speakMessage(content);
    }
  };

  const speakMessage = (text: string) => {
    if (!speechSynthesis.current) return;
    
    setCompanionState(prev => ({ ...prev, isSpeaking: true }));
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;
    
    // Select appropriate voice
    const voices = speechSynthesis.current.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.includes('Female') || voice.name.includes('Samantha')
    );
    if (femaleVoice) utterance.voice = femaleVoice;
    
    utterance.onend = () => {
      setCompanionState(prev => ({ ...prev, isSpeaking: false }));
    };
    
    speechSynthesis.current.speak(utterance);
  };

  const startListening = () => {
    if (!speechRecognition.current) return;
    
    setCompanionState(prev => ({ ...prev, isListening: true }));
    speechRecognition.current.start();
  };

  const stopListening = () => {
    if (!speechRecognition.current) return;
    
    setCompanionState(prev => ({ ...prev, isListening: false }));
    speechRecognition.current.stop();
  };

  const getCompanionAvatar = () => {
    const { personality, emotionalTone } = companionState;
    
    if (emotionalTone === 'excited') return '🦉✨';
    if (emotionalTone === 'proud') return '🦉🏆';
    if (emotionalTone === 'concerned') return '🦉💙';
    return '🦉';
  };

  const getCompanionAnimation = () => {
    if (companionState.isSpeaking) return 'animate-pulse';
    if (companionState.isListening) return 'animate-bounce';
    if (currentEmotion?.engagement > 0.7) return 'animate-bounce-gentle';
    return '';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Main Companion Interface */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-4 shadow-2xl border border-white/20 max-w-sm">
        {/* Companion Avatar and Status */}
        <div className="flex items-center space-x-3 mb-4">
          <div className={`text-4xl ${getCompanionAnimation()}`}>
            {getCompanionAvatar()}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold">Athena</h3>
            <p className="text-indigo-200 text-sm">Your AI Learning Companion</p>
            {currentEmotion && (
              <div className="flex items-center space-x-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${
                  currentEmotion.engagement > 0.7 ? 'bg-green-400' :
                  currentEmotion.frustration > 0.6 ? 'bg-red-400' :
                  'bg-yellow-400'
                }`}></div>
                <span className="text-xs text-indigo-200">
                  {currentEmotion.engagement > 0.7 ? 'Engaged' :
                   currentEmotion.frustration > 0.6 ? 'Needs Support' :
                   'Learning'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={async () => {
              const explanation = await contentGenerator.generateExplanation(
                currentContext.topic,
                {
                  currentUnderstanding: 'needs_clarification',
                  learningStyle: 'mixed',
                  culturalBackground: 'general',
                  difficultyLevel: currentContext.difficulty
                }
              );
              onContentRequest?.(explanation);
              addMessage('athena', 'I\'ve created a personalized explanation for you!', 'explanation');
            }}
            className="flex items-center space-x-1 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm transition-colors"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Explain</span>
          </button>
          
          <button
            onClick={async () => {
              const quiz = await contentGenerator.generateQuiz(currentContext.topic, currentContext.difficulty);
              onContentRequest?.(quiz);
              addMessage('athena', 'Here\'s a practice quiz I made just for you!', 'suggestion');
            }}
            className="flex items-center space-x-1 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm transition-colors"
          >
            <Target className="w-4 h-4" />
            <span>Quiz</span>
          </button>
          
          <button
            onClick={() => {
              if (companionState.isListening) {
                stopListening();
              } else {
                startListening();
              }
            }}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors ${
              companionState.isListening 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            {companionState.isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{companionState.isListening ? 'Stop' : 'Voice'}</span>
          </button>
          
          <button
            onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors ${
              isVoiceEnabled 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>Audio</span>
          </button>
        </div>

        {/* Contextual Insights */}
        {currentEmotion && (
          <div className="bg-black/20 rounded-lg p-3 mb-4">
            <h4 className="text-white font-medium text-sm mb-2 flex items-center">
              <Brain className="w-4 h-4 mr-1" />
              Learning Insights
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-indigo-200">Engagement:</span>
                <div className="flex items-center space-x-1">
                  <div className="w-16 bg-white/20 rounded-full h-1">
                    <div 
                      className="bg-green-400 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${currentEmotion.engagement * 100}%` }}
                    />
                  </div>
                  <span className="text-white">{Math.round(currentEmotion.engagement * 100)}%</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-200">Confidence:</span>
                <div className="flex items-center space-x-1">
                  <div className="w-16 bg-white/20 rounded-full h-1">
                    <div 
                      className="bg-blue-400 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${currentEmotion.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-white">{Math.round(currentEmotion.confidence * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Messages */}
        <div className="bg-black/20 rounded-lg p-3 max-h-32 overflow-y-auto">
          {messages.slice(-3).map((message) => (
            <div key={message.id} className="mb-2 last:mb-0">
              <div className={`flex items-start space-x-2 ${
                message.sender === 'athena' ? 'justify-start' : 'justify-end'
              }`}>
                {message.sender === 'athena' && (
                  <span className="text-lg">🦉</span>
                )}
                <div className={`max-w-xs p-2 rounded-lg text-sm ${
                  message.sender === 'athena' 
                    ? 'bg-white/20 text-white' 
                    : 'bg-blue-500 text-white'
                }`}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Voice Input Display */}
        {companionState.isListening && (
          <div className="mt-3 bg-red-500/20 border border-red-400/30 rounded-lg p-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-red-200 text-sm">Listening...</span>
            </div>
            {voiceInput && (
              <p className="text-white text-sm mt-1">"{voiceInput}"</p>
            )}
          </div>
        )}

        {/* Companion Settings */}
        <div className="mt-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCompanionState(prev => ({ 
                ...prev, 
                emotionDetectionActive: !prev.emotionDetectionActive 
              }))}
              className={`p-1 rounded ${
                companionState.emotionDetectionActive 
                  ? 'bg-green-500/20 text-green-300' 
                  : 'bg-white/10 text-white/60'
              }`}
            >
              <Eye className="w-4 h-4" />
            </button>
            <span className="text-xs text-indigo-200">Emotion Detection</span>
          </div>
          
          <button className="p-1 rounded bg-white/10 text-white/60 hover:bg-white/20 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => {
          // Toggle companion visibility or expand/collapse
        }}
        className="mt-2 w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
};

export default AICompanion;