import React, { useState, useEffect } from 'react';
import { Brain, Target, TrendingUp, Clock, Lightbulb, Award, Calendar, BarChart3 } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  progress: number;
  estimatedTime: number;
  difficulty: 'adaptive' | 'challenging' | 'supportive';
  nextActivity: {
    type: 'concept' | 'practice' | 'assessment' | 'review';
    title: string;
    subject: string;
    estimatedTime: number;
  };
}

interface CompetencyArea {
  subject: string;
  mastery: number;
  trend: 'improving' | 'stable' | 'declining';
  weakAreas: string[];
  strongAreas: string[];
  recommendedFocus: string;
}

interface RevisionSchedule {
  date: string;
  topics: {
    subject: string;
    topic: string;
    priority: 'high' | 'medium' | 'low';
    estimatedTime: number;
  }[];
}

const PersonalizedLearning: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'path' | 'competency' | 'revision' | 'recommendations'>('path');
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [competencyAreas, setCompetencyAreas] = useState<CompetencyArea[]>([]);
  const [revisionSchedule, setRevisionSchedule] = useState<RevisionSchedule[]>([]);

  useEffect(() => {
    loadPersonalizedData();
  }, []);

  const loadPersonalizedData = async () => {
    // Simulate AI-generated personalized learning data
    const mockPaths: LearningPath[] = [
      {
        id: '1',
        title: 'Physics Mastery Track',
        description: 'Personalized path focusing on your physics learning goals with adaptive difficulty',
        progress: 65,
        estimatedTime: 120,
        difficulty: 'adaptive',
        nextActivity: {
          type: 'concept',
          title: 'Wave Properties Deep Dive',
          subject: 'Physics',
          estimatedTime: 25
        }
      },
      {
        id: '2',
        title: 'Mathematics Acceleration',
        description: 'Advanced track designed to challenge your strong mathematical abilities',
        progress: 80,
        estimatedTime: 90,
        difficulty: 'challenging',
        nextActivity: {
          type: 'practice',
          title: 'Complex Number Applications',
          subject: 'Mathematics',
          estimatedTime: 30
        }
      },
      {
        id: '3',
        title: 'Chemistry Foundation Builder',
        description: 'Supportive path with extra scaffolding for chemistry concepts',
        progress: 45,
        estimatedTime: 150,
        difficulty: 'supportive',
        nextActivity: {
          type: 'review',
          title: 'Atomic Structure Reinforcement',
          subject: 'Chemistry',
          estimatedTime: 20
        }
      }
    ];

    const mockCompetency: CompetencyArea[] = [
      {
        subject: 'Mathematics',
        mastery: 85,
        trend: 'improving',
        weakAreas: ['Complex Numbers', 'Trigonometric Identities'],
        strongAreas: ['Algebra', 'Geometry', 'Calculus Basics'],
        recommendedFocus: 'Advanced problem-solving techniques'
      },
      {
        subject: 'Physics',
        mastery: 72,
        trend: 'stable',
        weakAreas: ['Quantum Mechanics', 'Electromagnetic Waves'],
        strongAreas: ['Mechanics', 'Thermodynamics'],
        recommendedFocus: 'Mathematical applications in physics'
      },
      {
        subject: 'Chemistry',
        mastery: 58,
        trend: 'improving',
        weakAreas: ['Organic Chemistry', 'Chemical Kinetics'],
        strongAreas: ['Atomic Structure', 'Periodic Table'],
        recommendedFocus: 'Conceptual understanding before memorization'
      }
    ];

    const mockRevision: RevisionSchedule[] = [
      {
        date: '2024-02-16',
        topics: [
          { subject: 'Physics', topic: 'Wave Motion', priority: 'high', estimatedTime: 30 },
          { subject: 'Mathematics', topic: 'Derivatives', priority: 'medium', estimatedTime: 20 },
          { subject: 'Chemistry', topic: 'Atomic Structure', priority: 'low', estimatedTime: 15 }
        ]
      },
      {
        date: '2024-02-18',
        topics: [
          { subject: 'Mathematics', topic: 'Integration', priority: 'high', estimatedTime: 35 },
          { subject: 'Physics', topic: 'Electromagnetic Induction', priority: 'medium', estimatedTime: 25 }
        ]
      }
    ];

    setLearningPaths(mockPaths);
    setCompetencyAreas(mockCompetency);
    setRevisionSchedule(mockRevision);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'challenging': return 'text-red-400 bg-red-500/20';
      case 'adaptive': return 'text-blue-400 bg-blue-500/20';
      case 'supportive': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-400';
      case 'declining': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-400/30 bg-red-500/10';
      case 'medium': return 'border-yellow-400/30 bg-yellow-500/10';
      default: return 'border-blue-400/30 bg-blue-500/10';
    }
  };

  const renderLearningPaths = () => (
    <div className="space-y-6">
      {learningPaths.map((path) => (
        <Card key={path.id} className="hover:transform hover:scale-105 transition-all duration-300">
          <CardBody className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">{path.title}</h3>
                <p className="text-white/70 text-sm mb-3">{path.description}</p>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(path.difficulty)}`}>
                  <Brain className="w-4 h-4 mr-1" />
                  {path.difficulty.charAt(0).toUpperCase() + path.difficulty.slice(1)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{path.progress}%</div>
                <div className="text-white/60 text-sm">Complete</div>
              </div>
            </div>

            <ProgressBar
              value={path.progress}
              label="Path Progress"
              showPercentage
              variant="primary"
              size="sm"
              className="mb-4"
            />

            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-white mb-2 flex items-center">
                <Target className="w-4 h-4 mr-2 text-blue-400" />
                Next Recommended Activity
              </h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80">{path.nextActivity.title}</p>
                  <p className="text-white/60 text-sm">{path.nextActivity.subject} • {path.nextActivity.estimatedTime} min</p>
                </div>
                <Badge variant="primary">{path.nextActivity.type}</Badge>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="primary" className="flex-1">
                Continue Learning
              </Button>
              <Button variant="secondary">
                Adjust Path
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );

  const renderCompetency = () => (
    <div className="space-y-6">
      {competencyAreas.map((area) => (
        <Card key={area.subject}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{area.subject}</h3>
              <div className="flex items-center space-x-2">
                <TrendingUp className={`w-5 h-5 ${getTrendColor(area.trend)}`} />
                <span className={`text-sm font-medium ${getTrendColor(area.trend)}`}>
                  {area.trend.charAt(0).toUpperCase() + area.trend.slice(1)}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/70">Overall Mastery</span>
                <span className="text-white">{area.mastery}%</span>
              </div>
              <ProgressBar
                value={area.mastery}
                variant={area.mastery >= 80 ? 'success' : area.mastery >= 60 ? 'warning' : 'danger'}
                size="sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-white mb-2 flex items-center">
                  <Award className="w-4 h-4 mr-2 text-green-400" />
                  Strong Areas
                </h4>
                <div className="space-y-1">
                  {area.strongAreas.map((strength, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-300 text-sm">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-2 text-orange-400" />
                  Focus Areas
                </h4>
                <div className="space-y-1">
                  {area.weakAreas.map((weakness, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span className="text-orange-300 text-sm">{weakness}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3">
              <h4 className="font-medium text-blue-300 mb-1 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2" />
                AI Recommendation
              </h4>
              <p className="text-blue-200 text-sm">{area.recommendedFocus}</p>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );

  const renderRevision = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-purple-400" />
            AI-Optimized Revision Schedule
          </h3>
        </CardHeader>
        <CardBody className="space-y-4">
          {revisionSchedule.map((schedule, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-white">
                  {new Date(schedule.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h4>
                <Badge variant="info">
                  {schedule.topics.reduce((sum, topic) => sum + topic.estimatedTime, 0)} min total
                </Badge>
              </div>

              <div className="space-y-3">
                {schedule.topics.map((topic, topicIndex) => (
                  <div key={topicIndex} className={`p-3 rounded-lg border ${getPriorityColor(topic.priority)}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-white">{topic.topic}</h5>
                        <p className="text-white/70 text-sm">{topic.subject}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={topic.priority === 'high' ? 'danger' : topic.priority === 'medium' ? 'warning' : 'info'}>
                          {topic.priority.toUpperCase()}
                        </Badge>
                        <p className="text-white/60 text-xs mt-1">{topic.estimatedTime} min</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-4">
                <Button variant="primary" size="sm">
                  Start Revision Session
                </Button>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );

  const renderRecommendations = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-400" />
            AI Learning Recommendations
          </h3>
        </CardHeader>
        <CardBody className="space-y-4">
          {[
            {
              type: 'remedial',
              title: 'Chemistry Concept Review',
              description: 'Based on your recent quiz performance, reviewing atomic structure concepts would be beneficial',
              priority: 'high',
              estimatedTime: 30,
              action: 'Start Review'
            },
            {
              type: 'advanced',
              title: 'Advanced Physics Challenge',
              description: 'You\'re excelling in mechanics! Ready for quantum physics introduction?',
              priority: 'medium',
              estimatedTime: 45,
              action: 'Accept Challenge'
            },
            {
              type: 'collaborative',
              title: 'Math Study Group',
              description: 'Join a study group for calculus - your teaching skills could help others',
              priority: 'low',
              estimatedTime: 60,
              action: 'Join Group'
            }
          ].map((rec, index) => (
            <div key={index} className={`p-4 rounded-lg border ${
              rec.priority === 'high' ? 'border-red-400/30 bg-red-500/10' :
              rec.priority === 'medium' ? 'border-yellow-400/30 bg-yellow-500/10' :
              'border-blue-400/30 bg-blue-500/10'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">{rec.title}</h4>
                  <p className="text-white/70 text-sm">{rec.description}</p>
                </div>
                <Badge variant={rec.priority === 'high' ? 'danger' : rec.priority === 'medium' ? 'warning' : 'info'}>
                  {rec.priority.toUpperCase()}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-white/60">
                  <Clock className="w-4 h-4" />
                  <span>{rec.estimatedTime} minutes</span>
                </div>
                <Button variant="primary" size="sm">
                  {rec.action}
                </Button>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-purple-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Personalized Learning</h1>
            <p className="text-purple-300">AI-powered adaptive learning experience</p>
          </div>
        </div>
        <Badge variant="primary">AI Powered</Badge>
      </div>

      {/* Navigation */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-1">
        <div className="flex space-x-1">
          {[
            { id: 'path', label: 'Learning Paths', icon: Target },
            { id: 'competency', label: 'Competency Map', icon: BarChart3 },
            { id: 'revision', label: 'Revision Schedule', icon: Calendar },
            { id: 'recommendations', label: 'AI Recommendations', icon: Lightbulb }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'path' && renderLearningPaths()}
      {activeTab === 'competency' && renderCompetency()}
      {activeTab === 'revision' && renderRevision()}
      {activeTab === 'recommendations' && renderRecommendations()}
    </div>
  );
};

export default PersonalizedLearning;