import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { validateSession } from '@/lib/auth'
import { User } from '@/lib/models/User'

function calculateProfileCompleteness(profileData: any): number {
  let completedFields = 0
  let totalFields = 8 // Essential fields only

  // Essential profile fields
  if (profileData.firstName) completedFields++
  if (profileData.lastName) completedFields++
  if (profileData.profilePhoto) completedFields++
  if (profileData.bio) completedFields++
  if (profileData.location) completedFields++
  if (profileData.website) completedFields++
  if (profileData.github) completedFields++
  if (profileData.linkedin) completedFields++

  return Math.round((completedFields / totalFields) * 100)
}

export async function PUT(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session')?.value
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await validateSession(sessionToken)
    if (!user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const db = await getDatabase()
    const users = db.collection<User>('users')
    const body = await request.json()

    // Create refined schema update - only essential fields (no nested objects)
    const refinedUser = {
      _id: user._id,
      firstName: body.firstName || "",
      lastName: body.lastName || "",
      email: user.email, // Keep existing email (not editable in profile)
      password: user.password, // Keep existing password (not editable in profile)
      bio: body.bio || "",
      location: body.location || "",
      website: body.website || "",
      github: body.github || "",
      linkedin: body.linkedin || "",
      profilePhoto: body.profilePhoto || "",
      createdAt: user.createdAt || new Date(),
      updatedAt: new Date()
    }

    // Calculate profile completeness based on refined schema
    const profileCompleteness = calculateProfileCompleteness(refinedUser)

    // Replace the entire user document with refined schema (prunes old fields)
    const result = await users.replaceOne(
      { _id: user._id },
      refinedUser
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      success: true,
      profileCompleteness
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
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

    const db = await getDatabase()
    const users = db.collection<User>('users')

    // Get complete user profile
    const userProfile = await users.findOne(
      { _id: user._id },
      { 
        projection: { 
          password: 0 // Exclude password from response
        } 
      }
    )

    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(userProfile)

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
