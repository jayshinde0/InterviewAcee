import { getDatabase } from '@/lib/database/connection'
import { 
  Collections, 
  UserAptitudeSession, 
  UserAptitudeAnswer, 
  UserCodingSubmission, 
  UserProblemProgress,
  UserInterviewSession,
  UserInterviewResponse,
  UserProgressStats,
  UserActivityLog
} from '@/lib/database/models'
import { ObjectId } from 'mongodb'

export interface AptitudeTestResult {
  userId: string
  categoryId: string
  programmingLanguage?: string
  answers: Array<{
    questionId: string
    selectedAnswer: number
    isCorrect: boolean
    timeTaken: number
  }>
  totalQuestions: number
  correctAnswers: number
  scorePercentage: number
  timeTakenSeconds: number
}

export interface CodingSubmission {
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
}

export interface InterviewResponse {
  userId: string
  sessionId: string
  questionId: string
  response: string
  rating: number
  feedback?: string
  timeTaken: number
}

export class ProgressService {
  // Aptitude Test Progress
  static async startAptitudeTest(userId: string, categoryId: string, programmingLanguage?: string) {
    const db = await getDatabase()
    
    const session: Partial<UserAptitudeSession> = {
      userId,
      categoryId,
      programmingLanguage,
      startedAt: new Date(),
      totalQuestions: 20, // Default, can be fetched from category
      correctAnswers: 0,
      status: 'in_progress'
    }
    
    const result = await db.collection(Collections.USER_APTITUDE_SESSIONS).insertOne(session)
    return result.insertedId.toString()
  }

  static async submitAptitudeTest(sessionId: string, testResult: AptitudeTestResult) {
    const db = await getDatabase()
    
    // Update session
    await db.collection(Collections.USER_APTITUDE_SESSIONS).updateOne(
      { _id: new ObjectId(sessionId) },
      {
        $set: {
          completedAt: new Date(),
          timeTakenSeconds: testResult.timeTakenSeconds,
          correctAnswers: testResult.correctAnswers,
          scorePercentage: testResult.scorePercentage,
          status: 'completed'
        }
      }
    )

    // Insert individual answers
    const answers = testResult.answers.map(answer => ({
      sessionId,
      questionId: answer.questionId,
      selectedAnswer: answer.selectedAnswer,
      isCorrect: answer.isCorrect,
      timeTakenSeconds: answer.timeTaken,
      answeredAt: new Date()
    }))

    if (answers.length > 0) {
      await db.collection(Collections.USER_APTITUDE_ANSWERS).insertMany(answers)
    }

    // Update user progress stats
    await this.updateAptitudeStats(testResult.userId)

    // Log activity
    await this.logActivity(testResult.userId, 'aptitude_test', Math.round(testResult.timeTakenSeconds / 60))
  }

  // Coding Practice Progress
  static async submitCode(submission: CodingSubmission) {
    const db = await getDatabase()
    
    // Insert submission
    const submissionDoc: Partial<UserCodingSubmission> = {
      ...submission,
      submittedAt: new Date()
    }
    
    const submissionResult = await db.collection(Collections.USER_CODING_SUBMISSIONS).insertOne(submissionDoc)
    const submissionId = submissionResult.insertedId.toString()

    // Update or insert problem progress
    const existingProgress = await db.collection(Collections.USER_PROBLEM_PROGRESS).findOne({
      userId: submission.userId,
      problemId: submission.problemId
    })

    if (!existingProgress) {
      // First attempt
      const progress: Partial<UserProblemProgress> = {
        userId: submission.userId,
        problemId: submission.problemId,
        status: submission.status === 'accepted' ? 'solved' : 'attempted',
        bestSubmissionId: submissionId,
        attemptsCount: 1,
        firstAttemptedAt: new Date(),
        solvedAt: submission.status === 'accepted' ? new Date() : undefined,
        bestExecutionTimeMs: submission.executionTimeMs
      }
      
      await db.collection(Collections.USER_PROBLEM_PROGRESS).insertOne(progress)
    } else {
      // Update existing progress
      const updateData: any = {
        $inc: { attemptsCount: 1 }
      }

      if (submission.status === 'accepted') {
        updateData.$set = {
          status: 'solved',
          bestSubmissionId: submissionId,
          solvedAt: existingProgress.solvedAt || new Date()
        }
        
        if (!existingProgress.bestExecutionTimeMs || (submission.executionTimeMs && submission.executionTimeMs < existingProgress.bestExecutionTimeMs)) {
          updateData.$set.bestExecutionTimeMs = submission.executionTimeMs
        }
      } else if (existingProgress.status !== 'solved') {
        updateData.$set = { status: 'attempted' }
      }

      await db.collection(Collections.USER_PROBLEM_PROGRESS).updateOne(
        { _id: existingProgress._id },
        updateData
      )
    }

    // Update coding stats
    await this.updateCodingStats(submission.userId)

    // Log activity
    await this.logActivity(submission.userId, 'coding_submission', 5) // Assume 5 minutes per submission

    return submissionId
  }

  // Interview Progress
  static async startInterviewSession(userId: string, typeId: string) {
    const db = await getDatabase()
    
    const session: Partial<UserInterviewSession> = {
      userId,
      typeId,
      startedAt: new Date(),
      status: 'in_progress'
    }
    
    const result = await db.collection(Collections.USER_INTERVIEW_SESSIONS).insertOne(session)
    return result.insertedId.toString()
  }

  static async submitInterviewResponse(response: InterviewResponse) {
    const db = await getDatabase()
    
    const responseDoc: Partial<UserInterviewResponse> = {
      sessionId: response.sessionId,
      questionId: response.questionId,
      response: response.response,
      rating: response.rating,
      feedback: response.feedback,
      timeTakenSeconds: response.timeTaken,
      answeredAt: new Date()
    }
    
    await db.collection(Collections.USER_INTERVIEW_RESPONSES).insertOne(responseDoc)
  }

  static async completeInterviewSession(sessionId: string, overallRating: number, feedback: string, durationMinutes: number) {
    const db = await getDatabase()
    
    // Update session
    const sessionResult = await db.collection(Collections.USER_INTERVIEW_SESSIONS).findOneAndUpdate(
      { _id: new ObjectId(sessionId) },
      {
        $set: {
          completedAt: new Date(),
          durationMinutes,
          overallRating,
          feedback,
          status: 'completed'
        }
      },
      { returnDocument: 'after' }
    )

    if (sessionResult.value) {
      const userId = sessionResult.value.userId

      // Update interview stats
      await this.updateInterviewStats(userId)

      // Log activity
      await this.logActivity(userId, 'interview_session', durationMinutes)
    }
  }

  // Get User Progress Stats
  static async getUserProgressStats(userId: string) {
    const db = await getDatabase()
    
    let stats = await db.collection(Collections.USER_PROGRESS_STATS).findOne({ userId })

    if (!stats) {
      // Initialize stats for new user
      const newStats: Partial<UserProgressStats> = {
        userId,
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
        updatedAt: new Date()
      }
      
      await db.collection(Collections.USER_PROGRESS_STATS).insertOne(newStats)
      return newStats
    }

    return {
      aptitude_tests_completed: stats.aptitudeTestsCompleted,
      aptitude_total_questions_answered: stats.aptitudeTotalQuestionsAnswered,
      aptitude_correct_answers: stats.aptitudeCorrectAnswers,
      aptitude_average_score: stats.aptitudeAverageScore,
      coding_problems_solved: stats.codingProblemsSolved,
      coding_problems_attempted: stats.codingProblemsAttempted,
      coding_total_submissions: stats.codingTotalSubmissions,
      coding_accepted_submissions: stats.codingAcceptedSubmissions,
      interviews_completed: stats.interviewsCompleted,
      interview_average_rating: stats.interviewAverageRating,
      total_study_time_minutes: stats.totalStudyTimeMinutes,
      current_streak_days: stats.currentStreakDays,
      longest_streak_days: stats.longestStreakDays,
      last_activity_date: stats.lastActivityDate
    }
  }

  // Get User Activity History
  static async getUserActivityHistory(userId: string, limit: number = 50) {
    const db = await getDatabase()
    
    const activities = await db.collection(Collections.USER_ACTIVITY_LOG)
      .find({ userId })
      .sort({ activityDate: -1, createdAt: -1 })
      .limit(limit)
      .toArray()

    return activities.map(activity => ({
      activity_type: activity.activityType,
      activity_date: activity.activityDate,
      duration_minutes: activity.durationMinutes,
      details: activity.details,
      created_at: activity.createdAt
    }))
  }

  // Get Aptitude Test History
  static async getAptitudeTestHistory(userId: string) {
    const db = await getDatabase()
    
    const sessions = await db.collection(Collections.USER_APTITUDE_SESSIONS)
      .find({ userId, status: 'completed' })
      .sort({ completedAt: -1 })
      .toArray()

    return sessions
  }

  // Get Coding Submission History
  static async getCodingSubmissionHistory(userId: string, problemId?: string) {
    const db = await getDatabase()
    
    const filter: any = { userId }
    if (problemId) {
      filter.problemId = problemId
    }

    const submissions = await db.collection(Collections.USER_CODING_SUBMISSIONS)
      .find(filter)
      .sort({ submittedAt: -1 })
      .toArray()

    return submissions
  }

  // Private helper methods
  private static async updateAptitudeStats(userId: string) {
    const db = await getDatabase()
    
    // Calculate stats from sessions
    const sessions = await db.collection(Collections.USER_APTITUDE_SESSIONS)
      .find({ userId, status: 'completed' })
      .toArray()

    const testsCompleted = sessions.length
    const totalQuestions = sessions.reduce((sum, session) => sum + session.totalQuestions, 0)
    const correctAnswers = sessions.reduce((sum, session) => sum + session.correctAnswers, 0)
    const averageScore = testsCompleted > 0 ? sessions.reduce((sum, session) => sum + (session.scorePercentage || 0), 0) / testsCompleted : 0

    await db.collection(Collections.USER_PROGRESS_STATS).updateOne(
      { userId },
      {
        $set: {
          aptitudeTestsCompleted: testsCompleted,
          aptitudeTotalQuestionsAnswered: totalQuestions,
          aptitudeCorrectAnswers: correctAnswers,
          aptitudeAverageScore: averageScore,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )
  }

  private static async updateCodingStats(userId: string) {
    const db = await getDatabase()
    
    // Calculate stats from progress and submissions
    const [progressStats, submissionStats] = await Promise.all([
      db.collection(Collections.USER_PROBLEM_PROGRESS).aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            solved: { $sum: { $cond: [{ $eq: ['$status', 'solved'] }, 1, 0] } },
            attempted: { $sum: { $cond: [{ $in: ['$status', ['attempted', 'solved']] }, 1, 0] } }
          }
        }
      ]).toArray(),
      db.collection(Collections.USER_CODING_SUBMISSIONS).aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            accepted: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } }
          }
        }
      ]).toArray()
    ])

    const problemsSolved = progressStats[0]?.solved || 0
    const problemsAttempted = progressStats[0]?.attempted || 0
    const totalSubmissions = submissionStats[0]?.total || 0
    const acceptedSubmissions = submissionStats[0]?.accepted || 0

    await db.collection(Collections.USER_PROGRESS_STATS).updateOne(
      { userId },
      {
        $set: {
          codingProblemsSolved: problemsSolved,
          codingProblemsAttempted: problemsAttempted,
          codingTotalSubmissions: totalSubmissions,
          codingAcceptedSubmissions: acceptedSubmissions,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )
  }

  private static async updateInterviewStats(userId: string) {
    const db = await getDatabase()
    
    const sessions = await db.collection(Collections.USER_INTERVIEW_SESSIONS)
      .find({ userId, status: 'completed' })
      .toArray()

    const interviewsCompleted = sessions.length
    const averageRating = interviewsCompleted > 0 ? 
      sessions.reduce((sum, session) => sum + (session.overallRating || 0), 0) / interviewsCompleted : 0

    await db.collection(Collections.USER_PROGRESS_STATS).updateOne(
      { userId },
      {
        $set: {
          interviewsCompleted,
          interviewAverageRating: averageRating,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )
  }

  private static async logActivity(userId: string, activityType: string, durationMinutes: number) {
    const db = await getDatabase()
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Start of day
    
    // Upsert activity log for today
    await db.collection(Collections.USER_ACTIVITY_LOG).updateOne(
      { 
        userId, 
        activityType, 
        activityDate: today 
      },
      {
        $inc: { durationMinutes },
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    )

    // Update total study time and streaks
    await this.updateActivityStats(userId)
  }

  private static async updateActivityStats(userId: string) {
    const db = await getDatabase()
    
    // Calculate total study time
    const totalTimeResult = await db.collection(Collections.USER_ACTIVITY_LOG).aggregate([
      { $match: { userId } },
      { $group: { _id: null, totalTime: { $sum: '$durationMinutes' } } }
    ]).toArray()

    const totalTime = totalTimeResult[0]?.totalTime || 0

    // Calculate current streak (simplified)
    const recentActivities = await db.collection(Collections.USER_ACTIVITY_LOG)
      .find({ userId })
      .sort({ activityDate: -1 })
      .limit(30)
      .toArray()

    let currentStreak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (const activity of recentActivities) {
      const activityDate = new Date(activity.activityDate)
      const daysDiff = Math.floor((today.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === currentStreak) {
        currentStreak++
      } else {
        break
      }
    }

    await db.collection(Collections.USER_PROGRESS_STATS).updateOne(
      { userId },
      {
        $set: {
          totalStudyTimeMinutes: totalTime,
          currentStreakDays: currentStreak,
          lastActivityDate: new Date(),
          updatedAt: new Date()
        },
        $max: {
          longestStreakDays: currentStreak
        }
      },
      { upsert: true }
    )
  }
}