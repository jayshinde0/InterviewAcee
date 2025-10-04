import { MongoClient, Db } from 'mongodb'

let client: MongoClient
let db: Db

// MongoDB connection configuration
export async function connectToDatabase() {
  if (db) {
    return { client, db }
  }

  try {
    const options = {
      // Connection pool settings to prevent connection limit issues
      maxPoolSize: 10, // Limit connection pool size
      minPoolSize: 2,
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      
      // SSL settings
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
      
      // Retry settings
      retryWrites: true,
      retryReads: true,
    }
    
    client = new MongoClient(process.env.MONGODB_URI!, options)
    await client.connect()
    db = client.db('interviewace_clean') // Use clean database
    
    console.log('Connected to MongoDB with connection pooling')
    return { client, db }
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw error
  }
}

// Get database instance
export async function getDatabase() {
  if (!db) {
    await connectToDatabase()
  }
  return db
}

// Close database connection (useful for cleanup)
export async function closeDatabaseConnection() {
  if (client) {
    await client.close()
    client = null as any
    db = null as any
    console.log('MongoDB connection closed')
  }
}

// Health check function
export async function checkDatabaseHealth() {
  try {
    const database = await getDatabase()
    await database.admin().ping()
    return { healthy: true, message: 'Database connection is healthy' }
  } catch (error) {
    console.error('Database health check failed:', error)
    return { healthy: false, message: 'Database connection failed', error }
  }
}