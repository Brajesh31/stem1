import React, { useState } from 'react';
import { 
  Users, 
  MessageCircle, 
  Settings, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Flag,
  Pin,
  UserPlus
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Input from '../ui/Input';

interface ForumTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  isPinned: boolean;
  posts: number;
  lastActivity: string;
  createdBy: string;
}

interface StudentGroup {
  id: string;
  name: string;
  members: string[];
  project: string;
  status: 'active' | 'completed' | 'planning';
  createdAt: string;
}

interface Workshop {
  id: string;
  title: string;
  description: string;
  rubric: {
    criteria: string;
    points: number;
  }[];
  submissions: number;
  deadline: string;
  status: 'draft' | 'active' | 'completed';
}

const CollaborationManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'forums' | 'groups' | 'workshops'>('forums');
  const [newTopic, setNewTopic] = useState({ title: '', description: '', category: 'general' });
  const [newGroup, setNewGroup] = useState({ name: '', project: '', members: [] as string[] });
  const [newWorkshop, setNewWorkshop] = useState({
    title: '',
    description: '',
    rubric: [{ criteria: '', points: 10 }],
    deadline: ''
  });

  const forumTopics: ForumTopic[] = [
    {
      id: '1',
      title: 'Physics Problem Solving Strategies',
      description: 'Share and discuss different approaches to solving physics problems',
      category: 'Physics',
      isPinned: true,
      posts: 23,
      lastActivity: '2 hours ago',
      createdBy: 'Dr. Johnson'
    },
    {
      id: '2',
      title: 'Chemistry Lab Safety Discussion',
      description: 'Important safety protocols and best practices for lab work',
      category: 'Chemistry',
      isPinned: true,
      posts: 15,
      lastActivity: '1 day ago',
      createdBy: 'Prof. Patel'
    },
    {
      id: '3',
      title: 'Math Study Tips and Tricks',
      description: 'Students share effective study methods for mathematics',
      category: 'Mathematics',
      isPinned: false,
      posts: 34,
      lastActivity: '3 hours ago',
      createdBy: 'Ms. Sharma'
    }
  ];

  const studentGroups: StudentGroup[] = [
    {
      id: '1',
      name: 'Physics Explorers',
      members: ['Alex Chen', 'Maria Santos', 'David Kim'],
      project: 'Renewable Energy Research',
      status: 'active',
      createdAt: '2024-02-10'
    },
    {
      id: '2',
      name: 'Chemistry Lab Partners',
      members: ['Sarah Wilson', 'James Rodriguez', 'Lisa Park'],
      project: 'Organic Compound Analysis',
      status: 'planning',
      createdAt: '2024-02-12'
    },
    {
      id: '3',
      name: 'Math Problem Solvers',
      members: ['Emma Thompson', 'Michael Chang', 'Anna Foster', 'John Doe'],
      project: 'Calculus Applications Project',
      status: 'completed',
      createdAt: '2024-01-28'
    }
  ];

  const workshops: Workshop[] = [
    {
      id: '1',
      title: 'Physics Lab Report Peer Review',
      description: 'Students review and provide feedback on lab reports',
      rubric: [
        { criteria: 'Hypothesis clarity', points: 20 },
        { criteria: 'Methodology description', points: 25 },
        { criteria: 'Data analysis', points: 25 },
        { criteria: 'Conclusion validity', points: 20 },
        { criteria: 'Writing quality', points: 10 }
      ],
      submissions: 12,
      deadline: '2024-02-22',
      status: 'active'
    },
    {
      id: '2',
      title: 'Chemistry Experiment Design Review',
      description: 'Peer evaluation of experimental procedures',
      rubric: [
        { criteria: 'Safety considerations', points: 30 },
        { criteria: 'Procedure clarity', points: 25 },
        { criteria: 'Expected outcomes', points: 25 },
        { criteria: 'Innovation', points: 20 }
      ],
      submissions: 8,
      deadline: '2024-02-25',
      status: 'draft'
    }
  ];

  const handleCreateTopic = () => {
    if (!newTopic.title.trim()) return;
    
    console.log('Creating forum topic:', newTopic);
    setNewTopic({ title: '', description: '', category: 'general' });
  };

  const handleCreateGroup = () => {
    if (!newGroup.name.trim()) return;
    
    console.log('Creating student group:', newGroup);
    setNewGroup({ name: '', project: '', members: [] });
  };

  const handleCreateWorkshop = () => {
    if (!newWorkshop.title.trim()) return;
    
    console.log('Creating workshop:', newWorkshop);
    setNewWorkshop({
      title: '',
      description: '',
      rubric: [{ criteria: '', points: 10 }],
      deadline: ''
    });
  };

  const addRubricCriteria = () => {
    setNewWorkshop({
      ...newWorkshop,
      rubric: [...newWorkshop.rubric, { criteria: '', points: 10 }]
    });
  };

  const updateRubricCriteria = (index: number, field: string, value: any) => {
    const newRubric = [...newWorkshop.rubric];
    newRubric[index] = { ...newRubric[index], [field]: value };
    setNewWorkshop({ ...newWorkshop, rubric: newRubric });
  };

  const renderForumManager = () => (
    <div className="space-y-6">
      {/* Create New Topic */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Create Discussion Topic</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            label="Topic Title"
            value={newTopic.title}
            onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
            placeholder="Enter discussion topic"
          />
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
            <textarea
              value={newTopic.description}
              onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
              placeholder="Describe the discussion topic..."
              rows={3}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex space-x-3">
            <select
              value={newTopic.category}
              onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value })}
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="general" className="bg-gray-800">General</option>
              <option value="Physics" className="bg-gray-800">Physics</option>
              <option value="Chemistry" className="bg-gray-800">Chemistry</option>
              <option value="Mathematics" className="bg-gray-800">Mathematics</option>
              <option value="Biology" className="bg-gray-800">Biology</option>
            </select>
            <Button
              variant="primary"
              onClick={handleCreateTopic}
              disabled={!newTopic.title.trim()}
            >
              Create Topic
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Existing Topics */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Forum Topics</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          {forumTopics.map((topic) => (
            <div key={topic.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {topic.isPinned && <Pin className="w-4 h-4 text-yellow-400" />}
                    <h4 className="font-semibold text-white">{topic.title}</h4>
                    <Badge variant="secondary">{topic.category}</Badge>
                  </div>
                  <p className="text-white/70 text-sm">{topic.description}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-white/60">
                <span>Created by {topic.createdBy}</span>
                <div className="flex items-center space-x-4">
                  <span>{topic.posts} posts</span>
                  <span>Last activity: {topic.lastActivity}</span>
                </div>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );

  const renderGroupManager = () => (
    <div className="space-y-6">
      {/* Create New Group */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Create Student Group</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Group Name"
              value={newGroup.name}
              onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              placeholder="Enter group name"
            />
            
            <Input
              label="Project/Purpose"
              value={newGroup.project}
              onChange={(e) => setNewGroup({ ...newGroup, project: e.target.value })}
              placeholder="What will this group work on?"
            />
          </div>

          <Button
            variant="primary"
            onClick={handleCreateGroup}
            disabled={!newGroup.name.trim()}
            icon={<UserPlus className="w-4 h-4" />}
          >
            Create Group
          </Button>
        </CardBody>
      </Card>

      {/* Existing Groups */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Student Groups</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          {studentGroups.map((group) => (
            <div key={group.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-white">{group.name}</h4>
                  <p className="text-white/70 text-sm">{group.project}</p>
                </div>
                <Badge variant={group.status === 'active' ? 'success' : group.status === 'completed' ? 'info' : 'warning'}>
                  {group.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-white/60" />
                  <span className="text-white/80 text-sm">{group.members.length} members</span>
                  <span className="text-white/60 text-sm">• Created {new Date(group.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" size="sm">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );

  const renderWorkshopManager = () => (
    <div className="space-y-6">
      {/* Create New Workshop */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Create Peer Assessment Workshop</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            label="Workshop Title"
            value={newWorkshop.title}
            onChange={(e) => setNewWorkshop({ ...newWorkshop, title: e.target.value })}
            placeholder="Enter workshop title"
          />
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
            <textarea
              value={newWorkshop.description}
              onChange={(e) => setNewWorkshop({ ...newWorkshop, description: e.target.value })}
              placeholder="Describe the workshop and assessment criteria..."
              rows={3}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-white">Assessment Rubric</h4>
              <Button variant="secondary" size="sm" onClick={addRubricCriteria}>
                <Plus className="w-4 h-4 mr-1" />
                Add Criteria
              </Button>
            </div>
            
            <div className="space-y-3">
              {newWorkshop.rubric.map((criteria, index) => (
                <div key={index} className="grid grid-cols-3 gap-3">
                  <Input
                    placeholder="Assessment criteria"
                    value={criteria.criteria}
                    onChange={(e) => updateRubricCriteria(index, 'criteria', e.target.value)}
                    className="col-span-2"
                  />
                  <Input
                    type="number"
                    placeholder="Points"
                    value={criteria.points}
                    onChange={(e) => updateRubricCriteria(index, 'points', parseInt(e.target.value) || 0)}
                  />
                </div>
              ))}
            </div>
          </div>

          <Input
            label="Deadline"
            type="date"
            value={newWorkshop.deadline}
            onChange={(e) => setNewWorkshop({ ...newWorkshop, deadline: e.target.value })}
          />

          <Button
            variant="primary"
            onClick={handleCreateWorkshop}
            disabled={!newWorkshop.title.trim()}
            className="w-full"
          >
            Create Workshop
          </Button>
        </CardBody>
      </Card>

      {/* Existing Workshops */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Active Workshops</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          {workshops.map((workshop) => (
            <div key={workshop.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-white">{workshop.title}</h4>
                  <p className="text-white/70 text-sm">{workshop.description}</p>
                </div>
                <Badge variant={workshop.status === 'active' ? 'success' : workshop.status === 'completed' ? 'info' : 'warning'}>
                  {workshop.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="mb-3">
                <h5 className="font-medium text-white text-sm mb-2">Rubric ({workshop.rubric.reduce((sum, r) => sum + r.points, 0)} points total)</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {workshop.rubric.map((criteria, index) => (
                    <div key={index} className="text-xs text-white/70">
                      • {criteria.criteria} ({criteria.points} pts)
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-white/60">
                  <span>{workshop.submissions} submissions</span>
                  <span>Due: {new Date(workshop.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold text-white">Collaboration Manager</h1>
        </div>
        <Badge variant="info">Teacher Tools</Badge>
      </div>

      {/* Navigation */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-1">
        <div className="flex space-x-1">
          {[
            { id: 'forums', label: 'Forum Management', icon: MessageCircle },
            { id: 'groups', label: 'Student Groups', icon: Users },
            { id: 'workshops', label: 'Peer Workshops', icon: Settings }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
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
      {activeTab === 'forums' && renderForumManager()}
      {activeTab === 'groups' && renderGroupManager()}
      {activeTab === 'workshops' && renderWorkshopManager()}
    </div>
  );
};

export default CollaborationManager;