import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Target, 
  Trophy, 
  Star,
  Zap,
  Users,
  Map,
  Crown,
  Gem,
  Rocket,
  Brain,
  Heart,
  Eye,
  Gamepad2,
  Wand2
} from 'lucide-react';

interface LoadingPhase {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  color: string;
  duration: number;
  particles: string[];
}

interface EnhancedLoaderProps {
  onComplete: () => void;
}

const EnhancedLoader: React.FC<EnhancedLoaderProps> = ({ onComplete }) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: string; x: number; y: number; icon: string; delay: number }>>([]);

  const phases: LoadingPhase[] = [
    {
      id: 'spark',
      title: 'Igniting the Spark',
      subtitle: 'Awakening the learning universe...',
      icon: Sparkles,
      color: 'from-purple-500 to-blue-500',
      duration: 2000,
      particles: ['✨', '🌟', '💫', '⭐']
    },
    {
      id: 'curriculum',
      title: 'Loading Curriculum Matrix',
      subtitle: 'Preparing personalized learning paths...',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      duration: 1800,
      particles: ['📚', '📖', '📝', '🎓']
    },
    {
      id: 'quests',
      title: 'Forging Epic Quests',
      subtitle: 'Crafting adventures across all subjects...',
      icon: Map,
      color: 'from-green-500 to-emerald-500',
      duration: 1500,
      particles: ['🗺️', '🎯', '⚔️', '🏰']
    },
    {
      id: 'skills',
      title: 'Growing Knowledge Trees',
      subtitle: 'Nurturing wisdom across disciplines...',
      icon: Target,
      color: 'from-emerald-500 to-teal-500',
      duration: 1200,
      particles: ['🌱', '🌿', '🍃', '🌳']
    },
    {
      id: 'community',
      title: 'Connecting Learning Guilds',
      subtitle: 'Building bridges between minds...',
      icon: Users,
      color: 'from-orange-500 to-red-500',
      duration: 1000,
      particles: ['👥', '🤝', '💪', '🎭']
    },
    {
      id: 'ai',
      title: 'Awakening AI Companions',
      subtitle: 'Your personal learning guide is stirring...',
      icon: Brain,
      color: 'from-pink-500 to-purple-500',
      duration: 1500,
      particles: ['🧠', '🤖', '💭', '🔮']
    }
  ];

  useEffect(() => {
    if (currentPhase >= phases.length) {
      setIsComplete(true);
      setTimeout(() => {
        onComplete();
      }, 1000);
      return;
    }

    const phase = phases[currentPhase];
    
    // Generate particles for current phase
    generateParticles(phase);
    
    const interval = 50;
    const totalUpdates = phase.duration / interval;
    let updates = 0;

    const timer = setInterval(() => {
      updates++;
      const phaseProgress = (updates / totalUpdates) * 100;
      const overallProgress = ((currentPhase + phaseProgress / 100) / phases.length) * 100;
      
      setProgress(overallProgress);

      if (updates >= totalUpdates) {
        clearInterval(timer);
        setCurrentPhase(prev => prev + 1);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [currentPhase, phases, onComplete]);

  const generateParticles = (phase: LoadingPhase) => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: `${phase.id}_${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      icon: phase.particles[Math.floor(Math.random() * phase.particles.length)],
      delay: Math.random() * 2
    }));
    
    setParticles(newParticles);
  };

  const currentPhaseData = phases[currentPhase];

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
            <Rocket className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">🎉 Welcome to Project Spark! 🎉</h2>
          <p className="text-green-300 text-xl">Your learning odyssey begins now!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 pt-20 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute text-2xl animate-bounce opacity-60 pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: '3s'
            }}
          >
            {particle.icon}
          </div>
        ))}
      </div>

      <div className="text-center max-w-2xl w-full relative z-10">
        {/* Spark Logo Assembly Animation */}
        <div className="relative mb-8">
          <div className={`w-40 h-40 bg-gradient-to-br ${currentPhaseData?.color || 'from-purple-500 to-blue-500'} rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden transition-all duration-500 shadow-glow-strong`}>
            {currentPhaseData && <currentPhaseData.icon className="w-20 h-20 text-white animate-pulse" />}
            
            {/* Ripple Effects */}
            <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border-4 border-white/10 animate-ping" style={{ animationDelay: '0.5s' }}></div>
            
            {/* Rotating Ring */}
            <div className="absolute inset-4 border-2 border-white/30 rounded-full animate-spin" style={{ animationDuration: '4s' }}></div>
          </div>
        </div>

        {/* Dynamic Title */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-primary mb-4 animate-pulse">
            Project Spark
          </h1>
          <p className="text-xl text-secondary mb-2">Gamified Learning Odyssey</p>
          
          {currentPhaseData && (
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-primary">{currentPhaseData.title}</h2>
              <p className="text-secondary">{currentPhaseData.subtitle}</p>
            </div>
          )}
        </div>

        {/* Enhanced Progress Visualization */}
        <div className="mb-8">
          {/* Main Progress Bar */}
          <div className="w-full bg-tertiary rounded-full h-4 mb-4 overflow-hidden shadow-inner border border-primary/50">
            <div 
              className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 h-4 rounded-full transition-all duration-500 relative shadow-glow"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
              <div className="absolute right-0 top-0 h-full w-2 bg-white/60 animate-bounce"></div>
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-muted mb-4">
            <span>Phase {currentPhase + 1} of {phases.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>

          {/* Phase Indicators with Icons */}
          <div className="flex justify-center space-x-4">
            {phases.map((phase, index) => {
              const IconComponent = phase.icon;
              return (
                <div
                  key={phase.id}
                  className={`flex flex-col items-center space-y-2 transition-all duration-500 ${
                    index < currentPhase 
                      ? 'opacity-100 scale-100' 
                      : index === currentPhase 
                      ? 'opacity-100 scale-125' 
                      : 'opacity-40 scale-90'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border ${
                    index < currentPhase 
                      ? 'bg-success shadow-glow border-success' 
                      : index === currentPhase 
                      ? `bg-gradient-to-br ${phase.color} shadow-glow-strong animate-glow-pulse border-accent-interactive` 
                      : 'bg-tertiary border-primary'
                  }`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs text-muted text-center max-w-16">
                    {phase.title.split(' ')[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Loading Tips Carousel */}
        <div className="bg-secondary backdrop-blur-lg border border-primary rounded-xl p-6 mb-6 shadow-lg">
          <h3 className="text-primary font-semibold mb-3 flex items-center justify-center">
            <Star className="w-5 h-5 mr-2 text-warning" />
            Did You Know?
          </h3>
          <p className="text-secondary text-sm leading-relaxed">
            {currentPhase === 0 && "Project Spark adapts to your learning style using advanced AI, making every lesson personalized just for you!"}
            {currentPhase === 1 && "Our curriculum follows the official Indian education board standards while making learning fun and engaging!"}
            {currentPhase === 2 && "Each quest is designed by education experts to ensure you master real skills, not just complete tasks!"}
            {currentPhase === 3 && "Knowledge trees show the actual connections between concepts, helping you understand how everything fits together!"}
            {currentPhase === 4 && "Guild collaboration has been proven to increase learning retention by up to 40% compared to solo study!"}
            {currentPhase === 5 && "Your AI companion learns your preferences and provides personalized guidance throughout your journey!"}
          </p>
        </div>

        {/* Animated Loading Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-accent-interactive rounded-full animate-bounce shadow-glow"
              style={{ 
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-30">
          <div className="text-4xl animate-bounce" style={{ animationDuration: '3s' }}>🎮</div>
        </div>
        <div className="absolute top-32 right-16 opacity-30">
          <div className="text-4xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>🚀</div>
        </div>
        <div className="absolute bottom-20 left-20 opacity-30">
          <div className="text-4xl animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>🏆</div>
        </div>
        <div className="absolute bottom-32 right-10 opacity-30">
          <div className="text-4xl animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '1.5s' }}>⚡</div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLoader;