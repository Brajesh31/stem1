// Curriculum System Type Definitions
export interface Class {
  id: string;
  name: string;
  displayName: string;
  grade: number;
  stream?: 'PCM' | 'PCB' | 'Commerce' | 'Humanities';
  subjects: Subject[];
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  classId: string;
  isCore: boolean;
  isOptional: boolean;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  subjectId: string;
  order: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Epic';
  estimatedHours: number;
  prerequisites: string[];
}

export interface CurriculumQuest {
  id: string;
  title: string;
  description: string;
  classId: string;
  subjectId: string;
  subject: string;
  subjectIcon?: string;
  subjectColor?: string;
  topicId?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Epic';
  rewards: {
    experience: number;
    crystals: number;
    sparks: number;
  };
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  completed?: boolean;
}

export interface SkillTreeNode {
  id: string;
  name: string;
  description: string;
  subjectId: string;
  classId: string;
  prerequisites: string[];
  unlocked: boolean;
  mastered: boolean;
  position: { x: number; y: number };
}