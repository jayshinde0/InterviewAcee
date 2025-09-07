"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Code, MessageSquare, ArrowRight, ArrowLeft, Pause, Play, Square } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

// Mock interview data
const interviewData = {
  template: "Frontend Developer",
  totalDuration: 45 * 60, // 45 minutes in seconds
  rounds: [
    {
      id: 1,
      type: "coding",
      title: "Technical Coding",
      duration: 25 * 60,
      questions: [
        {
          id: 1,
          title: "Implement a debounce function",
          description: `Create a debounce function that delays the execution of a function until after a specified delay has elapsed since the last time it was invoked.

The function should:
- Accept a function and a delay as parameters
- Return a new function that delays the execution
- Cancel previous timeouts when called again within the delay period`,
          type: "coding",
        },
        {
          id: 2,
          title: "React Component Optimization",
          description: `You have a React component that renders a large list of items. The component is re-rendering frequently and causing performance issues.

Explain and implement optimization techniques you would use to improve the performance of this component.`,
          type: "coding",
        },
      ],
    },
    {
      id: 2,
      type: "behavioral",
      title: "Behavioral Questions",
      duration: 20 * 60,
      questions: [
        {
          id: 3,
          title: "Tell me about a challenging project",
          description: `Describe a challenging project you worked on. What made it challenging, and how did you overcome the difficulties?

Focus on:
- The specific challenges you faced
- Your approach to solving them
- The outcome and what you learned`,
          type: "behavioral",
        },
        {
          id: 4,
          title: "Working with difficult team members",
          description: `Tell me about a time when you had to work with a difficult team member or stakeholder. How did you handle the situation?`,
          type: "behavioral",
        },
      ],
    },
  ],
}

export default function InterviewSessionPage() {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(interviewData.totalDuration)
  const [roundTimeRemaining, setRoundTimeRemaining] = useState(interviewData.rounds[0].duration)
  const [isRunning, setIsRunning] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isCompleted, setIsCompleted] = useState(false)

  const currentRound = interviewData.rounds[currentRoundIndex]
  const currentQuestion = currentRound?.questions[currentQuestionIndex]
  const totalQuestions = interviewData.rounds.reduce((acc, round) => acc + round.questions.length, 0)
  const currentQuestionNumber =
    interviewData.rounds.slice(0, currentRoundIndex).reduce((acc, round) => acc + round.questions.length, 0) +
    currentQuestionIndex +
    1

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && !isPaused && !isCompleted) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsCompleted(true)
            return 0
          }
          return prev - 1
        })
        setRoundTimeRemaining((prev) => {
          if (prev <= 1) {
            // Auto-advance to next round
            if (currentRoundIndex < interviewData.rounds.length - 1) {
              setCurrentRoundIndex((prevRound) => prevRound + 1)
              setCurrentQuestionIndex(0)
              return interviewData.rounds[currentRoundIndex + 1].duration
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, isPaused, isCompleted, currentRoundIndex])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerChange = (value: string) => {
    if (currentQuestion) {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }))
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < currentRound.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else if (currentRoundIndex < interviewData.rounds.length - 1) {
      setCurrentRoundIndex((prev) => prev + 1)
      setCurrentQuestionIndex(0)
      setRoundTimeRemaining(interviewData.rounds[currentRoundIndex + 1].duration)
    } else {
      setIsCompleted(true)
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    } else if (currentRoundIndex > 0) {
      setCurrentRoundIndex((prev) => prev - 1)
      setCurrentQuestionIndex(interviewData.rounds[currentRoundIndex - 1].questions.length - 1)
      setRoundTimeRemaining(interviewData.rounds[currentRoundIndex - 1].duration)
    }
  }

  const endInterview = () => {
    setIsCompleted(true)
    setIsRunning(false)
    // In a real app, save results and redirect to results page
    window.location.href = "/interview/results"
  }

  if (isCompleted) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle>Interview Completed!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Great job! Your interview session has been completed. We're now analyzing your responses.
              </p>
              <Button onClick={() => (window.location.href = "/interview/results")}>View Results</Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-foreground">{interviewData.template}</h1>
            <Badge variant="outline">
              Question {currentQuestionNumber} of {totalQuestions}
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Round Time</div>
              <div className="text-lg font-mono">{formatTime(roundTimeRemaining)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Total Time</div>
              <div className="text-lg font-mono">{formatTime(timeRemaining)}</div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsPaused(!isPaused)} className="bg-transparent">
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </Button>
            <Button variant="destructive" size="sm" onClick={endInterview}>
              <Square className="w-4 h-4 mr-2" />
              End Interview
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Overall Progress</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(((currentQuestionNumber - 1) / totalQuestions) * 100)}%
            </span>
          </div>
          <Progress value={((currentQuestionNumber - 1) / totalQuestions) * 100} className="h-2" />
        </div>

        {/* Current Round */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            {currentRound.type === "coding" ? (
              <Code className="w-5 h-5 text-accent" />
            ) : (
              <MessageSquare className="w-5 h-5 text-accent" />
            )}
            <h2 className="text-xl font-semibold">{currentRound.title}</h2>
            <Badge variant="secondary">{currentRound.type === "coding" ? "Technical" : "Behavioral"}</Badge>
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>{currentQuestion?.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-line">{currentQuestion?.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Your Answer</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <Textarea
                value={answers[currentQuestion?.id || 0] || ""}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder={
                  currentRound.type === "coding"
                    ? "Write your code solution here..."
                    : "Share your experience and approach..."
                }
                className="flex-1 resize-none min-h-[300px] font-mono text-sm"
              />
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  {(answers[currentQuestion?.id || 0] || "").length} characters
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={previousQuestion}
                    disabled={currentRoundIndex === 0 && currentQuestionIndex === 0}
                    className="bg-transparent"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button size="sm" onClick={nextQuestion}>
                    {currentRoundIndex === interviewData.rounds.length - 1 &&
                    currentQuestionIndex === currentRound.questions.length - 1
                      ? "Finish"
                      : "Next"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
