import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface Child {
  id: string;
  name: string;
  grade: number;
  level: number;
  experience: number;
  streak: number;
  lastActive: string;
  weeklyProgress: {
    questsCompleted: number;
    timeSpent: number;
    averageScore: number;
  };
  subjects: {
    name: string;
    progress: number;
    grade: string;
    recentActivity: string;
  }[];
}

const GuardianDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'communication'>('overview');

  useEffect(() => {
    loadChildrenData();
  }, []);

  const loadChildrenData = () => {
    const mockChildren: Child[] = [
      {
        id: '1',
        name: 'Emma Chen',
        grade: 8,
        level: 15,
        experience: 3420,
        streak: 8,
        lastActive: '2024-02-15T16:30:00Z',
        weeklyProgress: {
          questsCompleted: 7,
          timeSpent: 245,
          averageScore: 87
        },
        subjects: [
          { name: 'Mathematics', progress: 85, grade: 'A', recentActivity: 'Completed Algebra Quest' },
          { name: 'Physics', progress: 78, grade: 'B+', recentActivity: 'Started Forces of Nature' },
          { name: 'Chemistry', progress: 92, grade: 'A+', recentActivity: 'Mastered Molecular Bonds' },
          { name: 'Biology', progress: 73, grade: 'B', recentActivity: 'Studying Cell Structure' }
        ]
      }
    ];

    setChildren(mockChildren);
    setSelectedChild(mockChildren[0]);
  };

  const formatTimeSpent = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const renderOverview = () => (
    <div>
      <h3>Your Children</h3>
      <div>
        {children.map((child) => (
          <div key={child.id}>
            <button
              onClick={() => setSelectedChild(child)}
              disabled={selectedChild?.id === child.id}
            >
              <h4>{child.name}</h4>
              <p>Grade {child.grade} • Level {child.level}</p>
              <p>Last active: {new Date(child.lastActive).toLocaleDateString()}</p>
            </button>
          </div>
        ))}
      </div>

      {selectedChild && (
        <div>
          <h3>{selectedChild.name}'s Weekly Summary</h3>
          <div>
            <div>
              <h4>Quests Completed</h4>
              <p>{selectedChild.weeklyProgress.questsCompleted}</p>
            </div>
            <div>
              <h4>Time Spent Learning</h4>
              <p>{formatTimeSpent(selectedChild.weeklyProgress.timeSpent)}</p>
            </div>
            <div>
              <h4>Average Score</h4>
              <p>{selectedChild.weeklyProgress.averageScore}%</p>
            </div>
          </div>

          <h4>Subject Progress</h4>
          <div>
            {selectedChild.subjects.map((subject) => (
              <div key={subject.name}>
                <h5>{subject.name}</h5>
                <p>Grade: {subject.grade}</p>
                <p>Progress: {subject.progress}%</p>
                <progress value={subject.progress} max={100}>{subject.progress}%</progress>
                <p>Recent: {subject.recentActivity}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <header>
        <h1>Project Spark - Guardian</h1>
        <div>
          <span>User: {user?.displayName}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <div>
        <nav>
          <ul>
            <li>
              <button
                onClick={() => setActiveTab('overview')}
                disabled={activeTab === 'overview'}
              >
                Child Overview
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('progress')}
                disabled={activeTab === 'progress'}
              >
                Detailed Progress
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('communication')}
                disabled={activeTab === 'communication'}
              >
                Communication
              </button>
            </li>
          </ul>
        </nav>

        <main>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'progress' && <div><h2>Detailed Progress</h2><p>Coming soon...</p></div>}
          {activeTab === 'communication' && <div><h2>Communication</h2><p>Coming soon...</p></div>}
        </main>
      </div>
    </div>
  );
};

export default GuardianDashboard;