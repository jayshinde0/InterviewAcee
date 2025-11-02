import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/dbConnect'

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const categoriesCollection = db.collection('aptitudeCategories')
    const questionsCollection = db.collection('aptitudeQuestions')

    // Get all categories
    const categories = await categoriesCollection.find({}).toArray()
    
    // Get question counts for each category
    const categoryStats = await Promise.all(
      categories.map(async (category) => {
        const questions = await questionsCollection
          .find({ categoryId: category.categoryId })
          .toArray()
        
        const difficultyBreakdown = questions.reduce((acc: any, q) => {
          acc[q.difficultyLevel] = (acc[q.difficultyLevel] || 0) + 1
          return acc
        }, {})
        
        return {
          categoryId: category.categoryId,
          name: category.name,
          description: category.description,
          expectedQuestions: category.totalQuestions,
          actualQuestions: questions.length,
          difficultyBreakdown,
          sampleQuestions: questions.slice(0, 2).map(q => ({
            question: q.question,
            options: q.options,
            difficulty: q.difficultyLevel
          }))
        }
      })
    )

    const totalQuestions = await questionsCollection.countDocuments()

    return NextResponse.json({
      success: true,
      totalCategories: categories.length,
      totalQuestions,
      categoryStats
    })
  } catch (error) {
    console.error('Aptitude verification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}