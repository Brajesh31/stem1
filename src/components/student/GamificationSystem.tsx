import React, { useState } from 'react';
import { Trophy, Star, Award, Target, Zap, Crown, Medal, Gift, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'progress' | 'mastery' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earned: boolean;
  earnedAt?: string;
  progress?: number;
  requirement?: number;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special';
  progress: number;
  maxProgress: number;
  reward: {
    points: number;
    badge?: string;
    special?: string;
  };
  timeLeft?: string;
}

const GamificationSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'quests' | 'leaderboard'>('overview');

  const playerStats = {
    totalPoints: 2847,
    level: 12,
    rank: 'Skilled Realm Explorer',
    weeklyPoints: 347,
    streak: 5,
    badgesEarned: 15,
    totalBadges: 45
  };

  const badges: Badge[] = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first quest',
      icon: '🎯',
      category: 'progress',
      rarity: 'common',
      earned: true,
      earnedAt: '2024-02-01'
    },
    {
      id: '2',
      name: 'Math Wizard',
      description: 'Master 10 mathematics concepts',
      icon: '🧙‍♂️',
      category: 'mastery',
      rarity: 'rare',
      earned: true,
      earnedAt: '2024-02-10'
    },
    {
      id: '3',
      name: 'Science Explorer',
      description: 'Complete experiments in 3 different science subjects',
      icon: '🔬',
      category: 'mastery',
      rarity: 'epic',
      earned: false,
      progress: 2,
      requirement: 3
    },
    {
      id: '4',
      name: 'Team Player',
      description: 'Help 5 guild members with their quests',
      icon: '🤝',
      category: 'social',
      rarity: 'rare',
      earned: false,
      progress: 3,
      requirement: 5
    },
    {
      id: '5',
      name: 'Streak Master',
      description: 'Maintain a 30-day learning streak',
      icon: '🔥',
      category: 'progress',
      rarity: 'epic',
      earned: false,
      progress: 5,
      requirement: 30
    },
    {
      id: '6',
      name: 'Quantum Pioneer',
      description: 'Complete the quantum computing simulation',
      icon: '⚛️',
      category: 'special',
      rarity: 'legendary',
      earned: false,
      progress: 0,
      requirement: 1
    }
  ];

  const quests: Quest[] = [
    {
      id: '1',
      title: 'Daily Learning Goal',
      description: 'Complete 3 learning activities today',
      type: 'daily',
      progress: 2,
      maxProgress: 3,
      reward: { points: 50 },
      timeLeft: '8h 23m'
    },
    {
      id: '2',
      title: 'Weekly Challenge',
      description: 'Earn 500 points this week',
      type: 'weekly',
      progress: 347,
      maxProgress: 500,
      reward: { points: 100, badge: 'Weekly Warrior' },
      timeLeft: '2d 14h'
    },
    {
      id: '3',
      title: 'Physics Mastery',
      description: 'Complete all physics quests in your grade',
      type: 'special',
      progress: 8,
      maxProgress: 12,
      reward: { points: 300, special: 'Physics Master Title' }
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Alex Chen', points: 4856, avatar: '🧙‍♂️', streak: 15 },
    { rank: 2, name: 'Maria Santos', points: 4203, avatar: '🦸‍♀️', streak: 12 },
    { rank: 3, name: 'David Kim', points: 3987, avatar: '🤖', streak: 8 },
    { rank: 4, name: 'You', points: 2847, avatar: '🚀', streak: 5, isCurrentUser: true },
    { rank: 5, name: 'Sarah Wilson', points: 2654, avatar: '🧚‍♀️', streak: 10 }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-500/20 text-gray-300';
      case 'rare': return 'border-blue-400 bg-blue-500/20 text-blue-300';
      case 'epic': return 'border-purple-400 bg-purple-500/20 text-purple-300';
      case 'legendary': return 'border-yellow-400 bg-yellow-500/20 text-yellow-300';
      default: return 'border-gray-400 bg-gray-500/20 text-gray-300';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-400/30">
          <CardBody className="p-6 text-center">
            <Star className="w-10 h-10 text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{playerStats.level}</div>
            <div className="text-purple-300 text-sm">Current Level</div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-400/30">
          <CardBody className="p-6 text-center">
            <Target className="w-10 h-10 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{playerStats.totalPoints.toLocaleString()}</div>
            <div className="text-blue-300 text-sm">Total Points</div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-400/30">
          <CardBody className="p-6 text-center">
            <Award className="w-10 h-10 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{playerStats.badgesEarned}</div>
            <div className="text-green-300 text-sm">Badges Earned</div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-400/30">
          <CardBody className="p-6 text-center">
            <div className="text-4xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-white">{playerStats.streak}</div>
            <div className="text-orange-300 text-sm">Day Streak</div>
          </CardBody>
        </Card>
      </div>

      {/* Active Quests */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Active Challenges</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          {quests.map((quest) => (
            <div key={quest.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-white">{quest.title}</h4>
                  <p className="text-white/70 text-sm">{quest.description}</p>
                </div>
                <div className="text-right">
                  <Badge variant={quest.type === 'daily' ? 'warning' : quest.type === 'weekly' ? 'info' : 'primary'}>
                    {quest.type.toUpperCase()}
                  </Badge>
                  {quest.timeLeft && (
                    <p className="text-white/60 text-xs mt-1">{quest.timeLeft} left</p>
                  )}
                </div>
              </div>
              
              <ProgressBar
                value={quest.progress}
                max={quest.maxProgress}
                showPercentage
                variant="primary"
                size="sm"
              />
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2 text-sm text-white/70">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>{quest.reward.points} points</span>
                  {quest.reward.badge && (
                    <>
                      <span>+</span>
                      <Award className="w-4 h-4 text-purple-400" />
                      <span>{quest.reward.badge}</span>
                    </>
                  )}
                </div>
                <span className="text-white/60 text-sm">{quest.progress}/{quest.maxProgress}</span>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );

  const renderBadges = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => (
          <Card key={badge.id} className={`border-2 ${getRarityColor(badge.rarity)} ${badge.earned ? 'shadow-lg' : 'opacity-60'}`}>
            <CardBody className="p-6 text-center">
              <div className="text-6xl mb-4">{badge.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{badge.name}</h3>
              <p className="text-white/70 text-sm mb-4">{badge.description}</p>
              
              <div className="mb-4">
                <Badge variant={badge.rarity === 'legendary' ? 'warning' : badge.rarity === 'epic' ? 'primary' : 'secondary'}>
                  {badge.rarity.toUpperCase()}
                </Badge>
              </div>

              {badge.earned ? (
                <div className="text-green-300 text-sm">
                  ✅ Earned on {new Date(badge.earnedAt!).toLocaleDateString()}
                </div>
              ) : badge.progress !== undefined ? (
                <div>
                  <ProgressBar
                    value={badge.progress}
                    max={badge.requirement!}
                    showPercentage
                    variant="primary"
                    size="sm"
                  />
                  <p className="text-white/60 text-xs mt-1">
                    {badge.progress}/{badge.requirement}
                  </p>
                </div>
              ) : (
                <div className="text-white/60 text-sm">Requirements not met</div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Class Leaderboard</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          {leaderboard.map((player) => (
            <div
              key={player.rank}
              className={`flex items-center space-x-4 p-4 rounded-lg border ${
                player.isCurrentUser 
                  ? 'bg-purple-500/20 border-purple-400/50' 
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-center justify-center w-8">
                {player.rank === 1 ? <Crown className="w-6 h-6 text-yellow-400" /> :
                 player.rank === 2 ? <Medal className="w-6 h-6 text-gray-300" /> :
                 player.rank === 3 ? <Medal className="w-6 h-6 text-orange-400" /> :
                 <span className="text-white/60 font-bold">#{player.rank}</span>}
              </div>
              
              <div className="text-3xl">{player.avatar}</div>
              
              <div className="flex-1">
                <h4 className={`font-semibold ${player.isCurrentUser ? 'text-purple-300' : 'text-white'}`}>
                  {player.name}
                  {player.isCurrentUser && <span className="ml-2 text-xs bg-purple-600 px-2 py-1 rounded-full">YOU</span>}
                </h4>
                <p className="text-white/60 text-sm">{player.points.toLocaleString()} points</p>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-1 text-orange-400">
                  <span>🔥</span>
                  <span className="font-medium">{player.streak}</span>
                </div>
                <p className="text-white/60 text-xs">day streak</p>
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
          <Trophy className="w-8 h-8 text-yellow-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Gamification Hub</h1>
            <p className="text-yellow-300">Track your achievements and compete with friends</p>
          </div>
        </div>
        <Badge variant="warning">{playerStats.rank}</Badge>
      </div>

      {/* Navigation */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-1">
        <div className="flex space-x-1">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'badges', label: 'Badge Collection', icon: Award },
            { id: 'quests', label: 'Active Quests', icon: Target },
            { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg'
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
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'badges' && renderBadges()}
      {activeTab === 'quests' && (
        <div className="space-y-4">
          {quests.map((quest) => (
            <Card key={quest.id}>
              <CardBody className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{quest.title}</h3>
                    <p className="text-white/70">{quest.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={quest.type === 'daily' ? 'warning' : quest.type === 'weekly' ? 'info' : 'primary'}>
                      {quest.type.toUpperCase()}
                    </Badge>
                    {quest.timeLeft && (
                      <p className="text-white/60 text-xs mt-1">{quest.timeLeft}</p>
                    )}
                  </div>
                </div>
                
                <ProgressBar
                  value={quest.progress}
                  max={quest.maxProgress}
                  showPercentage
                  variant="primary"
                  size="sm"
                />
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2 text-sm text-white/70">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>{quest.reward.points} points</span>
                    {quest.reward.badge && (
                      <>
                        <span>+</span>
                        <Award className="w-4 h-4 text-purple-400" />
                        <span>{quest.reward.badge}</span>
                      </>
                    )}
                  </div>
                  <span className="text-white/60 text-sm">{quest.progress}/{quest.maxProgress}</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
      {activeTab === 'leaderboard' && renderLeaderboard()}
    </div>
  );
};

export default GamificationSystem;