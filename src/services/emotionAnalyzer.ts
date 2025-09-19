// Emotion Recognition Engine using Computer Vision and Audio Analysis
class EmotionAnalyzer {
  private isActive = false;
  private videoStream: MediaStream | null = null;
  private audioStream: MediaStream | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
  private emotionHistory: Map<string, any[]> = new Map();

  async initialize(): Promise<boolean> {
    try {
      // Request camera and microphone permissions
      this.videoStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 },
        audio: true 
      });

      // Create canvas for video analysis
      this.canvas = document.createElement('canvas');
      this.canvas.width = 640;
      this.canvas.height = 480;
      this.context = this.canvas.getContext('2d');

      return true;
    } catch (error) {
      console.error('Failed to initialize emotion analyzer:', error);
      return false;
    }
  }

  async startAnalysis(studentId: string): Promise<void> {
    if (!this.videoStream || this.isActive) return;

    this.isActive = true;
    const video = document.createElement('video');
    video.srcObject = this.videoStream;
    video.play();

    // Analyze emotions every 2 seconds
    const analysisInterval = setInterval(async () => {
      if (!this.isActive) {
        clearInterval(analysisInterval);
        return;
      }

      try {
        const emotionData = await this.analyzeFrame(video, studentId);
        this.updateEmotionHistory(studentId, emotionData);
        
        // Send to backend for processing
        await this.sendEmotionData(studentId, emotionData);
      } catch (error) {
        console.error('Emotion analysis error:', error);
      }
    }, 2000);
  }

  private async analyzeFrame(video: HTMLVideoElement, studentId: string): Promise<any> {
    if (!this.context || !this.canvas) return null;

    // Draw current video frame to canvas
    this.context.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);
    
    // Get image data for analysis
    const imageData = this.canvas.toDataURL('image/jpeg', 0.8);
    
    // Simplified emotion detection (in production, use TensorFlow.js or cloud API)
    const emotions = await this.detectEmotions(imageData);
    
    // Analyze audio for additional emotional cues
    const audioEmotions = await this.analyzeAudioEmotions();
    
    return {
      timestamp: Date.now(),
      visual: emotions,
      audio: audioEmotions,
      combined: this.combineEmotionData(emotions, audioEmotions)
    };
  }

  private async detectEmotions(imageData: string): Promise<any> {
    // Simplified emotion detection - in production, integrate with:
    // - TensorFlow.js face-api models
    // - Azure Cognitive Services Face API
    // - AWS Rekognition
    
    // Mock emotion detection for demo
    const mockEmotions = {
      happiness: Math.random() * 0.3 + 0.4,
      sadness: Math.random() * 0.2,
      anger: Math.random() * 0.1,
      fear: Math.random() * 0.1,
      surprise: Math.random() * 0.2,
      disgust: Math.random() * 0.1,
      neutral: Math.random() * 0.3 + 0.2,
      engagement: Math.random() * 0.4 + 0.5,
      confusion: Math.random() * 0.3,
      boredom: Math.random() * 0.2
    };

    return mockEmotions;
  }

  private async analyzeAudioEmotions(): Promise<any> {
    // Analyze audio stream for emotional indicators
    // - Voice tone analysis
    // - Speech pattern recognition
    // - Silence/hesitation detection
    
    return {
      voiceTone: 'neutral',
      speechRate: 1.0,
      hesitationLevel: 0.2,
      volumeLevel: 0.6
    };
  }

  private combineEmotionData(visual: any, audio: any): any {
    // Combine visual and audio emotion data for more accurate assessment
    return {
      primaryEmotion: this.getPrimaryEmotion(visual),
      engagement: (visual.engagement + (1 - audio.hesitationLevel)) / 2,
      frustration: Math.max(visual.anger, visual.confusion),
      confidence: visual.happiness * (1 - audio.hesitationLevel),
      needsSupport: visual.confusion > 0.6 || audio.hesitationLevel > 0.7
    };
  }

  private getPrimaryEmotion(emotions: any): string {
    const emotionEntries = Object.entries(emotions);
    const [primaryEmotion] = emotionEntries.reduce((max, current) => 
      current[1] > max[1] ? current : max
    );
    return primaryEmotion;
  }

  private updateEmotionHistory(studentId: string, emotionData: any): void {
    if (!this.emotionHistory.has(studentId)) {
      this.emotionHistory.set(studentId, []);
    }
    
    const history = this.emotionHistory.get(studentId)!;
    history.push(emotionData);
    
    // Keep only last 50 data points
    if (history.length > 50) {
      history.shift();
    }
  }

  private async sendEmotionData(studentId: string, emotionData: any): Promise<void> {
    try {
      await fetch('/api/v1/ai/emotion-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          studentId,
          emotionData,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Failed to send emotion data:', error);
    }
  }

  async getCurrentEmotion(studentId: string): Promise<any> {
    const history = this.emotionHistory.get(studentId);
    if (!history || history.length === 0) {
      return { engagement: 0.5, frustration: 0.2, confidence: 0.6 };
    }

    // Return most recent emotion data
    return history[history.length - 1].combined;
  }

  stopAnalysis(): void {
    this.isActive = false;
    
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }
    
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
    }
  }

  // Get emotion trends over time
  getEmotionTrends(studentId: string, timeRange: number = 300000): any {
    const history = this.emotionHistory.get(studentId) || [];
    const cutoff = Date.now() - timeRange;
    
    const recentHistory = history.filter(data => data.timestamp > cutoff);
    
    if (recentHistory.length === 0) return null;

    // Calculate trends
    const avgEngagement = recentHistory.reduce((sum, data) => sum + data.combined.engagement, 0) / recentHistory.length;
    const avgFrustration = recentHistory.reduce((sum, data) => sum + data.combined.frustration, 0) / recentHistory.length;
    const avgConfidence = recentHistory.reduce((sum, data) => sum + data.combined.confidence, 0) / recentHistory.length;

    return {
      engagement: avgEngagement,
      frustration: avgFrustration,
      confidence: avgConfidence,
      trend: this.calculateTrend(recentHistory),
      dataPoints: recentHistory.length
    };
  }

  private calculateTrend(history: any[]): 'improving' | 'declining' | 'stable' {
    if (history.length < 3) return 'stable';

    const recent = history.slice(-3);
    const earlier = history.slice(-6, -3);

    const recentAvg = recent.reduce((sum, data) => sum + data.combined.engagement, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, data) => sum + data.combined.engagement, 0) / earlier.length;

    const difference = recentAvg - earlierAvg;
    
    if (difference > 0.1) return 'improving';
    if (difference < -0.1) return 'declining';
    return 'stable';
  }
}

export const emotionAnalyzer = new EmotionAnalyzer();