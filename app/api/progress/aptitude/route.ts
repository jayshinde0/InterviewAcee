import { NextRequest, NextResponse } from 'next/server'
import { ProgressService } from '@/lib/services/progress-service-mongo'

// Start aptitude test
export async function POST(request: NextRequest) {
  try {
    const { userId, categoryId, programmingLanguage } = await request.json()

    if (!userId || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const sessionId = await ProgressService.startAptitudeTest(userId, categoryId, programmingLanguage)

    return NextResponse.json({ sessionId })
  } catch (error) {
    console.error('Error starting aptitude test:', error)
    return NextResponse.json(
      { error: 'Failed to start aptitude test' },
      { status: 500 }
    )
  }
}

// Submit aptitude test results
export async function PUT(request: NextRequest) {
  try {
    const { sessionId, testResult } = await request.json()

    if (!sessionId || !testResult) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await ProgressService.submitAptitudeTest(sessionId, testResult)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error submitting aptitude test:', error)
    return NextResponse.json(
      { error: 'Failed to submit aptitude test' },
      { status: 500 }
    )
  }
}

// Get aptitude test history
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

    const history = await ProgressService.getAptitudeTestHistory(userId)

    return NextResponse.json({ history })
  } catch (error) {
    console.error('Error fetching aptitude test history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch aptitude test history' },
      { status: 500 }
    )
  }
}