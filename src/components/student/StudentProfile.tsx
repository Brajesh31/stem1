import React, { useState } from 'react';
import { User, Camera, Save, Edit, QrCode, Shield, Bell, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppDispatch } from '../../store';
import { addNotification } from '../../store/slices/uiSlice';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

const StudentProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    avatar: user?.avatar_url || '🚀',
    bio: 'Learning enthusiast and quest conqueror!',
    school: 'Demo School',
    grade: user?.grade || 8
  });

  const avatarOptions = ['🚀', '🧙‍♂️', '🦸‍♀️', '🤖', '🧚‍♀️', '⚡', '🔬', '🎨', '📚', '🎯', '🌟', '🦉', '🐉', '🦄', '🎭'];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateUser({
        displayName: profileData.displayName,
        email: profileData.email,
        avatar_url: profileData.avatar
      });
      
      dispatch(addNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been saved successfully!'
      }));
      
      setIsEditing(false);
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update profile. Please try again.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const generateQRCode = () => {
    dispatch(addNotification({
      type: 'info',
      title: 'QR Code Generated',
      message: 'Your login QR code has been generated for quick classroom access!'
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <User className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">Adventurer Profile</h1>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={generateQRCode}
            icon={<QrCode className="w-4 h-4" />}
          >
            Generate QR Login
          </Button>
          <Button
            variant={isEditing ? 'success' : 'primary'}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            loading={isLoading}
            icon={isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardBody className="p-6 text-center">
            {/* Avatar Selection */}
            <div className="mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg">
                {profileData.avatar}
              </div>
              
              {isEditing && (
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => setProfileData({ ...profileData, avatar })}
                      className={`text-2xl p-2 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                        profileData.avatar === avatar
                          ? 'border-purple-400 bg-purple-500/20'
                          : 'border-white/20 bg-white/5 hover:border-white/40'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold text-white mb-2">{profileData.displayName}</h2>
            <p className="text-white/70 mb-4">{profileData.bio}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">School:</span>
                <span className="text-white">{profileData.school}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Grade:</span>
                <span className="text-white">Class {profileData.grade}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Role:</span>
                <span className="text-white">Student Adventurer</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Profile Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="text-lg font-semibold text-white">Profile Information</h3>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Display Name"
                value={profileData.displayName}
                onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                disabled={!isEditing}
              />
              
              <Input
                label="Email Address"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Bio</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                disabled={!isEditing}
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 resize-none"
                placeholder="Tell us about your learning journey..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">School</label>
                <input
                  type="text"
                  value={profileData.school}
                  disabled
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white/60"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Grade Level</label>
                <select
                  value={profileData.grade}
                  onChange={(e) => setProfileData({ ...profileData, grade: parseInt(e.target.value) })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
                >
                  {Array.from({ length: 7 }, (_, i) => i + 6).map(grade => (
                    <option key={grade} value={grade} className="bg-gray-800">Class {grade}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Security & Privacy */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-400" />
            Security & Privacy
          </h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-white mb-3">Account Security</h4>
              <div className="space-y-3">
                <Button variant="secondary" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <QrCode className="w-4 h-4 mr-2" />
                  Setup QR Login
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-3">Privacy Settings</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-white/80 text-sm">Show profile to classmates</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-white/80 text-sm">Allow peer messaging</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded" />
                  <span className="text-white/80 text-sm">Share progress with guardians</span>
                </label>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default StudentProfile;