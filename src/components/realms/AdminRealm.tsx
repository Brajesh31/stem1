import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home,
  Users,
  FileText,
  Settings as SettingsIcon,
  Shield,
  LogOut,
  BarChart3,
  Server,
  Database,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const AdminRealm: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const navigationItems = [
    { id: 'dashboard', label: 'System Overview', icon: Home },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'content', label: 'Content Management', icon: FileText },
    { id: 'system', label: 'System Settings', icon: SettingsIcon },
    { id: 'security', label: 'Security Center', icon: Shield },
  ];

  const systemStats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalQuests: 1456,
    systemUptime: '99.9%',
    activeServers: 8
  };

  const renderMainContent = () => {
    switch (activeTab) {
      default:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-primary mb-4">System Overview</h1>
              <p className="text-xl text-secondary">Monitor platform performance and manage system resources</p>
            </div>

            {/* System Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-secondary border border-primary rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-primary">{systemStats.totalUsers}</div>
                <div className="text-secondary text-sm">Total Users</div>
              </div>
              
              <div className="bg-secondary border border-primary rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-primary">{systemStats.activeUsers}</div>
                <div className="text-secondary text-sm">Active Users</div>
              </div>
              
              <div className="bg-secondary border border-primary rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-primary">{systemStats.totalQuests}</div>
                <div className="text-secondary text-sm">Total Quests</div>
              </div>
              
              <div className="bg-secondary border border-primary rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-primary">{systemStats.systemUptime}</div>
                <div className="text-secondary text-sm">System Uptime</div>
              </div>
              
              <div className="bg-secondary border border-primary rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Server className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-primary">{systemStats.activeServers}</div>
                <div className="text-secondary text-sm">Active Servers</div>
              </div>
            </div>

            {/* System Performance */}
            <div className="bg-secondary border border-primary rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-primary">System Performance</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-tertiary border border-primary rounded-lg p-4">
                  <div className="flex justify-between text-sm text-secondary mb-2">
                    <span>CPU Usage</span>
                    <span>67%</span>
                  </div>
                  <div className="w-full bg-primary/20 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                </div>
                
                <div className="bg-tertiary border border-primary rounded-lg p-4">
                  <div className="flex justify-between text-sm text-secondary mb-2">
                    <span>Memory Usage</span>
                    <span>74%</span>
                  </div>
                  <div className="w-full bg-primary/20 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full" style={{ width: '74%' }}></div>
                  </div>
                </div>
                
                <div className="bg-tertiary border border-primary rounded-lg p-4">
                  <div className="flex justify-between text-sm text-secondary mb-2">
                    <span>Database Load</span>
                    <span>52%</span>
                  </div>
                  <div className="w-full bg-primary/20 rounded-full h-2">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style={{ width: '52%' }}></div>
                  </div>
                </div>
                
                <div className="bg-tertiary border border-primary rounded-lg p-4">
                  <div className="flex justify-between text-sm text-secondary mb-2">
                    <span>Cache Hit Rate</span>
                    <span>94%</span>
                  </div>
                  <div className="w-full bg-primary/20 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
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
            <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-slate-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <div>
              <div className="text-primary font-semibold">World Architect</div>
              <div className="text-secondary text-sm">Administrator</div>
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
              <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-slate-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm">✨</span>
              </div>
              <h1 className="text-xl font-bold text-primary">Project Spark</h1>
            </div>

            {/* Right: User Info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-slate-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-primary font-medium">Admin: {user?.displayName}</span>
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

export default AdminRealm;