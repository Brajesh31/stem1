import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home,
  Users,
  BookOpen,
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
  Target,
  Award,
  MessageCircle,
  FileText,
  Brain,
  Globe,
  Zap
} from 'lucide-react';

const TeacherRealm: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'quests', label: 'Quests', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const classStats = {
    totalStudents: 28,
    activeStudents: 24,
    averageLevel: 14,
    totalQuests: 156,
    completionRate: 87
  };

  const recentActivity = [
    { id: '1', student: 'Alex Chen', action: 'Completed "Algebra Awakening"', time: '2 mins ago', subject: 'Math' },
    { id: '2', student: 'Maria Santos', action: 'Unlocked new skill in Physics', time: '15 mins ago', subject: 'Physics' },
    { id: '3', student: 'David Kim', action: 'Started "Forces of Nature" quest', time: '1 hour ago', subject: 'Physics' },
  ];

  const renderMainContent = () => {
    switch (activeTab) {
      default:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-primary mb-4">Teacher Dashboard</h1>
              <p className="text-xl text-secondary">Manage your classes and track student progress</p>
            </div>

            {/* Class Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-secondary border border-primary rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-primary">{classStats.totalStudents}</div>
                <div className="text-secondary text-sm">Total Students</div>
              </div>
              
              <div className="bg-secondary border border-primary rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-primary">{classStats.activeStudents}</div>
                <div className="text-secondary text-sm">Active Today</div>
              </div>
              
              <div className="bg-secondary border border-primary rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-primary">{classStats.averageLevel}</div>
                <div className="text-secondary text-sm">Average Level</div>
              </div>
              
              <div className="bg-secondary border border-primary rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-primary">{classStats.totalQuests}</div>
                <div className="text-secondary text-sm">Total Quests</div>
              </div>
              
              <div className="bg-secondary border border-primary rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-primary">{classStats.completionRate}%</div>
                <div className="text-secondary text-sm">Completion Rate</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-secondary border border-primary rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-primary">Recent Activity</h2>
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="bg-tertiary border border-primary rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-primary">{activity.student}</h3>
                        <p className="text-secondary text-sm">{activity.action}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-secondary text-sm">{activity.time}</div>
                        <div className="text-accent-interactive text-xs font-medium">{activity.subject}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-primary flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-secondary border-r border-primary flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-primary">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <div>
              <div className="text-primary font-semibold">Guild Master</div>
              <div className="text-secondary text-sm">Teacher</div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-accent-interactive text-white shadow-md'
                      : 'text-secondary hover:bg-tertiary hover:text-primary'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-primary">
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-secondary hover:bg-tertiary hover:text-primary transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-secondary border-b border-primary px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">✨</span>
              </div>
              <h1 className="text-xl font-bold text-primary">Project Spark</h1>
            </div>

            {/* Right: User Info and Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="text-primary font-medium">Welcome, {user?.displayName}</span>
              </div>
              
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-3 py-2 bg-tertiary rounded-lg hover:bg-primary/20 transition-colors"
              >
                <LogOut className="w-4 h-4 text-secondary" />
                <span className="text-secondary text-sm">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {renderMainContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherRealm;