# Docker Setup Guide for InterviewAce

## Overview
This guide provides complete Docker setup instructions for the InterviewAce project, including the main application and Judge0 code execution service.

## Prerequisites
- Docker Desktop installed on your system
- Docker Compose (included with Docker Desktop)
- Git (for cloning the repository)

## Project Architecture
```
InterviewAce/
├── Next.js Application (Port 3000)
├── MongoDB Database (Port 27017)
├── Judge0 Service (Port 2358)
├── PostgreSQL (for Judge0)
└── Redis (for Judge0 job queue)
```

## Step 1: Install Docker Desktop

### Windows:
```bash
# Download Docker Desktop from https://www.docker.com/products/docker-desktop/
# Run the installer and follow the setup wizard
# Restart your computer after installation
```

### Verify Installation:
```bash
docker --version
docker-compose --version
```

## Step 2: Create Main Application Dockerfile

Create `Dockerfile` in your project root:

```dockerfile
# Use Node.js 18 Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
```

## Step 3: Create Docker Compose Configuration

Create `docker-compose.yml` in your project root:

```yaml
version: '3.8'

services:
  # Main Next.js Application
  interviewace-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/interviewace
      - NEXTAUTH_SECRET=your-secret-key-here
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - mongodb
      - judge0-server
    volumes:
      - .:/app
      - /app/node_modules
    networks:
      - interviewace-network

  # MongoDB Database
  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_DATABASE=interviewace
    volumes:
      - mongodb-data:/data/db
    networks:
      - interviewace-network

  # Judge0 Server
  judge0-server:
    image: judge0/judge0:1.13.0
    volumes:
      - ./tmp/srv/jailer/1:/tmp:exec
    privileged: true
    ports:
      - "2358:2358"
    environment:
      - REDIS_URL=redis://judge0-redis:6379
      - POSTGRES_HOST=judge0-db
      - POSTGRES_DB=judge0
      - POSTGRES_USER=judge0
      - POSTGRES_PASSWORD=YourJudge0Password
    depends_on:
      - judge0-db
      - judge0-redis
    restart: unless-stopped
    networks:
      - interviewace-network

  # Judge0 Workers
  judge0-workers:
    image: judge0/judge0:1.13.0
    command: ["./scripts/workers"]
    volumes:
      - ./tmp/srv/jailer/1:/tmp:exec
    privileged: true
    environment:
      - REDIS_URL=redis://judge0-redis:6379
      - POSTGRES_HOST=judge0-db
      - POSTGRES_DB=judge0
      - POSTGRES_USER=judge0
      - POSTGRES_PASSWORD=YourJudge0Password
    depends_on:
      - judge0-db
      - judge0-redis
    restart: unless-stopped
    networks:
      - interviewace-network

  # PostgreSQL for Judge0
  judge0-db:
    image: postgres:13.0
    environment:
      - POSTGRES_PASSWORD=YourJudge0Password
      - POSTGRES_USER=judge0
      - POSTGRES_DB=judge0
    volumes:
      - judge0-db-data:/var/lib/postgresql/data/
    restart: unless-stopped
    networks:
      - interviewace-network

  # Redis for Judge0
  judge0-redis:
    image: redis:6.0
    command: [
      "bash", "-c",
      'docker-entrypoint.sh --appendonly yes --requirepass "YourJudge0RedisPassword"'
    ]
    environment:
      - REDIS_PASSWORD=YourJudge0RedisPassword
    volumes:
      - judge0-redis-data:/data
    restart: unless-stopped
    networks:
      - interviewace-network

volumes:
  mongodb-data:
  judge0-db-data:
  judge0-redis-data:

networks:
  interviewace-network:
    driver: bridge
```

## Step 4: Create Environment Configuration

Create `.env.local` file:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/interviewace

# Authentication
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# Judge0
JUDGE0_URL=http://localhost:2358

# Gemini AI (Optional)
GEMINI_API_KEY=your-gemini-api-key-here
```

## Step 5: Docker Commands to Run

### Build and Start All Services:
```bash
# Navigate to project directory
cd /path/to/InterviewAce

# Build and start all services
docker-compose up --build -d

# View running containers
docker ps

# View logs
docker-compose logs -f
```

### Individual Service Commands:
```bash
# Start only Judge0 services
docker-compose up judge0-server judge0-workers judge0-db judge0-redis -d

# Start only MongoDB
docker-compose up mongodb -d

# Start main application
docker-compose up interviewace-app -d

# Restart a specific service
docker-compose restart interviewace-app

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This deletes data)
docker-compose down -v
```

### Development Commands:
```bash
# Run in development mode (with hot reload)
docker-compose -f docker-compose.dev.yml up --build

# Execute commands inside containers
docker-compose exec interviewace-app npm run dev
docker-compose exec mongodb mongosh

# View container logs
docker-compose logs interviewace-app
docker-compose logs judge0-server
```

### Maintenance Commands:
```bash
# Remove unused Docker resources
docker system prune -a

# View Docker resource usage
docker stats

# Backup MongoDB data
docker-compose exec mongodb mongodump --out /backup

# Restore MongoDB data
docker-compose exec mongodb mongorestore /backup
```

## Step 6: Verification

### Check if services are running:
```bash
# Check all containers
docker-compose ps

# Test main application
curl http://localhost:3000

# Test Judge0 API
curl http://localhost:2358/about

# Test MongoDB connection
docker-compose exec mongodb mongosh --eval "db.adminCommand('ismaster')"
```

## Benefits of Using Docker for InterviewAce

### 1. **Consistent Environment**
- Same environment across development, testing, and production
- Eliminates "works on my machine" issues
- Ensures all team members use identical setups

### 2. **Easy Setup & Deployment**
- One command setup: `docker-compose up`
- No need to install Node.js, MongoDB, PostgreSQL, Redis individually
- Simplified deployment to any Docker-compatible platform

### 3. **Isolation & Security**
- Each service runs in isolated containers
- Judge0 code execution is sandboxed
- Database and application are separated
- No conflicts with host system

### 4. **Scalability**
- Easy to scale individual services
- Can run multiple Judge0 workers for high load
- Load balancing capabilities
- Horizontal scaling support

### 5. **Development Benefits**
- Hot reload support in development
- Easy debugging with container logs
- Quick service restarts
- Version control for infrastructure

### 6. **Production Ready**
- Built-in health checks
- Automatic service restart
- Volume persistence for data
- Network isolation between services

### 7. **Resource Management**
- Controlled resource allocation
- Memory and CPU limits
- Efficient resource utilization
- Easy monitoring

### 8. **Backup & Recovery**
- Simple data backup with volumes
- Easy disaster recovery
- Version rollback capabilities
- Data persistence across container restarts

## Troubleshooting

### Common Issues:

1. **Port Conflicts:**
```bash
# Check what's using port 3000
netstat -ano | findstr :3000
# Kill the process or change port in docker-compose.yml
```

2. **Permission Issues:**
```bash
# Fix file permissions
docker-compose exec interviewace-app chown -R node:node /app
```

3. **Memory Issues:**
```bash
# Increase Docker memory limit in Docker Desktop settings
# Or add memory limits to docker-compose.yml
```

4. **Judge0 Not Working:**
```bash
# Check Judge0 logs
docker-compose logs judge0-server
# Restart Judge0 services
docker-compose restart judge0-server judge0-workers
```

## Production Deployment

### Using Docker Swarm:
```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml interviewace

# Scale services
docker service scale interviewace_judge0-workers=3
```

### Using Kubernetes:
```bash
# Convert docker-compose to k8s
kompose convert

# Deploy to k8s
kubectl apply -f .
```

This Docker setup provides a complete, production-ready environment for your InterviewAce project with all necessary services containerized and orchestrated.
