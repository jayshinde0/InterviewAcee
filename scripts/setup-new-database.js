// Script to set up a new clean database with only essential collections
const { MongoClient } = require('mongodb');

// Only essential collections for coding practice
const ESSENTIAL_COLLECTIONS = {
  users: {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["email", "createdAt"],
        properties: {
          email: { bsonType: "string" },
          firstName: { bsonType: "string" },
          lastName: { bsonType: "string" },
          createdAt: { bsonType: "date" },
          updatedAt: { bsonType: "date" }
        }
      }
    }
  },
  
  codingProblems: {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["_id", "title", "description", "difficultyLevel"],
        properties: {
          _id: { bsonType: "string" },
          categoryId: { bsonType: "string" },
          title: { bsonType: "string" },
          description: { bsonType: "string" },
          difficultyLevel: { enum: ["easy", "medium", "hard"] },
          problemStatement: { bsonType: "string" },
          sampleInput: { bsonType: "string" },
          sampleOutput: { bsonType: "string" },
          testCases: { bsonType: "array" },
          createdAt: { bsonType: "date" }
        }
      }
    }
  },
  
  userCodingSubmissions: {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "problemId", "sourceCode", "status"],
        properties: {
          userId: { bsonType: "string" },
          problemId: { bsonType: "string" },
          programmingLanguage: { bsonType: "string" },
          sourceCode: { bsonType: "string" },
          status: { enum: ["accepted", "wrong_answer", "time_limit_exceeded", "runtime_error", "compilation_error"] },
          testCasesPassed: { bsonType: "int" },
          totalTestCases: { bsonType: "int" },
          submittedAt: { bsonType: "date" }
        }
      }
    }
  },
  
  userProblemProgress: {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId", "problemId", "status"],
        properties: {
          userId: { bsonType: "string" },
          problemId: { bsonType: "string" },
          status: { enum: ["not_attempted", "attempted", "solved"] },
          attemptsCount: { bsonType: "int" },
          firstAttemptedAt: { bsonType: "date" },
          solvedAt: { bsonType: "date" }
        }
      }
    }
  },
  
  userProgressStats: {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["userId"],
        properties: {
          userId: { bsonType: "string" },
          codingProblemsSolved: { bsonType: "int" },
          codingProblemsAttempted: { bsonType: "int" },
          codingTotalSubmissions: { bsonType: "int" },
          codingAcceptedSubmissions: { bsonType: "int" },
          totalStudyTimeMinutes: { bsonType: "int" },
          currentStreakDays: { bsonType: "int" },
          updatedAt: { bsonType: "date" }
        }
      }
    }
  }
};

async function setupNewDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    return;
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 5, // Small pool for setup
    serverSelectionTimeoutMS: 5000
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('interviewace_clean'); // New database name
    
    console.log('🧹 Setting up clean database...');
    
    // Create collections with validation
    for (const [collectionName, options] of Object.entries(ESSENTIAL_COLLECTIONS)) {
      try {
        await db.createCollection(collectionName, options);
        console.log(`✅ Created collection: ${collectionName}`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`ℹ️  Collection ${collectionName} already exists`);
        } else {
          console.error(`❌ Error creating ${collectionName}:`, error.message);
        }
      }
    }
    
    // Create indexes for better performance
    console.log('📊 Creating indexes...');
    
    // User email index
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    console.log('✅ Created users email index');
    
    // Problem progress indexes
    await db.collection('userProblemProgress').createIndex({ userId: 1, problemId: 1 }, { unique: true });
    await db.collection('userCodingSubmissions').createIndex({ userId: 1, problemId: 1 });
    await db.collection('userProgressStats').createIndex({ userId: 1 }, { unique: true });
    console.log('✅ Created progress indexes');
    
    // Show final state
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log('\n🎉 NEW DATABASE SETUP COMPLETE!');
    console.log('📋 Collections created:', collectionNames);
    console.log('🔗 Database name: interviewace_clean');
    console.log('💡 Update your MONGODB_URI to use this database');
    
  } catch (error) {
    console.error('❌ Error during setup:', error);
  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

setupNewDatabase();