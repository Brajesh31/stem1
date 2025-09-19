import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Clock,
  Award,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';

const TeacherAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'semester'>('week');
  const [selectedClass, setSelectedClass] = useState('all');

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalStudents: 28,
      activeStudents: 24,
      averageEngagement: 87,
      completionRate: 82,
      averageScore: 78
    },
    performance: {
      topPerformers: [
        { name: 'Alex Chen', score: 95, improvement: '+12%' },
        { name: 'Maria Santos', score: 92, improvement: '+8%' },
        { name: 'David Kim', score: 89, improvement: '+15%' }
      ],
      strugglingStudents: [
        { name: 'John Doe', score: 45, trend: 'declining', recommendation: 'Additional practice needed' },
        { name: 'Jane Smith', score: 52, trend: 'stable', recommendation: 'One-on-one session recommended' }
      ]
    },
    subjects: [
      { name: 'Mathematics', averageScore: 82, engagement: 89, completion: 85 },
      { name: 'Physics', averageScore: 76, engagement: 84, completion: 78 },
      { name: 'Chemistry', averageScore: 79, engagement: 81, completion: 82 },
      { name: 'Biology', averageScore: 84, engagement: 92, completion: 88 }
    ],
    trends: {
      weeklyEngagement: [78, 82, 85, 87, 89, 84, 87],
      completionRates: [75, 78, 80, 82, 85, 83, 82],
      averageScores: [74, 76, 78, 77, 79, 78, 78]
    }
  };

  const classes = [
    { id: 'all', name: 'All Classes' },
    { id: 'class1', name: 'Grade 8A - Physics' },
    { id: 'class2', name: 'Grade 8B - Physics' },
    { id: 'class3', name: 'Grade 9A - Physics' }
  ];

  const exportReport = () => {
    dispatch(addNotification({
      type: 'success',
      title: 'Report Generated',
      message: 'Analytics report has been generated and downloaded.'
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Learning Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Comprehensive insights into student performance and engagement</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" icon={<Download className="w-4 h-4" />} onClick={exportReport}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="semester">This Semester</option>
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <CardBody className="p-6 text-center">
            <Users className="w-10 h-10 text-blue-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{analyticsData.overview.totalStudents}</div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Total Students</div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <CardBody className="p-6 text-center">
            <Eye className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">{analyticsData.overview.activeStudents}</div>
            <div className="text-sm text-green-600 dark:text-green-400">Active Students</div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
          <CardBody className="p-6 text-center">
            <TrendingUp className="w-10 h-10 text-purple-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{analyticsData.overview.averageEngagement}%</div>
            <div className="text-sm text-purple-600 dark:text-purple-400">Engagement</div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
          <CardBody className="p-6 text-center">
            <Target className="w-10 h-10 text-orange-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{analyticsData.overview.completionRate}%</div>
            <div className="text-sm text-orange-600 dark:text-orange-400">Completion Rate</div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border-pink-200 dark:border-pink-700">
          <CardBody className="p-6 text-center">
            <Award className="w-10 h-10 text-pink-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-pink-700 dark:text-pink-300">{analyticsData.overview.averageScore}%</div>
            <div className="text-sm text-pink-600 dark:text-pink-400">Average Score</div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-blue-500" />
              Subject Performance
            </h2>
          </CardHeader>
          
          <CardBody className="space-y-4">
            {analyticsData.subjects.map((subject) => (
              <div key={subject.name} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{subject.name}</h3>
                  <Badge variant="primary">{subject.averageScore}% avg</Badge>
                </div>
                
                <div className="space-y-2">
                  <ProgressBar
                    value={subject.engagement}
                    label="Engagement"
                    showPercentage
                    variant="primary"
                    size="sm"
                  />
                  <ProgressBar
                    value={subject.completion}
                    label="Completion"
                    showPercentage
                    variant="success"
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Student Performance */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <Users className="w-6 h-6 mr-2 text-green-500" />
              Student Performance
            </h2>
          </CardHeader>
          
          <CardBody className="space-y-6">
            {/* Top Performers */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Top Performers
              </h3>
              <div className="space-y-2">
                {analyticsData.performance.topPerformers.map((student, index) => (
                  <div key={student.name} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{student.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-700 dark:text-green-300">{student.score}%</div>
                      <div className="text-xs text-green-600 dark:text-green-400">{student.improvement}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Students Needing Support */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                Students Needing Support
              </h3>
              <div className="space-y-2">
                {analyticsData.performance.strugglingStudents.map((student) => (
                  <div key={student.name} className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">{student.name}</span>
                      <Badge variant="warning">{student.score}%</Badge>
                    </div>
                    <p className="text-sm text-orange-700 dark:text-orange-300">{student.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default TeacherAnalytics;