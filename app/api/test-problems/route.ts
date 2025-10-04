import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database/connection'
import { Collections } from '@/lib/database/models'

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()

    // Check if problems exist
    const problemCount = await db.collection(Collections.CODING_PROBLEMS).countDocuments()
    const problems = await db.collection(Collections.CODING_PROBLEMS).find({}).limit(5).toArray()

    return NextResponse.json({ 
      totalProblems: problemCount,
      sampleProblems: problems,
      success: true 
    })
  } catch (error) {
    console.error('Error checking problems:', error)
    return NextResponse.json(
      { error: 'Failed to check problems' },
      { status: 500 }
    )
  }
}