import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/dbConnect'

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const questionsCollection = db.collection('aptitudeQuestions')
    
    // Count dynamic questions
    const dynamicCount = await questionsCollection.countDocuments({ categoryId: 'dynamic' })
    
    // Get sample dynamic questions
    const sampleQuestions = await questionsCollection
      .find({ categoryId: 'dynamic' })
      .limit(5)
      .toArray()
    
    return NextResponse.json({
      success: true,
      dynamicQuestionsCount: dynamicCount,
      sampleQuestions: sampleQuestions.map(q => ({
        question: q.question,
        difficulty: q.difficultyLevel,
        options: q.options
      }))
    })
  } catch (error) {
    console.error('Verify dynamic questions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}