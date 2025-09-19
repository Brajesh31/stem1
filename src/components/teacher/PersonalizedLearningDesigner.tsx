import React, { useState } from 'react';
import { 
  Brain, 
  Target, 
  Settings, 
  Eye,
  Edit,
  Save,
  Plus,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';

interface StudentPath {
  studentId: string;
  studentName: string;
  currentLevel: number;
  strengths: string[];
  weaknesses: string[];
  aiRecommendations: {
    nextActivity: string;
    difficulty: number;
    estimatedTime: number;
    reason: string;
  };
  customRules: PersonalizationRule[];
  progress: {
    completed: number;
    total: number;
    lastActivity: string;
  };
}

interface PersonalizationRule {
  id: string;
  condition: string;
  action: string;
  isActive: boolean;
  triggerCount: number;
}

const PersonalizedLearningDesigner: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [newRule, setNewRule] = useState({
    condition: '',
    action: '',
    trigger: 'quiz_failure',
    threshold: '2',
    response: 'assign_remedial'
  });

  const studentPaths: StudentPath[] = [
    {
      studentId: '1',
      studentName: 'Alex Chen',
      currentLevel: 12,
      strengths: ['Problem Solving', 'Mathematical Reasoning', 'Pattern Recognition'],
      weaknesses: ['Time Management', 'Complex Word Problems'],
      aiRecommendations: {
        nextActivity: 'Advanced Calculus Applications',
        difficulty: 0.8,
        estimatedTime: 45,
        reason: 'Strong performance in algebra suggests readiness for advanced concepts'
      },
      customRules: [
        {
          id: '1',
          condition: 'IF quiz score < 60% twice',
          action: 'THEN assign remedial video + practice',
          isActive: true,
          triggerCount: 0
        }
      ],
      progress: {
        completed: 15,
        total: 20,
        lastActivity: '2 hours ago'
      }
    },
    {
      studentId: '2',
      studentName: 'Maria Santos',
      currentLevel: 10,
      strengths: ['Visual Learning', 'Laboratory Skills', 'Collaboration'],
      weaknesses: ['Abstract Concepts', 'Mathematical Formulas'],
      aiRecommendations: {
        nextActivity: 'Visual Chemistry Bonding Simulation',
        difficulty: 0.6,
        estimatedTime: 30,
        reason: 'Visual learning style matches well with molecular visualization'
      },
      customRules: [
        {
          id: '2',
          condition: 'IF struggling with math formulas',
          action: 'THEN provide visual representations',
          isActive: true,
          triggerCount: 3
        }
      ],
      progress: {
        completed: 12,
        total: 18,
        lastActivity: '1 day ago'
      }
    }
  ];

  const selectedStudentData = studentPaths.find(p => p.studentId === selectedStudent);

  const conditionTemplates = [
    'IF quiz score < [threshold]% [frequency] times',
    'IF time spent > [threshold] minutes on activity',
    'IF student requests help [frequency] times',
    'IF completion rate < [threshold]% for [timeframe]',
    'IF engagement level < [threshold] for [timeframe]'
  ];

  const actionTemplates = [
    'THEN assign remedial video + practice exercises',
    'THEN reduce difficulty by [amount]%',
    'THEN schedule one-on-one session',
    'THEN provide additional scaffolding',
    'THEN switch to visual learning mode',
    'THEN assign peer tutor',
    'THEN provide advanced enrichment content'
  ];

  const handleCreateRule = () => {
    if (!selectedStudent || !newRule.condition || !newRule.action) return;

    const rule: PersonalizationRule = {
      id: Date.now().toString(),
      condition: newRule.condition,
      action: newRule.action,
      isActive: true,
      triggerCount: 0
    };

    console.log('Creating personalization rule:', rule);
    
    // Reset form
    setNewRule({
      condition: '',
      action: '',
      trigger: 'quiz_failure',
      threshold: '2',
      response: 'assign_remedial'
    });
  };

  const handleOverrideAI = (studentId: string, newActivity: string) => {
    console.log('Overriding AI recommendation for student:', studentId, 'New activity:', newActivity);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">Personalized Learning Designer</h1>
        </div>
        <Badge variant="primary">AI + Teacher Control</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Selection */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">Select Student</h3>
          </CardHeader>
          <CardBody className="space-y-3">
            {studentPaths.map((student) => (
              <button
                key={student.studentId}
                onClick={() => setSelectedStudent(student.studentId)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                  selectedStudent === student.studentId
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-white/80 hover:bg-white/10'
                }`}
              >
                <h4 className="font-medium">{student.studentName}</h4>
                <p className="text-xs opacity-70">Level {student.currentLevel}</p>
                <div className="mt-2">
                  <ProgressBar
                    value={student.progress.completed}
                    max={student.progress.total}
                    size="sm"
                    showPercentage
                  />
                </div>
              </button>
            ))}
          </CardBody>
        </Card>

        {/* Student Analysis */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">
              {selectedStudentData ? `${selectedStudentData.studentName}'s Learning Path` : 'Student Analysis'}
            </h3>
          </CardHeader>
          <CardBody>
            {selectedStudentData ? (
              <div className="space-y-6">
                {/* AI Recommendation */}
                <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-300 mb-2 flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    AI Recommendation
                  </h4>
                  <div className="space-y-2">
                    <p className="text-white font-medium">{selectedStudentData.aiRecommendations.nextActivity}</p>
                    <p className="text-blue-200 text-sm">{selectedStudentData.aiRecommendations.reason}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-blue-300">Difficulty: {Math.round(selectedStudentData.aiRecommendations.difficulty * 100)}%</span>
                      <span className="text-blue-300">Time: {selectedStudentData.aiRecommendations.estimatedTime} min</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button variant="primary" size="sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Modify
                    </Button>
                  </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
                    <h4 className="font-semibold text-green-300 mb-3">Strengths</h4>
                    <div className="space-y-1">
                      {selectedStudentData.strengths.map((strength, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-green-200 text-sm">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-orange-500/10 border border-orange-400/30 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-300 mb-3">Areas for Growth</h4>
                    <div className="space-y-1">
                      {selectedStudentData.weaknesses.map((weakness, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Target className="w-4 h-4 text-orange-400" />
                          <span className="text-orange-200 text-sm">{weakness}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Custom Rules */}
                <div>
                  <h4 className="font-semibold text-white mb-3">Personalization Rules</h4>
                  <div className="space-y-2">
                    {selectedStudentData.customRules.map((rule) => (
                      <div key={rule.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${rule.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                            <span className="text-white font-medium text-sm">Rule {rule.id}</span>
                          </div>
                          <Badge variant="secondary">Triggered {rule.triggerCount}x</Badge>
                        </div>
                        <p className="text-white/80 text-sm">{rule.condition}</p>
                        <p className="text-white/80 text-sm">{rule.action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-white/60">
                <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a student to view their personalized learning path</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Rule Creator */}
      {selectedStudent && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">Create Personalization Rule</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Condition Template</label>
                <select
                  value={newRule.condition}
                  onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="" className="bg-gray-800">Select condition...</option>
                  {conditionTemplates.map((template, index) => (
                    <option key={index} value={template} className="bg-gray-800">{template}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Action Template</label>
                <select
                  value={newRule.action}
                  onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="" className="bg-gray-800">Select action...</option>
                  {actionTemplates.map((template, index) => (
                    <option key={index} value={template} className="bg-gray-800">{template}</option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleCreateRule}
              disabled={!newRule.condition || !newRule.action}
              icon={<Plus className="w-4 h-4" />}
            >
              Create Rule
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default PersonalizedLearningDesigner;