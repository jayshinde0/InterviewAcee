import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database/connection'
import { Collections } from '@/lib/database/models'
import fs from 'fs'
import path from 'path'

// Fallback function to load problems from local JSON files
async function loadProblemsFromJSON(categoryId: string) {
  try {
    let filePath: string
    
    // Map category IDs to file names
    switch (categoryId) {
      case 'arrays':
      case 'array':
        filePath = path.join(process.cwd(), 'data', 'array.json')
        break
      default:
        // For other categories, try to load from detailed-problems.json
        filePath = path.join(process.cwd(), 'data', 'detailed-problems.json')
        break
    }

    const fileContent = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContent)
    
    if (categoryId === 'arrays' || categoryId === 'array') {
      // For array.json format
      return data.problems || []
    } else {
      // For detailed-problems.json format
      const category = data.categories?.find((cat: any) => 
        cat.id === categoryId || cat.name.toLowerCase().includes(categoryId.toLowerCase())
      )
      return category?.problems || []
    }
  } catch (error) {
    console.error('Error loading problems from JSON:', error)
    return []
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params

    console.log('Fetching problems for category:', categoryId)

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Missing category ID' },
        { status: 400 }
      )
    }

    let problems: any[] = []
    let usingFallback = false

    try {
      // Try MongoDB first (clean database)
      const db = await getDatabase()
      // Handle category ID variations (array vs arrays)
      const categoryQuery = categoryId === 'array' ? 'arrays' : categoryId
      
      const mongoProblems = await db.collection(Collections.CODING_PROBLEMS)
        .find({ categoryId: categoryQuery })
        .sort({ _id: 1 })
        .toArray()

      console.log(`Found ${mongoProblems.length} problems for category ${categoryId} from MongoDB`)

      // Convert MongoDB problems to the format expected by the frontend
      problems = mongoProblems.map(problem => ({
        id: parseInt(problem._id.toString().slice(-1)),
        title: problem.title,
        category: (categoryId === 'arrays' || categoryId === 'array') ? 'Array' : 
                 categoryId === 'strings' ? 'String' : 
                 categoryId === 'linked-lists' ? 'Linked List' : 
                 categoryId === 'trees' ? 'Tree' : 
                 categoryId === 'dynamic-programming' ? 'Dynamic Programming' : 
                 'Array', // Default to Array for now
        difficulty: problem.difficultyLevel === 'easy' ? 'Easy' : 
                   problem.difficultyLevel === 'medium' ? 'Medium' : 'Hard',
        status: 'unsolved',
        description: problem.description,
        examples: [
          {
            input: problem.sampleInput,
            output: problem.sampleOutput,
            explanation: problem.problemStatement
          }
        ],
        constraints: problem.constraints ? [problem.constraints] : [],
        testCases: problem.testCases || [],
        hint: problem.problemStatement
      }))
    } catch (dbError) {
      console.warn('MongoDB connection failed, using local JSON fallback:', dbError)
      usingFallback = true
      
      // Load from local JSON files
      const jsonProblems = await loadProblemsFromJSON(categoryId)
      
      // Convert JSON problems to the expected format
      problems = jsonProblems.map((problem: any) => ({
        id: problem.id,
        title: problem.title,
        category: 'Array', // Default for now
        difficulty: problem.difficulty,
        status: problem.status || 'unsolved',
        description: problem.description,
        examples: problem.examples || [],
        constraints: problem.constraints || [],
        testCases: problem.testCases || [],
        hint: problem.description
      }))
      
      console.log(`Found ${problems.length} problems for category ${categoryId} from JSON files`)
    }

    return NextResponse.json({ 
      problems,
      success: true,
      source: usingFallback ? 'json' : 'mongodb'
    })
  } catch (error) {
    console.error('Error fetching problems by category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch problems' },
      { status: 500 }
    )
  }
}