import { NextRequest, NextResponse } from 'next/server'
import { ProgressService } from '@/lib/services/progress-service-mongo'

// Get user progress stats for dashboard
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

    const [stats, activityHistory] = await Promise.all([
      ProgressService.getUserProgressStats(userId),
      ProgressService.getUserActivityHistory(userId, 30) // Last 30 activities
    ])

    return NextResponse.json({ 
      stats,
      activityHistory,
      success: true 
    })
  } catch (error) {
    console.error('Error fetching user progress stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user progress stats' },
      { status: 500 }
    )
  }
}