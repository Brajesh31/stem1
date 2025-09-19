import React, { useState } from 'react';
import { Cuboid as Cube, Eye, MapPin, Briefcase, Play, Settings, BarChart3, Users, Clock, Target } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';

interface ImmersiveModule {
  id: string;
  title: string;
  type: 'VR_LAB' | 'AR_EXPLORATION' | 'SIMULATION' | 'GEOSPATIAL';
  subject: string;
  description: string;
  participants: number;
  duration: number;
  status: 'draft' | 'active' | 'completed';
  learningObjectives: string[];
  assessmentCriteria: string[];
}

interface CareerSuggestion {
  studentId: string;
  studentName: string;
  suggestedCareers: {
    title: string;
    match: number;
    reasoning: string;
    requiredSubjects: string[];
    examPrep: string[];
  }[];
  lastUpdated: string;
}

const AdvancedModuleIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'modules' | 'geospatial' | 'career' | 'analytics'>('modules');
  const [newModule, setNewModule] = useState({
    title: '',
    type: 'VR_LAB',
    subject: 'Physics',
    description: '',
    objectives: ['']
  });

  const immersiveModules: ImmersiveModule[] = [
    {
      id: '1',
      title: 'Molecular Bonding VR Laboratory',
      type: 'VR_LAB',
      subject: 'Chemistry',
      description: 'Students manipulate 3D molecules to understand chemical bonding',
      participants: 12,
      duration: 45,
      status: 'active',
      learningObjectives: [
        'Visualize molecular structures in 3D',
        'Understand covalent and ionic bonding',
        'Predict molecular shapes'
      ],
      assessmentCriteria: [
        'Correct identification of bond types',
        'Accurate molecular shape predictions',
        'Understanding of electron behavior'
      ]
    },
    {
      id: '2',
      title: 'Solar System AR Exploration',
      type: 'AR_EXPLORATION',
      subject: 'Physics',
      description: 'Explore planetary motion and gravitational effects in augmented reality',
      participants: 8,
      duration: 30,
      status: 'active',
      learningObjectives: [
        'Understand planetary motion',
        'Visualize gravitational forces',
        'Compare planetary characteristics'
      ],
      assessmentCriteria: [
        'Explanation of orbital mechanics',
        'Comparison of planetary properties',
        'Understanding of gravitational effects'
      ]
    },
    {
      id: '3',
      title: 'Ecosystem Simulation',
      type: 'SIMULATION',
      subject: 'Biology',
      description: 'Interactive ecosystem where students can modify variables and observe effects',
      participants: 15,
      duration: 60,
      status: 'draft',
      learningObjectives: [
        'Understand ecosystem balance',
        'Analyze predator-prey relationships',
        'Explore environmental impacts'
      ],
      assessmentCriteria: [
        'Identification of ecosystem components',
        'Analysis of population dynamics',
        'Prediction of environmental changes'
      ]
    }
  ];

  const careerSuggestions: CareerSuggestion[] = [
    {
      studentId: '1',
      studentName: 'Alex Chen',
      suggestedCareers: [
        {
          title: 'Software Engineer',
          match: 92,
          reasoning: 'Strong mathematical skills and logical thinking align perfectly with programming',
          requiredSubjects: ['Mathematics', 'Physics', 'Computer Science'],
          examPrep: ['JEE Main', 'JEE Advanced', 'BITSAT']
        },
        {
          title: 'Data Scientist',
          match: 88,
          reasoning: 'Excellent analytical skills and pattern recognition abilities',
          requiredSubjects: ['Mathematics', 'Statistics', 'Computer Science'],
          examPrep: ['JEE Main', 'Various Engineering Entrances']
        }
      ],
      lastUpdated: '2024-02-15'
    },
    {
      studentId: '2',
      studentName: 'Maria Santos',
      suggestedCareers: [
        {
          title: 'Biomedical Engineer',
          match: 89,
          reasoning: 'Strong biology foundation with good problem-solving skills',
          requiredSubjects: ['Biology', 'Chemistry', 'Physics', 'Mathematics'],
          examPrep: ['NEET', 'JEE Main', 'AIIMS']
        },
        {
          title: 'Environmental Scientist',
          match: 85,
          reasoning: 'Interest in biology and chemistry with environmental awareness',
          requiredSubjects: ['Biology', 'Chemistry', 'Environmental Science'],
          examPrep: ['NEET', 'Various Science Entrances']
        }
      ],
      lastUpdated: '2024-02-14'
    }
  ];

  const handleCreateModule = () => {
    if (!newModule.title || !newModule.description) return;

    const module: ImmersiveModule = {
      id: Date.now().toString(),
      title: newModule.title,
      type: newModule.type as any,
      subject: newModule.subject,
      description: newModule.description,
      participants: 0,
      duration: 30,
      status: 'draft',
      learningObjectives: newModule.objectives.filter(obj => obj.trim()),
      assessmentCriteria: []
    };

    console.log('Created immersive module:', module);
    
    // Reset form
    setNewModule({
      title: '',
      type: 'VR_LAB',
      subject: 'Physics',
      description: '',
      objectives: ['']
    });
  };

  const addObjective = () => {
    setNewModule({
      ...newModule,
      objectives: [...newModule.objectives, '']
    });
  };

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...newModule.objectives];
    newObjectives[index] = value;
    setNewModule({ ...newModule, objectives: newObjectives });
  };

  const getModuleTypeIcon = (type: string) => {
    switch (type) {
      case 'VR_LAB': return '🥽';
      case 'AR_EXPLORATION': return '📱';
      case 'SIMULATION': return '🖥️';
      case 'GEOSPATIAL': return '🗺️';
      default: return '💻';
    }
  };

  const renderModuleManager = () => (
    <div className="space-y-6">
      {/* Create Module */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Create Immersive Module</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Module Title"
              value={newModule.title}
              onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
              placeholder="Enter module title"
            />
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Module Type</label>
              <select
                value={newModule.type}
                onChange={(e) => setNewModule({ ...newModule, type: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="VR_LAB" className="bg-gray-800">VR Laboratory</option>
                <option value="AR_EXPLORATION" className="bg-gray-800">AR Exploration</option>
                <option value="SIMULATION" className="bg-gray-800">Interactive Simulation</option>
                <option value="GEOSPATIAL" className="bg-gray-800">Geospatial Mission</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
            <textarea
              value={newModule.description}
              onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
              placeholder="Describe the immersive learning experience..."
              rows={3}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-white">Learning Objectives</h4>
              <Button variant="secondary" size="sm" onClick={addObjective}>
                <Plus className="w-4 h-4 mr-1" />
                Add Objective
              </Button>
            </div>
            
            <div className="space-y-2">
              {newModule.objectives.map((objective, index) => (
                <Input
                  key={index}
                  placeholder={`Learning objective ${index + 1}`}
                  value={objective}
                  onChange={(e) => updateObjective(index, e.target.value)}
                />
              ))}
            </div>
          </div>

          <Button
            variant="primary"
            onClick={handleCreateModule}
            disabled={!newModule.title || !newModule.description}
            className="w-full"
          >
            Create Module
          </Button>
        </CardBody>
      </Card>

      {/* Existing Modules */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Immersive Modules</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          {immersiveModules.map((module) => (
            <div key={module.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{getModuleTypeIcon(module.type)}</span>
                  <div>
                    <h4 className="font-semibold text-white">{module.title}</h4>
                    <p className="text-white/70 text-sm">{module.description}</p>
                  </div>
                </div>
                <Badge variant={module.status === 'active' ? 'success' : module.status === 'completed' ? 'info' : 'warning'}>
                  {module.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div className="text-center">
                  <Users className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <div className="text-white font-medium">{module.participants}</div>
                  <div className="text-white/60 text-xs">Participants</div>
                </div>
                <div className="text-center">
                  <Clock className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <div className="text-white font-medium">{module.duration} min</div>
                  <div className="text-white/60 text-xs">Duration</div>
                </div>
                <div className="text-center">
                  <Target className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <div className="text-white font-medium">{module.learningObjectives.length}</div>
                  <div className="text-white/60 text-xs">Objectives</div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="primary" size="sm" className="flex-1">
                  <Play className="w-4 h-4 mr-1" />
                  Launch
                </Button>
                <Button variant="secondary" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="secondary" size="sm">
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );

  const renderCareerGuidance = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">AI Career Suggestions</h3>
        </CardHeader>
        <CardBody className="space-y-6">
          {careerSuggestions.map((student) => (
            <div key={student.studentId} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-white">{student.studentName}</h4>
                <Badge variant="info">Updated {new Date(student.lastUpdated).toLocaleDateString()}</Badge>
              </div>
              
              <div className="space-y-4">
                {student.suggestedCareers.map((career, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-white">{career.title}</h5>
                      <div className="flex items-center space-x-2">
                        <ProgressBar
                          value={career.match}
                          size="sm"
                          className="w-20"
                          showPercentage={false}
                        />
                        <span className="text-white font-medium">{career.match}%</span>
                      </div>
                    </div>
                    
                    <p className="text-white/70 text-sm mb-3">{career.reasoning}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h6 className="font-medium text-white text-sm mb-2">Required Subjects</h6>
                        <div className="flex flex-wrap gap-1">
                          {career.requiredSubjects.map((subject) => (
                            <Badge key={subject} variant="secondary" size="sm">{subject}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h6 className="font-medium text-white text-sm mb-2">Exam Preparation</h6>
                        <div className="flex flex-wrap gap-1">
                          {career.examPrep.map((exam) => (
                            <Badge key={exam} variant="warning" size="sm">{exam}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
          <Cube className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold text-white">Advanced Module Integration</h1>
        </div>
        <Badge variant="primary">Immersive Learning</Badge>
      </div>

      {/* Navigation */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-1">
        <div className="flex space-x-1">
          {[
            { id: 'modules', label: 'VR/AR Modules', icon: Cube },
            { id: 'geospatial', label: 'Geospatial Missions', icon: MapPin },
            { id: 'career', label: 'Career Guidance', icon: Briefcase },
            { id: 'analytics', label: 'Module Analytics', icon: BarChart3 }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
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
      {activeTab === 'modules' && renderModuleManager()}
      {activeTab === 'geospatial' && (
        <Card>
          <CardBody className="p-8 text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Geospatial Mission Creator</h2>
            <p className="text-white/70">Create location-based learning missions using interactive maps</p>
          </CardBody>
        </Card>
      )}
      {activeTab === 'career' && renderCareerGuidance()}
      {activeTab === 'analytics' && (
        <Card>
          <CardBody className="p-8 text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Module Analytics</h2>
            <p className="text-white/70">Track student engagement and learning outcomes in immersive modules</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default AdvancedModuleIntegration;