// Utility functions for aptitude test progress tracking

export interface QuestionResult {
  questionId: string
  selectedAnswer?: string
  correctAnswer: string
  isCorrect: boolean
  timeSpent: number
}

export interface TestSubmission {
  testId: string
  testName: string
  category: string
  totalQuestions: number
  questionResults: QuestionResult[]
  totalTimeSpent: number
}

export async function submitAptitudeTest(submission: TestSubmission) {
  const correctAnswers = submission.questionResults.filter(q => q.isCorrect).length
  const incorrectAnswers = submission.questionResults.filter(q => !q.isCorrect && q.selectedAnswer).length
  const skippedQuestions = submission.questionResults.filter(q => !q.selectedAnswer).length

  const testData = {
    testId: submission.testId,
    testName: submission.testName,
    category: submission.category,
    totalQuestions: submission.totalQuestions,
    correctAnswers,
    incorrectAnswers,
    skippedQuestions,
    timeSpent: submission.totalTimeSpent,
    questionResults: submission.questionResults
  }

  try {
    const response = await fetch('/api/aptitude/test-progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })

    if (!response.ok) {
      throw new Error('Failed to submit test progress')
    }

    const result = await response.json()
    return {
      success: true,
      score: result.score,
      testId: result.testId,
      correctAnswers,
      totalQuestions: submission.totalQuestions
    }
  } catch (error) {
    console.error('Error submitting test progress:', error)
    return {
      success: false,
      error: 'Failed to save test progress'
    }
  }
}

export async function getAptitudeTestProgress(category?: string) {
  try {
    const url = category 
      ? `/api/aptitude/test-progress?category=${encodeURIComponent(category)}`
      : '/api/aptitude/test-progress'
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error('Failed to fetch test progress')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching test progress:', error)
    return {
      tests: [],
      stats: {
        totalTests: 0,
        averageScore: 0,
        bestScore: 0,
        totalTimeSpent: 0,
        categoryStats: {}
      }
    }
  }
}

export function calculateTestScore(questionResults: QuestionResult[]): number {
  const correctAnswers = questionResults.filter(q => q.isCorrect).length
  return Math.round((correctAnswers / questionResults.length) * 100)
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function generateTestId(category: string, timestamp: number): string {
  return `${category.toLowerCase().replace(/\s+/g, '-')}-${timestamp}`
}
