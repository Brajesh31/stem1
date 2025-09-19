import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { VillageLabMission, JugaadChallenge, CommunityProject, ResearchTeam } from '../../types/livingLab';

interface LivingLabState {
  // Village Lab State
  availableMissions: VillageLabMission[];
  completedMissions: VillageLabMission[];
  activeMission: VillageLabMission | null;
  researcherStats: {
    level: number;
    dataPoints: number;
    scientificContributions: number;
    rank: string;
  };
  
  // Jugaad Studio State
  availableChallenges: JugaadChallenge[];
  completedChallenges: JugaadChallenge[];
  activeChallenge: JugaadChallenge | null;
  innovatorStats: {
    level: number;
    innovationPoints: number;
    designsCreated: number;
    realWorldImplementations: number;
    rank: string;
  };
  
  // Community Science Fair State
  communityProjects: CommunityProject[];
  researchTeams: ResearchTeam[];
  expertSessions: any[];
  
  // Overall State
  isLoading: boolean;
  error: string | null;
  overallImpactScore: number;
}

const initialState: LivingLabState = {
  availableMissions: [],
  completedMissions: [],
  activeMission: null,
  researcherStats: {
    level: 1,
    dataPoints: 0,
    scientificContributions: 0,
    rank: 'Novice Researcher'
  },
  
  availableChallenges: [],
  completedChallenges: [],
  activeChallenge: null,
  innovatorStats: {
    level: 1,
    innovationPoints: 0,
    designsCreated: 0,
    realWorldImplementations: 0,
    rank: 'Aspiring Innovator'
  },
  
  communityProjects: [],
  researchTeams: [],
  expertSessions: [],
  
  isLoading: false,
  error: null,
  overallImpactScore: 0
};

const livingLabSlice = createSlice({
  name: 'livingLab',
  initialState,
  reducers: {
    // Village Lab Actions
    setAvailableMissions: (state, action: PayloadAction<VillageLabMission[]>) => {
      state.availableMissions = action.payload;
    },
    
    startMission: (state, action: PayloadAction<VillageLabMission>) => {
      state.activeMission = action.payload;
      state.availableMissions = state.availableMissions.map(mission =>
        mission.id === action.payload.id
          ? { ...mission, status: 'in_progress' }
          : mission
      );
    },
    
    completeMission: (state, action: PayloadAction<{ missionId: string; dataPoints: number }>) => {
      const mission = state.availableMissions.find(m => m.id === action.payload.missionId);
      if (mission) {
        mission.status = 'completed';
        state.completedMissions.push(mission);
        state.researcherStats.dataPoints += action.payload.dataPoints;
        state.researcherStats.scientificContributions += 1;
        state.researcherStats.level = Math.floor(state.researcherStats.dataPoints / 500) + 1;
      }
      state.activeMission = null;
    },
    
    updateResearcherRank: (state) => {
      const level = state.researcherStats.level;
      if (level >= 20) state.researcherStats.rank = 'Master Scientist';
      else if (level >= 15) state.researcherStats.rank = 'Senior Researcher';
      else if (level >= 10) state.researcherStats.rank = 'Field Researcher';
      else if (level >= 5) state.researcherStats.rank = 'Junior Scientist';
      else state.researcherStats.rank = 'Novice Researcher';
    },
    
    // Jugaad Studio Actions
    setAvailableChallenges: (state, action: PayloadAction<JugaadChallenge[]>) => {
      state.availableChallenges = action.payload;
    },
    
    startChallenge: (state, action: PayloadAction<JugaadChallenge>) => {
      state.activeChallenge = action.payload;
      state.availableChallenges = state.availableChallenges.map(challenge =>
        challenge.id === action.payload.id
          ? { ...challenge, status: 'in_progress' }
          : challenge
      );
    },
    
    completeChallenge: (state, action: PayloadAction<{ challengeId: string; innovationPoints: number; implemented: boolean }>) => {
      const challenge = state.availableChallenges.find(c => c.id === action.payload.challengeId);
      if (challenge) {
        challenge.status = 'submitted';
        state.completedChallenges.push(challenge);
        state.innovatorStats.innovationPoints += action.payload.innovationPoints;
        state.innovatorStats.designsCreated += 1;
        if (action.payload.implemented) {
          state.innovatorStats.realWorldImplementations += 1;
        }
        state.innovatorStats.level = Math.floor(state.innovatorStats.innovationPoints / 300) + 1;
      }
      state.activeChallenge = null;
    },
    
    updateInnovatorRank: (state) => {
      const level = state.innovatorStats.level;
      if (level >= 20) state.innovatorStats.rank = 'Master Innovator';
      else if (level >= 15) state.innovatorStats.rank = 'Senior Designer';
      else if (level >= 10) state.innovatorStats.rank = 'Creative Inventor';
      else if (level >= 5) state.innovatorStats.rank = 'Problem Solver';
      else state.innovatorStats.rank = 'Aspiring Innovator';
    },
    
    // Community Science Fair Actions
    setCommunityProjects: (state, action: PayloadAction<CommunityProject[]>) => {
      state.communityProjects = action.payload;
    },
    
    addCommunityProject: (state, action: PayloadAction<CommunityProject>) => {
      state.communityProjects.unshift(action.payload);
    },
    
    upvoteProject: (state, action: PayloadAction<string>) => {
      const project = state.communityProjects.find(p => p.id === action.payload);
      if (project) {
        project.upvotes += 1;
      }
    },
    
    setResearchTeams: (state, action: PayloadAction<ResearchTeam[]>) => {
      state.researchTeams = action.payload;
    },
    
    joinResearchTeam: (state, action: PayloadAction<{ teamId: string; studentData: any }>) => {
      const team = state.researchTeams.find(t => t.id === action.payload.teamId);
      if (team) {
        team.members.push({
          studentId: action.payload.studentData.id,
          studentName: action.payload.studentData.name,
          school: action.payload.studentData.school,
          role: 'researcher',
          joinedAt: new Date().toISOString()
        });
      }
    },
    
    // Overall State Management
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    calculateOverallImpact: (state) => {
      const researcherImpact = (state.researcherStats.scientificContributions * 20) + 
                              (state.researcherStats.dataPoints / 50);
      const innovatorImpact = (state.innovatorStats.realWorldImplementations * 30) + 
                             (state.innovatorStats.innovationPoints / 30);
      const communityImpact = state.communityProjects.length * 10;
      
      state.overallImpactScore = Math.min(100, researcherImpact + innovatorImpact + communityImpact);
    },
    
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  setAvailableMissions,
  startMission,
  completeMission,
  updateResearcherRank,
  setAvailableChallenges,
  startChallenge,
  completeChallenge,
  updateInnovatorRank,
  setCommunityProjects,
  addCommunityProject,
  upvoteProject,
  setResearchTeams,
  joinResearchTeam,
  setLoading,
  setError,
  calculateOverallImpact,
  clearError
} = livingLabSlice.actions;

export default livingLabSlice.reducer;