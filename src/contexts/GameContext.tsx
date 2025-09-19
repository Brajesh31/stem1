import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useAppDispatch, useAppSelector } from '../store';
import { 
  loadGameDataStart, 
  loadGameDataSuccess, 
  loadGameDataFailure,
  completeQuest as completeQuestAction,
  unlockSkill as unlockSkillAction
} from '../store/slices/gameSlice';
import { addNotification } from '../store/slices/uiSlice';
import type { Quest, SkillTree, PlayerStats } from '../store/slices/gameSlice';

export interface AICompanion {
  name: string;
  message: string;
}

interface Skill {
  id: string;
  name: string;
  unlocked: boolean;
  mastered: boolean;
  unlockedAt?: string;
  masteredAt?: string;
}

interface GameContextType {
  aiCompanion: AICompanion;
  playerStats: PlayerStats;
  quests: Quest[];
  skillTrees: SkillTree[];
  isLoading: boolean;
  completeQuest: (questId: string) => Promise<void>;
  unlockSkill: (subject: string, skillId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const gameState = useAppSelector((state) => state.game);
  const [aiCompanion] = useState<AICompanion>({
    name: 'Athena',
    message: 'Ready for your next learning adventure? Let\'s explore new knowledge together!'
  });

  // Provide default values to prevent undefined errors
  const playerStats = gameState.playerStats || {
    level: 1,
    experience: 0,
    crystals: 0,
    sparks: 0,
    rank: 'Novice Adventure Seeker'
  };

  const quests = gameState.quests || [];
  const skillTrees = gameState.skillTrees || [];

  useEffect(() => {
    if (user && user.role === 'student') {
      loadGameData();
    }
  }, [user]);

  // Generate dynamic content based on grade
  const generateGradeContent = (grade: number) => {
    const gradeContent = {
      6: {
        subjects: ['Science', 'Mathematics', 'English'],
        quests: {
          'Science': [
            { title: 'The Living World', description: 'Explore the diversity of life around us', difficulty: 'Easy' },
            { title: 'Food: Where Does It Come From?', description: 'Discover the sources of our food', difficulty: 'Easy' },
            { title: 'Components of Food', description: 'Learn about nutrients and their importance', difficulty: 'Medium' },
            { title: 'Sorting Materials', description: 'Classify materials based on their properties', difficulty: 'Medium' }
          ],
          'Mathematics': [
            { title: 'Number Magic', description: 'Master whole numbers and their operations', difficulty: 'Easy' },
            { title: 'Fraction Adventures', description: 'Understand fractions and their applications', difficulty: 'Medium' },
            { title: 'Geometry Explorer', description: 'Discover basic shapes and their properties', difficulty: 'Medium' },
            { title: 'Data Detective', description: 'Learn to collect and interpret data', difficulty: 'Hard' }
          ],
          'English': [
            { title: 'Story Builder', description: 'Create engaging narratives with proper structure', difficulty: 'Easy' },
            { title: 'Grammar Guardian', description: 'Master the rules of English grammar', difficulty: 'Medium' },
            { title: 'Poetry Pioneer', description: 'Explore different forms of poetry', difficulty: 'Medium' },
            { title: 'Reading Comprehension Champion', description: 'Develop advanced reading skills', difficulty: 'Hard' }
          ]
        }
      },
      8: {
        subjects: ['Physics', 'Chemistry', 'Biology'],
        quests: {
          'Physics': [
            { title: 'Force and Pressure', description: 'Understand the relationship between force and pressure', difficulty: 'Medium' },
            { title: 'Friction', description: 'Explore the effects of friction in daily life', difficulty: 'Medium' },
            { title: 'Sound', description: 'Investigate the properties of sound waves', difficulty: 'Hard' },
            { title: 'Chemical Effects of Electric Current', description: 'Discover how electricity causes chemical changes', difficulty: 'Hard' }
          ],
          'Chemistry': [
            { title: 'Synthetic Fibres and Plastics', description: 'Learn about man-made materials', difficulty: 'Medium' },
            { title: 'Materials: Metals and Non-metals', description: 'Compare properties of metals and non-metals', difficulty: 'Medium' },
            { title: 'Coal and Petroleum', description: 'Understand fossil fuels and their uses', difficulty: 'Hard' },
            { title: 'Combustion and Flame', description: 'Study the science of burning', difficulty: 'Hard' }
          ],
          'Biology': [
            { title: 'Crop Production and Management', description: 'Learn about agricultural practices', difficulty: 'Easy' },
            { title: 'Microorganisms: Friend and Foe', description: 'Explore the world of microbes', difficulty: 'Medium' },
            { title: 'Reproduction in Animals', description: 'Understand animal reproduction processes', difficulty: 'Hard' },
            { title: 'Reaching the Age of Adolescence', description: 'Learn about human development', difficulty: 'Medium' }
          ]
        }
      },
      10: {
        subjects: ['Physics', 'Chemistry', 'Mathematics'],
        quests: {
          'Physics': [
            { title: 'Light: Reflection and Refraction', description: 'Master the behavior of light', difficulty: 'Hard' },
            { title: 'Electricity', description: 'Understand electrical circuits and power', difficulty: 'Hard' },
            { title: 'Magnetic Effects of Electric Current', description: 'Explore electromagnetism', difficulty: 'Epic' },
            { title: 'Our Environment', description: 'Study environmental management', difficulty: 'Medium' }
          ],
          'Chemistry': [
            { title: 'Chemical Reactions and Equations', description: 'Balance chemical equations like a pro', difficulty: 'Hard' },
            { title: 'Acids, Bases and Salts', description: 'Master the chemistry of acids and bases', difficulty: 'Hard' },
            { title: 'Metals and Non-metals', description: 'Advanced study of material properties', difficulty: 'Epic' },
            { title: 'Carbon and its Compounds', description: 'Explore organic chemistry basics', difficulty: 'Epic' }
          ],
          'Mathematics': [
            { title: 'Real Numbers', description: 'Master the number system', difficulty: 'Medium' },
            { title: 'Polynomials', description: 'Solve complex polynomial equations', difficulty: 'Hard' },
            { title: 'Coordinate Geometry', description: 'Navigate the coordinate plane', difficulty: 'Hard' },
            { title: 'Trigonometry', description: 'Unlock the secrets of triangles', difficulty: 'Epic' }
          ]
        }
      }
    };

    // Default content for other grades
    const defaultContent = {
      subjects: ['Mathematics', 'Science', 'English'],
      quests: {
        'Mathematics': [
          { title: 'Number Theory Explorer', description: 'Dive deep into number patterns', difficulty: 'Medium' },
          { title: 'Algebra Master', description: 'Solve complex algebraic expressions', difficulty: 'Hard' },
          { title: 'Geometry Wizard', description: 'Master geometric theorems', difficulty: 'Hard' },
          { title: 'Statistics Scholar', description: 'Analyze data like a professional', difficulty: 'Epic' }
        ],
        'Science': [
          { title: 'Scientific Method', description: 'Learn the foundation of scientific inquiry', difficulty: 'Easy' },
          { title: 'Matter and Energy', description: 'Understand the building blocks of universe', difficulty: 'Medium' },
          { title: 'Forces and Motion', description: 'Explore the laws of physics', difficulty: 'Hard' },
          { title: 'Chemical Reactions', description: 'Master the art of chemistry', difficulty: 'Hard' }
        ],
        'English': [
          { title: 'Literary Analysis', description: 'Analyze complex literary works', difficulty: 'Hard' },
          { title: 'Advanced Writing', description: 'Master persuasive and analytical writing', difficulty: 'Hard' },
          { title: 'Public Speaking', description: 'Develop confident presentation skills', difficulty: 'Medium' },
          { title: 'Critical Thinking', description: 'Enhance analytical reasoning', difficulty: 'Epic' }
        ]
      }
    };

    return gradeContent[grade as keyof typeof gradeContent] || defaultContent;
  };

  const loadGameData = async () => {
    if (!user) return;
    
    dispatch(loadGameDataStart());
    try {
      // Check if using mock authentication
      const authToken = localStorage.getItem('authToken');
      if (authToken && ['demo_student', 'demo_teacher', 'demo_admin'].includes(authToken)) {
        // Use mock data for demo mode
        const mockPlayerStats = {
          level: user.role === 'student' ? 12 : 1,
          experience: user.role === 'student' ? 1150 : 0,
          crystals: user.role === 'student' ? 245 : 0,
          sparks: user.role === 'student' ? 89 : 0,
          rank: getRankFromLevel(user.role === 'student' ? 12 : 1)
        };

        // Generate dynamic content based on user's grade
        const gradeContent = generateGradeContent(user.grade || 6);
        const mockQuests: Quest[] = [];
        
        if (user.role === 'student') {
          let questId = 1;
          gradeContent.subjects.forEach(subject => {
            const subjectQuests = gradeContent.quests[subject] || [];
            subjectQuests.forEach((questTemplate, index) => {
              const difficultyRewards = {
                'Easy': { experience: 100, crystals: 15, sparks: 5 },
                'Medium': { experience: 150, crystals: 25, sparks: 10 },
                'Hard': { experience: 200, crystals: 35, sparks: 15 },
                'Epic': { experience: 300, crystals: 50, sparks: 25 }
              };
              
              const status = index === 0 ? 'in_progress' : index === 1 ? 'completed' : 'not_started';
              
              mockQuests.push({
                id: questId.toString(),
                title: questTemplate.title,
                description: questTemplate.description,
                subject,
                subjectIcon: subject === 'Mathematics' ? '📐' : subject === 'Physics' ? '⚛️' : subject === 'Chemistry' ? '🧪' : subject === 'Biology' ? '🧬' : subject === 'English' ? '📚' : '🎯',
                subjectColor: subject === 'Mathematics' ? 'blue' : subject === 'Physics' ? 'purple' : subject === 'Chemistry' ? 'orange' : subject === 'Biology' ? 'green' : 'emerald',
                difficulty: questTemplate.difficulty as 'Easy' | 'Medium' | 'Hard' | 'Epic',
                rewards: difficultyRewards[questTemplate.difficulty as keyof typeof difficultyRewards],
                status: status as 'not_started' | 'in_progress' | 'completed',
                progress: status === 'completed' ? 100 : status === 'in_progress' ? Math.floor(Math.random() * 80) + 10 : 0,
                completed: status === 'completed',
                startedAt: status !== 'not_started' ? new Date().toISOString() : undefined,
                completedAt: status === 'completed' ? new Date().toISOString() : undefined
              });
              questId++;
            });
          });
        }

        // Generate skill trees based on subjects
        const mockSkillTrees: SkillTree[] = [];
        if (user.role === 'student') {
          gradeContent.subjects.forEach((subject, index) => {
            const skillCount = 8 + Math.floor(Math.random() * 12); // 8-20 skills
            const unlockedCount = Math.floor(skillCount * 0.6); // 60% unlocked
            const masteredCount = Math.floor(unlockedCount * 0.7); // 70% of unlocked are mastered
            
            const skills: Skill[] = [];
            for (let i = 0; i < skillCount; i++) {
              skills.push({
                id: (i + 1).toString(),
                name: `${subject} Skill ${i + 1}`,
                unlocked: i < unlockedCount,
                mastered: i < masteredCount,
                unlockedAt: i < unlockedCount ? new Date().toISOString() : undefined,
                masteredAt: i < masteredCount ? new Date().toISOString() : undefined
              });
            }
            
            mockSkillTrees.push({
              id: (index + 1).toString(),
              subject,
              subjectIcon: subject === 'Mathematics' ? '📐' : subject === 'Physics' ? '⚛️' : subject === 'Chemistry' ? '🧪' : subject === 'Biology' ? '🧬' : subject === 'English' ? '📚' : '🎯',
              subjectColor: subject === 'Mathematics' ? 'blue' : subject === 'Physics' ? 'purple' : subject === 'Chemistry' ? 'orange' : subject === 'Biology' ? 'green' : 'emerald',
              level: Math.floor(masteredCount / 3) + 1,
              totalNodes: skillCount,
              unlockedNodes: unlockedCount,
              masteredNodes: masteredCount,
              skills
            });
          });
        }

        dispatch(loadGameDataSuccess({
          playerStats: mockPlayerStats,
          quests: mockQuests,
          skillTrees: mockSkillTrees
        }));
      } else {
        // Real API integration would go here
        dispatch(loadGameDataFailure('API integration not implemented in demo mode'));
      }
    } catch (error) {
      console.error('Failed to load game data:', error);
      dispatch(loadGameDataFailure('Failed to load game data'));
      dispatch(addNotification({
        type: 'error',
        title: 'Loading Error',
        message: 'Failed to load game data. Backend server may not be running.'
      }));
    } finally {
    }
  };

  const getRankFromLevel = (level: number): string => {
    if (level >= 50) return 'Legendary Spark Master';
    if (level >= 40) return 'Epic Knowledge Champion';
    if (level >= 30) return 'Master Scholar Sage';
    if (level >= 20) return 'Expert Quest Conqueror';
    if (level >= 10) return 'Skilled Realm Explorer';
    if (level >= 5) return 'Rising Spark Wielder';
    return 'Novice Odyssey Seeker';
  };

  const completeQuest = async (questId: string) => {
    try {
      const quest = quests.find(q => q.id === questId);
      if (quest) {
        dispatch(completeQuestAction(questId));
        dispatch(addNotification({
          type: 'success',
          title: 'Quest Completed!',
          message: `You earned ${quest.rewards.experience} XP!`
        }));
      }
    } catch (error) {
      console.error('Failed to complete quest:', error);
      dispatch(addNotification({
        type: 'error',
        title: 'Quest Error',
        message: 'Failed to complete quest'
      }));
    }
  };

  const unlockSkill = async (subject: string, skillId: string) => {
    try {
      dispatch(unlockSkillAction({ subject, skillId }));
      dispatch(addNotification({
        type: 'success',
        title: 'Skill Mastered!',
        message: `You've mastered a new skill in ${subject}!`
      }));
    } catch (error) {
      console.error('Failed to unlock skill:', error);
      dispatch(addNotification({
        type: 'error',
        title: 'Skill Error',
        message: 'Failed to unlock skill'
      }));
    }
  };

  const refreshData = async () => {
    await loadGameData();
  };

  return (
    <GameContext.Provider value={{
      aiCompanion,
      playerStats,
      quests: gameState.quests,
      skillTrees: gameState.skillTrees,
      isLoading: gameState.isLoading,
      completeQuest,
      unlockSkill,
      refreshData
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};