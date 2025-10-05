// This file contains deprecated functionality and is not currently used
// TODO: Update to use new collection structure or remove entirely

export interface AptitudeTestResult {
  userId: string
  categoryId: string
  programmingLanguage?: string
  answers: Array<{
    questionId: string
    selectedAnswer: number
    isCorrect: boolean
    timeTakenSeconds: number
  }>
  timeTakenSeconds: number
  totalQuestions: number
  correctAnswers: number
  scorePercentage: number
}

export interface CodingSubmission {
  userId: string
  problemId: string
  programmingLanguage: string
  sourceCode: string
  status: string
  executionTimeMs?: number
  memoryUsedKb?: number
  testCasesPassed: number
  totalTestCases: number
  errorMessage?: string
}

export interface InterviewResponse {
  sessionId: string
  questionId: string
  response: string
  rating?: number
  feedback?: string
  timeTakenSeconds: number
}

export class ProgressService {
  // All methods return empty/default values since this functionality is deprecated
  
  static async startAptitudeTest(userId: string, categoryId: string, programmingLanguage?: string): Promise<string> {
    return 'deprecated-session-id'
  }

  static async submitAptitudeTest(sessionId: string, testResult: AptitudeTestResult) {
    // No-op
  }

  static async startInterviewSession(userId: string, typeId: string): Promise<string> {
    return 'deprecated-session-id'
  }

  static async submitInterviewResponse(sessionId: string, questionId: string, response: string, rating?: number, feedback?: string) {
    // No-op
  }

  static async completeInterviewSession(sessionId: string, overallRating: number, feedback?: string) {
    // No-op
  }

  static async submitCode(submission: CodingSubmission): Promise<string> {
    return 'deprecated-submission-id'
  }

  static async getUserAptitudeHistory(userId: string) {
    return []
  }

  static async getUserAptitudeStats(userId: string) {
    return {
      testsCompleted: 0,
      totalQuestionsAnswered: 0,
      correctAnswers: 0,
      averageScore: 0
    }
  }

  static async getUserInterviewHistory(userId: string) {
    return []
  }

  static async getCodingSubmissionHistory(userId: string, problemId?: string) {
    return []
  }

  static async getUserProgressStats(userId: string) {
    return {
      aptitudeTestsCompleted: 0,
      aptitudeTotalQuestionsAnswered: 0,
      aptitudeCorrectAnswers: 0,
      aptitudeAverageScore: 0,
      codingProblemsSolved: 0,
      codingProblemsAttempted: 0,
      codingTotalSubmissions: 0,
      codingAcceptedSubmissions: 0,
      interviewsCompleted: 0,
      interviewAverageRating: 0,
      totalStudyTimeMinutes: 0,
      currentStreakDays: 0,
      longestStreakDays: 0,
      lastActivityDate: null
    }
  }

  static async getUserActivityHistory(userId: string, limit: number = 30) {
    return []
  }

  static async getUserOverallStats(userId: string) {
    return {
      aptitude: { testsCompleted: 0, averageScore: 0 },
      coding: { problemsSolved: 0, totalSubmissions: 0 },
      interview: { sessionsCompleted: 0, averageRating: 0 }
    }
  }
}

export default ProgressService