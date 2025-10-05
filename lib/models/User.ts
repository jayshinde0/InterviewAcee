import { ObjectId } from 'mongodb'

export interface UserProfile {
  displayName: string
  bio?: string
  location?: string
  website?: string
  github?: string
  linkedin?: string
  profilePhoto?: string
  skills: string[]
  preferredLanguages: string[]
  education: Array<{
    institution: string
    degree: string
    field: string
    startYear: number
    endYear?: number
    description?: string
  }>
  experience: Array<{
    company: string
    position: string
    startDate: Date
    endDate?: Date
    description?: string
    isCurrent: boolean
  }>
  projects: Array<{
    name: string
    description: string
    technologies: string[]
    url?: string
    startDate: Date
    endDate?: Date
  }>
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  emailNotifications: boolean
  pushNotifications: boolean
  privacy: {
    profileVisibility: 'public' | 'connections' | 'private'
    showEmail: boolean
    showPhone: boolean
  }
  notificationPreferences: {
    newMessage: boolean
    systemUpdates: boolean
    newConnection: boolean
    newsletter: boolean
  }
}

export interface UserStats {
  problemsSolved: number
  problemsAttempted: number
  successRate: number
  totalSubmissions: number
  totalTimeSpent: number // in minutes
  streak: number
  lastActive: Date
  rank?: number
  badges: string[]
  points: number
  achievements: string[]
}

export interface UserSettings {
  email: string
  notificationPreferences: {
    email: boolean
    push: boolean
    inApp: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'private' | 'connections'
    showEmail: boolean
    showPhone: boolean
  }
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  twoFactorEnabled: boolean
  lastPasswordChange: Date
  lastLogin: Date
  loginHistory: Array<{
    date: Date
    ipAddress: string
    device: string
    location: string
  }>
  connectedAccounts: {
    google?: string
    github?: string
    linkedin?: string
  }
  subscription: {
    plan: 'free' | 'pro' | 'enterprise'
    status: 'active' | 'canceled' | 'expired'
    startDate: Date
    endDate?: Date
    autoRenew: boolean
    paymentMethod?: {
      type: string
      last4?: string
      expiry?: string
    }
  }
  notifications: Array<{
    id: string
    type: string
    title: string
    message: string
    read: boolean
    createdAt: Date
    link?: string
  }>
  security: {
    lastPasswordChange: Date
    lastLogin: Date
    loginHistory: Array<{
      date: Date
      ipAddress: string
      device: string
      location: string
    }>
    twoFactorEnabled: boolean
    backupCodes?: string[]
  }
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: string
    timezone: string
    emailNotifications: boolean
    pushNotifications: boolean
  }
  profileCompleteness: number
}

export interface User {
  _id?: ObjectId
  firstName: string
  lastName: string
  email: string
  password: string
  role?: 'user' | 'admin' | 'moderator'
  emailVerified?: boolean
  verificationToken?: string
  resetPasswordToken?: string
  resetPasswordExpires?: Date
  lastLoginAt?: Date
  isActive?: boolean
  isBanned?: boolean
  banReason?: string
  profile?: UserProfile
  preferences?: UserPreferences
  stats?: UserStats
  settings?: UserSettings
  createdAt: Date
  updatedAt: Date
  lastProfileUpdate?: Date
  status: 'active' | 'inactive' | 'suspended'
  profileCompleteness: number
  achievements: string[]
}

export interface UserProgress {
  _id?: ObjectId
  userId: ObjectId
  problemId: number
  status: 'solved' | 'attempted' | 'unsolved'
  isCorrect: boolean
  attempts: number
  lastAttemptAt: Date
  bestSubmission?: {
    code: string
    language: string
    executionTime: number
    memory: number
    submittedAt: Date
  }
  createdAt: Date
  updatedAt: Date
}

export interface CodeSubmission {
  _id?: ObjectId
  userId: ObjectId
  problemId?: number // null for playground submissions
  code: string
  language: string
  input?: string
  output?: string
  status: string
  executionTime?: number
  memory?: number
  testResults?: Array<{
    testCase: number
    passed: boolean
    expected: string
    actual: string
    error?: string
  }>
  isPlayground: boolean
  submittedAt: Date
}

export interface AptitudeProgress {
  _id?: ObjectId
  userId: ObjectId
  questionId: string
  category: string
  solved: boolean
  correct: boolean
  attemptedAt: Date
  timeSpent: number // in seconds
  selectedAnswer?: string
  correctAnswer?: string
}

export interface AptitudeTestProgress {
  _id?: ObjectId
  userId: ObjectId
  testId: string
  testName: string
  category: string
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  skippedQuestions: number
  timeSpent: number // in seconds
  score: number // percentage
  completedAt: Date
  questionResults: Array<{
    questionId: string
    selectedAnswer?: string
    correctAnswer: string
    isCorrect: boolean
    timeSpent: number
  }>
}

export interface UserSession {
  _id?: ObjectId
  userId: ObjectId
  sessionToken: string
  expiresAt: Date
  createdAt: Date
  lastAccessedAt: Date
  ipAddress?: string
  userAgent?: string
}