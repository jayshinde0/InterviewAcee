import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { getDatabase } from '@/lib/dbConnect'
import { CodeSubmission } from '@/lib/models/User'
import { ObjectId } from 'mongodb'

// GET - Get a specific submission
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sessionToken = request.cookies.get('session')?.value
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await validateSession(sessionToken)
    if (!user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const db = await getDatabase()
    const submissions = db.collection<CodeSubmission>('codeSubmissions')

    const submission = await submissions.findOne({
      _id: new ObjectId(id),
      $or: [
        { userId: user._id },
        { userId: user.email as any }
      ]
    })

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    return NextResponse.json({ submission })
  } catch (error) {
    console.error('Submission fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update a submission
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sessionToken = request.cookies.get('session')?.value
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await validateSession(sessionToken)
    if (!user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const updateData = await request.json()
    const db = await getDatabase()
    const submissions = db.collection<CodeSubmission>('codeSubmissions')

    // Only allow updating certain fields
    const allowedFields = ['code', 'language', 'status', 'executionTime', 'memory', 'testResults']
    const updateFields: any = {}
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updateFields[field] = updateData[field]
      }
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    updateFields.updatedAt = new Date()

    const result = await submissions.updateOne(
      {
        _id: new ObjectId(id),
        $or: [
          { userId: user._id },
          { userId: user.email as any }
        ]
      },
      { $set: updateFields }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Submission not found or unauthorized' }, { status: 404 })
    }

    return NextResponse.json({ 
      message: 'Submission updated successfully',
      success: true 
    })
  } catch (error) {
    console.error('Submission update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete a specific submission
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sessionToken = request.cookies.get('session')?.value
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await validateSession(sessionToken)
    if (!user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const db = await getDatabase()
    const submissions = db.collection<CodeSubmission>('codeSubmissions')

    const result = await submissions.deleteOne({
      _id: new ObjectId(id),
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