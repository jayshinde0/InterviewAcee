import { getDatabase } from './connection'
import { Collections } from './models'

// Initialize MongoDB collections and indexes
export async function initializeDatabase() {
  const db = await getDatabase()

  try {
    // Create indexes for better performance

    // User Coding Submissions indexes
    await db.collection(Collections.USER_CODING_SUBMISSIONS).createIndex({ userId: 1 })
    await db.collection(Collections.USER_CODING_SUBMISSIONS).createIndex({ problemId: 1 })
    await db.collection(Collections.USER_CODING_SUBMISSIONS).createIndex({ userId: 1, problemId: 1 })

    // User Problem Progress indexes
    await db.collection(Collections.USER_PROBLEM_PROGRESS).createIndex({ userId: 1 })
    await db.collection(Collections.USER_PROBLEM_PROGRESS).createIndex({ userId: 1, problemId: 1 }, { unique: true })

    // Skip deprecated collections

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
  // Skip deprecated collections - only initialize essential collections for coding practice
  console.log('Skipping deprecated collection initialization')
}