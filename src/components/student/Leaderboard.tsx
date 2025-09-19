import React, { useState } from 'react';
import { Trophy, Medal, Crown, Star, TrendingUp, Users, Target } from 'lucide-react';
import { useAppSelector } from '../../store';

const Leaderboard: React.FC = () => {
  const { currentClass } = useAppSelector((state) => state.curriculum);
  const [activeTab, setActiveTab] = useState<'global' | 'class' | 'friends'>('class');

  // Mock leaderboard data
  const leaderboardData = {
    class: [
      { id: '1', name: 'Alex Chen', avatar: '🧙‍♂️', level: 24, experience: 4856, rank: 1, streak: 15 },
      { id: '2', name: 'Maria Santos', avatar: '🦸‍♀️', level: 22, experience: 4203, rank: 2, streak: 12 },
      { id: '3', name: 'David Kim', avatar: '🤖', level: 21, experience: 3987, rank: 3, streak: 8 },
      { id: '4', name: 'You', avatar: '🚀', level: 12, experience: 2847, rank: 4, streak: 5, isCurrentUser: true },
      { id: '5', name: 'Sarah Wilson', avatar: '🧚‍♀️', level: 18, experience: 3542, rank: 5, streak: 10 },
      { id: '6', name: 'James Rodriguez', avatar: '⚡', level: 16, experience: 3124, rank: 6, streak: 7 },
    ],
    global: [
      { id: '1', name: 'Phoenix Master', avatar: '🔥', level: 47, experience: 12543, rank: 1, streak: 42 },
      { id: '2', name: 'Quantum Sage', avatar: '🌌', level: 43, experience: 11234, rank: 2, streak: 38 },
      { id: '3', name: 'Crystal Guardian', avatar: '💎', level: 41, experience: 10876, rank: 3, streak: 35 },
      { id: '4', name: 'You', avatar: '🚀', level: 12, experience: 2847, rank: 2847, streak: 5, isCurrentUser: true },
    ],
    friends: [
      { id: '1', name: 'Emma Thompson', avatar: '🎨', level: 15, experience: 2976, rank: 1, streak: 9 },
      { id: '2', name: 'Michael Chang', avatar: '🎸', level: 13, experience: 2654, rank: 2, streak: 6 },
      { id: '3', name: 'You', avatar: '🚀', level: 12, experience: 2847, rank: 3, streak: 5, isCurrentUser: true },
    ]
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-300" />;
      case 3: return <Medal className="w-6 h-6 text-orange-400" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-white/60 font-bold">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number, isCurrentUser?: boolean) => {
    if (isCurrentUser) return 'bg-purple-500/20 border-purple-400/50';
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/50';
      case 2: return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50';
      case 3: return 'bg-gradient-to-r from-orange-400/20 to-red-500/20 border-orange-400/50';
      default: return 'bg-white/5 border-white/10';
    }
  };

  const currentData = leaderboardData[activeTab];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <h1 className="text-3xl font-bold text-white">
            {currentClass ? `${currentClass.displayName} - Hall of Heroes` : 'Hall of Heroes'}
          </h1>
        </div>
        <div className="text-white/70">
          {currentClass 
            ? `Compete with fellow ${currentClass.displayName} adventurers`
            : 'Rise among the greatest learning champions'
          }
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm font-medium">Your Class Rank</p>
              <p className="text-3xl font-bold text-white">#4</p>
            </div>
            <Target className="w-12 h-12 text-purple-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 text-sm font-medium">Learning Streak</p>
              <p className="text-3xl font-bold text-white">5 days</p>
            </div>
            <div className="text-4xl">🔥</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm font-medium">XP This Week</p>
              <p className="text-3xl font-bold text-white">347</p>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Leaderboard Tabs */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-1">
        <div className="flex space-x-1">
          {[
            { id: 'class', label: 'Guild Rankings', icon: Users },
            { id: 'global', label: 'World Champions', icon: Trophy },
            { id: 'friends', label: 'Adventure Allies', icon: Star },
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 border ${
                  activeTab === tab.id
                    ? 'bg-student-primary text-white shadow-lg border-white/20'
                    : 'text-white/70 hover:bg-white/10 border-white/10'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top 3 Podium */}
      {activeTab !== 'global' && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {currentData.slice(0, 3).map((player, index) => {
            const positions = [1, 0, 2]; // Center first place
            const actualIndex = positions[index];
            const actualPlayer = currentData[actualIndex];
            
            return (
              <div
                key={actualPlayer.id}
                className={`text-center ${actualIndex === 0 ? 'order-2' : actualIndex === 1 ? 'order-1' : 'order-3'}`}
              >
                <div className={`bg-gradient-to-br ${
                  actualIndex === 0 ? 'from-yellow-500 to-orange-600' :
                  actualIndex === 1 ? 'from-gray-400 to-gray-600' :
                  'from-orange-400 to-red-600'
                } rounded-xl p-6 text-white shadow-xl ${actualIndex === 0 ? 'scale-110 mt-0' : 'mt-6'}`}>
                  <div className="text-4xl mb-3">{actualPlayer.avatar}</div>
                  <h3 className="font-bold text-lg mb-1">{actualPlayer.name}</h3>
                  <p className="text-white/90 text-sm mb-2">Level {actualPlayer.level}</p>
                  <p className="text-white/80 text-xs">{actualPlayer.experience} XP</p>
                  <div className="mt-3">
                    {getRankIcon(actualIndex + 1)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Leaderboard List */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="bg-white/5 px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
            {activeTab === 'global' ? 'World Champion Rankings' : 
             activeTab === 'class' ? 'Guild Hero Rankings' : 'Adventure Ally Rankings'}
          </h3>
        </div>

        <div className="divide-y divide-white/10">
          {currentData.map((player, index) => (
            <div
              key={player.id}
              className={`flex items-center px-6 py-4 hover:bg-white/5 transition-all duration-200 ${
                player.isCurrentUser ? 'bg-purple-500/10 border-l-4 border-purple-400' : ''
              }`}
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(player.rank)}
                </div>
                
                <div className="text-3xl">{player.avatar}</div>
                
                <div className="flex-1">
                  <h4 className={`font-semibold ${player.isCurrentUser ? 'text-purple-300' : 'text-white'}`}>
                    {player.name}
                    {player.isCurrentUser && <span className="ml-2 text-xs bg-purple-600 px-2 py-1 rounded-full">YOU</span>}
                  </h4>
                  <p className="text-white/60 text-sm">Level {player.level}</p>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <p className="text-white/60">XP</p>
                  <p className="font-semibold text-white">{player.experience.toLocaleString()}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-white/60">Streak</p>
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-orange-400">🔥</span>
                    <p className="font-semibold text-white">{player.streak}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coming Soon Features */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">🏆 Coming Soon!</h3>
        <p className="text-purple-200/70 text-sm mb-4">
          Guild Wars, Monthly Tournaments, and Achievement Showcases
        </p>
        <div className="flex justify-center space-x-4 text-xs text-purple-300">
          <span>• Weekly Challenges</span>
          <span>• Subject Championships</span>
          <span>• Collaborative Quests</span>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;