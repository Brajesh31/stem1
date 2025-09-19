import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Quest {
  id: string;
  title: string;
  description: string;
  subject: string;
  subjectIcon?: string;
  subjectColor?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Epic';
  rewards: {
    experience: number;
    crystals: number;
    sparks: number;
  };
  status: 'not_started' | 'in_progress' | 'completed';
  progress?: number;
  completed: boolean;
  startedAt?: string;
  completedAt?: string;
}

export interface SkillTree {
  id: string;
  subject: string;
  subjectIcon?: string;
  subjectColor?: string;
  level: number;
  totalNodes: number;
  unlockedNodes: number;
  masteredNodes: number;
  skills: Array<{
    id: string;
    name: string;
    unlocked: boolean;
    mastered: boolean;
    unlockedAt?: string;
    masteredAt?: string;
  }>;
}

export interface PlayerStats {
  level: number;
  experience: number;
  crystals: number;
  sparks: number;
  rank: string;
}

interface GameState {
  playerStats: PlayerStats;
  quests: Quest[];
  skillTrees: SkillTree[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GameState = {
  playerStats: {
    level: 1,
    experience: 0,
    crystals: 0,
    sparks: 0,
    rank: 'Novice Adventurer'
  },
  quests: [],
  skillTrees: [],
  isLoading: false,
  error: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    loadGameDataStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loadGameDataSuccess: (state, action: PayloadAction<{
      playerStats: PlayerStats;
      quests: Quest[];
      skillTrees: SkillTree[];
    }>) => {
      state.isLoading = false;
      state.playerStats = action.payload.playerStats;
      state.quests = action.payload.quests;
      state.skillTrees = action.payload.skillTrees;
      state.error = null;
    },
    loadGameDataFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updatePlayerStats: (state, action: PayloadAction<Partial<PlayerStats>>) => {
      state.playerStats = { ...state.playerStats, ...action.payload };
    },
    completeQuest: (state, action: PayloadAction<string>) => {
      const questIndex = state.quests.findIndex(q => q.id === action.payload);
      if (questIndex !== -1) {
        state.quests[questIndex].completed = true;
        state.quests[questIndex].status = 'completed';
        state.quests[questIndex].progress = 100;
        state.quests[questIndex].completedAt = new Date().toISOString();
        
        // Update player stats
        const quest = state.quests[questIndex];
        state.playerStats.experience += quest.rewards.experience;
        state.playerStats.crystals += quest.rewards.crystals;
        state.playerStats.sparks += quest.rewards.sparks;
        state.playerStats.level = Math.floor(state.playerStats.experience / 100) + 1;
      }
    },
    unlockSkill: (state, action: PayloadAction<{ subject: string; skillId: string }>) => {
      const treeIndex = state.skillTrees.findIndex(tree => tree.subject === action.payload.subject);
      if (treeIndex !== -1) {
        const skillIndex = state.skillTrees[treeIndex].skills.findIndex(skill => skill.id === action.payload.skillId);
        if (skillIndex !== -1) {
          state.skillTrees[treeIndex].skills[skillIndex].mastered = true;
          state.skillTrees[treeIndex].masteredNodes += 1;
        }
      }
    },
  },
});

export const {
  loadGameDataStart,
  loadGameDataSuccess,
  loadGameDataFailure,
  updatePlayerStats,
  completeQuest,
  unlockSkill,
} = gameSlice.actions;

export default gameSlice.reducer;