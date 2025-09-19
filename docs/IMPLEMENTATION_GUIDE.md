# Project Spark - Backend Implementation Guide

## Phase-by-Phase Development Strategy

This guide provides a step-by-step approach to implementing the Project Spark backend, prioritizing core functionality while building toward advanced features.

---

## Phase 1: Foundation & Authentication (Week 1-2)

### 1.1 Project Setup

**Initialize NestJS Project:**
```bash
npm i -g @nestjs/cli
nest new project-spark-backend
cd project-spark-backend

# Install core dependencies
npm install @nestjs/config @nestjs/swagger
npm install @prisma/client prisma
npm install passport passport-jwt @nestjs/passport @nestjs/jwt
npm install argon2 class-validator class-transformer
npm install helmet express-rate-limit compression
```

**Environment Configuration:**
```typescript
// src/config/app.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  }
}));
```

### 1.2 Database Setup

**Prisma Schema Initialization:**
```bash
npx prisma init
```

**Core Schema (prisma/schema.prisma):**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Start with essential models
model User {
  id           String   @id @default(cuid())
  username     String   @unique
  email        String   @unique
  passwordHash String
  role         UserRole
  schoolId     String?
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  school   School?  @relation(fields: [schoolId], references: [id])
  profile  Profile?
  
  @@map("users")
}

model Profile {
  id          String  @id @default(cuid())
  userId      String  @unique
  firstName   String
  lastName    String
  displayName String
  avatarUrl   String?
  grade       Int?
  xpPoints    Int     @default(0)
  level       Int     @default(1)
  crystals    Int     @default(0)
  sparks      Int     @default(0)
  streak      Int     @default(0)
  lastActive  DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("profiles")
}

model School {
  id        String   @id @default(cuid())
  name      String
  district  String?
  state     String?
  country   String   @default("India")
  timezone  String   @default("Asia/Kolkata")
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())

  users User[]

  @@map("schools")
}

enum UserRole {
  STUDENT
  TEACHER
  ADMIN
  GUARDIAN
}
```

### 1.3 Authentication Module

**JWT Strategy (src/auth/strategies/jwt.strategy.ts):**
```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('app.jwt.secret'),
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { profile: true, school: true }
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }
}
```

**Auth Service (src/auth/auth.service.ts):**
```typescript
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: username }
        ]
      },
      include: { profile: true, school: true }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { 
      username: user.username, 
      sub: user.id, 
      role: user.role,
      schoolId: user.schoolId 
    };

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
        school: user.school
      }
    };
  }

  async register(registerDto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: registerDto.username },
          { email: registerDto.email }
        ]
      }
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Hash password
    const passwordHash = await argon2.hash(registerDto.password);

    // Create user with profile
    const user = await this.prisma.user.create({
      data: {
        username: registerDto.username,
        email: registerDto.email,
        passwordHash,
        role: registerDto.role,
        schoolId: registerDto.schoolId,
        profile: {
          create: {
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            displayName: registerDto.displayName,
            grade: registerDto.grade
          }
        }
      },
      include: { profile: true, school: true }
    });

    return this.login(user);
  }
}
```

### 1.4 Basic CRUD Operations

**User Service (src/users/users.service.ts):**
```typescript
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { 
        profile: true, 
        school: true,
        earnedBadges: {
          include: { badge: true }
        }
      }
    });
  }

  async updateProfile(userId: string, updateData: UpdateProfileDto) {
    return this.prisma.profile.update({
      where: { userId },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });
  }

  async getUserStats(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId }
    });

    const [completedLessons, totalSubmissions, earnedBadges] = await Promise.all([
      this.prisma.studentProgress.count({
        where: { studentId: userId, status: 'COMPLETED' }
      }),
      this.prisma.submission.count({
        where: { studentId: userId }
      }),
      this.prisma.earnedBadge.count({
        where: { userId }
      })
    ]);

    return {
      ...profile,
      stats: {
        completedLessons,
        totalSubmissions,
        earnedBadges,
        rank: await this.calculateUserRank(userId)
      }
    };
  }

  private async calculateUserRank(userId: string): Promise<number> {
    const userProfile = await this.prisma.profile.findUnique({
      where: { userId }
    });

    const higherRankedCount = await this.prisma.profile.count({
      where: {
        xpPoints: { gt: userProfile.xpPoints }
      }
    });

    return higherRankedCount + 1;
  }
}
```

---

## Phase 2: Content Management & Progress Tracking (Week 3-4)

### 2.1 Course and Lesson Management

**Course Service (src/courses/courses.service.ts):**
```typescript
@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async createCourse(createCourseDto: CreateCourseDto, createdBy: string) {
    return this.prisma.course.create({
      data: {
        ...createCourseDto,
        createdBy,
        lessons: {
          create: createCourseDto.lessons?.map((lesson, index) => ({
            ...lesson,
            orderIndex: index + 1
          })) || []
        }
      },
      include: { lessons: true }
    });
  }

  async getCoursesByGrade(grade: number, subject?: string) {
    return this.prisma.course.findMany({
      where: {
        grade,
        subject: subject ? { contains: subject, mode: 'insensitive' } : undefined,
        isPublished: true
      },
      include: {
        lessons: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });
  }

  async getLessonWithProgress(lessonId: string, studentId: string) {
    const [lesson, progress] = await Promise.all([
      this.prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { course: true, quizzes: true }
      }),
      this.prisma.studentProgress.findUnique({
        where: { studentId_lessonId: { studentId, lessonId } }
      })
    ]);

    return {
      ...lesson,
      progress: progress || {
        status: 'NOT_STARTED',
        progress: 0,
        timeSpent: 0
      }
    };
  }
}
```

### 2.2 Progress Tracking System

**Progress Service (src/student-progress/progress.service.ts):**
```typescript
@Injectable()
export class ProgressService {
  constructor(
    private prisma: PrismaService,
    private gamificationService: GamificationService,
    private logger: Logger
  ) {}

  async updateProgress(
    studentId: string, 
    lessonId: string, 
    progressData: UpdateProgressDto
  ) {
    const result = await this.prisma.$transaction(async (tx) => {
      // Update or create progress record
      const progress = await tx.studentProgress.upsert({
        where: { studentId_lessonId: { studentId, lessonId } },
        update: {
          progress: progressData.progress,
          timeSpent: { increment: progressData.timeSpent },
          status: progressData.progress >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
          lastAccessed: new Date(),
          completedAt: progressData.progress >= 100 ? new Date() : undefined
        },
        create: {
          studentId,
          lessonId,
          progress: progressData.progress,
          timeSpent: progressData.timeSpent,
          status: progressData.progress >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
          startedAt: new Date(),
          completedAt: progressData.progress >= 100 ? new Date() : undefined
        }
      });

      // Award XP if lesson completed
      if (progressData.progress >= 100 && progress.status !== 'COMPLETED') {
        await this.gamificationService.awardPoints(
          studentId, 
          100, 
          'lesson_completion'
        );
      }

      return progress;
    });

    this.logger.log(`Progress updated for student ${studentId}, lesson ${lessonId}: ${progressData.progress}%`);
    return result;
  }

  async getStudentDashboard(studentId: string) {
    const [profile, activeProgress, recentAchievements, enrollments] = await Promise.all([
      this.prisma.profile.findUnique({ where: { userId: studentId } }),
      
      this.prisma.studentProgress.findMany({
        where: { 
          studentId, 
          status: 'IN_PROGRESS' 
        },
        include: { 
          lesson: { 
            include: { course: true } 
          } 
        },
        take: 5,
        orderBy: { lastAccessed: 'desc' }
      }),
      
      this.prisma.earnedBadge.findMany({
        where: { userId: studentId },
        include: { badge: true },
        orderBy: { earnedAt: 'desc' },
        take: 3
      }),
      
      this.prisma.enrollment.findMany({
        where: { studentId, status: 'ACTIVE' },
        include: { 
          class: { 
            include: { 
              school: true 
            } 
          } 
        }
      })
    ]);

    return {
      profile,
      activeQuests: activeProgress.map(p => ({
        id: p.lesson.id,
        title: p.lesson.title,
        subject: p.lesson.course.subject,
        progress: p.progress,
        timeSpent: p.timeSpent
      })),
      recentAchievements: recentAchievements.map(eb => ({
        id: eb.badge.id,
        name: eb.badge.name,
        description: eb.badge.description,
        earnedAt: eb.earnedAt
      })),
      classes: enrollments.map(e => ({
        id: e.class.id,
        name: e.class.name,
        subject: e.class.subject,
        school: e.class.school.name
      }))
    };
  }
}
```

### 1.3 Role-Based Access Control

**Roles Guard (src/auth/guards/roles.guard.ts):**
```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}

// Decorator for easy role checking
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
```

---

## Phase 3: Gamification Engine (Week 5-6)

### 3.1 Badge System Implementation

**Gamification Service (src/gamification/gamification.service.ts):**
```typescript
@Injectable()
export class GamificationService {
  constructor(
    private prisma: PrismaService,
    private realtimeGateway: RealtimeGateway
  ) {}

  async awardPoints(userId: string, points: number, source: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // Update user XP
      const updatedProfile = await tx.profile.update({
        where: { userId },
        data: {
          xpPoints: { increment: points },
          lastActive: new Date()
        }
      });

      // Check for level up
      const newLevel = this.calculateLevel(updatedProfile.xpPoints);
      if (newLevel > updatedProfile.level) {
        await tx.profile.update({
          where: { userId },
          data: { level: newLevel }
        });

        // Emit level up event
        this.realtimeGateway.emitToUser(userId, 'level_up', {
          newLevel,
          xpPoints: updatedProfile.xpPoints,
          rewards: this.getLevelUpRewards(newLevel)
        });
      }

      // Check badge eligibility
      await this.checkAndAwardBadges(tx, userId);
    });
  }

  async checkAndAwardBadges(tx: any, userId: string): Promise<void> {
    const eligibleBadges = await this.getEligibleBadges(tx, userId);
    
    for (const badge of eligibleBadges) {
      await this.awardBadge(tx, userId, badge.id);
    }
  }

  private async getEligibleBadges(tx: any, userId: string): Promise<any[]> {
    // Get all badges user hasn't earned yet
    const availableBadges = await tx.badge.findMany({
      where: {
        isActive: true,
        NOT: {
          earnedBadges: {
            some: { userId }
          }
        }
      }
    });

    const eligibleBadges = [];
    
    for (const badge of availableBadges) {
      const isEligible = await this.evaluateBadgeCriteria(tx, userId, badge.criteria);
      if (isEligible) {
        eligibleBadges.push(badge);
      }
    }

    return eligibleBadges;
  }

  private async evaluateBadgeCriteria(tx: any, userId: string, criteria: any): Promise<boolean> {
    switch (criteria.type) {
      case 'lessons_completed':
        const completedCount = await tx.studentProgress.count({
          where: { studentId: userId, status: 'COMPLETED' }
        });
        return completedCount >= criteria.target;

      case 'quiz_streak':
        const recentSubmissions = await tx.submission.findMany({
          where: { studentId: userId },
          orderBy: { submittedAt: 'desc' },
          take: criteria.target
        });
        return recentSubmissions.length === criteria.target &&
               recentSubmissions.every(s => s.score >= criteria.minScore);

      case 'subject_mastery':
        const subjectProgress = await tx.studentProgress.findMany({
          where: {
            studentId: userId,
            lesson: { course: { subject: criteria.subject } },
            status: 'COMPLETED'
          }
        });
        return subjectProgress.length >= criteria.target;

      case 'learning_streak':
        const profile = await tx.profile.findUnique({
          where: { userId }
        });
        return profile.streak >= criteria.target;

      default:
        return false;
    }
  }

  private async awardBadge(tx: any, userId: string, badgeId: string): Promise<void> {
    const badge = await tx.badge.findUnique({ where: { id: badgeId } });
    
    // Create earned badge record
    await tx.earnedBadge.create({
      data: { userId, badgeId }
    });

    // Award badge rewards
    if (badge.xpReward > 0) {
      await tx.profile.update({
        where: { userId },
        data: {
          xpPoints: { increment: badge.xpReward },
          crystals: { increment: badge.crystalReward },
          sparks: { increment: badge.sparkReward }
        }
      });
    }

    // Emit real-time notification
    this.realtimeGateway.emitToUser(userId, 'badge_earned', {
      badge: {
        id: badge.id,
        name: badge.name,
        description: badge.description,
        iconUrl: badge.iconUrl,
        rarity: badge.rarity
      },
      rewards: {
        xp: badge.xpReward,
        crystals: badge.crystalReward,
        sparks: badge.sparkReward
      }
    });
  }

  private calculateLevel(xpPoints: number): number {
    // Progressive XP requirements
    return Math.floor(Math.sqrt(xpPoints / 100)) + 1;
  }

  private getLevelUpRewards(level: number): any {
    return {
      crystals: level * 10,
      sparks: level * 5,
      title: this.getLevelTitle(level)
    };
  }

  private getLevelTitle(level: number): string {
    if (level >= 50) return 'Legendary Spark Master';
    if (level >= 40) return 'Epic Knowledge Champion';
    if (level >= 30) return 'Master Scholar Sage';
    if (level >= 20) return 'Expert Quest Conqueror';
    if (level >= 10) return 'Skilled Realm Explorer';
    if (level >= 5) return 'Rising Spark Wielder';
    return 'Novice Odyssey Seeker';
  }
}
```

### 3.2 Leaderboard System

**Leaderboard Service (src/gamification/leaderboard.service.ts):**
```typescript
@Injectable()
export class LeaderboardService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService
  ) {}

  async getClassLeaderboard(classId: string, timeframe: 'daily' | 'weekly' | 'monthly' | 'all_time' = 'weekly'): Promise<LeaderboardEntry[]> {
    const cacheKey = `leaderboard:class:${classId}:${timeframe}`;
    
    // Try cache first
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Calculate leaderboard
    const dateFilter = this.getDateFilter(timeframe);
    
    const leaderboard = await this.prisma.$queryRaw`
      SELECT 
        u.id,
        p.display_name,
        p.avatar_url,
        p.level,
        p.xp_points,
        p.streak,
        COUNT(CASE WHEN sp.status = 'COMPLETED' 
                   AND sp.completed_at >= ${dateFilter} 
              THEN 1 END) as quests_completed,
        SUM(CASE WHEN s.submitted_at >= ${dateFilter} 
                 THEN s.score ELSE 0 END) as total_score,
        ROW_NUMBER() OVER (ORDER BY p.xp_points DESC) as rank
      FROM enrollments e
      JOIN users u ON e.student_id = u.id
      JOIN profiles p ON u.id = p.user_id
      LEFT JOIN student_progress sp ON u.id = sp.student_id
      LEFT JOIN submissions s ON u.id = s.student_id
      WHERE e.class_id = ${classId} AND e.status = 'ACTIVE'
      GROUP BY u.id, p.display_name, p.avatar_url, p.level, p.xp_points, p.streak
      ORDER BY p.xp_points DESC
      LIMIT 50
    `;

    // Cache for 5 minutes
    await this.redis.setex(cacheKey, 300, JSON.stringify(leaderboard));
    
    return leaderboard;
  }

  async getGlobalLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
    const cacheKey = `leaderboard:global:${limit}`;
    
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const leaderboard = await this.prisma.profile.findMany({
      take: limit,
      orderBy: { xpPoints: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            school: {
              select: { name: true }
            }
          }
        }
      }
    });

    const formattedLeaderboard = leaderboard.map((profile, index) => ({
      rank: index + 1,
      userId: profile.user.id,
      displayName: profile.displayName,
      level: profile.level,
      xpPoints: profile.xpPoints,
      streak: profile.streak,
      school: profile.user.school?.name
    }));

    // Cache for 10 minutes
    await this.redis.setex(cacheKey, 600, JSON.stringify(formattedLeaderboard));
    
    return formattedLeaderboard;
  }

  private getDateFilter(timeframe: string): Date {
    const now = new Date();
    switch (timeframe) {
      case 'daily':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      case 'weekly':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        return weekStart;
      case 'monthly':
        return new Date(now.getFullYear(), now.getMonth(), 1);
      default:
        return new Date(0); // All time
    }
  }
}
```

---

## Phase 4: Real-time Features & WebSockets (Week 7-8)

### 4.1 WebSocket Gateway Implementation

**Realtime Gateway (src/realtime-gateway/realtime.gateway.ts):**
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

  private userSockets = new Map<string, string>();
  private socketUsers = new Map<string, string>();

  constructor(
    private jwtService: JwtService,
    private logger: Logger
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      // Store mappings
      this.userSockets.set(userId, client.id);
      this.socketUsers.set(client.id, userId);

      // Join user-specific room
      client.join(`user:${userId}`);

      // Join role-specific rooms
      client.join(`role:${payload.role.toLowerCase()}`);

      // Join class rooms for students and teachers
      if (payload.role === 'STUDENT' || payload.role === 'TEACHER') {
        const classIds = await this.getUserClassIds(userId, payload.role);
        classIds.forEach(classId => client.join(`class:${classId}`));
      }

      this.logger.log(`User ${userId} connected with socket ${client.id}`);
      
      // Send welcome message
      client.emit('connected', {
        message: 'Welcome to Project Spark!',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.logger.error('WebSocket authentication failed', error);
      client.emit('auth_error', { message: 'Authentication failed' });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.socketUsers.get(client.id);
    if (userId) {
      this.userSockets.delete(userId);
      this.socketUsers.delete(client.id);
      this.logger.log(`User ${userId} disconnected`);
    }
  }

  // Emit to specific user
  emitToUser(userId: string, event: string, data: any): void {
    this.server.to(`user:${userId}`).emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  // Emit to entire class
  emitToClass(classId: string, event: string, data: any): void {
    this.server.to(`class:${classId}`).emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  // Emit to all users with specific role
  emitToRole(role: string, event: string, data: any): void {
    this.server.to(`role:${role}`).emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  @SubscribeMessage('join_guild')
  async handleJoinGuild(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { guildId: string }
  ): Promise<void> {
    const userId = this.socketUsers.get(client.id);
    if (userId) {
      client.join(`guild:${data.guildId}`);
      this.logger.log(`User ${userId} joined guild ${data.guildId}`);
    }
  }

  @SubscribeMessage('guild_message')
  async handleGuildMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: GuildMessageDto
  ): Promise<void> {
    const userId = this.socketUsers.get(client.id);
    if (userId) {
      // Broadcast to guild members
      this.server.to(`guild:${data.guildId}`).emit('guild_message', {
        userId,
        message: data.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  @SubscribeMessage('progress_update')
  async handleProgressUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ProgressUpdateDto
  ): Promise<void> {
    const userId = this.socketUsers.get(client.id);
    if (userId) {
      // Broadcast to teachers and guardians
      const classIds = await this.getUserClassIds(userId, 'STUDENT');
      classIds.forEach(classId => {
        this.emitToClass(classId, 'student_progress_update', {
          studentId: userId,
          lessonId: data.lessonId,
          progress: data.progress
        });
      });
    }
  }

  private async getUserClassIds(userId: string, role: string): Promise<string[]> {
    if (role === 'STUDENT') {
      const enrollments = await this.prisma.enrollment.findMany({
        where: { studentId: userId, status: 'ACTIVE' },
        select: { classId: true }
      });
      return enrollments.map(e => e.classId);
    } else if (role === 'TEACHER') {
      const classes = await this.prisma.class.findMany({
        where: { teacherId: userId, isActive: true },
        select: { id: true }
      });
      return classes.map(c => c.id);
    }
    return [];
  }
}
```

---

## Phase 5: Offline Synchronization (Week 9-10)

### 5.1 Sync Service Implementation

**Sync Service (src/sync/sync.service.ts):**
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
      const result = await this.prisma.$transaction(async (tx) => {
        const processedActions = [];
        const conflicts = [];
        const rewards = { xp: 0, crystals: 0, sparks: 0, badges: [] };

        // Sort actions by timestamp
        const sortedActions = syncBatch.actions.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        for (const action of sortedActions) {
          try {
            const actionResult = await this.processAction(tx, userId, action);
            processedActions.push(actionResult);
            
            // Accumulate rewards
            if (actionResult.rewards) {
              rewards.xp += actionResult.rewards.xp || 0;
              rewards.crystals += actionResult.rewards.crystals || 0;
              rewards.sparks += actionResult.rewards.sparks || 0;
              if (actionResult.rewards.badges) {
                rewards.badges.push(...actionResult.rewards.badges);
              }
            }
            
          } catch (error) {
            if (error instanceof ConflictError) {
              conflicts.push({
                actionId: action.id,
                type: action.type,
                conflict: error.message,
                clientData: action.data,
                serverData: error.serverData,
                suggestedResolution: error.suggestedResolution
              });
            } else {
              throw error;
            }
          }
        }

        return { processedActions, conflicts, rewards };
      });

      // Update sync log
      await this.updateSyncLog(syncLog.id, 'COMPLETED', {
        processed: result.processedActions.length,
        conflicts: result.conflicts.length
      });

      return {
        success: true,
        syncId: syncLog.id,
        processed: result.processedActions.length,
        conflicts: result.conflicts,
        rewards: result.rewards
      };

    } catch (error) {
      await this.updateSyncLog(syncLog.id, 'FAILED', { error: error.message });
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
      case 'time_tracking':
        return this.processTimeTracking(tx, userId, action);
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
      // Conflict resolution logic
      const clientTimestamp = new Date(action.timestamp);
      const serverTimestamp = existingProgress.lastAccessed;

      if (serverTimestamp > clientTimestamp) {
        // Server data is newer - check for conflicts
        if (Math.abs(existingProgress.progress - progress) > 10) {
          throw new ConflictError(
            'Progress conflict detected',
            existingProgress,
            'merge_highest_progress'
          );
        }
      }

      // Merge progress (take highest values)
      const mergedData = {
        progress: Math.max(existingProgress.progress, progress),
        timeSpent: existingProgress.timeSpent + timeSpent,
        status: Math.max(existingProgress.progress, progress) >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
        lastAccessed: new Date(action.timestamp),
        completedAt: completedAt ? new Date(completedAt) : existingProgress.completedAt,
        syncVersion: existingProgress.syncVersion + 1
      };

      await tx.studentProgress.update({
        where: { id: existingProgress.id },
        data: mergedData
      });

      // Award XP if newly completed
      let rewards = null;
      if (mergedData.status === 'COMPLETED' && existingProgress.status !== 'COMPLETED') {
        await this.gamificationService.awardPoints(userId, 100, 'lesson_completion');
        rewards = { xp: 100 };
      }

      return {
        type: 'lesson_progress',
        success: true,
        data: { lessonId, progress: mergedData.progress },
        rewards
      };
    } else {
      // Create new progress record
      const newProgress = await tx.studentProgress.create({
        data: {
          studentId: userId,
          lessonId,
          progress,
          timeSpent,
          status: progress >= 100 ? 'COMPLETED' : 'IN_PROGRESS',
          startedAt: new Date(action.timestamp),
          lastAccessed: new Date(action.timestamp),
          completedAt: completedAt ? new Date(completedAt) : null,
          syncVersion: 1
        }
      });

      // Award XP for completion
      let rewards = null;
      if (progress >= 100) {
        await this.gamificationService.awardPoints(userId, 100, 'lesson_completion');
        rewards = { xp: 100 };
      }

      return {
        type: 'lesson_progress',
        success: true,
        data: { lessonId, progress },
        rewards
      };
    }
  }

  private async processQuizSubmission(tx: any, userId: string, action: SyncAction): Promise<ProcessedAction> {
    const { quizId, answers, timeSpent, score } = action.data;
    
    // Check for existing submission
    const existingSubmission = await tx.submission.findFirst({
      where: { studentId: userId, quizId },
      orderBy: { submittedAt: 'desc' }
    });

    // Calculate score if not provided
    const calculatedScore = score || await this.calculateQuizScore(tx, quizId, answers);

    // Create new submission
    const submission = await tx.submission.create({
      data: {
        studentId: userId,
        quizId,
        answers,
        score: calculatedScore,
        timeSpent,
        submittedAt: new Date(action.timestamp),
        attempt: existingSubmission ? existingSubmission.attempt + 1 : 1
      }
    });

    // Award XP based on score
    const xpReward = Math.floor(calculatedScore * 0.5); // 50 XP for 100% score
    if (xpReward > 0) {
      await this.gamificationService.awardPoints(userId, xpReward, 'quiz_completion');
    }

    return {
      type: 'quiz_submission',
      success: true,
      data: { quizId, score: calculatedScore },
      rewards: { xp: xpReward }
    };
  }

  private async calculateQuizScore(tx: any, quizId: string, answers: any): Promise<number> {
    const questions = await tx.question.findMany({
      where: { quizId },
      select: { id: true, correctAnswer: true, points: true }
    });

    let totalPoints = 0;
    let earnedPoints = 0;

    for (const question of questions) {
      totalPoints += question.points;
      
      const studentAnswer = answers[question.id];
      const correctAnswer = question.correctAnswer;
      
      if (this.isAnswerCorrect(studentAnswer, correctAnswer)) {
        earnedPoints += question.points;
      }
    }

    return totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
  }

  private isAnswerCorrect(studentAnswer: any, correctAnswer: any): boolean {
    // Handle different question types
    if (Array.isArray(correctAnswer)) {
      return correctAnswer.includes(studentAnswer);
    }
    return studentAnswer === correctAnswer;
  }
}
```

---

## Phase 6: Analytics & Reporting (Week 11-12)

### 6.1 Analytics Service

**Analytics Service (src/analytics/analytics.service.ts):**
```typescript
@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getStudentAnalytics(studentId: string, timeframe: string = 'monthly'): Promise<StudentAnalytics> {
    const dateFilter = this.getDateFilter(timeframe);
    
    const [profile, progressStats, performanceStats, engagementStats] = await Promise.all([
      this.getStudentProfile(studentId),
      this.getProgressStats(studentId, dateFilter),
      this.getPerformanceStats(studentId, dateFilter),
      this.getEngagementStats(studentId, dateFilter)
    ]);

    return {
      overview: {
        level: profile.level,
        xpPoints: profile.xpPoints,
        streak: profile.streak,
        totalTimeSpent: profile.totalTimeSpent
      },
      progress: progressStats,
      performance: performanceStats,
      engagement: engagementStats,
      recommendations: await this.generateRecommendations(studentId)
    };
  }

  async getClassAnalytics(classId: string): Promise<ClassAnalytics> {
    const [classInfo, engagement, performance, distribution] = await Promise.all([
      this.getClassInfo(classId),
      this.getClassEngagement(classId),
      this.getClassPerformance(classId),
      this.getScoreDistribution(classId)
    ]);

    return {
      classInfo,
      engagement,
      performance,
      distribution,
      strugglingStudents: await this.identifyStrugglingStudents(classId),
      topPerformers: await this.getTopPerformers(classId)
    };
  }

  private async getProgressStats(studentId: string, dateFilter: Date): Promise<ProgressStats> {
    const stats = await this.prisma.$queryRaw`
      SELECT 
        COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_lessons,
        COUNT(CASE WHEN status = 'IN_PROGRESS' THEN 1 END) as in_progress_lessons,
        COUNT(*) as total_lessons,
        AVG(progress) as average_progress,
        SUM(time_spent) as total_time_spent
      FROM student_progress 
      WHERE student_id = ${studentId}
      AND last_accessed >= ${dateFilter}
    `;

    return stats[0];
  }

  private async getPerformanceStats(studentId: string, dateFilter: Date): Promise<PerformanceStats> {
    const stats = await this.prisma.$queryRaw`
      SELECT 
        AVG(score) as average_score,
        COUNT(*) as total_submissions,
        COUNT(CASE WHEN score >= 80 THEN 1 END) as high_scores,
        COUNT(CASE WHEN score < 60 THEN 1 END) as low_scores,
        AVG(time_spent) as average_time_per_quiz
      FROM submissions 
      WHERE student_id = ${studentId}
      AND submitted_at >= ${dateFilter}
    `;

    return stats[0];
  }

  private async generateRecommendations(studentId: string): Promise<Recommendation[]> {
    const recommendations = [];
    
    // Analyze weak subjects
    const weakSubjects = await this.prisma.$queryRaw`
      SELECT 
        c.subject,
        AVG(s.score) as avg_score,
        COUNT(*) as submission_count
      FROM submissions s
      JOIN quizzes q ON s.quiz_id = q.id
      JOIN lessons l ON q.lesson_id = l.id
      JOIN courses c ON l.course_id = c.id
      WHERE s.student_id = ${studentId}
      AND s.submitted_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY c.subject
      HAVING AVG(s.score) < 70
      ORDER BY AVG(s.score) ASC
    `;

    for (const subject of weakSubjects) {
      recommendations.push({
        type: 'remedial_practice',
        priority: 'high',
        title: `Additional ${subject.subject} Practice`,
        description: `Your average score in ${subject.subject} is ${Math.round(subject.avg_score)}%. Consider additional practice.`,
        actionItems: [
          'Review fundamental concepts',
          'Complete practice quizzes',
          'Join study group'
        ]
      });
    }

    // Analyze learning patterns
    const learningPattern = await this.analyzeLearningPattern(studentId);
    if (learningPattern.preferredTime) {
      recommendations.push({
        type: 'schedule_optimization',
        priority: 'medium',
        title: 'Optimize Study Schedule',
        description: `You perform best during ${learningPattern.preferredTime}. Consider scheduling important lessons during this time.`,
        actionItems: [`Schedule study sessions during ${learningPattern.preferredTime}`]
      });
    }

    return recommendations;
  }

  private async analyzeLearningPattern(studentId: string): Promise<LearningPattern> {
    // Analyze when student performs best
    const hourlyPerformance = await this.prisma.$queryRaw`
      SELECT 
        EXTRACT(HOUR FROM submitted_at) as hour,
        AVG(score) as avg_score,
        COUNT(*) as submission_count
      FROM submissions
      WHERE student_id = ${studentId}
      AND submitted_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY EXTRACT(HOUR FROM submitted_at)
      HAVING COUNT(*) >= 3
      ORDER BY AVG(score) DESC
      LIMIT 1
    `;

    const bestHour = hourlyPerformance[0]?.hour;
    let preferredTime = null;

    if (bestHour !== undefined) {
      if (bestHour >= 6 && bestHour < 12) preferredTime = 'morning';
      else if (bestHour >= 12 && bestHour < 17) preferredTime = 'afternoon';
      else if (bestHour >= 17 && bestHour < 21) preferredTime = 'evening';
    }

    return { preferredTime };
  }
}
```

### 5.2 Conflict Resolution

**Conflict Resolution Service (src/sync/conflict-resolution.service.ts):**
```typescript
@Injectable()
export class ConflictResolutionService {
  constructor(private prisma: PrismaService) {}

  async resolveConflict(conflictId: string, resolution: ConflictResolution): Promise<void> {
    const conflict = await this.prisma.syncConflict.findUnique({
      where: { id: conflictId }
    });

    if (!conflict) {
      throw new NotFoundException('Conflict not found');
    }

    let resolvedData;
    
    switch (resolution.strategy) {
      case 'client_wins':
        resolvedData = conflict.clientData;
        break;
      case 'server_wins':
        resolvedData = conflict.serverData;
        break;
      case 'merge':
        resolvedData = this.mergeData(conflict.clientData, conflict.serverData, resolution.mergeRules);
        break;
      case 'manual':
        resolvedData = resolution.manualData;
        break;
      default:
        throw new BadRequestException('Invalid resolution strategy');
    }

    // Apply resolution
    await this.applyResolution(conflict.entityType, conflict.entityId, resolvedData);

    // Mark conflict as resolved
    await this.prisma.syncConflict.update({
      where: { id: conflictId },
      data: {
        resolutionStrategy: resolution.strategy,
        resolvedData,
        resolvedAt: new Date(),
        resolvedBy: resolution.resolvedBy
      }
    });
  }

  private mergeData(clientData: any, serverData: any, mergeRules: any): any {
    const merged = { ...serverData };
    
    // Apply merge rules
    for (const [field, rule] of Object.entries(mergeRules)) {
      switch (rule) {
        case 'take_highest':
          merged[field] = Math.max(clientData[field] || 0, serverData[field] || 0);
          break;
        case 'take_latest':
          merged[field] = clientData.timestamp > serverData.timestamp ? 
                         clientData[field] : serverData[field];
          break;
        case 'sum':
          merged[field] = (clientData[field] || 0) + (serverData[field] || 0);
          break;
      }
    }

    return merged;
  }

  private async applyResolution(entityType: string, entityId: string, data: any): Promise<void> {
    switch (entityType) {
      case 'student_progress':
        await this.prisma.studentProgress.update({
          where: { id: entityId },
          data
        });
        break;
      case 'submission':
        await this.prisma.submission.update({
          where: { id: entityId },
          data
        });
        break;
    }
  }
}
```

---

## Phase 7: Advanced Features (Week 13-16)

### 7.1 AI Companion System

**AI Companion Service (src/ai/companion.service.ts):**
```typescript
@Injectable()
export class AICompanionService {
  constructor(
    private prisma: PrismaService,
    private analyticsService: AnalyticsService
  ) {}

  async generatePersonalizedMessage(studentId: string): Promise<CompanionMessage> {
    const [profile, recentActivity, learningPattern] = await Promise.all([
      this.prisma.profile.findUnique({ where: { userId: studentId } }),
      this.getRecentActivity(studentId),
      this.analyticsService.analyzeLearningPattern(studentId)
    ]);

    const context = {
      level: profile.level,
      streak: profile.streak,
      recentPerformance: recentActivity.averageScore,
      strugglingSubject: recentActivity.strugglingSubject,
      preferredTime: learningPattern.preferredTime
    };

    const message = this.generateContextualMessage(context);
    
    // Store interaction for learning
    await this.prisma.aiInteraction.create({
      data: {
        studentId,
        interactionType: 'personalized_message',
        context,
        aiResponse: message.text
      }
    });

    return message;
  }

  async generateHint(studentId: string, questionId: string, attempts: number): Promise<string> {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: { quiz: { include: { lesson: { include: { course: true } } } } }
    });

    const studentHistory = await this.getStudentQuestionHistory(studentId, questionId);
    
    const hint = this.generateAdaptiveHint(question, attempts, studentHistory);
    
    // Log interaction
    await this.prisma.aiInteraction.create({
      data: {
        studentId,
        interactionType: 'hint',
        context: { questionId, attempts, subject: question.quiz.lesson.course.subject },
        aiResponse: hint
      }
    });

    return hint;
  }

  private generateContextualMessage(context: any): CompanionMessage {
    const messages = {
      encouragement: [
        `Amazing work reaching level ${context.level}! Your dedication is truly inspiring.`,
        `Your ${context.streak}-day streak shows incredible commitment! Keep it up!`,
        `I've noticed you're excelling in your studies. Ready for the next challenge?`
      ],
      support: [
        `I see you're working hard on ${context.strugglingSubject}. Remember, every expert was once a beginner!`,
        `${context.strugglingSubject} can be tricky, but you've got this! Want to try a different approach?`,
        `Your persistence in ${context.strugglingSubject} is admirable. Let's break it down step by step.`
      ],
      motivation: [
        `You're doing great! Your recent average of ${Math.round(context.recentPerformance)}% shows real progress.`,
        `I believe in you! Every challenge you overcome makes you stronger.`,
        `Your learning journey is unique and valuable. Keep exploring!`
      ]
    };

    let messageType = 'encouragement';
    if (context.recentPerformance < 60) messageType = 'support';
    else if (context.streak < 3) messageType = 'motivation';

    const selectedMessages = messages[messageType];
    const randomMessage = selectedMessages[Math.floor(Math.random() * selectedMessages.length)];

    return {
      text: randomMessage,
      type: messageType,
      mood: messageType === 'support' ? 'caring' : 'encouraging'
    };
  }

  private generateAdaptiveHint(question: any, attempts: number, history: any): string {
    const baseHints = {
      1: "Take your time and read the question carefully.",
      2: "Think about what concept this question is testing.",
      3: "Try breaking the problem into smaller steps.",
      4: "Consider reviewing the lesson material for this topic."
    };

    // Customize hint based on question type and student history
    let hint = baseHints[Math.min(attempts, 4)];
    
    if (question.type === 'MULTIPLE_CHOICE' && attempts >= 2) {
      hint += " Try eliminating obviously wrong answers first.";
    }
    
    if (history.commonMistakes?.length > 0) {
      hint += ` Watch out for: ${history.commonMistakes[0]}.`;
    }

    return hint;
  }
}
```

### 7.2 Multilingual Support

**Translation Service (src/content/translation.service.ts):**
```typescript
@Injectable()
export class TranslationService {
  private readonly supportedLanguages = [
    'en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn', 'ml', 'pa', 'or', 'as', 'ur'
  ];

  constructor(private prisma: PrismaService) {}

  async translateContent(
    contentId: string, 
    contentType: string, 
    targetLanguage: string
  ): Promise<any> {
    // Check cache first
    const existingTranslation = await this.prisma.contentTranslation.findUnique({
      where: {
        contentId_contentType_language: {
          contentId,
          contentType,
          language: targetLanguage
        }
      }
    });

    if (existingTranslation) {
      return existingTranslation.translatedContent;
    }

    // Get original content
    const originalContent = await this.getOriginalContent(contentId, contentType);
    
    // Perform translation
    const translatedContent = await this.performTranslation(
      originalContent,
      'en',
      targetLanguage
    );

    // Store translation
    await this.prisma.contentTranslation.create({
      data: {
        contentId,
        contentType,
        language: targetLanguage,
        translatedContent,
        translatedBy: 'auto',
        translationQuality: 0.85 // Mock quality score
      }
    });

    return translatedContent;
  }

  private async performTranslation(content: any, fromLang: string, toLang: string): Promise<any> {
    // For MVP, use mock translations
    if (toLang === 'hi') {
      return this.getMockHindiTranslation(content);
    }
    
    // In production, integrate with Google Translate API or similar
    // const translatedText = await this.googleTranslate.translate(content.text, toLang);
    
    return content; // Fallback to original
  }

  async getLocalizedContent(userId: string, contentId: string, contentType: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    const preferredLanguage = user?.preferredLanguage || 'en';
    
    if (preferredLanguage === 'en') {
      return this.getOriginalContent(contentId, contentType);
    }

    return this.translateContent(contentId, contentType, preferredLanguage);
  }

  private getMockHindiTranslation(content: any): any {
    const translations = {
      'Mathematics': 'गणित',
      'Physics': 'भौतिकी',
      'Chemistry': 'रसायन विज्ञान',
      'Biology': 'जीव विज्ञान',
      'Welcome': 'स्वागत है',
      'Complete': 'पूर्ण करें',
      'Start': 'शुरू करें'
    };

    const translatedContent = { ...content };
    
    // Simple word replacement for demo
    if (translatedContent.title) {
      Object.entries(translations).forEach(([en, hi]) => {
        translatedContent.title = translatedContent.title.replace(new RegExp(en, 'gi'), hi);
      });
    }

    return translatedContent;
  }
}
```

---

## Phase 8: Performance Optimization & Monitoring (Week 17-18)

### 8.1 Caching Strategy

**Redis Service (src/cache/redis.service.ts):**
```typescript
@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3
    });
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setex(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }

  // Leaderboard operations
  async updateLeaderboard(scope: string, userId: string, score: number): Promise<void> {
    await this.client.zadd(`leaderboard:${scope}`, score, userId);
  }

  async getLeaderboard(scope: string, limit: number = 10): Promise<LeaderboardEntry[]> {
    const results = await this.client.zrevrange(
      `leaderboard:${scope}`, 
      0, 
      limit - 1, 
      'WITHSCORES'
    );

    const leaderboard = [];
    for (let i = 0; i < results.length; i += 2) {
      const userId = results[i];
      const score = parseInt(results[i + 1]);
      
      const user = await this.getUserData(userId);
      leaderboard.push({
        rank: Math.floor(i / 2) + 1,
        userId,
        displayName: user.displayName,
        score,
        level: user.level
      });
    }

    return leaderboard;
  }
}
```

### 8.2 Performance Monitoring

**Health Check Controller (src/health/health.controller.ts):**
```typescript
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

    const dbStatus = checks[0].status === 'fulfilled' ? 'healthy' : 'unhealthy';
    const redisStatus = checks[1].status === 'fulfilled' ? 'healthy' : 'unhealthy';
    const fsStatus = checks[2].status === 'fulfilled' ? 'healthy' : 'unhealthy';

    const overallStatus = [dbStatus, redisStatus, fsStatus].every(s => s === 'healthy') 
      ? 'healthy' : 'unhealthy';

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        redis: redisStatus,
        filesystem: fsStatus
      },
      metrics: await this.getSystemMetrics()
    };
  }

  private async checkDatabase(): Promise<void> {
    await this.prisma.$queryRaw`SELECT 1`;
  }

  private async checkRedis(): Promise<void> {
    await this.redis.set('health_check', 'ok', 10);
    const result = await this.redis.get('health_check');
    if (result !== 'ok') {
      throw new Error('Redis health check failed');
    }
  }

  private async getSystemMetrics(): Promise<SystemMetrics> {
    const memUsage = process.memoryUsage();
    
    return {
      uptime: process.uptime(),
      memory: {
        used: Math.round(memUsage.heapUsed / 1024 / 1024),
        total: Math.round(memUsage.heapTotal / 1024 / 1024)
      },
      cpu: await this.getCpuUsage(),
      activeConnections: await this.getActiveConnections()
    };
  }
}
```

---

## Phase 9: Security Hardening (Week 19-20)

### 9.1 Security Middleware

**Security Configuration (src/config/security.config.ts):**
```typescript
import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

export function configureSecurityMiddleware(app: INestApplication): void {
  // Security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "wss:", "ws:"]
      }
    },
    crossOriginEmbedderPolicy: false
  }));

  // Rate limiting
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: 'Too many authentication attempts',
    standardHeaders: true,
    legacyHeaders: false
  });

  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // 100 requests per window
    standardHeaders: true,
    legacyHeaders: false
  });

  app.use('/api/v1/auth', authLimiter);
  app.use('/api/v1', generalLimiter);
}
```

### 9.2 Data Validation

**Validation Pipes (src/common/pipes/validation.pipe.ts):**
```typescript
@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error for unknown properties
      transform: true, // Transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true
      },
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map(error => ({
          field: error.property,
          constraints: Object.values(error.constraints || {})
        }));
        
        return new BadRequestException({
          message: 'Validation failed',
          errors: messages
        });
      }
    });
  }
}
```

---

## Phase 10: Testing Strategy

### 10.1 Unit Testing

**Example Test (src/auth/auth.service.spec.ts):**
```typescript
describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return user data for valid credentials', async () => {
      const mockUser = {
        id: 'user_123',
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: await argon2.hash('password123'),
        role: UserRole.STUDENT
      };

      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(mockUser);
      
      const result = await service.validateUser('testuser', 'password123');
      
      expect(result).toBeDefined();
      expect(result.username).toBe('testuser');
      expect(result.passwordHash).toBeUndefined();
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const mockUser = {
        id: 'user_123',
        username: 'testuser',
        passwordHash: await argon2.hash('correctpassword')
      };

      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(mockUser);
      
      await expect(
        service.validateUser('testuser', 'wrongpassword')
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
```

### 10.2 Integration Testing

**Example E2E Test (test/auth.e2e-spec.ts):**
```typescript
describe('Authentication (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    
    await app.init();
  });

  beforeEach(async () => {
    // Clean database
    await prisma.user.deleteMany();
    await prisma.school.deleteMany();
  });

  it('/auth/login (POST)', async () => {
    // Create test user
    const hashedPassword = await argon2.hash('password123');
    const user = await prisma.user.create({
      data: {
        username: 'testuser',
        email: 'test@example.com',
        passwordHash: hashedPassword,
        role: UserRole.STUDENT,
        profile: {
          create: {
            firstName: 'Test',
            lastName: 'User',
            displayName: 'Test User'
          }
        }
      }
    });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'password123'
      })
      .expect(201);

    expect(response.body).toHaveProperty('access_token');
    expect(response.body.user.username).toBe('testuser');
  });
});
```

---

## Phase 11: Deployment & DevOps

### 11.1 Docker Configuration

**Dockerfile:**
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS runtime

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY . .

RUN npx prisma generate
RUN npm run build

USER nestjs

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

**Docker Compose for Development:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/project_spark
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=dev-secret-key
    depends_on:
      - postgres
      - redis
    volumes:
      - .:/app
      - /app/node_modules

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: project_spark
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 11.2 CI/CD Pipeline

**GitHub Actions (.github/workflows/ci.yml):**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: password
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Generate Prisma client
        run: npx prisma generate
        
      - name: Run database migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://postgres:password@localhost:5432/test_db
      
      - name: Run tests
        run: npm run test:cov
        env:
          DATABASE_URL: postgresql://postgres:password@localhost:5432/test_db
      
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          DATABASE_URL: postgresql://postgres:password@localhost:5432/test_db

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        run: |
          echo "Deploy to production server"
          # Add deployment commands here
```

---

## Development Best Practices

### 1. Code Organization
- Use feature modules for logical separation
- Implement DTOs for all API inputs/outputs
- Use TypeScript interfaces for type safety
- Follow NestJS naming conventions

### 2. Error Handling
```typescript
// Global exception filter
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException 
      ? exception.getStatus() 
      : 500;

    const message = exception instanceof HttpException
      ? exception.getResponse()
      : 'Internal server error';

    response.status(status).json({
      success: false,
      error: {
        statusCode: status,
        message,
        timestamp: new Date().toISOString(),
        path: request.url
      }
    });
  }
}
```

### 3. Logging Strategy
```typescript
// Custom logger service
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
      new winston.transports.Console()
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

### 4. Database Optimization
```sql
-- Essential indexes for performance
CREATE INDEX CONCURRENTLY idx_student_progress_student_status 
ON student_progress(student_id, status) 
WHERE status IN ('IN_PROGRESS', 'COMPLETED');

CREATE INDEX CONCURRENTLY idx_submissions_student_recent 
ON submissions(student_id, submitted_at DESC);

CREATE INDEX CONCURRENTLY idx_earned_badges_user_recent 
ON earned_badges(user_id, earned_at DESC);

-- Partial indexes for active records
CREATE INDEX CONCURRENTLY idx_users_active_role 
ON users(role, school_id) 
WHERE is_active = true;

CREATE INDEX CONCURRENTLY idx_classes_active_teacher 
ON classes(teacher_id, grade, subject) 
WHERE is_active = true;
```

This implementation guide provides a comprehensive roadmap for building the Project Spark backend, ensuring scalability, security, and maintainability while delivering the rich features required for the gamified learning platform.