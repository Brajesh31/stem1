// Central AI Orchestrator - The Brain of Project Spark
import { emotionAnalyzer } from './emotionAnalyzer';
import { cognitiveLoadAnalyzer } from './cognitiveLoadAnalyzer';
import { contentGenerator } from './contentGenerator';
import { learningPathGenerator } from './learningPathGenerator';

export interface CognitiveState {
  emotionalState: 'engaged' | 'frustrated' | 'bored' | 'excited' | 'confused';
  cognitiveLoad: number; // 0-1 scale
  attentionLevel: number; // 0-1 scale
  confidenceLevel: number; // 0-1 scale
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
}

export interface LearningMoment {
  studentId: string;
  currentTopic: string;
  studentState: CognitiveState;
  contentComplexity: number;
  availableModalities: ('2D' | 'VR' | 'AR' | 'MR')[];
  learningObjective: string;
  environmentContext: string;
  deviceCapabilities: {
    hasVR: boolean;
    hasAR: boolean;
    hasCamera: boolean;
    hasMicrophone: boolean;
    batteryLevel?: number;
  };
}

export interface AIDecision {
  recommendedModality: '2D' | 'VR' | 'AR' | 'MR';
  contentAdaptations: {
    difficulty: number;
    format: string;
    interactivity: number;
    pacing: number;
  };
  immersiveElements: {
    type: string;
    config: any;
  }[];
  voiceGuidance: {
    enabled: boolean;
    tone: string;
    language: string;
  };
  interventions: {
    type: 'encouragement' | 'break_suggestion' | 'difficulty_adjustment' | 'explanation_request';
    priority: number;
    message: string;
  }[];
}

class AIOrchestrator {
  private studentProfiles: Map<string, any> = new Map();
  private activeDecisions: Map<string, AIDecision> = new Map();

  async analyzeAndDecide(moment: LearningMoment): Promise<AIDecision> {
    // Analyze current student state
    const cognitiveAnalysis = await this.analyzeCognitiveState(moment);
    
    // Determine optimal learning modality
    const modalityDecision = this.selectOptimalModality(moment, cognitiveAnalysis);
    
    // Generate content adaptations
    const contentAdaptations = await this.generateContentAdaptations(moment, modalityDecision);
    
    // Create immersive elements if needed
    const immersiveElements = await this.createImmersiveElements(moment, modalityDecision);
    
    // Configure voice guidance
    const voiceGuidance = this.configureVoiceGuidance(moment, cognitiveAnalysis);
    
    // Determine interventions
    const interventions = this.determineInterventions(moment, cognitiveAnalysis);

    const decision: AIDecision = {
      recommendedModality: modalityDecision,
      contentAdaptations,
      immersiveElements,
      voiceGuidance,
      interventions
    };

    // Cache decision for this student
    this.activeDecisions.set(moment.studentId, decision);
    
    return decision;
  }

  private async analyzeCognitiveState(moment: LearningMoment): Promise<any> {
    const profile = this.getStudentProfile(moment.studentId);
    
    // Combine multiple AI analyses
    const emotionData = await emotionAnalyzer.getCurrentEmotion(moment.studentId);
    const cognitiveLoad = await cognitiveLoadAnalyzer.getCurrentLoad(moment.studentId);
    
    return {
      emotion: emotionData,
      cognitiveLoad,
      historicalPatterns: profile.learningPatterns,
      currentContext: moment.environmentContext
    };
  }

  private selectOptimalModality(moment: LearningMoment, analysis: any): '2D' | 'VR' | 'AR' | 'MR' {
    // Decision matrix based on multiple factors
    const factors = {
      conceptComplexity: moment.contentComplexity,
      studentEngagement: analysis.emotion.engagement,
      cognitiveLoad: analysis.cognitiveLoad,
      deviceCapabilities: moment.deviceCapabilities,
      learningStyle: moment.studentState.learningStyle,
      batteryLevel: moment.deviceCapabilities.batteryLevel || 100
    };

    // Complex 3D concepts + high engagement + VR capable = VR
    if (factors.conceptComplexity > 0.7 && 
        factors.studentEngagement > 0.6 && 
        factors.deviceCapabilities.hasVR &&
        factors.batteryLevel > 50) {
      return 'VR';
    }

    // Real-world application + AR capable = AR
    if (moment.learningObjective.includes('real-world') && 
        factors.deviceCapabilities.hasAR) {
      return 'AR';
    }

    // Collaborative learning + multiple modalities = MR
    if (moment.environmentContext.includes('guild') && 
        factors.deviceCapabilities.hasVR && 
        factors.deviceCapabilities.hasAR) {
      return 'MR';
    }

    // Default to 2D for efficiency and compatibility
    return '2D';
  }

  private async generateContentAdaptations(moment: LearningMoment, modality: string): Promise<any> {
    const cognitiveLoad = moment.studentState.cognitiveLoad;
    
    return {
      difficulty: Math.max(0.1, Math.min(0.9, 0.5 - (cognitiveLoad - 0.5))),
      format: modality === 'VR' ? '3D_immersive' : modality === 'AR' ? 'overlay' : 'traditional',
      interactivity: cognitiveLoad < 0.3 ? 0.8 : 0.5, // More interactive when not overloaded
      pacing: cognitiveLoad > 0.7 ? 0.7 : 1.0 // Slower pacing when overloaded
    };
  }

  private async createImmersiveElements(moment: LearningMoment, modality: string): Promise<any[]> {
    if (modality === '2D') return [];

    const elements = [];

    if (modality === 'VR') {
      elements.push({
        type: 'vr_environment',
        config: {
          scene: await this.generateVRScene(moment.currentTopic),
          interactions: await this.generateVRInteractions(moment.learningObjective),
          physics: moment.currentTopic.includes('physics')
        }
      });
    }

    if (modality === 'AR') {
      elements.push({
        type: 'ar_overlay',
        config: {
          recognitionTargets: await this.getARTargets(moment.currentTopic),
          overlayContent: await contentGenerator.generateARContent(moment.currentTopic),
          trackingMode: 'object' // or 'plane', 'face'
        }
      });
    }

    return elements;
  }

  private configureVoiceGuidance(moment: LearningMoment, analysis: any): any {
    const profile = this.getStudentProfile(moment.studentId);
    
    return {
      enabled: profile.preferences.voiceEnabled || analysis.cognitiveLoad > 0.6,
      tone: analysis.emotion.frustration > 0.5 ? 'encouraging' : 'neutral',
      language: profile.preferredLanguage || 'en',
      speed: analysis.cognitiveLoad > 0.7 ? 0.8 : 1.0,
      volume: 0.7
    };
  }

  private determineInterventions(moment: LearningMoment, analysis: any): any[] {
    const interventions = [];

    // Emotional interventions
    if (analysis.emotion.frustration > 0.7) {
      interventions.push({
        type: 'encouragement',
        priority: 1,
        message: 'You\'re doing great! This is a challenging concept - let\'s break it down together.'
      });
    }

    // Cognitive load interventions
    if (analysis.cognitiveLoad > 0.8) {
      interventions.push({
        type: 'break_suggestion',
        priority: 2,
        message: 'You\'ve been working hard! How about a 5-minute break?'
      });
    }

    // Difficulty interventions
    if (analysis.emotion.boredom > 0.6) {
      interventions.push({
        type: 'difficulty_adjustment',
        priority: 1,
        message: 'Ready for a bigger challenge? Let\'s level up!'
      });
    }

    return interventions.sort((a, b) => a.priority - b.priority);
  }

  private getStudentProfile(studentId: string): any {
    if (!this.studentProfiles.has(studentId)) {
      this.studentProfiles.set(studentId, {
        learningPatterns: {},
        preferences: {},
        historicalPerformance: {},
        preferredLanguage: 'en'
      });
    }
    return this.studentProfiles.get(studentId);
  }

  private async generateVRScene(topic: string): Promise<any> {
    // Generate VR scene configuration based on topic
    const sceneTemplates = {
      'chemistry': {
        environment: 'laboratory',
        objects: ['periodic_table', 'molecules', 'beakers', 'bunsen_burner'],
        lighting: 'laboratory_bright',
        physics: true
      },
      'physics': {
        environment: 'physics_lab',
        objects: ['pendulum', 'inclined_plane', 'springs', 'masses'],
        lighting: 'natural',
        physics: true
      },
      'biology': {
        environment: 'cell_interior',
        objects: ['nucleus', 'mitochondria', 'ribosomes', 'cell_membrane'],
        lighting: 'microscopic',
        physics: false
      }
    };

    return sceneTemplates[topic as keyof typeof sceneTemplates] || sceneTemplates.physics;
  }

  private async generateVRInteractions(objective: string): Promise<any[]> {
    // Generate appropriate interactions based on learning objective
    return [
      { type: 'grab_and_manipulate', objects: ['all_interactive'] },
      { type: 'voice_commands', commands: ['explain', 'show_formula', 'reset'] },
      { type: 'gesture_recognition', gestures: ['point', 'grab', 'wave'] }
    ];
  }

  private async getARTargets(topic: string): Promise<string[]> {
    // Return objects that should be recognized for AR overlays
    const targetMaps = {
      'chemistry': ['periodic_table', 'chemical_formula', 'laboratory_equipment'],
      'physics': ['pendulum', 'lever', 'pulley', 'magnet'],
      'biology': ['leaf', 'flower', 'human_body', 'microscope'],
      'mathematics': ['geometric_shapes', 'calculator', 'ruler', 'protractor']
    };

    return targetMaps[topic as keyof typeof targetMaps] || [];
  }

  // Real-time adaptation based on student feedback
  async adaptToFeedback(studentId: string, feedback: {
    type: 'confusion' | 'boredom' | 'engagement' | 'mastery';
    intensity: number;
    context: string;
  }): Promise<AIDecision> {
    const currentDecision = this.activeDecisions.get(studentId);
    if (!currentDecision) return this.getDefaultDecision();

    // Adapt current decision based on feedback
    const adaptedDecision = { ...currentDecision };

    switch (feedback.type) {
      case 'confusion':
        adaptedDecision.contentAdaptations.difficulty *= 0.8;
        adaptedDecision.interventions.push({
          type: 'explanation_request',
          priority: 1,
          message: 'Let me explain this concept in a different way.'
        });
        break;

      case 'boredom':
        adaptedDecision.contentAdaptations.difficulty *= 1.2;
        adaptedDecision.contentAdaptations.interactivity *= 1.3;
        break;

      case 'engagement':
        // Maintain current settings, they're working well
        break;

      case 'mastery':
        adaptedDecision.contentAdaptations.difficulty *= 1.1;
        adaptedDecision.interventions.push({
          type: 'encouragement',
          priority: 3,
          message: 'Excellent mastery! Ready for the next challenge?'
        });
        break;
    }

    this.activeDecisions.set(studentId, adaptedDecision);
    return adaptedDecision;
  }

  private getDefaultDecision(): AIDecision {
    return {
      recommendedModality: '2D',
      contentAdaptations: {
        difficulty: 0.5,
        format: 'traditional',
        interactivity: 0.5,
        pacing: 1.0
      },
      immersiveElements: [],
      voiceGuidance: {
        enabled: false,
        tone: 'neutral',
        language: 'en'
      },
      interventions: []
    };
  }
}

export const aiOrchestrator = new AIOrchestrator();