import React, { useState, useEffect } from 'react';
import { 
  Map, 
  Target, 
  Star, 
  Lock, 
  CheckCircle, 
  Play,
  Brain,
  Zap,
  Users,
  Award,
  TrendingUp,
  Eye,
  Settings
} from 'lucide-react';
import { learningPathGenerator } from '../../services/learningPathGenerator';
import { useAuth } from '../../contexts/AuthContext';

interface PersonalizedPathProps {
  onNodeSelect: (node: any) => void;
  onPathUpdate: (path: any) => void;
}

interface PathNode {
  id: string;
  title: string;
  description: string;
  type: 'concept' | 'practice' | 'assessment' | 'project' | 'collaboration';
  subject: string;
  difficulty: number;
  estimatedTime: number;
  prerequisites: string[];
  learningObjectives: string[];
  modality: '2D' | 'VR' | 'AR' | 'MR';
  position: { x: number; y: number };
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  aiGenerated: boolean;
}

const PersonalizedPath: React.FC<PersonalizedPathProps> = ({
  onNodeSelect,
  onPathUpdate
}) => {
  const { user } = useAuth();
  const [learningPath, setLearningPath] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<PathNode | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'timeline'>('map');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [pathStats, setPathStats] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadOrGeneratePath();
    }
  }, [user]);

  const loadOrGeneratePath = async () => {
    if (!user) return;

    setIsGenerating(true);
    try {
      // Try to load existing path
      let path = learningPathGenerator.getStudentPath(user.id);
      
      if (!path) {
        // Generate new personalized path
        path = await learningPathGenerator.generatePersonalizedPath({
          id: user.id,
          currentLevel: user.level || 1,
          subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
          careerGoals: ['Software Engineer'], // This would come from user preferences
          learningStyle: 'visual', // This would come from assessment
          strengths: ['problem_solving', 'logical_thinking'],
          weaknesses: ['time_management'],
          interests: ['technology', 'science'],
          timeAvailable: 60, // minutes per day
          deviceCapabilities: {
            hasVR: 'xr' in navigator,
            hasAR: 'mediaDevices' in navigator,
            hasCamera: true,
            hasMicrophone: true
          }
        });
      }
      
      setLearningPath(path);
      calculatePathStats(path);
      onPathUpdate(path);
    } catch (error) {
      console.error('Failed to load/generate learning path:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const calculatePathStats = (path: any) => {
    const nodes = path.nodes;
    const stats = {
      totalNodes: nodes.length,
      completedNodes: nodes.filter((n: PathNode) => n.status === 'completed').length,
      availableNodes: nodes.filter((n: PathNode) => n.status === 'available').length,
      estimatedTotalTime: nodes.reduce((sum: number, n: PathNode) => sum + n.estimatedTime, 0),
      subjectDistribution: {},
      modalityDistribution: {},
      difficultyProgression: nodes.map((n: PathNode) => n.difficulty)
    };

    // Calculate subject distribution
    nodes.forEach((node: PathNode) => {
      stats.subjectDistribution[node.subject] = (stats.subjectDistribution[node.subject] || 0) + 1;
    });

    // Calculate modality distribution
    nodes.forEach((node: PathNode) => {
      stats.modalityDistribution[node.modality] = (stats.modalityDistribution[node.modality] || 0) + 1;
    });

    setPathStats(stats);
  };

  const handleNodeClick = async (node: PathNode) => {
    if (node.status === 'locked') return;
    
    setSelectedNode(node);
    onNodeSelect(node);
    
    // Update node status to in_progress if available
    if (node.status === 'available') {
      await learningPathGenerator.updateNodeStatus(user!.id, node.id, 'in_progress');
      
      // Update local state
      setLearningPath((prev: any) => ({
        ...prev,
        nodes: prev.nodes.map((n: PathNode) => 
          n.id === node.id ? { ...n, status: 'in_progress' } : n
        )
      }));
    }
  };

  const getNodeIcon = (node: PathNode) => {
    switch (node.type) {
      case 'concept': return <Brain className="w-5 h-5" />;
      case 'practice': return <Target className="w-5 h-5" />;
      case 'assessment': return <Award className="w-5 h-5" />;
      case 'project': return <Star className="w-5 h-5" />;
      case 'collaboration': return <Users className="w-5 h-5" />;
      default: return <Play className="w-5 h-5" />;
    }
  };

  const getNodeColor = (node: PathNode) => {
    switch (node.status) {
      case 'completed': return 'bg-green-500 border-green-400 text-white';
      case 'in_progress': return 'bg-blue-500 border-blue-400 text-white';
      case 'available': return 'bg-purple-500 border-purple-400 text-white hover:bg-purple-600';
      case 'locked': return 'bg-gray-500 border-gray-400 text-gray-300 opacity-50';
      default: return 'bg-gray-500 border-gray-400 text-gray-300';
    }
  };

  const getModalityIcon = (modality: string) => {
    switch (modality) {
      case 'VR': return '🥽';
      case 'AR': return '📱';
      case 'MR': return '🌐';
      default: return '💻';
    }
  };

  const renderMapView = () => (
    <div className="relative w-full h-96 bg-gradient-to-br from-slate-900 to-purple-900 rounded-xl overflow-hidden">
      {/* Path Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {learningPath?.connections.map((connection: any, index: number) => {
          const fromNode = learningPath.nodes.find((n: PathNode) => n.id === connection.from);
          const toNode = learningPath.nodes.find((n: PathNode) => n.id === connection.to);
          
          if (!fromNode || !toNode) return null;
          
          return (
            <line
              key={index}
              x1={fromNode.position.x / 10}
              y1={fromNode.position.y / 10}
              x2={toNode.position.x / 10}
              y2={toNode.position.y / 10}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="2"
              strokeDasharray={connection.weight < 1 ? "5,5" : "none"}
            />
          );
        })}
      </svg>
      
      {/* Learning Nodes */}
      {learningPath?.nodes
        .filter((node: PathNode) => filterSubject === 'all' || node.subject === filterSubject)
        .map((node: PathNode) => (
          <div
            key={node.id}
            onClick={() => handleNodeClick(node)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 ${
              node.status !== 'locked' ? 'hover:shadow-lg' : 'cursor-not-allowed'
            }`}
            style={{
              left: `${(node.position.x / 2000) * 100}%`,
              top: `${(node.position.y / 1600) * 100}%`
            }}
          >
            <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center ${getNodeColor(node)} shadow-lg`}>
              {node.status === 'completed' ? (
                <CheckCircle className="w-6 h-6" />
              ) : node.status === 'locked' ? (
                <Lock className="w-6 h-6" />
              ) : (
                getNodeIcon(node)
              )}
            </div>
            
            {/* Node Label */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs whitespace-nowrap">
              {node.title}
            </div>
            
            {/* Modality Indicator */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs">
              {getModalityIcon(node.modality)}
            </div>
            
            {/* Difficulty Indicator */}
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {Math.round(node.difficulty * 5)}
              </span>
            </div>
          </div>
        ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {learningPath?.nodes
        .filter((node: PathNode) => filterSubject === 'all' || node.subject === filterSubject)
        .map((node: PathNode) => (
          <div
            key={node.id}
            onClick={() => handleNodeClick(node)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
              node.status === 'locked' 
                ? 'border-gray-300 bg-gray-50 opacity-50 cursor-not-allowed' 
                : 'border-purple-300 bg-white hover:border-purple-500 hover:shadow-md'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${getNodeColor(node)}`}>
                {node.status === 'completed' ? (
                  <CheckCircle className="w-6 h-6" />
                ) : node.status === 'locked' ? (
                  <Lock className="w-6 h-6" />
                ) : (
                  getNodeIcon(node)
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{node.title}</h3>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    {node.subject}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {getModalityIcon(node.modality)} {node.modality}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{node.description}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>⏱️ {node.estimatedTime} min</span>
                  <span>📊 Difficulty: {Math.round(node.difficulty * 5)}/5</span>
                  <span>🎯 {node.learningObjectives.length} objectives</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  node.status === 'completed' ? 'bg-green-100 text-green-700' :
                  node.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                  node.status === 'available' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {node.status.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  const renderTimelineView = () => (
    <div className="space-y-6">
      {learningPath?.nodes
        .filter((node: PathNode) => filterSubject === 'all' || node.subject === filterSubject)
        .map((node: PathNode, index: number) => (
          <div key={node.id} className="flex items-start space-x-4">
            {/* Timeline Line */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${getNodeColor(node)}`}>
                {getNodeIcon(node)}
              </div>
              {index < learningPath.nodes.length - 1 && (
                <div className="w-0.5 h-16 bg-gray-300 dark:bg-gray-600 mt-2"></div>
              )}
            </div>
            
            {/* Node Content */}
            <div 
              onClick={() => handleNodeClick(node)}
              className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">{node.title}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getModalityIcon(node.modality)}</span>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {node.type}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{node.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>⏱️ {node.estimatedTime} min</span>
                  <span>📊 Level {Math.round(node.difficulty * 5)}</span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  node.status === 'completed' ? 'bg-green-100 text-green-700' :
                  node.status === 'available' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {node.status.replace('_', ' ')}
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  const renderPathStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-300 text-sm font-medium">Progress</p>
            <p className="text-2xl font-bold text-white">
              {pathStats ? Math.round((pathStats.completedNodes / pathStats.totalNodes) * 100) : 0}%
            </p>
          </div>
          <TrendingUp className="w-8 h-8 text-blue-400" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-300 text-sm font-medium">Available</p>
            <p className="text-2xl font-bold text-white">{pathStats?.availableNodes || 0}</p>
          </div>
          <Target className="w-8 h-8 text-green-400" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-400/30 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-300 text-sm font-medium">Total Time</p>
            <p className="text-2xl font-bold text-white">
              {pathStats ? Math.round(pathStats.estimatedTotalTime / 60) : 0}h
            </p>
          </div>
          <Zap className="w-8 h-8 text-purple-400" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-400/30 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-300 text-sm font-medium">AI Generated</p>
            <p className="text-2xl font-bold text-white">
              {pathStats ? pathStats.totalNodes : 0}
            </p>
          </div>
          <Brain className="w-8 h-8 text-orange-400" />
        </div>
      </div>
    </div>
  );

  if (isGenerating) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">AI is crafting your personalized learning path...</h3>
          <p className="text-white/70">Analyzing your learning style, goals, and preferences</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Map className="w-8 h-8 text-purple-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Your AI-Crafted Learning Odyssey</h1>
            <p className="text-purple-300">A personalized path designed just for you</p>
          </div>
        </div>
        <button
          onClick={loadOrGeneratePath}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-200 flex items-center space-x-2"
        >
          <Brain className="w-4 h-4" />
          <span>Regenerate Path</span>
        </button>
      </div>

      {/* Path Statistics */}
      {pathStats && renderPathStats()}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex space-x-2">
          {['map', 'list', 'timeline'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                viewMode === mode
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {mode === 'map' ? <Map className="w-4 h-4" /> :
               mode === 'list' ? <Eye className="w-4 h-4" /> :
               <TrendingUp className="w-4 h-4" />}
              <span className="ml-2 capitalize">{mode}</span>
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-white/70 text-sm">Filter:</span>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all" className="bg-gray-800">All Subjects</option>
            <option value="Mathematics" className="bg-gray-800">Mathematics</option>
            <option value="Physics" className="bg-gray-800">Physics</option>
            <option value="Chemistry" className="bg-gray-800">Chemistry</option>
            <option value="Biology" className="bg-gray-800">Biology</option>
          </select>
        </div>
      </div>

      {/* Path Visualization */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        {viewMode === 'map' && renderMapView()}
        {viewMode === 'list' && renderListView()}
        {viewMode === 'timeline' && renderTimelineView()}
      </div>

      {/* Selected Node Details */}
      {selectedNode && (
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">{selectedNode.title}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getModalityIcon(selectedNode.modality)}</span>
              <span className="text-white/70 text-sm">{selectedNode.modality} Experience</span>
            </div>
          </div>
          
          <p className="text-white/80 mb-4">{selectedNode.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white/10 rounded-lg p-3">
              <h4 className="text-white font-medium text-sm mb-2">Learning Objectives</h4>
              <ul className="space-y-1">
                {selectedNode.learningObjectives.map((objective, index) => (
                  <li key={index} className="text-white/70 text-xs flex items-center">
                    <Target className="w-3 h-3 mr-2 text-blue-400" />
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white/10 rounded-lg p-3">
              <h4 className="text-white font-medium text-sm mb-2">Details</h4>
              <div className="space-y-1 text-xs text-white/70">
                <p>⏱️ Estimated time: {selectedNode.estimatedTime} minutes</p>
                <p>📊 Difficulty: {Math.round(selectedNode.difficulty * 5)}/5</p>
                <p>🎯 Type: {selectedNode.type}</p>
                <p>🤖 AI Generated: {selectedNode.aiGenerated ? 'Yes' : 'No'}</p>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-3">
              <h4 className="text-white font-medium text-sm mb-2">Prerequisites</h4>
              {selectedNode.prerequisites.length > 0 ? (
                <div className="space-y-1">
                  {selectedNode.prerequisites.map((prereqId) => {
                    const prereqNode = learningPath?.nodes.find((n: PathNode) => n.id === prereqId);
                    return prereqNode ? (
                      <div key={prereqId} className="text-xs text-white/70 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
                        {prereqNode.title}
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <p className="text-xs text-white/70">No prerequisites required</p>
              )}
            </div>
          </div>
          
          {selectedNode.status === 'available' && (
            <button
              onClick={() => {
                // Start the learning node
                onNodeSelect(selectedNode);
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-purple-500 hover:to-blue-500 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Begin Learning Node</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonalizedPath;