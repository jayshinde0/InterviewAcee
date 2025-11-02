import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { getDatabase } from '@/lib/dbConnect'
import { AptitudeQuestion } from '@/lib/database/models'

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
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    const db = await getDatabase()
    const questionsCollection = db.collection<AptitudeQuestion>('aptitudeQuestions')

    // Get questions for the specified category
    const questions = await questionsCollection
      .find({ categoryId })
      .limit(limit)
      .toArray()

    // Remove correct answers from the response for security
    const questionsForTest = questions.map(q => ({
      _id: q._id,
      categoryId: q.categoryId,
      question: q.question,
      options: q.options,
      difficultyLevel: q.difficultyLevel
    }))

    return NextResponse.json({
      questions: questionsForTest,
      totalQuestions: questions.length,
      categoryId
    })
  } catch (error) {
    console.error('Aptitude questions fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}