import React, { useState } from 'react';
import { 
  WifiOff, 
  Eye, 
  Settings, 
  Users,
  BarChart3,
  Download,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';

interface OfflineSettings {
  courseId: string;
  courseName: string;
  offlineEnabled: boolean;
  downloadableContent: {
    videos: boolean;
    documents: boolean;
    quizzes: boolean;
    assignments: boolean;
  };
  offlineAssessments: boolean;
  syncFrequency: 'immediate' | 'hourly' | 'daily';
}

interface StudentOfflineUsage {
  studentId: string;
  studentName: string;
  offlinePercentage: number;
  lastSync: string;
  pendingItems: number;
  downloadedContent: number;
  connectionQuality: 'poor' | 'fair' | 'good';
}

const OfflineAccessibilityConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'settings' | 'usage' | 'accessibility'>('settings');
  const [offlineSettings, setOfflineSettings] = useState<OfflineSettings[]>([
    {
      courseId: '1',
      courseName: 'Physics - Mechanics',
      offlineEnabled: true,
      downloadableContent: {
        videos: true,
        documents: true,
        quizzes: true,
        assignments: false
      },
      offlineAssessments: true,
      syncFrequency: 'hourly'
    },
    {
      courseId: '2',
      courseName: 'Chemistry - Organic',
      offlineEnabled: true,
      downloadableContent: {
        videos: false,
        documents: true,
        quizzes: true,
        assignments: true
      },
      offlineAssessments: false,
      syncFrequency: 'daily'
    }
  ]);

  const studentUsage: StudentOfflineUsage[] = [
    {
      studentId: '1',
      studentName: 'Alex Chen',
      offlinePercentage: 25,
      lastSync: '2024-02-15 14:30',
      pendingItems: 2,
      downloadedContent: 145,
      connectionQuality: 'good'
    },
    {
      studentId: '2',
      studentName: 'Maria Santos',
      offlinePercentage: 78,
      lastSync: '2024-02-14 09:15',
      pendingItems: 8,
      downloadedContent: 234,
      connectionQuality: 'poor'
    },
    {
      studentId: '3',
      studentName: 'David Kim',
      offlinePercentage: 45,
      lastSync: '2024-02-15 16:20',
      pendingItems: 1,
      downloadedContent: 189,
      connectionQuality: 'fair'
    }
  ];

  const updateOfflineSetting = (courseId: string, setting: string, value: any) => {
    setOfflineSettings(prev => prev.map(course => 
      course.courseId === courseId 
        ? { ...course, [setting]: value }
        : course
    ));
  };

  const updateContentSetting = (courseId: string, contentType: string, enabled: boolean) => {
    setOfflineSettings(prev => prev.map(course => 
      course.courseId === courseId 
        ? { 
            ...course, 
            downloadableContent: { 
              ...course.downloadableContent, 
              [contentType]: enabled 
            }
          }
        : course
    ));
  };

  const getConnectionColor = (quality: string) => {
    switch (quality) {
      case 'good': return 'text-green-400';
      case 'fair': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const renderOfflineSettings = () => (
    <div className="space-y-6">
      {offlineSettings.map((course) => (
        <Card key={course.courseId}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{course.courseName}</h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={course.offlineEnabled}
                  onChange={(e) => updateOfflineSetting(course.courseId, 'offlineEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            {course.offlineEnabled && (
              <>
                {/* Downloadable Content */}
                <div>
                  <h4 className="font-medium text-white mb-3">Downloadable Content Types</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(course.downloadableContent).map(([type, enabled]) => (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => updateContentSetting(course.courseId, type, e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-white/80 text-sm capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Assessment Settings */}
                <div>
                  <h4 className="font-medium text-white mb-3">Assessment Configuration</h4>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={course.offlineAssessments}
                      onChange={(e) => updateOfflineSetting(course.courseId, 'offlineAssessments', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-white/80">Allow offline quiz attempts</span>
                  </label>
                </div>

                {/* Sync Frequency */}
                <div>
                  <h4 className="font-medium text-white mb-3">Sync Frequency</h4>
                  <select
                    value={course.syncFrequency}
                    onChange={(e) => updateOfflineSetting(course.courseId, 'syncFrequency', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="immediate" className="bg-gray-800">Immediate (when online)</option>
                    <option value="hourly" className="bg-gray-800">Every hour</option>
                    <option value="daily" className="bg-gray-800">Daily</option>
                  </select>
                </div>
              </>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );

  const renderUsageReports = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Student Offline Usage</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          {studentUsage.map((student) => (
            <div key={student.studentId} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white">{student.studentName}</h4>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getConnectionColor(student.connectionQuality).replace('text-', 'bg-')}`}></div>
                  <span className={`text-sm ${getConnectionColor(student.connectionQuality)}`}>
                    {student.connectionQuality.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{student.offlinePercentage}%</div>
                  <div className="text-white/60 text-xs">Offline Usage</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{student.downloadedContent}</div>
                  <div className="text-white/60 text-xs">Downloaded MB</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{student.pendingItems}</div>
                  <div className="text-white/60 text-xs">Pending Sync</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-white">{new Date(student.lastSync).toLocaleDateString()}</div>
                  <div className="text-white/60 text-xs">Last Sync</div>
                </div>
              </div>
              
              <ProgressBar
                value={student.offlinePercentage}
                label="Offline Learning Percentage"
                variant={student.offlinePercentage > 70 ? 'warning' : 'primary'}
                size="sm"
              />
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );

  const renderAccessibilitySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Accessibility Configuration</h3>
        </CardHeader>
        <CardBody className="space-y-6">
          {/* Visual Accessibility */}
          <div>
            <h4 className="font-medium text-white mb-4">Visual Accessibility</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-white/80">High contrast mode available</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-white/80">Large text options</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-white/80">Reduced motion for sensitive users</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-white/80">Screen reader compatibility</span>
              </label>
            </div>
          </div>

          {/* Language Support */}
          <div>
            <h4 className="font-medium text-white mb-4">Multilingual Support</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['English', 'Hindi', 'Bengali', 'Telugu', 'Tamil', 'Gujarati', 'Marathi', 'Kannada'].map((language) => (
                <label key={language} className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked={language === 'English' || language === 'Hindi'} className="rounded" />
                  <span className="text-white/80 text-sm">{language}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Cognitive Load Management */}
          <div>
            <h4 className="font-medium text-white mb-4">Cognitive Load Management</h4>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-white/80">Automatic break suggestions</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-white/80">Simplified interface option</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-white/80">Audio narration for text content</span>
              </label>
            </div>
          </div>

          <Button variant="primary" className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Save Accessibility Settings
          </Button>
        </CardBody>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <WifiOff className="w-8 h-8 text-orange-400" />
          <h1 className="text-3xl font-bold text-white">Offline & Accessibility Configuration</h1>
        </div>
        <Badge variant="warning">Rural Optimization</Badge>
      </div>

      {/* Navigation */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-1">
        <div className="flex space-x-1">
          {[
            { id: 'settings', label: 'Offline Settings', icon: Settings },
            { id: 'usage', label: 'Usage Reports', icon: BarChart3 },
            { id: 'accessibility', label: 'Accessibility', icon: Eye }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg'
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
      {activeTab === 'settings' && renderOfflineSettings()}
      {activeTab === 'usage' && renderUsageReports()}
      {activeTab === 'accessibility' && renderAccessibilitySettings()}
    </div>
  );
};

export default OfflineAccessibilityConfig;