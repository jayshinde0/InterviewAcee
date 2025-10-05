import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database/connection'
import { Collections } from '@/lib/database/models'
import { ObjectId } from 'mongodb'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: problemId } = await params

    if (!problemId) {
      return NextResponse.json(
        { error: 'Missing problem ID' },
        { status: 400 }
      )
    }

    let problem: any = null
    let usingFallback = false

    // Skip MongoDB entirely for now - use local JSON files
    console.warn('Using local JSON files only (MongoDB overloaded)')
    usingFallback = true
    
    // Load from local JSON files
    try {
      const arrayFilePath = path.join(process.cwd(), 'data', 'array.json')
      const arrayContent = fs.readFileSync(arrayFilePath, 'utf8')
      const arrayData = JSON.parse(arrayContent)
      
      problem = arrayData.problems?.find((p: any) => p.id === parseInt(problemId))
      
      if (!problem) {
        // Try detailed-problems.json
        const detailedFilePath = path.join(process.cwd(), 'data', 'detailed-problems.json')
        const detailedContent = fs.readFileSync(detailedFilePath, 'utf8')
        const detailedData = JSON.parse(detailedContent)
        
        // Search through all categories
        for (const category of detailedData.categories || []) {
          const foundProblem = category.problems?.find((p: any) => p.id === parseInt(problemId))
          if (foundProblem) {
            problem = foundProblem
            break
          }
        }
      }
    } catch (jsonError) {
      console.error('Error loading problem from JSON:', jsonError)
    }

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      )
    }

    // Convert problem to the format expected by the frontend
    const formattedProblem = usingFallback ? {
      id: problem.id,
      title: problem.title,
      category: 'Array',
      difficulty: problem.difficulty,
      status: problem.status || 'unsolved',
      description: problem.description,
      examples: problem.examples || [],
      constraints: problem.constraints || [],
      testCases: problem.testCases || [],
      hint: problem.description
    } : {
      id: parseInt(problemId),
      title: problem.title,
      category: 'Array',
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
    }

    return NextResponse.json({ 
      problem: formattedProblem,
      success: true,
      source: usingFallback ? 'json' : 'mongodb'
    })
  } catch (error) {
    console.error('Error fetching problem:', error)
    return NextResponse.json(
      { error: 'Failed to fetch problem' },
      { status: 500 }
    )
  }
}