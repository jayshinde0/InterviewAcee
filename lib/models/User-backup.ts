import { ObjectId } from 'mongodb'

export interface User {
  _id?: ObjectId
  email: string
  password: string
  firstName: string
  lastName: string
  bio?: string
  location?: string
  website?: string
  github?: string
  linkedin?: string
  profilePhoto?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
  
  // Personal Information
  profile: {
    displayName?: string
    bio?: string
    dateOfBirth?: Date
    gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say'
    phoneNumber?: string
    location?: {
      country?: string
      state?: string
      city?: string
      timezone?: string
    }
    languages?: string[]
  }
  
  // Professional Information
  professional: {
    title?: string
    company?: string
    experience?: 'fresher' | '0-1' | '1-3' | '3-5' | '5-10' | '10+'
    skills?: string[]
    resume?: {
      fileName?: string
      fileUrl?: string
      uploadedAt?: Date
    }
    portfolio?: {
      website?: string
      github?: string
      linkedin?: string
      projects?: Array<{
        name: string
        description: string
        technologies: string[]
        url?: string
        githubUrl?: string
      }>
    }
    education?: Array<{
      institution: string
      degree: string
      field: string
      startYear: number
      endYear?: number
      grade?: string
    }>
    certifications?: Array<{
      name: string
      issuer: string
      issueDate: Date
      expiryDate?: Date
      credentialId?: string
      url?: string
    }>
  }
  
  // Social Links
  socialLinks: {
    linkedin?: string
    github?: string
    twitter?: string
    instagram?: string
    facebook?: string
    youtube?: string
    portfolio?: string
    blog?: string
    other?: Array<{
      platform: string
      url: string
    }>
  }
  
  // Preferences and Settings
  preferences: {
    theme: 'light' | 'dark' | 'system'
    fontSize: 'small' | 'medium' | 'large'
    autoRun: boolean
    notifications: {
      email: boolean
      push: boolean
      reminders: boolean
      achievements: boolean
      weeklyProgress: boolean
    }
    privacy: {
      profileVisibility: 'public' | 'private' | 'friends'
      showEmail: boolean
      showPhone: boolean
      showLocation: boolean
      showExperience: boolean
    }
    coding: {
      preferredLanguage: 'javascript' | 'python' | 'java' | 'cpp' | 'c'
      editorTheme: 'vs-dark' | 'vs-light' | 'hc-black'
      fontSize: number
      tabSize: number
      wordWrap: boolean
      minimap: boolean
    }
  }
  
  // Account Status and Verification
  status: {
    isVerified: boolean
    isActive: boolean
    isPremium: boolean
    premiumExpiresAt?: Date
    emailVerifiedAt?: Date
    phoneVerifiedAt?: Date
    lastProfileUpdate?: Date
  }
  
  // Activity and Engagement
  activity: {
    loginStreak: number
    lastActiveAt: Date
    totalLoginDays: number
    profileCompleteness: number
    achievements: Array<{
      id: string
      name: string
      description: string
      earnedAt: Date
      category: 'coding' | 'aptitude' | 'interview' | 'profile' | 'streak'
    }>
  }
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
