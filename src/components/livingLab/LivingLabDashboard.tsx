import React, { useState, useEffect } from 'react';
import { 
  Microscope, 
  Wrench, 
  Trophy, 
  Target, 
  TrendingUp,
  Award,
  Globe,
  Users,
  Calendar,
  BarChart3,
  MapPin,
  Lightbulb,
  Heart
} from 'lucide-react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import VillageLab from './VillageLab';
import JugaadStudio from './JugaadStudio';
import CommunityScienceFair from './CommunityScienceFair';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';

const LivingLabDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState<'overview' | 'village-lab' | 'jugaad-studio' | 'science-fair'>('overview');
  const [overallStats, setOverallStats] = useState({
    totalDataPoints: 1250,
    innovationPoints: 850,
    communityImpact: 92,
    scientificContributions: 5,
    realWorldSolutions: 3,
    peerCollaborations: 12,
    expertInteractions: 4,
    researchLevel: 8
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: '1',
      type: 'village_lab',
      title: 'Completed Water Quality Mission',
      description: 'Contributed data to regional water monitoring project',
      timestamp: '2 hours ago',
      impact: 'High',
      icon: '💧'
    },
    {
      id: '2',
      type: 'jugaad_studio',
      title: 'Solar Irrigation Design Approved',
      description: 'Your innovation received 4.5/5 rating from peers',
      timestamp: '1 day ago',
      impact: 'Medium',
      icon: '💡'
    },
    {
      id: '3',
      type: 'science_fair',
      title: 'Expert Session with Dr. Narain',
      description: 'Participated in climate change discussion',
      timestamp: '3 days ago',
      impact: 'High',
      icon: '🎓'
    }
  ]);

  const [upcomingOpportunities, setUpcomingOpportunities] = useState([
    {
      id: '1',
      title: 'Biodiversity Survey Weekend',
      description: 'Join a regional biodiversity documentation drive',
      date: '2024-02-18',
      type: 'village_lab',
      participants: 45,
      icon: '🦋'
    },
    {
      id: '2',
      title: 'Rural Innovation Contest',
      description: 'Submit your best Jugaad design for national recognition',
      date: '2024-02-25',
      type: 'jugaad_studio',
      participants: 120,
      icon: '🏆'
    },
    {
      id: '3',
      title: 'Ask a Scientist: Space Technology',
      description: 'Live Q&A with ISRO scientists',
      date: '2024-02-22',
      type: 'science_fair',
      participants: 200,
      icon: '🚀'
    }
  ]);

  const navigateToModule = (module: string) => {
    setActiveModule(module as any);
    navigate(`/student/living-lab/${module}`);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30">
        <CardBody className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">Living Laboratory</h1>
              <p className="text-green-300 text-xl mb-6">
                Where your village becomes your classroom and real problems become your curriculum
              </p>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{overallStats.researchLevel}</div>
                  <div className="text-green-300 text-sm">Research Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{overallStats.scientificContributions}</div>
                  <div className="text-blue-300 text-sm">Scientific Contributions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{overallStats.realWorldSolutions}</div>
                  <div className="text-orange-300 text-sm">Real Solutions Created</div>
                </div>
              </div>
            </div>
            <div className="text-8xl opacity-80">🌍</div>
          </div>
        </CardBody>
      </Card>

      {/* Module Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Village Lab */}
        <Card className="hover:transform hover:scale-105 transition-all duration-300 cursor-pointer" onClick={() => navigateToModule('village-lab')}>
          <CardBody className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Microscope className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Village Laboratory</h2>
            <p className="text-white/70 mb-6 leading-relaxed">
              Transform your environment into a living science lab. Collect real data, contribute to research, 
              and become a citizen scientist.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Data Points Earned</span>
                <span className="text-blue-300 font-bold">{overallStats.totalDataPoints}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Scientific Contributions</span>
                <span className="text-green-300 font-bold">{overallStats.scientificContributions}</span>
              </div>
            </div>
            <Button variant="primary" className="w-full">
              <Target className="w-4 h-4 mr-2" />
              Start Research Mission
            </Button>
          </CardBody>
        </Card>

        {/* Jugaad Studio */}
        <Card className="hover:transform hover:scale-105 transition-all duration-300 cursor-pointer" onClick={() => navigateToModule('jugaad-studio')}>
          <CardBody className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Wrench className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Jugaad Innovation Studio</h2>
            <p className="text-white/70 mb-6 leading-relaxed">
              Design frugal solutions to real rural challenges. Build, test, and share innovations 
              that can make a difference.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Innovation Points</span>
                <span className="text-orange-300 font-bold">{overallStats.innovationPoints}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Solutions Created</span>
                <span className="text-red-300 font-bold">{overallStats.realWorldSolutions}</span>
              </div>
            </div>
            <Button variant="warning" className="w-full">
              <Lightbulb className="w-4 h-4 mr-2" />
              Start Innovation Challenge
            </Button>
          </CardBody>
        </Card>

        {/* Community Science Fair */}
        <Card className="hover:transform hover:scale-105 transition-all duration-300 cursor-pointer" onClick={() => navigateToModule('science-fair')}>
          <CardBody className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Community Science Fair</h2>
            <p className="text-white/70 mb-6 leading-relaxed">
              Share your discoveries, learn from peers, and connect with real scientists. 
              Build a community of young researchers.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Peer Collaborations</span>
                <span className="text-purple-300 font-bold">{overallStats.peerCollaborations}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Expert Interactions</span>
                <span className="text-pink-300 font-bold">{overallStats.expertInteractions}</span>
              </div>
            </div>
            <Button variant="primary" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500">
              <Users className="w-4 h-4 mr-2" />
              Join Community
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-white flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-green-500" />
            Recent Real-World Impact
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-3xl">{activity.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">{activity.title}</h3>
                <p className="text-white/70 text-sm">{activity.description}</p>
              </div>
              <div className="text-right">
                <Badge variant={activity.impact === 'High' ? 'success' : activity.impact === 'Medium' ? 'warning' : 'info'}>
                  {activity.impact} Impact
                </Badge>
                <p className="text-white/60 text-xs mt-1">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Upcoming Opportunities */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-white flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-blue-500" />
            Upcoming Opportunities
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          {upcomingOpportunities.map((opportunity) => (
            <div key={opportunity.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{opportunity.icon}</div>
                <div>
                  <h3 className="font-semibold text-white">{opportunity.title}</h3>
                  <p className="text-white/70 text-sm">{opportunity.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-white/60 mt-1">
                    <span>📅 {new Date(opportunity.date).toLocaleDateString()}</span>
                    <span>👥 {opportunity.participants} participants</span>
                  </div>
                </div>
              </div>
              <Button variant="primary" size="sm">
                Join
              </Button>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/30">
          <CardBody className="p-6 text-center">
            <Globe className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white mb-2">{overallStats.communityImpact}%</div>
            <div className="text-green-300 text-sm mb-2">Community Impact Score</div>
            <p className="text-green-200 text-xs">Your work is making a real difference in your community</p>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-400/30">
          <CardBody className="p-6 text-center">
            <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white mb-2">{overallStats.scientificContributions}</div>
            <div className="text-blue-300 text-sm mb-2">Scientific Publications</div>
            <p className="text-blue-200 text-xs">Your data appears in real research papers</p>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/30">
          <CardBody className="p-6 text-center">
            <Heart className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white mb-2">{overallStats.peerCollaborations}</div>
            <div className="text-purple-300 text-sm mb-2">Peer Collaborations</div>
            <p className="text-purple-200 text-xs">Building a network of young scientists</p>
          </CardBody>
        </Card>
      </div>

      {/* Philosophy Section */}
      <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-400/30">
        <CardBody className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">The Environment as Your Laboratory</h2>
            <p className="text-indigo-200 text-lg leading-relaxed max-w-4xl mx-auto">
              The Living Laboratory module represents a revolutionary approach to STEM education. Instead of learning 
              about science in isolation, you become an active participant in real scientific research. Your village, 
              your environment, and your community challenges become the curriculum. Every observation contributes to 
              human knowledge, every innovation addresses real needs, and every collaboration builds a network of 
              young scientists ready to solve tomorrow's challenges.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Microscope className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Observe & Document</h3>
              <p className="text-white/70 text-sm">Use scientific methods to study your environment</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Wrench className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Innovate & Create</h3>
              <p className="text-white/70 text-sm">Design solutions using frugal innovation principles</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Share & Collaborate</h3>
              <p className="text-white/70 text-sm">Connect with peers and experts worldwide</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  if (activeModule !== 'overview') {
    return (
      <Routes>
        <Route path="/village-lab" element={<VillageLab />} />
        <Route path="/jugaad-studio" element={<JugaadStudio />} />
        <Route path="/science-fair" element={<CommunityScienceFair />} />
      </Routes>
    );
  }

  return renderOverview();
};

export default LivingLabDashboard;