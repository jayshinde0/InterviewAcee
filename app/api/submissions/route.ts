import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { getDatabase } from '@/lib/dbConnect'
import { CodeSubmission } from '@/lib/models/User'

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session')?.value
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await validateSession(sessionToken)
    if (!user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const {
      problemId,
      code,
      language,
      input,
      output,
      status,
      executionTime,
      memory,
      testResults,
      isPlayground = false
    } = await request.json()

    const db = await getDatabase()
    const submissions = db.collection<CodeSubmission>('codeSubmissions')

    const submission: CodeSubmission = {
      userId: user._id!,
      problemId: problemId ? parseInt(problemId) : undefined,
      code,
      language,
      input,
      output,
      status,
      executionTime,
      memory,
      testResults,
      isPlayground,
      submittedAt: new Date()
    }

    const result = await submissions.insertOne(submission)

    return NextResponse.json({
      message: 'Submission saved successfully',
      submissionId: result.insertedId
    })
  } catch (error) {
    console.error('Submission save error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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

    const { searchParams } = new URL(request.url)
    const problemId = searchParams.get('problemId')
    const isPlayground = searchParams.get('isPlayground') === 'true'
    const limit = parseInt(searchParams.get('limit') || '10')

    const db = await getDatabase()
    const submissions = db.collection<CodeSubmission>('codeSubmissions')

    const query: any = { userId: user._id }
    if (problemId) {
      query.problemId = parseInt(problemId)
    }
    if (isPlayground !== undefined) {
      query.isPlayground = isPlayground
    }

    const userSubmissions = await submissions
      .find(query)
      .sort({ submittedAt: -1 })
      .limit(limit)
      .toArray()

    return NextResponse.json({ submissions: userSubmissions })
  } catch (error) {
    console.error('Submissions fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
