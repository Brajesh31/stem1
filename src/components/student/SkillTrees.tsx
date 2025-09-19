import React, { useState } from 'react';
import { 
  BookOpen, 
  Star, 
  Lock, 
  CheckCircle, 
  Target,
  Award,
  Zap,
  Eye,
  Play
} from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { useAppSelector } from '../../store';
import SkillPractice from './SkillPractice';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';

const SkillTrees: React.FC = () => {
  const { skillTrees, unlockSkill } = useGame();
  const { currentClass } = useAppSelector((state) => state.curriculum);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [showPractice, setShowPractice] = useState(false);

  const handleSkillClick = (skill: any, tree: any) => {
    if (!skill.unlocked) return;
    
    setSelectedSkill({ ...skill, subject: tree.subject });
    setShowPractice(true);
  };

  const handleSkillMaster = async (skill: any) => {
    await unlockSkill(skill.subject, skill.id);
    setShowPractice(false);
    setSelectedSkill(null);
  };

  const getSkillColor = (skill: any) => {
    if (skill.mastered) return 'bg-green-500 border-green-400 text-white';
    if (skill.unlocked) return 'bg-blue-500 border-blue-400 text-white hover:bg-blue-600';
    return 'bg-gray-500 border-gray-400 text-gray-300 opacity-50';
  };

  return (
    <>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-green-500" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {currentClass ? `${currentClass.displayName} - Knowledge Trees` : 'Knowledge Trees'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {currentClass 
                  ? `Master skills across ${currentClass.displayName} subjects`
                  : 'Grow your knowledge across all subjects'
                }
              </p>
            </div>
          </div>
          <Badge variant="info">{skillTrees.length} skill trees available</Badge>
        </div>

        {/* Skill Trees Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {skillTrees.map((tree) => (
            <Card key={tree.id} className="bg-gradient-to-b from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{tree.subjectIcon}</span>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{tree.subject}</h2>
                      <p className="text-green-600 dark:text-green-400 text-sm">Level {tree.level}</p>
                    </div>
                  </div>
                  <Badge variant="success">
                    {tree.masteredNodes}/{tree.totalNodes}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardBody className="space-y-4">
                {/* Progress Overview */}
                <div className="space-y-2">
                  <ProgressBar
                    value={tree.masteredNodes}
                    max={tree.totalNodes}
                    label="Mastery Progress"
                    showPercentage
                    variant="success"
                    size="sm"
                  />
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>{tree.unlockedNodes} unlocked</span>
                    <span>{tree.masteredNodes} mastered</span>
                  </div>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-4 gap-2">
                  {tree.skills.map((skill, index) => (
                    <button
                      key={skill.id}
                      onClick={() => handleSkillClick(skill, tree)}
                      disabled={!skill.unlocked}
                      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${getSkillColor(skill)} ${
                        skill.unlocked ? 'hover:scale-110 cursor-pointer' : 'cursor-not-allowed'
                      }`}
                      title={skill.name}
                    >
                      {skill.mastered ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : skill.unlocked ? (
                        <Star className="w-6 h-6" />
                      ) : (
                        <Lock className="w-6 h-6" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Action Button */}
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    const nextSkill = tree.skills.find(s => s.unlocked && !s.mastered);
                    if (nextSkill) {
                      handleSkillClick(nextSkill, tree);
                    }
                  }}
                  disabled={!tree.skills.some(s => s.unlocked && !s.mastered)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Practice Next Skill
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>

        {skillTrees.length === 0 && (
          <Card>
            <CardBody className="text-center py-12">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No skill trees available</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {currentClass 
                  ? `Skill trees for ${currentClass.displayName} are being prepared`
                  : 'Select a class to see available skill trees'
                }
              </p>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Skill Practice Modal */}
      {showPractice && selectedSkill && (
        <SkillPractice
          skill={selectedSkill}
          onClose={() => {
            setShowPractice(false);
            setSelectedSkill(null);
          }}
          onMaster={handleSkillMaster}
        />
      )}
    </>
  );
};

export default SkillTrees;