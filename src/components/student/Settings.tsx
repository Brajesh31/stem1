import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Eye, 
  Palette, 
  Save,
  Camera,
  Mail,
  Smartphone,
  Volume2,
  Moon,
  Sun,
  Type,
  Contrast
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppDispatch } from '../../store';
import { addNotification } from '../../store/slices/uiSlice';

const Settings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'accessibility'>('profile');
  const [isLoading, setIsLoading] = useState(false);

  // Profile settings state
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    avatar: user?.avatar_url || '🚀',
    bio: 'Learning enthusiast and quest conqueror!'
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    questReminders: true,
    achievementAlerts: true,
    weeklyReports: false,
    guildMessages: true,
    soundEffects: true
  });

  // Accessibility settings state
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    fontSize: 'medium',
    theme: 'dark',
    highContrast: false,
    reducedMotion: false,
    screenReader: false
  });

  const avatarOptions = ['🚀', '🧙‍♂️', '🦸‍♀️', '🤖', '🧚‍♀️', '⚡', '🔬', '🎨', '📚', '🎯'];

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateUser({
        displayName: profileData.displayName,
        email: profileData.email,
        avatar_url: profileData.avatar
      });
      dispatch(addNotification({ type: 'success', title: 'Profile Updated', message: 'Your profile has been saved successfully!' }));
    } catch (error) {
      dispatch(addNotification({ type: 'error', title: 'Update Failed', message: 'Failed to update profile. Please try again.' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      dispatch(addNotification({ type: 'success', title: 'Notifications Updated', message: 'Your notification preferences have been saved!' }));
    } catch (error) {
      dispatch(addNotification({ type: 'error', title: 'Update Failed', message: 'Failed to update notifications. Please try again.' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAccessibility = async () => {
    setIsLoading(true);
    try {
      // Simulate API call and apply changes
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Apply accessibility changes
      if (accessibilitySettings.highContrast) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
      
      if (accessibilitySettings.reducedMotion) {
        document.documentElement.classList.add('reduced-motion');
      } else {
        document.documentElement.classList.remove('reduced-motion');
      }
      
      dispatch(addNotification({ type: 'success', title: 'Accessibility Updated', message: 'Your accessibility preferences have been saved!' }));
    } catch (error) {
      dispatch(addNotification({ type: 'error', title: 'Update Failed', message: 'Failed to update accessibility settings. Please try again.' }));
    } finally {
      setIsLoading(false);
    }
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <User className="w-6 h-6 mr-2 text-purple-400" />
          Profile Information
        </h3>

        <div className="space-y-6">
          {/* Avatar Selection */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">Choose Your Avatar</label>
            <div className="grid grid-cols-5 gap-3">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setProfileData({ ...profileData, avatar })}
                  className={`text-4xl p-3 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                    profileData.avatar === avatar
                      ? 'border-purple-400 bg-purple-500/20'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Display Name</label>
            <input
              type="text"
              value={profileData.displayName}
              onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your display name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Email Address</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Bio</label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-purple-500 hover:to-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Save className="w-5 h-5 mr-2" />
            {isLoading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Bell className="w-6 h-6 mr-2 text-blue-400" />
          Notification Preferences
        </h3>

        <div className="space-y-6">
          {/* Email Notifications */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-white flex items-center">
              <Mail className="w-5 h-5 mr-2 text-green-400" />
              Email Notifications
            </h4>
            
            {[
              { key: 'emailNotifications', label: 'Enable email notifications', description: 'Receive important updates via email' },
              { key: 'questReminders', label: 'Quest reminders', description: 'Get reminded about incomplete quests' },
              { key: 'achievementAlerts', label: 'Achievement alerts', description: 'Celebrate your victories via email' },
              { key: 'weeklyReports', label: 'Weekly progress reports', description: 'Summary of your learning progress' },
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">{setting.label}</p>
                  <p className="text-white/60 text-sm">{setting.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings[setting.key as keyof typeof notificationSettings] as boolean}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      [setting.key]: e.target.checked
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>

          {/* App Notifications */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-white flex items-center">
              <Smartphone className="w-5 h-5 mr-2 text-purple-400" />
              In-App Notifications
            </h4>
            
            {[
              { key: 'pushNotifications', label: 'Push notifications', description: 'Receive notifications in the app' },
              { key: 'guildMessages', label: 'Guild messages', description: 'Get notified of guild chat messages' },
              { key: 'soundEffects', label: 'Sound effects', description: 'Play sounds for notifications and achievements' },
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">{setting.label}</p>
                  <p className="text-white/60 text-sm">{setting.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings[setting.key as keyof typeof notificationSettings] as boolean}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      [setting.key]: e.target.checked
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveNotifications}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-500 hover:to-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Save className="w-5 h-5 mr-2" />
            {isLoading ? 'Saving...' : 'Save Notification Settings'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderAccessibilitySettings = () => (
    <div className="space-y-6">
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Eye className="w-6 h-6 mr-2 text-emerald-400" />
          Accessibility Options
        </h3>

        <div className="space-y-6">
          {/* Visual Settings */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-white flex items-center">
              <Type className="w-5 h-5 mr-2 text-blue-400" />
              Visual Settings
            </h4>

            {/* Font Size */}
            <div className="p-4 bg-white/5 rounded-lg">
              <label className="block text-white font-medium mb-3">Font Size</label>
              <div className="flex space-x-3">
                {['small', 'medium', 'large', 'extra-large'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setAccessibilitySettings({ ...accessibilitySettings, fontSize: size })}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      accessibilitySettings.fontSize === size
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme */}
            <div className="p-4 bg-white/5 rounded-lg">
              <label className="block text-white font-medium mb-3">Theme</label>
              <div className="flex space-x-3">
                {[
                  { key: 'dark', label: 'Dark', icon: Moon },
                  { key: 'light', label: 'Light', icon: Sun },
                  { key: 'auto', label: 'Auto', icon: Palette }
                ].map((theme) => {
                  const IconComponent = theme.icon;
                  return (
                    <button
                      key={theme.key}
                      onClick={() => setAccessibilitySettings({ ...accessibilitySettings, theme: theme.key })}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        accessibilitySettings.theme === theme.key
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{theme.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Toggle Settings */}
            {[
              { key: 'highContrast', label: 'High contrast mode', description: 'Increase contrast for better visibility', icon: Contrast },
              { key: 'reducedMotion', label: 'Reduce motion', description: 'Minimize animations and transitions', icon: Eye },
              { key: 'screenReader', label: 'Screen reader support', description: 'Optimize for screen reader compatibility', icon: Volume2 },
            ].map((setting) => {
              const IconComponent = setting.icon;
              return (
                <div key={setting.key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-white font-medium">{setting.label}</p>
                      <p className="text-white/60 text-sm">{setting.description}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accessibilitySettings[setting.key as keyof typeof accessibilitySettings] as boolean}
                      onChange={(e) => setAccessibilitySettings({
                        ...accessibilitySettings,
                        [setting.key]: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleSaveAccessibility}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-medium hover:from-emerald-500 hover:to-teal-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Save className="w-5 h-5 mr-2" />
            {isLoading ? 'Saving...' : 'Save Accessibility Settings'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <User className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-primary">Adventurer Profile</h1>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 bg-tertiary rounded-lg hover:bg-primary/20 transition-colors">
            <QrCode className="w-4 h-4 text-secondary" />
            <span className="text-secondary text-sm">Generate QR Login</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-accent-interactive text-white rounded-lg hover:opacity-90 transition-opacity">
            <Edit className="w-4 h-4" />
            <span className="text-sm">Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Profile Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Profile Card */}
        <div className="bg-secondary border border-primary rounded-xl p-6">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🚀</span>
            </div>
            <h2 className="text-xl font-bold text-primary mb-2">Spark Adventurer</h2>
            <p className="text-secondary">Learning enthusiast and quest conqueror!</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-primary">
              <span className="text-secondary">School:</span>
              <span className="text-primary">Demo School</span>
            </div>
            <div className="flex justify-between py-2 border-b border-primary">
              <span className="text-secondary">Grade:</span>
              <span className="text-primary">Class 8</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-secondary">Role:</span>
              <span className="text-primary">Student Adventurer</span>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Information */}
        <div className="bg-secondary border border-primary rounded-xl p-6">
          <h3 className="text-lg font-semibold text-primary mb-6">Profile Information</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Display Name</label>
                <input
                  type="text"
                  value="Spark Adventurer"
                  className="w-full px-4 py-3 bg-tertiary border border-primary rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent-interactive"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Email Address</label>
                <input
                  type="email"
                  value="student@demo.com"
                  className="w-full px-4 py-3 bg-tertiary border border-primary rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent-interactive"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Bio</label>
              <textarea
                rows={3}
                value="Learning enthusiast and quest conqueror!"
                className="w-full px-4 py-3 bg-tertiary border border-primary rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent-interactive resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">School</label>
                <input
                  type="text"
                  value="Demo School"
                  disabled
                  className="w-full px-4 py-3 bg-primary/10 border border-primary rounded-lg text-secondary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Grade Level</label>
                <select className="w-full px-4 py-3 bg-tertiary border border-primary rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent-interactive">
                  <option>Class 8</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Privacy Section */}
      <div className="bg-secondary border border-primary rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-6 h-6 text-green-400" />
          <h2 className="text-xl font-bold text-primary">Security & Privacy</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Account Security */}
          <div>
            <h3 className="font-semibold text-primary mb-4">Account Security</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center space-x-3 px-4 py-3 bg-tertiary border border-primary rounded-lg hover:bg-primary/10 transition-colors text-left">
                <Shield className="w-5 h-5 text-secondary" />
                <span className="text-primary">Change Password</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 bg-tertiary border border-primary rounded-lg hover:bg-primary/10 transition-colors text-left">
                <QrCode className="w-5 h-5 text-secondary" />
                <span className="text-primary">Setup QR Login</span>
              </button>
            </div>
          </div>
          
          {/* Privacy Settings */}
          <div>
            <h3 className="font-semibold text-primary mb-4">Privacy Settings</h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-accent-interactive bg-tertiary border-primary rounded focus:ring-accent-interactive" />
                <span className="text-secondary">Show profile to classmates</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-accent-interactive bg-tertiary border-primary rounded focus:ring-accent-interactive" />
                <span className="text-secondary">Allow peer messaging</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-accent-interactive bg-tertiary border-primary rounded focus:ring-accent-interactive" />
                <span className="text-secondary">Share progress with guardians</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;