import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getDatabase } from './mongodb'
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
  const db = await getDatabase()
  const users = db.collection<User>('users')

  // Check if user already exists
  const existingUser = await users.findOne({ email: userData.email })
  if (existingUser) {
    throw new Error('User already exists')
  }

  const hashedPassword = await hashPassword(userData.password)
  const now = new Date()

  const user: User = {
    email: userData.email,
    password: hashedPassword,
    firstName: userData.firstName,
    lastName: userData.lastName,
    createdAt: now,
    updatedAt: now,
    
    // Personal Information
    profile: {
      displayName: `${userData.firstName} ${userData.lastName}`,
      languages: ['English']
    },
    
    // Professional Information
    professional: {
      experience: 'fresher',
      skills: [],
      education: [],
      certifications: []
    },
    
    // Social Links
    socialLinks: {},
    
    // Preferences and Settings
    preferences: {
      theme: 'system',
      fontSize: 'medium',
      autoRun: false,
      notifications: {
        email: true,
        push: true,
        reminders: true,
        achievements: true,
        weeklyProgress: true
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: false,
        showPhone: false,
        showLocation: true,
        showExperience: true
      },
      coding: {
        preferredLanguage: 'javascript',
        editorTheme: 'vs-dark',
        fontSize: 14,
        tabSize: 2,
        wordWrap: true,
        minimap: true
      }
    },
    
    // Account Status and Verification
    status: {
      isVerified: false,
      isActive: true,
      isPremium: false,
      lastProfileUpdate: now
    },
    
    // Activity and Engagement
    activity: {
      loginStreak: 1,
      lastActiveAt: now,
      totalLoginDays: 1,
      profileCompleteness: 25, // Basic info filled
      achievements: []
    }
  }

  const result = await users.insertOne(user)
  return { ...user, _id: result.insertedId }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const db = await getDatabase()
  const users = db.collection<User>('users')

  const user = await users.findOne({ email })
  if (!user) {
    return null
  }

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) {
    return null
  }

  // Update last login
  await users.updateOne(
    { _id: user._id },
    { 
      $set: { 
        lastLoginAt: new Date(),
        updatedAt: new Date()
      }
    }
  )

  return user
}

export async function getUserById(userId: string): Promise<User | null> {
  const db = await getDatabase()
  const users = db.collection<User>('users')
  
  return users.findOne({ _id: new ObjectId(userId) })
}

export async function createSession(userId: string, ipAddress?: string, userAgent?: string): Promise<string> {
  const db = await getDatabase()
  const sessions = db.collection<UserSession>('userSessions')

  const sessionToken = generateToken(userId)
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days

  const session: UserSession = {
    userId: new ObjectId(userId),
    sessionToken,
    expiresAt,
    createdAt: now,
    lastAccessedAt: now,
    ipAddress,
    userAgent
  }

  await sessions.insertOne(session)
  return sessionToken
}

export async function validateSession(sessionToken: string): Promise<User | null> {
  const db = await getDatabase()
  const sessions = db.collection<UserSession>('userSessions')

  const session = await sessions.findOne({
    sessionToken,
    expiresAt: { $gt: new Date() }
  })

  if (!session) {
    return null
  }

  // Update last accessed
  await sessions.updateOne(
    { _id: session._id },
    { $set: { lastAccessedAt: new Date() } }
  )

  return getUserById(session.userId.toString())
}

export async function deleteSession(sessionToken: string): Promise<void> {
  const db = await getDatabase()
  const sessions = db.collection<UserSession>('userSessions')
  
  await sessions.deleteOne({ sessionToken })
}
