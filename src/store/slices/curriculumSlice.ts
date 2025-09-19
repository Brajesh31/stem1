import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Class, Subject, CurriculumQuest, SkillTreeNode } from '../../types/curriculum';

interface CurriculumState {
  currentClass: Class | null;
  availableClasses: Class[];
  currentQuests: CurriculumQuest[];
  currentSkillTrees: SkillTreeNode[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CurriculumState = {
  currentClass: null,
  availableClasses: [],
  currentQuests: [],
  currentSkillTrees: [],
  isLoading: false,
  error: null,
};

const curriculumSlice = createSlice({
  name: 'curriculum',
  initialState,
  reducers: {
    setCurrentClass: (state, action: PayloadAction<Class>) => {
      state.currentClass = action.payload;
      state.error = null;
    },
    setAvailableClasses: (state, action: PayloadAction<Class[]>) => {
      state.availableClasses = action.payload;
    },
    setCurrentQuests: (state, action: PayloadAction<CurriculumQuest[]>) => {
      state.currentQuests = action.payload;
    },
    setCurrentSkillTrees: (state, action: PayloadAction<SkillTreeNode[]>) => {
      state.currentSkillTrees = action.payload;
    },
    updateQuestProgress: (state, action: PayloadAction<{ questId: string; progress: number; status?: string }>) => {
      const quest = state.currentQuests.find(q => q.id === action.payload.questId);
      if (quest) {
        quest.progress = action.payload.progress;
        if (action.payload.status) {
          quest.status = action.payload.status as any;
        }
      }
    },
    unlockSkillNode: (state, action: PayloadAction<string>) => {
      const node = state.currentSkillTrees.find(n => n.id === action.payload);
      if (node) {
        node.unlocked = true;
      }
    },
    masterSkillNode: (state, action: PayloadAction<string>) => {
      const node = state.currentSkillTrees.find(n => n.id === action.payload);
      if (node) {
        node.mastered = true;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCurrentClass,
  setAvailableClasses,
  setCurrentQuests,
  setCurrentSkillTrees,
  updateQuestProgress,
  unlockSkillNode,
  masterSkillNode,
  setLoading,
  setError,
  clearError,
} = curriculumSlice.actions;

export default curriculumSlice.reducer;