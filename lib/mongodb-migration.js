// MongoDB Migration Script for User Schema Simplification
// Run this script to migrate from complex nested User schema to simplified schema

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/interviewace';

async function migrateUserSchema() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Get all users
    const users = await usersCollection.find({}).toArray();
    console.log(`Found ${users.length} users to migrate`);
    
    // Backup existing users
    const backupCollection = db.collection('users_backup');
    if (users.length > 0) {
      await backupCollection.insertMany(users);
      console.log('Backup created in users_backup collection');
    }
    
    // Migrate each user
    for (const user of users) {
      const migratedUser = {
        _id: user._id,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email,
        password: user.password,
        bio: user.bio || user.profile?.bio || "",
        location: user.location || user.profile?.location?.city || "",
        website: user.website || user.professional?.portfolio?.website || "",
        github: user.github || user.professional?.portfolio?.github || user.socialLinks?.github || "",
        linkedin: user.linkedin || user.professional?.portfolio?.linkedin || user.socialLinks?.linkedin || "",
        profilePhoto: user.profilePhoto || user.avatar || "",
        createdAt: user.createdAt || new Date(),
        updatedAt: new Date()
      };
      
      // Update the user with simplified schema
      await usersCollection.replaceOne(
        { _id: user._id },
        migratedUser
      );
    }
    
    console.log('Migration completed successfully');
    console.log('Original data backed up in users_backup collection');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
  }
}

// Run migration
if (require.main === module) {
  migrateUserSchema()
    .then(() => {
      console.log('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateUserSchema };
