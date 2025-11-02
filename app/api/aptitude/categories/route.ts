import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { getDatabase } from '@/lib/dbConnect'

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
    const categoriesCollection = db.collection('aptitudeCategories')
    const questionsCollection = db.collection('aptitudeQuestions')

    // Get all categories
    const categories = await categoriesCollection.find({}).toArray()

    // Get question counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const questionCount = await questionsCollection.countDocuments({ 
          categoryId: category.categoryId 
        })
        
        return {
          ...category,
          actualQuestionCount: questionCount
        }
      })
    )

    return NextResponse.json({
      categories: categoriesWithCounts,
      totalCategories: categories.length
    })
  } catch (error) {
    console.error('Aptitude categories fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}