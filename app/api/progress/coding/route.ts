import { NextRequest, NextResponse } from 'next/server'
import { ProgressService } from '@/lib/services/progress-service-mongo'

// Submit coding solution
export async function POST(request: NextRequest) {
  try {
    const submission = await request.json()

    const requiredFields = ['userId', 'problemId', 'programmingLanguage', 'sourceCode', 'status', 'testCasesPassed', 'totalTestCases']
    for (const field of requiredFields) {
      if (!submission[field] && submission[field] !== 0) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    const submissionId = await ProgressService.submitCode(submission)

    return NextResponse.json({ submissionId, success: true })
  } catch (error) {
    console.error('Error submitting code:', error)
    return NextResponse.json(
      { error: 'Failed to submit code' },
      { status: 500 }
    )
  }
}

// Get coding submission history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const problemId = searchParams.get('problemId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      )
    }

    const history = await ProgressService.getCodingSubmissionHistory(userId, problemId || undefined)

    return NextResponse.json({ history })
  } catch (error) {
    console.error('Error fetching coding submission history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coding submission history' },
      { status: 500 }
    )
  }
}