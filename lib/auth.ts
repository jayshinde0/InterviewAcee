import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getDatabase } from './dbConnect'
import { User, UserSession } from './models/User'
import { ObjectId } from 'mongodb'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}

export async function createUser(userData: {
  email: string
  password: string
  firstName: string
  lastName: string
}): Promise<User> {
  // Only connect to database when this function is called
  const db = await getDatabase()
  const users = db.collection<User>('users')

  // Check if user already exists
  const existingUser = await users.findOne({ email: userData.email.toLowerCase() })
  if (existingUser) {
    throw new Error('User already exists')
  }

  const hashedPassword = await hashPassword(userData.password)
  const now = new Date()

  const user: User = {
    email: userData.email.toLowerCase(),
    password: hashedPassword,
    firstName: userData.firstName,
    lastName: userData.lastName,
    createdAt: now,
    updatedAt: now,
    lastProfileUpdate: now,
    status: 'active',
    role: 'user',
    emailVerified: false,
    isActive: true,
    profile: {
      displayName: `${userData.firstName} ${userData.lastName}`,
      skills: [],
      preferredLanguages: ['English'],
      education: [],
      experience: [],
      projects: []
    }
  }

  const result = await users.insertOne(user)
  return { ...user, _id: result.insertedId }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  // Only connect to database when this function is called
  const db = await getDatabase()
  const user = await db.collection<User>('users').findOne({ email: email.toLowerCase() })

  if (!user) {
    return null
  }

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) {
    return null
  }

  // Update last login
  await db.collection<User>('users').updateOne(
    { _id: user._id },
    { 
      $set: { 
        lastLoginAt: new Date(),
        updatedAt: new Date()
      }
    }
  )

  // Remove password before returning
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword as User
}

export async function getUserById(userId: string): Promise<User | null> {
  // Only connect to database when this function is called
  const db = await getDatabase()
  return db.collection<User>('users').findOne({ _id: new ObjectId(userId) })
}

export async function createSession(userId: string, ipAddress?: string, userAgent?: string): Promise<string> {
  // Only connect to database when this function is called
  const db = await getDatabase()
  const sessions = db.collection<UserSession>('sessions')
  
  const sessionToken = generateToken(userId)
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days

  await sessions.insertOne({
    userId: new ObjectId(userId),
    sessionToken,
    expiresAt,
    createdAt: now,
    lastAccessedAt: now,
    ipAddress,
    userAgent
  })

  return sessionToken
}

export async function validateSession(sessionToken: string): Promise<User | null> {
  // Only connect to database when this function is called
  const db = await getDatabase()
  const sessions = db.collection<UserSession>('sessions')
  const users = db.collection<User>('users')
  
  const session = await sessions.findOne({
    sessionToken,
    expiresAt: { $gt: new Date() }
  })

  if (!session) {
    return null
  }

  // Update last accessed time
  await sessions.updateOne(
    { _id: session._id },
    { $set: { lastAccessedAt: new Date() } }
  )

  return users.findOne({ _id: session.userId })
}

export async function deleteSession(sessionToken: string): Promise<void> {
  // Only connect to database when this function is called
  const db = await getDatabase()
  await db.collection<UserSession>('sessions').deleteOne({ sessionToken })
}
