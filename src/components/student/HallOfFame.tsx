import React, { useState } from 'react';
import { Trophy, Crown, Medal, Star, Calendar, Users, Award, TrendingUp } from 'lucide-react';

const HallOfFame: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'guild' | 'masters'>('weekly');

  // Mock data for Hall of Fame
  const weeklyTopAdventurers = [
    { id: '1', name: 'Alex Chen', avatar: '🧙‍♂️', xp: 2847, level: 24, streak: 15, weeklyXP: 1250 },
    { id: '2', name: 'Maria Santos', avatar: '🦸‍♀️', xp: 2654, level: 22, streak: 12, weeklyXP: 1180 },
    { id: '3', name: 'David Kim', avatar: '🤖', xp: 2543, level: 21, streak: 8, weeklyXP: 1050 },
  ];

  const guildOfTheMonth = {
    name: 'The Knowledge Seekers',
    members: 8,
    totalXP: 15420,
    questsCompleted: 47,
    leader: 'Emma Thompson',
    badge: '🏆',
    achievements: ['Most Collaborative', 'Highest Completion Rate', 'Best Peer Support']
  };

  const recentMasters = [
    { id: '1', name: 'Sarah Wilson', subject: 'Mathematics', skill: 'Advanced Algebra', time: '2 hours ago', avatar: '🧚‍♀️' },
    { id: '2', name: 'James Rodriguez', subject: 'Physics', skill: 'Quantum Mechanics', time: '5 hours ago', avatar: '⚡' },
    { id: '3', name: 'Lisa Park', subject: 'Chemistry', skill: 'Organic Compounds', time: '1 day ago', avatar: '🔬' },
    { id: '4', name: 'Michael Chang', subject: 'Biology', skill: 'Cell Structure', time: '1 day ago', avatar: '🧬' },
    { id: '5', name: 'Anna Foster', subject: 'English', skill: 'Creative Writing', time: '2 days ago', avatar: '📝' },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-8 h-8 text-yellow-400" />;
      case 2: return <Medal className="w-8 h-8 text-gray-300" />;
      case 3: return <Medal className="w-8 h-8 text-orange-400" />;
      default: return <span className="w-8 h-8 flex items-center justify-center text-white/60 font-bold">#{rank}</span>;
    }
  };

  const renderWeeklyTop = () => (
    <div className="space-y-6">
      {/* Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {weeklyTopAdventurers.map((player, index) => {
          const positions = [1, 0, 2]; // Center first place
          const actualIndex = positions[index];
          const actualPlayer = weeklyTopAdventurers[actualIndex];
          
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
                <div className="text-5xl mb-4">{actualPlayer.avatar}</div>
                <h3 className="font-bold text-lg mb-2">{actualPlayer.name}</h3>
                <p className="text-white/90 text-sm mb-1">Level {actualPlayer.level}</p>
                <p className="text-white/80 text-xs mb-3">{actualPlayer.weeklyXP} XP this week</p>
                <div className="flex items-center justify-center">
                  {getRankIcon(actualIndex + 1)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Stats */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-purple-400" />
          This Week's Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-xl font-bold text-white">247</div>
            <div className="text-purple-300 text-sm">Quests Completed</div>
          </div>
          <div className="bg-green-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-xl font-bold text-white">1,847</div>
            <div className="text-green-300 text-sm">Total XP Earned</div>
          </div>
          <div className="bg-blue-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🏆</div>
            <div className="text-xl font-bold text-white">23</div>
            <div className="text-blue-300 text-sm">New Masters</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGuildOfMonth = () => (
    <div className="space-y-6">
      {/* Guild Spotlight */}
      <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-400/30 rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="text-8xl mb-4">{guildOfTheMonth.badge}</div>
          <h2 className="text-3xl font-bold text-white mb-2">{guildOfTheMonth.name}</h2>
          <p className="text-amber-300 text-lg">Guild of the Month</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <Users className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white">{guildOfTheMonth.members}</div>
            <div className="text-amber-300 text-sm">Active Members</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white">{guildOfTheMonth.totalXP.toLocaleString()}</div>
            <div className="text-green-300 text-sm">Total XP</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <Trophy className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white">{guildOfTheMonth.questsCompleted}</div>
            <div className="text-purple-300 text-sm">Quests Completed</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">{guildOfTheMonth.leader}</div>
            <div className="text-yellow-300 text-sm">Guild Leader</div>
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-3">Special Achievements</h4>
          <div className="flex flex-wrap gap-2">
            {guildOfTheMonth.achievements.map((achievement, index) => (
              <span key={index} className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-sm font-medium">
                {achievement}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRecentMasters = () => (
    <div className="space-y-6">
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Award className="w-6 h-6 mr-2 text-emerald-400" />
          Recent Certificate of Mastery Recipients
        </h3>

        <div className="space-y-4">
          {recentMasters.map((master, index) => (
            <div key={master.id} className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-400/30 rounded-lg p-4 hover:from-emerald-500/20 hover:to-teal-500/20 transition-all duration-200">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{master.avatar}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white text-lg">{master.name}</h4>
                  <p className="text-emerald-300 font-medium">Mastered: {master.skill}</p>
                  <p className="text-white/60 text-sm">{master.subject}</p>
                </div>
                <div className="text-right">
                  <div className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm font-medium mb-1">
                    🏆 MASTER
                  </div>
                  <p className="text-white/40 text-xs">{master.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mastery Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h4 className="font-semibold text-white mb-4">Most Mastered Skills This Month</h4>
          <div className="space-y-3">
            {[
              { skill: 'Advanced Algebra', count: 12, subject: 'Mathematics' },
              { skill: 'Organic Chemistry', count: 8, subject: 'Chemistry' },
              { skill: 'Creative Writing', count: 7, subject: 'English' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">{item.skill}</p>
                  <p className="text-white/60 text-sm">{item.subject}</p>
                </div>
                <div className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full text-sm font-medium">
                  {item.count} masters
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h4 className="font-semibold text-white mb-4">Mastery Leaderboard</h4>
          <div className="space-y-3">
            {[
              { name: 'Alex Chen', masteries: 15, avatar: '🧙‍♂️' },
              { name: 'Maria Santos', masteries: 12, avatar: '🦸‍♀️' },
              { name: 'David Kim', masteries: 10, avatar: '🤖' },
            ].map((student, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <span className="text-2xl">{student.avatar}</span>
                <div className="flex-1">
                  <p className="text-white font-medium">{student.name}</p>
                  <p className="text-white/60 text-sm">{student.masteries} skills mastered</p>
                </div>
                <div className="text-emerald-400 font-bold">#{index + 1}</div>
              </div>
            ))}
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
          <Trophy className="w-8 h-8 text-yellow-400" />
          <h1 className="text-3xl font-bold text-white">Hall of Fame</h1>
        </div>
        <div className="text-white/70">
          Celebrating our greatest achievers
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-1">
        <div className="flex space-x-1">
          {[
            { id: 'weekly', label: 'Weekly Top Adventurers', icon: Star },
            { id: 'guild', label: 'Guild of the Month', icon: Users },
            { id: 'masters', label: 'Recent Masters', icon: Award },
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
                <span className="md:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'weekly' && renderWeeklyTop()}
      {activeTab === 'guild' && renderGuildOfMonth()}
      {activeTab === 'masters' && renderRecentMasters()}
    </div>
  );
};

export default HallOfFame;