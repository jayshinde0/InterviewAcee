// This file contains deprecated functionality and is not currently used
// TODO: Update to use new collection structure or remove entirely

export class ProgressService {
  // Aptitude methods
  static async createAptitudeSession(userId: string, categoryId: string, programmingLanguage?: string): Promise<string> {
    throw new Error('Aptitude sessions are deprecated')
  }

  static async startAptitudeTest(userId: string, categoryId: string, programmingLanguage?: string): Promise<string> {
    throw new Error('Aptitude tests are deprecated')
  }

  static async submitAptitudeTest(sessionId: string, testResult: any) {
    throw new Error('Aptitude tests are deprecated')
  }

  static async getAptitudeTestHistory(userId: string) {
    return { history: [] } // Return empty array to prevent errors
  }

  static async getUserAptitudeHistory(userId: string) {
    return { history: [] }
  }

  static async getUserAptitudeStats(userId: string) {
    return { stats: {} }
  }

  // Interview methods
  static async createInterviewSession(userId: string, typeId: string): Promise<string> {
    throw new Error('Interview sessions are deprecated')
  }

  static async startInterviewSession(userId: string, typeId: string): Promise<string> {
    throw new Error('Interview sessions are deprecated')
  }

  static async submitInterviewResponse(response: any): Promise<void>
  static async submitInterviewResponse(sessionId: string, questionId: string, response: string, rating?: number, feedback?: string): Promise<void>
  static async submitInterviewResponse(sessionIdOrResponse: any, questionId?: string, response?: string, rating?: number, feedback?: string): Promise<void> {
    throw new Error('Interview responses are deprecated')
  }

  static async completeInterviewSession(sessionId: string, overallRating: number, feedback?: string, durationMinutes?: number) {
    throw new Error('Interview sessions are deprecated')
  }

  static async getInterviewHistory(userId: string) {
    return { history: [] }
  }

  static async getUserInterviewHistory(userId: string) {
    return { history: [] }
  }

  // Coding methods
  static async saveCodingProgress(userId: string, problemId: string, status: string, code: string, language: string, testResults: any[]) {
    throw new Error('Coding progress is deprecated')
  }

  static async getCodingProgress(userId: string) {
    return { progress: [] }
  }

  static async submitCode(submission: any) {
    throw new Error('Code submission is deprecated')
  }

  static async getCodingSubmissionHistory(userId: string, problemId?: string) {
    return { history: [] }
  }

  // Stats methods
  static async getUserOverallStats(userId: string) {
    return { 
      aptitude: { testsCompleted: 0, averageScore: 0 },
      coding: { problemsSolved: 0, totalSubmissions: 0 },
      interview: { sessionsCompleted: 0, averageRating: 0 }
    }
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
    return { activities: [] }
  }

  // Private methods
  private static async updateProgressStats(sessionId: any) {
    throw new Error('Progress stats are deprecated')
  }
}

// Export default for backward compatibility
export default ProgressService