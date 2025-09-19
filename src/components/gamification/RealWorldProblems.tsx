import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Building, 
  Leaf, 
  Heart, 
  Users, 
  Target, 
  Clock,
  Award,
  MapPin,
  TrendingUp
} from 'lucide-react';
import { useAppDispatch } from '../../store';
import { addNotification } from '../../store/slices/uiSlice';

interface RealWorldScenario {
  id: string;
  title: string;
  description: string;
  category: 'agriculture' | 'business' | 'environment' | 'health' | 'community';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  participants: number;
  maxParticipants: number;
  location: string;
  skills: string[];
  realWorldImpact: string;
  progress: number;
  phases: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    tasks: string[];
  }[];
  collaborators: {
    id: string;
    name: string;
    role: string;
    avatar: string;
  }[];
  rewards: {
    experience: number;
    crystals: number;
    sparks: number;
    communityImpact: number;
  };
}

const RealWorldProblems: React.FC = () => {
  const [scenarios, setScenarios] = useState<RealWorldScenario[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'agriculture' | 'business' | 'environment' | 'health' | 'community'>('all');
  const [activeScenario, setActiveScenario] = useState<RealWorldScenario | null>(null);

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = () => {
    // Mock real-world scenario data
    const mockScenarios: RealWorldScenario[] = [
      {
        id: '1',
        title: 'Smart Irrigation System for Local Farms',
        description: 'Design and implement an IoT-based irrigation system to help local farmers optimize water usage and increase crop yield.',
        category: 'agriculture',
        difficulty: 'intermediate',
        estimatedTime: 120, // minutes
        participants: 3,
        maxParticipants: 6,
        location: 'Rural Maharashtra',
        skills: ['IoT', 'Data Analysis', 'Agriculture Science', 'Programming'],
        realWorldImpact: 'Help 50+ farmers save 30% water and increase crop yield by 20%',
        progress: 45,
        phases: [
          {
            id: '1',
            title: 'Research & Planning',
            description: 'Study local farming practices and water usage patterns',
            completed: true,
            tasks: ['Interview local farmers', 'Analyze soil conditions', 'Research irrigation methods']
          },
          {
            id: '2',
            title: 'System Design',
            description: 'Design the IoT sensor network and control system',
            completed: true,
            tasks: ['Design sensor placement', 'Create system architecture', 'Plan data collection']
          },
          {
            id: '3',
            title: 'Prototype Development',
            description: 'Build and test the irrigation control system',
            completed: false,
            tasks: ['Build sensor nodes', 'Develop control software', 'Test system reliability']
          },
          {
            id: '4',
            title: 'Field Testing',
            description: 'Deploy and test the system in real farm conditions',
            completed: false,
            tasks: ['Install system on test farm', 'Monitor performance', 'Gather farmer feedback']
          }
        ],
        collaborators: [
          { id: '1', name: 'Priya Sharma', role: 'Agriculture Expert', avatar: '👩‍🌾' },
          { id: '2', name: 'Raj Patel', role: 'IoT Developer', avatar: '👨‍💻' },
          { id: '3', name: 'Anita Kumar', role: 'Data Analyst', avatar: '👩‍🔬' }
        ],
        rewards: {
          experience: 500,
          crystals: 100,
          sparks: 75,
          communityImpact: 85
        }
      },
      {
        id: '2',
        title: 'Village Solar Microgrid Planning',
        description: 'Design a sustainable solar power system for a rural village to provide reliable electricity for homes and schools.',
        category: 'environment',
        difficulty: 'advanced',
        estimatedTime: 180,
        participants: 2,
        maxParticipants: 5,
        location: 'Rural Rajasthan',
        skills: ['Renewable Energy', 'Electrical Engineering', 'Project Management', 'Community Planning'],
        realWorldImpact: 'Provide clean electricity to 200+ households and 3 schools',
        progress: 20,
        phases: [
          {
            id: '1',
            title: 'Energy Assessment',
            description: 'Calculate village energy needs and solar potential',
            completed: true,
            tasks: ['Survey household energy usage', 'Measure solar irradiance', 'Assess grid connection options']
          },
          {
            id: '2',
            title: 'System Design',
            description: 'Design the solar panel array and distribution system',
            completed: false,
            tasks: ['Size solar array', 'Design distribution network', 'Plan battery storage']
          },
          {
            id: '3',
            title: 'Economic Analysis',
            description: 'Calculate costs, savings, and financing options',
            completed: false,
            tasks: ['Calculate system costs', 'Analyze payback period', 'Explore funding sources']
          },
          {
            id: '4',
            title: 'Implementation Plan',
            description: 'Create detailed installation and maintenance plan',
            completed: false,
            tasks: ['Create installation timeline', 'Train local technicians', 'Establish maintenance schedule']
          }
        ],
        collaborators: [
          { id: '1', name: 'Vikram Singh', role: 'Electrical Engineer', avatar: '👨‍🔧' },
          { id: '2', name: 'Meera Joshi', role: 'Environmental Scientist', avatar: '👩‍🔬' }
        ],
        rewards: {
          experience: 750,
          crystals: 150,
          sparks: 100,
          communityImpact: 95
        }
      },
      {
        id: '3',
        title: 'Mobile Health Clinic App',
        description: 'Develop a mobile app to help rural health workers track patient data and connect with doctors remotely.',
        category: 'health',
        difficulty: 'intermediate',
        estimatedTime: 90,
        participants: 4,
        maxParticipants: 6,
        location: 'Rural Tamil Nadu',
        skills: ['Mobile Development', 'Healthcare IT', 'User Experience', 'Data Security'],
        realWorldImpact: 'Improve healthcare access for 1000+ rural patients',
        progress: 60,
        phases: [
          {
            id: '1',
            title: 'Requirements Gathering',
            description: 'Understand health worker needs and patient data requirements',
            completed: true,
            tasks: ['Interview health workers', 'Study patient data flow', 'Identify key features']
          },
          {
            id: '2',
            title: 'App Design',
            description: 'Design user interface and data management system',
            completed: true,
            tasks: ['Create user interface mockups', 'Design database schema', 'Plan offline functionality']
          },
          {
            id: '3',
            title: 'Development',
            description: 'Build the mobile application with core features',
            completed: true,
            tasks: ['Develop patient registration', 'Build data sync system', 'Implement security features']
          },
          {
            id: '4',
            title: 'Testing & Deployment',
            description: 'Test with real health workers and deploy to clinics',
            completed: false,
            tasks: ['Conduct user testing', 'Fix bugs and issues', 'Train health workers']
          }
        ],
        collaborators: [
          { id: '1', name: 'Dr. Lakshmi Nair', role: 'Healthcare Expert', avatar: '👩‍⚕️' },
          { id: '2', name: 'Arjun Reddy', role: 'Mobile Developer', avatar: '👨‍💻' },
          { id: '3', name: 'Kavya Menon', role: 'UX Designer', avatar: '👩‍🎨' },
          { id: '4', name: 'Suresh Kumar', role: 'Data Security Expert', avatar: '👨‍🔒' }
        ],
        rewards: {
          experience: 600,
          crystals: 120,
          sparks: 80,
          communityImpact: 90
        }
      },
      {
        id: '4',
        title: 'Local Market Price Prediction System',
        description: 'Create an AI system to predict crop prices in local markets to help farmers make better selling decisions.',
        category: 'business',
        difficulty: 'advanced',
        estimatedTime: 150,
        participants: 1,
        maxParticipants: 4,
        location: 'Rural Punjab',
        skills: ['Machine Learning', 'Data Analysis', 'Market Research', 'Agricultural Economics'],
        realWorldImpact: 'Help farmers increase income by 15% through better pricing decisions',
        progress: 10,
        phases: [
          {
            id: '1',
            title: 'Data Collection',
            description: 'Gather historical price data and market factors',
            completed: false,
            tasks: ['Collect price history', 'Identify market factors', 'Gather weather data']
          },
          {
            id: '2',
            title: 'Model Development',
            description: 'Build and train price prediction models',
            completed: false,
            tasks: ['Prepare training data', 'Build ML models', 'Validate predictions']
          },
          {
            id: '3',
            title: 'System Integration',
            description: 'Create user-friendly interface for farmers',
            completed: false,
            tasks: ['Design farmer interface', 'Integrate with SMS', 'Add local language support']
          },
          {
            id: '4',
            title: 'Pilot Testing',
            description: 'Test system with local farmer groups',
            completed: false,
            tasks: ['Deploy pilot system', 'Train farmer groups', 'Measure impact on income']
          }
        ],
        collaborators: [
          { id: '1', name: 'Harpreet Singh', role: 'Agricultural Economist', avatar: '👨‍🌾' }
        ],
        rewards: {
          experience: 800,
          crystals: 160,
          sparks: 120,
          communityImpact: 88
        }
      }
    ];

    setScenarios(mockScenarios);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'agriculture': return <Sprout className="w-5 h-5" />;
      case 'business': return <Building className="w-5 h-5" />;
      case 'environment': return <Leaf className="w-5 h-5" />;
      case 'health': return <Heart className="w-5 h-5" />;
      case 'community': return <Users className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'agriculture': return 'text-green-400 bg-green-500/20 border-green-400/30';
      case 'business': return 'text-blue-400 bg-blue-500/20 border-blue-400/30';
      case 'environment': return 'text-emerald-400 bg-emerald-500/20 border-emerald-400/30';
      case 'health': return 'text-red-400 bg-red-500/20 border-red-400/30';
      case 'community': return 'text-purple-400 bg-purple-500/20 border-purple-400/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-400/30';
    }
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-500/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/20';
      case 'advanced': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const filteredScenarios = scenarios.filter(scenario => 
    selectedCategory === 'all' || scenario.category === selectedCategory
  );

  const joinScenario = (scenarioId: string) => {
    // Show confirmation modal
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) return;
    
    const confirmed = window.confirm(`Join "${scenario.title}"? This will add you to the project team.`);
    if (!confirmed) return;
    
    setScenarios(prev => prev.map(scenario => 
      scenario.id === scenarioId 
        ? { ...scenario, participants: scenario.participants + 1 }
        : scenario
    ));
    
    // Show success notification
    dispatch(addNotification({
      type: 'success',
      title: 'Project Joined!',
      message: `You've successfully joined "${scenario?.title}". Check your project dashboard for next steps.`
    }));
  };

  const renderScenarioCard = (scenario: RealWorldScenario) => (
    <div key={scenario.id} className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getCategoryColor(scenario.category)}`}>
            {getCategoryIcon(scenario.category)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{scenario.title}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(scenario.difficulty)}`}>
                {scenario.difficulty}
              </span>
              <div className="flex items-center space-x-1 text-white/60 text-xs">
                <MapPin className="w-3 h-3" />
                <span>{scenario.location}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-white/60">Impact Score</div>
          <div className="text-xl font-bold text-green-400">{scenario.rewards.communityImpact}</div>
        </div>
      </div>

      {/* Description */}
      <p className="text-white/70 text-sm mb-4">{scenario.description}</p>

      {/* Real World Impact */}
      <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-3 mb-4">
        <div className="flex items-center space-x-2 mb-1">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span className="text-green-300 font-medium text-sm">Real-World Impact</span>
        </div>
        <p className="text-green-200 text-xs">{scenario.realWorldImpact}</p>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-white/70 mb-2">
          <span>Project Progress</span>
          <span>{scenario.progress}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${scenario.progress}%` }}
          />
        </div>
      </div>

      {/* Skills Required */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-white mb-2">Skills Required</h4>
        <div className="flex flex-wrap gap-2">
          {scenario.skills.map((skill) => (
            <span key={skill} className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Collaborators */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-white">Team</h4>
          <span className="text-xs text-white/60">
            {scenario.participants}/{scenario.maxParticipants} members
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {scenario.collaborators.map((collaborator) => (
            <div key={collaborator.id} className="flex items-center space-x-1">
              <span className="text-lg">{collaborator.avatar}</span>
              <div className="text-xs">
                <div className="text-white/80">{collaborator.name}</div>
                <div className="text-white/50">{collaborator.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time and Rewards */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-white/60">
            <Clock className="w-4 h-4" />
            <span>{scenario.estimatedTime} min</span>
          </div>
          <div className="flex items-center space-x-1 text-green-300">
            <Award className="w-4 h-4" />
            <span>{scenario.rewards.experience} XP</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={() => setActiveScenario(scenario)}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-500 hover:to-purple-500 transition-all duration-200"
        >
          View Details
        </button>
        <button
          onClick={() => joinScenario(scenario.id)}
          disabled={scenario.participants >= scenario.maxParticipants}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Join Project
        </button>
      </div>
    </div>
  );

  const renderScenarioDetails = () => {
    if (!activeScenario) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">{activeScenario.title}</h2>
            <button
              onClick={() => setActiveScenario(null)}
              className="text-white/60 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Project Phases */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Project Phases</h3>
            {activeScenario.phases.map((phase, index) => (
              <div key={phase.id} className={`border rounded-lg p-4 ${
                phase.completed 
                  ? 'border-green-400/30 bg-green-500/10' 
                  : 'border-white/20 bg-white/5'
              }`}>
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    phase.completed 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white/20 text-white/70'
                  }`}>
                    {index + 1}
                  </div>
                  <h4 className="font-semibold text-white">{phase.title}</h4>
                </div>
                <p className="text-white/70 text-sm mb-3 ml-11">{phase.description}</p>
                <div className="ml-11">
                  <h5 className="text-sm font-medium text-white mb-2">Tasks:</h5>
                  <ul className="space-y-1">
                    {phase.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="text-xs text-white/60 flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          phase.completed ? 'bg-green-400' : 'bg-white/40'
                        }`}></div>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setActiveScenario(null)}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                joinScenario(activeScenario.id);
                setActiveScenario(null);
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-200"
            >
              Join This Project
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Target className="w-8 h-8 text-orange-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">World Challenge Quests</h1>
            <p className="text-orange-300">Apply your Spark powers to solve epic community challenges</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {['all', 'agriculture', 'business', 'environment', 'health', 'community'].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-orange-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {getCategoryIcon(category)}
            <span className="capitalize">{category}</span>
          </button>
        ))}
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredScenarios.map(renderScenarioCard)}
      </div>

      {/* Scenario Details Modal */}
      {renderScenarioDetails()}
    </div>
  );
};

export default RealWorldProblems;