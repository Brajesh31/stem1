# Project Spark - Complete API Endpoint Reference

## Base URL
```
Production: https://api.projectspark.edu/v1
Development: http://localhost:3000/api/v1
```

## Authentication
All endpoints except `/auth/login` and `/auth/register` require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 🔐 Authentication Endpoints

### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "username": "demo_student",
  "password": "password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "username": "demo_student",
    "role": "STUDENT",
    "profile": {
      "displayName": "Alex Chen",
      "level": 12,
      "xpPoints": 2847
    }
  },
  "expiresIn": "7d"
}
```

### POST /auth/register
Create new user account (admin-only or invite-based).

**Request Body:**
```json
{
  "username": "new_student",
  "email": "student@school.edu",
  "password": "securePassword123",
  "role": "STUDENT",
  "profile": {
    "firstName": "Maria",
    "lastName": "Santos",
    "displayName": "Maria Santos",
    "grade": 8
  },
  "schoolId": "school_456"
}
```

### GET /auth/me
Get current user profile and stats.

**Response:**
```json
{
  "id": "user_123",
  "username": "demo_student",
  "email": "student@demo.com",
  "role": "STUDENT",
  "profile": {
    "displayName": "Alex Chen",
    "level": 12,
    "xpPoints": 2847,
    "crystals": 245,
    "sparks": 89,
    "streak": 5,
    "grade": 8
  },
  "school": {
    "id": "school_456",
    "name": "Rural High School"
  }
}
```

---

## 🎓 Student Endpoints

### GET /student/dashboard
Get personalized student dashboard.

**Response:**
```json
{
  "overview": {
    "level": 12,
    "xpPoints": 2847,
    "crystals": 245,
    "sparks": 89,
    "streak": 5,
    "rank": "Skilled Realm Explorer"
  },
  "activeQuests": [
    {
      "id": "quest_789",
      "title": "Forces of Nature",
      "subject": "Physics",
      "difficulty": "MEDIUM",
      "progress": 65,
      "rewards": {
        "experience": 150,
        "crystals": 25,
        "sparks": 10
      }
    }
  ],
  "recentAchievements": [
    {
      "id": "achievement_456",
      "title": "Math Wizard",
      "description": "Completed 10 algebra quests",
      "earnedAt": "2024-02-15T10:30:00Z"
    }
  ],
  "skillTrees": [
    {
      "subject": "Mathematics",
      "level": 8,
      "progress": 75,
      "unlockedSkills": 12,
      "totalSkills": 16
    }
  ],
  "aiCompanion": {
    "name": "Athena",
    "message": "Great progress on physics! Ready for the next challenge?",
    "mood": "encouraging"
  }
}
```

### GET /student/courses
Get enrolled courses with progress.

**Query Parameters:**
- `subject` (optional): Filter by subject
- `status` (optional): Filter by completion status

**Response:**
```json
{
  "courses": [
    {
      "id": "course_123",
      "title": "Grade 8 Physics Adventures",
      "subject": "Physics",
      "difficulty": "MEDIUM",
      "progress": 68,
      "lessonsCompleted": 15,
      "totalLessons": 22,
      "nextLesson": {
        "id": "lesson_456",
        "title": "Sound Waves and Music",
        "estimatedDuration": 30
      }
    }
  ]
}
```

### POST /student/progress/sync
**CRITICAL ENDPOINT** - Sync offline progress data.

**Request Body:**
```json
{
  "deviceId": "device_abc123",
  "lastSyncAt": "2024-02-14T15:30:00Z",
  "actions": [
    {
      "type": "lesson_progress",
      "timestamp": "2024-02-15T09:15:00Z",
      "data": {
        "lessonId": "lesson_456",
        "progress": 100,
        "timeSpent": 1800,
        "completedAt": "2024-02-15T09:45:00Z"
      }
    },
    {
      "type": "quiz_submission",
      "timestamp": "2024-02-15T10:00:00Z",
      "data": {
        "quizId": "quiz_789",
        "answers": {
          "q1": "B",
          "q2": "A",
          "q3": "C"
        },
        "timeSpent": 600
      }
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "syncId": "sync_xyz789",
  "processed": 2,
  "conflicts": [],
  "rewards": {
    "xpGained": 150,
    "crystalsGained": 25,
    "newBadges": [
      {
        "id": "badge_physics_novice",
        "name": "Physics Novice",
        "description": "Completed first physics lesson"
      }
    ]
  }
}
```

### GET /student/leaderboard
Get class or global leaderboard.

**Query Parameters:**
- `scope`: "class" | "school" | "global"
- `timeframe`: "daily" | "weekly" | "monthly" | "all_time"

**Response:**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "studentId": "user_456",
      "displayName": "Emma Thompson",
      "level": 24,
      "xpPoints": 4856,
      "streak": 15,
      "avatar": "🎨"
    }
  ],
  "userRank": {
    "rank": 4,
    "totalParticipants": 28
  }
}
```

---

## 👨‍🏫 Teacher Endpoints

### GET /teacher/dashboard
Get comprehensive teacher dashboard.

**Response:**
```json
{
  "overview": {
    "totalStudents": 28,
    "activeStudents": 24,
    "averageLevel": 14,
    "completionRate": 87
  },
  "classes": [
    {
      "id": "class_123",
      "name": "Grade 8A Physics",
      "studentCount": 28,
      "averageProgress": 75,
      "recentActivity": 15
    }
  ],
  "recentActivity": [
    {
      "studentName": "Alex Chen",
      "action": "Completed 'Forces of Nature' quest",
      "timestamp": "2024-02-15T11:30:00Z",
      "subject": "Physics"
    }
  ],
  "strugglingStudents": [
    {
      "studentId": "user_789",
      "name": "David Kim",
      "averageScore": 45,
      "completionRate": 30,
      "recommendedActions": ["Additional practice", "One-on-one session"]
    }
  ],
  "topPerformers": [
    {
      "studentId": "user_456",
      "name": "Emma Thompson",
      "level": 24,
      "weeklyXP": 450
    }
  ]
}
```

### GET /teacher/classes/:classId/analytics
Get detailed class performance analytics.

**Response:**
```json
{
  "classInfo": {
    "id": "class_123",
    "name": "Grade 8A Physics",
    "subject": "Physics",
    "studentCount": 28
  },
  "engagement": {
    "dailyActiveUsers": [20, 22, 18, 25, 24, 19, 21],
    "averageSessionTime": 45,
    "completionRate": 87,
    "streakDistribution": {
      "0-3": 8,
      "4-7": 12,
      "8-14": 6,
      "15+": 2
    }
  },
  "performance": {
    "averageQuizScore": 78,
    "subjectBreakdown": {
      "mechanics": 82,
      "thermodynamics": 74,
      "waves": 76,
      "electricity": 80
    },
    "difficultyAnalysis": {
      "easy": 92,
      "medium": 78,
      "hard": 65,
      "epic": 45
    }
  },
  "progress": {
    "lessonsCompleted": 156,
    "totalLessons": 180,
    "averageProgress": 87,
    "studentsAtRisk": 3,
    "studentsExcelling": 8
  }
}
```

### POST /teacher/assignments
Create new assignment for class.

**Request Body:**
```json
{
  "title": "Physics Lab Report",
  "description": "Complete the pendulum experiment and submit your findings",
  "classId": "class_123",
  "courseId": "course_456",
  "dueDate": "2024-02-20T23:59:59Z",
  "maxScore": 100,
  "instructions": {
    "format": "PDF",
    "maxPages": 5,
    "requirements": ["Hypothesis", "Methodology", "Results", "Conclusion"]
  }
}
```

---

## 👑 Admin Endpoints

### GET /admin/dashboard
Get system-wide administrative dashboard.

**Response:**
```json
{
  "systemStats": {
    "totalUsers": 1247,
    "activeUsers": 892,
    "totalSchools": 15,
    "totalClasses": 156,
    "totalQuests": 1456,
    "systemUptime": "99.9%"
  },
  "userGrowth": {
    "daily": [45, 52, 38, 67, 43, 59, 48],
    "monthly": [1200, 1180, 1247],
    "registrationRate": 12.5
  },
  "engagement": {
    "dailyActiveUsers": 892,
    "weeklyActiveUsers": 1156,
    "monthlyActiveUsers": 1203,
    "averageSessionTime": 42
  },
  "performance": {
    "serverLoad": 67,
    "databaseConnections": 45,
    "cacheHitRate": 94,
    "averageResponseTime": 120
  },
  "recentEvents": [
    {
      "type": "user_registration",
      "message": "15 new students registered",
      "timestamp": "2024-02-15T12:00:00Z"
    }
  ]
}
```

### GET /admin/users
Get paginated user list with filtering.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)
- `role`: Filter by user role
- `school`: Filter by school ID
- `search`: Search by name or email

**Response:**
```json
{
  "users": [
    {
      "id": "user_123",
      "username": "alex_chen",
      "email": "alex@school.edu",
      "role": "STUDENT",
      "profile": {
        "displayName": "Alex Chen",
        "level": 12,
        "grade": 8
      },
      "school": {
        "id": "school_456",
        "name": "Rural High School"
      },
      "isActive": true,
      "lastActive": "2024-02-15T11:30:00Z",
      "createdAt": "2024-01-15T08:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1247,
    "pages": 25
  }
}
```

### POST /admin/users/bulk
Bulk import users from CSV file.

**Request:** Multipart form with CSV file

**CSV Format:**
```csv
username,email,password,role,firstName,lastName,grade,schoolId
student1,student1@school.edu,password123,STUDENT,John,Doe,8,school_456
teacher1,teacher1@school.edu,password123,TEACHER,Jane,Smith,,school_456
```

**Response:**
```json
{
  "success": true,
  "imported": 25,
  "failed": 2,
  "errors": [
    {
      "row": 3,
      "error": "Invalid email format"
    }
  ],
  "summary": {
    "students": 20,
    "teachers": 3,
    "admins": 0,
    "guardians": 2
  }
}
```

---

## 👨‍👩‍👧‍👦 Guardian Endpoints

### GET /guardian/children
Get linked children and their basic info.

**Response:**
```json
{
  "children": [
    {
      "id": "user_789",
      "profile": {
        "displayName": "Emma Chen",
        "grade": 8,
        "level": 15,
        "avatar": "🎨"
      },
      "relationship": "parent",
      "linkedAt": "2024-01-15T08:00:00Z",
      "school": {
        "name": "Rural High School",
        "class": "Grade 8A"
      },
      "lastActive": "2024-02-15T16:30:00Z"
    }
  ]
}
```

### GET /guardian/children/:studentId/progress
Get detailed progress report for child.

**Response:**
```json
{
  "student": {
    "id": "user_789",
    "displayName": "Emma Chen",
    "grade": 8,
    "level": 15
  },
  "academicProgress": {
    "overallGrade": "A-",
    "subjects": [
      {
        "name": "Mathematics",
        "progress": 85,
        "grade": "A",
        "recentQuests": 3,
        "timeSpent": 120
      },
      {
        "name": "Physics",
        "progress": 78,
        "grade": "B+",
        "recentQuests": 2,
        "timeSpent": 95
      }
    ]
  },
  "engagement": {
    "dailyAverage": 45,
    "weeklyTotal": 315,
    "streak": 8,
    "lastActive": "2024-02-15T16:30:00Z"
  },
  "achievements": [
    {
      "title": "Math Wizard",
      "earnedAt": "2024-02-10T14:20:00Z",
      "category": "mastery"
    }
  ],
  "upcomingDeadlines": [
    {
      "title": "Physics Lab Report",
      "dueDate": "2024-02-20T23:59:59Z",
      "status": "in_progress"
    }
  ]
}
```

---

## 🔄 Sync Endpoints

### POST /sync/batch
Process batch of offline actions.

**Request Body:**
```json
{
  "deviceId": "device_abc123",
  "lastSyncAt": "2024-02-14T15:30:00Z",
  "actions": [
    {
      "id": "action_1",
      "type": "lesson_progress",
      "timestamp": "2024-02-15T09:15:00Z",
      "data": {
        "lessonId": "lesson_456",
        "progress": 100,
        "timeSpent": 1800,
        "completedAt": "2024-02-15T09:45:00Z"
      }
    },
    {
      "id": "action_2",
      "type": "quiz_submission",
      "timestamp": "2024-02-15T10:00:00Z",
      "data": {
        "quizId": "quiz_789",
        "answers": {"q1": "B", "q2": "A", "q3": "C"},
        "timeSpent": 600
      }
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "syncId": "sync_xyz789",
  "processed": 2,
  "failed": 0,
  "conflicts": [],
  "rewards": {
    "xpGained": 150,
    "crystalsGained": 25,
    "sparksGained": 10,
    "newBadges": ["badge_physics_novice"],
    "levelUp": false
  },
  "nextSyncToken": "token_next_sync"
}
```

### GET /sync/status/:syncId
Get status of sync operation.

**Response:**
```json
{
  "syncId": "sync_xyz789",
  "status": "COMPLETED",
  "processedAt": "2024-02-15T10:05:00Z",
  "summary": {
    "totalActions": 2,
    "processed": 2,
    "failed": 0,
    "conflicts": 0
  }
}
```

---

## 🎮 Gamification Endpoints

### GET /gamification/badges
Get available badges and user progress.

**Response:**
```json
{
  "categories": [
    {
      "name": "Progress",
      "badges": [
        {
          "id": "badge_first_quest",
          "name": "First Steps",
          "description": "Complete your first quest",
          "icon": "🎯",
          "rarity": "COMMON",
          "criteria": {
            "type": "quests_completed",
            "target": 1
          },
          "rewards": {
            "xp": 50,
            "crystals": 10,
            "sparks": 5
          },
          "earned": true,
          "earnedAt": "2024-02-01T10:00:00Z"
        }
      ]
    }
  ],
  "userStats": {
    "totalBadges": 12,
    "commonBadges": 8,
    "rareBadges": 3,
    "epicBadges": 1,
    "legendaryBadges": 0
  }
}
```

### POST /gamification/achievements/claim
Claim achievement rewards.

**Request Body:**
```json
{
  "achievementId": "achievement_456"
}
```

**Response:**
```json
{
  "success": true,
  "achievement": {
    "title": "Math Wizard",
    "description": "Mastered 10 algebra concepts"
  },
  "rewards": {
    "xp": 200,
    "crystals": 50,
    "sparks": 25,
    "title": "Math Wizard"
  }
}
```

---

## 📊 Analytics Endpoints

### GET /analytics/student/:studentId
Get comprehensive student analytics (teacher/admin only).

**Response:**
```json
{
  "overview": {
    "level": 12,
    "xpPoints": 2847,
    "streak": 5,
    "totalTimeSpent": 15420
  },
  "subjectPerformance": [
    {
      "subject": "Mathematics",
      "averageScore": 85,
      "timeSpent": 420,
      "conceptsMastered": 15,
      "totalConcepts": 20,
      "trend": "improving"
    }
  ],
  "learningPatterns": {
    "preferredTime": "morning",
    "averageSessionLength": 35,
    "strongestSubjects": ["Mathematics", "Physics"],
    "challengingAreas": ["Chemistry"],
    "learningStyle": "visual"
  },
  "recommendations": [
    {
      "type": "remedial",
      "subject": "Chemistry",
      "suggestion": "Additional practice with molecular structures"
    }
  ]
}
```

### GET /analytics/class/:classId
Get class-wide analytics.

**Response:**
```json
{
  "classInfo": {
    "id": "class_123",
    "name": "Grade 8A Physics",
    "studentCount": 28,
    "teacher": "Ms. Johnson"
  },
  "performance": {
    "averageScore": 78,
    "completionRate": 87,
    "engagementRate": 92,
    "improvementRate": 15
  },
  "distribution": {
    "scoreRanges": {
      "90-100": 8,
      "80-89": 12,
      "70-79": 6,
      "60-69": 2,
      "below-60": 0
    },
    "levelDistribution": {
      "1-5": 2,
      "6-10": 8,
      "11-15": 12,
      "16-20": 5,
      "21+": 1
    }
  },
  "trends": {
    "weeklyProgress": [75, 78, 82, 85, 87],
    "engagementTrend": "increasing",
    "difficultyProgression": "appropriate"
  }
}
```

---

## 📱 Real-time WebSocket Events

### Connection
```javascript
// Client connection
const socket = io('ws://localhost:3000', {
  auth: {
    token: 'jwt_token_here'
  }
});
```

### Student Events

**Incoming Events:**
- `badge_earned`: New badge notification
- `level_up`: Level increase notification
- `achievement_unlocked`: Achievement notification
- `guild_message`: Guild chat message
- `quest_reminder`: Quest deadline reminder

**Outgoing Events:**
- `progress_update`: Send real-time progress
- `guild_message`: Send guild chat message

### Teacher Events

**Incoming Events:**
- `student_progress_update`: Real-time student progress
- `class_achievement`: Class milestone reached
- `student_needs_help`: Student requested assistance

### Example Event Payloads

```javascript
// Badge earned event
socket.on('badge_earned', (data) => {
  console.log(data);
  // {
  //   badge: {
  //     name: "Physics Novice",
  //     description: "Completed first physics lesson",
  //     icon: "⚛️"
  //   },
  //   earnedAt: "2024-02-15T10:30:00Z"
  // }
});

// Level up event
socket.on('level_up', (data) => {
  console.log(data);
  // {
  //   newLevel: 13,
  //   xpPoints: 3000,
  //   rewards: {
  //     crystals: 50,
  //     sparks: 25
  //   }
  // }
});
```

---

## 🔧 Utility Endpoints

### GET /health
System health check.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-02-15T12:00:00Z",
  "services": {
    "database": "up",
    "redis": "up",
    "filesystem": "up"
  },
  "metrics": {
    "uptime": 86400,
    "memoryUsage": "512MB",
    "cpuUsage": "45%"
  }
}
```

### GET /content/subjects
Get available subjects for grade.

**Query Parameters:**
- `grade`: Grade level (6-12)

**Response:**
```json
{
  "subjects": [
    {
      "id": "subject_math",
      "name": "Mathematics",
      "icon": "📐",
      "color": "blue",
      "questCount": 45,
      "skillCount": 120
    },
    {
      "id": "subject_physics",
      "name": "Physics", 
      "icon": "⚛️",
      "color": "purple",
      "questCount": 38,
      "skillCount": 95
    }
  ]
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "timestamp": "2024-02-15T12:00:00Z",
  "path": "/api/v1/auth/register"
}
```

### Common Error Codes
- `AUTHENTICATION_REQUIRED`: Missing or invalid JWT token
- `INSUFFICIENT_PERMISSIONS`: User lacks required role/permissions
- `VALIDATION_ERROR`: Request data validation failed
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `CONFLICT_ERROR`: Data conflict (e.g., duplicate username)
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_SERVER_ERROR`: Unexpected server error

---

## Rate Limiting

All endpoints are rate-limited to prevent abuse:

- **Authentication**: 5 requests per minute per IP
- **Student endpoints**: 100 requests per minute per user
- **Teacher endpoints**: 200 requests per minute per user
- **Admin endpoints**: 500 requests per minute per user
- **Sync endpoints**: 10 requests per minute per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1645123456
```

This comprehensive API reference provides the foundation for building a robust, scalable backend that supports all aspects of the Project Spark learning platform.