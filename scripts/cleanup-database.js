// Simple script to clean up MongoDB collections
const { MongoClient } = require('mongodb');

// Collections to keep (only coding-related)
const KEEP_COLLECTIONS = [
  'users',
  'codingProblems', 
  'userCodingSubmissions',
  'userProblemProgress',
  'userProgressStats',
  'userActivityLog'
];

// Collections to remove
const REMOVE_COLLECTIONS = [
  'aptitudeCategories',
  'aptitudeQuestions', 
  'userAptitudeSessions',
  'userAptitudeAnswers',
  'codingCategories',
  'interviewTypes',
  'interviewQuestions',
  'userInterviewSessions', 
  'userInterviewResponses'
];

async function cleanupDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found in environment variables');
    return;
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('interviewace');
    
    // Get current collections
    const collections = await db.listCollections().toArray();
    const existingNames = collections.map(c => c.name);
    
    console.log('Current collections:', existingNames);
    console.log('Collections to remove:', REMOVE_COLLECTIONS);
    
    let removedCount = 0;
    
    // Remove unnecessary collections
    for (const collectionName of REMOVE_COLLECTIONS) {
      if (existingNames.includes(collectionName)) {
        try {
          await db.collection(collectionName).drop();
          console.log(`✅ Removed: ${collectionName}`);
          removedCount++;
        } catch (error) {
          console.log(`⚠️  Could not remove ${collectionName}:`, error.message);
        }
      } else {
        console.log(`ℹ️  Collection ${collectionName} doesn't exist`);
      }
    }
    
    // Show final state
    const finalCollections = await db.listCollections().toArray();
    const finalNames = finalCollections.map(c => c.name);
    
    console.log('\n=== CLEANUP COMPLETE ===');
    console.log(`Removed ${removedCount} collections`);
    console.log('Remaining collections:', finalNames);
    console.log('✅ Database cleanup successful!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

cleanupDatabase();