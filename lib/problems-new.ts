import detailedProblemsData from "@/data/detailed-problems.json"
import problemsData from "@/data/problems.json"
import stringProblemsData from "@/data/string.json"
import recursionProblemsData from "@/data/recursion.json"
import linkedlistProblemsData from "@/data/linkedlist.json"
import treeProblemsData from "@/data/tree.json"
import graphProblemsData from "@/data/graph.json"
import heapProblemsData from "@/data/heap.json"
import dynamicprogProblemsData from "@/data/dynamicprog.json"
import stackProblemsData from "@/data/stack.json"
import arrayProblemsData from "@/data/array.json"

export type Problem = {
  id: number
  title: string
  category: string
  difficulty: "Easy" | "Medium" | "Hard"
  status: "unsolved" | "solved"
  description?: string
  examples?: Array<{
    input: string
    output: string
    explanation?: string
  }>
  constraints?: string[]
  testCases?: Array<{
    input: any
    output: any
  }>
  javaTemplate?: string
  pythonTemplate?: string
  cppTemplate?: string
  hint?: string
}

export type Category = {
  id: string
  name: string
  problems: Problem[]
}

export type TestResult = {
  caseNumber: number
  passed: boolean
  expected: any
  actual: any
  input: any
}

// Helper function to cast difficulty to proper type
function castDifficulty(difficulty: string): "Easy" | "Medium" | "Hard" {
  return difficulty as "Easy" | "Medium" | "Hard"
}

// Helper function to cast problem to proper type
function castProblem(p: any): Problem {
  return {
    ...p,
    difficulty: castDifficulty(p.difficulty),
    status: (p.status as "unsolved" | "solved") || "unsolved"
  }
}

// Convert category name to slug
export function toSlug(category: string): string {
  return category.toLowerCase().replace(/\s*\/\s*/g, "-").replace(/\s+/g, "-")
}

// Convert slug to category name
export function fromSlug(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())
}

// Get all categories from problems.json
export function getCategories(): Category[] {
  const categoryMap = new Map<string, Problem[]>()
  
  // Group problems by category from problemsData
  const problems = problemsData as any[]
  problems.forEach((problem: any) => {
    let categoryName = problem.category
    // Map "Trees" to "Tree" to avoid duplication
    if (categoryName === "Trees") {
      categoryName = "Tree"
    }
    
    const typedProblem = castProblem(problem)
    if (!categoryMap.has(categoryName)) {
      categoryMap.set(categoryName, [])
    }
    const categoryProblems = categoryMap.get(categoryName)
    if (categoryProblems) {
      categoryProblems.push(typedProblem)
    }
  })
  
  // Convert to Category objects
  const categories: Category[] = []
  categoryMap.forEach((problems, name) => {
    categories.push({
      id: toSlug(name),
      name,
      problems
    })
  })
  return categories
}

// Get all problems across all categories
export function getAllProblems(): Problem[] {
  const categories = getCategories()
  const allProblems: Problem[] = []
  
  categories.forEach(category => {
    allProblems.push(...category.problems)
  })
  
  return allProblems
}

// Get problems by category
export function getProblemsByCategory(categoryId: string): Problem[] {
  const categoryName = fromSlug(categoryId)
  
  // Special handling for String category - use separate string.json file
  if (categoryName.toLowerCase() === "string") {
    return (stringProblemsData as any).problems.map((problem: any) => castProblem({
      ...problem,
      category: "String",
      status: "unsolved"
    }))
  }
  
  // Special handling for Recursion category - use separate recursion.json file
  if (categoryName.toLowerCase() === "recursion") {
    return (recursionProblemsData as any).problems.map((problem: any) => castProblem({
      ...problem,
      category: "Recursion",
      status: "unsolved"
    }))
  }
  
  // Special handling for Linked List category - use separate linkedlist.json file
  if (categoryName.toLowerCase() === "linked list") {
    return (linkedlistProblemsData as any).problems.map((problem: any) => castProblem({
      ...problem,
      category: "Linked List",
      status: "unsolved"
    }))
  }
  
  // Special handling for Tree category - use separate tree.json file (overrides problems.json)
  if (categoryName.toLowerCase() === "tree" || categoryName.toLowerCase() === "trees") {
    return (treeProblemsData as any).problems.map((problem: any) => castProblem({
      ...problem,
      category: "Tree",
      status: "unsolved"
    }))
  }
  
  // Special handling for Graph category - use separate graph.json file (overrides problems.json)
  if (categoryName.toLowerCase() === "graph") {
    return (graphProblemsData as any).problems.map((problem: any) => castProblem({
      ...problem,
      category: "Graph",
      status: "unsolved"
    }))
  }
  
  // Special handling for Heap category - use separate heap.json file (limit to 20 problems)
  if (categoryName.toLowerCase() === "heap") {
    return (heapProblemsData as any).problems.map((problem: any) => castProblem({
      ...problem,
      category: "Heap",
      status: "unsolved"
    }))
  }
  
  // Special handling for Dynamic Programming category - use separate dynamicprog.json file
  if (categoryName.toLowerCase() === "dynamic programming") {
    return (dynamicprogProblemsData as any).problems.map((problem: any) => castProblem({
      ...problem,
      category: "Dynamic Programming",
      status: "unsolved"
    }))
  }
  
  // Special handling for Stack category - use separate stack.json file
  if (categoryName.toLowerCase() === "stack") {
    return (stackProblemsData as any).problems.map((problem: any) => castProblem({
      ...problem,
      category: "Stack",
      status: "unsolved"
    }))
  }
  
  // Special handling for Array category - use separate array.json file
  if (categoryName.toLowerCase() === "array") {
    const arrayData = arrayProblemsData as any
    return arrayData.problems.map((problem: any) => castProblem({
      ...problem,
      category: "Array",
      status: "unsolved"
    }))
  }
  
  return (problemsData as any[]).filter((p: any) => p.category === categoryName).map(castProblem)
}

// Get problem by ID
export function getProblemById(id: number): Problem | undefined {
  // Check detailed problems first
  const detailedProblem = (detailedProblemsData as any).categories
    .flatMap((cat: any) => cat.problems)
    .find((p: any) => p.id === id)
  
  if (detailedProblem) {
    return castProblem(detailedProblem)
  }
  
  // Check array problems
  const arrayData = arrayProblemsData as any
  const arrayProblem = arrayData.problems.find((p: any) => p.id === id)
  if (arrayProblem) {
    return castProblem({
      ...arrayProblem,
      category: "Array",
      status: "unsolved"
    })
  }
  
  // Check string problems
  const stringProblem = (stringProblemsData as any).problems.find((p: any) => p.id === id)
  if (stringProblem) {
    return castProblem({
      ...stringProblem,
      category: "String",
      status: "unsolved"
    })
  }
  
  // Check recursion problems
  const recursionProblem = (recursionProblemsData as any).problems.find((p: any) => p.id === id)
  if (recursionProblem) {
    return castProblem({
      ...recursionProblem,
      category: "Recursion",
      status: "unsolved"
    })
  }
  
  // Check linkedlist problems
  const linkedlistProblem = (linkedlistProblemsData as any).problems.find((p: any) => p.id === id)
  if (linkedlistProblem) {
    return castProblem({
      ...linkedlistProblem,
      category: "Linked List",
      status: "unsolved"
    })
  }
  
  // Check tree problems
  const treeProblem = (treeProblemsData as any).problems.find((p: any) => p.id === id)
  if (treeProblem) {
    return castProblem({
      ...treeProblem,
      category: "Tree",
      status: "unsolved"
    })
  }
  
  // Check graph problems
  const graphProblem = (graphProblemsData as any).problems.find((p: any) => p.id === id)
  if (graphProblem) {
    return castProblem({
      ...graphProblem,
      category: "Graph",
      status: "unsolved"
    })
  }
  
  // Check heap problems
  const heapProblem = (heapProblemsData as any).problems.find((p: any) => p.id === id)
  if (heapProblem) {
    return castProblem({
      ...heapProblem,
      category: "Heap",
      status: "unsolved"
    })
  }
  
  // Check dynamic programming problems
  const dynamicprogProblem = (dynamicprogProblemsData as any).problems.find((p: any) => p.id === id)
  if (dynamicprogProblem) {
    return castProblem({
      ...dynamicprogProblem,
      category: "Dynamic Programming",
      status: "unsolved"
    })
  }
  
  // Check stack problems
  const stackProblem = (stackProblemsData as any).problems.find((p: any) => p.id === id)
  if (stackProblem) {
    return castProblem({
      ...stackProblem,
      category: "Stack",
      status: "unsolved"
    })
  }
  
  // Fallback to basic problem data
  const basicProblem = (problemsData as any[]).find((p: any) => p.id === id)
  return basicProblem ? castProblem(basicProblem) : undefined
}

// Filter problems by difficulty
export function filterProblemsByDifficulty(problems: Problem[], difficulty: string): Problem[] {
  if (difficulty === "All") return problems
  return problems.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase())
}

// Get user progress from localStorage
export function getUserProgress(): Record<number, boolean> {
  if (typeof window === 'undefined') return {}
  const stored = localStorage.getItem('userProgress')
  return stored ? JSON.parse(stored) : {}
}

export function updateUserProgress(problemId: number, completed: boolean) {
  if (typeof window === 'undefined') return
  const progress = getUserProgress()
  progress[problemId] = completed
  localStorage.setItem('userProgress', JSON.stringify(progress))
}

// Get category stats
export function getCategoryStats() {
  const categories = getCategories()
  const progress = getUserProgress()
  
  return categories.map(category => {
    const problems = category.problems
    const total = problems.length
    const solved = problems.filter(p => progress[p.id] === true).length
    const inProgress = problems.filter(p => progress[p.id] === false).length
    
    const easy = problems.filter(p => p.difficulty === "Easy").length
    const medium = problems.filter(p => p.difficulty === "Medium").length
    const hard = problems.filter(p => p.difficulty === "Hard").length
    
    return {
      id: category.id,
      name: category.name,
      total,
      solved,
      inProgress,
      easy,
      medium,
      hard
    }
  })
}

// Get overall stats
export function getOverallStats() {
  const allProblems = getAllProblems()
  const progress = getUserProgress()
  
  const total = allProblems.length
  const solved = allProblems.filter(p => progress[p.id] === true).length
  const inProgress = allProblems.filter(p => progress[p.id] === false).length
  
  return {
    total,
    solved,
    inProgress,
    completionRate: Math.round((solved / total) * 100)
  }
}

// Get streak data
export function getStreakData() {
  if (typeof window === 'undefined') return {
    currentStreak: 0,
    maxStreak: 0,
    lastSolvedDate: null,
    totalActiveDays: 0,
    submissionsThisYear: 0
  }
  
  const streakData = localStorage.getItem('coding-streak')
  if (!streakData) {
    return {
      currentStreak: 0,
      maxStreak: 0,
      lastSolvedDate: null,
      totalActiveDays: 0,
      submissionsThisYear: 0
    }
  }
  
  const data = JSON.parse(streakData)
  return {
    currentStreak: data.currentStreak || 0,
    maxStreak: data.maxStreak || 0,
    lastSolvedDate: data.lastSolvedDate,
    totalActiveDays: data.totalActiveDays || 0,
    submissionsThisYear: data.submissionsThisYear || 0
  }
}

// Update streak when problem is solved
export function updateStreak() {
  if (typeof window === 'undefined') return {
    currentStreak: 0,
    maxStreak: 0,
    lastSolvedDate: null,
    totalActiveDays: 0,
    submissionsThisYear: 0
  }
  
  const today = new Date().toDateString()
  const streakData = getStreakData()
  
  // If already solved today, don't update
  if (streakData.lastSolvedDate === today) {
    return streakData
  }
  
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toDateString()
  
  let newCurrentStreak = 1
  
  // If solved yesterday, continue streak
  if (streakData.lastSolvedDate === yesterdayStr) {
    newCurrentStreak = streakData.currentStreak + 1
  }
  
  const newData = {
    currentStreak: newCurrentStreak,
    maxStreak: Math.max(newCurrentStreak, streakData.maxStreak),
    lastSolvedDate: today,
    totalActiveDays: streakData.totalActiveDays + 1,
    submissionsThisYear: streakData.submissionsThisYear + 1
  }
  
  localStorage.setItem('coding-streak', JSON.stringify(newData))
  return newData
}
