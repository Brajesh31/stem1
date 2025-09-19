// Curriculum Service - Manages class-based content
import type { Class, Subject, Topic, CurriculumQuest, SkillTreeNode } from '../types/curriculum';

class CurriculumService {
  private classes: Class[] = [];
  private currentClassId: string | null = null;

  constructor() {
    this.initializeCurriculum();
  }

  private initializeCurriculum() {
    this.classes = [
      // Class 6-10 (General Curriculum)
      {
        id: 'class_6',
        name: 'Class 6',
        displayName: 'Class 6 - Foundation',
        grade: 6,
        subjects: [
          { id: 'math_6', name: 'Mathematics', icon: '📐', color: 'blue', classId: 'class_6', isCore: true, isOptional: false, topics: [] },
          { id: 'science_6', name: 'Science', icon: '🔬', color: 'green', classId: 'class_6', isCore: true, isOptional: false, topics: [] },
          { id: 'social_6', name: 'Social Studies', icon: '🌍', color: 'orange', classId: 'class_6', isCore: true, isOptional: false, topics: [] },
          { id: 'english_6', name: 'English', icon: '📚', color: 'purple', classId: 'class_6', isCore: true, isOptional: false, topics: [] }
        ]
      },
      {
        id: 'class_7',
        name: 'Class 7',
        displayName: 'Class 7 - Exploration',
        grade: 7,
        subjects: [
          { id: 'math_7', name: 'Mathematics', icon: '📐', color: 'blue', classId: 'class_7', isCore: true, isOptional: false, topics: [] },
          { id: 'science_7', name: 'Science', icon: '🔬', color: 'green', classId: 'class_7', isCore: true, isOptional: false, topics: [] },
          { id: 'social_7', name: 'Social Studies', icon: '🌍', color: 'orange', classId: 'class_7', isCore: true, isOptional: false, topics: [] },
          { id: 'english_7', name: 'English', icon: '📚', color: 'purple', classId: 'class_7', isCore: true, isOptional: false, topics: [] }
        ]
      },
      {
        id: 'class_8',
        name: 'Class 8',
        displayName: 'Class 8 - Discovery',
        grade: 8,
        subjects: [
          { id: 'math_8', name: 'Mathematics', icon: '📐', color: 'blue', classId: 'class_8', isCore: true, isOptional: false, topics: [] },
          { id: 'science_8', name: 'Science', icon: '🔬', color: 'green', classId: 'class_8', isCore: true, isOptional: false, topics: [] },
          { id: 'social_8', name: 'Social Studies', icon: '🌍', color: 'orange', classId: 'class_8', isCore: true, isOptional: false, topics: [] },
          { id: 'english_8', name: 'English', icon: '📚', color: 'purple', classId: 'class_8', isCore: true, isOptional: false, topics: [] }
        ]
      },
      {
        id: 'class_9',
        name: 'Class 9',
        displayName: 'Class 9 - Foundation Plus',
        grade: 9,
        subjects: [
          { id: 'math_9', name: 'Mathematics', icon: '📐', color: 'blue', classId: 'class_9', isCore: true, isOptional: false, topics: [] },
          { id: 'science_9', name: 'Science', icon: '🔬', color: 'green', classId: 'class_9', isCore: true, isOptional: false, topics: [] },
          { id: 'social_9', name: 'Social Studies', icon: '🌍', color: 'orange', classId: 'class_9', isCore: true, isOptional: false, topics: [] },
          { id: 'english_9', name: 'English', icon: '📚', color: 'purple', classId: 'class_9', isCore: true, isOptional: false, topics: [] }
        ]
      },
      {
        id: 'class_10',
        name: 'Class 10',
        displayName: 'Class 10 - Board Preparation',
        grade: 10,
        subjects: [
          { id: 'math_10', name: 'Mathematics', icon: '📐', color: 'blue', classId: 'class_10', isCore: true, isOptional: false, topics: [] },
          { id: 'science_10', name: 'Science', icon: '🔬', color: 'green', classId: 'class_10', isCore: true, isOptional: false, topics: [] },
          { id: 'social_10', name: 'Social Studies', icon: '🌍', color: 'orange', classId: 'class_10', isCore: true, isOptional: false, topics: [] },
          { id: 'english_10', name: 'English', icon: '📚', color: 'purple', classId: 'class_10', isCore: true, isOptional: false, topics: [] }
        ]
      },
      // Class 11 Streams
      {
        id: 'class_11_pcm',
        name: 'Class 11 - PCM',
        displayName: 'Class 11 - Physics, Chemistry, Mathematics',
        grade: 11,
        stream: 'PCM',
        subjects: [
          { id: 'physics_11', name: 'Physics', icon: '⚛️', color: 'purple', classId: 'class_11_pcm', isCore: true, isOptional: false, topics: [] },
          { id: 'chemistry_11', name: 'Chemistry', icon: '🧪', color: 'orange', classId: 'class_11_pcm', isCore: true, isOptional: false, topics: [] },
          { id: 'math_11', name: 'Mathematics', icon: '📐', color: 'blue', classId: 'class_11_pcm', isCore: true, isOptional: false, topics: [] },
          { id: 'english_11', name: 'English', icon: '📚', color: 'emerald', classId: 'class_11_pcm', isCore: true, isOptional: false, topics: [] }
        ]
      },
      {
        id: 'class_11_pcb',
        name: 'Class 11 - PCB',
        displayName: 'Class 11 - Physics, Chemistry, Biology',
        grade: 11,
        stream: 'PCB',
        subjects: [
          { id: 'physics_11_pcb', name: 'Physics', icon: '⚛️', color: 'purple', classId: 'class_11_pcb', isCore: true, isOptional: false, topics: [] },
          { id: 'chemistry_11_pcb', name: 'Chemistry', icon: '🧪', color: 'orange', classId: 'class_11_pcb', isCore: true, isOptional: false, topics: [] },
          { id: 'biology_11', name: 'Biology', icon: '🧬', color: 'green', classId: 'class_11_pcb', isCore: true, isOptional: false, topics: [] },
          { id: 'english_11_pcb', name: 'English', icon: '📚', color: 'emerald', classId: 'class_11_pcb', isCore: true, isOptional: false, topics: [] }
        ]
      },
      {
        id: 'class_11_commerce',
        name: 'Class 11 - Commerce',
        displayName: 'Class 11 - Commerce Stream',
        grade: 11,
        stream: 'Commerce',
        subjects: [
          { id: 'accountancy_11', name: 'Accountancy', icon: '💰', color: 'green', classId: 'class_11_commerce', isCore: true, isOptional: false, topics: [] },
          { id: 'business_11', name: 'Business Studies', icon: '📊', color: 'blue', classId: 'class_11_commerce', isCore: true, isOptional: false, topics: [] },
          { id: 'economics_11', name: 'Economics', icon: '📈', color: 'purple', classId: 'class_11_commerce', isCore: true, isOptional: false, topics: [] },
          { id: 'english_11_comm', name: 'English', icon: '📚', color: 'emerald', classId: 'class_11_commerce', isCore: true, isOptional: false, topics: [] },
          { id: 'math_11_comm', name: 'Mathematics', icon: '📐', color: 'orange', classId: 'class_11_commerce', isCore: false, isOptional: true, topics: [] }
        ]
      },
      {
        id: 'class_11_humanities',
        name: 'Class 11 - Humanities',
        displayName: 'Class 11 - Humanities Stream',
        grade: 11,
        stream: 'Humanities',
        subjects: [
          { id: 'history_11', name: 'History', icon: '🏛️', color: 'amber', classId: 'class_11_humanities', isCore: true, isOptional: false, topics: [] },
          { id: 'political_11', name: 'Political Science', icon: '🏛️', color: 'red', classId: 'class_11_humanities', isCore: true, isOptional: false, topics: [] },
          { id: 'economics_11_hum', name: 'Economics', icon: '📈', color: 'purple', classId: 'class_11_humanities', isCore: true, isOptional: false, topics: [] },
          { id: 'sociology_11', name: 'Sociology', icon: '👥', color: 'teal', classId: 'class_11_humanities', isCore: true, isOptional: false, topics: [] },
          { id: 'english_11_hum', name: 'English', icon: '📚', color: 'emerald', classId: 'class_11_humanities', isCore: true, isOptional: false, topics: [] }
        ]
      },
      // Class 12 Streams (similar structure)
      {
        id: 'class_12_pcm',
        name: 'Class 12 - PCM',
        displayName: 'Class 12 - Physics, Chemistry, Mathematics',
        grade: 12,
        stream: 'PCM',
        subjects: [
          { id: 'physics_12', name: 'Physics', icon: '⚛️', color: 'purple', classId: 'class_12_pcm', isCore: true, isOptional: false, topics: [] },
          { id: 'chemistry_12', name: 'Chemistry', icon: '🧪', color: 'orange', classId: 'class_12_pcm', isCore: true, isOptional: false, topics: [] },
          { id: 'math_12', name: 'Mathematics', icon: '📐', color: 'blue', classId: 'class_12_pcm', isCore: true, isOptional: false, topics: [] },
          { id: 'english_12', name: 'English', icon: '📚', color: 'emerald', classId: 'class_12_pcm', isCore: true, isOptional: false, topics: [] }
        ]
      },
      {
        id: 'class_12_pcb',
        name: 'Class 12 - PCB',
        displayName: 'Class 12 - Physics, Chemistry, Biology',
        grade: 12,
        stream: 'PCB',
        subjects: [
          { id: 'physics_12_pcb', name: 'Physics', icon: '⚛️', color: 'purple', classId: 'class_12_pcb', isCore: true, isOptional: false, topics: [] },
          { id: 'chemistry_12_pcb', name: 'Chemistry', icon: '🧪', color: 'orange', classId: 'class_12_pcb', isCore: true, isOptional: false, topics: [] },
          { id: 'biology_12', name: 'Biology', icon: '🧬', color: 'green', classId: 'class_12_pcb', isCore: true, isOptional: false, topics: [] },
          { id: 'english_12_pcb', name: 'English', icon: '📚', color: 'emerald', classId: 'class_12_pcb', isCore: true, isOptional: false, topics: [] }
        ]
      },
      {
        id: 'class_12_commerce',
        name: 'Class 12 - Commerce',
        displayName: 'Class 12 - Commerce Stream',
        grade: 12,
        stream: 'Commerce',
        subjects: [
          { id: 'accountancy_12', name: 'Accountancy', icon: '💰', color: 'green', classId: 'class_12_commerce', isCore: true, isOptional: false, topics: [] },
          { id: 'business_12', name: 'Business Studies', icon: '📊', color: 'blue', classId: 'class_12_commerce', isCore: true, isOptional: false, topics: [] },
          { id: 'economics_12', name: 'Economics', icon: '📈', color: 'purple', classId: 'class_12_commerce', isCore: true, isOptional: false, topics: [] },
          { id: 'english_12_comm', name: 'English', icon: '📚', color: 'emerald', classId: 'class_12_commerce', isCore: true, isOptional: false, topics: [] },
          { id: 'math_12_comm', name: 'Mathematics', icon: '📐', color: 'orange', classId: 'class_12_commerce', isCore: false, isOptional: true, topics: [] }
        ]
      },
      {
        id: 'class_12_humanities',
        name: 'Class 12 - Humanities',
        displayName: 'Class 12 - Humanities Stream',
        grade: 12,
        stream: 'Humanities',
        subjects: [
          { id: 'history_12', name: 'History', icon: '🏛️', color: 'amber', classId: 'class_12_humanities', isCore: true, isOptional: false, topics: [] },
          { id: 'political_12', name: 'Political Science', icon: '🏛️', color: 'red', classId: 'class_12_humanities', isCore: true, isOptional: false, topics: [] },
          { id: 'economics_12_hum', name: 'Economics', icon: '📈', color: 'purple', classId: 'class_12_humanities', isCore: true, isOptional: false, topics: [] },
          { id: 'sociology_12', name: 'Sociology', icon: '👥', color: 'teal', classId: 'class_12_humanities', isCore: true, isOptional: false, topics: [] },
          { id: 'english_12_hum', name: 'English', icon: '📚', color: 'emerald', classId: 'class_12_humanities', isCore: true, isOptional: false, topics: [] }
        ]
      }
    ];

    // Initialize topics for each subject
    this.initializeTopics();
  }

  private initializeTopics() {
    // Sample topics for different subjects
    const topicTemplates = {
      'Mathematics': {
        6: ['Number Systems', 'Basic Geometry', 'Fractions and Decimals', 'Data Handling'],
        7: ['Integers', 'Fractions and Decimals', 'Data Handling', 'Simple Equations'],
        8: ['Rational Numbers', 'Linear Equations', 'Understanding Quadrilaterals', 'Data Handling'],
        9: ['Number Systems', 'Polynomials', 'Coordinate Geometry', 'Linear Equations in Two Variables'],
        10: ['Real Numbers', 'Polynomials', 'Pair of Linear Equations', 'Quadratic Equations'],
        11: ['Sets', 'Relations and Functions', 'Trigonometric Functions', 'Principle of Mathematical Induction'],
        12: ['Relations and Functions', 'Inverse Trigonometric Functions', 'Matrices', 'Determinants']
      },
      'Physics': {
        11: ['Physical World', 'Units and Measurements', 'Motion in a Straight Line', 'Motion in a Plane'],
        12: ['Electric Charges and Fields', 'Electrostatic Potential', 'Current Electricity', 'Moving Charges and Magnetism']
      },
      'Chemistry': {
        11: ['Some Basic Concepts of Chemistry', 'Structure of Atom', 'Classification of Elements', 'Chemical Bonding'],
        12: ['The Solid State', 'Solutions', 'Electrochemistry', 'Chemical Kinetics']
      },
      'Biology': {
        11: ['The Living World', 'Biological Classification', 'Plant Kingdom', 'Animal Kingdom'],
        12: ['Reproduction in Organisms', 'Sexual Reproduction in Flowering Plants', 'Human Reproduction', 'Reproductive Health']
      }
    };

    // Add topics to subjects
    this.classes.forEach(classItem => {
      classItem.subjects.forEach(subject => {
        const subjectName = subject.name;
        const grade = classItem.grade;
        const topics = topicTemplates[subjectName as keyof typeof topicTemplates]?.[grade as keyof any] || [];
        
        subject.topics = topics.map((topicName, index) => ({
          id: `${subject.id}_topic_${index}`,
          name: topicName,
          description: `Learn about ${topicName} in ${subjectName}`,
          subjectId: subject.id,
          order: index,
          difficulty: index < 2 ? 'Easy' : index < 4 ? 'Medium' : 'Hard',
          estimatedHours: 2 + Math.floor(Math.random() * 4),
          prerequisites: index > 0 ? [`${subject.id}_topic_${index - 1}`] : []
        }));
      });
    });
  }

  getAllClasses(): Class[] {
    return this.classes;
  }

  getClassById(classId: string): Class | null {
    return this.classes.find(c => c.id === classId) || null;
  }

  getSubjectsByClass(classId: string): Subject[] {
    const classItem = this.getClassById(classId);
    return classItem?.subjects || [];
  }

  generateQuestsForClass(classId: string): CurriculumQuest[] {
    const classItem = this.getClassById(classId);
    if (!classItem) return [];

    const quests: CurriculumQuest[] = [];
    let questId = 1;

    classItem.subjects.forEach(subject => {
      subject.topics.forEach((topic, topicIndex) => {
        // Generate 2-3 quests per topic
        const questCount = 2 + Math.floor(Math.random() * 2);
        
        for (let i = 0; i < questCount; i++) {
          const difficulty = i === 0 ? 'Easy' : i === 1 ? 'Medium' : 'Hard';
          const baseReward = difficulty === 'Easy' ? 100 : difficulty === 'Medium' ? 150 : 200;
          
          quests.push({
            id: `quest_${classId}_${subject.id}_${topic.id}_${i}`,
            title: `${topic.name} ${i === 0 ? 'Explorer' : i === 1 ? 'Master' : 'Champion'}`,
            description: `Master the concepts of ${topic.name} through interactive challenges and real-world applications.`,
            classId,
            subjectId: subject.id,
            subject: subject.name,
            subjectIcon: subject.icon,
            subjectColor: subject.color,
            topicId: topic.id,
            difficulty: difficulty as any,
            rewards: {
              experience: baseReward,
              crystals: Math.floor(baseReward / 6),
              sparks: Math.floor(baseReward / 12)
            },
            status: 'not_started',
            progress: 0,
            completed: false
          });
          questId++;
        }
      });
    });

    return quests;
  }

  generateSkillTreesForClass(classId: string): SkillTreeNode[] {
    const classItem = this.getClassById(classId);
    if (!classItem) return [];

    const skillNodes: SkillTreeNode[] = [];

    classItem.subjects.forEach((subject, subjectIndex) => {
      subject.topics.forEach((topic, topicIndex) => {
        // Generate 3-4 skill nodes per topic
        const nodeCount = 3 + Math.floor(Math.random() * 2);
        
        for (let i = 0; i < nodeCount; i++) {
          skillNodes.push({
            id: `skill_${classId}_${subject.id}_${topic.id}_${i}`,
            name: `${topic.name} - Skill ${i + 1}`,
            description: `Master key concepts in ${topic.name}`,
            subjectId: subject.id,
            classId,
            prerequisites: i > 0 ? [`skill_${classId}_${subject.id}_${topic.id}_${i - 1}`] : [],
            unlocked: i === 0, // First skill is unlocked
            mastered: false,
            position: {
              x: subjectIndex * 200 + (i % 2) * 100,
              y: topicIndex * 150 + Math.floor(i / 2) * 75
            }
          });
        }
      });
    });

    return skillNodes;
  }

  setCurrentClass(classId: string): void {
    this.currentClassId = classId;
    localStorage.setItem('currentClassId', classId);
  }

  getCurrentClass(): Class | null {
    if (!this.currentClassId) {
      this.currentClassId = localStorage.getItem('currentClassId') || 'class_8'; // Default to Class 8
    }
    return this.getClassById(this.currentClassId);
  }

  getCurrentClassId(): string {
    return this.currentClassId || localStorage.getItem('currentClassId') || 'class_8';
  }
}

export const curriculumService = new CurriculumService();