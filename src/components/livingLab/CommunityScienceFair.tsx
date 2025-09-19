import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Trophy, 
  Eye, 
  ThumbsUp, 
  MessageCircle,
  Share2,
  Calendar,
  Award,
  Globe,
  BookOpen,
  Video,
  FileText,
  Camera,
  Star,
  Heart,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import { livingLabService } from '../../services/livingLabService';
import { useAppDispatch } from '../../store';
import { addNotification } from '../../store/slices/uiSlice';
import type { CommunityProject, ExpertSession, ResearchTeam } from '../../types/livingLab';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const CommunityScienceFair: React.FC = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'showcase' | 'experts' | 'teams' | 'create'>('showcase');
  const [projects, setProjects] = useState<CommunityProject[]>([]);
  const [expertSessions, setExpertSessions] = useState<ExpertSession[]>([]);
  const [researchTeams, setResearchTeams] = useState<ResearchTeam[]>([]);
  const [selectedProject, setSelectedProject] = useState<CommunityProject | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'village_lab_findings' | 'jugaad_innovation' | 'collaborative_research'>('all');
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    projectFocus: ''
  });

  useEffect(() => {
    loadProjects();
    loadExpertSessions();
    loadResearchTeams();
  }, []);

  const loadProjects = async () => {
    try {
      const communityProjects = await livingLabService.getCommunityProjects();
      setProjects(communityProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const loadExpertSessions = async () => {
    try {
      const sessions = await livingLabService.getExpertSessions();
      setExpertSessions(sessions);
    } catch (error) {
      console.error('Failed to load expert sessions:', error);
    }
  };

  const loadResearchTeams = async () => {
    // Mock research teams data
    const mockTeams: ResearchTeam[] = [
      {
        id: '1',
        name: 'Water Warriors',
        description: 'Dedicated to solving water quality issues in rural communities',
        leaderId: 'student_1',
        members: [
          { studentId: 'student_1', studentName: 'Priya Sharma', school: 'Govt. High School, Rajasthan', role: 'leader', joinedAt: '2024-01-15' },
          { studentId: 'student_2', studentName: 'Arjun Patel', school: 'Rural Academy, Gujarat', role: 'data_analyst', joinedAt: '2024-01-18' },
          { studentId: 'student_3', studentName: 'Meera Singh', school: 'Village School, Punjab', role: 'researcher', joinedAt: '2024-01-20' }
        ],
        currentProject: 'Regional Water Quality Database',
        achievements: ['First Cross-School Collaboration', 'Data Quality Excellence'],
        collaborationScore: 94,
        publicationsCount: 2
      },
      {
        id: '2',
        name: 'Solar Innovators',
        description: 'Creating sustainable energy solutions for off-grid communities',
        leaderId: 'student_4',
        members: [
          { studentId: 'student_4', studentName: 'Vikram Kumar', school: 'Tech High School, Karnataka', role: 'leader', joinedAt: '2024-02-01' },
          { studentId: 'student_5', studentName: 'Anita Reddy', school: 'Science Academy, Telangana', role: 'researcher', joinedAt: '2024-02-03' }
        ],
        currentProject: 'Village Solar Microgrid Design',
        achievements: ['Innovation Excellence', 'Sustainability Champion'],
        collaborationScore: 87,
        publicationsCount: 1
      }
    ];

    setResearchTeams(mockTeams);
  };

  const upvoteProject = (projectId: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, upvotes: project.upvotes + 1 }
        : project
    ));

    dispatch(addNotification({
      type: 'success',
      title: 'Project Upvoted',
      message: 'Your support helps highlight excellent community science!'
    }));
  };

  const registerForSession = (sessionId: string) => {
    setExpertSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, currentParticipants: session.currentParticipants + 1 }
        : session
    ));

    dispatch(addNotification({
      type: 'success',
      title: 'Registered Successfully',
      message: 'You\'re registered for the expert session. Check your calendar for details!'
    }));
  };

  const createResearchTeam = async () => {
    if (!newTeam.name || !newTeam.description) return;

    try {
      const team = await livingLabService.createResearchTeam({
        name: newTeam.name,
        description: newTeam.description,
        leaderId: 'current-student',
        projectFocus: newTeam.projectFocus
      });

      setResearchTeams(prev => [...prev, team]);
      setNewTeam({ name: '', description: '', projectFocus: '' });

      dispatch(addNotification({
        type: 'success',
        title: 'Research Team Created',
        message: 'Your team is ready! Invite other students to join your research mission.'
      }));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Creation Failed',
        message: 'Failed to create research team. Please try again.'
      }));
    }
  };

  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case 'village_lab_findings': return '🔬';
      case 'jugaad_innovation': return '💡';
      case 'collaborative_research': return '👥';
      case 'expert_session': return '🎓';
      default: return '📊';
    }
  };

  const getProjectTypeColor = (type: string): string => {
    switch (type) {
      case 'village_lab_findings': return 'text-blue-400 bg-blue-500/20 border-blue-400/30';
      case 'jugaad_innovation': return 'text-orange-400 bg-orange-500/20 border-orange-400/30';
      case 'collaborative_research': return 'text-purple-400 bg-purple-500/20 border-purple-400/30';
      case 'expert_session': return 'text-green-400 bg-green-500/20 border-green-400/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-400/30';
    }
  };

  const filteredProjects = projects.filter(project => 
    filterType === 'all' || project.type === filterType
  );

  const renderProjectShowcase = () => (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'All Projects', icon: Globe },
          { id: 'village_lab_findings', label: 'Research Findings', icon: Eye },
          { id: 'jugaad_innovation', label: 'Innovations', icon: Lightbulb },
          { id: 'collaborative_research', label: 'Team Research', icon: Users }
        ].map((filter) => {
          const IconComponent = filter.icon;
          return (
            <button
              key={filter.id}
              onClick={() => setFilterType(filter.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filterType === filter.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{filter.label}</span>
            </button>
          );
        })}
      </div>

      {/* Featured Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:transform hover:scale-105 transition-all duration-300">
            <CardBody className="p-6">
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getProjectTypeColor(project.type)}`}>
                    <span className="text-xl">{getProjectTypeIcon(project.type)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{project.title}</h3>
                    <p className="text-white/70 text-sm">by {project.author.studentName}</p>
                    <p className="text-white/60 text-xs">{project.author.school} • Grade {project.author.grade}</p>
                  </div>
                </div>
                {project.featured && (
                  <Badge variant="warning">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>

              <p className="text-white/80 text-sm mb-4">{project.description}</p>

              {/* Real-World Impact */}
              {project.realWorldImpact && (
                <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-300 font-medium text-sm">Real-World Impact</span>
                  </div>
                  <p className="text-green-200 text-xs mb-1">{project.realWorldImpact.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-green-300">
                    <span>👥 {project.realWorldImpact.beneficiaries} people helped</span>
                    <span>📈 {project.realWorldImpact.measurableOutcome}</span>
                  </div>
                </div>
              )}

              {/* Content Preview */}
              <div className="mb-4">
                <div className="flex items-center space-x-4 text-sm text-white/60">
                  {project.content.images.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Camera className="w-4 h-4" />
                      <span>{project.content.images.length} photos</span>
                    </div>
                  )}
                  {project.content.videos.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Video className="w-4 h-4" />
                      <span>{project.content.videos.length} videos</span>
                    </div>
                  )}
                  {project.content.documents.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <FileText className="w-4 h-4" />
                      <span>{project.content.documents.length} documents</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                  {project.tags.length > 4 && (
                    <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">
                      +{project.tags.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Mentor Reviews */}
              {project.mentorReviews.length > 0 && (
                <div className="mb-4">
                  <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-300 font-medium text-sm">Expert Review</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-white text-sm">{project.mentorReviews[0].mentorName}</span>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${
                            i < project.mentorReviews[0].rating ? 'text-yellow-400' : 'text-gray-600'
                          }`} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <p className="text-purple-200 text-xs">{project.mentorReviews[0].feedback}</p>
                  </div>
                </div>
              )}

              {/* Engagement Stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => upvoteProject(project.id)}
                    className="flex items-center space-x-1 text-white/60 hover:text-white transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{project.upvotes}</span>
                  </button>
                  <div className="flex items-center space-x-1 text-white/60">
                    <MessageCircle className="w-4 h-4" />
                    <span>{project.comments.length}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-white/60">
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setSelectedProject(project)}
                >
                  Explore Project
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderExpertSessions = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Ask the Scientists</h2>
        <p className="text-white/70">Connect with real scientists and experts from leading institutions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {expertSessions.map((session) => (
          <Card key={session.id} className="hover:transform hover:scale-105 transition-all duration-300">
            <CardBody className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{session.title}</h3>
                  <p className="text-white/70 text-sm mb-2">{session.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">👨‍🔬</span>
                    <div>
                      <p className="text-white font-medium text-sm">{session.expertName}</p>
                      <p className="text-white/60 text-xs">{session.expertCredentials}</p>
                    </div>
                  </div>
                </div>
                <Badge variant={session.status === 'upcoming' ? 'warning' : session.status === 'live' ? 'success' : 'info'}>
                  {session.status.toUpperCase()}
                </Badge>
              </div>

              {/* Session Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-white/70">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(session.scheduledAt).toLocaleDateString()}</span>
                    <span>{new Date(session.scheduledAt).toLocaleTimeString()}</span>
                  </div>
                  <span className="text-white/70">{session.duration} minutes</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-white/70">
                    <Users className="w-4 h-4" />
                    <span>{session.currentParticipants}/{session.maxParticipants} registered</span>
                  </div>
                  {session.recordingAvailable && (
                    <Badge variant="info" size="sm">Recording Available</Badge>
                  )}
                </div>
              </div>

              {/* Topics */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-white mb-2">Discussion Topics</h4>
                <div className="flex flex-wrap gap-1">
                  {session.topics.map((topic) => (
                    <span key={topic} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Registration */}
              <Button
                onClick={() => registerForSession(session.id)}
                disabled={session.currentParticipants >= session.maxParticipants || session.status === 'completed'}
                variant={session.status === 'upcoming' ? 'primary' : 'secondary'}
                className="w-full"
                icon={session.status === 'upcoming' ? <UserPlus className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              >
                {session.status === 'upcoming' ? 'Register for Session' : 
                 session.status === 'live' ? 'Join Live Session' : 'View Recording'}
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderResearchTeams = () => (
    <div className="space-y-6">
      {/* Create Team Form */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Create Research Team</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              placeholder="Team name..."
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            
            <input
              type="text"
              value={newTeam.projectFocus}
              onChange={(e) => setNewTeam({ ...newTeam, projectFocus: e.target.value })}
              placeholder="Research focus..."
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <textarea
            value={newTeam.description}
            onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
            placeholder="Describe your team's mission and goals..."
            rows={3}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />

          <Button
            onClick={createResearchTeam}
            disabled={!newTeam.name || !newTeam.description}
            variant="primary"
            className="w-full"
            icon={<Users className="w-4 h-4" />}
          >
            Create Research Team
          </Button>
        </CardBody>
      </Card>

      {/* Existing Teams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {researchTeams.map((team) => (
          <Card key={team.id} className="hover:transform hover:scale-105 transition-all duration-300">
            <CardBody className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{team.name}</h3>
                  <p className="text-white/70 text-sm mb-2">{team.description}</p>
                  <Badge variant="primary">{team.currentProject}</Badge>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-white">{team.collaborationScore}</div>
                  <div className="text-white/60 text-xs">Collaboration Score</div>
                </div>
              </div>

              {/* Team Members */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-white mb-2">Team Members ({team.members.length})</h4>
                <div className="space-y-1">
                  {team.members.slice(0, 3).map((member) => (
                    <div key={member.studentId} className="flex items-center justify-between text-xs">
                      <span className="text-white/80">{member.studentName}</span>
                      <Badge variant="secondary" size="sm">{member.role.replace('_', ' ')}</Badge>
                    </div>
                  ))}
                  {team.members.length > 3 && (
                    <p className="text-white/60 text-xs">+{team.members.length - 3} more members</p>
                  )}
                </div>
              </div>

              {/* Achievements */}
              {team.achievements.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">Team Achievements</h4>
                  <div className="flex flex-wrap gap-1">
                    {team.achievements.map((achievement) => (
                      <span key={achievement} className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">
                        🏆 {achievement}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between mb-4 text-sm">
                <div className="flex items-center space-x-4 text-white/60">
                  <span>📚 {team.publicationsCount} publications</span>
                  <span>⭐ {team.collaborationScore}/100 rating</span>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full"
                icon={<UserPlus className="w-4 h-4" />}
              >
                Request to Join
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderProjectDetails = () => {
    if (!selectedProject) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
                <p className="text-blue-100 mt-1">by {selectedProject.author.studentName}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-white/80 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <p className="text-white/80 leading-relaxed">{selectedProject.description}</p>

            {/* Methodology */}
            {selectedProject.content.methodology && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Methodology</h3>
                <p className="text-white/70">{selectedProject.content.methodology}</p>
              </div>
            )}

            {/* Findings */}
            {selectedProject.content.findings && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Key Findings</h3>
                <p className="text-white/70">{selectedProject.content.findings}</p>
              </div>
            )}

            {/* Conclusions */}
            {selectedProject.content.conclusions && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Conclusions</h3>
                <p className="text-white/70">{selectedProject.content.conclusions}</p>
              </div>
            )}

            {/* Scientific Partners */}
            {selectedProject.scientificPartners.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Scientific Partners</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.scientificPartners.map((partner) => (
                    <Badge key={partner} variant="success">{partner}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3">
              <Button variant="primary" className="flex-1">
                <Heart className="w-4 h-4 mr-2" />
                Support Project
              </Button>
              <Button variant="secondary" className="flex-1">
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask Question
              </Button>
              <Button variant="secondary">
                <Share2 className="w-4 h-4" />
              </Button>
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
          <div className="text-4xl">🏆</div>
          <div>
            <h1 className="text-3xl font-bold text-white">Community Science Fair</h1>
            <p className="text-blue-300">Showcase discoveries, share innovations, learn from experts</p>
          </div>
        </div>
        <Badge variant="info">Knowledge Sharing Hub</Badge>
      </div>

      {/* Navigation */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-1">
        <div className="flex space-x-1">
          {[
            { id: 'showcase', label: 'Project Showcase', icon: Trophy },
            { id: 'experts', label: 'Expert Sessions', icon: Users },
            { id: 'teams', label: 'Research Teams', icon: Users },
            { id: 'create', label: 'Share Your Work', icon: Share2 }
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
      {activeTab === 'showcase' && renderProjectShowcase()}
      {activeTab === 'experts' && renderExpertSessions()}
      {activeTab === 'teams' && renderResearchTeams()}
      {activeTab === 'create' && (
        <Card>
          <CardBody className="p-8 text-center">
            <Share2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Share Your Scientific Work</h2>
            <p className="text-white/70 mb-6">Upload your Village Lab findings or Jugaad innovations to inspire others</p>
            <Button variant="primary" icon={<Upload className="w-4 h-4" />}>
              Create Project Showcase
            </Button>
          </CardBody>
        </Card>
      )}

      {/* Project Details Modal */}
      {selectedProject && renderProjectDetails()}
    </div>
  );
};

export default CommunityScienceFair;