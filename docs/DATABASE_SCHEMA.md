# Project Spark - Database Schema Documentation

## Overview

The Project Spark database is designed using PostgreSQL with a focus on data integrity, performance, and scalability. The schema supports multi-tenancy (schools), role-based access control, offline synchronization, and comprehensive gamification features.

---

## Core Design Principles

1. **Data Integrity**: Foreign key constraints and proper normalization
2. **Performance**: Strategic indexing and query optimization
3. **Scalability**: Partitioning strategies for large datasets
4. **Audit Trail**: Comprehensive logging of user actions
5. **Offline Support**: Conflict resolution and sync mechanisms

---

## Entity Relationship Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Schools   │    │    Users    │    │  Profiles   │
│             │◄──►│             │◄──►│             │
│ id (PK)     │    │ id (PK)     │    │ userId (FK) │
│ name        │    │ schoolId(FK)│    │ level       │
│ district    │    │ role        │    │ xpPoints    │
└─────────────┘    │ email       │    │ crystals    │
                   └─────────────┘    └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │   Classes   │
                   │             │
                   │ id (PK)     │
                   │ teacherId   │
                   │ schoolId    │
                   └─────────────┘
                          │
                          ▼
                   ┌─────────────┐    ┌─────────────┐
                   │ Enrollments │    │   Courses   │
                   │             │    │             │
                   │ studentId   │    │ id (PK)     │
                   │ classId     │◄──►│ subject     │
                   └─────────────┘    │ grade       │
                                      └─────────────┘
                                             │
                                             ▼
                                      ┌─────────────┐
                                      │   Lessons   │
                                      │             │
                                      │ id (PK)     │
                                      │ courseId    │
                                      │ content     │
                                      └─────────────┘
```

---

## Table Definitions

### 1. User Management Tables

#### users
Primary user account table with authentication data.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  school_id UUID REFERENCES schools(id),
  preferred_language VARCHAR(5) DEFAULT 'en',
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_school_role ON users(school_id, role);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;
```

#### profiles
Extended user profile information and game stats.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  display_name VARCHAR(150) NOT NULL,
  avatar_url VARCHAR(500),
  grade SMALLINT CHECK (grade BETWEEN 6 AND 12),
  xp_points INTEGER DEFAULT 0 CHECK (xp_points >= 0),
  level INTEGER DEFAULT 1 CHECK (level >= 1),
  crystals INTEGER DEFAULT 0 CHECK (crystals >= 0),
  sparks INTEGER DEFAULT 0 CHECK (sparks >= 0),
  streak INTEGER DEFAULT 0 CHECK (streak >= 0),
  total_time_spent INTEGER DEFAULT 0, -- in seconds
  last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_level ON profiles(level DESC);
CREATE INDEX idx_profiles_xp ON profiles(xp_points DESC);
CREATE INDEX idx_profiles_grade ON profiles(grade);
```

### 2. School Structure Tables

#### schools
School/district information for multi-tenancy.

```sql
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  address TEXT,
  district VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'India',
  timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_schools_district ON schools(district);
CREATE INDEX idx_schools_state ON schools(state);
CREATE INDEX idx_schools_active ON schools(is_active) WHERE is_active = true;
```

#### classes
Class/section management within schools.

```sql
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  subject VARCHAR(50) NOT NULL,
  grade SMALLINT NOT NULL CHECK (grade BETWEEN 6 AND 12),
  section VARCHAR(10),
  teacher_id UUID NOT NULL REFERENCES users(id),
  school_id UUID NOT NULL REFERENCES schools(id),
  max_students INTEGER DEFAULT 50 CHECK (max_students > 0),
  academic_year VARCHAR(10), -- e.g., "2024-25"
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_classes_teacher ON classes(teacher_id);
CREATE INDEX idx_classes_school ON classes(school_id);
CREATE INDEX idx_classes_grade_subject ON classes(grade, subject);
CREATE INDEX idx_classes_active ON classes(is_active) WHERE is_active = true;
```

#### enrollments
Student-class relationships.

```sql
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status enrollment_status DEFAULT 'ACTIVE',
  final_grade VARCHAR(5), -- A+, A, B+, etc.
  
  UNIQUE(student_id, class_id)
);

-- Indexes
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_class ON enrollments(class_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
```

### 3. Content Management Tables

#### courses
Course/curriculum structure.

```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  subject VARCHAR(50) NOT NULL,
  grade SMALLINT NOT NULL CHECK (grade BETWEEN 6 AND 12),
  difficulty difficulty_level NOT NULL,
  estimated_hours INTEGER,
  prerequisites TEXT[], -- Array of prerequisite course IDs
  learning_objectives TEXT[],
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_courses_subject_grade ON courses(subject, grade);
CREATE INDEX idx_courses_published ON courses(is_published) WHERE is_published = true;
CREATE INDEX idx_courses_difficulty ON courses(difficulty);
```

#### lessons
Individual lesson content within courses.

```sql
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  content JSONB NOT NULL, -- Rich content: text, media, interactive elements
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  duration INTEGER, -- Estimated duration in minutes
  objectives TEXT[],
  keywords TEXT[], -- For search functionality
  difficulty_level SMALLINT DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  is_published BOOLEAN DEFAULT false,
  requires_internet BOOLEAN DEFAULT false,
  offline_content JSONB, -- Compressed content for offline use
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(course_id, order_index)
);

-- Indexes
CREATE INDEX idx_lessons_course ON lessons(course_id, order_index);
CREATE INDEX idx_lessons_published ON lessons(is_published) WHERE is_published = true;
CREATE INDEX idx_lessons_keywords ON lessons USING GIN(keywords);
```

#### quizzes
Assessment and quiz management.

```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  time_limit INTEGER, -- Time limit in minutes
  max_attempts INTEGER DEFAULT 3 CHECK (max_attempts > 0),
  passing_score INTEGER DEFAULT 70 CHECK (passing_score BETWEEN 0 AND 100),
  question_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  randomize_questions BOOLEAN DEFAULT false,
  show_results_immediately BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_quizzes_lesson ON quizzes(lesson_id);
CREATE INDEX idx_quizzes_published ON quizzes(is_published) WHERE is_published = true;
```

#### questions
Individual quiz questions.

```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  type question_type NOT NULL,
  options JSONB, -- For multiple choice: ["A", "B", "C", "D"]
  correct_answer JSONB NOT NULL, -- Flexible format for different question types
  explanation TEXT,
  points INTEGER DEFAULT 1 CHECK (points > 0),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  difficulty SMALLINT DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
  tags TEXT[], -- For categorization
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(quiz_id, order_index)
);

-- Indexes
CREATE INDEX idx_questions_quiz ON questions(quiz_id, order_index);
CREATE INDEX idx_questions_type ON questions(type);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
```

### 4. Progress Tracking Tables

#### student_progress
Tracks student progress through lessons.

```sql
CREATE TABLE student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  status progress_status DEFAULT 'NOT_STARTED',
  progress DECIMAL(5,2) DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  time_spent INTEGER DEFAULT 0, -- Time in seconds
  attempts INTEGER DEFAULT 0,
  last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  sync_version INTEGER DEFAULT 1, -- For conflict resolution
  device_id VARCHAR(100), -- Track which device made progress
  
  UNIQUE(student_id, lesson_id)
);

-- Indexes for performance
CREATE INDEX idx_student_progress_student ON student_progress(student_id);
CREATE INDEX idx_student_progress_lesson ON student_progress(lesson_id);
CREATE INDEX idx_student_progress_status ON student_progress(status);
CREATE INDEX idx_student_progress_completed ON student_progress(completed_at) WHERE completed_at IS NOT NULL;

-- Partial index for active progress
CREATE INDEX idx_student_progress_active ON student_progress(student_id, last_accessed) 
WHERE status IN ('IN_PROGRESS', 'NOT_STARTED');
```

#### submissions
Quiz and assignment submissions.

```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  answers JSONB NOT NULL, -- Student's answers
  score DECIMAL(5,2), -- Calculated score (0-100)
  max_score INTEGER NOT NULL,
  time_spent INTEGER NOT NULL, -- Time taken in seconds
  attempt INTEGER NOT NULL DEFAULT 1,
  is_final BOOLEAN DEFAULT false,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  graded_at TIMESTAMP,
  graded_by UUID REFERENCES users(id),
  feedback TEXT,
  sync_version INTEGER DEFAULT 1,
  device_id VARCHAR(100)
);

-- Indexes
CREATE INDEX idx_submissions_student ON submissions(student_id);
CREATE INDEX idx_submissions_quiz ON submissions(quiz_id);
CREATE INDEX idx_submissions_score ON submissions(score DESC);
CREATE INDEX idx_submissions_submitted ON submissions(submitted_at DESC);

-- Unique constraint for final submissions
CREATE UNIQUE INDEX idx_submissions_final ON submissions(student_id, quiz_id) 
WHERE is_final = true;
```

### 5. Gamification Tables

#### badges
Available badges and their criteria.

```sql
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon_url VARCHAR(500),
  category badge_category NOT NULL,
  rarity badge_rarity DEFAULT 'COMMON',
  criteria JSONB NOT NULL, -- Flexible criteria definition
  xp_reward INTEGER DEFAULT 0 CHECK (xp_reward >= 0),
  crystal_reward INTEGER DEFAULT 0 CHECK (crystal_reward >= 0),
  spark_reward INTEGER DEFAULT 0 CHECK (spark_reward >= 0),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_badges_category ON badges(category);
CREATE INDEX idx_badges_rarity ON badges(rarity);
CREATE INDEX idx_badges_active ON badges(is_active) WHERE is_active = true;
```

#### earned_badges
Track which badges users have earned.

```sql
CREATE TABLE earned_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  progress_data JSONB, -- Additional data about how badge was earned
  
  UNIQUE(user_id, badge_id)
);

-- Indexes
CREATE INDEX idx_earned_badges_user ON earned_badges(user_id);
CREATE INDEX idx_earned_badges_badge ON earned_badges(badge_id);
CREATE INDEX idx_earned_badges_earned_at ON earned_badges(earned_at DESC);
```

#### achievements
Dynamic achievements and milestones.

```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type achievement_type NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  icon_url VARCHAR(500),
  xp_awarded INTEGER DEFAULT 0,
  crystals_awarded INTEGER DEFAULT 0,
  sparks_awarded INTEGER DEFAULT 0,
  metadata JSONB, -- Additional achievement data
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_achievements_student ON achievements(student_id);
CREATE INDEX idx_achievements_type ON achievements(type);
CREATE INDEX idx_achievements_earned_at ON achievements(earned_at DESC);
```

#### leaderboards
Cached leaderboard data for performance.

```sql
CREATE TABLE leaderboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope leaderboard_scope NOT NULL, -- CLASS, SCHOOL, GLOBAL
  scope_id UUID, -- class_id or school_id for scoped leaderboards
  timeframe leaderboard_timeframe NOT NULL,
  rankings JSONB NOT NULL, -- Cached ranking data
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(scope, scope_id, timeframe)
);

-- Indexes
CREATE INDEX idx_leaderboards_scope ON leaderboards(scope, scope_id);
CREATE INDEX idx_leaderboards_updated ON leaderboards(last_updated DESC);
```

### 6. Guardian System Tables

#### guardian_links
Relationships between guardians and students.

```sql
CREATE TABLE guardian_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  relationship VARCHAR(20) DEFAULT 'parent', -- parent, guardian, sibling
  status link_status DEFAULT 'PENDING',
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by UUID REFERENCES users(id),
  notes TEXT,
  
  UNIQUE(guardian_id, student_id)
);

-- Indexes
CREATE INDEX idx_guardian_links_guardian ON guardian_links(guardian_id);
CREATE INDEX idx_guardian_links_student ON guardian_links(student_id);
CREATE INDEX idx_guardian_links_status ON guardian_links(status);
```

### 7. Assignment System Tables

#### assignments
Teacher-created assignments and projects.

```sql
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  instructions JSONB, -- Rich instructions with media
  course_id UUID REFERENCES courses(id),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  due_date TIMESTAMP NOT NULL,
  max_score INTEGER DEFAULT 100 CHECK (max_score > 0),
  submission_type assignment_type DEFAULT 'FILE',
  allowed_file_types TEXT[], -- ['pdf', 'doc', 'jpg']
  max_file_size INTEGER DEFAULT 10485760, -- 10MB in bytes
  is_published BOOLEAN DEFAULT false,
  late_submission_allowed BOOLEAN DEFAULT true,
  late_penalty DECIMAL(5,2) DEFAULT 0, -- Percentage penalty
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_assignments_class ON assignments(class_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
CREATE INDEX idx_assignments_published ON assignments(is_published) WHERE is_published = true;
```

#### assignment_submissions
Student submissions for assignments.

```sql
CREATE TABLE assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT, -- Text submission
  file_urls TEXT[], -- Array of uploaded file URLs
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_late BOOLEAN DEFAULT false,
  score DECIMAL(5,2), -- Graded score
  feedback TEXT,
  graded_at TIMESTAMP,
  graded_by UUID REFERENCES users(id),
  
  UNIQUE(assignment_id, student_id)
);

-- Indexes
CREATE INDEX idx_assignment_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX idx_assignment_submissions_student ON assignment_submissions(student_id);
CREATE INDEX idx_assignment_submissions_submitted ON assignment_submissions(submitted_at DESC);
```

### 8. Notification System Tables

#### user_notifications
User notification management.

```sql
CREATE TABLE user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL,
  priority notification_priority DEFAULT 'NORMAL',
  is_read BOOLEAN DEFAULT false,
  data JSONB, -- Additional notification data
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_notifications_user ON user_notifications(user_id);
CREATE INDEX idx_notifications_unread ON user_notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_type ON user_notifications(type);
CREATE INDEX idx_notifications_created ON user_notifications(created_at DESC);

-- Automatic cleanup of old notifications
CREATE INDEX idx_notifications_cleanup ON user_notifications(expires_at) WHERE expires_at IS NOT NULL;
```

### 9. Sync System Tables

#### sync_logs
Track offline synchronization operations.

```sql
CREATE TABLE sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_id VARCHAR(100) NOT NULL,
  actions JSONB NOT NULL, -- Array of sync actions
  status sync_status DEFAULT 'PENDING',
  processed_actions INTEGER DEFAULT 0,
  failed_actions INTEGER DEFAULT 0,
  conflicts JSONB, -- Conflict resolution data
  error_message TEXT,
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_sync_logs_user ON sync_logs(user_id);
CREATE INDEX idx_sync_logs_device ON sync_logs(device_id);
CREATE INDEX idx_sync_logs_status ON sync_logs(status);
CREATE INDEX idx_sync_logs_created ON sync_logs(created_at DESC);
```

#### sync_conflicts
Track and resolve data conflicts.

```sql
CREATE TABLE sync_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_log_id UUID NOT NULL REFERENCES sync_logs(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) NOT NULL, -- 'lesson_progress', 'quiz_submission'
  entity_id UUID NOT NULL,
  client_data JSONB NOT NULL,
  server_data JSONB NOT NULL,
  resolution_strategy VARCHAR(50), -- 'client_wins', 'server_wins', 'merge'
  resolved_data JSONB,
  resolved_at TIMESTAMP,
  resolved_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_sync_conflicts_sync_log ON sync_conflicts(sync_log_id);
CREATE INDEX idx_sync_conflicts_entity ON sync_conflicts(entity_type, entity_id);
CREATE INDEX idx_sync_conflicts_unresolved ON sync_conflicts(resolved_at) WHERE resolved_at IS NULL;
```

### 10. Content Translation Tables

#### content_translations
Multilingual content support.

```sql
CREATE TABLE content_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL, -- References lessons.id, questions.id, etc.
  content_type VARCHAR(50) NOT NULL, -- 'lesson', 'question', 'badge'
  language VARCHAR(5) NOT NULL, -- ISO language code
  translated_content JSONB NOT NULL,
  translation_quality DECIMAL(3,2), -- Quality score 0-1
  translated_by VARCHAR(100), -- 'auto', 'human', or translator name
  translated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES users(id),
  
  UNIQUE(content_id, content_type, language)
);

-- Indexes
CREATE INDEX idx_translations_content ON content_translations(content_id, content_type);
CREATE INDEX idx_translations_language ON content_translations(language);
CREATE INDEX idx_translations_quality ON content_translations(translation_quality DESC);
```

---

## Enums and Custom Types

```sql
-- User roles
CREATE TYPE user_role AS ENUM ('STUDENT', 'TEACHER', 'ADMIN', 'GUARDIAN');

-- Difficulty levels
CREATE TYPE difficulty_level AS ENUM ('EASY', 'MEDIUM', 'HARD', 'EPIC');

-- Progress status
CREATE TYPE progress_status AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'LOCKED');

-- Question types
CREATE TYPE question_type AS ENUM (
  'MULTIPLE_CHOICE', 
  'TRUE_FALSE', 
  'SHORT_ANSWER', 
  'ESSAY', 
  'FILL_BLANK',
  'MATCHING',
  'ORDERING'
);

-- Badge categories
CREATE TYPE badge_category AS ENUM ('PROGRESS', 'MASTERY', 'SOCIAL', 'SPECIAL', 'STREAK');

-- Badge rarity
CREATE TYPE badge_rarity AS ENUM ('COMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- Achievement types
CREATE TYPE achievement_type AS ENUM (
  'QUEST_COMPLETION',
  'SKILL_MASTERY', 
  'STREAK_MILESTONE',
  'SOCIAL_CONTRIBUTION',
  'SPECIAL_EVENT',
  'LEVEL_UP'
);

-- Link status for guardian relationships
CREATE TYPE link_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'BLOCKED');

-- Enrollment status
CREATE TYPE enrollment_status AS ENUM ('ACTIVE', 'INACTIVE', 'COMPLETED', 'DROPPED');

-- Notification types
CREATE TYPE notification_type AS ENUM (
  'ACHIEVEMENT', 
  'ASSIGNMENT', 
  'ANNOUNCEMENT', 
  'REMINDER', 
  'SYSTEM',
  'BADGE_EARNED',
  'LEVEL_UP',
  'GUILD_MESSAGE'
);

-- Notification priority
CREATE TYPE notification_priority AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- Assignment types
CREATE TYPE assignment_type AS ENUM ('FILE', 'TEXT', 'QUIZ', 'PROJECT', 'PRESENTATION');

-- Sync status
CREATE TYPE sync_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CONFLICT');

-- Leaderboard scopes
CREATE TYPE leaderboard_scope AS ENUM ('CLASS', 'SCHOOL', 'GLOBAL', 'GUILD');

-- Leaderboard timeframes
CREATE TYPE leaderboard_timeframe AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'ALL_TIME');
```

---

## Advanced Features Tables

### Guild System

```sql
-- Guilds (student groups)
CREATE TABLE guilds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  leader_id UUID NOT NULL REFERENCES users(id),
  school_id UUID NOT NULL REFERENCES schools(id),
  max_members INTEGER DEFAULT 10 CHECK (max_members > 0),
  current_members INTEGER DEFAULT 1,
  guild_level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Guild memberships
CREATE TABLE guild_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id UUID NOT NULL REFERENCES guilds(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role guild_role DEFAULT 'MEMBER',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  contribution_xp INTEGER DEFAULT 0,
  
  UNIQUE(guild_id, student_id)
);

-- Guild quests (collaborative challenges)
CREATE TABLE guild_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  guild_id UUID NOT NULL REFERENCES guilds(id) ON DELETE CASCADE,
  target_value INTEGER NOT NULL, -- Target to achieve
  current_value INTEGER DEFAULT 0,
  reward_xp INTEGER DEFAULT 0,
  starts_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ends_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### AI Companion System

```sql
-- AI companion interactions
CREATE TABLE ai_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  interaction_type VARCHAR(50) NOT NULL, -- 'hint', 'encouragement', 'challenge'
  context JSONB, -- Context about what student was doing
  ai_response TEXT NOT NULL,
  student_feedback INTEGER, -- 1-5 rating
  was_helpful BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student learning preferences (for AI personalization)
CREATE TABLE learning_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  learning_style VARCHAR(20) DEFAULT 'visual', -- visual, auditory, kinesthetic
  difficulty_preference DECIMAL(3,2) DEFAULT 0.5, -- 0-1 scale
  session_length_preference INTEGER DEFAULT 30, -- minutes
  preferred_subjects TEXT[],
  challenging_subjects TEXT[],
  ai_personality VARCHAR(20) DEFAULT 'encouraging', -- encouraging, challenging, neutral
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Analytics Tables

```sql
-- Learning analytics (aggregated data)
CREATE TABLE learning_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_time_spent INTEGER DEFAULT 0, -- seconds
  lessons_completed INTEGER DEFAULT 0,
  quizzes_taken INTEGER DEFAULT 0,
  average_score DECIMAL(5,2),
  xp_gained INTEGER DEFAULT 0,
  subjects_studied TEXT[],
  peak_performance_hour INTEGER, -- 0-23
  
  UNIQUE(student_id, date)
);

-- Class analytics (aggregated)
CREATE TABLE class_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  active_students INTEGER DEFAULT 0,
  average_engagement DECIMAL(5,2),
  average_score DECIMAL(5,2),
  completion_rate DECIMAL(5,2),
  total_time_spent INTEGER DEFAULT 0,
  
  UNIQUE(class_id, date)
);
```

---

## Database Functions and Triggers

### Automatic XP and Level Calculation

```sql
-- Function to calculate level from XP
CREATE OR REPLACE FUNCTION calculate_level(xp_points INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Progressive level calculation: Level = sqrt(XP/100) + 1
  RETURN FLOOR(SQRT(xp_points::FLOAT / 100)) + 1;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to update level when XP changes
CREATE OR REPLACE FUNCTION update_level_on_xp_change()
RETURNS TRIGGER AS $$
BEGIN
  NEW.level = calculate_level(NEW.xp_points);
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_level
  BEFORE UPDATE OF xp_points ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_level_on_xp_change();
```

### Automatic Streak Calculation

```sql
-- Function to update learning streak
CREATE OR REPLACE FUNCTION update_learning_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_activity DATE;
  current_streak INTEGER;
BEGIN
  -- Get last activity date
  SELECT DATE(last_active) INTO last_activity 
  FROM profiles WHERE user_id = NEW.student_id;
  
  -- Calculate streak
  IF last_activity = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Consecutive day, increment streak
    UPDATE profiles 
    SET streak = streak + 1, last_active = CURRENT_TIMESTAMP
    WHERE user_id = NEW.student_id;
  ELSIF last_activity < CURRENT_DATE - INTERVAL '1 day' THEN
    -- Streak broken, reset to 1
    UPDATE profiles 
    SET streak = 1, last_active = CURRENT_TIMESTAMP
    WHERE user_id = NEW.student_id;
  ELSE
    -- Same day, just update last_active
    UPDATE profiles 
    SET last_active = CURRENT_TIMESTAMP
    WHERE user_id = NEW.student_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_streak
  AFTER INSERT OR UPDATE ON student_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_learning_streak();
```

### Badge Eligibility Check

```sql
-- Function to check badge eligibility
CREATE OR REPLACE FUNCTION check_badge_eligibility(user_id_param UUID)
RETURNS TABLE(badge_id UUID, badge_name VARCHAR) AS $$
DECLARE
  badge_record RECORD;
  criteria_met BOOLEAN;
BEGIN
  FOR badge_record IN 
    SELECT b.id, b.name, b.criteria 
    FROM badges b 
    WHERE b.is_active = true 
    AND NOT EXISTS (
      SELECT 1 FROM earned_badges eb 
      WHERE eb.user_id = user_id_param AND eb.badge_id = b.id
    )
  LOOP
    -- Check if criteria is met (simplified example)
    SELECT evaluate_badge_criteria(user_id_param, badge_record.criteria) INTO criteria_met;
    
    IF criteria_met THEN
      badge_id := badge_record.id;
      badge_name := badge_record.name;
      RETURN NEXT;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

---

## Performance Optimization

### Partitioning Strategy

```sql
-- Partition student_progress by date for better performance
CREATE TABLE student_progress_2024 PARTITION OF student_progress
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE student_progress_2025 PARTITION OF student_progress
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- Partition submissions by date
CREATE TABLE submissions_2024 PARTITION OF submissions
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

### Materialized Views for Analytics

```sql
-- Materialized view for class performance
CREATE MATERIALIZED VIEW class_performance_summary AS
SELECT 
  c.id as class_id,
  c.name as class_name,
  c.subject,
  c.grade,
  COUNT(DISTINCT e.student_id) as total_students,
  COUNT(DISTINCT CASE WHEN p.last_active > CURRENT_DATE - INTERVAL '7 days' 
                      THEN e.student_id END) as active_students,
  AVG(pr.level) as average_level,
  AVG(CASE WHEN sp.status = 'COMPLETED' THEN 100.0 ELSE sp.progress END) as average_progress,
  COUNT(CASE WHEN sp.status = 'COMPLETED' THEN 1 END) as completed_lessons,
  COUNT(sp.id) as total_lesson_attempts
FROM classes c
LEFT JOIN enrollments e ON c.id = e.class_id AND e.status = 'ACTIVE'
LEFT JOIN profiles pr ON e.student_id = pr.user_id
LEFT JOIN student_progress sp ON e.student_id = sp.student_id
GROUP BY c.id, c.name, c.subject, c.grade;

-- Refresh materialized view periodically
CREATE INDEX idx_class_performance_class_id ON class_performance_summary(class_id);
```

---

## Data Retention and Archival

### Archival Strategy

```sql
-- Archive old sync logs (keep only last 30 days)
CREATE TABLE sync_logs_archive (LIKE sync_logs INCLUDING ALL);

-- Function to archive old data
CREATE OR REPLACE FUNCTION archive_old_sync_logs()
RETURNS INTEGER AS $$
DECLARE
  archived_count INTEGER;
BEGIN
  -- Move old sync logs to archive
  WITH archived AS (
    DELETE FROM sync_logs 
    WHERE created_at < CURRENT_DATE - INTERVAL '30 days'
    AND status IN ('COMPLETED', 'FAILED')
    RETURNING *
  )
  INSERT INTO sync_logs_archive SELECT * FROM archived;
  
  GET DIAGNOSTICS archived_count = ROW_COUNT;
  RETURN archived_count;
END;
$$ LANGUAGE plpgsql;

-- Schedule archival (run daily)
SELECT cron.schedule('archive-sync-logs', '0 2 * * *', 'SELECT archive_old_sync_logs();');
```

---

## Security Considerations

### Row Level Security (RLS)

```sql
-- Enable RLS on sensitive tables
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

-- Students can only see their own progress
CREATE POLICY student_progress_policy ON student_progress
  FOR ALL TO authenticated_users
  USING (student_id = current_user_id());

-- Teachers can see progress for their students
CREATE POLICY teacher_progress_policy ON student_progress
  FOR SELECT TO authenticated_users
  USING (
    EXISTS (
      SELECT 1 FROM enrollments e
      JOIN classes c ON e.class_id = c.id
      WHERE e.student_id = student_progress.student_id
      AND c.teacher_id = current_user_id()
    )
  );
```

### Audit Trail

```sql
-- Audit log for sensitive operations
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(50),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger function for audit logging
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id, action, table_name, record_id, old_values, new_values
  ) VALUES (
    current_user_id(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
```

---

## Database Maintenance

### Regular Maintenance Tasks

```sql
-- Vacuum and analyze tables weekly
SELECT cron.schedule('weekly-maintenance', '0 3 * * 0', $$
  VACUUM ANALYZE student_progress;
  VACUUM ANALYZE submissions;
  VACUUM ANALYZE user_notifications;
  REINDEX INDEX CONCURRENTLY idx_student_progress_student;
$$);

-- Update leaderboard cache hourly
SELECT cron.schedule('update-leaderboards', '0 * * * *', $$
  REFRESH MATERIALIZED VIEW CONCURRENTLY class_performance_summary;
$$);

-- Clean up old notifications
SELECT cron.schedule('cleanup-notifications', '0 4 * * *', $$
  DELETE FROM user_notifications 
  WHERE created_at < CURRENT_DATE - INTERVAL '30 days'
  AND is_read = true;
$$);
```

This comprehensive database schema provides the foundation for a robust, scalable educational platform that can handle complex gamification, real-time features, and offline synchronization while maintaining data integrity and performance.