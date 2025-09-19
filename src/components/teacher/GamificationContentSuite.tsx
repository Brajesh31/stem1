import React, { useState } from 'react';
import { 
  Wand2, 
  Trophy, 
  Star, 
  Target, 
  Plus,
  Save,
  Eye,
  Play,
  Settings,
  Award,
  Zap
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Input from '../ui/Input';

interface CustomBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: {
    type: 'points' | 'quests' | 'streak' | 'collaboration';
    threshold: number;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  pointValue: number;
}

interface InteractiveContent {
  id: string;
  title: string;
  type: 'branching_story' | 'matching_game' | 'timed_challenge' | 'simulation';
  subject: string;
  difficulty: number;
  estimatedTime: number;
  content: any;
}

const GamificationContentSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'points' | 'badges' | 'content' | 'preview'>('points');
  const [newBadge, setNewBadge] = useState<Partial<CustomBadge>>({
    name: '',
    description: '',
    icon: '🏆',
    criteria: { type: 'points', threshold: 100 },
    rarity: 'common',
    pointValue: 50
  });
  const [contentBuilder, setContentBuilder] = useState({
    title: '',
    type: 'branching_story',
    subject: 'Physics',
    scenario: '',
    choices: [{ text: '', consequence: '', isCorrect: false }]
  });

  const pointActivities = [
    { activity: 'Complete Quest', points: 100, editable: true },
    { activity: 'Daily Login', points: 10, editable: true },
    { activity: 'Help Peer', points: 25, editable: true },
    { activity: 'Perfect Quiz Score', points: 50, editable: true },
    { activity: 'Submit Assignment Early', points: 15, editable: true }
  ];

  const iconOptions = ['🏆', '⭐', '🎯', '🔥', '💎', '⚡', '🧠', '🎨', '🚀', '👑', '🦉', '🌟'];

  const handleCreateBadge = () => {
    if (!newBadge.name || !newBadge.description) return;

    const badge: CustomBadge = {
      id: Date.now().toString(),
      name: newBadge.name!,
      description: newBadge.description!,
      icon: newBadge.icon!,
      criteria: newBadge.criteria!,
      rarity: newBadge.rarity!,
      pointValue: newBadge.pointValue!
    };

    console.log('Created badge:', badge);
    
    // Reset form
    setNewBadge({
      name: '',
      description: '',
      icon: '🏆',
      criteria: { type: 'points', threshold: 100 },
      rarity: 'common',
      pointValue: 50
    });
  };

  const handleCreateContent = () => {
    const content: InteractiveContent = {
      id: Date.now().toString(),
      title: contentBuilder.title,
      type: contentBuilder.type as any,
      subject: contentBuilder.subject,
      difficulty: 0.5,
      estimatedTime: 15,
      content: {
        scenario: contentBuilder.scenario,
        choices: contentBuilder.choices
      }
    };

    console.log('Created interactive content:', content);
  };

  const addChoice = () => {
    setContentBuilder({
      ...contentBuilder,
      choices: [...contentBuilder.choices, { text: '', consequence: '', isCorrect: false }]
    });
  };

  const updateChoice = (index: number, field: string, value: any) => {
    const newChoices = [...contentBuilder.choices];
    newChoices[index] = { ...newChoices[index], [field]: value };
    setContentBuilder({ ...contentBuilder, choices: newChoices });
  };

  const renderPointsManager = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Activity Point Values</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          {pointActivities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-white font-medium">{activity.activity}</span>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={activity.points}
                  onChange={(e) => {
                    // Update points logic here
                  }}
                  className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <span className="text-white/60 text-sm">points</span>
              </div>
            </div>
          ))}
          
          <Button variant="primary" className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Save Point Values
          </Button>
        </CardBody>
      </Card>
    </div>
  );

  const renderBadgeCreator = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Create Custom Badge</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Badge Name"
              value={newBadge.name || ''}
              onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })}
              placeholder="Enter badge name"
            />
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Badge Icon</label>
              <div className="grid grid-cols-6 gap-2">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setNewBadge({ ...newBadge, icon })}
                    className={`text-2xl p-2 rounded-lg border-2 transition-all duration-200 ${
                      newBadge.icon === icon
                        ? 'border-orange-400 bg-orange-500/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
            <textarea
              value={newBadge.description || ''}
              onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })}
              placeholder="Describe how students can earn this badge"
              rows={3}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Criteria Type</label>
              <select
                value={newBadge.criteria?.type || 'points'}
                onChange={(e) => setNewBadge({
                  ...newBadge,
                  criteria: { ...newBadge.criteria!, type: e.target.value as any }
                })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="points" className="bg-gray-800">Points Earned</option>
                <option value="quests" className="bg-gray-800">Quests Completed</option>
                <option value="streak" className="bg-gray-800">Learning Streak</option>
                <option value="collaboration" className="bg-gray-800">Peer Interactions</option>
              </select>
            </div>

            <Input
              label="Threshold"
              type="number"
              value={newBadge.criteria?.threshold || 100}
              onChange={(e) => setNewBadge({
                ...newBadge,
                criteria: { ...newBadge.criteria!, threshold: parseInt(e.target.value) || 100 }
              })}
            />

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Rarity</label>
              <select
                value={newBadge.rarity || 'common'}
                onChange={(e) => setNewBadge({ ...newBadge, rarity: e.target.value as any })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="common" className="bg-gray-800">Common</option>
                <option value="rare" className="bg-gray-800">Rare</option>
                <option value="epic" className="bg-gray-800">Epic</option>
                <option value="legendary" className="bg-gray-800">Legendary</option>
              </select>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={handleCreateBadge}
            disabled={!newBadge.name || !newBadge.description}
            className="w-full"
            icon={<Plus className="w-4 h-4" />}
          >
            Create Badge
          </Button>
        </CardBody>
      </Card>
    </div>
  );

  const renderContentBuilder = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Interactive Content Builder</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Content Title"
              value={contentBuilder.title}
              onChange={(e) => setContentBuilder({ ...contentBuilder, title: e.target.value })}
              placeholder="Enter content title"
            />
            
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Content Type</label>
              <select
                value={contentBuilder.type}
                onChange={(e) => setContentBuilder({ ...contentBuilder, type: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="branching_story" className="bg-gray-800">Branching Story</option>
                <option value="matching_game" className="bg-gray-800">Matching Game</option>
                <option value="timed_challenge" className="bg-gray-800">Timed Challenge</option>
                <option value="simulation" className="bg-gray-800">Simulation</option>
              </select>
            </div>
          </div>

          {contentBuilder.type === 'branching_story' && (
            <>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Story Scenario</label>
                <textarea
                  value={contentBuilder.scenario}
                  onChange={(e) => setContentBuilder({ ...contentBuilder, scenario: e.target.value })}
                  placeholder="Set up the story scenario..."
                  rows={4}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-white">Story Choices</h4>
                  <Button variant="secondary" size="sm" onClick={addChoice}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Choice
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {contentBuilder.choices.map((choice, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                        <Input
                          placeholder="Choice text"
                          value={choice.text}
                          onChange={(e) => updateChoice(index, 'text', e.target.value)}
                        />
                        <Input
                          placeholder="Consequence/outcome"
                          value={choice.consequence}
                          onChange={(e) => updateChoice(index, 'consequence', e.target.value)}
                        />
                      </div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={choice.isCorrect}
                          onChange={(e) => updateChoice(index, 'isCorrect', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-white/80 text-sm">Correct/Optimal choice</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="flex space-x-3">
            <Button
              variant="primary"
              onClick={handleCreateContent}
              disabled={!contentBuilder.title}
              className="flex-1"
              icon={<Save className="w-4 h-4" />}
            >
              Save Content
            </Button>
            <Button variant="secondary" icon={<Eye className="w-4 h-4" />}>
              Preview
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Wand2 className="w-8 h-8 text-orange-400" />
          <h1 className="text-3xl font-bold text-white">Gamification & Content Suite</h1>
        </div>
        <Badge variant="warning">Content Creator</Badge>
      </div>

      {/* Navigation */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-1">
        <div className="flex space-x-1">
          {[
            { id: 'points', label: 'Point System', icon: Zap },
            { id: 'badges', label: 'Badge Creator', icon: Award },
            { id: 'content', label: 'Content Builder', icon: Wand2 },
            { id: 'preview', label: 'Preview & Test', icon: Play }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'points' && renderPointsManager()}
      {activeTab === 'badges' && renderBadgeCreator()}
      {activeTab === 'content' && renderContentBuilder()}
      {activeTab === 'preview' && (
        <Card>
          <CardBody className="p-8 text-center">
            <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Content Preview</h2>
            <p className="text-white/70">Preview and test your gamified content before publishing</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default GamificationContentSuite;