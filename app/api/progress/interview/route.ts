import { NextRequest, NextResponse } from 'next/server'
import { ProgressService } from '@/lib/services/progress-service-mongo'

// Start interview session
export async function POST(request: NextRequest) {
  try {
    const { userId, typeId } = await request.json()

    if (!userId || !typeId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const sessionId = await ProgressService.startInterviewSession(userId, typeId)

    return NextResponse.json({ sessionId })
  } catch (error) {
    console.error('Error starting interview session:', error)
    return NextResponse.json(
      { error: 'Failed to start interview session' },
      { status: 500 }
    )
  }
}

// Submit interview response
export async function PUT(request: NextRequest) {
  try {
    const response = await request.json()

    const requiredFields = ['userId', 'sessionId', 'questionId', 'response', 'rating', 'timeTaken']
    for (const field of requiredFields) {
      if (!response[field] && response[field] !== 0) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    await ProgressService.submitInterviewResponse(response)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error submitting interview response:', error)
    return NextResponse.json(
      { error: 'Failed to submit interview response' },
      { status: 500 }
    )
  }
}

// Complete interview session
export async function PATCH(request: NextRequest) {
  try {
    const { sessionId, overallRating, feedback, durationMinutes } = await request.json()

    if (!sessionId || !overallRating || !durationMinutes) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await ProgressService.completeInterviewSession(sessionId, overallRating, feedback, durationMinutes)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error completing interview session:', error)
    return NextResponse.json(
      { error: 'Failed to complete interview session' },
      { status: 500 }
    )
  }
}