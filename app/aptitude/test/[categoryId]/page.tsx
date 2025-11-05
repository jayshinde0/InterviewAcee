"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DashboardLayout } from "@/components/dashboard-layout"
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  ArrowRight, 
  Flag,
  RefreshCw,
  AlertCircle
} from "lucide-react"

interface Question {
  _id: string
  categoryId: string
  question: string
  options: string[]
  difficultyLevel: string
}

interface Answer {
  questionId: string
  selectedAnswer: number
  timeSpent: number
}

export default function AptitudeTestPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const router = useRouter()
  const [categoryId, setCategoryId] = useState<string>("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [timeLeft, setTimeLeft] = useState(1200) // 20 minutes in seconds
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [results, setResults] = useState<any>(null)

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setCategoryId(resolvedParams.categoryId)
      fetchQuestions(resolvedParams.categoryId)
    }
    getParams()
  }, [params])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (testStarted && timeLeft > 0 && !testCompleted) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitTest()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [testStarted, timeLeft, testCompleted])

  const fetchQuestions = async (catId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/aptitude/questions?categoryId=${catId}&limit=20`)
      if (response.ok) {
        const data = await response.json()
        setQuestions(data.questions)
        // Initialize answers array
        setAnswers(data.questions.map((q: Question) => ({
          questionId: q._id,
          selectedAnswer: -1,
          timeSpent: 0
        })))
      } else {
        console.error('Failed to fetch questions')
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setAnswers(prev => prev.map((answer, index) => 
      index === currentQuestionIndex 
        ? { ...answer, selectedAnswer: answerIndex }
        : answer
    ))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmitTest = async () => {
    setSubmitting(true)
    try {
      const response = await fetch('/api/aptitude/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId,
          answers,
          totalTimeSpent: 1200 - timeLeft
        })
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data)
        setTestCompleted(true)
      } else {
        console.error('Failed to submit test')
        alert('Failed to submit test. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting test:', error)
      alert('Error submitting test. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getAnsweredCount = () => {
    return answers.filter(answer => answer.selectedAnswer !== -1).length
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading test questions...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (questions.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto" />
            <h2 className="text-2xl font-bold">No Questions Available</h2>
            <p className="text-muted-foreground">
              This category doesn't have any questions yet.
            </p>
            <Button onClick={() => router.push('/aptitude')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (testCompleted && results) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Test Completed!</CardTitle>
              <CardDescription>Here are your results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{results.score}%</div>
                  <p className="text-muted-foreground">Overall Score</p>
                </div>
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {results.correctAnswers}/{results.totalQuestions}
                  </div>
                  <p className="text-muted-foreground">Correct Answers</p>
                </div>
                <div className="text-center p-6 border rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">
                    {formatTime(1200 - timeLeft)}
                  </div>
                  <p className="text-muted-foreground">Time Taken</p>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button onClick={() => router.push('/aptitude')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Categories
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Retake Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (!testStarted) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Ready to Start Test?</CardTitle>
              <CardDescription>
                You have {questions.length} questions to answer in 20 minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{questions.length}</div>
                  <p className="text-sm text-muted-foreground">Questions</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold">20 min</div>
                  <p className="text-sm text-muted-foreground">Time Limit</p>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Once you start, the timer will begin. Make sure you're ready!
                </p>
                <Button 
                  size="lg" 
                  onClick={() => setTestStarted(true)}
                  className="w-full"
                >
                  Start Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const currentAnswer = answers[currentQuestionIndex]

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push('/aptitude')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit Test
          </Button>
          <div className="flex items-center space-x-4">
            <Badge variant="outline">
              Question {currentQuestionIndex + 1} of {questions.length}
            </Badge>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span className={`font-mono ${timeLeft < 300 ? 'text-red-600' : ''}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{getAnsweredCount()} of {questions.length} answered</span>
          </div>
          <Progress value={(getAnsweredCount() / questions.length) * 100} />
        </div>

        {/* Question */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Question {currentQuestionIndex + 1}
              </CardTitle>
              <Badge className={
                currentQuestion.difficultyLevel === 'easy' ? 'bg-green-100 text-green-800' :
                currentQuestion.difficultyLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }>
                {currentQuestion.difficultyLevel}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg leading-relaxed">{currentQuestion.question}</p>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left border rounded-lg transition-colors ${
                    currentAnswer.selectedAnswer === index
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      currentAnswer.selectedAnswer === index
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground'
                    }`}>
                      {currentAnswer.selectedAnswer === index && (
                        <CheckCircle className="h-3 w-3" />
                      )}
                    </div>
                    <span className="flex-1">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex space-x-2">
            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={handleSubmitTest}
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {submitting ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Flag className="h-4 w-4 mr-2" />
                )}
                Submit Test
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Question Navigator */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Question Navigator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                    index === currentQuestionIndex
                      ? 'bg-primary text-primary-foreground'
                      : answers[index].selectedAnswer !== -1
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-muted text-muted-foreground border'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}