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
    
    // Validate ObjectId format first
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ 
        error: `Invalid submission ID format: "${id}". Must be a 24 character hex string.` 
      }, { status: 400 })
    }
    
    const sessionToken = request.cookies.get('session')?.value
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await validateSession(sessionToken)
    if (!user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const db = await getDatabase()
    const submissions = db.collection<CodeSubmission>('userCodingSubmissionsStorage')

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
    
    // Validate ObjectId format first
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ 
        error: `Invalid submission ID format: "${id}". Must be a 24 character hex string.` 
      }, { status: 400 })
    }
    
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
    const submissions = db.collection<CodeSubmission>('userCodingSubmissionsStorage')

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
    console.log('DELETE request for submission ID:', id)
    
    // Validate ObjectId format first
    if (!ObjectId.isValid(id)) {
      console.log('Invalid ObjectId format:', id)
      return NextResponse.json({ 
        error: `Invalid submission ID format: "${id}". Must be a 24 character hex string.`,
        validFormat: 'Example: 507f1f77bcf86cd799439011'
      }, { status: 400 })
    }
    
    const sessionToken = request.cookies.get('session')?.value
    if (!sessionToken) {
      console.log('No session token found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await validateSession(sessionToken)
    if (!user) {
      console.log('Invalid session')
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    console.log('User validated:', user.email)

    const db = await getDatabase()
    const submissions = db.collection<CodeSubmission>('userCodingSubmissionsStorage')

    // First, check if the submission exists
    const existingSubmission = await submissions.findOne({
      _id: new ObjectId(id)
    })
    
    console.log('Existing submission:', existingSubmission ? 'Found' : 'Not found')
    if (existingSubmission) {
      console.log('Submission userId:', existingSubmission.userId)
      console.log('Current user _id:', user._id)
      console.log('Current user email:', user.email)
    }

    const deleteQuery = {
      _id: new ObjectId(id),
      $or: [
        { userId: user._id },
        { userId: user.email as any }
      ]
    }
    
    console.log('Delete query:', JSON.stringify(deleteQuery, null, 2))

    const result = await submissions.deleteOne(deleteQuery)
    
    console.log('Delete result:', result)

    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        error: 'Submission not found or unauthorized',
        debug: {
          submissionExists: !!existingSubmission,
          userMatch: existingSubmission ? 
            (existingSubmission.userId?.toString() === user._id?.toString() || existingSubmission.userId?.toString() === user.email) : 
            false
        }
      }, { status: 404 })
    }

    return NextResponse.json({ 
      message: 'Submission deleted successfully',
      success: true 
    })
  } catch (error) {
    console.error('Submission delete error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}