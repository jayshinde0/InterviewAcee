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
    const limit = parseInt(searchParams.get('limit') || '50')

    const db = await getDatabase()
    const submissions = db.collection<CodeSubmission>('codeSubmissions')

    const query: any = { 
      $or: [
        { userId: user._id },
        { userId: user.email as any } // Also match by email for backward compatibility
      ]
    }
    
    if (problemId) {
      // Check for both string and integer versions of problemId
      query.$and = query.$and || []
      query.$and.push({
        $or: [
          { problemId: parseInt(problemId) },
          { problemId: problemId } // Also check string version
        ]
      })
    }
    if (isPlayground !== undefined) {
      query.isPlayground = isPlayground
    }

    console.log('Submissions query:', JSON.stringify(query, null, 2))
    
    const userSubmissions = await submissions
      .find(query)
      .sort({ submittedAt: -1 })
      .limit(limit)
      .toArray()

    console.log(`Found ${userSubmissions.length} submissions for user ${user.email}`)
    if (problemId) {
      console.log(`Filtered by problemId: ${problemId}`)
    }

    return NextResponse.json({ 
      submissions: userSubmissions,
      history: userSubmissions // Also return as 'history' for backward compatibility
    })
  } catch (error) {
    console.error('Submissions fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Remove a submission
export async function DELETE(request: NextRequest) {
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
    const submissionId = searchParams.get('id')

    if (!submissionId) {
      return NextResponse.json({ error: 'Missing submission ID' }, { status: 400 })
    }

    const db = await getDatabase()
    const submissions = db.collection<CodeSubmission>('codeSubmissions')

    // Only allow users to delete their own submissions
    const result = await submissions.deleteOne({
      _id: new (require('mongodb').ObjectId)(submissionId),
      $or: [
        { userId: user._id },
        { userId: user.email as any }
      ]
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Submission not found or unauthorized' }, { status: 404 })
    }

    return NextResponse.json({ 
      message: 'Submission deleted successfully',
      success: true 
    })
  } catch (error) {
    console.error('Submission delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
