import React, { useState, useEffect } from 'react';
import { Map, Star, Zap, Target, Play, CheckCircle, Filter, Search, BookOpen, Award, Brain, Eye, Cuboid as Cube, Mic, Lightbulb } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { useAppSelector } from '../../store';
import { aiOrchestrator } from '../../services/aiOrchestrator';
import { contentGenerator } from '../../services/contentGenerator';
import { curriculumService } from '../../services/curriculumService';
import QuestCompletion from './QuestCompletion';
import QuestDetails from './QuestDetails';
import VRLab from '../immersive/VRLab';
import AROverlay from '../immersive/AROverlay';
import AICompanion from '../ai/AICompanion';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Input from '../ui/Input';
import ProgressBar from '../ui/ProgressBar';

const EnhancedQuestBoard: React.FC = () => {
  const { quests, completeQuest } = useGame();
  const { currentClass, currentQuests } = useAppSelector((state) => state.curriculum);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [completedQuest, setCompletedQuest] = useState<any>(null);
  const [selectedQuest, setSelectedQuest] = useState<any>(null);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [activeModality, setActiveModality] = useState<'2D' | 'VR' | 'AR' | 'MR'>('2D');
  const [showVRLab, setShowVRLab] = useState(false);
  const [showAROverlay, setShowAROverlay] = useState(false);
  const [emotionalState, setEmotionalState] = useState<any>(null);

  // Use curriculum quests if available, fallback to game quests
  const questsToDisplay = currentQuests.length > 0 ? currentQuests : quests;

  useEffect(() => {
    generateAIRecommendations();
  }, [questsToDisplay]);

  const generateAIRecommendations = async () => {
    try {
      // Get AI recommendations for optimal quest selection
      const studentData = {
        id: 'current-student',
        currentLevel: 12,
        subjects: ['Mathematics', 'Physics', 'Chemistry'],
        learningStyle: 'visual',
        recentPerformance: 0.8,
        emotionalState: emotionalState
      };

      // Simulate AI analysis
      const recommendations = questsToDisplay
        .filter(quest => !quest.completed)
        .slice(0, 3)
        .map(quest => ({
          quest,
          reason: generateRecommendationReason(quest),
          confidence: 0.8 + Math.random() * 0.2,
          suggestedModality: quest.subject === 'Physics' || quest.subject === 'Chemistry' ? 'VR' : '2D'
        }));

      setAiRecommendations(recommendations);
    } catch (error) {
      console.error('Failed to generate AI recommendations:', error);
    }
  };

  const generateRecommendationReason = (quest: any): string => {
    const reasons = [
      `Perfect for your ${quest.subject} learning goals`,
      `Matches your current skill level and interests`,
      `Builds on concepts you've recently mastered`,
      `Recommended based on your learning patterns`,
      `Ideal difficulty progression for your level`
    ];
    
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  const handleQuestSelection = async (quest: any) => {
    // Get AI recommendation for optimal learning modality
    const learningMoment = {
      studentId: 'current-student',
      currentTopic: quest.title,
      studentState: {
        emotionalState: emotionalState?.primaryEmotion || 'engaged',
        cognitiveLoad: 0.5,
        attentionLevel: 0.8,
        confidenceLevel: 0.7,
        learningStyle: 'visual'
      },
      contentComplexity: quest.difficulty === 'Hard' ? 0.8 : quest.difficulty === 'Medium' ? 0.6 : 0.4,
      availableModalities: ['2D', 'VR', 'AR', 'MR'],
      learningObjective: quest.description,
      environmentContext: 'quest_selection',
      deviceCapabilities: {
        hasVR: 'xr' in navigator,
        hasAR: 'mediaDevices' in navigator,
        hasCamera: true,
        hasMicrophone: true,
        batteryLevel: 85
      }
    };

    const aiDecision = await aiOrchestrator.analyzeAndDecide(learningMoment);
    setActiveModality(aiDecision.recommendedModality);

    // Launch appropriate experience based on AI recommendation
    switch (aiDecision.recommendedModality) {
      case 'VR':
        setSelectedQuest(quest);
        setShowVRLab(true);
        break;
      case 'AR':
        setSelectedQuest(quest);
        setShowAROverlay(true);
        break;
      default:
        setSelectedQuest(quest);
    }
  };

  const filteredQuests = questsToDisplay.filter(quest => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && !quest.completed) || 
      (filter === 'completed' && quest.completed);
    
    const matchesSearch = quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quest.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleCompleteQuest = async (quest: any) => {
    await completeQuest(quest.id);
    setCompletedQuest(quest);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'danger';
      case 'Epic': return 'primary';
      default: return 'secondary';
    }
  };

  const getSubjectIcon = (subject: string) => {
    if (!subject) return '🎯'; // Default icon if subject is undefined
    switch (subject.toLowerCase()) {
      case 'mathematics': return '📐';
      case 'physics': return '⚛️';
      case 'english': return '📚';
      case 'chemistry': return '🧪';
      case 'biology': return '🧬';
      default: return '🎯';
    }
  };

  const getModalityIcon = (modality: string) => {
    switch (modality) {
      case 'VR': return '🥽';
      case 'AR': return '📱';
      case 'MR': return '🌐';
      default: return '💻';
    }
  };

  return (
    <>
      <div className="space-y-8 p-6">
        {/* Header with AI Insights */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Map className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {currentClass ? `${currentClass.displayName} - Quest Board` : 'AI-Enhanced Quest Board'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {currentClass 
                  ? `Curriculum-based adventures for ${currentClass.displayName}`
                  : 'Personalized adventures powered by artificial intelligence'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="info">{filteredQuests.length} adventures available</Badge>
            <Badge variant="primary">AI Powered</Badge>
          </div>
        </div>

        {/* AI Recommendations Section */}
        {aiRecommendations.length > 0 && (
          <Card className="border-purple-200 dark:border-purple-700 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
            <CardHeader>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <Brain className="w-6 h-6 mr-2 text-purple-500" />
                AI Recommendations for You
              </h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiRecommendations.map((rec, index) => (
                  <div key={rec.quest.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{getSubjectIcon(rec.quest.subject)}</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">{getModalityIcon(rec.suggestedModality)}</span>
                        <Badge variant="primary" size="sm">{rec.suggestedModality}</Badge>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{rec.quest.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{rec.reason}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-purple-600 dark:text-purple-400">
                        {Math.round(rec.confidence * 100)}% match
                      </span>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleQuestSelection(rec.quest)}
                      >
                        Start
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Enhanced Filters and Search */}
        <Card>
          <CardBody className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search adventures... (Try: 'challenging physics' or 'easy math')"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-5 h-5" />}
                />
              </div>
              
              <div className="flex space-x-2">
                {(['all', 'active', 'completed'] as const).map((filterOption) => (
                  <Button
                    key={filterOption}
                    variant={filter === filterOption ? 'primary' : 'secondary'}
                    onClick={() => setFilter(filterOption)}
                  >
                    {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                  </Button>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveModality('VR')}
                  className={activeModality === 'VR' ? 'bg-purple-600 text-white' : ''}
                >
                  🥽 VR
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveModality('AR')}
                  className={activeModality === 'AR' ? 'bg-blue-600 text-white' : ''}
                >
                  📱 AR
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Enhanced Quest Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuests.map((quest) => (
            <Card
              key={quest.id}
              className={`transition-all duration-300 hover:shadow-lg ${
                quest.completed ? 'opacity-75' : 'hover:scale-105'
              }`}
            >
              <CardBody className="p-6">
                {/* Quest Status Badge */}
                {quest.completed && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="success">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Completed
                    </Badge>
                  </div>
                )}

                {/* AI Enhancement Indicator */}
                <div className="absolute top-4 left-4">
                  <Badge variant="primary" size="sm">
                    <Brain className="w-3 h-3 mr-1" />
                    AI Enhanced
                  </Badge>
                </div>

                {/* Subject Icon */}
                <div className="text-4xl mb-4 mt-8">{getSubjectIcon(quest.subject)}</div>

                {/* Quest Info */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{quest.subject}</Badge>
                    <Badge variant={getDifficultyColor(quest.difficulty) as any}>
                      {quest.difficulty}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{quest.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{quest.description}</p>
                </div>

                {/* AI-Suggested Modality */}
                <div className="mb-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <Brain className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-300">AI Suggests</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {quest.subject === 'Physics' || quest.subject === 'Chemistry' ? '🥽' : 
                       quest.subject === 'Biology' ? '📱' : '💻'}
                    </span>
                    <span className="text-sm text-purple-600 dark:text-purple-400">
                      {quest.subject === 'Physics' || quest.subject === 'Chemistry' ? 'VR Lab Experience' : 
                       quest.subject === 'Biology' ? 'AR Exploration' : 'Interactive Learning'}
                    </span>
                  </div>
                </div>

                {/* Progress Bar (if applicable) */}
                {quest.progress !== undefined && (
                  <div className="mb-4">
                    <ProgressBar
                      value={quest.progress}
                      label="Progress"
                      showPercentage
                      variant="primary"
                      size="sm"
                    />
                  </div>
                )}

                {/* Enhanced Rewards */}
                <div className="mb-6">
                  <h4 className="text-gray-700 dark:text-gray-300 text-sm font-medium mb-2 flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    Rewards & Benefits
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                    <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                      <Target className="w-4 h-4" />
                      <span>{quest.rewards.experience} XP</span>
                    </div>
                    <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                      <span>💎</span>
                      <span>{quest.rewards.crystals}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400">
                      <Zap className="w-4 h-4" />
                      <span>{quest.rewards.sparks}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    + Personalized AI feedback & adaptive difficulty
                  </div>
                </div>

                {/* Enhanced Action Button */}
                <div className="space-y-2">
                  <Button
                    onClick={() => !quest.completed ? handleQuestSelection(quest) : undefined}
                    disabled={quest.completed}
                    variant={quest.completed ? 'success' : 'primary'}
                    className="w-full"
                    icon={quest.completed ? <CheckCircle className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  >
                    {quest.completed ? 'Victory Achieved!' : 'Begin AI-Enhanced Adventure'}
                  </Button>
                  
                  {!quest.completed && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          // Generate AI explanation of quest
                          console.log('Generate quest explanation');
                        }}
                        className="flex-1"
                      >
                        <Lightbulb className="w-4 h-4 mr-1" />
                        AI Explain
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          // Generate practice quiz
                          console.log('Generate practice quiz');
                        }}
                        className="flex-1"
                      >
                        <Target className="w-4 h-4 mr-1" />
                        Practice
                      </Button>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {filteredQuests.length === 0 && (
          <Card>
            <CardBody className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No quests found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
              <Button
                variant="primary"
                className="mt-4"
                onClick={async () => {
                  // Generate new AI quest
                  const newQuest = await contentGenerator.generateQuiz('Custom Topic', 0.6);
                  console.log('Generated new quest:', newQuest);
                }}
              >
                <Brain className="w-4 h-4 mr-2" />
                Generate AI Quest
              </Button>
            </CardBody>
          </Card>
        )}
      </div>

      {/* VR Lab Experience */}
      {showVRLab && selectedQuest && (
        <VRLab
          labType={selectedQuest.subject.toLowerCase()}
          experiment={{
            id: selectedQuest.id,
            title: selectedQuest.title,
            objectives: ['Understand core concepts', 'Apply knowledge', 'Analyze results'],
            difficulty: selectedQuest.difficulty === 'Hard' ? 0.8 : 0.6
          }}
          onComplete={(results) => {
            console.log('VR Lab completed:', results);
            handleCompleteQuest(selectedQuest);
            setShowVRLab(false);
          }}
          onExit={() => setShowVRLab(false)}
        />
      )}

      {/* AR Overlay Experience */}
      {showAROverlay && selectedQuest && (
        <AROverlay
          onObjectRecognized={(object, content) => {
            console.log('AR object recognized:', object, content);
          }}
          educationalContext={selectedQuest.title}
          subject={selectedQuest.subject}
        />
      )}

      {/* Quest Completion Modal */}
      {completedQuest && (
        <QuestCompletion
          quest={completedQuest}
          onClose={() => setCompletedQuest(null)}
          onContinue={() => setCompletedQuest(null)}
        />
      )}

      {/* Enhanced Quest Details Modal */}
      {selectedQuest && !showVRLab && !showAROverlay && (
        <QuestDetails
          quest={selectedQuest}
          onClose={() => setSelectedQuest(null)}
          onComplete={handleCompleteQuest}
        />
      )}

      {/* AI Companion Integration */}
      <AICompanion
        studentId="current-student"
        currentContext={{
          topic: selectedQuest?.title || 'Quest Selection',
          difficulty: selectedQuest?.difficulty === 'Hard' ? 0.8 : 0.6,
          subject: selectedQuest?.subject || 'General',
          activity: 'quest_board_exploration'
        }}
        onContentRequest={(content) => {
          console.log('AI content requested:', content);
        }}
        onModalityChange={(modality) => {
          setActiveModality(modality as any);
        }}
      />
    </>
  );
};

export default EnhancedQuestBoard;