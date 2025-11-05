import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { getDatabase } from '@/lib/dbConnect'
import { ObjectId } from 'mongodb'

// GET - Fetch all users
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

    // Check if user has admin privileges
    if (user.role !== 'admin' && user.email !== 'jayshinde4554@gmail.com') {
      return NextResponse.json({ error: 'Access denied. Admin privileges required.' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const db = await getDatabase()
    const usersCollection = db.collection('users')

    // Build search query
    let query: any = {}
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    // Get total count for pagination
    const totalUsers = await usersCollection.countDocuments(query)
    const totalPages = Math.ceil(totalUsers / limit)
    const skip = (page - 1) * limit

    // Fetch users (exclude password field)
    const users = await usersCollection
      .find(query, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Users fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete a user
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

    // Check if user has admin privileges
    if (user.role !== 'admin' && user.email !== 'jayshinde4554@gmail.com') {
      return NextResponse.json({ error: 'Access denied. Admin privileges required.' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Valid user ID is required' }, { status: 400 })
    }

    // Prevent self-deletion
    if (userId === user._id?.toString()) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection('users')

    const result = await usersCollection.deleteOne({
      _id: new ObjectId(userId)
    } as any)

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'User deleted successfully',
      deletedCount: result.deletedCount
    })
  } catch (error) {
    console.error('User deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}