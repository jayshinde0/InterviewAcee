import { ObjectId } from 'mongodb';

// Core User Profile Interfaces
export interface UserProfile {
  displayName: string;
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  profilePhoto?: string;
  skills: string[];
  preferredLanguages: string[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
  description?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  isCurrent: boolean;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  startDate: Date;
  endDate?: Date;
}

// User Preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  pushNotifications: boolean;
  privacy: {
    profileVisibility: 'public' | 'connections' | 'private';
    showEmail: boolean;
    showPhone: boolean;
  };
  notificationPreferences: {
    newMessage: boolean;
    systemUpdates: boolean;
  };
  language: string;
  timezone: string;
}

// User Statistics
export interface UserStats {
  problemsSolved: number;
  problemsAttempted: number;
  successRate: number;
  totalSubmissions: number;
  totalTimeSpent: number;
  streak: number;
  lastActive: Date;
  rank?: number;
  badges: string[];
  points: number;
  achievements: string[];
}

// User Settings
export interface UserSettings {
  email: string;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: Date;
    loginHistory: LoginHistory[];
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'connections';
    showEmail: boolean;
    showPhone: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
}

export interface LoginHistory {
  date: Date;
  ipAddress: string;
  device: string;
  location: string;
}

// Main User Interface
export interface User {
  // Core User Data
  _id?: ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'user' | 'admin' | 'moderator';
  
  // Authentication
  emailVerified?: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  
  // Status
  status: 'active' | 'inactive' | 'suspended';
  isActive?: boolean;
  isBanned?: boolean;
  banReason?: string;
  
  // Profile
  profile?: UserProfile;
  
  // Preferences and Settings
  preferences?: UserPreferences;
  settings?: UserSettings;
  
  // Stats and Progress
  stats?: UserStats;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  lastProfileUpdate?: Date;
  
  // Contact Information
  phone?: string;
  
  // Additional Metadata
  metadata?: Record<string, any>;
  
  // Security
  loginAttempts?: number;
  lockUntil?: Date;
  lastPasswordChange?: Date;
  
  // Profile Completeness
  profileCompleteness?: number;
  
  // External IDs
  externalIds?: Record<string, string>;
}

// User Session Interface
export interface UserSession {
  _id?: ObjectId;
  userId: ObjectId;
  token: string;
  ipAddress: string;
  userAgent: string;
  expiresAt: Date;
  lastActiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// User Progress Interface
export interface UserProgress {
  _id?: ObjectId;
  userId: ObjectId;
  problemId: number;
  status: 'solved' | 'attempted' | 'unsolved';
  isCorrect: boolean;
  attempts: number;
  lastAttemptAt: Date;
  bestSubmission?: {
    code: string;
    language: string;
    executionTime: number;
    memory: number;
    submittedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Code Submission Interface
export interface CodeSubmission {
  _id?: ObjectId;
  userId: ObjectId;
  problemId?: number;
  code: string;
  language: string;
  input?: string;
  output?: string;
  status: string;
  executionTime?: number;
  memory?: number;
  testResults?: Array<{
    testCase: number;
    passed: boolean;
    expected: string;
    actual: string;
    error?: string;
  }>;
  isPlayground: boolean;
  submittedAt: Date;
}

// Aptitude Progress Interface
export interface AptitudeProgress {
  _id?: ObjectId;
  userId: ObjectId;
  questionId: string;
  category: string;
  solved: boolean;
  correct: boolean;
  attemptedAt: Date;
  timeSpent: number;
  selectedAnswer?: string;
  correctAnswer?: string;
}

// Aptitude Test Progress Interface
export interface AptitudeTestProgress {
  _id?: ObjectId;
  userId: ObjectId;
  testId: string;
  testName: string;
  category: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  timeSpent: number;
  score: number;
  completedAt: Date;
  questionResults: Array<{
    questionId: string;
    selectedAnswer?: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
  }>;
}
