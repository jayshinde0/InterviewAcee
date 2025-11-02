import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { getDatabase } from '@/lib/dbConnect'
import { AptitudeQuestion } from '@/lib/database/models'
import { ObjectId } from 'mongodb'

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
      categoryId,
      answers, // Array of { questionId, selectedAnswer, timeSpent }
      totalTimeSpent
    } = await request.json()

    if (!categoryId || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Invalid submission data' }, { status: 400 })
    }

    const db = await getDatabase()
    const questionsCollection = db.collection<AptitudeQuestion>('aptitudeQuestions')

    // Get all questions for validation
    const questionIds = answers.map(a => new ObjectId(a.questionId))
    const questions = await questionsCollection
      .find({ _id: { $in: questionIds } } as any)
      .toArray()

    // Create a map for quick lookup
    const questionMap = new Map(questions.map(q => [q._id!.toString(), q]))

    // Validate answers and calculate results
    const results = answers.map(answer => {
      const question = questionMap.get(answer.questionId)
      if (!question) {
        return {
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          correctAnswer: -1,
          isCorrect: false,
          timeSpent: answer.timeSpent || 0,
          question: 'Question not found',
          explanation: ''
        }
      }

      const isCorrect = answer.selectedAnswer === question.correctAnswer
      return {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        timeSpent: answer.timeSpent || 0,
        question: question.question,
        explanation: question.explanation || ''
      }
    })

    // Calculate score
    const correctAnswers = results.filter(r => r.isCorrect).length
    const totalQuestions = results.length
    const score = Math.round((correctAnswers / totalQuestions) * 100)

    // Save test result to database
    const testResultsCollection = db.collection('aptitudeTestResults')
    const testResult = {
      userId: user._id,
      categoryId,
      totalQuestions,
      correctAnswers,
      incorrectAnswers: totalQuestions - correctAnswers,
      score,
      totalTimeSpent: totalTimeSpent || 0,
      results,
      submittedAt: new Date()
    }

    const insertResult = await testResultsCollection.insertOne(testResult)

    return NextResponse.json({
      success: true,
      testId: insertResult.insertedId,
      score,
      correctAnswers,
      totalQuestions,
      results: results.map(r => ({
        questionId: r.questionId,
        question: r.question,
        selectedAnswer: r.selectedAnswer,
        correctAnswer: r.correctAnswer,
        isCorrect: r.isCorrect,
        explanation: r.explanation,
        timeSpent: r.timeSpent
      }))
    })
  } catch (error) {
    console.error('Aptitude test submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}