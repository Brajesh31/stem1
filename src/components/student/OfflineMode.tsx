import React, { useState, useEffect } from 'react';
import { Download, Wifi, WifiOff, HardDrive, FolderSync as Sync, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';

interface OfflineContent {
  id: string;
  title: string;
  type: 'course' | 'quiz' | 'video' | 'document';
  subject: string;
  size: number; // in MB
  downloadProgress: number;
  isDownloaded: boolean;
  lastUpdated: string;
}

interface SyncItem {
  id: string;
  type: 'quiz_attempt' | 'forum_post' | 'assignment_submission' | 'progress_update';
  title: string;
  timestamp: string;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
}

const OfflineMode: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [storageUsage, setStorageUsage] = useState({ used: 0, total: 0 });
  const [offlineContent, setOfflineContent] = useState<OfflineContent[]>([]);
  const [syncQueue, setSyncQueue] = useState<SyncItem[]>([]);
  const [activeTab, setActiveTab] = useState<'download' | 'sync' | 'storage'>('download');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadOfflineData();
    updateStorageUsage();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineData = () => {
    const mockContent: OfflineContent[] = [
      {
        id: '1',
        title: 'Physics - Wave Motion Chapter',
        type: 'course',
        subject: 'Physics',
        size: 45.2,
        downloadProgress: 100,
        isDownloaded: true,
        lastUpdated: '2024-02-15'
      },
      {
        id: '2',
        title: 'Chemistry Lab Videos',
        type: 'video',
        subject: 'Chemistry',
        size: 128.5,
        downloadProgress: 75,
        isDownloaded: false,
        lastUpdated: '2024-02-14'
      },
      {
        id: '3',
        title: 'Mathematics Practice Quizzes',
        type: 'quiz',
        subject: 'Mathematics',
        size: 12.8,
        downloadProgress: 100,
        isDownloaded: true,
        lastUpdated: '2024-02-13'
      },
      {
        id: '4',
        title: 'Biology Reference Documents',
        type: 'document',
        subject: 'Biology',
        size: 23.4,
        downloadProgress: 0,
        isDownloaded: false,
        lastUpdated: '2024-02-12'
      }
    ];

    const mockSyncItems: SyncItem[] = [
      {
        id: '1',
        type: 'quiz_attempt',
        title: 'Physics Quiz - Wave Properties',
        timestamp: '2024-02-15 14:30',
        status: 'pending'
      },
      {
        id: '2',
        type: 'forum_post',
        title: 'Question about chemical bonding',
        timestamp: '2024-02-15 12:15',
        status: 'completed'
      },
      {
        id: '3',
        type: 'assignment_submission',
        title: 'Math Problem Set #5',
        timestamp: '2024-02-14 16:45',
        status: 'failed'
      }
    ];

    setOfflineContent(mockContent);
    setSyncQueue(mockSyncItems);
  };

  const updateStorageUsage = async () => {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        setStorageUsage({
          used: Math.round((estimate.usage || 0) / (1024 * 1024)), // Convert to MB
          total: Math.round((estimate.quota || 0) / (1024 * 1024))
        });
      }
    } catch (error) {
      console.error('Failed to get storage estimate:', error);
    }
  };

  const handleDownload = (contentId: string) => {
    setOfflineContent(prev => prev.map(content => 
      content.id === contentId 
        ? { ...content, downloadProgress: 0 }
        : content
    ));

    // Simulate download progress
    const interval = setInterval(() => {
      setOfflineContent(prev => prev.map(content => {
        if (content.id === contentId) {
          const newProgress = Math.min(100, content.downloadProgress + 10);
          return {
            ...content,
            downloadProgress: newProgress,
            isDownloaded: newProgress === 100
          };
        }
        return content;
      }));
    }, 500);

    setTimeout(() => clearInterval(interval), 5000);
  };

  const handleSync = () => {
    if (!isOnline) return;

    setSyncQueue(prev => prev.map(item => 
      item.status === 'pending' || item.status === 'failed'
        ? { ...item, status: 'syncing' }
        : item
    ));

    // Simulate sync process
    setTimeout(() => {
      setSyncQueue(prev => prev.map(item => 
        item.status === 'syncing'
          ? { ...item, status: 'completed' }
          : item
      ));
    }, 3000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return '📚';
      case 'quiz': return '📝';
      case 'video': return '🎥';
      case 'document': return '📄';
      default: return '📁';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'syncing': return 'text-blue-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const renderDownloadManager = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Available for Download</h3>
            <Button variant="primary" size="sm" disabled={!isOnline}>
              <Download className="w-4 h-4 mr-1" />
              Download All
            </Button>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          {offlineContent.map((content) => (
            <div key={content.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{getTypeIcon(content.type)}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{content.title}</h4>
                  <div className="flex items-center space-x-2 text-sm text-white/60">
                    <span>{content.subject}</span>
                    <span>•</span>
                    <span>{content.size} MB</span>
                    <span>•</span>
                    <span>Updated {new Date(content.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  {content.isDownloaded ? (
                    <Badge variant="success">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Downloaded
                    </Badge>
                  ) : content.downloadProgress > 0 ? (
                    <div className="w-24">
                      <ProgressBar
                        value={content.downloadProgress}
                        size="sm"
                        showPercentage
                      />
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleDownload(content.id)}
                      disabled={!isOnline}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );

  const renderSyncManager = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Sync Queue</h3>
            <Button
              variant="primary"
              onClick={handleSync}
              disabled={!isOnline || syncQueue.every(item => item.status === 'completed')}
              icon={<Sync className="w-4 h-4" />}
            >
              Sync All
            </Button>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          {syncQueue.map((item) => (
            <div key={item.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{item.title}</h4>
                  <div className="flex items-center space-x-2 text-sm text-white/60">
                    <span>{item.type.replace('_', ' ')}</span>
                    <span>•</span>
                    <span>{item.timestamp}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {item.status === 'syncing' && <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />}
                  {item.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-400" />}
                  {item.status === 'failed' && <AlertCircle className="w-4 h-4 text-red-400" />}
                  {item.status === 'pending' && <Clock className="w-4 h-4 text-yellow-400" />}
                  <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );

  const renderStorageManager = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white flex items-center">
            <HardDrive className="w-5 h-5 mr-2 text-blue-400" />
            Storage Management
          </h3>
        </CardHeader>
        <CardBody className="space-y-6">
          {/* Storage Overview */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/70">Storage Used</span>
              <span className="text-white">{storageUsage.used} MB / {storageUsage.total} MB</span>
            </div>
            <ProgressBar
              value={storageUsage.used}
              max={storageUsage.total}
              variant={storageUsage.used / storageUsage.total > 0.8 ? 'danger' : 'primary'}
              size="sm"
            />
          </div>

          {/* Storage Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { type: 'Videos', size: 245, color: 'bg-red-500' },
              { type: 'Documents', size: 89, color: 'bg-blue-500' },
              { type: 'Quizzes', size: 34, color: 'bg-green-500' },
              { type: 'Images', size: 67, color: 'bg-purple-500' }
            ].map((category) => (
              <div key={category.type} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{category.type}</span>
                  <span className="text-white/70 text-sm">{category.size} MB</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className={`${category.color} h-2 rounded-full`}
                    style={{ width: `${(category.size / 500) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Storage Actions */}
          <div className="flex space-x-3">
            <Button variant="warning" className="flex-1">
              Clear Cache
            </Button>
            <Button variant="danger" className="flex-1">
              Remove Old Downloads
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isOnline ? (
            <Wifi className="w-8 h-8 text-green-400" />
          ) : (
            <WifiOff className="w-8 h-8 text-red-400" />
          )}
          <div>
            <h1 className="text-3xl font-bold text-white">Offline Learning</h1>
            <p className={`${isOnline ? 'text-green-300' : 'text-red-300'}`}>
              {isOnline ? 'Connected - Ready to sync' : 'Offline - Using cached content'}
            </p>
          </div>
        </div>
        <Badge variant={isOnline ? 'success' : 'danger'}>
          {isOnline ? 'Online' : 'Offline'}
        </Badge>
      </div>

      {/* Connection Status */}
      <Card className={`border-2 ${isOnline ? 'border-green-400/30 bg-green-500/10' : 'border-red-400/30 bg-red-500/10'}`}>
        <CardBody className="p-4">
          <div className="flex items-center space-x-3">
            {isOnline ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-400" />
            )}
            <div>
              <h3 className={`font-semibold ${isOnline ? 'text-green-300' : 'text-red-300'}`}>
                {isOnline ? 'Internet Connection Active' : 'Working Offline'}
              </h3>
              <p className={`text-sm ${isOnline ? 'text-green-200' : 'text-red-200'}`}>
                {isOnline 
                  ? 'All features available. Sync queue will be processed automatically.'
                  : 'Limited to downloaded content. Your progress is being saved locally.'
                }
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Navigation */}
      <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-1">
        <div className="flex space-x-1">
          {[
            { id: 'download', label: 'Download Manager', icon: Download },
            { id: 'sync', label: 'Sync Queue', icon: Sync },
            { id: 'storage', label: 'Storage', icon: HardDrive }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'download' && renderDownloadManager()}
      {activeTab === 'sync' && renderSyncManager()}
      {activeTab === 'storage' && renderStorageManager()}
    </div>
  );
};

export default OfflineMode;