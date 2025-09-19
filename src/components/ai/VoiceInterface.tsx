import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Settings, Languages, Headphones, AudioWaveform as Waveform, Brain, MessageSquare } from 'lucide-react';

interface VoiceInterfaceProps {
  onCommand: (command: string, intent: string) => void;
  onTranscript: (text: string) => void;
  language?: string;
  enabled?: boolean;
}

interface VoiceCommand {
  pattern: RegExp;
  intent: string;
  action: string;
  examples: string[];
}

interface SpeechSettings {
  language: string;
  rate: number;
  pitch: number;
  volume: number;
  voice: string;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  onCommand,
  onTranscript,
  language = 'en-US',
  enabled = true
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [speechSettings, setSpeechSettings] = useState<SpeechSettings>({
    language: 'en-US',
    rate: 0.9,
    pitch: 1.0,
    volume: 0.8,
    voice: 'default'
  });
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Voice command patterns
  const voiceCommands: VoiceCommand[] = [
    {
      pattern: /go to (dashboard|home)/i,
      intent: 'navigation',
      action: 'navigate_dashboard',
      examples: ['Go to dashboard', 'Go to home']
    },
    {
      pattern: /open (quest|quests|quest board)/i,
      intent: 'navigation',
      action: 'navigate_quests',
      examples: ['Open quests', 'Open quest board']
    },
    {
      pattern: /show (skills|skill tree|knowledge tree)/i,
      intent: 'navigation',
      action: 'navigate_skills',
      examples: ['Show skills', 'Show skill tree']
    },
    {
      pattern: /explain (.*)/i,
      intent: 'learning_assistance',
      action: 'explain_concept',
      examples: ['Explain photosynthesis', 'Explain gravity']
    },
    {
      pattern: /(help|assistance|stuck)/i,
      intent: 'support',
      action: 'provide_help',
      examples: ['Help', 'I need assistance', 'I\'m stuck']
    },
    {
      pattern: /create (quiz|test|practice)/i,
      intent: 'content_generation',
      action: 'generate_quiz',
      examples: ['Create quiz', 'Create test', 'Create practice']
    },
    {
      pattern: /start (.*) quest/i,
      intent: 'quest_management',
      action: 'start_quest',
      examples: ['Start physics quest', 'Start math quest']
    },
    {
      pattern: /(pause|stop|break)/i,
      intent: 'session_control',
      action: 'pause_session',
      examples: ['Pause', 'Stop', 'Take a break']
    },
    {
      pattern: /translate (.*)/i,
      intent: 'translation',
      action: 'translate_text',
      examples: ['Translate this', 'Translate to Hindi']
    },
    {
      pattern: /repeat|say again/i,
      intent: 'clarification',
      action: 'repeat_last',
      examples: ['Repeat', 'Say again']
    }
  ];

  useEffect(() => {
    initializeVoiceServices();
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (enabled && !isListening) {
      // Auto-start listening when enabled
      startListening();
    } else if (!enabled && isListening) {
      stopListening();
    }
  }, [enabled]);

  const initializeVoiceServices = async () => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = speechSettings.language;
      recognitionRef.current.maxAlternatives = 3;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;

          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            setConfidence(confidence);
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = finalTranscript || interimTranscript;
        setCurrentTranscript(fullTranscript);
        onTranscript(fullTranscript);

        if (finalTranscript) {
          processVoiceCommand(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        // Auto-restart if still enabled
        if (enabled) {
          setTimeout(() => startListening(), 1000);
        }
      };
    }

    // Initialize Speech Synthesis
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
      
      // Load available voices
      const loadVoices = () => {
        const voices = synthesisRef.current?.getVoices() || [];
        setAvailableVoices(voices);
      };
      
      loadVoices();
      synthesisRef.current.onvoiceschanged = loadVoices;
    }

    // Initialize Audio Context for advanced audio analysis
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
    } catch (error) {
      console.error('Audio context initialization failed:', error);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current || isListening) return;
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current || !isListening) return;
    
    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error('Failed to stop speech recognition:', error);
    }
  };

  const processVoiceCommand = (transcript: string) => {
    const cleanTranscript = transcript.trim().toLowerCase();
    
    // Find matching command pattern
    for (const command of voiceCommands) {
      const match = cleanTranscript.match(command.pattern);
      if (match) {
        onCommand(cleanTranscript, command.intent);
        
        // Provide voice feedback
        const responses = [
          'Got it!',
          'On it!',
          'Right away!',
          'Processing your request!'
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        speak(response);
        
        return;
      }
    }
    
    // If no command matched, treat as general query
    onCommand(cleanTranscript, 'general_query');
  };

  const speak = (text: string, options?: Partial<SpeechSettings>) => {
    if (!synthesisRef.current) return;
    
    // Stop any current speech
    synthesisRef.current.cancel();
    
    setIsSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options?.language || speechSettings.language;
    utterance.rate = options?.rate || speechSettings.rate;
    utterance.pitch = options?.pitch || speechSettings.pitch;
    utterance.volume = options?.volume || speechSettings.volume;
    
    // Select appropriate voice
    if (speechSettings.voice !== 'default') {
      const selectedVoice = availableVoices.find(voice => voice.name === speechSettings.voice);
      if (selectedVoice) utterance.voice = selectedVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthesisRef.current.speak(utterance);
  };

  const getAudioVisualization = () => {
    if (!analyserRef.current) return [];
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Convert to visualization data
    const visualization = [];
    for (let i = 0; i < 20; i++) {
      const value = dataArray[i * Math.floor(bufferLength / 20)] / 255;
      visualization.push(value);
    }
    
    return visualization;
  };

  const cleanup = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const renderVoiceSettings = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Voice Settings</h2>
          <button
            onClick={() => setShowSettings(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            <select
              value={speechSettings.language}
              onChange={(e) => setSpeechSettings(prev => ({ ...prev, language: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="hi-IN">Hindi</option>
              <option value="bn-IN">Bengali</option>
              <option value="te-IN">Telugu</option>
              <option value="ta-IN">Tamil</option>
            </select>
          </div>

          {/* Voice Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Voice
            </label>
            <select
              value={speechSettings.voice}
              onChange={(e) => setSpeechSettings(prev => ({ ...prev, voice: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="default">Default</option>
              {availableVoices
                .filter(voice => voice.lang.startsWith(speechSettings.language.split('-')[0]))
                .map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
            </select>
          </div>

          {/* Speech Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Speech Rate: {speechSettings.rate}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={speechSettings.rate}
              onChange={(e) => setSpeechSettings(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
              className="w-full"
            />
          </div>

          {/* Volume */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Volume: {Math.round(speechSettings.volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={speechSettings.volume}
              onChange={(e) => setSpeechSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
              className="w-full"
            />
          </div>

          {/* Test Voice */}
          <button
            onClick={() => speak('Hello! This is how I sound with your current settings.')}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition-colors"
          >
            Test Voice
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {/* Main Voice Interface */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-4 shadow-2xl border border-white/20 max-w-sm">
        {/* Voice Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Voice AI</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              isListening ? 'bg-green-400 animate-pulse' : 
              isSpeaking ? 'bg-blue-400 animate-pulse' : 
              'bg-gray-400'
            }`}></div>
            <span className="text-white/70 text-xs">
              {isListening ? 'Listening' : isSpeaking ? 'Speaking' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Audio Visualization */}
        {(isListening || isSpeaking) && (
          <div className="mb-4">
            <div className="flex items-center justify-center space-x-1 h-8">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-white/60 rounded-full transition-all duration-150"
                  style={{
                    height: `${Math.random() * 100 + 20}%`,
                    animationDelay: `${i * 50}ms`
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Current Transcript */}
        {currentTranscript && (
          <div className="mb-4 bg-black/20 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <MessageSquare className="w-4 h-4 text-blue-300" />
              <span className="text-blue-300 text-sm font-medium">You said:</span>
            </div>
            <p className="text-white text-sm">"{currentTranscript}"</p>
            {confidence > 0 && (
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-white/60 text-xs">Confidence:</span>
                <div className="flex-1 bg-white/20 rounded-full h-1">
                  <div 
                    className="bg-green-400 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${confidence * 100}%` }}
                  />
                </div>
                <span className="text-white/60 text-xs">{Math.round(confidence * 100)}%</span>
              </div>
            )}
          </div>
        )}

        {/* Voice Commands Help */}
        <div className="mb-4 bg-black/20 rounded-lg p-3">
          <h4 className="text-white font-medium text-sm mb-2">Try saying:</h4>
          <div className="space-y-1 text-xs text-white/70">
            <p>"Go to dashboard"</p>
            <p>"Explain photosynthesis"</p>
            <p>"Create a quiz"</p>
            <p>"I need help"</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex space-x-2">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg font-medium transition-all duration-200 ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isListening ? 'Stop' : 'Listen'}</span>
          </button>
          
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Language Indicator */}
        <div className="mt-3 flex items-center justify-center space-x-2 text-xs text-white/60">
          <Languages className="w-3 h-3" />
          <span>{speechSettings.language}</span>
        </div>
      </div>

      {/* Voice Settings Modal */}
      {showSettings && renderVoiceSettings()}
    </div>
  );
};

export default VoiceInterface;