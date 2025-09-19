// Living Laboratory Module Type Definitions
export interface VillageLabMission {
  id: string;
  title: string;
  description: string;
  type: 'monsoon_watch' | 'biodiversity_brigade' | 'pollinator_patrol' | 'water_quality' | 'soil_analysis' | 'weather_station';
  subject: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Epic';
  estimatedTime: number;
  requiredSensors: ('camera' | 'gps' | 'microphone' | 'accelerometer')[];
  dataFields: DataField[];
  rewards: {
    dataPoints: number;
    researcherBadges: string[];
    virtualEquipment?: string;
  };
  status: 'available' | 'in_progress' | 'completed' | 'verified';
  submittedData?: SubmittedData[];
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  scientificValue: number; // 1-100 scale
}

export interface DataField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'image' | 'location' | 'datetime' | 'multiple_choice';
  required: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
  };
  scientificUnit?: string;
  helpText: string;
}

export interface SubmittedData {
  id: string;
  missionId: string;
  studentId: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
    address?: string;
  };
  data: Record<string, any>;
  images: string[];
  qualityScore: number;
  verifiedBy?: string;
  verifiedAt?: string;
  contributesToScience: boolean;
}

export interface JugaadChallenge {
  id: string;
  title: string;
  description: string;
  category: 'agriculture' | 'energy' | 'water' | 'transportation' | 'communication' | 'health';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  realWorldContext: string;
  constraints: {
    budget: number; // in virtual currency
    materials: string[];
    timeLimit?: number;
    sustainabilityRequirement: boolean;
  };
  evaluationCriteria: {
    creativity: number;
    costEffectiveness: number;
    realWorldApplicability: number;
    scientificAccuracy: number;
  };
  rewards: {
    innovationPoints: number;
    inventorTitles: string[];
    unlockableComponents?: string[];
  };
  status: 'draft' | 'in_progress' | 'submitted' | 'peer_reviewed' | 'featured';
}

export interface VirtualComponent {
  id: string;
  name: string;
  category: 'mechanical' | 'electrical' | 'material' | 'sensor' | 'recycled';
  cost: number;
  properties: {
    weight?: number;
    strength?: number;
    conductivity?: number;
    flexibility?: number;
    durability?: number;
  };
  realWorldEquivalent: string;
  unlockLevel: number;
}

export interface JugaadDesign {
  id: string;
  challengeId: string;
  studentId: string;
  title: string;
  description: string;
  components: {
    componentId: string;
    quantity: number;
    position: { x: number; y: number; z: number };
    connections: string[];
  }[];
  simulationResults: {
    functionality: number;
    efficiency: number;
    sustainability: number;
    cost: number;
  };
  peerRatings: {
    studentId: string;
    creativity: number;
    practicality: number;
    comments: string;
  }[];
  teacherFeedback?: {
    scientificAccuracy: number;
    comments: string;
    suggestions: string[];
  };
}

export interface CommunityProject {
  id: string;
  title: string;
  description: string;
  type: 'village_lab_findings' | 'jugaad_innovation' | 'collaborative_research' | 'expert_session';
  author: {
    studentId: string;
    studentName: string;
    school: string;
    grade: number;
  };
  content: {
    images: string[];
    videos: string[];
    documents: string[];
    dataVisualization?: any;
    methodology?: string;
    findings?: string;
    conclusions?: string;
  };
  tags: string[];
  upvotes: number;
  comments: ProjectComment[];
  mentorReviews: MentorReview[];
  scientificPartners: string[];
  realWorldImpact?: {
    description: string;
    beneficiaries: number;
    measurableOutcome: string;
  };
  featured: boolean;
  createdAt: string;
  lastUpdated: string;
}

export interface ProjectComment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: string;
  helpful: boolean;
  replies: ProjectComment[];
}

export interface MentorReview {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorCredentials: string;
  rating: number;
  feedback: string;
  suggestions: string[];
  timestamp: string;
}

export interface ExpertSession {
  id: string;
  title: string;
  description: string;
  expertName: string;
  expertCredentials: string;
  scheduledAt: string;
  duration: number;
  maxParticipants: number;
  currentParticipants: number;
  topics: string[];
  registrationRequired: boolean;
  recordingAvailable: boolean;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
}

export interface ResearchTeam {
  id: string;
  name: string;
  description: string;
  leaderId: string;
  members: {
    studentId: string;
    studentName: string;
    school: string;
    role: 'leader' | 'researcher' | 'data_analyst' | 'communicator';
    joinedAt: string;
  }[];
  currentProject: string;
  achievements: string[];
  collaborationScore: number;
  publicationsCount: number;
}