import { getDatabase } from './connection'
import { Collections } from './models'

// Initialize MongoDB collections and indexes
export async function initializeDatabase() {
  const db = await getDatabase()

  try {
    // Create indexes for better performance
    
    // User Aptitude Sessions indexes
    await db.collection(Collections.USER_APTITUDE_SESSIONS).createIndex({ userId: 1 })
    await db.collection(Collections.USER_APTITUDE_SESSIONS).createIndex({ categoryId: 1 })
    await db.collection(Collections.USER_APTITUDE_SESSIONS).createIndex({ userId: 1, status: 1 })

    // User Aptitude Answers indexes
    await db.collection(Collections.USER_APTITUDE_ANSWERS).createIndex({ sessionId: 1 })

    // User Coding Submissions indexes
    await db.collection(Collections.USER_CODING_SUBMISSIONS).createIndex({ userId: 1 })
    await db.collection(Collections.USER_CODING_SUBMISSIONS).createIndex({ problemId: 1 })
    await db.collection(Collections.USER_CODING_SUBMISSIONS).createIndex({ userId: 1, problemId: 1 })

    // User Problem Progress indexes
    await db.collection(Collections.USER_PROBLEM_PROGRESS).createIndex({ userId: 1 })
    await db.collection(Collections.USER_PROBLEM_PROGRESS).createIndex({ userId: 1, problemId: 1 }, { unique: true })

    // User Interview Sessions indexes
    await db.collection(Collections.USER_INTERVIEW_SESSIONS).createIndex({ userId: 1 })

    // User Progress Stats indexes
    await db.collection(Collections.USER_PROGRESS_STATS).createIndex({ userId: 1 }, { unique: true })

    // User Activity Log indexes
    await db.collection(Collections.USER_ACTIVITY_LOG).createIndex({ userId: 1, activityDate: 1 })
    await db.collection(Collections.USER_ACTIVITY_LOG).createIndex({ userId: 1, activityType: 1, activityDate: 1 }, { unique: true })

    // Insert default categories if they don't exist
    await insertDefaultData(db)

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  }
}

async function insertDefaultData(db: any) {
  // Insert default aptitude categories
  const aptitudeCategories = [
    { name: 'general', description: 'General Aptitude', totalQuestions: 20, timeLimitMinutes: 20, createdAt: new Date() },
    { name: 'verbal-reasoning', description: 'Verbal & Reasoning', totalQuestions: 20, timeLimitMinutes: 20, createdAt: new Date() },
    { name: 'current-affairs', description: 'Current Affairs & GK', totalQuestions: 20, timeLimitMinutes: 20, createdAt: new Date() },
    { name: 'technical-mcqs', description: 'Technical MCQs', totalQuestions: 20, timeLimitMinutes: 20, createdAt: new Date() },
    { name: 'interview', description: 'Interview Questions', totalQuestions: 20, timeLimitMinutes: 20, createdAt: new Date() },
    { name: 'programming', description: 'Programming Questions', totalQuestions: 20, timeLimitMinutes: 20, createdAt: new Date() }
  ]

  for (const category of aptitudeCategories) {
    await db.collection(Collections.APTITUDE_CATEGORIES).updateOne(
      { name: category.name },
      { $setOnInsert: category },
      { upsert: true }
    )
  }

  // Insert default coding categories
  const codingCategories = [
    { name: 'arrays', description: 'Array Problems', totalProblems: 0, createdAt: new Date() },
    { name: 'strings', description: 'String Manipulation', totalProblems: 0, createdAt: new Date() },
    { name: 'linked-lists', description: 'Linked List Problems', totalProblems: 0, createdAt: new Date() },
    { name: 'trees', description: 'Tree and Graph Problems', totalProblems: 0, createdAt: new Date() },
    { name: 'dynamic-programming', description: 'Dynamic Programming', totalProblems: 0, createdAt: new Date() },
    { name: 'sorting-searching', description: 'Sorting and Searching', totalProblems: 0, createdAt: new Date() },
    { name: 'mathematics', description: 'Mathematical Problems', totalProblems: 0, createdAt: new Date() },
    { name: 'greedy', description: 'Greedy Algorithms', totalProblems: 0, createdAt: new Date() }
  ]

  for (const category of codingCategories) {
    await db.collection(Collections.CODING_CATEGORIES).updateOne(
      { name: category.name },
      { $setOnInsert: category },
      { upsert: true }
    )
  }

  // Insert default interview types
  const interviewTypes = [
    { name: 'technical', description: 'Technical Interview', durationMinutes: 60, createdAt: new Date() },
    { name: 'behavioral', description: 'Behavioral Interview', durationMinutes: 45, createdAt: new Date() },
    { name: 'system-design', description: 'System Design Interview', durationMinutes: 90, createdAt: new Date() },
    { name: 'hr-round', description: 'HR Round', durationMinutes: 30, createdAt: new Date() }
  ]

  for (const type of interviewTypes) {
    await db.collection(Collections.INTERVIEW_TYPES).updateOne(
      { name: type.name },
      { $setOnInsert: type },
      { upsert: true }
    )
  }
}