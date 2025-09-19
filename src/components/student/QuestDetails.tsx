import React, { useState } from 'react';
import { 
  X, 
  Play, 
  CheckCircle, 
  Star, 
  Target, 
  Clock,
  Award,
  BookOpen,
  Lightbulb,
  ArrowRight,
  Trophy
} from 'lucide-react';

interface QuestDetailsProps {
  quest: {
    id: string;
    title: string;
    description: string;
    subject: string;
    difficulty: string;
    rewards: {
      experience: number;
      crystals: number;
      sparks: number;
    };
  };
  onClose: () => void;
  onComplete: (quest: any) => void;
}

const QuestDetails: React.FC<QuestDetailsProps> = ({ quest, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showHint, setShowHint] = useState(false);

  // Generate quest content based on subject and difficulty
  const generateQuestContent = () => {
    const baseContent = {
      'Mathematics': {
        'Easy': {
          steps: [
            {
              type: 'explanation',
              title: 'Understanding Numbers',
              content: 'Let\'s explore the magical world of numbers! Numbers are everywhere around us.',
              example: 'Count the apples: 🍎🍎🍎 = 3 apples'
            },
            {
              type: 'practice',
              title: 'Practice Time',
              question: 'What is 5 + 3?',
              options: ['6', '7', '8', '9'],
              correct: 2,
              hint: 'Try counting on your fingers: 5 fingers + 3 more fingers'
            },
            {
              type: 'application',
              title: 'Real World Application',
              question: 'If you have 4 pencils and your friend gives you 2 more, how many pencils do you have?',
              options: ['5', '6', '7', '8'],
              correct: 1,
              hint: 'Add the pencils together: 4 + 2'
            }
          ]
        },
        'Medium': {
          steps: [
            {
              type: 'explanation',
              title: 'Fraction Adventures',
              content: 'Fractions represent parts of a whole. Think of a pizza cut into slices!',
              example: 'Half a pizza = 1/2, Quarter pizza = 1/4'
            },
            {
              type: 'practice',
              title: 'Fraction Practice',
              question: 'What is 1/2 + 1/4?',
              options: ['1/6', '2/6', '3/4', '1/3'],
              correct: 2,
              hint: 'Convert to common denominators: 2/4 + 1/4 = 3/4'
            },
            {
              type: 'challenge',
              title: 'Challenge Problem',
              question: 'A recipe calls for 3/4 cup of flour. You only have a 1/4 cup measure. How many times do you need to fill it?',
              options: ['2', '3', '4', '5'],
              correct: 1,
              hint: 'How many 1/4s make 3/4? Think: 1/4 + 1/4 + 1/4 = 3/4'
            }
          ]
        }
      },
      'Physics': {
        'Medium': {
          steps: [
            {
              type: 'explanation',
              title: 'Forces in Action',
              content: 'Forces are pushes and pulls that can change how objects move. Let\'s explore!',
              example: 'When you kick a ball, you apply a force that makes it move.'
            },
            {
              type: 'experiment',
              title: 'Virtual Experiment',
              content: 'Let\'s simulate pushing objects with different forces.',
              question: 'What happens when you apply more force to an object?',
              options: ['It moves slower', 'It moves faster', 'Nothing changes', 'It stops'],
              correct: 1,
              hint: 'Think about pushing a swing - harder push means faster movement!'
            },
            {
              type: 'application',
              title: 'Real World Physics',
              question: 'Why do you need to push harder to move a heavy box than a light box?',
              options: ['Heavy objects resist motion more', 'Light objects are slippery', 'Heavy objects are sticky', 'There\'s no difference'],
              correct: 0,
              hint: 'This is related to mass and inertia - heavier objects need more force to accelerate.'
            }
          ]
        }
      },
      'Chemistry': {
        'Medium': {
          steps: [
            {
              type: 'explanation',
              title: 'Chemical Reactions',
              content: 'Chemical reactions happen when substances combine to form new substances.',
              example: 'When you mix baking soda and vinegar, they react to produce bubbles!'
            },
            {
              type: 'virtual_lab',
              title: 'Virtual Chemistry Lab',
              content: 'Let\'s mix some safe chemicals and observe the reaction.',
              question: 'What do you observe when mixing baking soda (NaHCO₃) and vinegar (CH₃COOH)?',
              options: ['Nothing happens', 'It gets hot', 'Bubbles form', 'It changes color'],
              correct: 2,
              hint: 'The reaction produces carbon dioxide gas, which creates bubbles!'
            },
            {
              type: 'analysis',
              title: 'Reaction Analysis',
              question: 'Why do bubbles form in this reaction?',
              options: ['The mixture gets hot', 'A gas is produced', 'The liquids evaporate', 'Magic happens'],
              correct: 1,
              hint: 'Chemical reactions can produce gases, and CO₂ gas forms bubbles in the liquid.'
            }
          ]
        }
      }
    };

    // Get content for current quest or use default
    const subjectContent = baseContent[quest.subject as keyof typeof baseContent];
    const difficultyContent = subjectContent?.[quest.difficulty as keyof typeof subjectContent];
    
    if (difficultyContent) {
      return difficultyContent.steps;
    }

    // Default content if specific content not found
    return [
      {
        type: 'explanation',
        title: `Introduction to ${quest.subject}`,
        content: `Welcome to your ${quest.subject} adventure! Let's explore this fascinating subject together.`,
        example: 'This quest will help you master important concepts step by step.'
      },
      {
        type: 'practice',
        title: 'Practice Question',
        question: `Which of the following is most important in ${quest.subject}?`,
        options: ['Understanding concepts', 'Memorizing facts', 'Skipping lessons', 'Guessing answers'],
        correct: 0,
        hint: 'Understanding concepts helps you apply knowledge in new situations!'
      },
      {
        type: 'reflection',
        title: 'Reflection',
        question: 'What did you learn from this quest?',
        options: ['New concepts', 'Problem-solving skills', 'Real-world applications', 'All of the above'],
        correct: 3,
        hint: 'Great learning experiences combine all these elements!'
      }
    ];
  };

  const questSteps = generateQuestContent();
  const currentStepData = questSteps[currentStep];

  const handleAnswer = (answerIndex: number) => {
    setAnswers({ ...answers, [currentStep]: answerIndex });
    
    if (currentStep < questSteps.length - 1) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setShowHint(false);
      }, 1000);
    } else {
      // Quest completed
      setTimeout(() => {
        onComplete(quest);
        onClose();
      }, 1500);
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'explanation': return <BookOpen className="w-6 h-6" />;
      case 'practice': return <Target className="w-6 h-6" />;
      case 'experiment': return <span className="text-2xl">🔬</span>;
      case 'virtual_lab': return <span className="text-2xl">⚗️</span>;
      case 'application': return <Star className="w-6 h-6" />;
      case 'challenge': return <Award className="w-6 h-6" />;
      case 'analysis': return <span className="text-2xl">🧠</span>;
      case 'reflection': return <span className="text-2xl">💭</span>;
      default: return <Play className="w-6 h-6" />;
    }
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'explanation': return 'from-blue-500 to-blue-600';
      case 'practice': return 'from-green-500 to-green-600';
      case 'experiment': return 'from-purple-500 to-purple-600';
      case 'virtual_lab': return 'from-orange-500 to-orange-600';
      case 'application': return 'from-yellow-500 to-yellow-600';
      case 'challenge': return 'from-red-500 to-red-600';
      case 'analysis': return 'from-indigo-500 to-indigo-600';
      case 'reflection': return 'from-pink-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{quest.title}</h2>
              <p className="text-blue-100 mt-1">{quest.subject} • {quest.difficulty}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-blue-100 mb-2">
              <span>Quest Progress</span>
              <span>Step {currentStep + 1} of {questSteps.length}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / questSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className={`bg-gradient-to-br ${getStepColor(currentStepData.type)} rounded-xl p-6 text-white mb-6`}>
            <div className="flex items-center space-x-3 mb-4">
              {getStepIcon(currentStepData.type)}
              <h3 className="text-xl font-bold">{currentStepData.title}</h3>
            </div>
            <p className="text-white/90 leading-relaxed">{currentStepData.content}</p>
            {currentStepData.example && (
              <div className="mt-4 bg-white/20 rounded-lg p-3">
                <p className="text-sm"><strong>Example:</strong> {currentStepData.example}</p>
              </div>
            )}
          </div>

          {/* Question Section */}
          {currentStepData.question && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentStepData.question}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentStepData.options?.map((option: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={`p-4 text-left rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                      answers[currentStep] === index
                        ? index === currentStepData.correct
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                          : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 bg-white dark:bg-gray-800'
                    }`}
                    disabled={answers[currentStep] !== undefined}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                        answers[currentStep] === index
                          ? index === currentStepData.correct
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-red-500 bg-red-500 text-white'
                          : 'border-gray-400 text-gray-600 dark:text-gray-400'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Hint Button */}
              {currentStepData.hint && (
                <div className="text-center">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/30 transition-colors"
                  >
                    <Lightbulb className="w-4 h-4" />
                    <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                  </button>
                  
                  {showHint && (
                    <div className="mt-3 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                      <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                        💡 <strong>Hint:</strong> {currentStepData.hint}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Answer Feedback */}
              {answers[currentStep] !== undefined && (
                <div className={`p-4 rounded-lg ${
                  answers[currentStep] === currentStepData.correct
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {answers[currentStep] === currentStepData.correct ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-semibold ${
                      answers[currentStep] === currentStepData.correct
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-red-700 dark:text-red-300'
                    }`}>
                      {answers[currentStep] === currentStepData.correct ? 'Correct!' : 'Not quite right'}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    answers[currentStep] === currentStepData.correct
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {answers[currentStep] === currentStepData.correct
                      ? 'Great job! You\'re mastering this concept.'
                      : `The correct answer is: ${currentStepData.options[currentStepData.correct]}`
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-800 p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">+{quest.rewards.experience} XP</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                <span>💎</span>
                <span className="text-sm font-medium">{quest.rewards.crystals}</span>
              </div>
              <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
                <span>⚡</span>
                <span className="text-sm font-medium">{quest.rewards.sparks}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Exit Quest
              </button>
              
              {currentStep === questSteps.length - 1 && answers[currentStep] !== undefined && (
                <button
                  onClick={() => {
                    onComplete(quest);
                    onClose();
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all duration-200 flex items-center space-x-2"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Complete Quest</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestDetails;