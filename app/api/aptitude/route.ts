import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { getDatabase } from '@/lib/mongodb'
import { AptitudeProgress, AptitudeTestProgress } from '@/lib/models/User'

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session')?.value
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await validateSession(sessionToken)
    if (!user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const {
      questionId,
      category,
      correct,
      timeSpent,
      selectedAnswer,
      correctAnswer
    } = await request.json()

    const db = await getDatabase()
    const aptitudeProgress = db.collection<AptitudeProgress>('aptitudeProgress')

    const now = new Date()
    const progress: AptitudeProgress = {
      userId: user._id!,
      questionId,
      category,
      solved: true,
      correct,
      attemptedAt: now,
      timeSpent,
      selectedAnswer,
      correctAnswer
    }

    await aptitudeProgress.insertOne(progress)

    return NextResponse.json({ message: 'Aptitude progress saved successfully' })
  } catch (error) {
    console.error('Aptitude progress save error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const db = await getDatabase()
    const aptitudeProgress = db.collection<AptitudeProgress>('aptitudeProgress')

    const query: any = { userId: user._id }
    if (category) {
      query.category = category
    }

    const userProgress = await aptitudeProgress.find(query).toArray()
    
    // Calculate stats
    const totalQuestions = userProgress.length
    const correctAnswers = userProgress.filter(p => p.correct).length
    const averageTime = totalQuestions > 0 
      ? userProgress.reduce((sum, p) => sum + p.timeSpent, 0) / totalQuestions 
      : 0

    // Group by category
    const categoryStats = userProgress.reduce((acc: any, progress) => {
      if (!acc[progress.category]) {
        acc[progress.category] = { total: 0, correct: 0 }
      }
      acc[progress.category].total++
      if (progress.correct) {
        acc[progress.category].correct++
      }
      return acc
    }, {})

    return NextResponse.json({
      progress: userProgress,
      stats: {
        totalQuestions,
        correctAnswers,
        averageTime,
        categoryStats
      }
    })
  } catch (error) {
    console.error('Aptitude progress fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
