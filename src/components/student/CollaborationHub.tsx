import React, { useState } from 'react';
import { 
  MessageCircle, 
  Users, 
  BookOpen, 
  Send, 
  Search, 
  Plus,
  Pin,
  ThumbsUp,
  Reply,
  Edit,
  Trash2,
  Flag
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Input from '../ui/Input';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: 'student' | 'teacher';
  };
  timestamp: string;
  replies: number;
  likes: number;
  isPinned: boolean;
  tags: string[];
}

interface Message {
  id: string;
  sender: {
    name: string;
    avatar: string;
    isOnline: boolean;
  };
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface WikiPage {
  id: string;
  title: string;
  content: string;
  lastEditor: string;
  lastEdited: string;
  contributors: number;
  subject: string;
}

const CollaborationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'forums' | 'messages' | 'wiki' | 'workshops'>('forums');
  const [selectedForum, setSelectedForum] = useState<string>('general');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [messageText, setMessageText] = useState('');

  const forums = [
    { id: 'general', name: 'General Discussion', posts: 45, icon: '💬' },
    { id: 'physics', name: 'Physics Help', posts: 23, icon: '⚛️' },
    { id: 'chemistry', name: 'Chemistry Lab', posts: 18, icon: '🧪' },
    { id: 'math', name: 'Math Problem Solving', posts: 34, icon: '📐' },
    { id: 'projects', name: 'Project Showcase', posts: 12, icon: '🎨' }
  ];

  const forumPosts: ForumPost[] = [
    {
      id: '1',
      title: 'Help with Quantum Physics Concepts',
      content: 'I\'m struggling to understand wave-particle duality. Can someone explain it in simple terms?',
      author: { name: 'Alex Chen', avatar: '🧙‍♂️', role: 'student' },
      timestamp: '2 hours ago',
      replies: 5,
      likes: 8,
      isPinned: false,
      tags: ['physics', 'quantum', 'help']
    },
    {
      id: '2',
      title: 'Amazing Chemistry Experiment Results!',
      content: 'Just completed the acid-base titration lab. The color change was incredible! Here are my observations...',
      author: { name: 'Maria Santos', avatar: '🦸‍♀️', role: 'student' },
      timestamp: '4 hours ago',
      replies: 12,
      likes: 15,
      isPinned: true,
      tags: ['chemistry', 'lab', 'experiment']
    },
    {
      id: '3',
      title: 'Study Group for Calculus Exam',
      content: 'Looking for study partners for the upcoming calculus exam. Anyone interested in forming a study group?',
      author: { name: 'David Kim', avatar: '🤖', role: 'student' },
      timestamp: '1 day ago',
      replies: 8,
      likes: 6,
      isPinned: false,
      tags: ['math', 'study-group', 'calculus']
    }
  ];

  const messages: Message[] = [
    {
      id: '1',
      sender: { name: 'Dr. Johnson', avatar: '👩‍🏫', isOnline: true },
      content: 'Great work on your physics lab report! Your analysis of the pendulum motion was excellent.',
      timestamp: '10:30 AM',
      isOwn: false
    },
    {
      id: '2',
      sender: { name: 'You', avatar: '🚀', isOnline: true },
      content: 'Thank you! I really enjoyed the experiment. The theoretical calculations matched our observations perfectly.',
      timestamp: '10:35 AM',
      isOwn: true
    },
    {
      id: '3',
      sender: { name: 'Emma Thompson', avatar: '🎨', isOnline: false },
      content: 'Hey! Want to work together on the chemistry project? I think our ideas would complement each other well.',
      timestamp: '2:15 PM',
      isOwn: false
    }
  ];

  const wikiPages: WikiPage[] = [
    {
      id: '1',
      title: 'Physics Formulas Reference',
      content: 'A comprehensive collection of physics formulas organized by topic...',
      lastEditor: 'Alex Chen',
      lastEdited: '2 hours ago',
      contributors: 8,
      subject: 'Physics'
    },
    {
      id: '2',
      title: 'Chemistry Lab Safety Guide',
      content: 'Essential safety procedures and guidelines for chemistry experiments...',
      lastEditor: 'Dr. Patel',
      lastEdited: '1 day ago',
      contributors: 5,
      subject: 'Chemistry'
    },
    {
      id: '3',
      title: 'Mathematical Proof Techniques',
      content: 'Step-by-step guide to various proof methods in mathematics...',
      lastEditor: 'Maria Santos',
      lastEdited: '3 days ago',
      contributors: 12,
      subject: 'Mathematics'
    }
  ];

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    
    // In production, this would create a new forum post
    console.log('Creating post:', { title: newPostTitle, content: newPostContent });
    setNewPostTitle('');
    setNewPostContent('');
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    // In production, this would send a message
    console.log('Sending message:', messageText);
    setMessageText('');
  };

  const renderForums = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Forum List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Discussion Forums</h3>
        </CardHeader>
        <CardBody className="space-y-2">
          {forums.map((forum) => (
            <button
              key={forum.id}
              onClick={() => setSelectedForum(forum.id)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                selectedForum === forum.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-white/80 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{forum.icon}</span>
                <div>
                  <div className="font-medium">{forum.name}</div>
                  <div className="text-xs opacity-70">{forum.posts} posts</div>
                </div>
              </div>
            </button>
          ))}
        </CardBody>
      </Card>

      {/* Forum Posts */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              {forums.find(f => f.id === selectedForum)?.name}
            </h3>
            <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
              New Post
            </Button>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          {/* Create Post Form */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <Input
              placeholder="Post title..."
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              className="mb-3"
            />
            <textarea
              placeholder="Share your thoughts, ask questions, or start a discussion..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex justify-end mt-3">
              <Button
                variant="primary"
                onClick={handleCreatePost}
                disabled={!newPostTitle.trim() || !newPostContent.trim()}
              >
                Post
              </Button>
            </div>
          </div>

          {/* Posts List */}
          {forumPosts.map((post) => (
            <div key={post.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-start space-x-4">
                <span className="text-2xl">{post.author.avatar}</span>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {post.isPinned && <Pin className="w-4 h-4 text-yellow-400" />}
                    <h4 className="font-semibold text-white">{post.title}</h4>
                    <Badge variant={post.author.role === 'teacher' ? 'warning' : 'secondary'}>
                      {post.author.role}
                    </Badge>
                  </div>
                  
                  <p className="text-white/80 mb-3">{post.content}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-white/60">
                      <span>by {post.author.name}</span>
                      <span>{post.timestamp}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-white/60 hover:text-white transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-white/60 hover:text-white transition-colors">
                        <Reply className="w-4 h-4" />
                        <span>{post.replies}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );

  const renderMessages = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Messages</h3>
        </CardHeader>
        <CardBody className="space-y-3">
          {[
            { name: 'Dr. Johnson', avatar: '👩‍🏫', lastMessage: 'Great work on your lab report!', time: '10:35 AM', unread: 0 },
            { name: 'Emma Thompson', avatar: '🎨', lastMessage: 'Want to work together on the chemistry project?', time: '2:15 PM', unread: 1 },
            { name: 'Study Group', avatar: '👥', lastMessage: 'Meeting tomorrow at 3 PM', time: 'Yesterday', unread: 3 }
          ].map((conversation, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
              <div className="relative">
                <span className="text-2xl">{conversation.avatar}</span>
                {conversation.unread > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                    {conversation.unread}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white truncate">{conversation.name}</h4>
                <p className="text-white/60 text-sm truncate">{conversation.lastMessage}</p>
              </div>
              <div className="text-white/40 text-xs">{conversation.time}</div>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Chat Interface */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">👩‍🏫</span>
            <div>
              <h3 className="text-lg font-semibold text-white">Dr. Johnson</h3>
              <p className="text-white/60 text-sm">Physics Teacher • Online</p>
            </div>
          </div>
        </CardHeader>
        <CardBody className="h-96 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isOwn
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-white'
                }`}>
                  {!message.isOwn && (
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm">{message.sender.avatar}</span>
                      <span className="text-xs font-medium">{message.sender.name}</span>
                    </div>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex space-x-3">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              variant="primary"
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  const renderWiki = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Collaborative Knowledge Base</h3>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
          Create Page
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wikiPages.map((page) => (
          <Card key={page.id} className="hover:transform hover:scale-105 transition-all duration-300">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white">{page.title}</h4>
                <Badge variant="secondary">{page.subject}</Badge>
              </div>
              
              <p className="text-white/70 text-sm mb-4 line-clamp-3">{page.content}</p>
              
              <div className="space-y-2 text-xs text-white/60">
                <div className="flex justify-between">
                  <span>Last edited by:</span>
                  <span className="text-white/80">{page.lastEditor}</span>
                </div>
                <div className="flex justify-between">
                  <span>Contributors:</span>
                  <span className="text-white/80">{page.contributors}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last updated:</span>
                  <span className="text-white/80">{page.lastEdited}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <Button variant="primary" size="sm" className="flex-1">
                  <BookOpen className="w-4 h-4 mr-1" />
                  Read
                </Button>
                <Button variant="secondary" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderWorkshops = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Peer Assessment Workshops</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          {[
            {
              title: 'Physics Lab Report Review',
              description: 'Peer review of pendulum motion lab reports',
              submissions: 12,
              deadline: '2024-02-22',
              status: 'active'
            },
            {
              title: 'Chemistry Experiment Analysis',
              description: 'Evaluate peer experimental procedures and conclusions',
              submissions: 8,
              deadline: '2024-02-25',
              status: 'upcoming'
            }
          ].map((workshop, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white">{workshop.title}</h4>
                <Badge variant={workshop.status === 'active' ? 'success' : 'warning'}>
                  {workshop.status.toUpperCase()}
                </Badge>
              </div>
              
              <p className="text-white/70 text-sm mb-3">{workshop.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-white/60">
                  <span>{workshop.submissions} submissions</span>
                  <span>Due: {new Date(workshop.deadline).toLocaleDateString()}</span>
                </div>
                <Button variant="primary" size="sm">
                  {workshop.status === 'active' ? 'Review Submissions' : 'View Details'}
                </Button>
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
          <h1 className="text-3xl font-bold text-white">Collaboration Hub</h1>
        </div>
        <div className="text-white/70">Connect, share, and learn together</div>
      </div>

      {/* Navigation */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-1">
        <div className="flex space-x-1">
          {[
            { id: 'forums', label: 'Discussion Forums', icon: MessageCircle },
            { id: 'messages', label: 'Private Messages', icon: Send },
            { id: 'wiki', label: 'Knowledge Wiki', icon: BookOpen },
            { id: 'workshops', label: 'Peer Workshops', icon: Users }
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
      {activeTab === 'forums' && renderForums()}
      {activeTab === 'messages' && renderMessages()}
      {activeTab === 'wiki' && renderWiki()}
      {activeTab === 'workshops' && renderWorkshops()}
    </div>
  );
};

export default CollaborationHub;