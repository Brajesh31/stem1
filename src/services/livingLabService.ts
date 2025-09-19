// Living Laboratory Service - Core functionality for real-world learning
import type { 
  VillageLabMission, 
  SubmittedData, 
  JugaadChallenge, 
  JugaadDesign, 
  CommunityProject,
  ExpertSession,
  ResearchTeam,
  VirtualComponent
} from '../types/livingLab';

class LivingLabService {
  private currentLocation: { latitude: number; longitude: number } | null = null;
  private sensorData: Map<string, any> = new Map();
  private offlineSubmissions: SubmittedData[] = [];

  constructor() {
    this.initializeGeolocation();
    this.initializeSensors();
  }

  private async initializeGeolocation(): Promise<void> {
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          });
        });
        
        this.currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      } catch (error) {
        console.error('Geolocation failed:', error);
      }
    }
  }

  private initializeSensors(): void {
    // Initialize device sensors for scientific data collection
    if ('DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', (event) => {
        this.sensorData.set('accelerometer', {
          x: event.acceleration?.x || 0,
          y: event.acceleration?.y || 0,
          z: event.acceleration?.z || 0,
          timestamp: Date.now()
        });
      });
    }

    if ('DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', (event) => {
        this.sensorData.set('orientation', {
          alpha: event.alpha || 0,
          beta: event.beta || 0,
          gamma: event.gamma || 0,
          timestamp: Date.now()
        });
      });
    }
  }

  // Village Lab Methods
  async getAvailableMissions(studentGrade: number, location?: { lat: number; lng: number }): Promise<VillageLabMission[]> {
    // Generate location-specific missions
    const baseMissions: Partial<VillageLabMission>[] = [
      {
        title: 'Monsoon Watch: Local Hydrology Study',
        description: 'Document water levels and quality in your local water bodies during monsoon season',
        type: 'monsoon_watch',
        subject: 'Environmental Science',
        difficulty: 'Medium',
        estimatedTime: 45,
        requiredSensors: ['camera', 'gps'],
        scientificValue: 85,
        dataFields: [
          {
            id: 'water_level',
            name: 'Water Level',
            type: 'number',
            required: true,
            scientificUnit: 'cm',
            helpText: 'Measure from a fixed reference point'
          },
          {
            id: 'turbidity',
            name: 'Water Clarity',
            type: 'multiple_choice',
            required: true,
            validation: { options: ['Crystal Clear', 'Slightly Cloudy', 'Muddy', 'Very Muddy'] },
            helpText: 'Visual assessment of water clarity'
          },
          {
            id: 'photo_evidence',
            name: 'Photo Documentation',
            type: 'image',
            required: true,
            helpText: 'Take photos showing water level and clarity'
          }
        ],
        rewards: {
          dataPoints: 150,
          researcherBadges: ['Hydrologist', 'Environmental Monitor'],
          virtualEquipment: 'Digital pH Meter'
        }
      },
      {
        title: 'Biodiversity Brigade: Species Documentation',
        description: 'Photograph and identify local flora and fauna to contribute to biodiversity databases',
        type: 'biodiversity_brigade',
        subject: 'Biology',
        difficulty: 'Easy',
        estimatedTime: 30,
        requiredSensors: ['camera', 'gps'],
        scientificValue: 75,
        dataFields: [
          {
            id: 'species_photo',
            name: 'Species Photograph',
            type: 'image',
            required: true,
            helpText: 'Clear photo showing identifying features'
          },
          {
            id: 'habitat_description',
            name: 'Habitat Description',
            type: 'text',
            required: true,
            helpText: 'Describe where you found this species'
          },
          {
            id: 'abundance',
            name: 'Abundance Estimate',
            type: 'multiple_choice',
            required: true,
            validation: { options: ['Rare (1-5)', 'Uncommon (6-20)', 'Common (21-100)', 'Abundant (100+)'] },
            helpText: 'Estimate how many individuals you observed'
          }
        ],
        rewards: {
          dataPoints: 100,
          researcherBadges: ['Naturalist', 'Species Spotter'],
          virtualEquipment: 'Digital Field Guide'
        }
      },
      {
        title: 'Pollinator Patrol: Agricultural Ecosystem Study',
        description: 'Track pollinators visiting local crops to understand agricultural biodiversity',
        type: 'pollinator_patrol',
        subject: 'Agriculture Science',
        difficulty: 'Hard',
        estimatedTime: 60,
        requiredSensors: ['camera', 'gps'],
        scientificValue: 90,
        dataFields: [
          {
            id: 'crop_type',
            name: 'Crop Type',
            type: 'text',
            required: true,
            helpText: 'What crop were the pollinators visiting?'
          },
          {
            id: 'pollinator_species',
            name: 'Pollinator Species',
            type: 'text',
            required: true,
            helpText: 'Identify the type of pollinator (bee, butterfly, etc.)'
          },
          {
            id: 'visit_frequency',
            name: 'Visit Frequency',
            type: 'number',
            required: true,
            scientificUnit: 'visits per 10 minutes',
            helpText: 'Count visits to flowers in a 10-minute observation period'
          },
          {
            id: 'weather_conditions',
            name: 'Weather Conditions',
            type: 'multiple_choice',
            required: true,
            validation: { options: ['Sunny', 'Partly Cloudy', 'Overcast', 'Light Rain'] },
            helpText: 'Current weather during observation'
          }
        ],
        rewards: {
          dataPoints: 200,
          researcherBadges: ['Pollination Expert', 'Agricultural Scientist'],
          virtualEquipment: 'Pollinator Identification Guide'
        }
      }
    ];

    return baseMissions.map((mission, index) => ({
      id: `mission_${index + 1}`,
      status: 'available',
      ...mission
    })) as VillageLabMission[];
  }

  async submitMissionData(missionId: string, data: any, images: File[]): Promise<SubmittedData> {
    const submission: SubmittedData = {
      id: Date.now().toString(),
      missionId,
      studentId: 'current-student',
      timestamp: new Date().toISOString(),
      location: this.currentLocation || { latitude: 0, longitude: 0, accuracy: 0 },
      data,
      images: [], // In production, upload images and store URLs
      qualityScore: this.calculateQualityScore(data, images),
      contributesToScience: true
    };

    // Store offline if no connection
    if (!navigator.onLine) {
      this.offlineSubmissions.push(submission);
    } else {
      await this.syncSubmission(submission);
    }

    return submission;
  }

  private calculateQualityScore(data: any, images: File[]): number {
    let score = 50; // Base score
    
    // Check data completeness
    const completedFields = Object.values(data).filter(value => value !== null && value !== '').length;
    const totalFields = Object.keys(data).length;
    score += (completedFields / totalFields) * 30;
    
    // Check image quality
    if (images.length > 0) {
      score += 20; // Bonus for including images
    }
    
    // Check location accuracy
    if (this.currentLocation) {
      score += 10; // Bonus for GPS data
    }
    
    return Math.min(100, Math.max(0, score));
  }

  private async syncSubmission(submission: SubmittedData): Promise<void> {
    try {
      // In production, sync with backend API
      console.log('Syncing submission:', submission);
    } catch (error) {
      console.error('Sync failed:', error);
      this.offlineSubmissions.push(submission);
    }
  }

  // Jugaad Studio Methods
  async getJugaadChallenges(difficulty?: string): Promise<JugaadChallenge[]> {
    const challenges: JugaadChallenge[] = [
      {
        id: 'challenge_1',
        title: 'Solar-Powered Irrigation Timer',
        description: 'Design a low-cost, solar-powered system that automatically waters crops at optimal times',
        category: 'agriculture',
        difficulty: 'Intermediate',
        realWorldContext: 'Many small farmers struggle with efficient water management and cannot afford expensive irrigation systems',
        constraints: {
          budget: 500, // Virtual currency
          materials: ['Solar Panel', 'Water Pump', 'Timer Circuit', 'Pipes', 'Sensors', 'Recycled Containers'],
          timeLimit: 120, // minutes
          sustainabilityRequirement: true
        },
        evaluationCriteria: {
          creativity: 25,
          costEffectiveness: 30,
          realWorldApplicability: 25,
          scientificAccuracy: 20
        },
        rewards: {
          innovationPoints: 300,
          inventorTitles: ['Agricultural Innovator', 'Solar Engineer'],
          unlockableComponents: ['Advanced Solar Panel', 'Smart Sensors']
        },
        status: 'draft'
      },
      {
        id: 'challenge_2',
        title: 'Multi-Purpose Farming Tool',
        description: 'Create a single tool that can perform multiple farming tasks using recycled materials',
        category: 'agriculture',
        difficulty: 'Beginner',
        realWorldContext: 'Small farmers need versatile, affordable tools that can handle multiple tasks',
        constraints: {
          budget: 200,
          materials: ['Metal Scraps', 'Wooden Handles', 'Rope', 'Recycled Plastic', 'Basic Hardware'],
          sustainabilityRequirement: true
        },
        evaluationCriteria: {
          creativity: 30,
          costEffectiveness: 35,
          realWorldApplicability: 25,
          scientificAccuracy: 10
        },
        rewards: {
          innovationPoints: 150,
          inventorTitles: ['Tool Designer', 'Recycling Champion']
        },
        status: 'draft'
      },
      {
        id: 'challenge_3',
        title: 'Off-Grid Communication Device',
        description: 'Design a communication system for remote areas without cellular coverage',
        category: 'communication',
        difficulty: 'Advanced',
        realWorldContext: 'Remote villages often lack reliable communication infrastructure for emergencies and coordination',
        constraints: {
          budget: 800,
          materials: ['Radio Components', 'Solar Panel', 'Battery', 'Antenna', 'Microcontroller', 'Speakers'],
          timeLimit: 180,
          sustainabilityRequirement: true
        },
        evaluationCriteria: {
          creativity: 20,
          costEffectiveness: 25,
          realWorldApplicability: 30,
          scientificAccuracy: 25
        },
        rewards: {
          innovationPoints: 500,
          inventorTitles: ['Communication Engineer', 'Rural Tech Innovator'],
          unlockableComponents: ['Advanced Radio Module', 'Satellite Communicator']
        },
        status: 'draft'
      }
    ];

    return difficulty ? challenges.filter(c => c.difficulty === difficulty) : challenges;
  }

  async getVirtualComponents(): Promise<VirtualComponent[]> {
    return [
      {
        id: 'solar_panel_basic',
        name: 'Basic Solar Panel',
        category: 'electrical',
        cost: 100,
        properties: { conductivity: 0.8, durability: 0.7 },
        realWorldEquivalent: '10W Solar Panel (~₹800)',
        unlockLevel: 1
      },
      {
        id: 'water_pump_small',
        name: 'Small Water Pump',
        category: 'mechanical',
        cost: 150,
        properties: { strength: 0.6, durability: 0.8 },
        realWorldEquivalent: '12V DC Water Pump (~₹1200)',
        unlockLevel: 2
      },
      {
        id: 'recycled_plastic',
        name: 'Recycled Plastic Sheets',
        category: 'recycled',
        cost: 20,
        properties: { flexibility: 0.9, durability: 0.5 },
        realWorldEquivalent: 'Waste plastic bottles/containers',
        unlockLevel: 1
      },
      {
        id: 'microcontroller',
        name: 'Basic Microcontroller',
        category: 'electrical',
        cost: 200,
        properties: { conductivity: 1.0, durability: 0.9 },
        realWorldEquivalent: 'Arduino Uno (~₹1500)',
        unlockLevel: 5
      },
      {
        id: 'bamboo_frame',
        name: 'Bamboo Frame',
        category: 'material',
        cost: 30,
        properties: { strength: 0.7, flexibility: 0.8, weight: 0.3 },
        realWorldEquivalent: 'Local bamboo (~₹200)',
        unlockLevel: 1
      }
    ];
  }

  async simulateDesign(design: JugaadDesign): Promise<any> {
    // Simplified physics simulation
    const components = await this.getVirtualComponents();
    const usedComponents = design.components.map(comp => 
      components.find(c => c.id === comp.componentId)
    ).filter(Boolean);

    const totalCost = design.components.reduce((sum, comp) => {
      const component = components.find(c => c.id === comp.componentId);
      return sum + (component?.cost || 0) * comp.quantity;
    }, 0);

    const functionality = this.calculateFunctionality(design, usedComponents);
    const efficiency = this.calculateEfficiency(design, usedComponents);
    const sustainability = this.calculateSustainability(design, usedComponents);

    return {
      functionality,
      efficiency,
      sustainability,
      cost: totalCost,
      feasibility: functionality * efficiency * sustainability,
      recommendations: this.generateRecommendations(design, usedComponents)
    };
  }

  private calculateFunctionality(design: JugaadDesign, components: any[]): number {
    // Simplified functionality calculation
    const hasEssentialComponents = components.some(c => c?.category === 'electrical') && 
                                  components.some(c => c?.category === 'mechanical');
    const componentSynergy = design.components.length > 1 ? 0.8 : 0.5;
    
    return hasEssentialComponents ? componentSynergy : 0.3;
  }

  private calculateEfficiency(design: JugaadDesign, components: any[]): number {
    const totalWeight = components.reduce((sum, comp) => sum + (comp?.properties?.weight || 1), 0);
    const totalStrength = components.reduce((sum, comp) => sum + (comp?.properties?.strength || 0.5), 0);
    
    return Math.min(1, totalStrength / Math.max(1, totalWeight * 0.5));
  }

  private calculateSustainability(design: JugaadDesign, components: any[]): number {
    const recycledComponents = components.filter(c => c?.category === 'recycled').length;
    const totalComponents = components.length;
    const recycledRatio = totalComponents > 0 ? recycledComponents / totalComponents : 0;
    
    const hasSolar = components.some(c => c?.name.toLowerCase().includes('solar'));
    const solarBonus = hasSolar ? 0.3 : 0;
    
    return Math.min(1, recycledRatio * 0.7 + solarBonus);
  }

  private generateRecommendations(design: JugaadDesign, components: any[]): string[] {
    const recommendations = [];
    
    if (components.length < 3) {
      recommendations.push('Consider adding more components for better functionality');
    }
    
    if (!components.some(c => c?.category === 'recycled')) {
      recommendations.push('Try incorporating recycled materials for better sustainability');
    }
    
    if (!components.some(c => c?.name.toLowerCase().includes('solar'))) {
      recommendations.push('Consider solar power for energy independence');
    }
    
    return recommendations;
  }

  // Community Science Fair Methods
  async getCommunityProjects(filters?: {
    type?: string;
    school?: string;
    subject?: string;
    featured?: boolean;
  }): Promise<CommunityProject[]> {
    // Mock community projects
    const projects: CommunityProject[] = [
      {
        id: 'project_1',
        title: 'Village Water Quality Mapping Project',
        description: 'Comprehensive study of water quality across 15 village wells using citizen science data',
        type: 'village_lab_findings',
        author: {
          studentId: 'student_1',
          studentName: 'Priya Sharma',
          school: 'Government High School, Rajasthan',
          grade: 10
        },
        content: {
          images: ['/projects/water-quality-map.jpg', '/projects/testing-setup.jpg'],
          videos: ['/projects/methodology-video.mp4'],
          documents: ['/projects/water-quality-report.pdf'],
          methodology: 'Used mobile app sensors and visual assessment to test 15 wells across the village',
          findings: 'Found 3 wells with concerning turbidity levels, 2 wells with excellent quality',
          conclusions: 'Recommended filtration systems for affected wells and regular monitoring schedule'
        },
        tags: ['water-quality', 'citizen-science', 'public-health', 'environmental-monitoring'],
        upvotes: 47,
        comments: [],
        mentorReviews: [
          {
            id: 'review_1',
            mentorId: 'mentor_1',
            mentorName: 'Dr. Rajesh Kumar',
            mentorCredentials: 'Environmental Engineer, IIT Delhi',
            rating: 4.5,
            feedback: 'Excellent methodology and clear documentation. The systematic approach to data collection is commendable.',
            suggestions: ['Consider testing pH levels', 'Add seasonal variation analysis'],
            timestamp: '2024-02-10T14:30:00Z'
          }
        ],
        scientificPartners: ['India Biodiversity Portal', 'Central Ground Water Board'],
        realWorldImpact: {
          description: 'Led to installation of water filtration systems in 3 village wells',
          beneficiaries: 450,
          measurableOutcome: '30% improvement in water quality metrics'
        },
        featured: true,
        createdAt: '2024-02-01T10:00:00Z',
        lastUpdated: '2024-02-15T16:20:00Z'
      },
      {
        id: 'project_2',
        title: 'Solar-Powered Seed Germination Chamber',
        description: 'Innovative low-cost solution for improving seed germination rates using solar energy',
        type: 'jugaad_innovation',
        author: {
          studentId: 'student_2',
          studentName: 'Arjun Patel',
          school: 'Rural Science Academy, Gujarat',
          grade: 11
        },
        content: {
          images: ['/projects/germination-chamber.jpg', '/projects/solar-setup.jpg'],
          videos: ['/projects/chamber-demo.mp4'],
          documents: ['/projects/design-specifications.pdf'],
          methodology: 'Used recycled plastic containers, solar panels, and temperature sensors to create controlled environment',
          findings: '40% improvement in germination rates compared to traditional methods',
          conclusions: 'Cost-effective solution that can be replicated by local farmers'
        },
        tags: ['solar-energy', 'agriculture', 'innovation', 'sustainability'],
        upvotes: 62,
        comments: [],
        mentorReviews: [],
        scientificPartners: ['Indian Council of Agricultural Research'],
        realWorldImpact: {
          description: 'Adopted by 12 local farmers for improved crop yields',
          beneficiaries: 60,
          measurableOutcome: '25% increase in successful crop germination'
        },
        featured: true,
        createdAt: '2024-01-28T09:15:00Z',
        lastUpdated: '2024-02-12T11:45:00Z'
      }
    ];

    if (filters) {
      return projects.filter(project => {
        if (filters.type && project.type !== filters.type) return false;
        if (filters.school && project.author.school !== filters.school) return false;
        if (filters.featured !== undefined && project.featured !== filters.featured) return false;
        return true;
      });
    }

    return projects;
  }

  async getExpertSessions(): Promise<ExpertSession[]> {
    return [
      {
        id: 'session_1',
        title: 'Climate Change and Local Agriculture',
        description: 'Interactive session on how climate change affects local farming practices',
        expertName: 'Dr. Sunita Narain',
        expertCredentials: 'Director, Centre for Science and Environment',
        scheduledAt: '2024-02-20T15:00:00Z',
        duration: 60,
        maxParticipants: 100,
        currentParticipants: 67,
        topics: ['Climate Adaptation', 'Sustainable Farming', 'Water Conservation'],
        registrationRequired: true,
        recordingAvailable: true,
        status: 'upcoming'
      },
      {
        id: 'session_2',
        title: 'Frugal Innovation in Rural Healthcare',
        description: 'Learn how simple innovations can solve complex healthcare challenges',
        expertName: 'Dr. Anil Gupta',
        expertCredentials: 'Professor, IIM Ahmedabad & Founder, Honey Bee Network',
        scheduledAt: '2024-02-25T16:30:00Z',
        duration: 90,
        maxParticipants: 150,
        currentParticipants: 23,
        topics: ['Jugaad Innovation', 'Healthcare Technology', 'Rural Solutions'],
        registrationRequired: true,
        recordingAvailable: true,
        status: 'upcoming'
      }
    ];
  }

  async createResearchTeam(teamData: {
    name: string;
    description: string;
    leaderId: string;
    projectFocus: string;
  }): Promise<ResearchTeam> {
    const team: ResearchTeam = {
      id: Date.now().toString(),
      name: teamData.name,
      description: teamData.description,
      leaderId: teamData.leaderId,
      members: [{
        studentId: teamData.leaderId,
        studentName: 'Current Student',
        school: 'Demo School',
        role: 'leader',
        joinedAt: new Date().toISOString()
      }],
      currentProject: teamData.projectFocus,
      achievements: [],
      collaborationScore: 0,
      publicationsCount: 0
    };

    return team;
  }

  // Sensor Integration Methods
  async collectSensorData(sensorType: 'accelerometer' | 'microphone' | 'camera' | 'gps'): Promise<any> {
    switch (sensorType) {
      case 'accelerometer':
        return this.sensorData.get('accelerometer') || { x: 0, y: 0, z: 0 };
      
      case 'microphone':
        return await this.collectAudioData();
      
      case 'camera':
        return await this.captureImage();
      
      case 'gps':
        return this.currentLocation;
      
      default:
        throw new Error(`Unsupported sensor type: ${sensorType}`);
    }
  }

  private async collectAudioData(): Promise<any> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      source.connect(analyser);
      analyser.fftSize = 256;
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate average volume
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
      
      // Cleanup
      stream.getTracks().forEach(track => track.stop());
      audioContext.close();
      
      return {
        averageVolume: average,
        timestamp: Date.now(),
        unit: 'dB (relative)'
      };
    } catch (error) {
      console.error('Audio data collection failed:', error);
      return { averageVolume: 0, error: 'Permission denied or not available' };
    }
  }

  private async captureImage(): Promise<any> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      return new Promise((resolve) => {
        video.addEventListener('loadedmetadata', () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(video, 0, 0);
          
          canvas.toBlob((blob) => {
            stream.getTracks().forEach(track => track.stop());
            resolve({
              imageBlob: blob,
              timestamp: Date.now(),
              location: this.currentLocation
            });
          }, 'image/jpeg', 0.8);
        });
      });
    } catch (error) {
      console.error('Image capture failed:', error);
      return { error: 'Camera not available or permission denied' };
    }
  }

  // Data Analysis Methods
  async analyzeCollectedData(submissions: SubmittedData[]): Promise<any> {
    const analysis = {
      totalSubmissions: submissions.length,
      averageQuality: submissions.reduce((sum, sub) => sum + sub.qualityScore, 0) / submissions.length,
      geographicCoverage: this.calculateGeographicCoverage(submissions),
      temporalDistribution: this.calculateTemporalDistribution(submissions),
      scientificContributions: submissions.filter(sub => sub.contributesToScience).length,
      topContributors: this.getTopContributors(submissions)
    };

    return analysis;
  }

  private calculateGeographicCoverage(submissions: SubmittedData[]): any {
    const locations = submissions.map(sub => sub.location);
    const bounds = {
      north: Math.max(...locations.map(loc => loc.latitude)),
      south: Math.min(...locations.map(loc => loc.latitude)),
      east: Math.max(...locations.map(loc => loc.longitude)),
      west: Math.min(...locations.map(loc => loc.longitude))
    };
    
    return {
      bounds,
      area: this.calculateArea(bounds),
      uniqueLocations: new Set(locations.map(loc => `${loc.latitude},${loc.longitude}`)).size
    };
  }

  private calculateArea(bounds: any): number {
    // Simplified area calculation in square kilometers
    const latDiff = bounds.north - bounds.south;
    const lngDiff = bounds.east - bounds.west;
    return latDiff * lngDiff * 111 * 111; // Rough conversion to km²
  }

  private calculateTemporalDistribution(submissions: SubmittedData[]): any {
    const hourCounts = new Array(24).fill(0);
    
    submissions.forEach(sub => {
      const hour = new Date(sub.timestamp).getHours();
      hourCounts[hour]++;
    });
    
    return {
      hourlyDistribution: hourCounts,
      peakHour: hourCounts.indexOf(Math.max(...hourCounts)),
      totalDays: new Set(submissions.map(sub => 
        new Date(sub.timestamp).toDateString()
      )).size
    };
  }

  private getTopContributors(submissions: SubmittedData[]): any[] {
    const contributorMap = new Map();
    
    submissions.forEach(sub => {
      const current = contributorMap.get(sub.studentId) || { count: 0, totalQuality: 0 };
      contributorMap.set(sub.studentId, {
        count: current.count + 1,
        totalQuality: current.totalQuality + sub.qualityScore
      });
    });
    
    return Array.from(contributorMap.entries())
      .map(([studentId, data]) => ({
        studentId,
        submissions: data.count,
        averageQuality: data.totalQuality / data.count
      }))
      .sort((a, b) => b.submissions - a.submissions)
      .slice(0, 10);
  }

  // Integration with main platform
  async syncWithMainPlatform(data: any): Promise<void> {
    // Sync Living Lab achievements with main gamification system
    const achievements = this.convertToMainAchievements(data);
    
    // Update student profile with new badges and points
    const profileUpdates = {
      researcherLevel: data.researcherLevel,
      innovatorLevel: data.innovatorLevel,
      communityContribution: data.communityContribution
    };
    
    console.log('Syncing with main platform:', { achievements, profileUpdates });
  }

  private convertToMainAchievements(data: any): any[] {
    return [
      {
        type: 'citizen_scientist',
        title: 'Citizen Scientist',
        description: 'Contributed valuable data to scientific research',
        points: data.dataPoints || 0
      },
      {
        type: 'frugal_innovator',
        title: 'Frugal Innovator',
        description: 'Created practical solutions using limited resources',
        points: data.innovationPoints || 0
      }
    ];
  }
}

export const livingLabService = new LivingLabService();