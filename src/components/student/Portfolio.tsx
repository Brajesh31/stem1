import React, { useState } from 'react';
import { 
  Camera, 
  Video, 
  FileText, 
  Download, 
  Share2, 
  Eye,
  Calendar,
  Award,
  ExternalLink,
  Filter,
  Grid,
  List
} from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  type: 'photo' | 'video' | 'document' | 'project';
  subject: string;
  questName: string;
  submittedAt: string;
  approved: boolean;
  thumbnail: string;
  fileUrl: string;
  tags: string[];
}

const Portfolio: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Mock portfolio data
  const portfolioItems: PortfolioItem[] = [
    {
      id: '1',
      title: 'Solar System Model',
      description: 'Created a 3D model of the solar system showing planetary orbits and relative sizes',
      type: 'photo',
      subject: 'Physics',
      questName: 'Astronomy Explorer',
      submittedAt: '2024-02-15',
      approved: true,
      thumbnail: '🪐',
      fileUrl: '/portfolio/solar-system.jpg',
      tags: ['astronomy', 'planets', '3d-model', 'science']
    },
    {
      id: '2',
      title: 'Chemical Reaction Experiment',
      description: 'Documented the reaction between baking soda and vinegar, explaining the chemical process',
      type: 'video',
      subject: 'Chemistry',
      questName: 'Kitchen Chemistry Lab',
      submittedAt: '2024-02-10',
      approved: true,
      thumbnail: '🧪',
      fileUrl: '/portfolio/chemistry-experiment.mp4',
      tags: ['chemistry', 'experiment', 'reaction', 'documentation']
    },
    {
      id: '3',
      title: 'Geometric Art Project',
      description: 'Applied mathematical principles to create geometric art patterns using compass and ruler',
      type: 'photo',
      subject: 'Mathematics',
      questName: 'Math in Art',
      submittedAt: '2024-02-08',
      approved: true,
      thumbnail: '📐',
      fileUrl: '/portfolio/geometric-art.jpg',
      tags: ['geometry', 'art', 'patterns', 'mathematics']
    },
    {
      id: '4',
      title: 'Local Ecosystem Study',
      description: 'Comprehensive study of local park ecosystem including flora, fauna, and environmental factors',
      type: 'document',
      subject: 'Biology',
      questName: 'Nature Detective',
      submittedAt: '2024-02-05',
      approved: true,
      thumbnail: '🌿',
      fileUrl: '/portfolio/ecosystem-study.pdf',
      tags: ['biology', 'ecosystem', 'research', 'environment']
    },
    {
      id: '5',
      title: 'Historical Timeline Presentation',
      description: 'Interactive timeline of World War II events with multimedia elements',
      type: 'project',
      subject: 'History',
      questName: 'Time Traveler',
      submittedAt: '2024-02-01',
      approved: true,
      thumbnail: '📜',
      fileUrl: '/portfolio/ww2-timeline.html',
      tags: ['history', 'timeline', 'world-war-2', 'presentation']
    },
    {
      id: '6',
      title: 'Poetry Collection',
      description: 'Original poems exploring themes of nature and personal growth',
      type: 'document',
      subject: 'English',
      questName: 'Creative Writer',
      submittedAt: '2024-01-28',
      approved: true,
      thumbnail: '📝',
      fileUrl: '/portfolio/poetry-collection.pdf',
      tags: ['poetry', 'creative-writing', 'literature', 'personal']
    },
    {
      id: '7',
      title: 'Bridge Engineering Challenge',
      description: 'Designed and built a bridge using everyday materials, tested weight capacity',
      type: 'video',
      subject: 'Engineering',
      questName: 'Master Builder',
      submittedAt: '2024-01-25',
      approved: true,
      thumbnail: '🌉',
      fileUrl: '/portfolio/bridge-challenge.mp4',
      tags: ['engineering', 'design', 'construction', 'physics']
    },
    {
      id: '8',
      title: 'Community Garden Documentation',
      description: 'Photo series documenting the growth of plants in our school community garden',
      type: 'photo',
      subject: 'Biology',
      questName: 'Green Thumb',
      submittedAt: '2024-01-20',
      approved: true,
      thumbnail: '🌱',
      fileUrl: '/portfolio/garden-series.jpg',
      tags: ['biology', 'plants', 'growth', 'community', 'photography']
    }
  ];

  const subjects = ['all', ...Array.from(new Set(portfolioItems.map(item => item.subject)))];
  const types = ['all', 'photo', 'video', 'document', 'project'];

  const filteredItems = portfolioItems.filter(item => {
    const subjectMatch = filterSubject === 'all' || item.subject === filterSubject;
    const typeMatch = filterType === 'all' || item.type === filterType;
    return subjectMatch && typeMatch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'photo': return <Camera className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'document': return <FileText className="w-5 h-5" />;
      case 'project': return <Award className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'photo': return 'text-blue-400 bg-blue-500/20';
      case 'video': return 'text-red-400 bg-red-500/20';
      case 'document': return 'text-green-400 bg-green-500/20';
      case 'project': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredItems.map((item) => (
        <div key={item.id} className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
          {/* Thumbnail */}
          <div className="h-48 bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-6xl">
            {item.thumbnail}
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                {getTypeIcon(item.type)}
                <span className="ml-1">{item.type}</span>
              </div>
              <span className="text-white/60 text-xs">{item.subject}</span>
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
            <p className="text-white/70 text-sm mb-3 line-clamp-2">{item.description}</p>
            
            <div className="mb-4">
              <p className="text-white/60 text-xs mb-1">From: {item.questName}</p>
              <p className="text-white/60 text-xs">Submitted: {new Date(item.submittedAt).toLocaleDateString()}</p>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {item.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">
                  #{tag}
                </span>
              ))}
              {item.tags.length > 3 && (
                <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">
                  +{item.tags.length - 3}
                </span>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm transition-colors">
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
              <button className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {filteredItems.map((item) => (
        <div key={item.id} className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-black/30 transition-all duration-200">
          <div className="flex items-center space-x-6">
            {/* Thumbnail */}
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
              {item.thumbnail}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                  {getTypeIcon(item.type)}
                  <span className="ml-1">{item.type}</span>
                </div>
              </div>
              
              <p className="text-white/70 text-sm mb-2">{item.description}</p>
              
              <div className="flex items-center space-x-4 text-xs text-white/60 mb-3">
                <span>{item.subject}</span>
                <span>•</span>
                <span>{item.questName}</span>
                <span>•</span>
                <span>{new Date(item.submittedAt).toLocaleDateString()}</span>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {item.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex space-x-2 flex-shrink-0">
              <button className="flex items-center space-x-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm transition-colors">
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
              <button className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Camera className="w-8 h-8 text-purple-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Adventure Chronicle</h1>
            <p className="text-purple-300">Epic showcase of your real-world learning conquests</p>
          </div>
        </div>
        <div className="text-white/70">
          {filteredItems.length} legendary artifacts
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-xl p-6">
          <Camera className="w-8 h-8 text-blue-400 mb-3" />
          <div className="text-2xl font-bold text-white">{portfolioItems.filter(i => i.type === 'photo').length}</div>
          <div className="text-blue-300 text-sm">Photos</div>
        </div>
        
        <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-6">
          <Video className="w-8 h-8 text-red-400 mb-3" />
          <div className="text-2xl font-bold text-white">{portfolioItems.filter(i => i.type === 'video').length}</div>
          <div className="text-red-300 text-sm">Videos</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-6">
          <FileText className="w-8 h-8 text-green-400 mb-3" />
          <div className="text-2xl font-bold text-white">{portfolioItems.filter(i => i.type === 'document').length}</div>
          <div className="text-green-300 text-sm">Documents</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
          <Award className="w-8 h-8 text-purple-400 mb-3" />
          <div className="text-2xl font-bold text-white">{portfolioItems.filter(i => i.type === 'project').length}</div>
          <div className="text-purple-300 text-sm">Projects</div>
        </div>
      </div>

      {/* Filters and View Controls */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-white/60" />
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject} className="bg-gray-800">
                    {subject === 'all' ? 'All Subjects' : subject}
                  </option>
                ))}
              </select>
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {types.map((type) => (
                <option key={type} value={type} className="bg-gray-800">
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Items */}
      {viewMode === 'grid' ? renderGridView() : renderListView()}

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
          <p className="text-white/60">Try adjusting your filters or complete more Bridge Quests to add projects to your portfolio</p>
        </div>
      )}
    </div>
  );
};

export default Portfolio;