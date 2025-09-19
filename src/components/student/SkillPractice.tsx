import React, { useState } from 'react';
import { 
  X, 
  Star, 
  CheckCircle, 
  Target, 
  Award,
  BookOpen,
  Lightbulb,
  Trophy,
  ArrowRight
} from 'lucide-react';

interface SkillPracticeProps {
  skill: {
    id: string;
    name: string;
    subject: string;
    unlocked: boolean;
    mastered: boolean;
  };
  onClose: () => void;
  onMaster: (skill: any) => void;
}

const SkillPractice: React.FC<SkillPracticeProps> = ({ skill, onClose, onMaster }) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);

  // Generate practice exercises based on skill and subject
  const generateExercises = () => {
    const exerciseTemplates = {
      'Mathematics': {
        'Skill 1': [
          {
            question: 'Solve: 15 + 27 = ?',
            options: ['40', '42', '44', '46'],
            correct: 1,
            hint: 'Break it down: 15 + 20 = 35, then 35 + 7 = 42',
            explanation: 'When adding larger numbers, you can break them into tens and ones for easier calculation.'
          },
          {
            question: 'What is 8 × 7?',
            options: ['54', '56', '58', '60'],
            correct: 1,
            hint: 'Think of it as 8 groups of 7, or use the multiplication table',
            explanation: '8 × 7 = 56. Multiplication is repeated addition: 7+7+7+7+7+7+7+7 = 56'
          },
          {
            question: 'If you have 100 marbles and give away 37, how many do you have left?',
            options: ['63', '65', '67', '69'],
            correct: 0,
            hint: 'Subtract: 100 - 37. You can think of it as 100 - 30 - 7',
            explanation: '100 - 37 = 63. Subtraction tells us how many remain after taking some away.'
          }
        ],
        'Skill 2': [
          {
            question: 'What is 3/4 + 1/4?',
            options: ['4/8', '4/4', '1/2', '1'],
            correct: 3,
            hint: 'When denominators are the same, just add the numerators: 3 + 1 = 4, so 4/4 = 1',
            explanation: 'Adding fractions with same denominators: add numerators, keep denominator. 3/4 + 1/4 = 4/4 = 1'
          },
          {
            question: 'Which fraction is larger: 2/3 or 3/5?',
            options: ['2/3', '3/5', 'They are equal', 'Cannot determine'],
            correct: 0,
            hint: 'Convert to decimals: 2/3 ≈ 0.67 and 3/5 = 0.60',
            explanation: '2/3 = 0.667 and 3/5 = 0.600, so 2/3 is larger.'
          }
        ]
      },
      'Physics': {
        'Skill 1': [
          {
            question: 'What happens to the speed of a ball when you throw it harder?',
            options: ['It moves slower', 'It moves faster', 'Speed stays the same', 'It stops moving'],
            correct: 1,
            hint: 'Think about when you gently toss a ball vs. when you throw it hard',
            explanation: 'More force applied to an object results in greater acceleration, making it move faster.'
          },
          {
            question: 'Why do objects fall down instead of up?',
            options: ['They are heavy', 'Gravity pulls them', 'Air pushes them', 'They want to fall'],
            correct: 1,
            hint: 'There\'s an invisible force that pulls everything toward Earth',
            explanation: 'Gravity is a force that attracts objects toward the center of the Earth.'
          }
        ]
      },
      'Chemistry': {
        'Skill 1': [
          {
            question: 'What happens when you mix baking soda and vinegar?',
            options: ['Nothing', 'It gets hot', 'Bubbles form', 'It changes color'],
            correct: 2,
            hint: 'This is a chemical reaction that produces a gas',
            explanation: 'The reaction produces carbon dioxide gas, which creates bubbles.'
          }
        ]
      }
    };

    const subjectExercises = exerciseTemplates[skill.subject as keyof typeof exerciseTemplates];
    const skillExercises = subjectExercises?.[skill.name as keyof typeof subjectExercises];
    
    if (skillExercises) {
      return skillExercises;
    }

    // Default exercises
    return [
      {
        question: `Practice question for ${skill.name} in ${skill.subject}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correct: 0,
        hint: 'This is a practice question to help you learn the concept.',
        explanation: 'Great job practicing! Keep working to master this skill.'
      },
      {
        question: `Advanced practice for ${skill.name}`,
        options: ['Advanced A', 'Advanced B', 'Advanced C', 'Advanced D'],
        correct: 1,
        hint: 'Think carefully about the advanced concepts.',
        explanation: 'Excellent! You\'re ready to master this skill.'
      }
    ];
  };

  const exercises = generateExercises();
  const currentExerciseData = exercises[currentExercise];

  const handleAnswer = (answerIndex: number) => {
    const isCorrect = answerIndex === currentExerciseData.correct;
    setAnswers({ ...answers, [currentExercise]: answerIndex });
    
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentExercise < exercises.length - 1) {
      setTimeout(() => {
        setCurrentExercise(currentExercise + 1);
        setShowHint(false);
      }, 2000);
    } else {
      // Practice completed
      setTimeout(() => {
        if (score >= exercises.length * 0.7) { // 70% correct to master
          onMaster(skill);
        } else {
          // Need more practice
          setCurrentExercise(0);
          setAnswers({});
          setScore(0);
        }
      }, 2000);
    }
  };

  const progressPercentage = ((currentExercise + 1) / exercises.length) * 100;
  const masteryThreshold = exercises.length * 0.7;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Skill Practice: {skill.name}</h2>
              <p className="text-purple-100 mt-1">{skill.subject} • Practice Session</p>
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
            <div className="flex justify-between text-sm text-purple-100 mb-2">
              <span>Practice Progress</span>
              <span>Question {currentExercise + 1} of {exercises.length}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Score */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-300" />
              <span className="text-sm">Score: {score}/{exercises.length}</span>
            </div>
            <div className="text-sm">
              Need {masteryThreshold} correct to master
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Practice Question</h3>
            </div>
            <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
              {currentExerciseData.question}
            </p>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {currentExerciseData.options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`p-4 text-left rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                  answers[currentExercise] === index
                    ? index === currentExerciseData.correct
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                    : 'border-gray-300 dark:border-gray-600 hover:border-purple-500 bg-white dark:bg-gray-800'
                }`}
                disabled={answers[currentExercise] !== undefined}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                    answers[currentExercise] === index
                      ? index === currentExerciseData.correct
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

          {/* Hint Section */}
          <div className="text-center mb-6">
            <button
              onClick={() => setShowHint(!showHint)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/30 transition-colors"
            >
              <Lightbulb className="w-4 h-4" />
              <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
            </button>
            
            {showHint && (
              <div className="mt-3 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  💡 <strong>Hint:</strong> {currentExerciseData.hint}
                </p>
              </div>
            )}
          </div>

          {/* Answer Feedback */}
          {answers[currentExercise] !== undefined && (
            <div className={`p-4 rounded-lg mb-6 ${
              answers[currentExercise] === currentExerciseData.correct
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                {answers[currentExercise] === currentExerciseData.correct ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <X className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-semibold ${
                  answers[currentExercise] === currentExerciseData.correct
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  {answers[currentExercise] === currentExerciseData.correct ? 'Excellent!' : 'Keep Learning!'}
                </span>
              </div>
              <p className={`text-sm ${
                answers[currentExercise] === currentExerciseData.correct
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {currentExerciseData.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-800 p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Score: {score}/{exercises.length}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {score >= masteryThreshold ? 'Ready to master!' : `Need ${masteryThreshold - score} more correct`}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Exit Practice
              </button>
              
              {currentExercise === exercises.length - 1 && answers[currentExercise] !== undefined && (
                <button
                  onClick={() => {
                    if (score >= masteryThreshold) {
                      onMaster(skill);
                    } else {
                      // Restart practice
                      setCurrentExercise(0);
                      setAnswers({});
                      setScore(0);
                    }
                  }}
                  className={`px-6 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                    score >= masteryThreshold
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-500'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'
                  }`}
                >
                  {score >= masteryThreshold ? (
                    <>
                      <Trophy className="w-4 h-4" />
                      <span>Master Skill</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      <span>Try Again</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillPractice;