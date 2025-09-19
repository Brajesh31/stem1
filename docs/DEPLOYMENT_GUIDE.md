# Project Spark - Production Deployment Guide

## Overview

This guide covers the complete deployment strategy for Project Spark, from development environment setup to production deployment with monitoring, scaling, and maintenance procedures.

---

## 1. Infrastructure Requirements

### Minimum System Requirements

**Production Server:**
- **CPU**: 4 cores (8 recommended)
- **RAM**: 8GB (16GB recommended)
- **Storage**: 100GB SSD (500GB recommended)
- **Network**: 1Gbps connection
- **OS**: Ubuntu 22.04 LTS or CentOS 8

**Database Server:**
- **CPU**: 2 cores (4 recommended)
- **RAM**: 4GB (8GB recommended)
- **Storage**: 50GB SSD with backup storage
- **Network**: Low latency connection to app server

**Redis Cache:**
- **CPU**: 1 core (2 recommended)
- **RAM**: 2GB (4GB recommended)
- **Storage**: 10GB SSD

### Cloud Provider Recommendations

**AWS Configuration:**
```yaml
Application Server: EC2 t3.large (2 vCPU, 8GB RAM)
Database: RDS PostgreSQL db.t3.medium
Cache: ElastiCache Redis cache.t3.micro
Load Balancer: Application Load Balancer
Storage: S3 for file uploads
CDN: CloudFront for static assets
```

**Azure Configuration:**
```yaml
Application Server: Standard B2s (2 vCPU, 4GB RAM)
Database: Azure Database for PostgreSQL Flexible Server
Cache: Azure Cache for Redis Basic C1
Load Balancer: Azure Load Balancer
Storage: Azure Blob Storage
CDN: Azure CDN
```

---

## 2. Environment Setup

### 2.1 Development Environment

**Prerequisites:**
```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Docker and Docker Compose
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Install PostgreSQL client
sudo apt-get install postgresql-client
```

**Local Development Setup:**
```bash
# Clone repository
git clone https://github.com/your-org/project-spark-backend.git
cd project-spark-backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your local configuration

# Start development services
docker-compose up -d postgres redis

# Run database migrations
npx prisma migrate dev

# Seed database with initial data
npx prisma db seed

# Start development server
npm run start:dev
```

**Environment Variables (.env):**
```bash
# Application
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000
CLIENT_URL=http://localhost:5173

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/project_spark
DB_HOST=localhost
DB_PORT=5432
DB_NAME=project_spark
DB_USER=postgres
DB_PASSWORD=password

# Redis
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Monitoring
LOG_LEVEL=info
ENABLE_METRICS=true

# External Services
TRANSLATION_API_KEY=your-translation-api-key
STORAGE_PROVIDER=local
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=project-spark-uploads
```

### 2.2 Production Environment

**Production Environment Variables:**
```bash
# Application
NODE_ENV=production
PORT=3000
API_URL=https://api.projectspark.edu
CLIENT_URL=https://app.projectspark.edu

# Database (use connection pooling)
DATABASE_URL=postgresql://username:password@db-host:5432/project_spark?connection_limit=20&pool_timeout=20
DB_SSL=true

# Redis (use cluster for high availability)
REDIS_URL=redis://redis-cluster:6379
REDIS_CLUSTER_NODES=redis1:6379,redis2:6379,redis3:6379

# Security
JWT_SECRET=super-secure-random-key-256-bits
ARGON2_MEMORY_COST=65536
ARGON2_TIME_COST=3
ARGON2_PARALLELISM=4

# File Storage (use cloud storage)
STORAGE_PROVIDER=aws
AWS_S3_BUCKET=project-spark-production
CDN_URL=https://cdn.projectspark.edu

# Monitoring
LOG_LEVEL=warn
ENABLE_METRICS=true
SENTRY_DSN=your-sentry-dsn
NEW_RELIC_LICENSE_KEY=your-newrelic-key

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_MAX=5
```

---

## 3. Database Setup and Migration

### 3.1 Production Database Setup

**PostgreSQL Configuration (postgresql.conf):**
```sql
# Memory settings
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB

# Connection settings
max_connections = 100
listen_addresses = '*'

# Performance settings
random_page_cost = 1.1
effective_io_concurrency = 200

# Logging
log_statement = 'mod'
log_min_duration_statement = 1000
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '

# Backup settings
wal_level = replica
archive_mode = on
archive_command = 'cp %p /var/lib/postgresql/archive/%f'
```

**Database Initialization Script:**
```bash
#!/bin/bash
# setup-production-db.sh

set -e

echo "Setting up Project Spark production database..."

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE project_spark;
CREATE USER spark_app WITH ENCRYPTED PASSWORD '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON DATABASE project_spark TO spark_app;
ALTER USER spark_app CREATEDB;
EOF

# Run migrations
export DATABASE_URL="postgresql://spark_app:${DB_PASSWORD}@localhost:5432/project_spark"
npx prisma migrate deploy

# Seed initial data
npx prisma db seed

echo "Database setup complete!"
```

### 3.2 Migration Strategy

**Migration Workflow:**
```bash
# Create new migration
npx prisma migrate dev --name add_new_feature

# Review migration files
cat prisma/migrations/*/migration.sql

# Deploy to staging
npx prisma migrate deploy

# Deploy to production (with backup)
./scripts/backup-db.sh
npx prisma migrate deploy
```

**Backup Script (scripts/backup-db.sh):**
```bash
#!/bin/bash
# Database backup script

BACKUP_DIR="/var/backups/project-spark"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
pg_dump $DATABASE_URL > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Upload to cloud storage (optional)
aws s3 cp $BACKUP_FILE.gz s3://project-spark-backups/

# Clean old backups (keep last 30 days)
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE.gz"
```

---

## 4. Application Deployment

### 4.1 Production Build

**Build Script (scripts/build-production.sh):**
```bash
#!/bin/bash
# Production build script

set -e

echo "Building Project Spark for production..."

# Install dependencies
npm ci --only=production

# Generate Prisma client
npx prisma generate

# Build application
npm run build

# Run tests
npm run test

# Security audit
npm audit --audit-level high

echo "Production build complete!"
```

### 4.2 Process Management with PM2

**PM2 Configuration (ecosystem.config.js):**
```javascript
module.exports = {
  apps: [
    {
      name: 'project-spark-api',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024'
    }
  ]
};
```

**PM2 Deployment Commands:**
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup

# Monitor application
pm2 monit

# View logs
pm2 logs project-spark-api

# Restart application
pm2 restart project-spark-api

# Graceful reload (zero downtime)
pm2 reload project-spark-api
```

### 4.3 Nginx Configuration

**Nginx Configuration (/etc/nginx/sites-available/project-spark):**
```nginx
upstream project_spark_backend {
    least_conn;
    server 127.0.0.1:3000 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3001 max_fails=3 fail_timeout=30s;
    keepalive 32;
}

server {
    listen 80;
    server_name api.projectspark.edu;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.projectspark.edu;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.projectspark.edu/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.projectspark.edu/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=auth:10m rate=1r/s;

    # File Upload Limits
    client_max_body_size 10M;
    client_body_timeout 60s;

    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # API Routes
    location /api/v1/auth {
        limit_req zone=auth burst=5 nodelay;
        proxy_pass http://project_spark_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/v1 {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://project_spark_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket Support
    location /socket.io/ {
        proxy_pass http://project_spark_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health Check
    location /health {
        proxy_pass http://project_spark_backend;
        access_log off;
    }

    # Static Files (if serving from same domain)
    location /uploads {
        alias /var/www/project-spark/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 5. Monitoring and Logging

### 5.1 Application Monitoring

**Prometheus Configuration (prometheus.yml):**
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

scrape_configs:
  - job_name: 'project-spark-api'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'
    scrape_interval: 30s

  - job_name: 'postgres'
    static_configs:
      - targets: ['localhost:9187']

  - job_name: 'redis'
    static_configs:
      - targets: ['localhost:9121']

  - job_name: 'nginx'
    static_configs:
      - targets: ['localhost:9113']

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
```

**Alert Rules (alert_rules.yml):**
```yaml
groups:
  - name: project_spark_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors per second"

      - alert: DatabaseConnectionHigh
        expr: postgres_stat_activity_count > 80
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High database connection count"

      - alert: MemoryUsageHigh
        expr: process_resident_memory_bytes / 1024 / 1024 > 1024
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"

      - alert: DiskSpaceLow
        expr: node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"} < 0.1
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Low disk space"
```

### 5.2 Logging Configuration

**Winston Production Config:**
```typescript
// src/config/logger.config.ts
import winston from 'winston';
import 'winston-daily-rotate-file';

export const createProductionLogger = () => {
  return winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: { 
      service: 'project-spark-api',
      version: process.env.npm_package_version 
    },
    transports: [
      // Error logs
      new winston.transports.DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxSize: '20m',
        maxFiles: '30d',
        zippedArchive: true
      }),
      
      // Combined logs
      new winston.transports.DailyRotateFile({
        filename: 'logs/combined-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d',
        zippedArchive: true
      }),
      
      // Console output
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ],
    
    // Handle uncaught exceptions
    exceptionHandlers: [
      new winston.transports.File({ filename: 'logs/exceptions.log' })
    ],
    
    // Handle unhandled promise rejections
    rejectionHandlers: [
      new winston.transports.File({ filename: 'logs/rejections.log' })
    ]
  });
};
```

---

## 6. Security Configuration

### 6.1 SSL/TLS Setup

**Let's Encrypt SSL Setup:**
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d api.projectspark.edu

# Auto-renewal setup
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 6.2 Firewall Configuration

**UFW Firewall Setup:**
```bash
# Enable firewall
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Allow database access (internal only)
sudo ufw allow from 10.0.0.0/8 to any port 5432

# Allow Redis access (internal only)
sudo ufw allow from 10.0.0.0/8 to any port 6379

# Check status
sudo ufw status verbose
```

### 6.3 Security Hardening

**System Security Script (scripts/harden-system.sh):**
```bash
#!/bin/bash
# System hardening script

# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install fail2ban
sudo apt-get install fail2ban -y

# Configure fail2ban for SSH
sudo tee /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
EOF

# Restart fail2ban
sudo systemctl restart fail2ban

# Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

# Setup automatic security updates
sudo apt-get install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades

echo "System hardening complete!"
```

---

## 7. Deployment Automation

### 7.1 Deployment Script

**Automated Deployment (scripts/deploy.sh):**
```bash
#!/bin/bash
# Automated deployment script

set -e

DEPLOY_DIR="/var/www/project-spark"
BACKUP_DIR="/var/backups/project-spark"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "Starting deployment at $(date)"

# Create backup
echo "Creating backup..."
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/backup_$TIMESTAMP.tar.gz -C $DEPLOY_DIR .

# Pull latest code
echo "Pulling latest code..."
cd $DEPLOY_DIR
git pull origin main

# Install dependencies
echo "Installing dependencies..."
npm ci --only=production

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Build application
echo "Building application..."
npm run build

# Run tests
echo "Running tests..."
npm run test:e2e

# Restart application
echo "Restarting application..."
pm2 reload ecosystem.config.js --env production

# Health check
echo "Performing health check..."
sleep 10
curl -f http://localhost:3000/health || {
  echo "Health check failed! Rolling back..."
  pm2 stop project-spark-api
  tar -xzf $BACKUP_DIR/backup_$TIMESTAMP.tar.gz -C $DEPLOY_DIR
  pm2 start ecosystem.config.js --env production
  exit 1
}

echo "Deployment completed successfully at $(date)"

# Clean old backups
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete
```

### 7.2 Blue-Green Deployment

**Blue-Green Deployment Script:**
```bash
#!/bin/bash
# Blue-green deployment for zero downtime

BLUE_PORT=3000
GREEN_PORT=3001
CURRENT_ENV=$(curl -s http://localhost/health | jq -r '.environment // "blue"')

if [ "$CURRENT_ENV" = "blue" ]; then
    DEPLOY_PORT=$GREEN_PORT
    DEPLOY_ENV="green"
    CURRENT_PORT=$BLUE_PORT
else
    DEPLOY_PORT=$BLUE_PORT
    DEPLOY_ENV="blue"
    CURRENT_PORT=$GREEN_PORT
fi

echo "Deploying to $DEPLOY_ENV environment on port $DEPLOY_PORT"

# Deploy to inactive environment
PORT=$DEPLOY_PORT npm run start:prod &
DEPLOY_PID=$!

# Wait for deployment to be ready
sleep 30

# Health check on new deployment
if curl -f http://localhost:$DEPLOY_PORT/health; then
    echo "New deployment healthy, switching traffic..."
    
    # Update nginx upstream
    sed -i "s/server 127.0.0.1:$CURRENT_PORT/server 127.0.0.1:$DEPLOY_PORT/" /etc/nginx/sites-available/project-spark
    sudo nginx -s reload
    
    # Stop old deployment
    kill $(lsof -t -i:$CURRENT_PORT)
    
    echo "Deployment complete!"
else
    echo "New deployment failed health check, rolling back..."
    kill $DEPLOY_PID
    exit 1
fi
```

---

## 8. Monitoring and Alerting

### 8.1 Health Monitoring

**Health Check Service:**
```typescript
// src/health/health.service.ts
@Injectable()
export class HealthService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService
  ) {}

  async getDetailedHealth(): Promise<DetailedHealthStatus> {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkExternalServices(),
      this.checkSystemResources()
    ]);

    return {
      status: checks.every(check => check.status === 'fulfilled') ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: this.getCheckStatus(checks[0]),
        redis: this.getCheckStatus(checks[1]),
        external: this.getCheckStatus(checks[2]),
        system: this.getCheckStatus(checks[3])
      },
      metrics: await this.getSystemMetrics(),
      version: process.env.npm_package_version
    };
  }

  private async checkDatabase(): Promise<DatabaseHealth> {
    const start = Date.now();
    await this.prisma.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - start;

    const connectionCount = await this.prisma.$queryRaw`
      SELECT count(*) as count FROM pg_stat_activity WHERE state = 'active'
    `;

    return {
      status: 'healthy',
      responseTime,
      activeConnections: connectionCount[0].count
    };
  }

  private async getSystemMetrics(): Promise<SystemMetrics> {
    const memUsage = process.memoryUsage();
    
    return {
      uptime: process.uptime(),
      memory: {
        used: Math.round(memUsage.heapUsed / 1024 / 1024),
        total: Math.round(memUsage.heapTotal / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024)
      },
      cpu: await this.getCpuUsage(),
      eventLoop: {
        delay: await this.getEventLoopDelay()
      }
    };
  }
}
```

### 8.2 Error Tracking

**Sentry Integration:**
```typescript
// src/config/sentry.config.ts
import * as Sentry from '@sentry/node';

export function configureSentry(app: INestApplication): void {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.Express({ app: app.getHttpAdapter().getInstance() })
      ]
    });
  }
}

// Global exception filter with Sentry
@Catch()
export class SentryExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(exception);
    }
    
    // ... rest of exception handling
  }
}
```

---

## 9. Backup and Recovery

### 9.1 Automated Backup Strategy

**Backup Script (scripts/backup-system.sh):**
```bash
#!/bin/bash
# Comprehensive backup script

BACKUP_ROOT="/var/backups/project-spark"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$BACKUP_ROOT/$TIMESTAMP"

mkdir -p $BACKUP_DIR

echo "Starting backup at $(date)"

# Database backup
echo "Backing up database..."
pg_dump $DATABASE_URL | gzip > $BACKUP_DIR/database.sql.gz

# Application files backup
echo "Backing up application files..."
tar -czf $BACKUP_DIR/application.tar.gz -C /var/www/project-spark \
  --exclude=node_modules \
  --exclude=logs \
  --exclude=uploads \
  .

# Uploads backup
echo "Backing up user uploads..."
tar -czf $BACKUP_DIR/uploads.tar.gz -C /var/www/project-spark uploads/

# Configuration backup
echo "Backing up configuration..."
tar -czf $BACKUP_DIR/config.tar.gz \
  /etc/nginx/sites-available/project-spark \
  /etc/systemd/system/project-spark.service \
  /var/www/project-spark/.env

# Upload to cloud storage
echo "Uploading to cloud storage..."
aws s3 sync $BACKUP_DIR s3://project-spark-backups/$TIMESTAMP/

# Create backup manifest
cat > $BACKUP_DIR/manifest.json << EOF
{
  "timestamp": "$TIMESTAMP",
  "date": "$(date -Iseconds)",
  "components": {
    "database": "database.sql.gz",
    "application": "application.tar.gz",
    "uploads": "uploads.tar.gz",
    "config": "config.tar.gz"
  },
  "size": "$(du -sh $BACKUP_DIR | cut -f1)"
}
EOF

# Clean old local backups (keep last 7 days)
find $BACKUP_ROOT -maxdepth 1 -type d -mtime +7 -exec rm -rf {} \;

echo "Backup completed at $(date)"
```

### 9.2 Disaster Recovery Plan

**Recovery Script (scripts/restore-system.sh):**
```bash
#!/bin/bash
# Disaster recovery script

BACKUP_TIMESTAMP=$1
BACKUP_DIR="/var/backups/project-spark/$BACKUP_TIMESTAMP"

if [ -z "$BACKUP_TIMESTAMP" ]; then
  echo "Usage: $0 <backup_timestamp>"
  echo "Available backups:"
  ls -la /var/backups/project-spark/
  exit 1
fi

if [ ! -d "$BACKUP_DIR" ]; then
  echo "Backup not found locally, downloading from S3..."
  aws s3 sync s3://project-spark-backups/$BACKUP_TIMESTAMP/ $BACKUP_DIR/
fi

echo "Starting recovery from backup $BACKUP_TIMESTAMP"

# Stop application
echo "Stopping application..."
pm2 stop project-spark-api

# Restore database
echo "Restoring database..."
dropdb project_spark
createdb project_spark
gunzip -c $BACKUP_DIR/database.sql.gz | psql project_spark

# Restore application files
echo "Restoring application files..."
cd /var/www
rm -rf project-spark
tar -xzf $BACKUP_DIR/application.tar.gz

# Restore uploads
echo "Restoring uploads..."
tar -xzf $BACKUP_DIR/uploads.tar.gz -C /var/www/project-spark/

# Restore configuration
echo "Restoring configuration..."
tar -xzf $BACKUP_DIR/config.tar.gz -C /

# Restart services
echo "Restarting services..."
sudo systemctl reload nginx
pm2 start ecosystem.config.js --env production

# Verify recovery
echo "Verifying recovery..."
sleep 10
curl -f http://localhost:3000/health || {
  echo "Recovery verification failed!"
  exit 1
}

echo "Recovery completed successfully!"
```

---

## 10. Performance Optimization

### 10.1 Database Optimization

**Performance Tuning Script:**
```sql
-- Database performance optimization

-- Connection pooling
ALTER SYSTEM SET max_connections = 100;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET work_mem = '4MB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';

-- Query optimization
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;

-- Checkpoint settings
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';

-- Logging for monitoring
ALTER SYSTEM SET log_min_duration_statement = 1000;
ALTER SYSTEM SET log_checkpoints = on;
ALTER SYSTEM SET log_connections = on;
ALTER SYSTEM SET log_disconnections = on;

-- Apply settings
SELECT pg_reload_conf();
```

**Index Optimization:**
```sql
-- Create performance indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_student_progress_performance 
ON student_progress(student_id, status, last_accessed DESC) 
WHERE status IN ('IN_PROGRESS', 'COMPLETED');

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_submissions_performance 
ON submissions(student_id, submitted_at DESC, score DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_leaderboard_performance 
ON profiles(xp_points DESC, level DESC) 
WHERE user_id IN (SELECT id FROM users WHERE is_active = true);

-- Analyze table statistics
ANALYZE student_progress;
ANALYZE submissions;
ANALYZE profiles;
ANALYZE users;
```

### 10.2 Application Performance

**Caching Strategy:**
```typescript
// src/common/interceptors/cache.interceptor.ts
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(private redis: RedisService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const cacheKey = this.generateCacheKey(request);
    
    // Check cache
    const cachedResult = await this.redis.get(cacheKey);
    if (cachedResult) {
      return of(JSON.parse(cachedResult));
    }

    // Execute request and cache result
    return next.handle().pipe(
      tap(async (data) => {
        const ttl = this.getCacheTTL(request.url);
        await this.redis.set(cacheKey, JSON.stringify(data), ttl);
      })
    );
  }

  private generateCacheKey(request: any): string {
    const { url, user } = request;
    return `cache:${user.id}:${Buffer.from(url).toString('base64')}`;
  }

  private getCacheTTL(url: string): number {
    if (url.includes('/leaderboard')) return 300; // 5 minutes
    if (url.includes('/analytics')) return 600; // 10 minutes
    if (url.includes('/dashboard')) return 180; // 3 minutes
    return 60; // 1 minute default
  }
}
```

---

## 11. Scaling Strategy

### 11.1 Horizontal Scaling

**Load Balancer Configuration:**
```nginx
# nginx-load-balancer.conf
upstream project_spark_cluster {
    least_conn;
    server app1.internal:3000 max_fails=3 fail_timeout=30s;
    server app2.internal:3000 max_fails=3 fail_timeout=30s;
    server app3.internal:3000 max_fails=3 fail_timeout=30s;
    keepalive 32;
}

server {
    listen 443 ssl http2;
    server_name api.projectspark.edu;

    location / {
        proxy_pass http://project_spark_cluster;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Health check
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503;
        proxy_connect_timeout 5s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### 11.2 Database Scaling

**Read Replica Configuration:**
```typescript
// src/config/database.config.ts
@Injectable()
export class DatabaseService {
  private writeClient: PrismaClient;
  private readClient: PrismaClient;

  constructor() {
    this.writeClient = new PrismaClient({
      datasources: {
        db: { url: process.env.DATABASE_WRITE_URL }
      }
    });

    this.readClient = new PrismaClient({
      datasources: {
        db: { url: process.env.DATABASE_READ_URL }
      }
    });
  }

  // Use write client for mutations
  getWriteClient(): PrismaClient {
    return this.writeClient;
  }

  // Use read client for queries
  getReadClient(): PrismaClient {
    return this.readClient;
  }
}
```

---

## 12. Maintenance Procedures

### 12.1 Regular Maintenance Tasks

**Maintenance Cron Jobs:**
```bash
# Add to crontab: crontab -e

# Daily database maintenance (2 AM)
0 2 * * * /var/www/project-spark/scripts/daily-maintenance.sh

# Weekly full backup (Sunday 3 AM)
0 3 * * 0 /var/www/project-spark/scripts/weekly-backup.sh

# Monthly analytics aggregation (1st of month, 4 AM)
0 4 1 * * /var/www/project-spark/scripts/monthly-analytics.sh

# Log rotation (daily at 1 AM)
0 1 * * * /usr/sbin/logrotate /etc/logrotate.d/project-spark
```

**Daily Maintenance Script:**
```bash
#!/bin/bash
# Daily maintenance tasks

echo "Starting daily maintenance at $(date)"

# Database maintenance
echo "Running database maintenance..."
psql $DATABASE_URL << EOF
-- Update statistics
ANALYZE;

-- Clean old notifications (30 days)
DELETE FROM user_notifications 
WHERE created_at < CURRENT_DATE - INTERVAL '30 days' 
AND is_read = true;

-- Clean old sync logs (7 days)
DELETE FROM sync_logs 
WHERE created_at < CURRENT_DATE - INTERVAL '7 days' 
AND status IN ('COMPLETED', 'FAILED');

-- Update leaderboard cache
REFRESH MATERIALIZED VIEW CONCURRENTLY class_performance_summary;
EOF

# Clear old logs
echo "Cleaning old logs..."
find /var/www/project-spark/logs -name "*.log" -mtime +30 -delete

# Clear Redis cache of expired keys
echo "Cleaning Redis cache..."
redis-cli FLUSHDB

# Check disk space
echo "Checking disk space..."
df -h | grep -E "(/$|/var)" | awk '{if($5+0 > 80) print "WARNING: " $0}'

echo "Daily maintenance completed at $(date)"
```

### 12.2 Update Procedures

**Application Update Script:**
```bash
#!/bin/bash
# Safe application update procedure

echo "Starting application update..."

# Pre-update checks
echo "Running pre-update checks..."
npm run test
npm audit --audit-level high

# Create backup
echo "Creating pre-update backup..."
./scripts/backup-system.sh

# Update dependencies
echo "Updating dependencies..."
npm update
npm audit fix

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Rebuild application
echo "Rebuilding application..."
npm run build

# Restart with health check
echo "Restarting application..."
pm2 reload ecosystem.config.js --env production

# Verify update
sleep 15
curl -f http://localhost:3000/health || {
  echo "Update verification failed! Check logs."
  exit 1
}

echo "Application update completed successfully!"
```

---

## 13. Troubleshooting Guide

### 13.1 Common Issues

**Database Connection Issues:**
```bash
# Check database status
sudo systemctl status postgresql

# Check connections
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"

# Check locks
psql $DATABASE_URL -c "SELECT * FROM pg_locks WHERE NOT granted;"

# Kill long-running queries
psql $DATABASE_URL -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'active' AND query_start < now() - interval '5 minutes';"
```

**Memory Issues:**
```bash
# Check memory usage
free -h
ps aux --sort=-%mem | head -10

# Check Node.js heap usage
curl http://localhost:3000/health | jq '.metrics.memory'

# Restart application if memory usage high
pm2 restart project-spark-api
```

**Performance Issues:**
```bash
# Check slow queries
psql $DATABASE_URL -c "SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"

# Check Redis performance
redis-cli --latency-history -i 1

# Check application metrics
curl http://localhost:3000/metrics
```

### 13.2 Emergency Procedures

**Emergency Rollback:**
```bash
#!/bin/bash
# Emergency rollback procedure

BACKUP_TIMESTAMP=$1

if [ -z "$BACKUP_TIMESTAMP" ]; then
  echo "Usage: $0 <backup_timestamp>"
  exit 1
fi

echo "EMERGENCY ROLLBACK INITIATED"
echo "Rolling back to backup: $BACKUP_TIMESTAMP"

# Stop application
pm2 stop project-spark-api

# Restore from backup
./scripts/restore-system.sh $BACKUP_TIMESTAMP

# Verify restoration
curl -f http://localhost:3000/health || {
  echo "ROLLBACK FAILED - MANUAL INTERVENTION REQUIRED"
  exit 1
}

echo "EMERGENCY ROLLBACK COMPLETED"
```

This comprehensive deployment guide ensures that Project Spark can be deployed securely, monitored effectively, and maintained reliably in production environments while supporting the platform's mission to transform rural education through gamified learning.