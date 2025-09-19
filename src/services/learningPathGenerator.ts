// AI Learning Path Generator - Creates personalized learning journeys
interface LearningNode {
  id: string;
  title: string;
  description: string;
  type: 'concept' | 'practice' | 'assessment' | 'project' | 'collaboration';
  subject: string;
  difficulty: number;
  estimatedTime: number;
  prerequisites: string[];
  learningObjectives: string[];
  modality: '2D' | 'VR' | 'AR' | 'MR';
  position: { x: number; y: number };
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  aiGenerated: boolean;
}

interface LearningPath {
  id: string;
  studentId: string;
  title: string;
  description: string;
  careerGoal?: string;
  nodes: LearningNode[];
  connections: { from: string; to: string; weight: number }[];
  adaptiveElements: {
    difficultyScaling: boolean;
    modalityAdaptation: boolean;
    paceAdjustment: boolean;
  };
  generatedAt: string;
  lastUpdated: string;
}

class LearningPathGenerator {
  private studentPaths: Map<string, LearningPath> = new Map();
  private pathTemplates: Map<string, any> = new Map();

  constructor() {
    this.initializePathTemplates();
  }

  async generatePersonalizedPath(studentData: {
    id: string;
    currentLevel: number;
    subjects: string[];
    careerGoals: string[];
    learningStyle: string;
    strengths: string[];
    weaknesses: string[];
    interests: string[];
    timeAvailable: number; // minutes per day
    deviceCapabilities: any;
  }): Promise<LearningPath> {
    
    // Analyze student data to determine optimal path structure
    const pathStructure = await this.analyzeOptimalStructure(studentData);
    
    // Generate learning nodes based on analysis
    const nodes = await this.generateLearningNodes(studentData, pathStructure);
    
    // Create connections between nodes
    const connections = this.generateConnections(nodes, studentData);
    
    // Build complete learning path
    const learningPath: LearningPath = {
      id: `path_${studentData.id}_${Date.now()}`,
      studentId: studentData.id,
      title: this.generatePathTitle(studentData),
      description: this.generatePathDescription(studentData),
      careerGoal: studentData.careerGoals[0],
      nodes,
      connections,
      adaptiveElements: {
        difficultyScaling: true,
        modalityAdaptation: studentData.deviceCapabilities.hasVR || studentData.deviceCapabilities.hasAR,
        paceAdjustment: true
      },
      generatedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    // Cache the path
    this.studentPaths.set(studentData.id, learningPath);
    
    return learningPath;
  }

  private async analyzeOptimalStructure(studentData: any): Promise<any> {
    // AI analysis to determine optimal learning path structure
    const analysis = {
      recommendedModalities: this.analyzeModalityPreferences(studentData),
      optimalDifficultyCurve: this.calculateDifficultyCurve(studentData),
      suggestedPacing: this.calculateOptimalPacing(studentData),
      collaborationOpportunities: this.identifyCollaborationPoints(studentData),
      assessmentStrategy: this.designAssessmentStrategy(studentData)
    };

    return analysis;
  }

  private analyzeModalityPreferences(studentData: any): string[] {
    const modalities = ['2D'];
    
    // Add immersive modalities based on learning style and device capabilities
    if (studentData.learningStyle === 'visual' && studentData.deviceCapabilities.hasVR) {
      modalities.push('VR');
    }
    
    if (studentData.learningStyle === 'kinesthetic' && studentData.deviceCapabilities.hasAR) {
      modalities.push('AR');
    }
    
    if (studentData.interests.includes('collaboration') && 
        (studentData.deviceCapabilities.hasVR || studentData.deviceCapabilities.hasAR)) {
      modalities.push('MR');
    }

    return modalities;
  }

  private calculateDifficultyCurve(studentData: any): number[] {
    // Generate difficulty progression based on student's current level and learning patterns
    const baseLevel = studentData.currentLevel / 100; // Normalize to 0-1
    const curve = [];
    
    // Start slightly below current level
    let currentDifficulty = Math.max(0.1, baseLevel - 0.1);
    
    // Generate 20 difficulty points with gradual increase
    for (let i = 0; i < 20; i++) {
      curve.push(currentDifficulty);
      
      // Increase difficulty more slowly for struggling students
      const increment = studentData.weaknesses.length > 3 ? 0.02 : 0.03;
      currentDifficulty = Math.min(0.9, currentDifficulty + increment);
    }
    
    return curve;
  }

  private calculateOptimalPacing(studentData: any): any {
    const dailyTime = studentData.timeAvailable;
    
    return {
      sessionsPerDay: dailyTime > 60 ? 2 : 1,
      sessionLength: Math.min(45, dailyTime / 2),
      breakFrequency: dailyTime > 30 ? 15 : 20, // minutes between breaks
      weeklyGoals: Math.floor(dailyTime / 10), // nodes per week
      adaptivePacing: true
    };
  }

  private identifyCollaborationPoints(studentData: any): any[] {
    // Identify where collaborative learning would be most beneficial
    const collaborationPoints = [];
    
    if (studentData.interests.includes('teamwork')) {
      collaborationPoints.push({
        type: 'guild_quest',
        frequency: 'weekly',
        subjects: studentData.subjects
      });
    }
    
    if (studentData.weaknesses.length > 0) {
      collaborationPoints.push({
        type: 'peer_tutoring',
        frequency: 'as_needed',
        subjects: studentData.weaknesses
      });
    }
    
    return collaborationPoints;
  }

  private designAssessmentStrategy(studentData: any): any {
    return {
      formativeFrequency: 'every_3_nodes',
      summativeFrequency: 'every_10_nodes',
      adaptiveAssessment: true,
      multiModalAssessment: studentData.deviceCapabilities.hasVR,
      realWorldProjects: studentData.interests.includes('real_world_application')
    };
  }

  private async generateLearningNodes(studentData: any, structure: any): Promise<LearningNode[]> {
    const nodes: LearningNode[] = [];
    let nodeId = 1;
    
    // Generate nodes for each subject
    for (const subject of studentData.subjects) {
      const subjectNodes = await this.generateSubjectNodes(
        subject, 
        studentData, 
        structure,
        nodeId
      );
      nodes.push(...subjectNodes);
      nodeId += subjectNodes.length;
    }
    
    // Add cross-curricular nodes
    const crossCurricularNodes = await this.generateCrossCurricularNodes(
      studentData,
      structure,
      nodeId
    );
    nodes.push(...crossCurricularNodes);
    
    return nodes;
  }

  private async generateSubjectNodes(
    subject: string, 
    studentData: any, 
    structure: any,
    startId: number
  ): Promise<LearningNode[]> {
    const nodes: LearningNode[] = [];
    const subjectCurriculum = this.getSubjectCurriculum(subject, studentData.currentLevel);
    
    subjectCurriculum.forEach((concept, index) => {
      const difficulty = structure.optimalDifficultyCurve[index] || 0.5;
      const modality = this.selectModalityForConcept(concept, studentData, structure);
      
      nodes.push({
        id: `node_${startId + index}`,
        title: concept.title,
        description: concept.description,
        type: this.determineNodeType(concept, index),
        subject,
        difficulty,
        estimatedTime: this.calculateEstimatedTime(concept, difficulty),
        prerequisites: this.determinePrerequisites(concept, nodes),
        learningObjectives: concept.objectives,
        modality,
        position: this.calculateNodePosition(index, subject),
        status: index === 0 ? 'available' : 'locked',
        aiGenerated: true
      });
    });
    
    return nodes;
  }

  private selectModalityForConcept(concept: any, studentData: any, structure: any): '2D' | 'VR' | 'AR' | 'MR' {
    // AI decision on best modality for this specific concept
    if (concept.requires3D && studentData.deviceCapabilities.hasVR) {
      return 'VR';
    }
    
    if (concept.realWorldApplication && studentData.deviceCapabilities.hasAR) {
      return 'AR';
    }
    
    if (concept.collaborative && structure.recommendedModalities.includes('MR')) {
      return 'MR';
    }
    
    return '2D';
  }

  private determineNodeType(concept: any, index: number): LearningNode['type'] {
    if (index % 5 === 4) return 'assessment'; // Every 5th node is assessment
    if (index % 8 === 7) return 'project'; // Every 8th node is project
    if (concept.collaborative) return 'collaboration';
    if (concept.practical) return 'practice';
    return 'concept';
  }

  private calculateEstimatedTime(concept: any, difficulty: number): number {
    const baseTime = concept.baseTime || 30; // minutes
    const difficultyMultiplier = 0.5 + difficulty; // 0.5 to 1.5
    return Math.round(baseTime * difficultyMultiplier);
  }

  private determinePrerequisites(concept: any, existingNodes: LearningNode[]): string[] {
    // AI analysis of concept dependencies
    const prerequisites = [];
    
    // Look for prerequisite concepts in existing nodes
    for (const node of existingNodes) {
      if (concept.dependencies?.includes(node.title)) {
        prerequisites.push(node.id);
      }
    }
    
    return prerequisites;
  }

  private calculateNodePosition(index: number, subject: string): { x: number; y: number } {
    // Calculate position for visual path representation
    const subjectOffset = this.getSubjectOffset(subject);
    const row = Math.floor(index / 5);
    const col = index % 5;
    
    return {
      x: subjectOffset.x + (col * 200),
      y: subjectOffset.y + (row * 150)
    };
  }

  private getSubjectOffset(subject: string): { x: number; y: number } {
    const offsets = {
      'Mathematics': { x: 0, y: 0 },
      'Physics': { x: 1200, y: 0 },
      'Chemistry': { x: 0, y: 800 },
      'Biology': { x: 1200, y: 800 },
      'English': { x: 600, y: 400 }
    };
    
    return offsets[subject as keyof typeof offsets] || { x: 0, y: 0 };
  }

  private generateConnections(nodes: LearningNode[], studentData: any): any[] {
    const connections = [];
    
    // Create prerequisite connections
    for (const node of nodes) {
      for (const prereqId of node.prerequisites) {
        connections.push({
          from: prereqId,
          to: node.id,
          weight: 1.0
        });
      }
    }
    
    // Add cross-curricular connections
    const crossConnections = this.generateCrossCurricularConnections(nodes, studentData);
    connections.push(...crossConnections);
    
    return connections;
  }

  private generateCrossCurricularConnections(nodes: LearningNode[], studentData: any): any[] {
    const connections = [];
    
    // Find related concepts across subjects
    for (const node of nodes) {
      for (const otherNode of nodes) {
        if (node.subject !== otherNode.subject && 
            this.areConceptsRelated(node, otherNode)) {
          connections.push({
            from: node.id,
            to: otherNode.id,
            weight: 0.5 // Lower weight for cross-curricular connections
          });
        }
      }
    }
    
    return connections;
  }

  private areConceptsRelated(node1: LearningNode, node2: LearningNode): boolean {
    // AI analysis of concept relationships
    const relatedPairs = [
      ['algebra', 'physics_equations'],
      ['geometry', 'chemistry_molecular_shapes'],
      ['statistics', 'biology_data_analysis'],
      ['writing', 'science_reports']
    ];
    
    return relatedPairs.some(pair => 
      (node1.title.toLowerCase().includes(pair[0]) && node2.title.toLowerCase().includes(pair[1])) ||
      (node1.title.toLowerCase().includes(pair[1]) && node2.title.toLowerCase().includes(pair[0]))
    );
  }

  private async generateCrossCurricularNodes(studentData: any, structure: any, startId: number): Promise<LearningNode[]> {
    const nodes: LearningNode[] = [];
    
    // Generate project-based nodes that combine multiple subjects
    if (studentData.careerGoals.includes('engineering')) {
      nodes.push({
        id: `node_${startId}`,
        title: 'Bridge Design Challenge',
        description: 'Apply physics, mathematics, and engineering principles to design a bridge',
        type: 'project',
        subject: 'Cross-Curricular',
        difficulty: 0.7,
        estimatedTime: 120,
        prerequisites: [], // Will be set based on related subject nodes
        learningObjectives: [
          'Apply physics principles to structural design',
          'Use mathematical calculations for load analysis',
          'Understand engineering design process'
        ],
        modality: studentData.deviceCapabilities.hasVR ? 'VR' : '2D',
        position: { x: 600, y: 1200 },
        status: 'locked',
        aiGenerated: true
      });
    }
    
    return nodes;
  }

  private getSubjectCurriculum(subject: string, level: number): any[] {
    // Get curriculum data for subject at student's level
    const curriculumMap = {
      'Mathematics': [
        { title: 'Number Systems', description: 'Understanding different types of numbers', baseTime: 30, objectives: ['Identify number types', 'Perform operations'], requires3D: false },
        { title: 'Algebraic Expressions', description: 'Working with variables and expressions', baseTime: 45, objectives: ['Simplify expressions', 'Solve equations'], requires3D: false },
        { title: 'Geometric Shapes', description: 'Properties and relationships of shapes', baseTime: 40, objectives: ['Identify shapes', 'Calculate areas'], requires3D: true },
        { title: 'Data Analysis', description: 'Interpreting and analyzing data', baseTime: 35, objectives: ['Read graphs', 'Calculate statistics'], requires3D: false }
      ],
      'Physics': [
        { title: 'Forces and Motion', description: 'Understanding how objects move', baseTime: 50, objectives: ['Apply Newton\'s laws', 'Calculate motion'], requires3D: true },
        { title: 'Energy and Work', description: 'Energy transformations and conservation', baseTime: 45, objectives: ['Identify energy types', 'Calculate work'], requires3D: true },
        { title: 'Waves and Sound', description: 'Properties of waves and sound', baseTime: 40, objectives: ['Describe wave properties', 'Explain sound'], requires3D: true },
        { title: 'Electricity', description: 'Electric circuits and current', baseTime: 55, objectives: ['Build circuits', 'Calculate resistance'], requires3D: false }
      ],
      'Chemistry': [
        { title: 'Atomic Structure', description: 'Structure of atoms and elements', baseTime: 40, objectives: ['Describe atomic structure', 'Use periodic table'], requires3D: true },
        { title: 'Chemical Bonding', description: 'How atoms bond to form compounds', baseTime: 45, objectives: ['Explain bonding types', 'Predict compounds'], requires3D: true },
        { title: 'Chemical Reactions', description: 'How substances react and change', baseTime: 50, objectives: ['Balance equations', 'Predict products'], requires3D: false, realWorldApplication: true },
        { title: 'Acids and Bases', description: 'Properties and reactions of acids and bases', baseTime: 35, objectives: ['Test pH', 'Predict reactions'], requires3D: false }
      ]
    };

    return curriculumMap[subject as keyof typeof curriculumMap] || [];
  }

  private generatePathTitle(studentData: any): string {
    const careerGoal = studentData.careerGoals[0];
    if (careerGoal) {
      return `Journey to ${careerGoal}: Personalized Learning Adventure`;
    }
    
    const primarySubject = studentData.subjects[0];
    return `${primarySubject} Mastery Path: Tailored for ${studentData.learningStyle} Learners`;
  }

  private generatePathDescription(studentData: any): string {
    return `This AI-generated learning path is specifically designed for your learning style (${studentData.learningStyle}), 
    current level (${studentData.currentLevel}), and career aspirations. The path adapts in real-time based on your 
    progress and preferences, incorporating ${studentData.deviceCapabilities.hasVR ? 'VR experiences' : ''} 
    ${studentData.deviceCapabilities.hasAR ? 'AR explorations' : ''} and collaborative guild activities.`;
  }

  private initializePathTemplates(): void {
    // Initialize common path templates for different career goals
    this.pathTemplates.set('software_engineer', {
      coreSubjects: ['Mathematics', 'Physics', 'Computer Science'],
      keySkills: ['Programming', 'Problem Solving', 'Logic', 'Algorithms'],
      projectTypes: ['coding_challenges', 'app_development', 'algorithm_visualization'],
      immersiveExperiences: ['3d_algorithm_visualization', 'virtual_computer_architecture']
    });
    
    this.pathTemplates.set('biomedical_engineer', {
      coreSubjects: ['Biology', 'Chemistry', 'Physics', 'Mathematics'],
      keySkills: ['Biology', 'Engineering Design', 'Research', 'Problem Solving'],
      projectTypes: ['medical_device_design', 'tissue_engineering', 'biomechanics'],
      immersiveExperiences: ['vr_human_anatomy', 'ar_medical_procedures']
    });
  }

  async adaptPath(studentId: string, performanceData: any): Promise<LearningPath | null> {
    const currentPath = this.studentPaths.get(studentId);
    if (!currentPath) return null;

    // Analyze performance to determine adaptations
    const adaptations = this.analyzePerformanceForAdaptations(performanceData);
    
    // Apply adaptations to path
    const adaptedPath = { ...currentPath };
    
    // Adjust difficulty of upcoming nodes
    for (const node of adaptedPath.nodes) {
      if (node.status === 'locked' || node.status === 'available') {
        if (adaptations.increaseDifficulty) {
          node.difficulty = Math.min(0.9, node.difficulty * 1.1);
        } else if (adaptations.decreaseDifficulty) {
          node.difficulty = Math.max(0.1, node.difficulty * 0.9);
        }
      }
    }
    
    // Add remediation nodes if needed
    if (adaptations.needsRemediation) {
      const remediationNodes = await this.generateRemediationNodes(
        studentId,
        adaptations.weakAreas,
        adaptedPath.nodes.length
      );
      adaptedPath.nodes.push(...remediationNodes);
    }
    
    // Add enrichment nodes for advanced students
    if (adaptations.needsEnrichment) {
      const enrichmentNodes = await this.generateEnrichmentNodes(
        studentId,
        adaptations.strongAreas,
        adaptedPath.nodes.length
      );
      adaptedPath.nodes.push(...enrichmentNodes);
    }

    adaptedPath.lastUpdated = new Date().toISOString();
    this.studentPaths.set(studentId, adaptedPath);
    
    return adaptedPath;
  }

  private analyzePerformanceForAdaptations(performanceData: any): any {
    const avgScore = performanceData.averageScore || 0.75;
    const completionRate = performanceData.completionRate || 0.8;
    const engagementLevel = performanceData.engagementLevel || 0.7;
    
    return {
      increaseDifficulty: avgScore > 0.85 && completionRate > 0.9,
      decreaseDifficulty: avgScore < 0.6 || completionRate < 0.5,
      needsRemediation: avgScore < 0.7,
      needsEnrichment: avgScore > 0.9 && engagementLevel > 0.8,
      weakAreas: performanceData.weakSubjects || [],
      strongAreas: performanceData.strongSubjects || []
    };
  }

  private async generateRemediationNodes(studentId: string, weakAreas: string[], startId: number): Promise<LearningNode[]> {
    const nodes: LearningNode[] = [];
    
    for (const area of weakAreas) {
      nodes.push({
        id: `remediation_${startId}_${area}`,
        title: `${area} Foundation Review`,
        description: `Targeted practice to strengthen ${area} fundamentals`,
        type: 'practice',
        subject: area,
        difficulty: 0.3, // Lower difficulty for remediation
        estimatedTime: 25,
        prerequisites: [],
        learningObjectives: [`Strengthen ${area} fundamentals`, 'Build confidence'],
        modality: '2D', // Keep simple for remediation
        position: { x: 0, y: 1600 + (nodes.length * 150) },
        status: 'available',
        aiGenerated: true
      });
    }
    
    return nodes;
  }

  private async generateEnrichmentNodes(studentId: string, strongAreas: string[], startId: number): Promise<LearningNode[]> {
    const nodes: LearningNode[] = [];
    
    for (const area of strongAreas) {
      nodes.push({
        id: `enrichment_${startId}_${area}`,
        title: `Advanced ${area} Exploration`,
        description: `Dive deeper into advanced ${area} concepts and applications`,
        type: 'project',
        subject: area,
        difficulty: 0.8, // Higher difficulty for enrichment
        estimatedTime: 60,
        prerequisites: [],
        learningObjectives: [`Explore advanced ${area}`, 'Apply to real-world problems'],
        modality: 'VR', // Use immersive tech for enrichment
        position: { x: 1400, y: 1600 + (nodes.length * 150) },
        status: 'available',
        aiGenerated: true
      });
    }
    
    return nodes;
  }

  getStudentPath(studentId: string): LearningPath | null {
    return this.studentPaths.get(studentId) || null;
  }

  async updateNodeStatus(studentId: string, nodeId: string, status: LearningNode['status']): Promise<void> {
    const path = this.studentPaths.get(studentId);
    if (!path) return;

    const node = path.nodes.find(n => n.id === nodeId);
    if (node) {
      node.status = status;
      
      // Unlock dependent nodes if this node is completed
      if (status === 'completed') {
        this.unlockDependentNodes(path, nodeId);
      }
      
      path.lastUpdated = new Date().toISOString();
    }
  }

  private unlockDependentNodes(path: LearningPath, completedNodeId: string): void {
    for (const node of path.nodes) {
      if (node.status === 'locked' && node.prerequisites.includes(completedNodeId)) {
        // Check if all prerequisites are completed
        const allPrereqsCompleted = node.prerequisites.every(prereqId => {
          const prereqNode = path.nodes.find(n => n.id === prereqId);
          return prereqNode?.status === 'completed';
        });
        
        if (allPrereqsCompleted) {
          node.status = 'available';
        }
      }
    }
  }
}

export const learningPathGenerator = new LearningPathGenerator();