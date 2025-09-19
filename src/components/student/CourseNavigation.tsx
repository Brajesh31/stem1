import React, { useState } from 'react';
import { BookOpen, Users, Calendar, FileText, Filter, Search, Clock, Target, Award } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Input from '../ui/Input';
import ProgressBar from '../ui/ProgressBar';

interface Course {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  participants: number;
  progress: number;
  grade: string;
  nextDeadline?: {
    title: string;
    date: string;
    type: 'assignment' | 'quiz' | 'project';
  };
  materials: {
    videos: number;
    documents: number;
    assignments: number;
    quizzes: number;
  };
}

const CourseNavigation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  const courses: Course[] = [
    {
      id: '1',
      title: 'Advanced Physics - Mechanics',
      subject: 'Physics',
      teacher: 'Dr. Sarah Johnson',
      participants: 28,
      progress: 75,
      grade: 'A-',
      nextDeadline: {
        title: 'Lab Report: Pendulum Motion',
        date: '2024-02-20',
        type: 'assignment'
      },
      materials: { videos: 12, documents: 8, assignments: 5, quizzes: 3 }
    },
    {
      id: '2',
      title: 'Organic Chemistry Fundamentals',
      subject: 'Chemistry',
      teacher: 'Prof. Raj Patel',
      participants: 24,
      progress: 60,
      grade: 'B+',
      nextDeadline: {
        title: 'Molecular Structure Quiz',
        date: '2024-02-18',
        type: 'quiz'
      },
      materials: { videos: 15, documents: 12, assignments: 4, quizzes: 6 }
    },
    {
      id: '3',
      title: 'Calculus and Applications',
      subject: 'Mathematics',
      teacher: 'Ms. Priya Sharma',
      participants: 32,
      progress: 85,
      grade: 'A',
      materials: { videos: 20, documents: 15, assignments: 8, quizzes: 10 }
    },
    {
      id: '4',
      title: 'Cell Biology and Genetics',
      subject: 'Biology',
      teacher: 'Dr. Anita Kumar',
      participants: 26,
      progress: 45,
      grade: 'B',
      nextDeadline: {
        title: 'Genetics Project',
        date: '2024-02-25',
        type: 'project'
      },
      materials: { videos: 18, documents: 10, assignments: 3, quizzes: 4 }
    }
  ];

  const subjects = ['all', ...Array.from(new Set(courses.map(c => c.subject)))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterSubject === 'all' || course.subject === filterSubject;
    return matchesSearch && matchesFilter;
  });

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'success';
    if (grade.startsWith('B')) return 'warning';
    if (grade.startsWith('C')) return 'info';
    return 'danger';
  };

  const getDeadlineColor = (date: string) => {
    const deadline = new Date(date);
    const now = new Date();
    const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil <= 1) return 'danger';
    if (daysUntil <= 3) return 'warning';
    return 'info';
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredCourses.map((course) => (
        <Card key={course.id} className="hover:transform hover:scale-105 transition-all duration-300">
          <CardBody className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">{course.title}</h3>
                <p className="text-white/70 text-sm mb-2">by {course.teacher}</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{course.subject}</Badge>
                  {course.grade && <Badge variant={getGradeColor(course.grade) as any}>{course.grade}</Badge>}
                </div>
              </div>
              <div className="text-3xl">
                {course.subject === 'Physics' ? '⚛️' :
                 course.subject === 'Chemistry' ? '🧪' :
                 course.subject === 'Mathematics' ? '📐' :
                 course.subject === 'Biology' ? '🧬' : '📚'}
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <ProgressBar
                value={course.progress}
                label="Course Progress"
                showPercentage
                variant="primary"
                size="sm"
              />
            </div>

            {/* Next Deadline */}
            {course.nextDeadline && (
              <div className={`mb-4 p-3 rounded-lg border ${
                getDeadlineColor(course.nextDeadline.date) === 'danger' ? 'border-red-400/30 bg-red-500/10' :
                getDeadlineColor(course.nextDeadline.date) === 'warning' ? 'border-yellow-400/30 bg-yellow-500/10' :
                'border-blue-400/30 bg-blue-500/10'
              }`}>
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="w-4 h-4 text-white/60" />
                  <span className="text-white/80 text-sm font-medium">Next Deadline</span>
                </div>
                <p className="text-white text-sm">{course.nextDeadline.title}</p>
                <p className="text-white/60 text-xs">Due: {new Date(course.nextDeadline.date).toLocaleDateString()}</p>
              </div>
            )}

            {/* Course Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <Users className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <div className="text-white font-medium">{course.participants}</div>
                <div className="text-white/60 text-xs">Students</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <FileText className="w-5 h-5 text-green-400 mx-auto mb-1" />
                <div className="text-white font-medium">
                  {course.materials.videos + course.materials.documents + course.materials.assignments + course.materials.quizzes}
                </div>
                <div className="text-white/60 text-xs">Materials</div>
              </div>
            </div>

            <Button variant="primary" className="w-full">
              <BookOpen className="w-4 h-4 mr-2" />
              Enter Course
            </Button>
          </CardBody>
        </Card>
      ))}
    </div>
  );

  const renderTimelineView = () => (
    <div className="space-y-6">
      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-orange-400" />
            Upcoming Deadlines
          </h3>
        </CardHeader>
        <CardBody className="space-y-4">
          {courses
            .filter(course => course.nextDeadline)
            .sort((a, b) => new Date(a.nextDeadline!.date).getTime() - new Date(b.nextDeadline!.date).getTime())
            .map((course) => (
              <div key={course.id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                <div className="text-3xl">
                  {course.subject === 'Physics' ? '⚛️' :
                   course.subject === 'Chemistry' ? '🧪' :
                   course.subject === 'Mathematics' ? '📐' :
                   course.subject === 'Biology' ? '🧬' : '📚'}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{course.nextDeadline!.title}</h4>
                  <p className="text-white/70 text-sm">{course.title}</p>
                  <p className="text-white/60 text-xs">by {course.teacher}</p>
                </div>
                <div className="text-right">
                  <Badge variant={getDeadlineColor(course.nextDeadline!.date) as any}>
                    {new Date(course.nextDeadline!.date).toLocaleDateString()}
                  </Badge>
                  <p className="text-white/60 text-xs mt-1">{course.nextDeadline!.type}</p>
                </div>
              </div>
            ))}
        </CardBody>
      </Card>

      {/* Course Progress Overview */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">Course Progress Overview</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white">{course.title}</h4>
                <Badge variant={getGradeColor(course.grade || 'C') as any}>
                  {course.grade || 'No Grade'}
                </Badge>
              </div>
              <ProgressBar
                value={course.progress}
                label="Progress"
                showPercentage
                variant="primary"
                size="sm"
              />
              <div className="flex justify-between text-xs text-white/60 mt-2">
                <span>{course.teacher}</span>
                <span>{course.participants} students</span>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold text-white">My Learning Adventures</h1>
        </div>
        <Badge variant="info">{filteredCourses.length} active courses</Badge>
      </div>

      {/* Controls */}
      <Card>
        <CardBody className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search courses, teachers, or subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
            </div>
            
            <div className="flex space-x-2">
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject} className="bg-gray-800">
                    {subject === 'all' ? 'All Subjects' : subject}
                  </option>
                ))}
              </select>
              
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'secondary'}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'timeline' ? 'primary' : 'secondary'}
                onClick={() => setViewMode('timeline')}
              >
                Timeline
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Content */}
      {viewMode === 'grid' ? renderGridView() : renderTimelineView()}
    </div>
  );
};

export default CourseNavigation;