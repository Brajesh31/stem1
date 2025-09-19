import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Lightbulb, 
  Recycle, 
  Zap, 
  Cog,
  Play,
  Save,
  Share2,
  Award,
  Users,
  Target,
  DollarSign,
  Leaf,
  Star
} from 'lucide-react';
import { livingLabService } from '../../services/livingLabService';
import { useAppDispatch } from '../../store';
import { addNotification } from '../../store/slices/uiSlice';
import type { JugaadChallenge, JugaadDesign, VirtualComponent } from '../../types/livingLab';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';

interface DesignWorkspace {
  selectedComponents: {
    componentId: string;
    quantity: number;
    position: { x: number; y: number; z: number };
  }[];
  totalCost: number;
  designTitle: string;
  designDescription: string;
}

const JugaadStudio: React.FC = () => {
  const dispatch = useAppDispatch();
  const [challenges, setChallenges] = useState<JugaadChallenge[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<JugaadChallenge | null>(null);
  const [availableComponents, setAvailableComponents] = useState<VirtualComponent[]>([]);
  const [workspace, setWorkspace] = useState<DesignWorkspace>({
    selectedComponents: [],
    totalCost: 0,
    designTitle: '',
    designDescription: ''
  });
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [showSimulation, setShowSimulation] = useState(false);
  const [innovatorStats, setInnovatorStats] = useState({
    level: 4,
    innovationPoints: 850,
    challengesCompleted: 6,
    designsShared: 12,
    peerRating: 4.3,
    rank: 'Creative Inventor'
  });

  useEffect(() => {
    loadChallenges();
    loadComponents();
  }, []);

  const loadChallenges = async () => {
    try {
      const availableChallenges = await livingLabService.getJugaadChallenges();
      setChallenges(availableChallenges);
    } catch (error) {
      console.error('Failed to load challenges:', error);
    }
  };

  const loadComponents = async () => {
    try {
      const components = await livingLabService.getVirtualComponents();
      setAvailableComponents(components);
    } catch (error) {
      console.error('Failed to load components:', error);
    }
  };

  const startChallenge = (challenge: JugaadChallenge) => {
    setActiveChallenge(challenge);
    setWorkspace({
      selectedComponents: [],
      totalCost: 0,
      designTitle: '',
      designDescription: ''
    });
    setSimulationResults(null);
    setShowSimulation(false);
  };

  const addComponent = (component: VirtualComponent) => {
    if (!activeChallenge) return;

    const newCost = workspace.totalCost + component.cost;
    if (newCost > activeChallenge.constraints.budget) {
      dispatch(addNotification({
        type: 'warning',
        title: 'Budget Exceeded',
        message: `Adding this component would exceed your budget of ${activeChallenge.constraints.budget} credits.`
      }));
      return;
    }

    const existingComponent = workspace.selectedComponents.find(c => c.componentId === component.id);
    
    if (existingComponent) {
      setWorkspace(prev => ({
        ...prev,
        selectedComponents: prev.selectedComponents.map(c =>
          c.componentId === component.id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        ),
        totalCost: newCost
      }));
    } else {
      setWorkspace(prev => ({
        ...prev,
        selectedComponents: [
          ...prev.selectedComponents,
          {
            componentId: component.id,
            quantity: 1,
            position: { x: Math.random() * 10, y: Math.random() * 10, z: 0 }
          }
        ],
        totalCost: newCost
      }));
    }
  };

  const removeComponent = (componentId: string) => {
    const component = availableComponents.find(c => c.id === componentId);
    if (!component) return;

    const existingComponent = workspace.selectedComponents.find(c => c.componentId === componentId);
    if (!existingComponent) return;

    if (existingComponent.quantity > 1) {
      setWorkspace(prev => ({
        ...prev,
        selectedComponents: prev.selectedComponents.map(c =>
          c.componentId === componentId
            ? { ...c, quantity: c.quantity - 1 }
            : c
        ),
        totalCost: prev.totalCost - component.cost
      }));
    } else {
      setWorkspace(prev => ({
        ...prev,
        selectedComponents: prev.selectedComponents.filter(c => c.componentId !== componentId),
        totalCost: prev.totalCost - component.cost
      }));
    }
  };

  const runSimulation = async () => {
    if (!activeChallenge || workspace.selectedComponents.length === 0) return;

    setShowSimulation(true);
    
    const design: JugaadDesign = {
      id: Date.now().toString(),
      challengeId: activeChallenge.id,
      studentId: 'current-student',
      title: workspace.designTitle || 'Untitled Design',
      description: workspace.designDescription || 'No description provided',
      components: workspace.selectedComponents,
      simulationResults: { functionality: 0, efficiency: 0, sustainability: 0, cost: workspace.totalCost },
      peerRatings: [],
      teacherFeedback: undefined
    };

    try {
      const results = await livingLabService.simulateDesign(design);
      setSimulationResults(results);
      
      dispatch(addNotification({
        type: 'info',
        title: 'Simulation Complete',
        message: `Your design scored ${Math.round(results.feasibility * 100)}% feasibility!`
      }));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Simulation Failed',
        message: 'Failed to run simulation. Please check your design.'
      }));
    }
  };

  const submitDesign = async () => {
    if (!activeChallenge || !simulationResults) return;

    // Update innovator stats
    setInnovatorStats(prev => ({
      ...prev,
      innovationPoints: prev.innovationPoints + activeChallenge.rewards.innovationPoints,
      challengesCompleted: prev.challengesCompleted + 1,
      designsShared: prev.designsShared + 1
    }));

    dispatch(addNotification({
      type: 'success',
      title: 'Design Submitted!',
      message: `You earned ${activeChallenge.rewards.innovationPoints} Innovation Points! Your design will be reviewed by peers.`
    }));

    setActiveChallenge(null);
    setShowSimulation(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'agriculture': return '🌾';
      case 'energy': return '⚡';
      case 'water': return '💧';
      case 'transportation': return '🚗';
      case 'communication': return '📡';
      case 'health': return '🏥';
      default: return '🔧';
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'agriculture': return 'text-green-400 bg-green-500/20 border-green-400/30';
      case 'energy': return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30';
      case 'water': return 'text-blue-400 bg-blue-500/20 border-blue-400/30';
      case 'transportation': return 'text-purple-400 bg-purple-500/20 border-purple-400/30';
      case 'communication': return 'text-orange-400 bg-orange-500/20 border-orange-400/30';
      case 'health': return 'text-red-400 bg-red-500/20 border-red-400/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-400/30';
    }
  };

  const getComponentIcon = (category: string) => {
    switch (category) {
      case 'mechanical': return '⚙️';
      case 'electrical': return '🔌';
      case 'material': return '🧱';
      case 'sensor': return '📡';
      case 'recycled': return '♻️';
      default: return '🔧';
    }
  };

  const renderChallengeCard = (challenge: JugaadChallenge) => (
    <div key={challenge.id} className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:transform hover:scale-105 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${getCategoryColor(challenge.category)}`}>
            <span className="text-2xl">{getCategoryIcon(challenge.category)}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{challenge.title}</h3>
            <p className="text-white/70 text-sm capitalize">{challenge.category} Innovation</p>
          </div>
        </div>
        <Badge variant={challenge.difficulty === 'Expert' ? 'danger' : challenge.difficulty === 'Advanced' ? 'warning' : 'info'}>
          {challenge.difficulty}
        </Badge>
      </div>

      <p className="text-white/80 text-sm mb-4">{challenge.description}</p>

      {/* Real-World Context */}
      <div className="bg-orange-500/10 border border-orange-400/30 rounded-lg p-3 mb-4">
        <h4 className="text-orange-300 font-medium text-sm mb-1">Real-World Challenge</h4>
        <p className="text-orange-200 text-xs">{challenge.realWorldContext}</p>
      </div>

      {/* Constraints */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-white mb-2">Design Constraints</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1 text-green-300">
            <DollarSign className="w-3 h-3" />
            <span>Budget: {challenge.constraints.budget} credits</span>
          </div>
          <div className="flex items-center space-x-1 text-blue-300">
            <Cog className="w-3 h-3" />
            <span>{challenge.constraints.materials.length} material types</span>
          </div>
          {challenge.constraints.timeLimit && (
            <div className="flex items-center space-x-1 text-yellow-300">
              <Clock className="w-3 h-3" />
              <span>{challenge.constraints.timeLimit} min limit</span>
            </div>
          )}
          {challenge.constraints.sustainabilityRequirement && (
            <div className="flex items-center space-x-1 text-green-300">
              <Leaf className="w-3 h-3" />
              <span>Eco-friendly required</span>
            </div>
          )}
        </div>
      </div>

      {/* Evaluation Criteria */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-white mb-2">Evaluation Criteria</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(challenge.evaluationCriteria).map(([criteria, weight]) => (
            <div key={criteria} className="flex justify-between text-xs">
              <span className="text-white/70 capitalize">{criteria.replace(/([A-Z])/g, ' $1')}</span>
              <span className="text-white font-medium">{weight}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-white mb-2">Innovation Rewards</h4>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1 text-purple-300">
            <Lightbulb className="w-4 h-4" />
            <span>{challenge.rewards.innovationPoints} Points</span>
          </div>
          <div className="flex items-center space-x-1 text-yellow-300">
            <Award className="w-4 h-4" />
            <span>{challenge.rewards.inventorTitles.length} Titles</span>
          </div>
        </div>
      </div>

      <Button
        onClick={() => startChallenge(challenge)}
        variant="primary"
        className="w-full"
        icon={<Wrench className="w-5 h-5" />}
      >
        Start Innovation Challenge
      </Button>
    </div>
  );

  const renderDesignWorkspace = () => {
    if (!activeChallenge) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">
        <div className="min-h-screen p-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{activeChallenge.title}</h2>
                  <p className="text-orange-100 mt-1">Jugaad Innovation Challenge</p>
                </div>
                <button
                  onClick={() => setActiveChallenge(null)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              {/* Budget Tracker */}
              <div className="mt-4 bg-black/20 rounded-lg p-3">
                <div className="flex justify-between text-sm mb-2">
                  <span>Budget Used</span>
                  <span>{workspace.totalCost} / {activeChallenge.constraints.budget} credits</span>
                </div>
                <ProgressBar
                  value={workspace.totalCost}
                  max={activeChallenge.constraints.budget}
                  variant={workspace.totalCost > activeChallenge.constraints.budget * 0.9 ? 'danger' : 'warning'}
                  size="sm"
                />
              </div>
            </div>

            <div className="bg-gray-900 rounded-b-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
                {/* Component Library */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-white">Component Library</h3>
                  </CardHeader>
                  <CardBody className="space-y-3 max-h-96 overflow-y-auto">
                    {availableComponents
                      .filter(comp => activeChallenge.constraints.materials.includes(comp.name) || comp.category === 'recycled')
                      .map((component) => (
                        <div key={component.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{getComponentIcon(component.category)}</span>
                              <span className="text-white font-medium text-sm">{component.name}</span>
                            </div>
                            <span className="text-yellow-300 text-sm font-bold">{component.cost}₹</span>
                          </div>
                          
                          <p className="text-white/60 text-xs mb-2">{component.realWorldEquivalent}</p>
                          
                          <div className="flex justify-between items-center">
                            <Badge variant="secondary" size="sm">{component.category}</Badge>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => addComponent(component)}
                              disabled={workspace.totalCost + component.cost > activeChallenge.constraints.budget}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      ))}
                  </CardBody>
                </Card>

                {/* Design Canvas */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-white">Design Canvas</h3>
                  </CardHeader>
                  <CardBody>
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 h-80 relative border-2 border-dashed border-white/20">
                      {workspace.selectedComponents.length === 0 ? (
                        <div className="absolute inset-0 flex items-center justify-center text-white/40">
                          <div className="text-center">
                            <Wrench className="w-12 h-12 mx-auto mb-2" />
                            <p>Drag components here to start building</p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-4 gap-4 h-full">
                          {workspace.selectedComponents.map((comp, index) => {
                            const component = availableComponents.find(c => c.id === comp.componentId);
                            return (
                              <div
                                key={`${comp.componentId}_${index}`}
                                className="bg-white/10 rounded-lg p-3 border border-white/20 flex flex-col items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
                                onClick={() => removeComponent(comp.componentId)}
                              >
                                <span className="text-2xl mb-1">{getComponentIcon(component?.category || 'material')}</span>
                                <span className="text-white text-xs text-center">{component?.name}</span>
                                {comp.quantity > 1 && (
                                  <span className="text-yellow-300 text-xs font-bold">×{comp.quantity}</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Design Info */}
                    <div className="mt-4 space-y-3">
                      <input
                        type="text"
                        value={workspace.designTitle}
                        onChange={(e) => setWorkspace(prev => ({ ...prev, designTitle: e.target.value }))}
                        placeholder="Give your innovation a name..."
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      
                      <textarea
                        value={workspace.designDescription}
                        onChange={(e) => setWorkspace(prev => ({ ...prev, designDescription: e.target.value }))}
                        placeholder="Describe how your innovation works and solves the problem..."
                        rows={3}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 mt-4">
                      <Button
                        onClick={runSimulation}
                        disabled={workspace.selectedComponents.length === 0}
                        variant="warning"
                        className="flex-1"
                        icon={<Play className="w-4 h-4" />}
                      >
                        Test Design
                      </Button>
                      
                      {simulationResults && (
                        <Button
                          onClick={submitDesign}
                          variant="success"
                          className="flex-1"
                          icon={<Share2 className="w-4 h-4" />}
                        >
                          Submit Innovation
                        </Button>
                      )}
                    </div>
                  </CardBody>
                </Card>

                {/* Properties & Simulation */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-white">
                      {showSimulation ? 'Simulation Results' : 'Design Properties'}
                    </h3>
                  </CardHeader>
                  <CardBody>
                    {showSimulation && simulationResults ? (
                      <div className="space-y-4">
                        {/* Performance Metrics */}
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-white/70">Functionality</span>
                              <span className="text-white">{Math.round(simulationResults.functionality * 100)}%</span>
                            </div>
                            <ProgressBar
                              value={simulationResults.functionality * 100}
                              variant="primary"
                              size="sm"
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-white/70">Efficiency</span>
                              <span className="text-white">{Math.round(simulationResults.efficiency * 100)}%</span>
                            </div>
                            <ProgressBar
                              value={simulationResults.efficiency * 100}
                              variant="warning"
                              size="sm"
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-white/70">Sustainability</span>
                              <span className="text-white">{Math.round(simulationResults.sustainability * 100)}%</span>
                            </div>
                            <ProgressBar
                              value={simulationResults.sustainability * 100}
                              variant="success"
                              size="sm"
                            />
                          </div>
                        </div>

                        {/* Overall Score */}
                        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-3">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white mb-1">
                              {Math.round(simulationResults.feasibility * 100)}%
                            </div>
                            <div className="text-purple-300 text-sm">Overall Feasibility</div>
                          </div>
                        </div>

                        {/* Recommendations */}
                        {simulationResults.recommendations && simulationResults.recommendations.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-white mb-2">AI Suggestions</h4>
                            <div className="space-y-1">
                              {simulationResults.recommendations.map((rec: string, index: number) => (
                                <div key={index} className="text-xs text-blue-300 flex items-start">
                                  <Lightbulb className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                                  <span>{rec}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Selected Components */}
                        <div>
                          <h4 className="text-sm font-medium text-white mb-2">Selected Components</h4>
                          {workspace.selectedComponents.length > 0 ? (
                            <div className="space-y-2">
                              {workspace.selectedComponents.map((comp) => {
                                const component = availableComponents.find(c => c.id === comp.componentId);
                                return (
                                  <div key={comp.componentId} className="flex items-center justify-between text-xs">
                                    <span className="text-white/80">{component?.name}</span>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-white">×{comp.quantity}</span>
                                      <span className="text-yellow-300">{(component?.cost || 0) * comp.quantity}₹</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-white/60 text-xs">No components selected</p>
                          )}
                        </div>

                        {/* Budget Status */}
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-white/70">Budget Remaining</span>
                            <span className="text-white font-medium">
                              {activeChallenge.constraints.budget - workspace.totalCost} credits
                            </span>
                          </div>
                          <ProgressBar
                            value={workspace.totalCost}
                            max={activeChallenge.constraints.budget}
                            variant={workspace.totalCost > activeChallenge.constraints.budget * 0.8 ? 'danger' : 'success'}
                            size="sm"
                          />
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-4xl">🔧</div>
          <div>
            <h1 className="text-3xl font-bold text-white">Jugaad Innovation Studio</h1>
            <p className="text-orange-300">Design frugal solutions for real-world challenges</p>
          </div>
        </div>
        <Badge variant="warning">Frugal Innovator</Badge>
      </div>

      {/* Innovator Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-400/30">
          <CardBody className="p-6 text-center">
            <Lightbulb className="w-10 h-10 text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{innovatorStats.innovationPoints}</div>
            <div className="text-purple-300 text-sm">Innovation Points</div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-400/30">
          <CardBody className="p-6 text-center">
            <Target className="w-10 h-10 text-orange-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{innovatorStats.challengesCompleted}</div>
            <div className="text-orange-300 text-sm">Challenges Completed</div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-400/30">
          <CardBody className="p-6 text-center">
            <Share2 className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{innovatorStats.designsShared}</div>
            <div className="text-blue-300 text-sm">Designs Shared</div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-400/30">
          <CardBody className="p-6 text-center">
            <Star className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{innovatorStats.peerRating.toFixed(1)}</div>
            <div className="text-yellow-300 text-sm">Peer Rating</div>
          </CardBody>
        </Card>
      </div>

      {/* Innovation Philosophy */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-400/30">
        <CardBody className="p-6">
          <div className="flex items-center space-x-4">
            <div className="text-6xl">💡</div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">The Spirit of Jugaad</h3>
              <p className="text-orange-200 leading-relaxed">
                Jugaad represents the art of finding clever, low-cost solutions to complex problems using limited resources. 
                In this studio, you'll learn to think creatively, work sustainably, and design innovations that can truly 
                impact rural communities. Every constraint is an opportunity for creative breakthrough!
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Available Challenges */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Innovation Challenges</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {challenges.map(renderChallengeCard)}
        </div>
      </div>

      {/* Design Workspace */}
      {activeChallenge && renderDesignWorkspace()}

      {/* Innovation Tips */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Innovation Mastery Tips</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-white mb-2">Design Principles</h4>
              <ul className="space-y-1 text-sm text-white/70">
                <li>• Start with the problem, not the technology</li>
                <li>• Embrace constraints as creative catalysts</li>
                <li>• Prioritize sustainability and local materials</li>
                <li>• Test early and iterate quickly</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">Evaluation Focus</h4>
              <ul className="space-y-1 text-sm text-white/70">
                <li>• Real-world applicability is key</li>
                <li>• Cost-effectiveness matters more than complexity</li>
                <li>• Consider maintenance and scalability</li>
                <li>• Document your design process clearly</li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default JugaadStudio;