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

    // Get user session to validate
    const sessionToken = request.cookies.get('session')?.value
    if (!sessionToken) {
      return NextResponse.json({ history: [] })
    }

    const user = await validateSession(sessionToken)
    if (!user) {
      return NextResponse.json({ history: [] })
    }

    // Query submissions directly from database
    const db = await getDatabase()
    const submissions = db.collection<CodeSubmission>('codeSubmissions')

    const query: any = { 
      $or: [
        { userId: user._id },
        { userId: userId } // Also check by email/string userId
      ]
    }
    
    if (problemId) {
      query.problemId = parseInt(problemId)
    }

    const userSubmissions = await submissions
      .find(query)
      .sort({ submittedAt: -1 })
      .limit(50)
      .toArray()

    return NextResponse.json({ history: userSubmissions })
  } catch (error) {
    console.error('Error fetching coding submission history:', error)
    return NextResponse.json({ history: [] })
  }
}