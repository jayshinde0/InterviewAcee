"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, ArrowLeft, Clock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

const aptitudeQuestions = [
  // Time and Distance Questions
  {
    id: 1,
    type: "technical",
    category: "Time and Distance",
    title: "Speed, Time and Distance Problems",
    description: "Solve problems related to speed, time, and distance calculations",
    difficulty: "Medium",
    timeEstimate: "10 minutes",
    companies: ["Google", "Microsoft", "Amazon", "TCS", "Infosys"],
    completed: false,
    questions: [
      {
        question: "A person crosses a 600 m long street in 5 minutes. What is his speed in km per hour?",
        options: ["3.6", "7.2", "8.4", "10"],
        correctAnswer: 1,
        explanation: "Speed = 600/(5×60) = 2 m/sec. Converting m/sec to km/hr: 2 × (18/5) = 7.2 km/hr.",
      },
      {
        question:
          "An aeroplane covers a certain distance at a speed of 240 kmph in 5 hours. To cover the same distance in 1⅔ hours, it must travel at a speed of:",
        options: ["300 kmph", "360 kmph", "600 kmph", "720 kmph"],
        correctAnswer: 3,
        explanation: "Distance = 240 × 5 = 1200 km. Speed = 1200/(5/3) = 1200 × 3/5 = 720 km/hr.",
      },
      {
        question:
          "If a person walks at 14 km/hr instead of 10 km/hr, he would have walked 20 km more. The actual distance travelled by him is:",
        options: ["50 km", "56 km", "70 km", "80 km"],
        correctAnswer: 0,
        explanation: "Let actual distance be x km. Then x/10 = (x+20)/14. Solving: 14x = 10x + 200, so x = 50 km.",
      },
      {
        question:
          "In a flight of 600 km, an aircraft was slowed down due to bad weather. Its average speed for the trip was reduced by 200 km/hr and the time of flight increased by 30 minutes. The duration of the flight is:",
        options: ["1 hour", "2 hours", "3 hours", "4 hours"],
        correctAnswer: 0,
        explanation: "Let duration be x hours. Then 600/x - 600/(x+0.5) = 200. Solving: 2x² + x - 3 = 0, so x = 1 hr.",
      },
      {
        question:
          "Excluding stoppages, the speed of a bus is 54 kmph and including stoppages, it is 45 kmph. For how many minutes does the bus stop per hour?",
        options: ["9", "10", "12", "20"],
        correctAnswer: 1,
        explanation: "Due to stoppages, it covers 9 km less. Time to cover 9 km = (9/54) × 60 = 10 minutes.",
      },
    ],
  },

  // Python Programming Questions
  {
    id: 2,
    type: "technical",
    category: "Python Programming",
    title: "Conditional Statements",
    description: "Test your knowledge of Python conditional statements and logic",
    difficulty: "Easy",
    timeEstimate: "8 minutes",
    companies: ["Google", "Microsoft", "Amazon", "Facebook", "Netflix"],
    completed: false,
    questions: [
      {
        question: "What is the purpose of the if statement?",
        options: [
          "To declare a variable",
          "To define a function",
          "To control the flow of a program based on a condition",
          "To create a loop",
        ],
        correctAnswer: 2,
        explanation:
          "The if statement is used to make decisions in Python. It allows you to execute a block of code if a certain condition is true.",
      },
      {
        question: "Which keyword is used to introduce the else block in an if-else statement?",
        options: ["elif", "else", "then", "or"],
        correctAnswer: 1,
        explanation:
          "In an if-else statement, the else keyword is used to define the block of code that should be executed if the condition in the if statement is false.",
      },
      {
        question:
          'What will be the output of the following code?\nx = 10\ny = 5\nif x > y:\n    print("x is greater")\nelse:\n    print("y is greater")',
        options: ["x is greater", "y is greater", "No output", "Syntax Error"],
        correctAnswer: 0,
        explanation:
          'The code compares the values of x and y using the > (greater than) operator. Since x is greater than y, the code inside the if block will be executed, printing "x is greater."',
      },
      {
        question: "Which logical operator is used to combine multiple conditions in an if statement?",
        options: ["&&", "||", "and", "in"],
        correctAnswer: 2,
        explanation:
          "The and keyword is used as the logical AND operator to combine multiple conditions in an if statement. Both conditions must be true for the combined condition to be true.",
      },
      {
        question: "In Python, how can you represent the logical NOT operator in an if statement?",
        options: ["!=", "not", "<>", "nor"],
        correctAnswer: 1,
        explanation:
          "The not keyword is used as the logical NOT operator in Python. It is used to negate the truth value of a condition.",
      },
    ],
  },

  // Additional questions from the original data...
  {
    id: 3,
    type: "verbal",
    category: "Spotting Errors",
    title: "Grammar Error Detection",
    description: "Identify grammatical errors in sentences",
    difficulty: "Easy",
    timeEstimate: "6 minutes",
    companies: ["TCS", "Infosys", "Wipro", "Accenture"],
    completed: false,
    questions: [
      {
        question: "The committee (A) have decided (B) to postpone (C) the meeting until next week. (D) No error",
        options: ["A", "B", "C", "D"],
        correctAnswer: 1,
        explanation: "The subject 'committee' is singular, so it should be 'has decided' not 'have decided'.",
      },
      {
        question: "Neither of the students (A) were able (B) to solve (C) the complex problem. (D) No error",
        options: ["A", "B", "C", "D"],
        correctAnswer: 1,
        explanation: "'Neither' is singular, so it should be 'was able' not 'were able'.",
      },
    ],
  },
]

export default function QuizPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const quizId = searchParams.get("id")
  const { user } = useAuth()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)

  const quizData = aptitudeQuestions.find((q) => q.id === Number.parseInt(quizId || "0"))

  // Function to save aptitude progress to MongoDB
  const saveAptitudeProgress = async (quizId: number, score: number, totalQuestions: number) => {
    if (!user?.email) return
    
    try {
      const response = await fetch('/api/aptitude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId,
          score,
          totalQuestions,
          percentage: Math.round((score / totalQuestions) * 100),
          timestamp: new Date().toISOString()
        }),
      })
      
      if (!response.ok) {
        console.error('Failed to save aptitude progress to database')
      }
    } catch (error) {
      console.error('Error saving aptitude progress:', error)
    }
  }

  const handleFinishQuiz = async () => {
    let correctCount = 0
    quizData?.questions.forEach((q: any, index: number) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correctCount++
      }
    })
    setScore(correctCount)
    setShowResults(true)
    
    // Save progress to database
    if (quizData) {
      await saveAptitudeProgress(quizData.id, correctCount, quizData.questions.length)
    }
  }

  useEffect(() => {
    if (!quizData) {
      router.push("/aptitude")
      return
    }

    const minutes = Number.parseInt(quizData.timeEstimate.split(" ")[0])
    setTimeRemaining(minutes * 60)
  }, [quizData, router])

  useEffect(() => {
    if (timeRemaining > 0 && !showResults) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && !showResults) {
      handleFinishQuiz()
    }
  }, [timeRemaining, showResults])

  if (!quizData) {
    return <div>Loading...</div>
  }

  const currentQuestion = quizData.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      handleFinishQuiz()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-500"
    if (percentage >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return "Excellent! Outstanding performance!"
    if (percentage >= 80) return "Great job! Very good performance!"
    if (percentage >= 70) return "Good work! Above average performance!"
    if (percentage >= 60) return "Fair performance. Keep practicing!"
    return "Needs improvement. More practice required!"
  }

  if (showResults) {
    const percentage = Math.round((score / quizData.questions.length) * 100)

    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Results Header */}
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground">Quiz Complete!</h1>
              <p className="text-xl text-muted-foreground">{quizData.title}</p>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {quizData.category}
              </Badge>
            </div>

            {/* Score Display */}
            <div className="bg-card border rounded-lg p-8 space-y-4">
              <div className={`text-6xl font-bold ${getScoreColor(percentage)}`}>
                {score}/{quizData.questions.length}
              </div>
              <div className={`text-2xl font-semibold ${getScoreColor(percentage)}`}>{percentage}%</div>
              <p className="text-lg text-muted-foreground">{getScoreMessage(percentage)}</p>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Review Your Answers</h2>

            <div className="grid gap-6">
              {quizData.questions.map((question: any, index: number) => {
                const isCorrect = selectedAnswers[index] === question.correctAnswerIndex
                const userAnswer = selectedAnswers[index]

                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Question Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                              {index + 1}
                            </div>
                            {isCorrect ? (
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Correct
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800 border-red-200">
                                <XCircle className="w-3 h-3 mr-1" />
                                Incorrect
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Question Text */}
                        <div className="space-y-3">
                          <h3 className="text-lg font-medium">{question.question}</h3>
                          
                          {/* Answer Options */}
                          <div className="space-y-2">
                            {question.options.map((option: string, optionIndex: number) => {
                              const isUserAnswer = userAnswer === optionIndex
                              const isCorrectAnswer = optionIndex === question.correctAnswerIndex
                              
                              return (
                                <div
                                  key={optionIndex}
                                  className={`p-3 rounded-lg border ${
                                    isCorrectAnswer
                                      ? "border-green-500 bg-green-50 text-green-700"
                                      : isUserAnswer && !isCorrectAnswer
                                      ? "border-red-500 bg-red-50 text-red-700"
                                      : "border-gray-200"
                                  }`}
                                >
                                  <div className="flex items-center space-x-2">
                                    {isCorrectAnswer && <CheckCircle className="w-4 h-4 text-green-600" />}
                                    {isUserAnswer && !isCorrectAnswer && <XCircle className="w-4 h-4 text-red-600" />}
                                    <span>{option}</span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {question.explanation && (
                          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-700">
                              <strong>Explanation:</strong> {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/aptitude")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Aptitude</span>
            </Button>
            <Button
              size="lg"
              onClick={() => {
                setCurrentQuestionIndex(0)
                setSelectedAnswers([])
                setShowResults(false)
                setScore(0)
                const minutes = Number.parseInt(quizData.timeEstimate.split(" ")[0])
                setTimeRemaining(minutes * 60)
              }}
            >
              Retake Quiz
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/aptitude")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">{quizData.title}</h1>
                <p className="text-sm text-muted-foreground">{quizData.category}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4" />
                <span className={timeRemaining < 60 ? "text-red-500 font-medium" : ""}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <Badge variant="outline">
                {currentQuestionIndex + 1} of {quizData.questions.length}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Question */}
          <div className="space-y-6">
            <h2 className="text-2xl font-medium text-foreground leading-relaxed">{currentQuestion.question}</h2>

            {/* Options */}
            <div className="grid gap-4">
              {currentQuestion.options.map((option: string, index: number) => (
                <Button
                  key={index}
                  variant={selectedAnswers[currentQuestionIndex] === index ? "default" : "outline"}
                  className="w-full justify-start text-left h-auto p-6 text-base"
                  onClick={() => handleAnswerSelect(index)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center space-x-2 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            <Button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestionIndex] === undefined}
              className="flex items-center space-x-2"
            >
              <span>{currentQuestionIndex === quizData.questions.length - 1 ? "Finish Quiz" : "Next Question"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
