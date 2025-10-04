# Setup Problems for Coding Practice

## 🚀 Quick Setup

### 1. Initialize Database and Seed Problems
```bash
# Initialize MongoDB collections and indexes
curl -X POST http://localhost:3000/api/init-db

# Seed 15 sample problems (5 Array problems)
curl -X POST http://localhost:3000/api/seed-problems
```

### 2. Verify Setup
1. Go to `/practice` - Should show 15 total problems
2. Go to `/practice/category/arrays` - Should show 5 Array problems
3. All problems should show status "Unsolved" initially

## 📊 Problem Distribution

### **Total: 15 Problems**
- **Arrays (5)**: Two Sum, Best Time to Buy and Sell Stock II, Rotate Array, Contains Duplicate, Remove Duplicates from Sorted Array
- **Strings (3)**: Valid Parentheses, Longest Common Prefix, Valid Anagram  
- **Linked Lists (2)**: Reverse Linked List, Merge Two Sorted Lists
- **Trees (2)**: Maximum Depth of Binary Tree, Same Tree
- **Dynamic Programming (2)**: Climbing Stairs, House Robber
- **Math (1)**: Palindrome Number

### **Difficulty Distribution**
- **Easy**: 10 problems
- **Medium**: 4 problems  
- **Hard**: 1 problem

## 🎯 Testing the Features

### **Test Problem Status Tracking:**
1. Go to `/practice/category/arrays`
2. All problems show "Unsolved" status
3. Click "Start" on "Two Sum" problem
4. Submit working code → Status changes to "Solved"
5. "History" button appears for solved problems

### **Test Submission History:**
1. Solve a problem multiple times with different code
2. Click "History" button next to solved problem
3. Should show:
   - All submission attempts
   - Submission timestamps (e.g., 2025-10-04T17:34:28.144+00:00)
   - Status (Accepted/Wrong Answer/Runtime Error)
   - Test cases passed/failed
   - Source code for each submission
   - Execution time and memory usage

### **Test Dashboard Integration:**
1. Solve several problems
2. Go to `/dashboard`
3. Should show updated "Problems Solved" count
4. Should show coding progress statistics

## 🔧 Problem Structure

Each problem includes:
- **Title & Description**: Clear problem statement
- **Difficulty Level**: Easy/Medium/Hard
- **Test Cases**: Multiple test cases for validation
- **Constraints**: Input/output constraints
- **Sample Input/Output**: Example cases
- **Tags**: Categorization tags

## 📝 Example Problem Entry

```javascript
{
  _id: '1',
  categoryId: 'arrays',
  title: 'Two Sum',
  description: 'Given an array of integers nums and an integer target...',
  difficultyLevel: 'easy',
  testCases: [
    { input: { nums: [2, 7, 11, 15], target: 9 }, output: [0, 1] },
    { input: { nums: [3, 2, 4], target: 6 }, output: [1, 2] }
  ],
  tags: ['array', 'hash-table'],
  createdAt: new Date()
}
```

## 🎉 Ready to Use!

After setup, users can:
- ✅ Browse 15 problems across 6 categories
- ✅ See all problems marked as "Unsolved" initially  
- ✅ Submit code and get real-time status updates
- ✅ View complete submission history for solved problems
- ✅ Track progress on dashboard with live MongoDB data

The coding practice system is now fully functional with comprehensive progress tracking! 🚀