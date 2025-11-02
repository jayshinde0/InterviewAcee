import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { getDatabase } from '@/lib/mongodb'
import { UserProgress, AptitudeProgress, CodeSubmission } from '@/lib/models/User'

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session')?.value
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await validateSession(sessionToken)
    if (!user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const db = await getDatabase()
    
    // Fetch all user data in parallel
    const [userProgress, aptitudeProgress, submissions] = await Promise.all([
      db.collection<UserProgress>('userProgress').find({ userId: user._id }).toArray(),
      db.collection<AptitudeProgress>('aptitudeProgress').find({ userId: user._id }).toArray(),
      db.collection<CodeSubmission>('userCodingSubmissionsStorage').find({ userId: user._id }).sort({ submittedAt: -1 }).limit(10).toArray()
    ])

    // Calculate coding stats
    const solvedProblems = userProgress.filter(p => p.status === 'solved').length
    const attemptedProblems = userProgress.filter(p => p.status === 'attempted').length
    const totalCodingQuestions = 150 // This should come from your problems collection

    // Calculate aptitude stats
    const totalAptitudeQuestions = aptitudeProgress.length
    const correctAptitudeAnswers = aptitudeProgress.filter(p => p.correct).length
    
    // Calculate aptitude sets progress
    const aptitudeSets = aptitudeProgress.reduce((sets, progress) => {
      const setKey = `${progress.category}_${(progress as any).setId || 'default'}`
      if (!sets[setKey]) {
        sets[setKey] = { total: 0, correct: 0, completed: false }
      }
      sets[setKey].total++
      if (progress.correct) sets[setKey].correct++
      // Consider a set completed if accuracy is >= 70%
      sets[setKey].completed = (sets[setKey].correct / sets[setKey].total) >= 0.7
      return sets
    }, {} as Record<string, { total: number, correct: number, completed: boolean }>)
    
    const completedSets = Object.values(aptitudeSets).filter(set => set.completed).length
    const totalSets = Math.max(Object.keys(aptitudeSets).length, 10) // Default to 10 sets

    // Calculate interview stats (mock interviews)
    const interviewSubmissions = submissions.filter(s => !s.isPlayground && s.problemId)
    const completedInterviews = 0 // Will be implemented when interview system is ready

    // Calculate study streak (simplified - days with activity)
    const today = new Date()
    const recentDays = 30
    const activityDates = new Set()
    
    submissions.forEach(s => {
      const date = new Date(s.submittedAt).toDateString()
      activityDates.add(date)
    })
    
    aptitudeProgress.forEach(p => {
      const date = new Date(p.attemptedAt).toDateString()
      activityDates.add(date)
    })

    let studyStreak = 0
    for (let i = 0; i < recentDays; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      if (activityDates.has(checkDate.toDateString())) {
        studyStreak++
      } else if (i === 0) {
        // If no activity today, streak is broken
        break
      }
    }

    // Recent activity
    const recentActivity = submissions.slice(0, 5).map(submission => ({
      type: submission.isPlayground ? "playground" : "practice",
      title: submission.isPlayground ? "Code Playground" : `Problem ${submission.problemId}`,
      time: new Date(submission.submittedAt).toLocaleDateString(),
      status: submission.status === 'Accepted' || submission.status === 'Success' ? 'completed' : 'failed'
    }))

    // Add recent aptitude activity
    const recentAptitude = aptitudeProgress.slice(-3).map(apt => ({
      type: "aptitude",
      title: `${apt.category} Question`,
      time: new Date(apt.attemptedAt).toLocaleDateString(),
      status: apt.correct ? 'completed' : 'failed'
    }))

    const combinedActivity = [...recentActivity, ...recentAptitude]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 5)

    return NextResponse.json({
      questionsCompleted: solvedProblems,
      totalQuestions: totalCodingQuestions,
      mockInterviews: completedInterviews,
      studyStreak,
      aptitudeCompleted: correctAptitudeAnswers,
      totalAptitudeQuestions,
      codingCompleted: solvedProblems,
      interviewsCompleted: completedInterviews,
      recentActivity: combinedActivity,
      completionRate: totalCodingQuestions > 0 ? Math.round((solvedProblems / totalCodingQuestions) * 100) : 0,
      aptitudeAccuracy: totalAptitudeQuestions > 0 ? Math.round((correctAptitudeAnswers / totalAptitudeQuestions) * 100) : 0,
      codingProgress: {
        solved: solvedProblems,
        total: totalCodingQuestions
      },
      interviewProgress: {
        completed: completedInterviews
      },
      aptitudeProgress: {
        setsCompleted: completedSets,
        totalSets: totalSets,
        accuracy: totalAptitudeQuestions > 0 ? Math.round((correctAptitudeAnswers / totalAptitudeQuestions) * 100) : 0
      }
    })
  } catch (error) {
    console.error('Stats fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
