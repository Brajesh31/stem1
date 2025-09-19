import React, { useState } from 'react';
import { 
  Users, 
  MessageCircle, 
  Trophy, 
  Crown, 
  Star, 
  Send,
  Shield,
  Award,
  Target,
  Zap,
  AtSign
} from 'lucide-react';
import { useAppDispatch } from '../../store';
import { addNotification } from '../../store/slices/uiSlice';

interface GuildMember {
  id: string;
  name: string;
  avatar: string;
  level: number;
  role: 'leader' | 'mentor' | 'member';
  contribution: number;
  isOnline: boolean;
  joinedAt: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  message: string;
  timestamp: string;
  isMentorRequest?: boolean;
}

interface GuildQuest {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  reward: string;
  participants: string[];
}

const GuildHeadquarters: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'members' | 'quests' | 'trophies'>('chat');
  const [chatMessage, setChatMessage] = useState('');
  const dispatch = useAppDispatch();

  // Mock guild data
  const guildInfo = {
    name: 'The Knowledge Seekers',
    level: 12,
    members: 8,
    maxMembers: 10,
    totalContribution: 15420,
    rank: 3
  };

  const guildMembers: GuildMember[] = [
    { id: '1', name: 'Emma Thompson', avatar: '🎨', level: 24, role: 'leader', contribution: 3420, isOnline: true, joinedAt: '2024-01-15' },
    { id: '2', name: 'Alex Chen', avatar: '🧙‍♂️', level: 22, role: 'mentor', contribution: 2847, isOnline: true, joinedAt: '2024-01-18' },
    { id: '3', name: 'Maria Santos', avatar: '🦸‍♀️', level: 21, role: 'mentor', contribution: 2654, isOnline: false, joinedAt: '2024-01-20' },
    { id: '4', name: 'You', avatar: '🚀', level: 12, role: 'member', contribution: 1250, isOnline: true, joinedAt: '2024-02-01' },
    { id: '5', name: 'David Kim', avatar: '🤖', level: 18, role: 'member', contribution: 1876, isOnline: true, joinedAt: '2024-01-25' },
    { id: '6', name: 'Sarah Wilson', avatar: '🧚‍♀️', level: 16, role: 'member', contribution: 1543, isOnline: false, joinedAt: '2024-02-03' },
    { id: '7', name: 'James Rodriguez', avatar: '⚡', level: 15, role: 'member', contribution: 1234, isOnline: true, joinedAt: '2024-02-05' },
    { id: '8', name: 'Lisa Park', avatar: '🔬', level: 14, role: 'member', contribution: 1096, isOnline: false, joinedAt: '2024-02-08' },
  ];

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', userId: '1', userName: 'Emma Thompson', avatar: '🎨', message: 'Great work everyone on the collaborative physics quest!', timestamp: '10:30 AM' },
    { id: '2', userId: '2', userName: 'Alex Chen', avatar: '🧙‍♂️', message: 'Thanks! The momentum calculations were tricky but we figured it out together.', timestamp: '10:32 AM' },
    { id: '3', userId: '5', userName: 'David Kim', avatar: '🤖', message: '@Mentor I\'m stuck on the chemistry bonding question. Could use some help!', timestamp: '10:45 AM', isMentorRequest: true },
    { id: '4', userId: '2', userName: 'Alex Chen', avatar: '🧙‍♂️', message: 'I can help with that! Covalent bonds share electrons between atoms. Let me know which specific part is confusing.', timestamp: '10:47 AM' },
    { id: '5', userId: '7', userName: 'James Rodriguez', avatar: '⚡', message: 'Just completed the algebra quest! The skill tree is really paying off.', timestamp: '11:15 AM' },
  ]);

  const guildQuests: GuildQuest[] = [
    {
      id: '1',
      title: 'Collaborative Science Lab',
      description: 'Work together to complete 50 science experiments',
      progress: 32,
      maxProgress: 50,
      reward: '500 Guild XP + Lab Equipment Set',
      participants: ['1', '2', '3', '5']
    },
    {
      id: '2',
      title: 'Mathematics Marathon',
      description: 'Solve 100 math problems as a guild',
      progress: 78,
      maxProgress: 100,
      reward: '750 Guild XP + Calculator Upgrade',
      participants: ['1', '4', '6', '7', '8']
    },
    {
      id: '3',
      title: 'Literary Circle',
      description: 'Read and discuss 5 classic novels together',
      progress: 2,
      maxProgress: 5,
      reward: '300 Guild XP + Bookworm Badge',
      participants: ['1', '3', '6']
    }
  ];

  const guildTrophies = [
    { id: '1', name: 'First Guild Quest', description: 'Completed your first collaborative quest', icon: '🏆', earnedAt: '2024-01-20' },
    { id: '2', name: 'Mentor Masters', description: 'Guild members earned 10 mentor certifications', icon: '🎓', earnedAt: '2024-01-25' },
    { id: '3', name: 'Knowledge Collectors', description: 'Guild completed 100 total quests', icon: '📚', earnedAt: '2024-02-01' },
    { id: '4', name: 'Collaboration Champions', description: 'Highest peer support rating this month', icon: '🤝', earnedAt: '2024-02-10' },
  ];

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: '4',
      userName: 'You',
      avatar: '🚀',
      message: chatMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMentorRequest: chatMessage.includes('@Mentor')
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatMessage('');

    if (newMessage.isMentorRequest) {
      dispatch(addNotification({ 
        type: 'info', 
        title: 'Mentor Request Sent', 
        message: 'Guild mentors have been notified of your request for help!' 
      }));
    }
    
    // Simulate mentor response for demo
    if (newMessage.isMentorRequest) {
      setTimeout(() => {
        const mentorResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          userId: '2',
          userName: 'Alex Chen',
          avatar: '🧙‍♂️',
          message: 'I can help with that! What specific part are you struggling with?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, mentorResponse]);
      }, 2000);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'leader': return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'mentor': return <Shield className="w-4 h-4 text-blue-400" />;
      default: return <Star className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'leader': return 'text-yellow-400';
      case 'mentor': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const renderChat = () => (
    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <MessageCircle className="w-6 h-6 mr-2 text-green-400" />
          Guild Chat
        </h3>
        <div className="flex items-center space-x-2 text-sm text-white/60">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>{guildMembers.filter(m => m.isOnline).length} online</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {chatMessages.map((msg) => (
          <div key={msg.id} className={`flex items-start space-x-3 ${
            msg.isMentorRequest ? 'bg-blue-500/10 p-3 rounded-lg border border-blue-400/30' : ''
          }`}>
            <span className="text-2xl">{msg.avatar}</span>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-white">{msg.userName}</span>
                {guildMembers.find(m => m.id === msg.userId) && (
                  <div className="flex items-center">
                    {getRoleIcon(guildMembers.find(m => m.id === msg.userId)!.role)}
                  </div>
                )}
                <span className="text-white/40 text-xs">{msg.timestamp}</span>
              </div>
              <p className={`text-white/80 ${msg.isMentorRequest ? 'font-medium' : ''}`}>
                {msg.message}
              </p>
              {msg.isMentorRequest && (
                <div className="mt-2 flex items-center space-x-1 text-blue-300 text-xs">
                  <AtSign className="w-3 h-3" />
                  <span>Mentor request</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="flex space-x-3">
        <input
          type="text"
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message... (Use @Mentor for help)"
          className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all duration-200"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderMembers = () => (
    <div className="space-y-6">
      {/* Guild Stats */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Users className="w-6 h-6 mr-2 text-blue-400" />
          Guild Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{guildInfo.level}</div>
            <div className="text-blue-300 text-sm">Guild Level</div>
          </div>
          <div className="bg-green-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{guildInfo.members}/{guildInfo.maxMembers}</div>
            <div className="text-green-300 text-sm">Members</div>
          </div>
          <div className="bg-purple-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">#{guildInfo.rank}</div>
            <div className="text-purple-300 text-sm">Server Rank</div>
          </div>
          <div className="bg-yellow-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{guildInfo.totalContribution.toLocaleString()}</div>
            <div className="text-yellow-300 text-sm">Total XP</div>
          </div>
        </div>
      </div>

      {/* Member List */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Guild Members</h3>
        
        <div className="space-y-3">
          {guildMembers.map((member) => (
            <div key={member.id} className={`flex items-center justify-between p-4 rounded-lg border ${
              member.id === '4' ? 'bg-purple-500/10 border-purple-400/30' : 'bg-white/5 border-white/10'
            }`}>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <span className="text-3xl">{member.avatar}</span>
                  {member.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"></div>
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-white">{member.name}</h4>
                    {member.id === '4' && <span className="text-xs bg-purple-600 px-2 py-1 rounded-full text-white">YOU</span>}
                    <div className="flex items-center space-x-1">
                      {getRoleIcon(member.role)}
                      <span className={`text-xs font-medium ${getRoleColor(member.role)}`}>
                        {member.role.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm">Level {member.level} • Joined {new Date(member.joinedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">{member.contribution.toLocaleString()} XP</div>
                <div className="text-white/60 text-sm">Contribution</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderQuests = () => (
    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
        <Target className="w-6 h-6 mr-2 text-orange-400" />
        Active Guild Quests
      </h3>

      <div className="space-y-6">
        {guildQuests.map((quest) => (
          <div key={quest.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">{quest.title}</h4>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-white/60" />
                <span className="text-white/60 text-sm">{quest.participants.length} participating</span>
              </div>
            </div>
            
            <p className="text-white/70 mb-4">{quest.description}</p>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/60">Progress</span>
                <span className="text-white/60">{quest.progress}/{quest.maxProgress}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(quest.progress / quest.maxProgress) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-300 text-sm font-medium">{quest.reward}</span>
              </div>
              <div className="flex -space-x-2">
                {quest.participants.slice(0, 4).map((participantId) => {
                  const participant = guildMembers.find(m => m.id === participantId);
                  return participant ? (
                    <div key={participantId} className="w-8 h-8 rounded-full bg-white/10 border-2 border-gray-900 flex items-center justify-center text-sm">
                      {participant.avatar}
                    </div>
                  ) : null;
                })}
                {quest.participants.length > 4 && (
                  <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-gray-900 flex items-center justify-center text-xs text-white">
                    +{quest.participants.length - 4}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTrophies = () => (
    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
        <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
        Guild Trophy Case
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guildTrophies.map((trophy) => (
          <div key={trophy.id} className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="text-4xl">{trophy.icon}</div>
              <div>
                <h4 className="font-semibold text-white text-lg">{trophy.name}</h4>
                <p className="text-yellow-300 text-sm">Earned {new Date(trophy.earnedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <p className="text-white/70">{trophy.description}</p>
          </div>
        ))}
      </div>

      {/* Achievement Progress */}
      <div className="mt-8 bg-white/5 rounded-lg p-6">
        <h4 className="font-semibold text-white mb-4">Next Achievements</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="text-white font-medium">Quest Masters</p>
                <p className="text-white/60 text-sm">Complete 200 guild quests</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">156/200</p>
              <div className="w-24 bg-white/10 rounded-full h-2 mt-1">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="text-white font-medium">Lightning Learners</p>
                <p className="text-white/60 text-sm">Maintain 30-day activity streak</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">23/30</p>
              <div className="w-24 bg-white/10 rounded-full h-2 mt-1">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '77%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Guild: {guildInfo.name}</h1>
            <p className="text-blue-300">Level {guildInfo.level} Learning Guild • World Rank #{guildInfo.rank}</p>
          </div>
        </div>
        <div className="text-white/70">
          {guildInfo.members}/{guildInfo.maxMembers} brave adventurers
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-1">
        <div className="flex space-x-1">
          {[
            { id: 'chat', label: 'Guild War Room', icon: MessageCircle },
            { id: 'members', label: 'Guild Roster', icon: Users },
            { id: 'quests', label: 'Collaborative Quests', icon: Target },
            { id: 'trophies', label: 'Legendary Trophies', icon: Trophy },
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 border ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg border-white/20'
                    : 'text-white/70 hover:bg-white/10 border-white/10'
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
      {activeTab === 'chat' && renderChat()}
      {activeTab === 'members' && renderMembers()}
      {activeTab === 'quests' && renderQuests()}
      {activeTab === 'trophies' && renderTrophies()}
    </div>
  );
};

export default GuildHeadquarters;