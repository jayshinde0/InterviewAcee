import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database/connection'
import { Collections } from '@/lib/database/models'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      )
    }

    const db = await getDatabase()

    // Get user's problem progress
    const progress = await db.collection(Collections.USER_PROBLEM_PROGRESS)
      .find({ userId })
      .toArray()

    // Convert to a map for easy lookup
    const progressMap: Record<string, string> = {}
    progress.forEach(p => {
      progressMap[p.problemId] = p.status
    })

    return NextResponse.json({ 
      progress: progressMap,
      success: true 
    })
  } catch (error) {
    console.error('Error fetching user problem progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user problem progress' },
      { status: 500 }
    )
  }
}