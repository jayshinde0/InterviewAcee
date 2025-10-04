import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database/connection'

// Collections to keep (only coding-related)
const ESSENTIAL_COLLECTIONS = [
  'users',
  'codingProblems', 
  'userCodingSubmissions',
  'userProblemProgress',
  'userProgressStats',
  'userActivityLog'
]

// Collections to remove (aptitude and interview related)
const COLLECTIONS_TO_REMOVE = [
  'aptitudeCategories',
  'aptitudeQuestions', 
  'userAptitudeSessions',
  'userAptitudeAnswers',
  'codingCategories',
  'interviewTypes',
  'interviewQuestions',
  'userInterviewSessions', 
  'userInterviewResponses'
]

export async function POST() {
  try {
    const db = await getDatabase()
    
    // Get list of existing collections
    const collections = await db.listCollections().toArray()
    const existingCollectionNames = collections.map(c => c.name)
    
    console.log('🔍 Existing collections:', existingCollectionNames)
    
    let removedCount = 0
    const removedCollections: string[] = []
    const errors: string[] = []
    
    // Remove unnecessary collections
    for (const collectionName of COLLECTIONS_TO_REMOVE) {
      if (existingCollectionNames.includes(collectionName)) {
        try {
          await db.collection(collectionName).drop()
          removedCollections.push(collectionName)
          removedCount++
          console.log(`✅ Dropped collection: ${collectionName}`)
        } catch (error) {
          const errorMsg = `Failed to drop ${collectionName}: ${error instanceof Error ? error.message : 'Unknown error'}`
          errors.push(errorMsg)
          console.log(`❌ ${errorMsg}`)
        }
      } else {
        console.log(`ℹ️  Collection ${collectionName} doesn't exist`)
      }
    }
    
    // Get updated collection list
    const updatedCollections = await db.listCollections().toArray()
    const remainingCollections = updatedCollections.map(c => c.name)
    
    console.log('🎉 Cleanup completed!')
    console.log('📊 Remaining collections:', remainingCollections)
    
    return NextResponse.json({
      success: true,
      message: `✅ Database cleanup completed! Removed ${removedCount} collections.`,
      removedCollections,
      remainingCollections,
      essentialCollections: ESSENTIAL_COLLECTIONS,
      errors: errors.length > 0 ? errors : undefined,
      connectionsSaved: `Estimated ${removedCount * 10-20} connections freed up`
    })
    
  } catch (error) {
    console.error('❌ Database cleanup error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to cleanup database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET endpoint to see current collections without removing anything
export async function GET() {
  try {
    const db = await getDatabase()
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map(c => c.name)
    
    const unnecessary = collectionNames.filter(name => 
      COLLECTIONS_TO_REMOVE.includes(name)
    )
    
    return NextResponse.json({
      success: true,
      currentCollections: collectionNames,
      unnecessaryCollections: unnecessary,
      essentialCollections: ESSENTIAL_COLLECTIONS,
      canRemove: unnecessary.length
    })
    
  } catch (error) {
    console.error('Error checking collections:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to check collections',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}