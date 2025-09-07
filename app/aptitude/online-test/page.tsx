"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Clock, ArrowRight, RotateCcw } from "lucide-react"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const onlineTestQuestions: Question[] = [
  {
    id: 1,
    question: "If a train travels 120 km in 2 hours, what is its average speed?",
    options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"],
    correctAnswer: 1,
    explanation: "Speed = Distance / Time = 120 km / 2 hours = 60 km/h"
  },
  {
    id: 2,
    question: "What is 15% of 200?",
    options: ["25", "30", "35", "40"],
    correctAnswer: 1,
    explanation: "15% of 200 = (15/100) × 200 = 30"
  },
  {
    id: 3,
    question: "If the ratio of boys to girls in a class is 3:2 and there are 15 boys, how many girls are there?",
    options: ["8", "10", "12", "15"],
    correctAnswer: 1,
    explanation: "If boys:girls = 3:2 and boys = 15, then girls = (2/3) × 15 = 10"
  },
  {
    id: 4,
    question: "A shopkeeper sells an item for ₹120 after giving a 20% discount. What was the original price?",
    options: ["₹140", "₹150", "₹160", "₹180"],
    correctAnswer: 1,
    explanation: "If selling price after 20% discount is ₹120, then original price = 120 / 0.8 = ₹150"
  },
  {
    id: 5,
    question: "In a sequence 2, 6, 18, 54, ..., what is the next number?",
    options: ["108", "126", "162", "216"],
    correctAnswer: 2,
    explanation: "Each number is multiplied by 3: 2×3=6, 6×3=18, 18×3=54, 54×3=162"
  }
]

export default function OnlineAptitudeTestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(onlineTestQuestions.length).fill(-1))
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [testStarted, setTestStarted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (testStarted && timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResults) {
      handleSubmitTest()
    }
  }, [timeLeft, testStarted, showResults])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartTest = () => {
    setTestStarted(true)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < onlineTestQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitTest = () => {
    setShowResults(true)
  }

  const calculateScore = () => {
    let correct = 0
    selectedAnswers.forEach((answer, index) => {
      if (answer === onlineTestQuestions[index].correctAnswer) {
        correct++
      }
    })
    return correct
  }

  const handleRetakeTest = () => {
    setCurrentQuestion(0)
    setSelectedAnswers(new Array(onlineTestQuestions.length).fill(-1))
    setShowResults(false)
    setTimeLeft(300)
    setTestStarted(false)
  }

  const progress = ((currentQuestion + 1) / onlineTestQuestions.length) * 100

  if (!testStarted) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Online Aptitude Test</h1>
            <p className="text-muted-foreground">Test your knowledge with 5 aptitude questions</p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-600">Ready to Start?</CardTitle>
              <CardDescription>
                This test contains 5 questions and you have 5 minutes to complete it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>Time limit: 5 minutes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>5 multiple choice questions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ArrowRight className="h-5 w-5 text-purple-600" />
                  <span>Navigate between questions freely</span>
                </div>
              </div>
              
              <Button 
                onClick={handleStartTest}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                size="lg"
              >
                Start Test
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (showResults) {
    const score = calculateScore()
    const percentage = Math.round((score / onlineTestQuestions.length) * 100)
    
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Test Results</h1>
            <p className="text-muted-foreground">Here's how you performed</p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-green-600">
                {score}/{onlineTestQuestions.length}
              </CardTitle>
              <CardDescription className="text-lg">
                {percentage}% Score
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {onlineTestQuestions.map((question, index) => {
                  const userAnswer = selectedAnswers[index]
                  const isCorrect = userAnswer === question.correctAnswer
                  
                  return (
                    <div key={question.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start space-x-3">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{question.question}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm">
                              <span className="font-medium">Your answer:</span>{" "}
                              <span className={userAnswer === -1 ? "text-gray-500" : isCorrect ? "text-green-600" : "text-red-600"}>
                                {userAnswer === -1 ? "Not answered" : question.options[userAnswer]}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p className="text-sm">
                                <span className="font-medium">Correct answer:</span>{" "}
                                <span className="text-green-600">{question.options[question.correctAnswer]}</span>
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium">Explanation:</span> {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  onClick={handleRetakeTest}
                  variant="outline"
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake Test
                </Button>
                <Button 
                  onClick={() => router.push('/aptitude')}
                  className="flex-1"
                >
                  Back to Aptitude
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  const question = onlineTestQuestions[currentQuestion]

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Timer */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Online Aptitude Test</h1>
            <p className="text-muted-foreground">Question {currentQuestion + 1} of {onlineTestQuestions.length}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-mono font-bold text-blue-600">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={progress} className="w-full" />

        {/* Question Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAnswers[currentQuestion] === index
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedAnswers[currentQuestion] === index
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}>
                      {selectedAnswers[currentQuestion] === index && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                variant="outline"
              >
                Previous
              </Button>
              
              <div className="flex space-x-2">
                {currentQuestion === onlineTestQuestions.length - 1 ? (
                  <Button
                    onClick={handleSubmitTest}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Submit Test
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswers[currentQuestion] === -1}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Navigation */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2">
              {onlineTestQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg border-2 font-medium transition-colors ${
                    index === currentQuestion
                      ? "border-blue-500 bg-blue-500 text-white"
                      : selectedAnswers[index] !== -1
                      ? "border-green-500 bg-green-100 text-green-700 dark:bg-green-900/20"
                      : "border-gray-300 hover:border-gray-400"
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
