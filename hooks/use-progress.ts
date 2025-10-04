import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'

interface ProgressStats {
  aptitude_tests_completed: number
  aptitude_total_questions_answered: number
  aptitude_correct_answers: number
  aptitude_average_score: number
  coding_problems_solved: number
  coding_problems_attempted: number
  coding_total_submissions: number
  coding_accepted_submissions: number
  interviews_completed: number
  interview_average_rating: number
  total_study_time_minutes: number
  current_streak_days: number
  longest_streak_days: number
  last_activity_date: string | null
}

interface ActivityLog {
  activity_type: string
  activity_date: string
  duration_minutes: number
  details: any
  created_at: string
}

export function useProgress() {
  const { user } = useAuth()
  const [stats, setStats] = useState<ProgressStats | null>(null)
  const [activityHistory, setActivityHistory] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Helper function to get user ID consistently
  const getUserId = () => user?._id?.toString() || user?.email || null

  const fetchStats = async () => {
    const userId = getUserId()
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      const response = await fetch(`/api/progress/stats?userId=${userId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch progress stats')
      }

      const data = await response.json()
      setStats(data.stats)
      setActivityHistory(data.activityHistory)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Only fetch if we have a user ID, otherwise set loading to false
    const userId = user?._id?.toString() || user?.email
    if (userId) {
      fetchStats()
    } else {
      setLoading(false)
    }
  }, [user?._id, user?.email])

  // Aptitude Test Functions
  const startAptitudeTest = async (categoryId: string, programmingLanguage?: string) => {
    const userId = user?._id?.toString() || user?.email
    if (!userId) throw new Error('User not authenticated')

    const response = await fetch('/api/progress/aptitude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        categoryId,
        programmingLanguage
      })
    })

    if (!response.ok) {
      throw new Error('Failed to start aptitude test')
    }

    const data = await response.json()
    return data.sessionId
  }

  const submitAptitudeTest = async (sessionId: string, testResult: any) => {
    const response = await fetch('/api/progress/aptitude', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        testResult: {
          ...testResult,
          userId: user?._id?.toString() || user?.email
        }
      })
    })

    if (!response.ok) {
      throw new Error('Failed to submit aptitude test')
    }

    // Refresh stats after submission
    await fetchStats()
  }

  const getAptitudeHistory = async () => {
    const userId = getUserId()
    if (!userId) throw new Error('User not authenticated')

    const response = await fetch(`/api/progress/aptitude?userId=${userId}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch aptitude history')
    }

    const data = await response.json()
    return data.history
  }

  // Coding Practice Functions
  const submitCode = async (submission: any) => {
    const userId = getUserId()
    if (!userId) throw new Error('User not authenticated')

    const response = await fetch('/api/progress/coding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...submission,
        userId
      })
    })

    if (!response.ok) {
      throw new Error('Failed to submit code')
    }

    const data = await response.json()
    
    // Refresh stats after submission
    await fetchStats()
    
    return data.submissionId
  }

  const getCodingHistory = async (problemId?: string) => {
    const userId = getUserId()
    if (!userId) throw new Error('User not authenticated')

    const url = problemId 
      ? `/api/progress/coding?userId=${userId}&problemId=${problemId}`
      : `/api/progress/coding?userId=${userId}`

    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error('Failed to fetch coding history')
    }

    const data = await response.json()
    return data.history
  }

  // Interview Functions
  const startInterviewSession = async (typeId: string) => {
    const userId = getUserId()
    if (!userId) throw new Error('User not authenticated')

    const response = await fetch('/api/progress/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        typeId
      })
    })

    if (!response.ok) {
      throw new Error('Failed to start interview session')
    }

    const data = await response.json()
    return data.sessionId
  }

  const submitInterviewResponse = async (response: any) => {
    const userId = getUserId()
    if (!userId) throw new Error('User not authenticated')

    const apiResponse = await fetch('/api/progress/interview', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...response,
        userId
      })
    })

    if (!apiResponse.ok) {
      throw new Error('Failed to submit interview response')
    }
  }

  const completeInterviewSession = async (sessionId: string, overallRating: number, feedback: string, durationMinutes: number) => {
    const response = await fetch('/api/progress/interview', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        overallRating,
        feedback,
        durationMinutes
      })
    })

    if (!response.ok) {
      throw new Error('Failed to complete interview session')
    }

    // Refresh stats after completion
    await fetchStats()
  }

  return {
    stats,
    activityHistory,
    loading,
    error,
    refreshStats: fetchStats,
    
    // Aptitude functions
    startAptitudeTest,
    submitAptitudeTest,
    getAptitudeHistory,
    
    // Coding functions
    submitCode,
    getCodingHistory,
    
    // Interview functions
    startInterviewSession,
    submitInterviewResponse,
    completeInterviewSession
  }
}