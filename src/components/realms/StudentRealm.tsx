import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import { useAppDispatch, useAppSelector } from '../../store';
import { setCurrentClass, setAvailableClasses, setCurrentQuests, setCurrentSkillTrees } from '../../store/slices/curriculumSlice';
import { curriculumService } from '../../services/curriculumService';
import type { Class } from '../../types/curriculum';
import StudentDashboard from '../student/StudentDashboard';
import EnhancedQuestBoard from '../student/EnhancedQuestBoard';
import SkillTrees from '../student/SkillTrees';
import Leaderboard from '../student/Leaderboard';
import Settings from '../student/Settings';
import StudentProfile from '../student/StudentProfile';
import Portfolio from '../student/Portfolio';
import HallOfFame from '../student/HallOfFame';
import ChimeraForge from '../student/ChimeraForge';
import GuildHeadquarters from '../student/GuildHeadquarters';
import CollaborationHub from '../student/CollaborationHub';
import PersonalizedLearning from '../student/PersonalizedLearning';
import GamificationSystem from '../student/GamificationSystem';
import OfflineMode from '../student/OfflineMode';
import LivingLabDashboard from '../livingLab/LivingLabDashboard';
import VillageLab from '../livingLab/VillageLab';
import JugaadStudio from '../livingLab/JugaadStudio';
import CommunityScienceFair from '../livingLab/CommunityScienceFair';
import ARLab from '../ar/ARLab';
import SpatialComputing from '../ar/SpatialComputing';
import ClassSelector from '../common/ClassSelector';
import { Home, User, BookOpen, Map, Target, Trophy, Users, MessageCircle, Brain, Crown, Star, Hammer, Shield, FileText, Globe, Microscope, Wrench, Award, Camera, Cuboid as Cube, WifiOff, Settings as SettingsIcon, QrCode, LogOut } from 'lucide-react';

const StudentRealm: React.FC = () => {
  const { user, logout } = useAuth();
  const { playerStats } = useGame();
  const dispatch = useAppDispatch();
  const { currentClass } = useAppSelector((state) => state.curriculum);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const classes = curriculumService.getAllClasses();
    dispatch(setAvailableClasses(classes));
    
    const current = curriculumService.getCurrentClass();
    if (current) {
      dispatch(setCurrentClass(current));
      loadClassContent(current);
    }
  }, [dispatch]);

  const loadClassContent = (classData: Class) => {
    const quests = curriculumService.generateQuestsForClass(classData.id);
    const skillTrees = curriculumService.generateSkillTreesForClass(classData.id);
    
    dispatch(setCurrentQuests(quests));
    dispatch(setCurrentSkillTrees(skillTrees));
  };

  const handleClassChange = (newClass: Class) => {
    dispatch(setCurrentClass(newClass));
    loadClassContent(newClass);
  };

  const navigationItems = [
    { id: 'dashboard', label: "Adventurer's Cockpit", icon: Home },
    { id: 'profile', label: 'Adventurer Profile', icon: User },
    { id: 'courses', label: 'Learning Adventures', icon: BookOpen },
    { id: 'quests', label: 'Quest Board', icon: Map },
    { id: 'skills', label: 'Knowledge Trees', icon: Target },
    { id: 'achievements', label: 'Achievement Hub', icon: Trophy },
    { id: 'guild', label: 'Guild Commons', icon: Users },
    { id: 'ai-path', label: 'AI Learning Path', icon: Brain },
    { id: 'heroes', label: 'Hall of Heroes', icon: Crown },
    { id: 'fame', label: 'Hall of Fame', icon: Star },
    { id: 'forge', label: 'Spark Forge', icon: Hammer },
    { id: 'headquarters', label: 'Guild Headquarters', icon: Shield },
    { id: 'log', label: 'Adventure Log', icon: FileText },
    { id: 'collection', label: 'Trophy Collection', icon: Trophy },
    { id: 'challenges', label: 'World Challenges', icon: Globe },
    { id: 'laboratory', label: 'Living Laboratory', icon: Microscope },
    { id: 'village-lab', label: 'Village Lab', icon: Microscope },
    { id: 'jugaad', label: 'Jugaad Studio', icon: Wrench },
    { id: 'science-fair', label: 'Science Fair', icon: Award },
    { id: 'ar-lab', label: 'AR Lab', icon: Camera },
    { id: 'metaverse', label: 'Learning Metaverse', icon: Cube },
    { id: 'spatial', label: 'Spatial Dashboard', icon: Cube },
    { id: 'offline', label: 'Offline Mode', icon: WifiOff },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const renderMainContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <StudentDashboard onNavigate={setActiveTab} />;
      case 'profile':
        return <StudentProfile />;
      case 'quests':
        return <EnhancedQuestBoard />;
      case 'skills':
        return <SkillTrees />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'achievements':
        return <GamificationSystem />;
      case 'guild':
        return <CollaborationHub />;
      case 'ai-path':
        return <PersonalizedLearning />;
      case 'heroes':
        return <Leaderboard />;
      case 'fame':
        return <HallOfFame />;
      case 'forge':
        return <ChimeraForge />;
      case 'headquarters':
        return <GuildHeadquarters />;
      case 'log':
        return <Portfolio />;
      case 'collection':
        return <GamificationSystem />;
      case 'laboratory':
        return <LivingLabDashboard />;
      case 'village-lab':
        return <VillageLab />;
      case 'jugaad':
        return <JugaadStudio />;
      case 'science-fair':
        return <CommunityScienceFair />;
      case 'ar-lab':
        return <ARLab />;
      case 'metaverse':
        return <SpatialComputing />;
      case 'spatial':
        return <SpatialComputing />;
      case 'offline':
        return <OfflineMode />;
      case 'settings':
        return <Settings />;
      default:
        return <StudentDashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-primary flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-secondary border-r border-primary flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-primary">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">SA</span>
            </div>
            <div>
              <div className="text-primary font-semibold">Spark Adventurer</div>
              <div className="text-secondary text-sm">Student • Lv.12</div>
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
            {/* Left: Brand and User Info */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">✨</span>
                </div>
                <h1 className="text-xl font-bold text-primary">Project Spark</h1>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SA</span>
                </div>
                <div>
                  <div className="text-primary font-medium text-sm">Spark Adventurer</div>
                  <div className="text-secondary text-xs">Student • Lv.12</div>
                </div>
              </div>
            </div>

            {/* Center: Stats */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">XP</span>
                </div>
                <span className="text-primary font-medium">1.1K</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">💎</span>
                </div>
                <span className="text-primary font-medium">245</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">⚡</span>
                </div>
                <span className="text-primary font-medium">89</span>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center space-x-4">
              {currentClass && (
                <ClassSelector
                  currentClass={currentClass}
                  onClassChange={handleClassChange}
                />
              )}
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-tertiary rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 text-secondary" />
                </div>
                <span className="text-secondary text-sm">English</span>
              </div>

              <button className="w-8 h-8 bg-tertiary rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors">
                <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
              </button>

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

export default StudentRealm;