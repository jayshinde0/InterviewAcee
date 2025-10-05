import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database/connection'
import { Collections } from '@/lib/database/models'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    const problem = await db.collection(Collections.CODING_PROBLEMS).findOne({ _id: new ObjectId('000000000000000000000002') })
    
    return NextResponse.json({
      success: true,
      problem,
      testCasesCount: problem?.testCases?.length || 0,
      testCases: problem?.testCases || []
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}