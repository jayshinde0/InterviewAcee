import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database/connection'
import { Collections } from '@/lib/database/models'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    // Only allow seeding in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Problem seeding not allowed in production' },
        { status: 403 }
      )
    }

    const db = await getDatabase()

    // Sample coding problems - 15 total with 5 Array problems
    const sampleProblems = [
      // Array Problems (5)
      {
        _id: '1',
        categoryId: 'arrays',
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
        difficultyLevel: 'easy',
        problemStatement: 'Find two numbers in the array that add up to the target sum.',
        inputFormat: 'Array of integers and target integer',
        outputFormat: 'Array of two indices',
        constraints: '2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9, -10^9 <= target <= 10^9, Only one valid answer exists.',
        sampleInput: 'nums = [2,7,11,15], target = 9',
        sampleOutput: '[0,1]',
        testCases: [
          { input: { nums: [2, 7, 11, 15], target: 9 }, output: [0, 1] },
          { input: { nums: [3, 2, 4], target: 6 }, output: [1, 2] },
          { input: { nums: [3, 3], target: 6 }, output: [0, 1] },
          { input: { nums: [1, 5, 3, 7, 9], target: 12 }, output: [2, 4] },
          { input: { nums: [-1, -2, -3, -4, -5], target: -8 }, output: [2, 4] }
        ],
        timeLimitSeconds: 30,
        memoryLimitMb: 256,
        tags: ['array', 'hash-table'],
        createdAt: new Date()
      },
      {
        _id: '2',
        categoryId: 'arrays',
        title: 'Best Time to Buy and Sell Stock II',
        description: 'You are given an integer array prices where prices[i] is the price of a given stock on the ith day.\n\nOn each day, you may decide to buy and/or sell the stock. You can only hold at most one share of the stock at any time. However, you can buy it then immediately sell it on the same day.\n\nFind and return the maximum profit you can achieve.',
        difficultyLevel: 'medium',
        problemStatement: 'Find the maximum profit you can achieve from buying and selling stock multiple times.',
        inputFormat: 'Array of stock prices',
        outputFormat: 'Maximum profit integer',
        constraints: '1 <= prices.length <= 3 * 10^4, 0 <= prices[i] <= 10^4',
        sampleInput: 'prices = [7,1,5,3,6,4]',
        sampleOutput: '7',
        testCases: [
          { input: { prices: [7, 1, 5, 3, 6, 4] }, output: 7 },
          { input: { prices: [1, 2, 3, 4, 5] }, output: 4 },
          { input: { prices: [7, 6, 4, 3, 1] }, output: 0 },
          { input: { prices: [1, 2, 1, 2, 1] }, output: 2 },
          { input: { prices: [2, 4, 1] }, output: 2 }
        ],
        timeLimitSeconds: 30,
        memoryLimitMb: 256,
        tags: ['array', 'greedy'],
        createdAt: new Date()
      },
      {
        _id: '3',
        categoryId: 'arrays',
        title: 'Contains Duplicate',
        description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
        difficultyLevel: 'easy',
        problemStatement: 'Check if array contains any duplicate elements.',
        inputFormat: 'Array of integers',
        outputFormat: 'Boolean true/false',
        constraints: '1 <= nums.length <= 10^5, -10^9 <= nums[i] <= 10^9',
        sampleInput: 'nums = [1,2,3,1]',
        sampleOutput: 'true',
        testCases: [
          { input: { nums: [1, 2, 3, 1] }, output: true },
          { input: { nums: [1, 2, 3, 4] }, output: false },
          { input: { nums: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2] }, output: true },
          { input: { nums: [1] }, output: false },
          { input: { nums: [1, 5, -2, -4, 0] }, output: false }
        ],
        timeLimitSeconds: 30,
        memoryLimitMb: 256,
        tags: ['array', 'hash-table'],
        createdAt: new Date()
      },
      {
        _id: '4',
        categoryId: 'arrays',
        title: 'Move Zeroes',
        description: 'Given an integer array nums, move all 0\'s to the end of it while maintaining the relative order of the non-zero elements. Note that you must do this in-place without making a copy of the array.',
        difficultyLevel: 'easy',
        problemStatement: 'Move all zeros to the end while maintaining relative order of non-zero elements.',
        inputFormat: 'Array of integers',
        outputFormat: 'Array modified in-place',
        constraints: '1 <= nums.length <= 10^4, -2^31 <= nums[i] <= 2^31 - 1',
        sampleInput: 'nums = [0,1,0,3,12]',
        sampleOutput: '[1,3,12,0,0]',
        testCases: [
          { input: { nums: [0, 1, 0, 3, 12] }, output: [1, 3, 12, 0, 0] },
          { input: { nums: [0] }, output: [0] },
          { input: { nums: [1, 2, 3] }, output: [1, 2, 3] },
          { input: { nums: [0, 0, 1] }, output: [1, 0, 0] },
          { input: { nums: [2, 1] }, output: [2, 1] }
        ],
        timeLimitSeconds: 30,
        memoryLimitMb: 256,
        tags: ['array', 'two-pointers'],
        createdAt: new Date()
      },
      {
        _id: '5',
        categoryId: 'arrays',
        title: 'Remove Duplicates from Sorted Array',
        description: 'Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same.\n\nSince it is impossible to change the length of the array in some languages, you must instead have the result be placed in the first part of the array nums. More formally, if there are k elements after removing the duplicates, then the first k elements of nums should hold the final result. It does not matter what you leave beyond the first k elements.\n\nReturn k after placing the final result in the first k slots of nums.\n\nDo not allocate extra space for another array. You must do this by modifying the input array in-place with O(1) extra memory.',
        difficultyLevel: 'easy',
        problemStatement: 'Remove duplicates from sorted array in-place and return the new length.',
        inputFormat: 'Sorted array of integers',
        outputFormat: 'Length of array after removing duplicates',
        constraints: '1 <= nums.length <= 3 * 10^4, -100 <= nums[i] <= 100, nums is sorted in non-decreasing order.',
        sampleInput: 'nums = [1,1,2]',
        sampleOutput: '2',
        testCases: [
          { input: { nums: [1, 1, 2] }, output: 2 },
          { input: { nums: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4] }, output: 5 },
          { input: { nums: [1, 1, 1] }, output: 1 },
          { input: { nums: [1, 2, 3, 4, 5] }, output: 5 },
          { input: { nums: [-3, -1, 0, 0, 0, 3, 3] }, output: 4 }
        ],
        timeLimitSeconds: 30,
        memoryLimitMb: 256,
        tags: ['array', 'two-pointers'],
        createdAt: new Date()
      },
      
      // String Problems (3)
      {
        _id: '6',
        categoryId: 'strings',
        title: 'Valid Parentheses',
        description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
        difficultyLevel: 'easy',
        problemStatement: 'Check if parentheses are properly matched and nested.',
        inputFormat: 'String containing parentheses',
        outputFormat: 'Boolean true/false',
        constraints: '1 <= s.length <= 10^4, s consists of parentheses only',
        sampleInput: 's = "()[]{}"',
        sampleOutput: 'true',
        testCases: [
          { input: { s: "()" }, output: true },
          { input: { s: "()[]{}" }, output: true },
          { input: { s: "(]" }, output: false }
        ],
        timeLimitSeconds: 30,
        memoryLimitMb: 256,
        tags: ['string', 'stack'],
        createdAt: new Date()
      },
      {
        _id: '7',
        categoryId: 'strings',
        title: 'Longest Common Prefix',
        description: 'Write a function to find the longest common prefix string amongst an array of strings.',
        difficultyLevel: 'easy',
        problemStatement: 'Find the longest common prefix among strings.',
        inputFormat: 'Array of strings',
        outputFormat: 'Longest common prefix string',
        constraints: '1 <= strs.length <= 200, 0 <= strs[i].length <= 200',
        sampleInput: 'strs = ["flower","flow","flight"]',
        sampleOutput: '"fl"',
        testCases: [
          { input: { strs: ["flower", "flow", "flight"] }, output: "fl" },
          { input: { strs: ["dog", "racecar", "car"] }, output: "" }
        ],
        timeLimitSeconds: 30,
        memoryLimitMb: 256,
        tags: ['string'],
        createdAt: new Date()
      },
      {
        _id: '8',
        categoryId: 'strings',
        title: 'Valid Anagram',
        description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
        difficultyLevel: 'easy',
        problemStatement: 'Check if two strings are anagrams.',
        inputFormat: 'Two strings',
        outputFormat: 'Boolean true/false',
        constraints: '1 <= s.length, t.length <= 5 * 10^4, s and t consist of lowercase English letters',
        sampleInput: 's = "anagram", t = "nagaram"',
        sampleOutput: 'true',
        testCases: [
          { input: { s: "anagram", t: "nagaram" }, output: true },
          { input: { s: "rat", t: "car" }, output: false }
        ],
        timeLimitSeconds: 30,
        memoryLimitMb: 256,
        tags: ['hash-table', 'string', 'sorting'],
        createdAt: new Date()
      },

      // Linked List Problems (2)
      {
        _id: '9',
        categoryId: 'linked-lists',
        title: 'Reverse Linked List',
        description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
        difficultyLevel: 'easy',
        problemStatement: 'Reverse a singly linked list.',
        inputFormat: 'Head of linked list',
        outputFormat: 'Head of reversed linked list',
        constraints: 'The number of nodes in the list is the range [0, 5000], -5000 <= Node.val <= 5000',
        sampleInput: 'head = [1,2,3,4,5]',
        sampleOutput: '[5,4,3,2,1]',
        testCases: [
          { input: { head: [1, 2, 3, 4, 5] }, output: [5, 4, 3, 2, 1] },
          { input: { head: [1, 2] }, output: [2, 1] },
          { input: { head: [] }, output: [] }
        ],
        timeLimitSeconds: 30,
        memoryLimitMb: 256,
        tags: ['linked-list', 'recursion'],
        createdAt: new Date()
      },
      {
        _id: '10',
        categoryId: 'linked-lists',
        title: 'Merge Two Sorted Lists',
        description: 'You are given the heads of two sorted linked lists list1 and list2.',
        difficultyLevel: 'easy',
        problemStatement: 'Merge two sorted linked lists into one sorted list.',
        inputFormat: 'Two sorted linked list heads',
        outputFormat: 'Head of merged sorted linked list',
        constraints: 'The number of nodes in both lists is in the range [0, 50], -100 <= Node.val <= 100',
        sampleInput: 'list1 = [1,2,4], list2 = [1,3,4]',
        sampleOutput: '[1,1,2,3,4,4]',
        testCases: [
          { input: { list1: [1, 2, 4], list2: [1, 3, 4] }, output: [1, 1, 2, 3, 4, 4] },
          { input: { list1: [], list2: [] }, output: [] }
        ],
        timeLimitSeconds: 30,
        memoryLimitMb: 256,
        tags: ['linked-list', 'recursion'],
        createdAt: new Date()
      },

      // Tree Problems (2)
      {
        _id: '11',
        categoryId: 'trees',
        title: 'Maximum Depth of Binary Tree',
        description: 'Given the root of a binary tree, return its maximum depth.',
        difficultyLevel: 'easy',
        problemStatement: 'Find the maximum depth of a binary tree.',
        inputFormat: 'Root of binary tree',
        outputFormat: 'Integer depth',
        constraints: 'The number of nodes in the tree is in the range [0, 10^4], -100 <= Node.val <= 100',
        sampleInput: 'root = [3,9,20,null,null,15,7]',
        sampleOutput: '3',
        testCases: [
          { input: { root: [3, 9, 20, null, null, 15, 7] }, output: 3 },
          { input: { root: [1, null, 2] }, output: 2 }
        ],
        timeLimitSeconds: 30,
        memoryLimitMb: 256,
        tags: ['tree', 'depth-first-search', 'binary-tree'],
        createdAt: new Date()
      },
      {
        _id: '12',
        categoryId: 'trees',
        title: 'Same Tree',
        description: 'Given the roots of two binary trees p and q, write a function to check if they are the same or not.',
        difficultyLevel: 'easy',
        problemStatement: 'Check if two binary trees are identical.',
        inputFormat: 'Two binary tree roots',
        outputFormat: 'Boolean true/false',
        constraints: 'The number of nodes in both trees is in the range [0, 100], -10^4 <= Node.val <= 10^4',
        sampleInput: 'p = [1,2,3], q = [1,2,3]',
        sampleOutput: 'true',
        testCases: [
          { input: { p: [1, 2, 3], q: [1, 2, 3] }, output: true },
          { input: { p: [1, 2], q: [1, null, 2] }, output: false }
        ],
        timeLimitSeconds: 30,
        memoryLimitMb: 256,
        tags: ['tree', 'depth-first-search', 'binary-tree'],
        createdAt: new Date()
      },

      // Dynamic Programming Problems (2)
      {
        _id: '13',
        categoryId: 'dynamic-programming',
        title: 'Climbing Stairs',
        description: 'You are climbing a staircase. It takes n steps to reach the top.',
        difficultyLevel: 'easy',
        problemStatement: 'Find number of distinct ways to climb n stairs.',
        inputFormat: 'Integer n',
        outputFormat: 'Number of ways',
        constraints: '1 <= n <= 45',
        sampleInput: 'n = 3',
        sampleOutput: '3',
        testCases: [
          { input: { n: 2 }, output: 2 },
          { input: { n: 3 }, output: 3 }
        ],
        timeLimitSeconds: 30,
        memoryLimitMb: 256,
        tags: ['math', 'dynamic-programming', 'memoization'],
        createdAt: new Date()
      },
      {
        _id: '14',
        categoryId: 'dynamic-programming',
        title: 'House Robber',
        description: 'You are a professional robber planning to rob houses along a street.',
        difficultyLevel: 'medium',
        problemStatement: 'Find maximum money you can rob without robbing adjacent houses.',
        inputFormat: 'Array of house values',
        outputFormat: 'Maximum money',
        constraints: '1 <= nums.length <= 100, 0 <= nums[i] <= 400',
        sampleInput: 'nums = [2,7,9,3,1]',
        sampleOutput: '12',
        testCases: [
          { input: { nums: [1, 2, 3, 1] }, output: 4 },
          { input: { nums: [2, 7, 9, 3, 1] }, output: 12 }
        ],
        timeLimitSeconds: 30,
        memoryLimitMb: 256,
        tags: ['array', 'dynamic-programming'],
        createdAt: new Date()
      },

      // Math Problems (1)
      {
        _id: '15',
        categoryId: 'mathematics',
        title: 'Palindrome Number',
        description: 'Given an integer x, return true if x is palindrome integer.',
        difficultyLevel: 'easy',
        problemStatement: 'Check if a number is palindrome.',
        inputFormat: 'Integer x',
        outputFormat: 'Boolean true/false',
        constraints: '-2^31 <= x <= 2^31 - 1',
        sampleInput: 'x = 121',
        sampleOutput: 'true',
        testCases: [
          { input: { x: 121 }, output: true },
          { input: { x: -121 }, output: false },
          { input: { x: 10 }, output: false }
        ],
        timeLimitSeconds: 30,
        memoryLimitMb: 256,
        tags: ['math'],
        createdAt: new Date()
      }
    ]

    // Insert problems
    for (const problem of sampleProblems) {
      // Convert string ID to ObjectId for MongoDB
      const problemWithObjectId = {
        ...problem,
        _id: new ObjectId(`00000000000000000000000${problem._id}`)
      }
      
      await db.collection(Collections.CODING_PROBLEMS).updateOne(
        { _id: problemWithObjectId._id },
        { $setOnInsert: problemWithObjectId },
        { upsert: true }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: `${sampleProblems.length} sample problems seeded successfully` 
    })
  } catch (error) {
    console.error('Error seeding problems:', error)
    return NextResponse.json(
      { error: 'Failed to seed problems' },
      { status: 500 }
    )
  }
}