import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database/connection'
import { Collections } from '@/lib/database/models'
import fs from 'fs'
import path from 'path'

// Fallback function to load all problems from local JSON files
async function loadAllProblemsFromJSON() {
  try {
    const problemsFilePath = path.join(process.cwd(), 'data', 'problems.json')
    const fileContent = fs.readFileSync(problemsFilePath, 'utf8')
    const problems = JSON.parse(fileContent)
    
    return problems.map((problem: any) => ({
      id: problem.id,
      title: problem.title,
      category: problem.category,
      difficulty: problem.difficulty,
      status: problem.status || 'unsolved'
    }))
  } catch (error) {
    console.error('Error loading problems from JSON:', error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    let problems: any[] = []
    let usingFallback = false

    try {
      // Try MongoDB first
      const db = await getDatabase()
      const mongoProblems = await db.collection(Collections.CODING_PROBLEMS)
        .find({})
        .sort({ _id: 1 })
        .toArray()

      console.log(`Found ${mongoProblems.length} problems from MongoDB`)

      // Convert MongoDB problems to the format expected by the frontend
      problems = mongoProblems.map(problem => ({
        id: parseInt(problem._id.toString().slice(-1)),
        title: problem.title,
        category: 'Array', // Default for now
        difficulty: problem.difficultyLevel === 'easy' ? 'Easy' : 
                   problem.difficultyLevel === 'medium' ? 'Medium' : 'Hard',
        status: 'unsolved'
      }))
    } catch (dbError) {
      console.warn('MongoDB connection failed, using local JSON fallback:', dbError)
      usingFallback = true
      
      // Fallback to local JSON files
      problems = await loadAllProblemsFromJSON()
      console.log(`Found ${problems.length} problems from JSON fallback`)
    }

    return NextResponse.json({ 
      problems,
      success: true,
      source: usingFallback ? 'json' : 'mongodb'
    })
  } catch (error) {
    console.error('Error fetching problems:', error)
    return NextResponse.json(
      { error: 'Failed to fetch problems' },
      { status: 500 }
    )
  }
}