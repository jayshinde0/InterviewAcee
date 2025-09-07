import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { getDatabase } from '@/lib/mongodb'
import { AptitudeTestProgress } from '@/lib/models/User'

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
      testId,
      testName,
      category,
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      skippedQuestions,
      timeSpent,
      questionResults
    } = await request.json()

    const score = Math.round((correctAnswers / totalQuestions) * 100)

    const db = await getDatabase()
    const testProgress = db.collection<AptitudeTestProgress>('aptitudeTestProgress')

    const now = new Date()
    const progress: AptitudeTestProgress = {
      userId: user._id!,
      testId,
      testName,
      category,
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      skippedQuestions,
      timeSpent,
      score,
      completedAt: now,
      questionResults
    }

    await testProgress.insertOne(progress)

    return NextResponse.json({ 
      message: 'Test progress saved successfully',
      score,
      testId: progress._id
    })
  } catch (error) {
    console.error('Test progress save error:', error)
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
    const testId = searchParams.get('testId')

    const db = await getDatabase()
    const testProgress = db.collection<AptitudeTestProgress>('aptitudeTestProgress')

    const query: any = { userId: user._id }
    if (category) {
      query.category = category
    }
    if (testId) {
      query.testId = testId
    }

    const userTests = await testProgress.find(query).sort({ completedAt: -1 }).toArray()
    
    // Calculate overall stats
    const totalTests = userTests.length
    const averageScore = totalTests > 0 
      ? userTests.reduce((sum, test) => sum + test.score, 0) / totalTests 
      : 0
    const bestScore = totalTests > 0 
      ? Math.max(...userTests.map(test => test.score))
      : 0
    const totalTimeSpent = userTests.reduce((sum, test) => sum + test.timeSpent, 0)

    // Group by category
    const categoryStats = userTests.reduce((acc: any, test) => {
      if (!acc[test.category]) {
        acc[test.category] = { 
          totalTests: 0, 
          averageScore: 0, 
          bestScore: 0,
          totalQuestions: 0,
          correctAnswers: 0
        }
      }
      acc[test.category].totalTests++
      acc[test.category].totalQuestions += test.totalQuestions
      acc[test.category].correctAnswers += test.correctAnswers
      
      // Calculate average and best scores for category
      const categoryTests = userTests.filter(t => t.category === test.category)
      acc[test.category].averageScore = categoryTests.reduce((sum, t) => sum + t.score, 0) / categoryTests.length
      acc[test.category].bestScore = Math.max(...categoryTests.map(t => t.score))
      
      return acc
    }, {})

    return NextResponse.json({
      tests: userTests,
      stats: {
        totalTests,
        averageScore: Math.round(averageScore),
        bestScore,
        totalTimeSpent,
        categoryStats
      }
    })
  } catch (error) {
    console.error('Test progress fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
