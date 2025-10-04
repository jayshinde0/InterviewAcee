// MongoDB Models for InterviewAce Progress Tracking

export interface User {
  _id?: string
  email: string
  firstName?: string
  lastName?: string
  createdAt: Date
  updatedAt: Date
}

export interface AptitudeCategory {
  _id?: string
  name: string
  description?: string
  totalQuestions: number
  timeLimitMinutes: number
  createdAt: Date
}

export interface AptitudeQuestion {
  _id?: string
  categoryId: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  difficultyLevel: 'easy' | 'medium' | 'hard'
  programmingLanguage?: string
  createdAt: Date
}

export interface UserAptitudeSession {
  _id?: string
  userId: string
  categoryId: string
  programmingLanguage?: string
  startedAt: Date
  completedAt?: Date
  timeTakenSeconds?: number
  totalQuestions: number
  correctAnswers: number
  scorePercentage?: number
  status: 'in_progress' | 'completed' | 'abandoned'
}

export interface UserAptitudeAnswer {
  _id?: string
  sessionId: string
  questionId: string
  selectedAnswer: number
  isCorrect: boolean
  timeTakenSeconds: number
  answeredAt: Date
}

export interface CodingCategory {
  _id?: string
  name: string
  description?: string
  totalProblems: number
  createdAt: Date
}

export interface CodingProblem {
  _id?: string
  categoryId: string
  title: string
  description: string
  difficultyLevel: 'easy' | 'medium' | 'hard'
  problemStatement: string
  inputFormat?: string
  outputFormat?: string
  constraints?: string
  sampleInput?: string
  sampleOutput?: string
  testCases?: any[]
  timeLimitSeconds: number
  memoryLimitMb: number
  tags: string[]
  createdAt: Date
}

export interface UserCodingSubmission {
  _id?: string
  userId: string
  problemId: string
  programmingLanguage: string
  sourceCode: string
  status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error' | 'compilation_error'
  executionTimeMs?: number
  memoryUsedKb?: number
  testCasesPassed: number
  totalTestCases: number
  errorMessage?: string
  submittedAt: Date
}

export interface UserProblemProgress {
  _id?: string
  userId: string
  problemId: string
  status: 'not_attempted' | 'attempted' | 'solved'
  bestSubmissionId?: string
  attemptsCount: number
  firstAttemptedAt?: Date
  solvedAt?: Date
  bestExecutionTimeMs?: number
}

export interface InterviewType {
  _id?: string
  name: string
  description?: string
  durationMinutes: number
  createdAt: Date
}

export interface InterviewQuestion {
  _id?: string
  typeId: string
  category: 'behavioral' | 'technical' | 'system_design'
  question: string
  sampleAnswer?: string
  evaluationCriteria: string[]
  difficultyLevel: 'easy' | 'medium' | 'hard'
  tags: string[]
  createdAt: Date
}

export interface UserInterviewSession {
  _id?: string
  userId: string
  typeId: string
  startedAt: Date
  completedAt?: Date
  durationMinutes?: number
  overallRating?: number
  feedback?: string
  status: 'in_progress' | 'completed' | 'abandoned'
}

export interface UserInterviewResponse {
  _id?: string
  sessionId: string
  questionId: string
  response: string
  rating?: number
  feedback?: string
  timeTakenSeconds: number
  answeredAt: Date
}

export interface UserProgressStats {
  _id?: string
  userId: string
  
  // Aptitude Stats
  aptitudeTestsCompleted: number
  aptitudeTotalQuestionsAnswered: number
  aptitudeCorrectAnswers: number
  aptitudeAverageScore: number
  
  // Coding Stats
  codingProblemsSolved: number
  codingProblemsAttempted: number
  codingTotalSubmissions: number
  codingAcceptedSubmissions: number
  
  // Interview Stats
  interviewsCompleted: number
  interviewAverageRating: number
  
  // Activity Stats
  totalStudyTimeMinutes: number
  currentStreakDays: number
  longestStreakDays: number
  lastActivityDate?: Date
  
  updatedAt: Date
}

export interface UserActivityLog {
  _id?: string
  userId: string
  activityType: 'aptitude_test' | 'coding_submission' | 'interview_session'
  activityDate: Date
  durationMinutes: number
  details?: any
  createdAt: Date
}

// Collection names - Only essential collections for coding practice
export const Collections = {
  USERS: 'users',
  CODING_PROBLEMS: 'codingProblems',
  USER_CODING_SUBMISSIONS: 'userCodingSubmissions',
  USER_PROBLEM_PROGRESS: 'userProblemProgress',
  USER_PROGRESS_STATS: 'userProgressStats',
  USER_ACTIVITY_LOG: 'userActivityLog'
}

// Deprecated collections (for reference, will be removed)
export const DeprecatedCollections = {
  APTITUDE_CATEGORIES: 'aptitudeCategories',
  APTITUDE_QUESTIONS: 'aptitudeQuestions',
  USER_APTITUDE_SESSIONS: 'userAptitudeSessions',
  USER_APTITUDE_ANSWERS: 'userAptitudeAnswers',
  CODING_CATEGORIES: 'codingCategories',
  INTERVIEW_TYPES: 'interviewTypes',
  INTERVIEW_QUESTIONS: 'interviewQuestions',
  USER_INTERVIEW_SESSIONS: 'userInterviewSessions',
  USER_INTERVIEW_RESPONSES: 'userInterviewResponses'
}