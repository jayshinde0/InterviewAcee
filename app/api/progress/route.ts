import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from '@/lib/auth'
import { getDatabase } from '@/lib/mongodb'
import { UserProgress } from '@/lib/models/User'
import { ObjectId } from 'mongodb'

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
    const progress = db.collection<UserProgress>('userProgress')

    const userProgress = await progress.find({ userId: user._id }).toArray()
    
    // Convert to the format expected by the frontend
    const progressMap: Record<number, 'solved' | 'attempted' | 'unsolved'> = {}
    userProgress.forEach(p => {
      progressMap[p.problemId] = p.status
    })

    return NextResponse.json({ progress: progressMap })
  } catch (error) {
    console.error('Progress fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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

    const { problemId, status, isCorrect, code, language, executionTime, memory } = await request.json()

    const db = await getDatabase()
    const progress = db.collection<UserProgress>('userProgress')

    const now = new Date()
    const existingProgress = await progress.findOne({
      userId: user._id,
      problemId: parseInt(problemId)
    })

    if (existingProgress) {
      // Update existing progress
      const updateData: any = {
        status,
        isCorrect,
        lastAttemptAt: now,
        updatedAt: now,
        attempts: existingProgress.attempts + 1
      }

      // Update best submission if this is better or first correct solution
      if (isCorrect && (!existingProgress.bestSubmission || !existingProgress.isCorrect)) {
        updateData.bestSubmission = {
          code,
          language,
          executionTime: executionTime || 0,
          memory: memory || 0,
          submittedAt: now
        }
      }

      await progress.updateOne(
        { _id: existingProgress._id },
        { $set: updateData }
      )
    } else {
      // Create new progress entry
      const newProgress: UserProgress = {
        userId: user._id!,
        problemId: parseInt(problemId),
        status,
        isCorrect,
        attempts: 1,
        lastAttemptAt: now,
        createdAt: now,
        updatedAt: now
      }

      if (isCorrect) {
        newProgress.bestSubmission = {
          code,
          language,
          executionTime: executionTime || 0,
          memory: memory || 0,
          submittedAt: now
        }
      }

      await progress.insertOne(newProgress)
    }

    return NextResponse.json({ message: 'Progress updated successfully' })
  } catch (error) {
    console.error('Progress update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
