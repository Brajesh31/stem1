// Multilingual Service with Indian Language Support
class MultilingualService {
  private currentLanguage = 'en';
  private translations: Map<string, Map<string, string>> = new Map();
  private speechRecognition: any = null;
  private speechSynthesis: SpeechSynthesis | null = null;

  // Supported Indian languages
  private supportedLanguages = {
    'en': { name: 'English', native: 'English', rtl: false },
    'hi': { name: 'Hindi', native: 'हिन्दी', rtl: false },
    'bn': { name: 'Bengali', native: 'বাংলা', rtl: false },
    'te': { name: 'Telugu', native: 'తెలుగు', rtl: false },
    'mr': { name: 'Marathi', native: 'मराठी', rtl: false },
    'ta': { name: 'Tamil', native: 'தமிழ்', rtl: false },
    'gu': { name: 'Gujarati', native: 'ગુજરાતી', rtl: false },
    'kn': { name: 'Kannada', native: 'ಕನ್ನಡ', rtl: false },
    'ml': { name: 'Malayalam', native: 'മലയാളം', rtl: false },
    'pa': { name: 'Punjabi', native: 'ਪੰਜਾਬੀ', rtl: false },
    'or': { name: 'Odia', native: 'ଓଡ଼ିଆ', rtl: false },
    'as': { name: 'Assamese', native: 'অসমীয়া', rtl: false },
    'ur': { name: 'Urdu', native: 'اردو', rtl: true }
  };

  constructor() {
    this.initializeSpeechServices();
    this.loadTranslations();
  }

  private initializeSpeechServices(): void {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.speechRecognition = new SpeechRecognition();
      this.speechRecognition.continuous = false;
      this.speechRecognition.interimResults = true;
    }

    // Initialize Speech Synthesis
    if ('speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis;
    }
  }

  private async loadTranslations(): Promise<void> {
    // Load translations from offline storage or bundled files
    try {
      // In production, these would be loaded from compressed files
      const languages = Object.keys(this.supportedLanguages);
      
      for (const lang of languages) {
        const translations = await this.loadLanguageFile(lang);
        this.translations.set(lang, new Map(Object.entries(translations)));
      }
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  }

  private async loadLanguageFile(language: string): Promise<Record<string, string>> {
    // Mock translation data - in production, load from files
    const mockTranslations: Record<string, Record<string, string>> = {
      'en': {
        'welcome': 'Welcome to Project Spark',
        'quest_board': 'Epic Quest Board',
        'skill_trees': 'Knowledge Trees',
        'mathematics': 'Mathematics',
        'physics': 'Physics',
        'chemistry': 'Chemistry',
        'biology': 'Biology',
        'start_quest': 'Begin Adventure',
        'complete_quest': 'Achieve Victory',
        'level_up': 'Level Up!',
        'experience_gained': 'Spark Power Gained',
        'well_done': 'Epic Victory!'
      },
      'hi': {
        'welcome': 'प्रोजेक्ट स्पार्क में आपका स्वागत है',
        'quest_board': 'महाकाव्य क्वेस्ट बोर्ड',
        'skill_trees': 'ज्ञान वृक्ष',
        'mathematics': 'गणित',
        'physics': 'भौतिकी',
        'chemistry': 'रसायन विज्ञान',
        'biology': 'जीव विज्ञान',
        'start_quest': 'साहसिक यात्रा शुरू करें',
        'complete_quest': 'विजय प्राप्त करें',
        'level_up': 'स्तर बढ़ा!',
        'experience_gained': 'स्पार्क शक्ति प्राप्त',
        'well_done': 'महान विजय!'
      },
      'bn': {
        'welcome': 'প্রজেক্ট স্পার্কে স্বাগতম',
        'quest_board': 'মহাকাব্যিক কোয়েস্ট বোর্ড',
        'skill_trees': 'জ্ঞান বৃক্ষ',
        'mathematics': 'গণিত',
        'physics': 'পদার্থবিজ্ঞান',
        'chemistry': 'রসায়ন',
        'biology': 'জীববিজ্ঞান',
        'start_quest': 'অভিযান শুরু করুন',
        'complete_quest': 'বিজয় অর্জন করুন',
        'level_up': 'লেভেল আপ!',
        'experience_gained': 'স্পার্ক শক্তি অর্জিত',
        'well_done': 'মহান বিজয়!'
      }
    };

    return mockTranslations[language] || mockTranslations['en'];
  }

  // Get translation for a key
  translate(key: string, language?: string): string {
    const lang = language || this.currentLanguage;
    const langTranslations = this.translations.get(lang);
    
    if (langTranslations && langTranslations.has(key)) {
      return langTranslations.get(key)!;
    }
    
    // Fallback to English
    const englishTranslations = this.translations.get('en');
    if (englishTranslations && englishTranslations.has(key)) {
      return englishTranslations.get(key)!;
    }
    
    return key; // Return key if no translation found
  }

  // Set current language
  setLanguage(language: string): void {
    if (this.supportedLanguages[language as keyof typeof this.supportedLanguages]) {
      this.currentLanguage = language;
      localStorage.setItem('preferred-language', language);
      
      // Update document direction for RTL languages
      const isRTL = this.supportedLanguages[language as keyof typeof this.supportedLanguages].rtl;
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }

  // Get current language
  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  // Get supported languages
  getSupportedLanguages(): typeof this.supportedLanguages {
    return this.supportedLanguages;
  }

  // Speech recognition with dialect support
  async startSpeechRecognition(language: string = this.currentLanguage): Promise<string> {
    if (!this.speechRecognition) {
      throw new Error('Speech recognition not supported');
    }

    return new Promise((resolve, reject) => {
      this.speechRecognition.lang = this.getLanguageCode(language);
      this.speechRecognition.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        resolve(result);
      };
      
      this.speechRecognition.onerror = (event: any) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };
      
      this.speechRecognition.start();
    });
  }

  // Text-to-speech with language support
  async speak(text: string, language: string = this.currentLanguage): Promise<void> {
    if (!this.speechSynthesis) {
      throw new Error('Speech synthesis not supported');
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.getLanguageCode(language);
      
      // Find appropriate voice
      const voices = this.speechSynthesis!.getVoices();
      const voice = voices.find(v => v.lang.startsWith(language)) || voices[0];
      if (voice) utterance.voice = voice;
      
      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));
      
      this.speechSynthesis!.speak(utterance);
    });
  }

  // Code-switching support (multilingual in one lesson)
  translateMixed(text: string, primaryLang: string, secondaryLang: string): string {
    // Simple implementation - in production, use NLP for better code-switching
    const words = text.split(' ');
    const mixedText = words.map((word, index) => {
      // Alternate languages for demonstration
      const usePrimary = index % 3 !== 0;
      const lang = usePrimary ? primaryLang : secondaryLang;
      return this.translate(word.toLowerCase(), lang) || word;
    });
    
    return mixedText.join(' ');
  }

  // Cultural adaptation of content
  adaptContentCulturally(content: any, language: string): any {
    const culturalAdaptations: Record<string, any> = {
      'hi': {
        currency: '₹',
        examples: {
          'distance': 'किलोमीटर',
          'temperature': 'सेल्सियस',
          'festivals': ['दिवाली', 'होली', 'दशहरा']
        }
      },
      'bn': {
        currency: '৳',
        examples: {
          'distance': 'কিলোমিটার',
          'temperature': 'সেলসিয়াস',
          'festivals': ['দুর্গাপূজা', 'কালীপূজা', 'পয়লা বৈশাখ']
        }
      }
    };

    const adaptation = culturalAdaptations[language];
    if (adaptation) {
      return {
        ...content,
        culturalContext: adaptation,
        examples: this.localizeExamples(content.examples, adaptation.examples)
      };
    }

    return content;
  }

  private localizeExamples(examples: any[], localExamples: any): any[] {
    // Replace generic examples with culturally relevant ones
    return examples.map(example => ({
      ...example,
      context: localExamples[example.type] || example.context
    }));
  }

  private getLanguageCode(language: string): string {
    const languageCodes: Record<string, string> = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'bn': 'bn-IN',
      'te': 'te-IN',
      'mr': 'mr-IN',
      'ta': 'ta-IN',
      'gu': 'gu-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'pa': 'pa-IN',
      'or': 'or-IN',
      'as': 'as-IN',
      'ur': 'ur-IN'
    };
    
    return languageCodes[language] || 'en-US';
  }

  // Visual speech/lip-reading support (placeholder for AI integration)
  async enableVisualSpeech(): Promise<void> {
    // This would integrate with a visual speech recognition AI model
    console.log('Visual speech recognition enabled');
  }

  // Dialect-aware processing
  processDialect(text: string, dialect: string): string {
    // Placeholder for dialect-specific processing
    // In production, this would use NLP models trained on specific dialects
    return text;
  }
}

export const multilingualService = new MultilingualService();