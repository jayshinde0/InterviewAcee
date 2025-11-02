import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { getDatabase } from '@/lib/dbConnect'

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

    const db = await getDatabase()
    const submissions = db.collection('userCodingSubmissionsStorage')

    // Get all submissions for this user
    const allSubmissions = await submissions
      .find({
        $or: [
          { userId: user._id },
          { userId: user.email }
        ]
      })
      .sort({ submittedAt: -1 })
      .toArray()

    // Get submissions for specific problem if provided
    let problemSubmissions = []
    if (problemId) {
      problemSubmissions = await submissions
        .find({
          $and: [
            {
              $or: [
                { userId: user._id },
                { userId: user.email }
              ]
            },
            {
              $or: [
                { problemId: parseInt(problemId) },
                { problemId: problemId }
              ]
            }
          ]
        })
        .sort({ submittedAt: -1 })
        .toArray()
    }

    return NextResponse.json({
      user: {
        _id: user._id,
        email: user.email
      },
      problemId: problemId,
      totalSubmissions: allSubmissions.length,
      problemSubmissions: problemSubmissions.length,
      allSubmissions: allSubmissions.map(s => ({
        _id: s._id,
        problemId: s.problemId,
        userId: s.userId,
        status: s.status,
        submittedAt: s.submittedAt
      })),
      problemSubmissionsData: problemSubmissions.map(s => ({
        _id: s._id,
        problemId: s.problemId,
        userId: s.userId,
        status: s.status,
        submittedAt: s.submittedAt
      }))
    })
  } catch (error) {
    console.error('Debug submissions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}