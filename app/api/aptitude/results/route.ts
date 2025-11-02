import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { getDatabase } from '@/lib/dbConnect'
import { ObjectId } from 'mongodb'

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
    const categoryId = searchParams.get('categoryId')
    const testId = searchParams.get('testId')
    const limit = parseInt(searchParams.get('limit') || '50')

    const db = await getDatabase()
    const testResultsCollection = db.collection('aptitudeTestResults')

    let query: any = { userId: user._id }
    
    if (categoryId) {
      query.categoryId = categoryId
    }
    
    if (testId) {
      query._id = new ObjectId(testId)
    }

    const results = await testResultsCollection
      .find(query)
      .sort({ submittedAt: -1 })
      .limit(limit)
      .toArray()

    // Calculate statistics
    const totalTests = results.length
    const averageScore = totalTests > 0 
      ? Math.round(results.reduce((sum, test) => sum + test.score, 0) / totalTests)
      : 0
    const bestScore = totalTests > 0 
      ? Math.max(...results.map(test => test.score))
      : 0
    const totalTimeSpent = results.reduce((sum, test) => sum + (test.totalTimeSpent || 0), 0)

    // Group by category for category-wise stats
    const categoryStats = results.reduce((acc: any, test) => {
      if (!acc[test.categoryId]) {
        acc[test.categoryId] = {
          totalTests: 0,
          averageScore: 0,
          bestScore: 0,
          totalQuestions: 0,
          correctAnswers: 0
        }
      }
      
      acc[test.categoryId].totalTests++
      acc[test.categoryId].totalQuestions += test.totalQuestions
      acc[test.categoryId].correctAnswers += test.correctAnswers
      
      return acc
    }, {})

    // Calculate averages and best scores for each category
    Object.keys(categoryStats).forEach(catId => {
      const categoryTests = results.filter(t => t.categoryId === catId)
      categoryStats[catId].averageScore = Math.round(
        categoryTests.reduce((sum, t) => sum + t.score, 0) / categoryTests.length
      )
      categoryStats[catId].bestScore = Math.max(...categoryTests.map(t => t.score))
    })

    return NextResponse.json({
      results: results.map(result => ({
        _id: result._id,
        categoryId: result.categoryId,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        incorrectAnswers: result.incorrectAnswers,
        score: result.score,
        totalTimeSpent: result.totalTimeSpent,
        submittedAt: result.submittedAt,
        // Include detailed results only if requesting a specific test
        ...(testId && { results: result.results })
      })),
      stats: {
        totalTests,
        averageScore,
        bestScore,
        totalTimeSpent,
        categoryStats
      }
    })
  } catch (error) {
    console.error('Aptitude results fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}