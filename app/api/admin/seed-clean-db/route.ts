import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database/connection'
import { Collections } from '@/lib/database/models'

// Essential problems data (from your JSON files)
const ESSENTIAL_PROBLEMS = [
  {
    _id: '1',
    categoryId: 'arrays',
    title: 'Remove Duplicates from Sorted Array',
    description: 'Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once.',
    difficultyLevel: 'easy',
    problemStatement: 'Remove duplicates from sorted array in-place.',
    sampleInput: 'nums = [1,1,2]',
    sampleOutput: '2',
    testCases: [
      { input: { nums: [1,1,2] }, output: 2 },
      { input: { nums: [0,0,1,1,1,2,2,3,3,4] }, output: 5 }
    ],
    createdAt: new Date()
  },
  {
    _id: '2',
    categoryId: 'arrays',
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficultyLevel: 'easy',
    problemStatement: 'Find two numbers that add up to target.',
    sampleInput: 'nums = [2,7,11,15], target = 9',
    sampleOutput: '[0,1]',
    testCases: [
      { input: { nums: [2,7,11,15], target: 9 }, output: [0,1] },
      { input: { nums: [3,2,4], target: 6 }, output: [1,2] },
      { input: { nums: [3,3], target: 6 }, output: [0,1] },
      { input: { nums: [1,2,3,4,5], target: 9 }, output: [3,4] },
      { input: { nums: [-1,-2,-3,-4,-5], target: -8 }, output: [2,4] }
    ],
    createdAt: new Date()
  },
  {
    _id: '3',
    categoryId: 'arrays',
    title: 'Contains Duplicate',
    description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
    difficultyLevel: 'easy',
    problemStatement: 'Check if array contains any duplicate elements.',
    sampleInput: 'nums = [1,2,3,1]',
    sampleOutput: 'true',
    testCases: [
      { input: { nums: [1,2,3,1] }, output: true },
      { input: { nums: [1,2,3,4] }, output: false },
      { input: { nums: [1,1,1,3,3,4,3,2,4,2] }, output: true },
      { input: { nums: [1] }, output: false },
      { input: { nums: [1,5,-2,-4,0] }, output: false }
    ],
    createdAt: new Date()
  },
  {
    _id: '4',
    categoryId: 'arrays',
    title: 'Move Zeroes',
    description: 'Given an integer array nums, move all 0\'s to the end of it while maintaining the relative order of the non-zero elements.',
    difficultyLevel: 'easy',
    problemStatement: 'Move all zeros to the end while maintaining relative order of non-zero elements.',
    sampleInput: 'nums = [0,1,0,3,12]',
    sampleOutput: '[1,3,12,0,0]',
    testCases: [
      { input: { nums: [0,1,0,3,12] }, output: [1,3,12,0,0] },
      { input: { nums: [0] }, output: [0] },
      { input: { nums: [1,2,3] }, output: [1,2,3] },
      { input: { nums: [0,0,1] }, output: [1,0,0] },
      { input: { nums: [2,1] }, output: [2,1] }
    ],
    createdAt: new Date()
  },
  {
    _id: '5',
    categoryId: 'arrays',
    title: 'Intersection of Two Arrays II',
    description: 'Given two integer arrays nums1 and nums2, return an array of their intersection.',
    difficultyLevel: 'easy',
    problemStatement: 'Find intersection of two arrays.',
    sampleInput: 'nums1 = [1,2,2,1], nums2 = [2,2]',
    sampleOutput: '[2,2]',
    testCases: [
      { input: { nums1: [1,2,2,1], nums2: [2,2] }, output: [2,2] },
      { input: { nums1: [4,9,5], nums2: [9,4,9,8,4] }, output: [4,9] }
    ],
    createdAt: new Date()
  }
]

export async function POST() {
  try {
    const db = await getDatabase()
    
    console.log('🌱 Seeding clean database with essential problems...')
    
    // Clear existing problems
    await db.collection(Collections.CODING_PROBLEMS).deleteMany({})
    console.log('🧹 Cleared existing problems')
    
    // Insert essential problems
    const result = await db.collection(Collections.CODING_PROBLEMS).insertMany(ESSENTIAL_PROBLEMS)
    console.log(`✅ Inserted ${result.insertedCount} problems`)
    
    // Verify insertion
    const count = await db.collection(Collections.CODING_PROBLEMS).countDocuments()
    
    return NextResponse.json({
      success: true,
      message: `✅ Successfully seeded ${count} problems into clean database`,
      problems: ESSENTIAL_PROBLEMS.map(p => ({ id: p._id, title: p.title }))
    })
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to seed database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const db = await getDatabase()
    
    const collections = await db.listCollections().toArray()
    const problemCount = await db.collection(Collections.CODING_PROBLEMS).countDocuments()
    
    return NextResponse.json({
      success: true,
      database: 'interviewace_clean',
      collections: collections.map(c => c.name),
      problemCount,
      status: 'Ready for seeding'
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Database not accessible',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}