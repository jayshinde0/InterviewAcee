# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://jayshinde4554_db_user:70AX06LpKQTcysoT@cluster0.ychu9gs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret (change this to a secure random string in production)
JWT_SECRET=your-super-secure-jwt-secret-key-change-this-in-production

# Node Environment
NODE_ENV=development
```

## Important Notes:

1. **Never commit `.env.local` to version control** - it contains sensitive credentials
2. **Change JWT_SECRET** - Use a secure random string in production
3. **Database Name** - The application uses database name `interviewace`
4. **MongoDB Collections** - The following collections will be created automatically:
   - `users` - User accounts and preferences
   - `userProgress` - Problem solving progress
   - `codeSubmissions` - Code submissions and playground history
   - `userSessions` - Authentication sessions
   - `aptitudeProgress` - Aptitude test progress

## Setup Instructions:

1. Copy the above environment variables to `.env.local`
2. Replace the JWT_SECRET with a secure random string
3. Restart your development server
4. The MongoDB connection and authentication system will be ready to use

## Database Schema:

The application will automatically create the necessary indexes and collections when first accessed. No manual database setup is required.
