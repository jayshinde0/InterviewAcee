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
  phone?: string
  dateOfBirth?: Date
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say'
  address?: {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
  }
  socialLinks?: {
    twitter?: string
    facebook?: string
    instagram?: string
    github?: string
    linkedin?: string
    website?: string
  }
  notificationSettings?: {
    email: boolean
    push: boolean
    inApp: boolean
    marketing: boolean
    productUpdates: boolean
    securityAlerts: boolean
  }
  securitySettings?: {
    twoFactorEnabled: boolean
    loginAlerts: boolean
    suspiciousActivityAlerts: boolean
    deviceManagement: boolean
  }
  subscription?: {
    plan: string
    status: 'active' | 'canceled' | 'expired' | 'trial'
    startDate: Date
    endDate?: Date
    trialEndsAt?: Date
    autoRenew: boolean
    paymentMethod?: string
    lastBillingDate?: Date
    nextBillingDate?: Date
    billingCycle: 'monthly' | 'yearly'
  }
  metadata?: Record<string, any>
  tags?: string[]
  avatar?: string
  coverImage?: string
  bio?: string
  company?: string
  jobTitle?: string
  education?: Array<{
    school: string
    degree: string
    field: string
    startYear: number
    endYear?: number
    description?: string
  }>
  experience?: Array<{
    title: string
    company: string
    location?: string
    current: boolean
    startDate: Date
    endDate?: Date
    description?: string
  }>
  skills?: Array<{
    name: string
    level: number // 1-10
    category?: string
  }>
  languages?: Array<{
    name: string
    proficiency: 'elementary' | 'intermediate' | 'advanced' | 'native'
  }>
  projects?: Array<{
    name: string
    description: string
    technologies: string[]
    url?: string
    startDate: Date
    endDate?: Date
  }>
  certifications?: Array<{
    name: string
    issuer: string
    issueDate: Date
    expiryDate?: Date
    credentialId?: string
    credentialUrl?: string
  }>
  publications?: Array<{
    title: string
    publisher: string
    publicationDate: Date
    url?: string
    description?: string
  }>
  volunteerWork?: Array<{
    organization: string
    role: string
    cause: string
    startDate: Date
    endDate?: Date
    description?: string
  }>
  awards?: Array<{
    title: string
    issuer: string
    issueDate: Date
    description?: string
  }>
  patents?: Array<{
    title: string
    patentNumber: string
    issueDate: Date
    description?: string
    url?: string
  }>
  courses?: Array<{
    name: string
    institution: string
    completionDate: Date
    credentialId?: string
    credentialUrl?: string
  }>
  testScores?: Array<{
    testName: string
    score: string
    date: Date
    description?: string
  }>
  organizations?: Array<{
    name: string
    position: string
    startDate: Date
    endDate?: Date
    description?: string
  }>
  interests?: string[]
  references?: Array<{
    name: string
    relationship: string
    company: string
    position: string
    email: string
    phone?: string
  }>
  availability?: {
    status: 'available' | 'busy' | 'away' | 'offline'
    message?: string
  }
  timeTracking?: {
    weeklyGoal: number // hours per week
    dailyAverage: number // hours per day
    totalHours: number
    lastUpdated: Date
  }
  privacySettings?: {
    profileVisibility: 'public' | 'private' | 'connections'
    showEmail: boolean
    showPhone: boolean
    showLastSeen: boolean
    showOnlineStatus: boolean
    showActivityStatus: boolean
  }
  notificationPreferences?: {
    email: boolean
    push: boolean
    inApp: boolean
    marketing: boolean
    productUpdates: boolean
    securityAlerts: boolean
  }
  securitySettings?: {
    twoFactorEnabled: boolean
    loginAlerts: boolean
    suspiciousActivityAlerts: boolean
    deviceManagement: boolean
  }
  connectedAccounts?: {
    google?: string
    github?: string
    linkedin?: string
    facebook?: string
    twitter?: string
  }
  billingInfo?: {
    plan: string
    status: 'active' | 'canceled' | 'expired' | 'trial'
    paymentMethod?: {
      type: string
      last4?: string
      expiry?: string
    }
    billingAddress?: {
      line1: string
      line2?: string
      city: string
      state: string
      postalCode: string
      country: string
    }
    nextBillingDate?: Date
    trialEndsAt?: Date
  }
  activityLogs?: Array<{
    action: string
    timestamp: Date
    ipAddress: string
    userAgent: string
    location?: string
    metadata?: Record<string, any>
  }>
  integrations?: {
    slack?: {
      teamId?: string
      teamName?: string
      userId?: string
      accessToken?: string
    }
    github?: {
      username?: string
      userId?: number
      accessToken?: string
    }
    // Add more integrations as needed
  }
  featureFlags?: Record<string, boolean>
  onboardingCompleted?: boolean
  lastSeenAt?: Date
  loginCount?: number
  failedLoginAttempts?: number
  accountLockedUntil?: Date
  passwordHistory?: Array<{
    password: string
    changedAt: Date
  }>
  securityQuestions?: Array<{
    question: string
    answerHash: string
  }>
  backupCodes?: string[]
  mfaEnabled?: boolean
  mfaSecret?: string
  mfaRecoveryCodes?: string[]
  lastPasswordChange?: Date
  lastSecurityUpdate?: Date
  termsAcceptedAt?: Date
  privacyPolicyAcceptedAt?: Date
  marketingConsent?: boolean
  newsletterSubscription?: boolean
  timezone?: string
  locale?: string
  country?: string
  city?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
  ipAddress?: string
  userAgent?: string
  deviceInfo?: {
    type: 'mobile' | 'tablet' | 'desktop' | 'other'
    os: string
    browser: string
    isBot: boolean
  }
  referrer?: string
  utmParams?: {
    source?: string
    medium?: string
    campaign?: string
    term?: string
    content?: string
  }
  customFields?: Record<string, any>
  notes?: string
  tags?: string[]
  statusHistory?: Array<{
    status: string
    changedAt: Date
    changedBy: string
    reason?: string
  }>
  relatedAccounts?: Array<{
    userId: string
    relationType: string
  }>
  externalIds?: Record<string, string>
  metadata?: Record<string, any>
  systemNotes?: string[]
  deleted?: boolean
  deletedAt?: Date
  deletedBy?: string
  deletionReason?: string
  archived?: boolean
  archivedAt?: Date
  archivedBy?: string
  archiveReason?: string
  version?: number
  createdBy?: string
  updatedBy?: string
  deletedBy?: string
  restoredAt?: Date
  restoredBy?: string
  restoreReason?: string
  isVerified?: boolean
  verificationToken?: string
  verificationTokenExpires?: Date
  isApproved?: boolean
  approvedAt?: Date
  approvedBy?: string
  rejectionReason?: string
  lastPasswordResetRequest?: Date
  passwordResetToken?: string
  passwordResetExpires?: Date
  emailChangeToken?: string
  emailChangeTokenExpires?: Date
  newEmail?: string
  lastEmailChange?: Date
  lastProfileUpdate?: Date
  lastPasswordChange?: Date
  lastLoginAttempt?: Date
  lastFailedLogin?: Date
  lastSuccessfulLogin?: Date
  loginIpHistory?: string[]
  deviceHistory?: Array<{
    deviceId: string
    name: string
    type: string
    os: string
    browser: string
    lastUsed: Date
    ipAddress: string
    location?: string
    isTrusted: boolean
  }>
  sessionHistory?: Array<{
    sessionId: string
    deviceInfo: string
    ipAddress: string
    location?: string
    loginTime: Date
    lastActivity: Date
    expiresAt: Date
    isActive: boolean
  }>
  activityFeed?: Array<{
    type: string
    action: string
    timestamp: Date
    details?: Record<string, any>
    ipAddress?: string
    userAgent?: string
    location?: string
  }>
  auditLog?: Array<{
    action: string
    entityType: string
    entityId: string
    changes: Record<string, { old: any; new: any }>
    timestamp: Date
    performedBy: string
    ipAddress?: string
    userAgent?: string
    location?: string
  }>
  preferences?: {
    notifications: {
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
  }
  stats?: {
    logins: number
    sessions: number
    activities: number
    lastActive: Date
  }
  subscription?: {
    plan: string
    status: 'active' | 'canceled' | 'expired' | 'trial'
    startDate: Date
    endDate?: Date
    trialEndsAt?: Date
    autoRenew: boolean
    paymentMethod?: string
  }
  security?: {
    twoFactorEnabled: boolean
    lastPasswordChange: Date
    loginHistory: Array<{
      date: Date
      ipAddress: string
      device: string
      location: string
    }>
  }
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
