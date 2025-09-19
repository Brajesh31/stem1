# Project Spark - Backend Architecture Blueprint

## Executive Summary

This document serves as the definitive backend architecture blueprint for **Project Spark**, a revolutionary gamified learning platform designed for rural education. The backend is architected to support offline-first functionality, real-time gamification, role-based access control, and seamless multi-tenant operations across four distinct user realms.

---

## Part 1: Technology Stack & Core Libraries

### Primary Technology Stack

**Runtime & Framework:**
- **Node.js 18+** - JavaScript runtime optimized for I/O operations
- **NestJS 10+** - Enterprise-grade framework with TypeScript, decorators, and modular architecture
- **TypeScript 5+** - Type safety and enhanced developer experience

**Database & ORM:**
- **PostgreSQL 15+** - ACID-compliant relational database for data integrity
- **Prisma 5+** - Type-safe ORM with excellent TypeScript integration
- **Redis 7+** - In-memory cache for sessions, leaderboards, and real-time data

**Authentication & Security:**
- **Passport.js** - Authentication middleware with JWT strategy
- **Argon2** - Memory-hard password hashing algorithm
- **Helmet.js** - Security headers and protection middleware
- **Rate Limiting** - Express-rate-limit for API protection

**Real-time Communication:**
- **Socket.IO 4+** - WebSocket implementation with fallback support
- **Bull Queue** - Redis-based job queue for background processing

**File Storage & Processing:**
- **Multer** - Multipart form data handling for file uploads
- **Sharp** - High-performance image processing
- **AWS S3 SDK** - Cloud storage integration (production)

**Monitoring & Logging:**
- **Winston** - Structured logging with multiple transports
- **Prometheus** - Metrics collection for monitoring
- **Swagger/OpenAPI** - API documentation generation

### Development & Deployment Tools

```json
{
  "dependencies": {
    "@nestjs/core": "^10.0.0",
    "@nestjs/common": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/websockets": "^10.0.0",
    "@nestjs/platform-socket.io": "^10.0.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/jwt": "^10.0.0",
    "@nestjs/swagger": "^7.0.0",
    "@prisma/client": "^5.0.0",
    "prisma": "^5.0.0",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.0",
    "argon2": "^0.31.0",
    "socket.io": "^4.7.0",
    "redis": "^4.6.0",
    "bull": "^4.11.0",
    "multer": "^1.4.5",
    "sharp": "^0.32.0",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.8.0",
    "winston": "^3.10.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.0"
  }
}
```

---

## Part 2: Project File & Folder Structure

```
/backend
├── /src
│   ├── /auth                    # Authentication & Authorization
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── /guards
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   └── school-access.guard.ts
│   │   ├── /strategies
│   │   │   └── jwt.strategy.ts
│   │   └── /decorators
│   │       ├── roles.decorator.ts
│   │       └── current-user.decorator.ts
│   │
│   ├── /users                   # User Management
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   ├── /dto
│   │   │   ├── create-user.dto.ts
│   │   │   ├── update-user.dto.ts
│   │   │   └── bulk-import.dto.ts
│   │   └── /entities
│   │       └── user.entity.ts
│   │
│   ├── /schools                 # School/District Management
│   │   ├── schools.controller.ts
│   │   ├── schools.service.ts
│   │   ├── schools.module.ts
│   │   └── /entities
│   │       └── school.entity.ts
│   │
│   ├── /classes                 # Class Management
│   │   ├── classes.controller.ts
│   │   ├── classes.service.ts
│   │   ├── classes.module.ts
│   │   └── /entities
│   │       ├── class.entity.ts
│   │       └── enrollment.entity.ts
│   │
│   ├── /courses                 # Course & Content Management
│   │   ├── courses.controller.ts
│   │   ├── courses.service.ts
│   │   ├── courses.module.ts
│   │   ├── /entities
│   │   │   ├── course.entity.ts
│   │   │   ├── lesson.entity.ts
│   │   │   ├── quiz.entity.ts
│   │   │   └── question.entity.ts
│   │   └── /dto
│   │       ├── create-course.dto.ts
│   │       └── create-lesson.dto.ts
│   │
│   ├── /student-progress       # Progress Tracking
│   │   ├── progress.controller.ts
│   │   ├── progress.service.ts
│   │   ├── progress.module.ts
│   │   └── /entities
│   │       ├── student-progress.entity.ts
│   │       └── submission.entity.ts
│   │
│   ├── /gamification           # Gamification Engine
│   │   ├── gamification.controller.ts
│   │   ├── gamification.service.ts
│   │   ├── gamification.module.ts
│   │   ├── /entities
│   │   │   ├── badge.entity.ts
│   │   │   ├── earned-badge.entity.ts
│   │   │   ├── achievement.entity.ts
│   │   │   └── leaderboard.entity.ts
│   │   └── /rules
│   │       ├── badge-rules.service.ts
│   │       └── xp-calculation.service.ts
│   │
│   ├── /guardian-link          # Guardian-Student Relationships
│   │   ├── guardian.controller.ts
│   │   ├── guardian.service.ts
│   │   ├── guardian.module.ts
│   │   └── /entities
│   │       └── guardian-link.entity.ts
│   │
│   ├── /sync                   # Offline Data Synchronization
│   │   ├── sync.controller.ts
│   │   ├── sync.service.ts
│   │   ├── sync.module.ts
│   │   └── /dto
│   │       ├── sync-batch.dto.ts
│   │       └── sync-action.dto.ts
│   │
│   ├── /realtime-gateway       # WebSocket Gateway
│   │   ├── realtime.gateway.ts
│   │   ├── realtime.module.ts
│   │   └── /events
│   │       ├── progress.events.ts
│   │       ├── gamification.events.ts
│   │       └── notification.events.ts
│   │
│   ├── /notifications          # Notification System
│   │   ├── notifications.controller.ts
│   │   ├── notifications.service.ts
│   │   ├── notifications.module.ts
│   │   └── /providers
│   │       ├── email.provider.ts
│   │       └── push.provider.ts
│   │
│   ├── /analytics              # Analytics & Reporting
│   │   ├── analytics.controller.ts
│   │   ├── analytics.service.ts
│   │   ├── analytics.module.ts
│   │   └── /reports
│   │       ├── student-report.service.ts
│   │       ├── class-report.service.ts
│   │       └── school-report.service.ts
│   │
│   ├── /file-management        # File Upload & Storage
│   │   ├── files.controller.ts
│   │   ├── files.service.ts
│   │   ├── files.module.ts
│   │   └── /storage
│   │       ├── local.storage.ts
│   │       └── cloud.storage.ts
│   │
│   ├── /common                 # Shared Utilities
│   │   ├── /decorators
│   │   ├── /filters
│   │   ├── /interceptors
│   │   ├── /pipes
│   │   └── /utils
│   │
│   ├── /config                 # Configuration
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   ├── jwt.config.ts
│   │   └── app.config.ts
│   │
│   ├── app.module.ts           # Root application module
│   └── main.ts                 # Application bootstrap
│
├── /prisma                     # Database Schema & Migrations
│   ├── schema.prisma
│   ├── /migrations
│   └── seed.ts
│
├── /test                       # Test Files
│   ├── /unit
│   ├── /integration
│   └── /e2e
│
├── /docs                       # Documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── TROUBLESHOOTING.md
│
├── docker-compose.yml          # Local development environment
├── Dockerfile                  # Production container
├── package.json
└── tsconfig.json
```

---

## Part 3: Database Schema Design

### Core Entity Relationships

```prisma
// User Management
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  username      String   @unique
  passwordHash  String
  role          UserRole
  schoolId      String?
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  school        School?  @relation(fields: [schoolId], references: [id])
  profile       Profile?
  teachingClasses Class[] @relation("TeacherClasses")
  enrollments   Enrollment[]
  guardianLinks GuardianLink[] @relation("GuardianUsers")
  studentLinks  GuardianLink[] @relation("StudentUsers")
  submissions   Submission[]
  earnedBadges  EarnedBadge[]
  progress      StudentProgress[]
  notifications UserNotification[]

  @@map("users")
}

model Profile {
  id          String  @id @default(cuid())
  userId      String  @unique
  firstName   String
  lastName    String
  displayName String
  avatarUrl   String?
  grade       Int?    @db.SmallInt
  xpPoints    Int     @default(0)
  level       Int     @default(1)
  crystals    Int     @default(0)
  sparks      Int     @default(0)
  streak      Int     @default(0)
  lastActive  DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("profiles")
}

// School Structure
model School {
  id          String   @id @default(cuid())
  name        String
  address     String?
  district    String?
  state       String?
  country     String   @default("India")
  timezone    String   @default("Asia/Kolkata")
  settings    Json?    // School-specific configurations
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())

  users   User[]
  classes Class[]

  @@map("schools")
}

model Class {
  id          String   @id @default(cuid())
  name        String
  subject     String
  grade       Int      @db.SmallInt
  section     String?
  teacherId   String
  schoolId    String
  maxStudents Int      @default(50)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())

  teacher     User         @relation("TeacherClasses", fields: [teacherId], references: [id])
  school      School       @relation(fields: [schoolId], references: [id])
  enrollments Enrollment[]
  assignments Assignment[]

  @@map("classes")
}

model Enrollment {
  id         String   @id @default(cuid())
  studentId  String
  classId    String
  enrolledAt DateTime @default(now())
  status     EnrollmentStatus @default(ACTIVE)

  student User  @relation(fields: [studentId], references: [id], onDelete: Cascade)
  class   Class @relation(fields: [classId], references: [id], onDelete: Cascade)

  @@unique([studentId, classId])
  @@map("enrollments")
}

// Content Management
model Course {
  id          String   @id @default(cuid())
  title       String
  description String?
  subject     String
  grade       Int      @db.SmallInt
  difficulty  Difficulty
  isPublished Boolean  @default(false)
  createdBy   String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  lessons     Lesson[]
  assignments Assignment[]

  @@map("courses")
}

model Lesson {
  id          String   @id @default(cuid())
  title       String
  content     Json     // Rich content including text, media, interactive elements
  courseId    String
  orderIndex  Int
  duration    Int?     // Estimated duration in minutes
  objectives  String[] // Learning objectives
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())

  course   Course            @relation(fields: [courseId], references: [id], onDelete: Cascade)
  quizzes  Quiz[]
  progress StudentProgress[]

  @@map("lessons")
}

model Quiz {
  id          String   @id @default(cuid())
  title       String
  description String?
  lessonId    String?
  timeLimit   Int?     // Time limit in minutes
  maxAttempts Int      @default(3)
  passingScore Int     @default(70)
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())

  lesson      Lesson?      @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  questions   Question[]
  submissions Submission[]

  @@map("quizzes")
}

model Question {
  id          String       @id @default(cuid())
  text        String
  type        QuestionType
  options     Json?        // For multiple choice questions
  correctAnswer Json       // Correct answer(s)
  explanation String?
  points      Int          @default(1)
  quizId      String
  orderIndex  Int

  quiz Quiz @relation(fields: [quizId], references: [id], onDelete: Cascade)

  @@map("questions")
}

// Progress Tracking
model StudentProgress {
  id           String   @id @default(cuid())
  studentId    String
  lessonId     String
  status       ProgressStatus @default(NOT_STARTED)
  progress     Float    @default(0) // Percentage 0-100
  timeSpent    Int      @default(0) // Time in seconds
  lastAccessed DateTime @default(now())
  completedAt  DateTime?

  student User   @relation(fields: [studentId], references: [id], onDelete: Cascade)
  lesson  Lesson @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@unique([studentId, lessonId])
  @@map("student_progress")
}

model Submission {
  id          String   @id @default(cuid())
  studentId   String
  quizId      String
  answers     Json     // Student's answers
  score       Float?   // Calculated score
  timeSpent   Int      // Time taken in seconds
  attempt     Int      @default(1)
  submittedAt DateTime @default(now())
  gradedAt    DateTime?

  student User @relation(fields: [studentId], references: [id], onDelete: Cascade)
  quiz    Quiz @relation(fields: [quizId], references: [id], onDelete: Cascade)

  @@map("submissions")
}

// Gamification System
model Badge {
  id          String   @id @default(cuid())
  name        String   @unique
  description String
  iconUrl     String
  category    BadgeCategory
  criteria    Json     // Criteria for earning the badge
  rarity      BadgeRarity @default(COMMON)
  xpReward    Int      @default(0)
  crystalReward Int    @default(0)
  sparkReward Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())

  earnedBadges EarnedBadge[]

  @@map("badges")
}

model EarnedBadge {
  id       String   @id @default(cuid())
  userId   String
  badgeId  String
  earnedAt DateTime @default(now())
  
  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  badge Badge @relation(fields: [badgeId], references: [id], onDelete: Cascade)

  @@unique([userId, badgeId])
  @@map("earned_badges")
}

model Achievement {
  id          String   @id @default(cuid())
  studentId   String
  type        AchievementType
  title       String
  description String
  iconUrl     String?
  xpAwarded   Int      @default(0)
  earnedAt    DateTime @default(now())

  @@map("achievements")
}

// Guardian System
model GuardianLink {
  id           String   @id @default(cuid())
  guardianId   String
  studentId    String
  relationship String   @default("parent") // parent, guardian, sibling
  status       LinkStatus @default(PENDING)
  requestedAt  DateTime @default(now())
  approvedAt   DateTime?

  guardian User @relation("GuardianUsers", fields: [guardianId], references: [id], onDelete: Cascade)
  student  User @relation("StudentUsers", fields: [studentId], references: [id], onDelete: Cascade)

  @@unique([guardianId, studentId])
  @@map("guardian_links")
}

// Assignment System
model Assignment {
  id          String   @id @default(cuid())
  title       String
  description String
  courseId    String?
  classId     String
  dueDate     DateTime
  maxScore    Int      @default(100)
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())

  course Class @relation(fields: [classId], references: [id], onDelete: Cascade)

  @@map("assignments")
}

// Notification System
model UserNotification {
  id        String   @id @default(cuid())
  userId    String
  title     String
  message   String
  type      NotificationType
  isRead    Boolean  @default(false)
  data      Json?    // Additional notification data
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_notifications")
}

// Sync System for Offline Support
model SyncLog {
  id          String   @id @default(cuid())
  userId      String
  deviceId    String
  actions     Json     // Array of sync actions
  status      SyncStatus @default(PENDING)
  processedAt DateTime?
  createdAt   DateTime @default(now())

  @@map("sync_logs")
}

// Enums
enum UserRole {
  STUDENT
  TEACHER
  ADMIN
  GUARDIAN
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
  EPIC
}

enum ProgressStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
}

enum QuestionType {
  MULTIPLE_CHOICE
  TRUE_FALSE
  SHORT_ANSWER
  ESSAY
  FILL_BLANK
}

enum BadgeCategory {
  PROGRESS
  MASTERY
  SOCIAL
  SPECIAL
}

enum BadgeRarity {
  COMMON
  RARE
  EPIC
  LEGENDARY
}

enum AchievementType {
  QUEST_COMPLETION
  SKILL_MASTERY
  STREAK_MILESTONE
  SOCIAL_CONTRIBUTION
  SPECIAL_EVENT
}

enum LinkStatus {
  PENDING
  APPROVED
  REJECTED
}

enum EnrollmentStatus {
  ACTIVE
  INACTIVE
  COMPLETED
}

enum NotificationType {
  ACHIEVEMENT
  ASSIGNMENT
  ANNOUNCEMENT
  REMINDER
  SYSTEM
}

enum SyncStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}
```

---

## Part 4: RESTful API Endpoint Design

### Authentication Endpoints (`/api/v1/auth`)

```typescript
// Authentication Controller
@Controller('auth')
export class AuthController {
  
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    // Validates credentials and returns JWT + user profile
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    // Creates new user account with role validation
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user: User): Promise<UserProfile> {
    // Returns detailed user profile with stats
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh JWT token' })
  async refreshToken(@Body() refreshDto: RefreshTokenDto): Promise<TokenResponse> {
    // Refreshes expired JWT tokens
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'User logout' })
  async logout(@CurrentUser() user: User): Promise<void> {
    // Invalidates user session
  }
}
```

### Student Endpoints (`/api/v1/student`)

```typescript
@Controller('student')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.STUDENT)
export class StudentController {

  @Get('dashboard')
  @ApiOperation({ summary: 'Get student dashboard data' })
  async getDashboard(@CurrentUser() user: User): Promise<StudentDashboard> {
    // Returns personalized dashboard with progress, quests, achievements
  }

  @Get('courses')
  @ApiOperation({ summary: 'Get enrolled courses' })
  async getCourses(@CurrentUser() user: User): Promise<Course[]> {
    // Returns courses student is enrolled in
  }

  @Get('courses/:courseId/lessons')
  @ApiOperation({ summary: 'Get lessons for a course' })
  async getLessons(
    @Param('courseId') courseId: string,
    @CurrentUser() user: User
  ): Promise<Lesson[]> {
    // Returns lessons with progress tracking
  }

  @Post('progress/sync')
  @ApiOperation({ summary: 'Sync offline progress data' })
  @ApiBody({ type: SyncBatchDto })
  async syncProgress(
    @Body() syncData: SyncBatchDto,
    @CurrentUser() user: User
  ): Promise<SyncResult> {
    // CRITICAL: Handles offline data synchronization
  }

  @Post('quizzes/:quizId/submit')
  @ApiOperation({ summary: 'Submit quiz answers' })
  async submitQuiz(
    @Param('quizId') quizId: string,
    @Body() submission: QuizSubmissionDto,
    @CurrentUser() user: User
  ): Promise<SubmissionResult> {
    // Processes quiz submission and awards points
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get class leaderboard' })
  async getLeaderboard(@CurrentUser() user: User): Promise<LeaderboardEntry[]> {
    // Returns class rankings and stats
  }

  @Get('achievements')
  @ApiOperation({ summary: 'Get student achievements' })
  async getAchievements(@CurrentUser() user: User): Promise<Achievement[]> {
    // Returns earned badges and achievements
  }
}
```

### Teacher Endpoints (`/api/v1/teacher`)

```typescript
@Controller('teacher')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.TEACHER)
export class TeacherController {

  @Get('dashboard')
  @ApiOperation({ summary: 'Get teacher dashboard' })
  async getDashboard(@CurrentUser() user: User): Promise<TeacherDashboard> {
    // Returns class overview, recent activity, top performers
  }

  @Get('classes')
  @ApiOperation({ summary: 'Get teacher classes' })
  async getClasses(@CurrentUser() user: User): Promise<Class[]> {
    // Returns classes taught by teacher
  }

  @Get('classes/:classId/roster')
  @ApiOperation({ summary: 'Get class roster' })
  async getClassRoster(@Param('classId') classId: string): Promise<StudentRoster[]> {
    // Returns student list with progress overview
  }

  @Get('classes/:classId/analytics')
  @ApiOperation({ summary: 'Get class analytics' })
  async getClassAnalytics(@Param('classId') classId: string): Promise<ClassAnalytics> {
    // Returns detailed performance analytics
  }

  @Post('assignments')
  @ApiOperation({ summary: 'Create assignment' })
  async createAssignment(@Body() assignmentDto: CreateAssignmentDto): Promise<Assignment> {
    // Creates new assignment for class
  }

  @Get('students/:studentId/progress')
  @ApiOperation({ summary: 'Get individual student progress' })
  async getStudentProgress(@Param('studentId') studentId: string): Promise<StudentProgressReport> {
    // Returns detailed student progress report
  }

  @Post('announcements')
  @ApiOperation({ summary: 'Send class announcement' })
  async sendAnnouncement(@Body() announcementDto: CreateAnnouncementDto): Promise<void> {
    // Sends announcement to class and guardians
  }
}
```

### Admin Endpoints (`/api/v1/admin`)

```typescript
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {

  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard' })
  async getDashboard(): Promise<AdminDashboard> {
    // Returns system-wide statistics and metrics
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users with filtering' })
  @ApiQuery({ name: 'role', required: false })
  @ApiQuery({ name: 'school', required: false })
  async getUsers(@Query() filters: UserFilterDto): Promise<PaginatedUsers> {
    // Returns paginated user list with filters
  }

  @Post('users/bulk')
  @ApiOperation({ summary: 'Bulk import users' })
  @UseInterceptors(FileInterceptor('file'))
  async bulkImportUsers(@UploadedFile() file: Express.Multer.File): Promise<BulkImportResult> {
    // Processes CSV file for bulk user creation
  }

  @Put('users/:userId/role')
  @ApiOperation({ summary: 'Update user role' })
  async updateUserRole(
    @Param('userId') userId: string,
    @Body() roleDto: UpdateRoleDto
  ): Promise<User> {
    // Updates user role with validation
  }

  @Get('schools/:schoolId/analytics')
  @ApiOperation({ summary: 'Get school analytics' })
  async getSchoolAnalytics(@Param('schoolId') schoolId: string): Promise<SchoolAnalytics> {
    // Returns comprehensive school performance data
  }

  @Get('system/health')
  @ApiOperation({ summary: 'Get system health metrics' })
  async getSystemHealth(): Promise<SystemHealth> {
    // Returns server performance and health metrics
  }

  @Post('content/approve')
  @ApiOperation({ summary: 'Approve user-generated content' })
  async approveContent(@Body() approvalDto: ContentApprovalDto): Promise<void> {
    // Approves or rejects user-generated content
  }
}
```

### Guardian Endpoints (`/api/v1/guardian`)

```typescript
@Controller('guardian')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.GUARDIAN)
export class GuardianController {

  @Get('children')
  @ApiOperation({ summary: 'Get linked children' })
  async getChildren(@CurrentUser() user: User): Promise<LinkedStudent[]> {
    // Returns children linked to guardian account
  }

  @Get('children/:studentId/progress')
  @ApiOperation({ summary: 'Get child progress overview' })
  async getChildProgress(@Param('studentId') studentId: string): Promise<StudentProgressOverview> {
    // Returns child's academic progress summary
  }

  @Post('link-request')
  @ApiOperation({ summary: 'Request to link with student' })
  async requestLink(@Body() linkDto: LinkRequestDto): Promise<GuardianLink> {
    // Creates link request between guardian and student
  }

  @Get('notifications')
  @ApiOperation({ summary: 'Get guardian notifications' })
  async getNotifications(@CurrentUser() user: User): Promise<GuardianNotification[]> {
    // Returns notifications about linked children
  }

  @Post('children/:studentId/message')
  @ApiOperation({ summary: 'Send message to child teacher' })
  async messageTeacher(
    @Param('studentId') studentId: string,
    @Body() messageDto: MessageDto
  ): Promise<void> {
    // Sends message to child's teacher
  }
}
```

### Sync Endpoints (`/api/v1/sync`)

```typescript
@Controller('sync')
@UseGuards(JwtAuthGuard)
export class SyncController {

  @Post('batch')
  @ApiOperation({ summary: 'Process batch sync from offline client' })
  async processBatchSync(
    @Body() syncBatch: SyncBatchDto,
    @CurrentUser() user: User
  ): Promise<SyncResult> {
    // Processes array of offline actions with conflict resolution
  }

  @Get('status/:syncId')
  @ApiOperation({ summary: 'Get sync operation status' })
  async getSyncStatus(@Param('syncId') syncId: string): Promise<SyncStatus> {
    // Returns status of ongoing sync operation
  }

  @Post('conflict-resolution')
  @ApiOperation({ summary: 'Resolve sync conflicts' })
  async resolveConflicts(@Body() resolutionDto: ConflictResolutionDto): Promise<void> {
    // Handles manual conflict resolution
  }
}
```

---

## Part 5: Core Backend Logic Implementation Plan

### 1. Role-Based Access Control (RBAC) Implementation

**File: `/src/auth/guards/roles.guard.ts`**

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // Check if user has required role
    const hasRole = requiredRoles.some((role) => user.role === role);
    
    // Additional school-level access control
    if (hasRole && this.requiresSchoolAccess(context)) {
      return this.validateSchoolAccess(user, context);
    }

    return hasRole;
  }

  private requiresSchoolAccess(context: ExecutionContext): boolean {
    // Check if endpoint requires school-level access
    return this.reflector.get<boolean>('requireSchoolAccess', context.getHandler());
  }

  private validateSchoolAccess(user: any, context: ExecutionContext): boolean {
    // Validate user has access to requested school resources
    const request = context.switchToHttp().getRequest();
    const schoolId = request.params.schoolId || request.body.schoolId;
    
    return !schoolId || user.schoolId === schoolId;
  }
}
```

### 2. Offline Data Synchronization Logic

**File: `/src/sync/sync.service.ts`**

```typescript
@Injectable()
export class SyncService {
  constructor(
    private prisma: PrismaService,
    private gamificationService: GamificationService,
    private logger: Logger
  ) {}

  async processBatchSync(userId: string, syncBatch: SyncBatchDto): Promise<SyncResult> {
    const syncLog = await this.createSyncLog(userId, syncBatch);
    
    try {
      const results = await this.prisma.$transaction(async (tx) => {
        const processedActions = [];
        const conflicts = [];
        
        // Sort actions by timestamp to maintain chronological order
        const sortedActions = syncBatch.actions.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        for (const action of sortedActions) {
          try {
            const result = await this.processAction(tx, userId, action);
            processedActions.push(result);
            
            // Trigger gamification events
            if (result.type === 'lesson_completed') {
              await this.gamificationService.handleLessonCompletion(userId, result.data);
            }
          } catch (error) {
            if (error instanceof ConflictError) {
              conflicts.push({
                action,
                conflict: error.message,
                serverData: error.serverData
              });
            } else {
              throw error;
            }
          }
        }

        return { processedActions, conflicts };
      });

      await this.updateSyncLog(syncLog.id, SyncStatus.COMPLETED);
      
      return {
        success: true,
        processed: results.processedActions.length,
        conflicts: results.conflicts,
        syncId: syncLog.id
      };
      
    } catch (error) {
      await this.updateSyncLog(syncLog.id, SyncStatus.FAILED);
      this.logger.error('Sync batch failed', error);
      throw new InternalServerErrorException('Sync processing failed');
    }
  }

  private async processAction(tx: any, userId: string, action: SyncAction): Promise<ProcessedAction> {
    switch (action.type) {
      case 'lesson_progress':
        return this.processLessonProgress(tx, userId, action);
      case 'quiz_submission':
        return this.processQuizSubmission(tx, userId, action);
      case 'achievement_earned':
        return this.processAchievement(tx, userId, action);
      default:
        throw new BadRequestException(`Unknown action type: ${action.type}`);
    }
  }

  private async processLessonProgress(tx: any, userId: string, action: SyncAction): Promise<ProcessedAction> {
    const { lessonId, progress, timeSpent, completedAt } = action.data;
    
    // Check for existing progress
    const existingProgress = await tx.studentProgress.findUnique({
      where: { studentId_lessonId: { studentId: userId, lessonId } }
    });

    if (existingProgress) {
      // Conflict resolution: use latest timestamp or highest progress
      if (existingProgress.lastAccessed > new Date(action.timestamp)) {
        throw new ConflictError('Server has newer progress data', existingProgress);
      }
      
      // Merge progress (take highest values)
      const mergedProgress = {
        progress: Math.max(existingProgress.progress, progress),
        timeSpent: existingProgress.timeSpent + timeSpent,
        status: progress >= 100 ? ProgressStatus.COMPLETED : ProgressStatus.IN_PROGRESS,
        lastAccessed: new Date(action.timestamp),
        completedAt: completedAt ? new Date(completedAt) : existingProgress.completedAt
      };

      await tx.studentProgress.update({
        where: { id: existingProgress.id },
        data: mergedProgress
      });
    } else {
      // Create new progress record
      await tx.studentProgress.create({
        data: {
          studentId: userId,
          lessonId,
          progress,
          timeSpent,
          status: progress >= 100 ? ProgressStatus.COMPLETED : ProgressStatus.IN_PROGRESS,
          lastAccessed: new Date(action.timestamp),
          completedAt: completedAt ? new Date(completedAt) : null
        }
      });
    }

    return {
      type: 'lesson_progress',
      success: true,
      data: { lessonId, progress }
    };
  }
}
```

### 3. Gamification Engine Service

**File: `/src/gamification/gamification.service.ts`**

```typescript
@Injectable()
export class GamificationService {
  constructor(
    private prisma: PrismaService,
    private realtimeGateway: RealtimeGateway,
    private logger: Logger
  ) {}

  async awardPoints(userId: string, points: number, source: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // Update user XP
      const profile = await tx.profile.update({
        where: { userId },
        data: {
          xpPoints: { increment: points },
          lastActive: new Date()
        }
      });

      // Calculate new level
      const newLevel = this.calculateLevel(profile.xpPoints);
      if (newLevel > profile.level) {
        await tx.profile.update({
          where: { userId },
          data: { level: newLevel }
        });

        // Emit level up event
        this.realtimeGateway.emitToUser(userId, 'level_up', {
          newLevel,
          xpPoints: profile.xpPoints
        });
      }

      // Check for badge eligibility
      await this.checkBadgeEligibility(tx, userId);
    });

    this.logger.log(`Awarded ${points} XP to user ${userId} from ${source}`);
  }

  async grantBadge(userId: string, badgeId: string): Promise<boolean> {
    try {
      // Check if user already has badge
      const existingBadge = await this.prisma.earnedBadge.findUnique({
        where: { userId_badgeId: { userId, badgeId } }
      });

      if (existingBadge) {
        return false; // Already earned
      }

      // Grant badge
      const earnedBadge = await this.prisma.earnedBadge.create({
        data: { userId, badgeId },
        include: { badge: true }
      });

      // Award badge XP
      if (earnedBadge.badge.xpReward > 0) {
        await this.awardPoints(userId, earnedBadge.badge.xpReward, 'badge_reward');
      }

      // Emit real-time notification
      this.realtimeGateway.emitToUser(userId, 'badge_earned', {
        badge: earnedBadge.badge,
        earnedAt: earnedBadge.earnedAt
      });

      return true;
    } catch (error) {
      this.logger.error('Failed to grant badge', error);
      return false;
    }
  }

  async handleLessonCompletion(userId: string, lessonData: any): Promise<void> {
    // Award completion XP
    await this.awardPoints(userId, 100, 'lesson_completion');

    // Check for streak badges
    await this.updateLearningStreak(userId);

    // Check for subject mastery badges
    await this.checkSubjectMastery(userId, lessonData.courseId);
  }

  private async checkBadgeEligibility(tx: any, userId: string): Promise<void> {
    const badges = await tx.badge.findMany({ where: { isActive: true } });
    
    for (const badge of badges) {
      const isEligible = await this.evaluateBadgeCriteria(tx, userId, badge.criteria);
      if (isEligible) {
        await this.grantBadge(userId, badge.id);
      }
    }
  }

  private async evaluateBadgeCriteria(tx: any, userId: string, criteria: any): Promise<boolean> {
    switch (criteria.type) {
      case 'lessons_completed':
        const completedLessons = await tx.studentProgress.count({
          where: { studentId: userId, status: ProgressStatus.COMPLETED }
        });
        return completedLessons >= criteria.target;

      case 'quiz_streak':
        // Check for consecutive quiz passes
        const recentSubmissions = await tx.submission.findMany({
          where: { studentId: userId },
          orderBy: { submittedAt: 'desc' },
          take: criteria.target
        });
        return recentSubmissions.length === criteria.target && 
               recentSubmissions.every(s => s.score >= 70);

      case 'social_contribution':
        // Check for peer help or forum participation
        return false; // Implement based on social features

      default:
        return false;
    }
  }

  private calculateLevel(xpPoints: number): number {
    // Progressive XP requirements: Level 1 = 0, Level 2 = 100, Level 3 = 300, etc.
    return Math.floor(Math.sqrt(xpPoints / 100)) + 1;
  }
}
```

### 4. Real-time Notifications via WebSockets

**File: `/src/realtime-gateway/realtime.gateway.ts`**

```typescript
@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, string>(); // userId -> socketId

  constructor(
    private jwtService: JwtService,
    private logger: Logger
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      // Store user-socket mapping
      this.userSockets.set(userId, client.id);
      client.join(`user:${userId}`);

      // Join class rooms if student/teacher
      if (payload.role === UserRole.STUDENT || payload.role === UserRole.TEACHER) {
        const classIds = await this.getUserClassIds(userId, payload.role);
        classIds.forEach(classId => client.join(`class:${classId}`));
      }

      this.logger.log(`User ${userId} connected with socket ${client.id}`);
    } catch (error) {
      this.logger.error('WebSocket authentication failed', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Remove user-socket mapping
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        break;
      }
    }
    this.logger.log(`Socket ${client.id} disconnected`);
  }

  // Emit event to specific user
  emitToUser(userId: string, event: string, data: any): void {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  // Emit event to entire class
  emitToClass(classId: string, event: string, data: any): void {
    this.server.to(`class:${classId}`).emit(event, data);
  }

  // Handle real-time progress updates
  @SubscribeMessage('progress_update')
  async handleProgressUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ProgressUpdateDto
  ): Promise<void> {
    const userId = this.getUserIdFromSocket(client);
    
    // Broadcast progress to teachers and guardians
    const classIds = await this.getUserClassIds(userId, UserRole.STUDENT);
    classIds.forEach(classId => {
      this.emitToClass(classId, 'student_progress_update', {
        studentId: userId,
        ...data
      });
    });
  }

  // Handle guild chat messages
  @SubscribeMessage('guild_message')
  async handleGuildMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: GuildMessageDto
  ): Promise<void> {
    const userId = this.getUserIdFromSocket(client);
    
    // Broadcast to guild members
    this.server.to(`guild:${data.guildId}`).emit('guild_message', {
      userId,
      message: data.message,
      timestamp: new Date().toISOString()
    });
  }

  private getUserIdFromSocket(client: Socket): string {
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        return userId;
      }
    }
    throw new UnauthorizedException('Socket not authenticated');
  }
}
```

### 5. Advanced Analytics Service

**File: `/src/analytics/analytics.service.ts`**

```typescript
@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getStudentAnalytics(studentId: string): Promise<StudentAnalytics> {
    const [profile, progress, submissions, badges] = await Promise.all([
      this.prisma.profile.findUnique({ where: { userId: studentId } }),
      this.getProgressAnalytics(studentId),
      this.getSubmissionAnalytics(studentId),
      this.getBadgeAnalytics(studentId)
    ]);

    return {
      overview: {
        level: profile.level,
        xpPoints: profile.xpPoints,
        streak: profile.streak,
        lastActive: profile.lastActive
      },
      progress: progress,
      performance: submissions,
      achievements: badges,
      recommendations: await this.generateRecommendations(studentId)
    };
  }

  async getClassAnalytics(classId: string): Promise<ClassAnalytics> {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { classId, status: EnrollmentStatus.ACTIVE },
      include: { student: { include: { profile: true } } }
    });

    const studentIds = enrollments.map(e => e.studentId);
    
    const [engagement, performance, progress] = await Promise.all([
      this.calculateClassEngagement(studentIds),
      this.calculateClassPerformance(studentIds),
      this.calculateClassProgress(studentIds)
    ]);

    return {
      overview: {
        totalStudents: enrollments.length,
        averageLevel: engagement.averageLevel,
        activeStudents: engagement.activeStudents,
        completionRate: progress.completionRate
      },
      engagement,
      performance,
      progress,
      strugglingStudents: await this.identifyStrugglingStudents(studentIds),
      topPerformers: await this.getTopPerformers(studentIds)
    };
  }

  private async calculateClassEngagement(studentIds: string[]): Promise<EngagementMetrics> {
    const profiles = await this.prisma.profile.findMany({
      where: { userId: { in: studentIds } }
    });

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const activeStudents = profiles.filter(p => p.lastActive >= weekAgo).length;
    const averageLevel = profiles.reduce((sum, p) => sum + p.level, 0) / profiles.length;
    const averageStreak = profiles.reduce((sum, p) => sum + p.streak, 0) / profiles.length;

    return {
      activeStudents,
      totalStudents: profiles.length,
      averageLevel: Math.round(averageLevel),
      averageStreak: Math.round(averageStreak),
      engagementRate: (activeStudents / profiles.length) * 100
    };
  }

  private async identifyStrugglingStudents(studentIds: string[]): Promise<StrugglingStudent[]> {
    // Complex query to identify students who need help
    const strugglingCriteria = `
      SELECT 
        u.id,
        p.firstName,
        p.lastName,
        p.level,
        AVG(s.score) as avg_score,
        COUNT(CASE WHEN sp.status = 'COMPLETED' THEN 1 END) as completed_lessons,
        COUNT(sp.id) as total_lessons
      FROM users u
      JOIN profiles p ON u.id = p.userId
      LEFT JOIN submissions s ON u.id = s.studentId
      LEFT JOIN student_progress sp ON u.id = sp.studentId
      WHERE u.id = ANY($1)
      GROUP BY u.id, p.firstName, p.lastName, p.level
      HAVING AVG(s.score) < 60 OR 
             (COUNT(CASE WHEN sp.status = 'COMPLETED' THEN 1 END) / COUNT(sp.id)) < 0.5
      ORDER BY AVG(s.score) ASC
    `;

    const results = await this.prisma.$queryRaw`${strugglingCriteria}`;
    
    return results.map(result => ({
      studentId: result.id,
      name: `${result.firstName} ${result.lastName}`,
      level: result.level,
      averageScore: Math.round(result.avg_score || 0),
      completionRate: Math.round((result.completed_lessons / result.total_lessons) * 100),
      recommendedActions: this.generateRecommendedActions(result)
    }));
  }
}
```

### 6. Multilingual Content Service

**File: `/src/content/multilingual.service.ts`**

```typescript
@Injectable()
export class MultilingualService {
  private readonly supportedLanguages = [
    'en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn', 'ml', 'pa', 'or', 'as', 'ur'
  ];

  constructor(private prisma: PrismaService) {}

  async translateContent(contentId: string, targetLanguage: string): Promise<TranslatedContent> {
    // Check if translation already exists
    const existingTranslation = await this.prisma.contentTranslation.findUnique({
      where: { contentId_language: { contentId, language: targetLanguage } }
    });

    if (existingTranslation) {
      return existingTranslation.translatedContent;
    }

    // Generate new translation (integrate with translation service)
    const originalContent = await this.prisma.lesson.findUnique({
      where: { id: contentId }
    });

    if (!originalContent) {
      throw new NotFoundException('Content not found');
    }

    const translatedContent = await this.performTranslation(
      originalContent.content,
      'en',
      targetLanguage
    );

    // Store translation
    await this.prisma.contentTranslation.create({
      data: {
        contentId,
        language: targetLanguage,
        translatedContent,
        translatedAt: new Date()
      }
    });

    return translatedContent;
  }

  private async performTranslation(content: any, fromLang: string, toLang: string): Promise<any> {
    // Integration with translation service (Google Translate, Azure Translator, etc.)
    // For MVP, return mock translations or use a simple translation library
    
    if (toLang === 'hi') {
      return this.getMockHindiTranslation(content);
    }
    
    return content; // Fallback to original
  }

  async getLocalizedContent(userId: string, contentId: string): Promise<any> {
    const userProfile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { user: true }
    });

    const preferredLanguage = userProfile?.user?.preferredLanguage || 'en';
    
    if (preferredLanguage === 'en') {
      return this.prisma.lesson.findUnique({ where: { id: contentId } });
    }

    return this.translateContent(contentId, preferredLanguage);
  }
}
```

---

## Part 6: Security & Performance Considerations

### Security Implementation

**Authentication Flow:**
1. User submits credentials to `/auth/login`
2. Server validates against Argon2 hashed passwords
3. JWT token issued with user role and school context
4. All subsequent requests validated via JWT middleware
5. Role-based access enforced at controller level

**Data Protection:**
- All sensitive data encrypted at rest
- API rate limiting to prevent abuse
- Input validation using class-validator
- SQL injection prevention via Prisma ORM
- XSS protection through content sanitization

### Performance Optimization

**Caching Strategy:**
- Redis caching for frequently accessed data (leaderboards, user profiles)
- Database query optimization with proper indexing
- CDN integration for static content delivery
- Lazy loading for large datasets

**Scalability Patterns:**
- Horizontal scaling with load balancers
- Database read replicas for analytics queries
- Microservice architecture for independent scaling
- Queue-based processing for heavy operations

---

## Part 7: Deployment & Infrastructure

### Production Architecture

```yaml
# docker-compose.production.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: project_spark
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:
```

### Environment Configuration

```typescript
// src/config/app.config.ts
export const appConfig = {
  port: parseInt(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d'
  },
  
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'application/pdf']
  },
  
  gamification: {
    xpPerLesson: 100,
    xpPerQuiz: 50,
    levelUpThreshold: 1000
  }
};
```

---

## Part 8: API Documentation Standards

### Swagger Configuration

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Project Spark API')
    .setDescription('Gamified Learning Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Students', 'Student-specific endpoints')
    .addTag('Teachers', 'Teacher dashboard and management')
    .addTag('Admins', 'Administrative functions')
    .addTag('Guardians', 'Guardian portal features')
    .addTag('Sync', 'Offline synchronization')
    .addTag('Gamification', 'Points, badges, and achievements')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(3000);
}
```

---

## Part 9: Testing Strategy

### Test Structure

```typescript
// Example: auth.service.spec.ts
describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('validateUser', () => {
    it('should return user data for valid credentials', async () => {
      // Test implementation
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      // Test implementation
    });
  });
});
```

### Integration Testing

```typescript
// Example: student.controller.e2e-spec.ts
describe('StudentController (e2e)', () => {
  let app: INestApplication;
  let studentToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get student auth token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'demo_student', password: 'password' });
    
    studentToken = loginResponse.body.token;
  });

  it('/student/dashboard (GET)', () => {
    return request(app.getHttpServer())
      .get('/student/dashboard')
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('courses');
        expect(res.body).toHaveProperty('progress');
        expect(res.body).toHaveProperty('achievements');
      });
  });
});
```

---

## Part 10: Monitoring & Observability

### Logging Strategy

```typescript
// src/common/logger/logger.service.ts
@Injectable()
export class LoggerService {
  private logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' }),
      new winston.transports.Console({
        format: winston.format.simple()
      })
    ]
  });

  logUserAction(userId: string, action: string, metadata?: any): void {
    this.logger.info('User action', {
      userId,
      action,
      metadata,
      timestamp: new Date().toISOString()
    });
  }

  logSystemEvent(event: string, data?: any): void {
    this.logger.info('System event', {
      event,
      data,
      timestamp: new Date().toISOString()
    });
  }
}
```

### Health Check Implementation

```typescript
// src/health/health.controller.ts
@Controller('health')
export class HealthController {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService
  ) {}

  @Get()
  async checkHealth(): Promise<HealthStatus> {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkFileSystem()
    ]);

    return {
      status: checks.every(check => check.status === 'fulfilled') ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: checks[0].status === 'fulfilled' ? 'up' : 'down',
        redis: checks[1].status === 'fulfilled' ? 'up' : 'down',
        filesystem: checks[2].status === 'fulfilled' ? 'up' : 'down'
      }
    };
  }

  private async checkDatabase(): Promise<void> {
    await this.prisma.$queryRaw`SELECT 1`;
  }

  private async checkRedis(): Promise<void> {
    await this.redis.ping();
  }

  private async checkFileSystem(): Promise<void> {
    // Check if upload directory is writable
    const fs = require('fs').promises;
    await fs.access('./uploads', fs.constants.W_OK);
  }
}
```

---

## Conclusion

This backend blueprint provides a comprehensive foundation for Project Spark's server-side architecture. The design emphasizes:

- **Scalability**: Modular architecture that can grow with user base
- **Security**: Multi-layered security with RBAC and data protection
- **Performance**: Optimized queries, caching, and real-time features
- **Maintainability**: Clean code structure with comprehensive testing
- **Rural Compatibility**: Offline-first design with robust sync mechanisms

The implementation should begin with core authentication and user management, followed by the gamification engine, and then expand to advanced features like real-time collaboration and analytics.

**Next Steps:**
1. Set up development environment with Docker
2. Implement core authentication and user management
3. Build gamification engine with real-time features
4. Develop offline synchronization system
5. Add comprehensive testing and monitoring
6. Deploy to production with proper CI/CD pipeline

This blueprint serves as the definitive guide for building a world-class educational platform that can transform learning outcomes in rural schools while providing an engaging, game-like experience for all users.