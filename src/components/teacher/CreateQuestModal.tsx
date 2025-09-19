import React, { useState } from 'react';
import { X, BookOpen, Save, Wand2 } from 'lucide-react';
import { useAppDispatch } from '../../store';
import { addNotification } from '../../store/slices/uiSlice';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface CreateQuestModalProps {
  onClose: () => void;
  onSuccess: (questData: any) => void;
}

const CreateQuestModal: React.FC<CreateQuestModalProps> = ({ onClose, onSuccess }) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: 'Mathematics',
    grade: 8,
    difficulty: 'Medium',
    experienceReward: 150,
    crystalsReward: 25,
    sparksReward: 10,
    estimatedTime: 30
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography'];
  const difficulties = ['Easy', 'Medium', 'Hard', 'Epic'];
  const grades = Array.from({ length: 7 }, (_, i) => i + 6);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Quest title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Quest description is required';
    }
    
    if (formData.experienceReward < 50 || formData.experienceReward > 1000) {
      newErrors.experienceReward = 'Experience reward must be between 50 and 1000';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const questData = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        isActive: true
      };
      
      onSuccess(questData);
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Creation Failed',
        message: 'Failed to create quest. Please try again.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const generateQuestIdeas = () => {
    const ideas = {
      'Mathematics': [
        'The Algebra Awakening',
        'Geometry Guardian Challenge',
        'Calculus Crusade',
        'Statistics Safari',
        'Number Theory Quest'
      ],
      'Physics': [
        'Forces of Nature',
        'Energy Expedition',
        'Wave Warrior Challenge',
        'Quantum Quest',
        'Mechanics Master'
      ],
      'Chemistry': [
        'Atomic Adventure',
        'Reaction Revolution',
        'Periodic Pursuit',
        'Molecular Mystery',
        'Chemical Detective'
      ],
      'Biology': [
        'Cell Saga',
        'Evolution Epic',
        'Genetics Journey',
        'Ecosystem Explorer',
        'DNA Detective'
      ],
      'English': [
        'The Storyteller\'s Quest',
        'Poetry Paladin',
        'Grammar Guardian',
        'Literature Legend',
        'Writing Wizard'
      ]
    };

    const subjectIdeas = ideas[formData.subject as keyof typeof ideas] || ideas.Mathematics;
    const randomIdea = subjectIdeas[Math.floor(Math.random() * subjectIdeas.length)];
    setFormData(prev => ({ ...prev, title: randomIdea }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Create New Quest</h2>
              <p className="text-green-100 mt-1">Design an engaging learning adventure</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quest Details</h3>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={generateQuestIdeas}
                icon={<Wand2 className="w-4 h-4" />}
              >
                Generate Ideas
              </Button>
            </div>

            <Input
              label="Quest Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter an exciting quest title"
              error={errors.title}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quest Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the learning adventure and what students will discover"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Quest Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subject
              </label>
              <select
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Grade Level
              </label>
              <select
                value={formData.grade}
                onChange={(e) => handleInputChange('grade', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                {grades.map(grade => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Rewards Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reward Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Experience Points"
                type="number"
                value={formData.experienceReward}
                onChange={(e) => handleInputChange('experienceReward', parseInt(e.target.value))}
                min={50}
                max={1000}
                error={errors.experienceReward}
                required
              />

              <Input
                label="Crystals"
                type="number"
                value={formData.crystalsReward}
                onChange={(e) => handleInputChange('crystalsReward', parseInt(e.target.value))}
                min={5}
                max={100}
                required
              />

              <Input
                label="Sparks"
                type="number"
                value={formData.sparksReward}
                onChange={(e) => handleInputChange('sparksReward', parseInt(e.target.value))}
                min={1}
                max={50}
                required
              />
            </div>

            <Input
              label="Estimated Time (minutes)"
              type="number"
              value={formData.estimatedTime}
              onChange={(e) => handleInputChange('estimatedTime', parseInt(e.target.value))}
              min={5}
              max={120}
              helperText="How long should this quest take to complete?"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              className="flex-1"
              icon={<Save className="w-4 h-4" />}
            >
              Create Quest
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuestModal;