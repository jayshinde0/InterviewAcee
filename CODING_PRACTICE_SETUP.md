# Coding Practice MongoDB Integration Setup

This guide explains how the coding practice now integrates with MongoDB for progress tracking.

## 🚀 Features Implemented

### **MongoDB Progress Tracking:**
- ✅ **Problem Submissions**: All code submissions are saved to MongoDB
- ✅ **Status Tracking**: Problems marked as `not_attempted`, `attempted`, or `solved`
- ✅ **Live Dashboard Updates**: Dashboard shows real-time progress from database
- ✅ **Submission History**: Complete history of all attempts per problem
- ✅ **Test Case Results**: Tracks which test cases passed/failed

### **Submission Flow:**
1. **Run Code**: Tests code against sample cases (marks as `attempted`)
2. **Submit Code**: 
   - If all test cases pass → Status: `solved` (accepted)
   - If some test cases fail → Status: `attempted` (wrong_answer)
   - If runtime error → Status: `attempted` (runtime_error)

## 🔧 Setup Instructions

### 1. Initialize Database (Optional)
```bash
# Initialize MongoDB collections and indexes
curl -X POST http://localhost:3000/api/init-db

# Seed sample problems for testing
curl -X POST http://localhost:3000/api/seed-problems
```

### 2. Test the Integration

1. **Go to Practice Page**: `/practice`
   - Should show live stats from MongoDB
   - Initially shows 0 problems solved

2. **Solve a Problem**: `/practice/problem/1`
   - Write code and click "Submit"
   - If all test cases pass, problem marked as solved
   - Dashboard updates automatically

3. **Check Dashboard**: `/dashboard`
   - Should show updated problem count
   - Coding stats reflect MongoDB data

## 📊 Database Collections Used

### **User Coding Submissions** (`userCodingSubmissions`)
```javascript
{
  userId: "user123",
  problemId: "1", 
  programmingLanguage: "cpp",
  sourceCode: "class Solution { ... }",
  status: "accepted", // or "wrong_answer", "runtime_error"
  executionTimeMs: 85,
  memoryUsedKb: 1024,
  testCasesPassed: 3,
  totalTestCases: 3,
  submittedAt: new Date()
}
```

### **User Problem Progress** (`userProblemProgress`)
```javascript
{
  userId: "user123",
  problemId: "1",
  status: "solved", // "not_attempted", "attempted", "solved"
  bestSubmissionId: "submission123",
  attemptsCount: 2,
  firstAttemptedAt: new Date(),
  solvedAt: new Date(),
  bestExecutionTimeMs: 85
}
```

### **User Progress Stats** (`userProgressStats`)
```javascript
{
  userId: "user123",
  codingProblemsSolved: 5,
  codingProblemsAttempted: 8,
  codingTotalSubmissions: 15,
  codingAcceptedSubmissions: 5,
  // ... other stats
  updatedAt: new Date()
}
```

## 🎯 How It Works

### **When User Submits Code:**

1. **Code Execution**: Test cases run against user's code
2. **MongoDB Submission**: 
   ```typescript
   await submitCode({
     problemId: "1",
     programmingLanguage: "cpp",
     sourceCode: userCode,
     status: allTestsPassed ? "accepted" : "wrong_answer",
     testCasesPassed: passedCount,
     totalTestCases: totalCount
   })
   ```

3. **Progress Update**: 
   - Updates `userProblemProgress` collection
   - Recalculates `userProgressStats`
   - Logs activity in `userActivityLog`

4. **Dashboard Refresh**: Live stats update automatically

### **Status Logic:**
- **First attempt**: Creates new progress record
- **Subsequent attempts**: Updates attempt count
- **All tests pass**: Marks as `solved`, updates `solvedAt`
- **Best performance**: Tracks fastest execution time

## 🔍 Testing Scenarios

### **Test Case 1: First Submission**
1. Go to `/practice/problem/1`
2. Submit working code
3. Check: Problem marked as solved
4. Check: Dashboard shows +1 problem solved

### **Test Case 2: Failed Submission**
1. Submit code with bugs
2. Check: Problem marked as attempted (not solved)
3. Check: Dashboard shows attempted but not solved

### **Test Case 3: Multiple Attempts**
1. Submit failing code first
2. Then submit working code
3. Check: Attempt count increases
4. Check: Final status is solved

### **Test Case 4: Dashboard Integration**
1. Solve multiple problems
2. Check: Dashboard stats update in real-time
3. Check: Activity history shows submissions

## 🐛 Troubleshooting

### **Problems Not Saving:**
- Check MongoDB connection in console
- Verify user is authenticated (`user.id` exists)
- Check API endpoints are responding

### **Dashboard Not Updating:**
- Check `useProgress` hook is working
- Verify API calls to `/api/progress/stats`
- Check browser network tab for errors

### **Test Cases Not Running:**
- Verify problem has test cases defined
- Check console for test runner errors
- Ensure code syntax is valid

## 📈 Future Enhancements

- **Leaderboards**: Compare progress with other users
- **Difficulty Tracking**: Separate stats by Easy/Medium/Hard
- **Time Tracking**: Measure time spent per problem
- **Code Reviews**: Save and review past submissions
- **Hints System**: Progressive hints for stuck users

The coding practice is now fully integrated with MongoDB and provides comprehensive progress tracking! 🎉