"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Clock, Target, TrendingUp, CheckCircle, AlertCircle, ArrowRight, RotateCcw } from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"

// Mock results data
const interviewResults = {
  template: "Frontend Developer",
  completedAt: "2024-01-20T14:30:00Z",
  duration: 42, // minutes
  overallScore: 78,
  rounds: [
    {
      type: "Technical Coding",
      score: 82,
      timeSpent: 28,
      questions: [
        {
          title: "Implement a debounce function",
          score: 85,
          feedback: "Good implementation with proper timeout handling. Could improve error handling.",
          strengths: ["Clean code structure", "Proper closure usage"],
          improvements: ["Add input validation", "Handle edge cases"],
        },
        {
          title: "React Component Optimization",
          score: 79,
          feedback: "Demonstrated good understanding of React optimization techniques.",
          strengths: ["Mentioned useMemo and useCallback", "Understood virtual DOM concepts"],
          improvements: ["Could elaborate on profiling tools", "Missing React.memo discussion"],
        },
      ],
    },
    {
      type: "Behavioral",
      score: 74,
      timeSpent: 14,
      questions: [
        {
          title: "Tell me about a challenging project",
          score: 76,
          feedback: "Good structure using STAR method. Could provide more specific metrics.",
          strengths: ["Clear problem description", "Good outcome explanation"],
          improvements: ["Add quantifiable results", "More technical details"],
        },
        {
          title: "Working with difficult team members",
          score: 72,
          feedback: "Showed good interpersonal skills but could be more specific about resolution.",
          strengths: ["Empathetic approach", "Professional handling"],
          improvements: ["More concrete examples", "Specific communication strategies"],
        },
      ],
    },
  ],
  recommendations: [
    "Practice more system design questions to improve architectural thinking",
    "Work on providing more quantifiable results in behavioral responses",
    "Review advanced React patterns and optimization techniques",
  ],
  nextSteps: [
    "Take a System Design mock interview",
    "Practice behavioral questions with the STAR method",
    "Review React performance optimization documentation",
  ],
}

export default function InterviewResultsPage() {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    if (score >= 60) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-accent-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Interview Complete!</h1>
          <p className="text-muted-foreground">
            Here's how you performed in your {interviewResults.template} interview
          </p>
        </div>

        {/* Overall Score */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold">
              <span className={getScoreColor(interviewResults.overallScore)}>{interviewResults.overallScore}%</span>
            </CardTitle>
            <CardDescription>Overall Interview Score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">{interviewResults.duration}m</div>
                <p className="text-sm text-muted-foreground">Duration</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">{interviewResults.rounds.length}</div>
                <p className="text-sm text-muted-foreground">Rounds Completed</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">
                  {interviewResults.rounds.reduce((acc, round) => acc + round.questions.length, 0)}
                </div>
                <p className="text-sm text-muted-foreground">Questions Answered</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Round Breakdown */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Round Breakdown</h2>
          {interviewResults.rounds.map((round, roundIndex) => (
            <Card key={roundIndex}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{round.type}</CardTitle>
                  <Badge className={getScoreBadgeColor(round.score)}>{round.score}%</Badge>
                </div>
                <CardDescription>Completed in {round.timeSpent} minutes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={round.score} className="h-2" />
                <div className="space-y-4">
                  {round.questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{question.title}</h4>
                        <Badge variant="outline">{question.score}%</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{question.feedback}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-sm mb-2 flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Strengths</span>
                          </h5>
                          <ul className="text-sm space-y-1">
                            {question.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-green-600">•</span>
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-2 flex items-center space-x-1">
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                            <span>Areas for Improvement</span>
                          </h5>
                          <ul className="text-sm space-y-1">
                            {question.improvements.map((improvement, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <span className="text-yellow-600">•</span>
                                <span>{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>Areas to focus on for improvement</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {interviewResults.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-accent mt-0.5" />
                    <span className="text-sm">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>Suggested actions to continue improving</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {interviewResults.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <ArrowRight className="w-4 h-4 text-accent mt-0.5" />
                    <span className="text-sm">{step}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/interview">
              <RotateCcw className="w-4 h-4 mr-2" />
              Take Another Interview
            </Link>
          </Button>
          <Button variant="outline" asChild className="bg-transparent">
            <Link href="/practice">
              Practice More Questions
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" asChild className="bg-transparent">
            <Link href="/progress">
              View Progress
              <TrendingUp className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
