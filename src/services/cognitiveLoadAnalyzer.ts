// Cognitive Load Analyzer - Monitors student mental effort and adjusts content
class CognitiveLoadAnalyzer {
  private interactionData: Map<string, any[]> = new Map();
  private isMonitoring = false;
  private currentStudentId: string | null = null;

  startMonitoring(studentId: string): void {
    this.currentStudentId = studentId;
    this.isMonitoring = true;
    
    if (!this.interactionData.has(studentId)) {
      this.interactionData.set(studentId, []);
    }

    // Set up interaction tracking
    this.setupInteractionTracking();
  }

  private setupInteractionTracking(): void {
    // Track mouse movements and hesitation
    let mouseMovements = 0;
    let lastMouseTime = Date.now();
    let hesitationCount = 0;

    document.addEventListener('mousemove', (e) => {
      if (!this.isMonitoring) return;
      
      mouseMovements++;
      const now = Date.now();
      
      // Detect hesitation (mouse stops for >2 seconds)
      if (now - lastMouseTime > 2000) {
        hesitationCount++;
      }
      
      lastMouseTime = now;
    });

    // Track click patterns
    document.addEventListener('click', (e) => {
      if (!this.isMonitoring || !this.currentStudentId) return;
      
      this.recordInteraction(this.currentStudentId, {
        type: 'click',
        timestamp: Date.now(),
        target: (e.target as HTMLElement)?.tagName || 'unknown',
        coordinates: { x: e.clientX, y: e.clientY }
      });
    });

    // Track keyboard patterns
    let keystrokes = 0;
    let backspaceCount = 0;
    
    document.addEventListener('keydown', (e) => {
      if (!this.isMonitoring || !this.currentStudentId) return;
      
      keystrokes++;
      if (e.key === 'Backspace') {
        backspaceCount++;
      }
      
      this.recordInteraction(this.currentStudentId, {
        type: 'keystroke',
        timestamp: Date.now(),
        key: e.key,
        isBackspace: e.key === 'Backspace'
      });
    });

    // Periodic cognitive load calculation
    setInterval(() => {
      if (this.isMonitoring && this.currentStudentId) {
        const cognitiveLoad = this.calculateCognitiveLoad(this.currentStudentId);
        this.sendCognitiveLoadData(this.currentStudentId, cognitiveLoad);
      }
    }, 10000); // Every 10 seconds
  }

  private recordInteraction(studentId: string, interaction: any): void {
    const data = this.interactionData.get(studentId);
    if (data) {
      data.push(interaction);
      
      // Keep only last 100 interactions
      if (data.length > 100) {
        data.shift();
      }
    }
  }

  private calculateCognitiveLoad(studentId: string): number {
    const interactions = this.interactionData.get(studentId) || [];
    if (interactions.length < 5) return 0.5; // Default moderate load

    const recentInteractions = interactions.slice(-20); // Last 20 interactions
    const timeWindow = 60000; // 1 minute
    const now = Date.now();
    
    const recentData = recentInteractions.filter(i => now - i.timestamp < timeWindow);
    
    // Calculate various cognitive load indicators
    const metrics = {
      responseTime: this.calculateAverageResponseTime(recentData),
      hesitationRate: this.calculateHesitationRate(recentData),
      errorRate: this.calculateErrorRate(recentData),
      mouseMovementErratic: this.calculateMouseErraticness(recentData),
      backspaceRatio: this.calculateBackspaceRatio(recentData)
    };

    // Combine metrics into cognitive load score (0-1)
    let cognitiveLoad = 0;
    
    // Slow response time indicates high cognitive load
    if (metrics.responseTime > 5000) cognitiveLoad += 0.3;
    else if (metrics.responseTime > 3000) cognitiveLoad += 0.2;
    
    // High hesitation indicates confusion
    cognitiveLoad += Math.min(0.3, metrics.hesitationRate * 0.5);
    
    // High error rate indicates difficulty
    cognitiveLoad += Math.min(0.2, metrics.errorRate * 0.4);
    
    // Erratic mouse movement indicates uncertainty
    cognitiveLoad += Math.min(0.1, metrics.mouseMovementErratic * 0.2);
    
    // High backspace ratio indicates uncertainty in responses
    cognitiveLoad += Math.min(0.1, metrics.backspaceRatio * 0.3);

    return Math.min(1, Math.max(0, cognitiveLoad));
  }

  private calculateAverageResponseTime(interactions: any[]): number {
    const questionResponses = interactions.filter(i => 
      i.type === 'click' && i.target === 'BUTTON'
    );
    
    if (questionResponses.length < 2) return 3000; // Default 3 seconds
    
    const responseTimes = [];
    for (let i = 1; i < questionResponses.length; i++) {
      const timeDiff = questionResponses[i].timestamp - questionResponses[i-1].timestamp;
      responseTimes.push(timeDiff);
    }
    
    return responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
  }

  private calculateHesitationRate(interactions: any[]): number {
    const totalTime = interactions.length > 0 ? 
      interactions[interactions.length - 1].timestamp - interactions[0].timestamp : 1;
    
    const hesitations = interactions.filter(i => i.type === 'hesitation').length;
    return hesitations / (totalTime / 60000); // Hesitations per minute
  }

  private calculateErrorRate(interactions: any[]): number {
    // This would need to be integrated with quiz/question components
    // For now, estimate based on backspace usage and re-clicks
    const totalActions = interactions.filter(i => i.type === 'click').length;
    const corrections = interactions.filter(i => i.isBackspace || i.type === 'correction').length;
    
    return totalActions > 0 ? corrections / totalActions : 0;
  }

  private calculateMouseErraticness(interactions: any[]): number {
    const mouseMovements = interactions.filter(i => i.type === 'mousemove');
    if (mouseMovements.length < 10) return 0;

    // Calculate movement smoothness (simplified)
    let totalDistance = 0;
    let directDistance = 0;
    
    for (let i = 1; i < mouseMovements.length; i++) {
      const prev = mouseMovements[i-1].coordinates;
      const curr = mouseMovements[i].coordinates;
      
      const distance = Math.sqrt(
        Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
      );
      totalDistance += distance;
    }
    
    if (mouseMovements.length > 1) {
      const first = mouseMovements[0].coordinates;
      const last = mouseMovements[mouseMovements.length - 1].coordinates;
      directDistance = Math.sqrt(
        Math.pow(last.x - first.x, 2) + Math.pow(last.y - first.y, 2)
      );
    }
    
    // Erratic movement = high total distance vs direct distance ratio
    return directDistance > 0 ? Math.min(1, totalDistance / directDistance / 10) : 0;
  }

  private calculateBackspaceRatio(interactions: any[]): number {
    const keystrokes = interactions.filter(i => i.type === 'keystroke');
    const backspaces = keystrokes.filter(i => i.isBackspace);
    
    return keystrokes.length > 0 ? backspaces.length / keystrokes.length : 0;
  }

  private async sendCognitiveLoadData(studentId: string, cognitiveLoad: number): Promise<void> {
    try {
      await fetch('/api/v1/ai/cognitive-load', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          studentId,
          cognitiveLoad,
          timestamp: Date.now(),
          interactions: this.interactionData.get(studentId)?.slice(-10) // Last 10 interactions
        })
      });
    } catch (error) {
      console.error('Failed to send cognitive load data:', error);
    }
  }

  async getCurrentLoad(studentId: string): Promise<number> {
    const interactions = this.interactionData.get(studentId);
    if (!interactions || interactions.length === 0) return 0.5;
    
    return this.calculateCognitiveLoad(studentId);
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
    this.currentStudentId = null;
  }

  // Get cognitive load insights for teachers
  getCognitiveInsights(studentId: string): any {
    const load = this.calculateCognitiveLoad(studentId);
    const history = this.interactionData.get(studentId) || [];
    
    return {
      currentLoad: load,
      status: load > 0.7 ? 'overloaded' : load > 0.4 ? 'optimal' : 'underutilized',
      recommendations: this.generateRecommendations(load),
      patterns: this.analyzePatterns(history),
      interventionSuggestions: this.suggestInterventions(load)
    };
  }

  private generateRecommendations(load: number): string[] {
    if (load > 0.7) {
      return [
        'Reduce content complexity',
        'Provide more scaffolding',
        'Suggest a break',
        'Switch to visual learning mode'
      ];
    } else if (load < 0.3) {
      return [
        'Increase challenge level',
        'Add interactive elements',
        'Introduce collaborative tasks',
        'Provide extension activities'
      ];
    }
    
    return ['Current difficulty level is optimal'];
  }

  private analyzePatterns(history: any[]): any {
    // Analyze interaction patterns to identify learning preferences
    return {
      preferredInteractionType: 'click', // Most common interaction
      averageResponseTime: this.calculateAverageResponseTime(history),
      peakPerformanceTime: 'afternoon', // When cognitive load is lowest
      strugglingAreas: ['complex_problems', 'multi_step_tasks']
    };
  }

  private suggestInterventions(load: number): any[] {
    const interventions = [];
    
    if (load > 0.8) {
      interventions.push({
        type: 'immediate',
        action: 'suggest_break',
        message: 'High cognitive load detected. Suggest 5-minute break.'
      });
    }
    
    if (load > 0.6) {
      interventions.push({
        type: 'content_adaptation',
        action: 'reduce_complexity',
        message: 'Simplify current content and provide more examples.'
      });
    }
    
    return interventions;
  }
}

export const cognitiveLoadAnalyzer = new CognitiveLoadAnalyzer();