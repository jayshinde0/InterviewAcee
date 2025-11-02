import { NextRequest, NextResponse } from 'next/server'
import { ProgressService } from '@/lib/services/progress-service-mongo'
import { validateSession } from '@/lib/auth'
import { getDatabase } from '@/lib/dbConnect'
import { CodeSubmission } from '@/lib/models/User'

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

    // Forward to submissions API
    const submissionsUrl = new URL('/api/submissions', request.url)
    if (problemId) {
      submissionsUrl.searchParams.set('problemId', problemId)
    }

    const submissionsResponse = await fetch(submissionsUrl.toString(), {
      headers: {
        'Cookie': request.headers.get('Cookie') || ''
      }
    })

    if (!submissionsResponse.ok) {
      return NextResponse.json({ history: [] })
    }

    const data = await submissionsResponse.json()
    return NextResponse.json({ 
      history: data.submissions || data.history || []
    })
  } catch (error) {
    console.error('Error fetching coding submission history:', error)
    return NextResponse.json({ history: [] })
  }
}