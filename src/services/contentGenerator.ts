// AI Content Generator - Creates personalized educational content
class ContentGenerator {
  private apiKey: string | null = null;
  private contentCache: Map<string, any> = new Map();

  constructor() {
    // In production, this would be securely managed
    this.apiKey = import.meta.env.VITE_AI_API_KEY || null;
  }

  async generateExplanation(topic: string, studentContext: {
    currentUnderstanding: string;
    learningStyle: string;
    culturalBackground: string;
    difficultyLevel: number;
  }): Promise<any> {
    const cacheKey = `explanation_${topic}_${JSON.stringify(studentContext)}`;
    
    if (this.contentCache.has(cacheKey)) {
      return this.contentCache.get(cacheKey);
    }

    try {
      const prompt = this.buildExplanationPrompt(topic, studentContext);
      const response = await this.callAIService(prompt);
      
      const explanation = {
        mainExplanation: response.explanation,
        analogies: response.analogies,
        examples: response.examples,
        visualSuggestions: response.visualSuggestions,
        interactiveElements: response.interactiveElements,
        culturalConnections: response.culturalConnections
      };

      this.contentCache.set(cacheKey, explanation);
      return explanation;
    } catch (error) {
      console.error('Failed to generate explanation:', error);
      return this.getFallbackExplanation(topic);
    }
  }

  async generateQuiz(topic: string, difficulty: number, questionCount: number = 5): Promise<any> {
    const cacheKey = `quiz_${topic}_${difficulty}_${questionCount}`;
    
    if (this.contentCache.has(cacheKey)) {
      return this.contentCache.get(cacheKey);
    }

    try {
      const prompt = this.buildQuizPrompt(topic, difficulty, questionCount);
      const response = await this.callAIService(prompt);
      
      const quiz = {
        id: Date.now().toString(),
        title: `${topic} Practice Quiz`,
        questions: response.questions.map((q: any, index: number) => ({
          id: `q_${index}`,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: difficulty,
          topic: topic
        })),
        estimatedTime: questionCount * 2, // 2 minutes per question
        passingScore: 70
      };

      this.contentCache.set(cacheKey, quiz);
      return quiz;
    } catch (error) {
      console.error('Failed to generate quiz:', error);
      return this.getFallbackQuiz(topic, questionCount);
    }
  }

  async generateARContent(objectName: string, educationalContext: string): Promise<any> {
    try {
      const prompt = `Create educational AR overlay content for a ${objectName} in the context of ${educationalContext}. Include:
      1. Key facts (3-5 bullet points)
      2. Interactive elements
      3. Related concepts
      4. Fun facts
      5. Questions to explore further`;

      const response = await this.callAIService(prompt);
      
      return {
        title: response.title,
        keyFacts: response.keyFacts,
        interactiveElements: response.interactiveElements,
        relatedConcepts: response.relatedConcepts,
        funFacts: response.funFacts,
        explorationQuestions: response.explorationQuestions,
        visualElements: {
          highlights: response.highlights,
          annotations: response.annotations,
          measurements: response.measurements
        }
      };
    } catch (error) {
      console.error('Failed to generate AR content:', error);
      return this.getFallbackARContent(objectName);
    }
  }

  async generateVRScenario(learningObjective: string, studentPreferences: any): Promise<any> {
    try {
      const prompt = this.buildVRScenarioPrompt(learningObjective, studentPreferences);
      const response = await this.callAIService(prompt);
      
      return {
        scenarioId: Date.now().toString(),
        title: response.title,
        description: response.description,
        environment: {
          setting: response.environment.setting,
          objects: response.environment.objects,
          lighting: response.environment.lighting,
          physics: response.environment.physics
        },
        interactions: response.interactions,
        learningActivities: response.learningActivities,
        assessmentPoints: response.assessmentPoints,
        adaptiveElements: response.adaptiveElements
      };
    } catch (error) {
      console.error('Failed to generate VR scenario:', error);
      return this.getFallbackVRScenario(learningObjective);
    }
  }

  async gradeEssay(essayText: string, rubric: any): Promise<any> {
    try {
      const prompt = this.buildEssayGradingPrompt(essayText, rubric);
      const response = await this.callAIService(prompt);
      
      return {
        overallScore: response.overallScore,
        maxScore: rubric.maxScore,
        criteriaScores: response.criteriaScores,
        feedback: {
          strengths: response.feedback.strengths,
          improvements: response.feedback.improvements,
          suggestions: response.feedback.suggestions
        },
        inlineFeedback: response.inlineFeedback, // Specific text highlights
        nextSteps: response.nextSteps
      };
    } catch (error) {
      console.error('Failed to grade essay:', error);
      return this.getFallbackGrading(essayText, rubric);
    }
  }

  private buildExplanationPrompt(topic: string, context: any): string {
    return `You are Athena, an AI learning companion for Project Spark. Create a personalized explanation for the topic "${topic}" for a student with the following context:

Learning Style: ${context.learningStyle}
Current Understanding: ${context.currentUnderstanding}
Cultural Background: ${context.culturalBackground}
Difficulty Level: ${context.difficultyLevel}/1.0

Requirements:
1. Use age-appropriate language for grades 6-12
2. Include relevant analogies from the student's cultural context
3. Provide concrete examples
4. Suggest visual or interactive elements
5. Connect to real-world applications
6. Be encouraging and supportive

Format your response as JSON with the following structure:
{
  "explanation": "Main explanation text",
  "analogies": ["analogy1", "analogy2"],
  "examples": ["example1", "example2"],
  "visualSuggestions": ["visual1", "visual2"],
  "interactiveElements": ["interaction1", "interaction2"],
  "culturalConnections": ["connection1", "connection2"]
}`;
  }

  private buildQuizPrompt(topic: string, difficulty: number, questionCount: number): string {
    return `Generate ${questionCount} multiple-choice questions for the topic "${topic}" with difficulty level ${difficulty}/1.0 for grades 6-12.

Requirements:
1. Questions should test understanding, not just memorization
2. Include real-world application questions
3. Provide clear, educational explanations for correct answers
4. Ensure distractors are plausible but clearly incorrect
5. Vary question types (conceptual, application, analysis)

Format as JSON:
{
  "questions": [
    {
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}`;
  }

  private buildVRScenarioPrompt(objective: string, preferences: any): string {
    return `Create a VR learning scenario for the objective: "${objective}"

Student Preferences:
- Learning Style: ${preferences.learningStyle}
- Preferred Subjects: ${preferences.subjects?.join(', ')}
- Interaction Preferences: ${preferences.interactions}

Create an immersive VR experience that includes:
1. Detailed environment description
2. Interactive objects and their behaviors
3. Learning activities within the VR space
4. Assessment opportunities
5. Adaptive elements that can change based on performance

Format as JSON with detailed VR scene configuration.`;
  }

  private buildEssayGradingPrompt(essay: string, rubric: any): string {
    return `Grade the following essay using the provided rubric. Provide detailed, constructive feedback.

Essay:
"${essay}"

Rubric:
${JSON.stringify(rubric)}

Provide:
1. Scores for each rubric criterion
2. Overall score and percentage
3. Specific strengths and areas for improvement
4. Inline feedback with text highlights
5. Actionable next steps for improvement

Format as JSON with detailed feedback structure.`;
  }

  private async callAIService(prompt: string): Promise<any> {
    // In production, integrate with actual AI service
    // For demo, return mock responses
    
    if (prompt.includes('explanation')) {
      return {
        explanation: "This is a personalized explanation generated by AI based on your learning style and background.",
        analogies: ["Like a puzzle piece fitting perfectly", "Similar to how a key opens a lock"],
        examples: ["Real-world example 1", "Practical application 2"],
        visualSuggestions: ["Interactive diagram", "3D model visualization"],
        interactiveElements: ["Drag-and-drop activity", "Virtual experiment"],
        culturalConnections: ["Local festival connection", "Traditional practice example"]
      };
    }
    
    if (prompt.includes('quiz')) {
      return {
        questions: Array.from({ length: 5 }, (_, i) => ({
          question: `AI-generated question ${i + 1} about the topic`,
          options: [`Option A`, `Option B`, `Option C`, `Option D`],
          correctAnswer: Math.floor(Math.random() * 4),
          explanation: `This is the correct answer because of the underlying principles.`
        }))
      };
    }

    // Default response
    return { content: "AI-generated content would appear here in production." };
  }

  private getFallbackExplanation(topic: string): any {
    return {
      mainExplanation: `Here's a basic explanation of ${topic}. This concept is important because it helps us understand how things work in the real world.`,
      analogies: [`Think of ${topic} like a familiar everyday object`],
      examples: [`Example: ${topic} can be seen in daily life`],
      visualSuggestions: ['Diagram', 'Chart'],
      interactiveElements: ['Practice exercise'],
      culturalConnections: ['Local application']
    };
  }

  private getFallbackQuiz(topic: string, questionCount: number): any {
    return {
      id: Date.now().toString(),
      title: `${topic} Practice Quiz`,
      questions: Array.from({ length: questionCount }, (_, i) => ({
        id: `fallback_q_${i}`,
        question: `Practice question ${i + 1} about ${topic}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 0,
        explanation: 'This is a practice question to help you learn.',
        difficulty: 0.5,
        topic
      })),
      estimatedTime: questionCount * 2,
      passingScore: 70
    };
  }

  private getFallbackARContent(objectName: string): any {
    return {
      title: `Learn about ${objectName}`,
      keyFacts: [
        `${objectName} is an important object in learning`,
        'It has interesting properties to explore',
        'You can find these in many places'
      ],
      interactiveElements: ['Tap to learn more', 'Rotate to see details'],
      relatedConcepts: ['Related concept 1', 'Related concept 2'],
      funFacts: [`Fun fact about ${objectName}`],
      explorationQuestions: [`What do you notice about this ${objectName}?`],
      visualElements: {
        highlights: ['Important parts'],
        annotations: ['Key features'],
        measurements: ['Size', 'Properties']
      }
    };
  }

  private getFallbackVRScenario(objective: string): any {
    return {
      scenarioId: Date.now().toString(),
      title: `VR Learning Experience: ${objective}`,
      description: 'An immersive learning environment to explore this concept.',
      environment: {
        setting: 'virtual_classroom',
        objects: ['interactive_board', 'learning_materials', '3d_models'],
        lighting: 'bright',
        physics: true
      },
      interactions: ['grab', 'point', 'voice_command'],
      learningActivities: ['exploration', 'experimentation', 'creation'],
      assessmentPoints: ['understanding_check', 'application_task'],
      adaptiveElements: ['difficulty_scaling', 'hint_system']
    };
  }

  private getFallbackGrading(essay: string, rubric: any): any {
    return {
      overallScore: 75,
      maxScore: rubric.maxScore || 100,
      criteriaScores: {
        content: 80,
        organization: 75,
        grammar: 70,
        creativity: 80
      },
      feedback: {
        strengths: ['Good use of examples', 'Clear main ideas'],
        improvements: ['Work on transitions', 'Check grammar'],
        suggestions: ['Add more supporting details', 'Vary sentence structure']
      },
      inlineFeedback: [],
      nextSteps: ['Practice writing transitions', 'Review grammar rules']
    };
  }

  // Clear cache periodically to ensure fresh content
  clearCache(): void {
    this.contentCache.clear();
  }

  // Get cache statistics
  getCacheStats(): any {
    return {
      size: this.contentCache.size,
      keys: Array.from(this.contentCache.keys())
    };
  }
}

export const contentGenerator = new ContentGenerator();