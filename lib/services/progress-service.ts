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
    
    // Get category info to determine total questions
    const category = await db.collection(Collections.APTITUDE_CATEGORIES).findOne({ _id: new ObjectId(categoryId) })
    const totalQuestions = category?.totalQuestions || 20
    
    const session: Partial<UserAptitudeSession> = {
      userId,
      categoryId,
      programmingLanguage,
      startedAt: new Date(),
      totalQuestions,
      correctAnswers: 0,
      status: 'in_progress'
    }
    
    const result = await db.collection(Collections.USER_APTITUDE_SESSIONS).insertOne(session)
    return result.insertedId.toString()
  }

  static async submitAptitudeTest(sessionId: string, testResult: AptitudeTestResult) {
    return await transaction(async (client) => {
      // Update session
      await client.query(
        `UPDATE user_aptitude_sessions 
         SET completed_at = CURRENT_TIMESTAMP, 
             time_taken_seconds = $1, 
             correct_answers = $2, 
             score_percentage = $3, 
             status = 'completed'
         WHERE id = $4`,
        [testResult.timeTakenSeconds, testResult.correctAnswers, testResult.scorePercentage, sessionId]
      )

      // Insert individual answers
      for (const answer of testResult.answers) {
        await client.query(
          `INSERT INTO user_aptitude_answers (session_id, question_id, selected_answer, is_correct, time_taken_seconds)
           VALUES ($1, $2, $3, $4, $5)`,
          [sessionId, answer.questionId, answer.selectedAnswer, answer.isCorrect, answer.timeTaken]
        )
      }

      // Update user progress stats
      await this.updateAptitudeStats(client, testResult.userId)

      // Log activity
      await this.logActivity(client, testResult.userId, 'aptitude_test', testResult.timeTakenSeconds / 60)
    })
  }

  // Coding Practice Progress
  static async submitCode(submission: CodingSubmission) {
    return await transaction(async (client) => {
      // Insert submission
      const submissionResult = await client.query(
        `INSERT INTO user_coding_submissions 
         (user_id, problem_id, programming_language, source_code, status, execution_time_ms, 
          memory_used_kb, test_cases_passed, total_test_cases, error_message)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING id`,
        [
          submission.userId, submission.problemId, submission.programmingLanguage,
          submission.sourceCode, submission.status, submission.executionTimeMs,
          submission.memoryUsedKb, submission.testCasesPassed, submission.totalTestCases,
          submission.errorMessage
        ]
      )

      const submissionId = submissionResult.rows[0].id

      // Update or insert problem progress
      const progressResult = await client.query(
        `SELECT id, status, attempts_count FROM user_problem_progress 
         WHERE user_id = $1 AND problem_id = $2`,
        [submission.userId, submission.problemId]
      )

      if (progressResult.rows.length === 0) {
        // First attempt
        await client.query(
          `INSERT INTO user_problem_progress 
           (user_id, problem_id, status, best_submission_id, attempts_count, first_attempted_at, solved_at, best_execution_time_ms)
           VALUES ($1, $2, $3, $4, 1, CURRENT_TIMESTAMP, $5, $6)`,
          [
            submission.userId, submission.problemId,
            submission.status === 'accepted' ? 'solved' : 'attempted',
            submissionId,
            submission.status === 'accepted' ? 'CURRENT_TIMESTAMP' : null,
            submission.executionTimeMs
          ]
        )
      } else {
        // Update existing progress
        const currentProgress = progressResult.rows[0]
        const newStatus = submission.status === 'accepted' ? 'solved' : 
                         currentProgress.status === 'solved' ? 'solved' : 'attempted'
        
        await client.query(
          `UPDATE user_problem_progress 
           SET status = $1, attempts_count = attempts_count + 1,
               best_submission_id = CASE 
                 WHEN $2 = 'accepted' THEN $3 
                 ELSE best_submission_id 
               END,
               solved_at = CASE 
                 WHEN $2 = 'accepted' AND solved_at IS NULL THEN CURRENT_TIMESTAMP 
                 ELSE solved_at 
               END,
               best_execution_time_ms = CASE 
                 WHEN $2 = 'accepted' AND (best_execution_time_ms IS NULL OR $4 < best_execution_time_ms) THEN $4
                 ELSE best_execution_time_ms 
               END
           WHERE user_id = $5 AND problem_id = $6`,
          [newStatus, submission.status, submissionId, submission.executionTimeMs, submission.userId, submission.problemId]
        )
      }

      // Update coding stats
      await this.updateCodingStats(client, submission.userId)

      // Log activity
      await this.logActivity(client, submission.userId, 'coding_submission', 5) // Assume 5 minutes per submission

      return submissionId
    })
  }

  // Interview Progress
  static async startInterviewSession(userId: string, typeId: string) {
    const result = await query(
      `INSERT INTO user_interview_sessions (user_id, type_id, status)
       VALUES ($1, $2, 'in_progress')
       RETURNING id`,
      [userId, typeId]
    )
    return result.rows[0].id
  }

  static async submitInterviewResponse(response: InterviewResponse) {
    return await transaction(async (client) => {
      // Insert response
      await client.query(
        `INSERT INTO user_interview_responses (session_id, question_id, response, rating, feedback, time_taken_seconds)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [response.sessionId, response.questionId, response.response, response.rating, response.feedback, response.timeTaken]
      )

      // Update session if all questions answered (you'd need to check this based on your logic)
      // For now, we'll update the session when explicitly completed
    })
  }

  static async completeInterviewSession(sessionId: string, overallRating: number, feedback: string, durationMinutes: number) {
    return await transaction(async (client) => {
      // Update session
      const sessionResult = await client.query(
        `UPDATE user_interview_sessions 
         SET completed_at = CURRENT_TIMESTAMP, duration_minutes = $1, overall_rating = $2, feedback = $3, status = 'completed'
         WHERE id = $4
         RETURNING user_id`,
        [durationMinutes, overallRating, feedback, sessionId]
      )

      const userId = sessionResult.rows[0].user_id

      // Update interview stats
      await this.updateInterviewStats(client, userId)

      // Log activity
      await this.logActivity(client, userId, 'interview_session', durationMinutes)
    })
  }

  // Get User Progress Stats
  static async getUserProgressStats(userId: string) {
    const result = await query(
      `SELECT * FROM user_progress_stats WHERE user_id = $1`,
      [userId]
    )

    if (result.rows.length === 0) {
      // Initialize stats for new user
      await query(
        `INSERT INTO user_progress_stats (user_id) VALUES ($1)`,
        [userId]
      )
      return {
        aptitude_tests_completed: 0,
        aptitude_total_questions_answered: 0,
        aptitude_correct_answers: 0,
        aptitude_average_score: 0,
        coding_problems_solved: 0,
        coding_problems_attempted: 0,
        coding_total_submissions: 0,
        coding_accepted_submissions: 0,
        interviews_completed: 0,
        interview_average_rating: 0,
        total_study_time_minutes: 0,
        current_streak_days: 0,
        longest_streak_days: 0,
        last_activity_date: null
      }
    }

    return result.rows[0]
  }

  // Get User Activity History
  static async getUserActivityHistory(userId: string, limit: number = 50) {
    const result = await query(
      `SELECT activity_type, activity_date, duration_minutes, details, created_at
       FROM user_activity_log 
       WHERE user_id = $1 
       ORDER BY activity_date DESC, created_at DESC 
       LIMIT $2`,
      [userId, limit]
    )
    return result.rows
  }

  // Get Aptitude Test History
  static async getAptitudeTestHistory(userId: string) {
    const result = await query(
      `SELECT s.*, c.name as category_name, c.description as category_description
       FROM user_aptitude_sessions s
       JOIN aptitude_categories c ON s.category_id = c.id
       WHERE s.user_id = $1 AND s.status = 'completed'
       ORDER BY s.completed_at DESC`,
      [userId]
    )
    return result.rows
  }

  // Get Coding Submission History
  static async getCodingSubmissionHistory(userId: string, problemId?: string) {
    let queryText = `
      SELECT s.*, p.title as problem_title, p.difficulty_level, c.name as category_name
      FROM user_coding_submissions s
      JOIN coding_problems p ON s.problem_id = p.id
      JOIN coding_categories c ON p.category_id = c.id
      WHERE s.user_id = $1
    `
    const params = [userId]

    if (problemId) {
      queryText += ` AND s.problem_id = $2`
      params.push(problemId)
    }

    queryText += ` ORDER BY s.submitted_at DESC`

    const result = await query(queryText, params)
    return result.rows
  }

  // Private helper methods
  private static async updateAptitudeStats(client: any, userId: string) {
    await client.query(
      `INSERT INTO user_progress_stats (user_id, aptitude_tests_completed, aptitude_total_questions_answered, aptitude_correct_answers, aptitude_average_score)
       VALUES ($1, 1, 
         (SELECT SUM(total_questions) FROM user_aptitude_sessions WHERE user_id = $1 AND status = 'completed'),
         (SELECT SUM(correct_answers) FROM user_aptitude_sessions WHERE user_id = $1 AND status = 'completed'),
         (SELECT AVG(score_percentage) FROM user_aptitude_sessions WHERE user_id = $1 AND status = 'completed')
       )
       ON CONFLICT (user_id) DO UPDATE SET
         aptitude_tests_completed = (SELECT COUNT(*) FROM user_aptitude_sessions WHERE user_id = $1 AND status = 'completed'),
         aptitude_total_questions_answered = (SELECT SUM(total_questions) FROM user_aptitude_sessions WHERE user_id = $1 AND status = 'completed'),
         aptitude_correct_answers = (SELECT SUM(correct_answers) FROM user_aptitude_sessions WHERE user_id = $1 AND status = 'completed'),
         aptitude_average_score = (SELECT AVG(score_percentage) FROM user_aptitude_sessions WHERE user_id = $1 AND status = 'completed'),
         updated_at = CURRENT_TIMESTAMP`,
      [userId]
    )
  }

  private static async updateCodingStats(client: any, userId: string) {
    await client.query(
      `INSERT INTO user_progress_stats (user_id, coding_problems_solved, coding_problems_attempted, coding_total_submissions, coding_accepted_submissions)
       VALUES ($1,
         (SELECT COUNT(*) FROM user_problem_progress WHERE user_id = $1 AND status = 'solved'),
         (SELECT COUNT(*) FROM user_problem_progress WHERE user_id = $1 AND status IN ('attempted', 'solved')),
         (SELECT COUNT(*) FROM user_coding_submissions WHERE user_id = $1),
         (SELECT COUNT(*) FROM user_coding_submissions WHERE user_id = $1 AND status = 'accepted')
       )
       ON CONFLICT (user_id) DO UPDATE SET
         coding_problems_solved = (SELECT COUNT(*) FROM user_problem_progress WHERE user_id = $1 AND status = 'solved'),
         coding_problems_attempted = (SELECT COUNT(*) FROM user_problem_progress WHERE user_id = $1 AND status IN ('attempted', 'solved')),
         coding_total_submissions = (SELECT COUNT(*) FROM user_coding_submissions WHERE user_id = $1),
         coding_accepted_submissions = (SELECT COUNT(*) FROM user_coding_submissions WHERE user_id = $1 AND status = 'accepted'),
         updated_at = CURRENT_TIMESTAMP`,
      [userId]
    )
  }

  private static async updateInterviewStats(client: any, userId: string) {
    await client.query(
      `INSERT INTO user_progress_stats (user_id, interviews_completed, interview_average_rating)
       VALUES ($1,
         (SELECT COUNT(*) FROM user_interview_sessions WHERE user_id = $1 AND status = 'completed'),
         (SELECT AVG(overall_rating) FROM user_interview_sessions WHERE user_id = $1 AND status = 'completed')
       )
       ON CONFLICT (user_id) DO UPDATE SET
         interviews_completed = (SELECT COUNT(*) FROM user_interview_sessions WHERE user_id = $1 AND status = 'completed'),
         interview_average_rating = (SELECT AVG(overall_rating) FROM user_interview_sessions WHERE user_id = $1 AND status = 'completed'),
         updated_at = CURRENT_TIMESTAMP`,
      [userId]
    )
  }

  private static async logActivity(client: any, userId: string, activityType: string, durationMinutes: number) {
    const today = new Date().toISOString().split('T')[0]
    
    await client.query(
      `INSERT INTO user_activity_log (user_id, activity_type, activity_date, duration_minutes)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, activity_type, activity_date) DO UPDATE SET
         duration_minutes = user_activity_log.duration_minutes + $4`,
      [userId, activityType, today, durationMinutes]
    )

    // Update total study time and streaks
    await this.updateActivityStats(client, userId)
  }

  private static async updateActivityStats(client: any, userId: string) {
    // Calculate total study time
    const totalTimeResult = await client.query(
      `SELECT SUM(duration_minutes) as total_time FROM user_activity_log WHERE user_id = $1`,
      [userId]
    )

    // Calculate current streak
    const streakResult = await client.query(
      `WITH daily_activity AS (
         SELECT activity_date, 
                ROW_NUMBER() OVER (ORDER BY activity_date DESC) as rn,
                activity_date - INTERVAL '1 day' * (ROW_NUMBER() OVER (ORDER BY activity_date DESC) - 1) as expected_date
         FROM (
           SELECT DISTINCT activity_date 
           FROM user_activity_log 
           WHERE user_id = $1 
           ORDER BY activity_date DESC
         ) dates
       )
       SELECT COUNT(*) as current_streak
       FROM daily_activity 
       WHERE activity_date = expected_date`,
      [userId]
    )

    const totalTime = totalTimeResult.rows[0]?.total_time || 0
    const currentStreak = streakResult.rows[0]?.current_streak || 0

    await client.query(
      `UPDATE user_progress_stats 
       SET total_study_time_minutes = $1,
           current_streak_days = $2,
           longest_streak_days = GREATEST(longest_streak_days, $2),
           last_activity_date = CURRENT_DATE,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $3`,
      [totalTime, currentStreak, userId]
    )
  }
}