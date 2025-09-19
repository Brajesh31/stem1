import React, { useState, useEffect } from 'react';
import { Trophy, Star, Award, Target, Zap, BookOpen, Users, Crown } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'mastery' | 'progress' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  criteria: {
    type: string;
    target: number;
    current: number;
  };
  unlocked: boolean;
  unlockedAt?: string;
  rewards: {
    experience: number;
    crystals: number;
    sparks: number;
    title?: string;
  };
}

interface CareerPathway {
  id: string;
  title: string;
  description: string;
  icon: string;
  subjects: string[];
  skills: string[];
  realWorldApplications: string[];
  progress: number;
  nextMilestone: string;
}

const AchievementSystem: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [careerPathways, setCareerPathways] = useState<CareerPathway[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'mastery' | 'progress' | 'social' | 'special'>('all');
  const [showCareerPaths, setShowCareerPaths] = useState(false);

  useEffect(() => {
    loadAchievements();
    loadCareerPathways();
  }, []);

  const loadAchievements = () => {
    // Mock achievement data - in production, load from API/storage
    const mockAchievements: Achievement[] = [
      {
        id: '1',
        title: 'First Steps',
        description: 'Complete your first quest',
        icon: '🎯',
        category: 'progress',
        rarity: 'common',
        criteria: { type: 'quests_completed', target: 1, current: 1 },
        unlocked: true,
        unlockedAt: '2024-02-01',
        rewards: { experience: 50, crystals: 10, sparks: 5 }
      },
      {
        id: '2',
        title: 'Math Wizard',
        description: 'Master 10 mathematics concepts',
        icon: '🧙‍♂️',
        category: 'mastery',
        rarity: 'rare',
        criteria: { type: 'math_concepts_mastered', target: 10, current: 7 },
        unlocked: false,
        rewards: { experience: 200, crystals: 50, sparks: 25, title: 'Math Wizard' }
      },
      {
        id: '3',
        title: 'Science Explorer',
        description: 'Complete experiments in 3 different science subjects',
        icon: '🔬',
        category: 'mastery',
        rarity: 'epic',
        criteria: { type: 'science_subjects_explored', target: 3, current: 2 },
        unlocked: false,
        rewards: { experience: 300, crystals: 75, sparks: 40, title: 'Science Explorer' }
      },
      {
        id: '4',
        title: 'Team Player',
        description: 'Help 5 guild members with their quests',
        icon: '🤝',
        category: 'social',
        rarity: 'rare',
        criteria: { type: 'guild_help_count', target: 5, current: 3 },
        unlocked: false,
        rewards: { experience: 150, crystals: 30, sparks: 20 }
      },
      {
        id: '5',
        title: 'Streak Master',
        description: 'Maintain a 30-day learning streak',
        icon: '🔥',
        category: 'progress',
        rarity: 'epic',
        criteria: { type: 'learning_streak', target: 30, current: 12 },
        unlocked: false,
        rewards: { experience: 500, crystals: 100, sparks: 60, title: 'Dedicated Learner' }
      },
      {
        id: '6',
        title: 'Quantum Pioneer',
        description: 'Complete the quantum computing simulation',
        icon: '⚛️',
        category: 'special',
        rarity: 'legendary',
        criteria: { type: 'quantum_simulation_completed', target: 1, current: 0 },
        unlocked: false,
        rewards: { experience: 1000, crystals: 200, sparks: 100, title: 'Quantum Pioneer' }
      }
    ];

    setAchievements(mockAchievements);
  };

  const loadCareerPathways = () => {
    // Mock career pathway data
    const mockPathways: CareerPathway[] = [
      {
        id: '1',
        title: 'Software Engineer',
        description: 'Build applications and systems that power the digital world',
        icon: '💻',
        subjects: ['Mathematics', 'Physics', 'Computer Science'],
        skills: ['Programming', 'Problem Solving', 'Logic', 'Algorithms'],
        realWorldApplications: [
          'Mobile app development',
          'Web development',
          'Game development',
          'AI and machine learning'
        ],
        progress: 35,
        nextMilestone: 'Complete advanced algorithms quest'
      },
      {
        id: '2',
        title: 'Biomedical Engineer',
        description: 'Design medical devices and systems to improve healthcare',
        icon: '🏥',
        subjects: ['Biology', 'Chemistry', 'Physics', 'Mathematics'],
        skills: ['Biology', 'Engineering Design', 'Problem Solving', 'Research'],
        realWorldApplications: [
          'Prosthetic design',
          'Medical imaging systems',
          'Drug delivery systems',
          'Tissue engineering'
        ],
        progress: 20,
        nextMilestone: 'Master cellular biology concepts'
      },
      {
        id: '3',
        title: 'Environmental Scientist',
        description: 'Study and protect our environment for future generations',
        icon: '🌱',
        subjects: ['Biology', 'Chemistry', 'Geography', 'Mathematics'],
        skills: ['Research', 'Data Analysis', 'Environmental Science', 'Conservation'],
        realWorldApplications: [
          'Climate change research',
          'Pollution control',
          'Wildlife conservation',
          'Sustainable agriculture'
        ],
        progress: 45,
        nextMilestone: 'Complete ecosystem analysis project'
      },
      {
        id: '4',
        title: 'Data Scientist',
        description: 'Extract insights from data to solve complex problems',
        icon: '📊',
        subjects: ['Mathematics', 'Statistics', 'Computer Science'],
        skills: ['Statistics', 'Programming', 'Data Analysis', 'Machine Learning'],
        realWorldApplications: [
          'Business analytics',
          'Healthcare predictions',
          'Financial modeling',
          'Social media analysis'
        ],
        progress: 25,
        nextMilestone: 'Master statistical analysis'
      }
    ];

    setCareerPathways(mockPathways);
  };

  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-500/20';
      case 'rare': return 'border-blue-400 bg-blue-500/20';
      case 'epic': return 'border-purple-400 bg-purple-500/20';
      case 'legendary': return 'border-yellow-400 bg-yellow-500/20';
      default: return 'border-gray-400 bg-gray-500/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mastery': return <BookOpen className="w-4 h-4" />;
      case 'progress': return <Target className="w-4 h-4" />;
      case 'social': return <Users className="w-4 h-4" />;
      case 'special': return <Crown className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const filteredAchievements = achievements.filter(achievement => 
    selectedCategory === 'all' || achievement.category === selectedCategory
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {['all', 'mastery', 'progress', 'social', 'special'].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {getCategoryIcon(category)}
            <span className="capitalize">{category}</span>
          </button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`relative p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
              achievement.unlocked 
                ? `${getRarityColor(achievement.rarity)} shadow-lg`
                : 'border-gray-600 bg-gray-800/50 opacity-60'
            }`}
          >
            {/* Rarity Indicator */}
            <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${
              achievement.rarity === 'legendary' ? 'bg-yellow-500 text-black' :
              achievement.rarity === 'epic' ? 'bg-purple-500 text-white' :
              achievement.rarity === 'rare' ? 'bg-blue-500 text-white' :
              'bg-gray-500 text-white'
            }`}>
              {achievement.rarity.toUpperCase()}
            </div>

            {/* Achievement Icon */}
            <div className="text-6xl mb-4 text-center">
              {achievement.icon}
            </div>

            {/* Achievement Info */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-white mb-2">{achievement.title}</h3>
              <p className="text-white/70 text-sm">{achievement.description}</p>
            </div>

            {/* Progress Bar */}
            {!achievement.unlocked && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-white/60 mb-1">
                  <span>Progress</span>
                  <span>{achievement.criteria.current}/{achievement.criteria.target}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(achievement.criteria.current / achievement.criteria.target) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Rewards */}
            <div className="flex justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 text-green-300">
                <Zap className="w-4 h-4" />
                <span>{achievement.rewards.experience} XP</span>
              </div>
              <div className="flex items-center space-x-1 text-blue-300">
                <span>💎</span>
                <span>{achievement.rewards.crystals}</span>
              </div>
              <div className="flex items-center space-x-1 text-yellow-300">
                <Star className="w-4 h-4" />
                <span>{achievement.rewards.sparks}</span>
              </div>
            </div>

            {/* Special Title Reward */}
            {achievement.rewards.title && (
              <div className="mt-3 text-center">
                <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold rounded-full">
                  Title: {achievement.rewards.title}
                </span>
              </div>
            )}

            {/* Unlocked Date */}
            {achievement.unlocked && achievement.unlockedAt && (
              <div className="mt-3 text-center text-xs text-white/50">
                Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderCareerPathways = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Destiny Pathways</h2>
        <p className="text-white/70">Discover how your Spark mastery unlocks legendary career adventures</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {careerPathways.map((pathway) => (
          <div key={pathway.id} className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-4xl">{pathway.icon}</div>
              <div>
                <h3 className="text-xl font-bold text-white">{pathway.title}</h3>
                <p className="text-white/70 text-sm">{pathway.description}</p>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-white/70 mb-2">
                <span>Destiny Progress</span>
                <span>{pathway.progress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${pathway.progress}%` }}
                />
              </div>
              <p className="text-xs text-white/60 mt-1">Next Milestone: {pathway.nextMilestone}</p>
            </div>

            {/* Required Subjects */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-white mb-2">Essential Knowledge Realms</h4>
              <div className="flex flex-wrap gap-2">
                {pathway.subjects.map((subject) => (
                  <span key={subject} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-white mb-2">Legendary Abilities</h4>
              <div className="flex flex-wrap gap-2">
                {pathway.skills.map((skill) => (
                  <span key={skill} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Real-World Applications */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Epic World Challenges</h4>
              <ul className="space-y-1">
                {pathway.realWorldApplications.map((application, index) => (
                  <li key={index} className="text-xs text-white/70 flex items-center">
                    <div className="w-1 h-1 bg-green-400 rounded-full mr-2"></div>
                    {application}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <h1 className="text-3xl font-bold text-white">Trophy Hall & Destiny Paths</h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowCareerPaths(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 border ${
              !showCareerPaths
                ? 'bg-student-primary text-white border-white/20'
                : 'bg-white/10 text-white/70 hover:bg-white/20 border-white/10'
            }`}
          >
            Trophy Collection
          </button>
          <button
            onClick={() => setShowCareerPaths(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 border ${
              showCareerPaths
                ? 'bg-student-primary text-white border-white/20'
                : 'bg-white/10 text-white/70 hover:bg-white/20 border-white/10'
            }`}
          >
            Destiny Paths
          </button>
        </div>
      </div>

      {/* Content */}
      {showCareerPaths ? renderCareerPathways() : renderAchievements()}
    </div>
  );
};

export default AchievementSystem;