import { ObjectId } from 'mongodb'

export interface User {
  _id?: ObjectId
  firstName: string
  lastName: string
  email: string
  password: string
  bio: string
  location: string
  website: string
  github: string
  linkedin: string
  profilePhoto: string
  createdAt: Date
  updatedAt: Date
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
