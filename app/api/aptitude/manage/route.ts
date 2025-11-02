import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { getDatabase } from '@/lib/dbConnect'
import { AptitudeQuestion } from '@/lib/database/models'
import { ObjectId } from 'mongodb'

// GET - Fetch questions with filtering and pagination
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
    const difficulty = searchParams.get('difficulty')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')

    const db = await getDatabase()
    const questionsCollection = db.collection<AptitudeQuestion>('aptitudeQuestions')

    // Build query
    let query: any = {}
    if (categoryId) query.categoryId = categoryId
    if (difficulty) query.difficultyLevel = difficulty
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { explanation: { $regex: search, $options: 'i' } }
      ]
    }

    // Get total count for pagination
    const totalQuestions = await questionsCollection.countDocuments(query)
    const totalPages = Math.ceil(totalQuestions / limit)
    const skip = (page - 1) * limit

    // Fetch questions
    const questions = await questionsCollection
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      questions,
      pagination: {
        currentPage: page,
        totalPages,
        totalQuestions,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Questions fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new question
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
      question,
      options,
      correctAnswer,
      explanation,
      difficultyLevel
    } = await request.json()

    // Validation
    if (!categoryId || !question || !options || !Array.isArray(options) || 
        options.length !== 4 || correctAnswer < 0 || correctAnswer > 3 || 
        !difficultyLevel) {
      return NextResponse.json({ 
        error: 'Invalid question data. Required: categoryId, question, 4 options, correctAnswer (0-3), difficultyLevel' 
      }, { status: 400 })
    }

    const db = await getDatabase()
    const questionsCollection = db.collection<AptitudeQuestion>('aptitudeQuestions')

    const newQuestion: Omit<AptitudeQuestion, '_id'> = {
      categoryId,
      question: question.trim(),
      options: options.map((opt: string) => opt.trim()),
      correctAnswer,
      explanation: explanation?.trim() || '',
      difficultyLevel,
      createdAt: new Date()
    }

    const result = await questionsCollection.insertOne(newQuestion)

    return NextResponse.json({
      message: 'Question created successfully',
      questionId: result.insertedId,
      question: { ...newQuestion, _id: result.insertedId }
    })
  } catch (error) {
    console.error('Question creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update existing question
export async function PUT(request: NextRequest) {
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
      categoryId,
      question,
      options,
      correctAnswer,
      explanation,
      difficultyLevel
    } = await request.json()

    if (!questionId || !ObjectId.isValid(questionId)) {
      return NextResponse.json({ error: 'Valid question ID is required' }, { status: 400 })
    }

    const db = await getDatabase()
    const questionsCollection = db.collection<AptitudeQuestion>('aptitudeQuestions')

    // Build update object
    const updateData: any = {}
    if (categoryId) updateData.categoryId = categoryId
    if (question) updateData.question = question.trim()
    if (options && Array.isArray(options) && options.length === 4) {
      updateData.options = options.map((opt: string) => opt.trim())
    }
    if (correctAnswer >= 0 && correctAnswer <= 3) updateData.correctAnswer = correctAnswer
    if (explanation !== undefined) updateData.explanation = explanation.trim()
    if (difficultyLevel) updateData.difficultyLevel = difficultyLevel

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const result = await questionsCollection.updateOne(
      { _id: new ObjectId(questionId) } as any,
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Question updated successfully',
      modifiedCount: result.modifiedCount
    })
  } catch (error) {
    console.error('Question update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete question
export async function DELETE(request: NextRequest) {
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
    const questionId = searchParams.get('questionId')

    if (!questionId || !ObjectId.isValid(questionId)) {
      return NextResponse.json({ error: 'Valid question ID is required' }, { status: 400 })
    }

    const db = await getDatabase()
    const questionsCollection = db.collection<AptitudeQuestion>('aptitudeQuestions')

    const result = await questionsCollection.deleteOne({
      _id: new ObjectId(questionId)
    } as any)

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Question deleted successfully',
      deletedCount: result.deletedCount
    })
  } catch (error) {
    console.error('Question deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}