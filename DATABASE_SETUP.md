# Database Setup Guide

This guide will help you set up the MongoDB database for the InterviewAce application.

## Prerequisites

- MongoDB Atlas account (recommended) or local MongoDB installation
- Node.js and npm/yarn installed

## Database Setup

### Option 1: MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster

2. **Get Connection String**
   - In your Atlas dashboard, click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

3. **Set Environment Variables**
   Update your `.env.local` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/interviewace?retryWrites=true&w=majority
   ```

### Option 2: Local MongoDB Installation

1. **Install MongoDB**

   **On macOS (using Homebrew):**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb/brew/mongodb-community
   ```

   **On Ubuntu/Debian:**
   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   ```

   **On Windows:**
   Download and install from [MongoDB official website](https://www.mongodb.com/try/download/community)

2. **Set Environment Variables**
   Update your `.env.local` file:
   ```
   MONGODB_URI=mongodb://localhost:27017/interviewace
   ```

### 3. Install Dependencies

```bash
npm install
# or
yarn install
```

### 4. Initialize Database

The database will be automatically initialized when you first run the application. You can also manually initialize it by creating an API route or running the initialization script.

## Database Schema Overview

The database includes the following main tables:

### User Progress Tracking
- `users` - User account information
- `user_progress_stats` - Overall progress statistics
- `user_activity_log` - Daily activity tracking

### Aptitude Tests
- `aptitude_categories` - Test categories (General, Verbal, Technical, etc.)
- `aptitude_questions` - Question bank
- `user_aptitude_sessions` - Test sessions
- `user_aptitude_answers` - Individual question responses

### Coding Practice
- `coding_categories` - Problem categories (Arrays, Strings, etc.)
- `coding_problems` - Problem statements and test cases
- `user_coding_submissions` - Code submissions
- `user_problem_progress` - Problem-wise progress tracking

### Interview Practice
- `interview_types` - Interview types (Technical, Behavioral, etc.)
- `interview_questions` - Question bank
- `user_interview_sessions` - Interview sessions
- `user_interview_responses` - Individual responses

## Features Enabled

### 1. Aptitude Test Progress
- Track test sessions with timing
- Store individual question responses
- Calculate scores and accuracy
- Maintain test history

### 2. Coding Practice Progress
- Track all code submissions
- Mark problems as solved/attempted
- Store best solutions
- Track execution time and memory usage
- Maintain submission history per problem

### 3. Interview Progress
- Track interview sessions
- Store responses with ratings
- Calculate overall performance
- Maintain interview history

### 4. Dashboard Analytics
- Live statistics on dashboard
- Activity streaks and study time
- Progress across all categories
- Recent activity history

## API Endpoints

The following API endpoints are available for progress tracking:

### Aptitude Tests
- `POST /api/progress/aptitude` - Start test session
- `PUT /api/progress/aptitude` - Submit test results
- `GET /api/progress/aptitude?userId=xxx` - Get test history

### Coding Practice
- `POST /api/progress/coding` - Submit code solution
- `GET /api/progress/coding?userId=xxx` - Get submission history
- `GET /api/progress/coding?userId=xxx&problemId=yyy` - Get problem-specific history

### Interview Practice
- `POST /api/progress/interview` - Start interview session
- `PUT /api/progress/interview` - Submit interview response
- `PATCH /api/progress/interview` - Complete interview session

### Dashboard Stats
- `GET /api/progress/stats?userId=xxx` - Get comprehensive progress stats

## Usage in Components

Use the `useProgress` hook in your React components:

```typescript
import { useProgress } from '@/hooks/use-progress'

function MyComponent() {
  const { 
    stats, 
    activityHistory, 
    loading, 
    submitCode, 
    submitAptitudeTest 
  } = useProgress()

  // Access live stats
  console.log(stats?.coding_problems_solved)
  
  // Submit code
  await submitCode({
    problemId: 'problem-123',
    programmingLanguage: 'javascript',
    sourceCode: 'console.log("Hello World")',
    status: 'accepted',
    testCasesPassed: 5,
    totalTestCases: 5
  })
}
```

## Troubleshooting

### Connection Issues
1. Ensure PostgreSQL is running: `sudo systemctl status postgresql`
2. Check if the database exists: `psql -l`
3. Verify user permissions: `psql -U interviewace_user -d interviewace`

### Schema Issues
1. Drop and recreate database if needed:
   ```sql
   DROP DATABASE interviewace;
   CREATE DATABASE interviewace;
   ```
2. Re-run the schema file

### Performance
1. The schema includes indexes for better performance
2. Consider adding more indexes based on your query patterns
3. Monitor query performance and optimize as needed

## Security Notes

1. Use strong passwords for database users
2. Limit database user permissions in production
3. Use SSL connections in production
4. Regularly backup your database
5. Keep PostgreSQL updated

## Backup and Restore

### Backup
```bash
pg_dump -U interviewace_user -d interviewace > backup.sql
```

### Restore
```bash
psql -U interviewace_user -d interviewace < backup.sql
```