import React from 'react';
import { User, Trophy, BookOpen, Clock, Star, Target } from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (section: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const playerStats = {
    level: 12,
    xp: 2450,
    xpToNext: 550,
    streak: 7,
    completedQuests: 23,
    totalQuests: 45
  };

  const recentActivities = [
    { id: 1, type: 'quest', title: 'Math Adventure: Fractions', xp: 150, time: '2 hours ago' },
    { id: 2, type: 'achievement', title: 'Problem Solver Badge', xp: 100, time: '1 day ago' },
    { id: 3, type: 'collaboration', title: 'Team Project: Science Fair', xp: 200, time: '2 days ago' }
  ];

  const quickActions = [
    { id: 'quests', title: 'Quest Board', icon: Target, description: 'Explore new adventures' },
    { id: 'skills', title: 'Skill Trees', icon: BookOpen, description: 'Level up your abilities' },
    { id: 'portfolio', title: 'Portfolio', icon: Star, description: 'Showcase your work' },
    { id: 'leaderboard', title: 'Hall of Fame', icon: Trophy, description: 'See top performers' }
  ];

  return (
    <div className="section">
      <div className="container">
        {/* Welcome Header */}
        <div className="card mb-xl">
          <div className="card__body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="avatar avatar--lg">
                <User size={32} />
              </div>
              <div>
                <h1 className="card__title mb-sm">Welcome back, Explorer!</h1>
                <p className="card__description">Ready for your next adventure?</p>
              </div>
            </div>
          </div>
        </div>

        {/* Player Stats */}
        <div className="grid grid--3-col mb-xl">
          <div className="card">
            <div className="card__body text-center">
              <div className="stat-value">{playerStats.level}</div>
              <div className="stat-label">Level</div>
            </div>
          </div>
          <div className="card">
            <div className="card__body text-center">
              <div className="stat-value">{playerStats.xp}</div>
              <div className="stat-label">Total XP</div>
            </div>
          </div>
          <div className="card">
            <div className="card__body text-center">
              <div className="stat-value">{playerStats.streak}</div>
              <div className="stat-label">Day Streak</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="card mb-xl">
          <div className="card__header">
            <h3 className="card__title">Level Progress</h3>
          </div>
          <div className="card__body">
            <div className="progress-bar mb-sm">
              <div 
                className="progress-bar__fill" 
                style={{ width: `${(playerStats.xp / (playerStats.xp + playerStats.xpToNext)) * 100}%` }}
              ></div>
            </div>
            <p className="text-muted">{playerStats.xpToNext} XP to Level {playerStats.level + 1}</p>
          </div>
        </div>

        <div className="grid grid--2-col">
          {/* Quick Actions */}
          <div className="card">
            <div className="card__header">
              <h3 className="card__title">Quick Actions</h3>
            </div>
            <div className="card__body">
              <div className="quick-actions">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => onNavigate(action.id)}
                    className="quick-action"
                  >
                    <action.icon size={24} />
                    <div>
                      <div className="quick-action__title">{action.title}</div>
                      <div className="quick-action__description">{action.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="card">
            <div className="card__header">
              <h3 className="card__title">Recent Activities</h3>
            </div>
            <div className="card__body">
              <div className="activity-list">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      {activity.type === 'quest' && <Target size={16} />}
                      {activity.type === 'achievement' && <Trophy size={16} />}
                      {activity.type === 'collaboration' && <Star size={16} />}
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">{activity.title}</div>
                      <div className="activity-meta">
                        <span className="activity-xp">+{activity.xp} XP</span>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quest Progress */}
        <div className="card mt-xl">
          <div className="card__header">
            <h3 className="card__title">Quest Progress</h3>
          </div>
          <div className="card__body">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Clock size={24} />
              <div style={{ flex: 1 }}>
                <p className="mb-sm">
                  <strong>{playerStats.completedQuests}</strong> of <strong>{playerStats.totalQuests}</strong> quests completed
                </p>
                <div className="progress-bar">
                  <div 
                    className="progress-bar__fill" 
                    style={{ width: `${(playerStats.completedQuests / playerStats.totalQuests) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;