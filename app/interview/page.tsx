"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Clock, Users, MessageSquare, Play, Settings, History, Trophy } from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"

// Mock data for interview history
const interviewHistory = [
  {
    id: 1,
    type: "Full Stack Developer",
    date: "2024-01-15",
    duration: 45,
    score: 85,
    status: "completed",
    rounds: ["Technical", "Behavioral"],
  },
  {
    id: 2,
    type: "Frontend Developer",
    date: "2024-01-10",
    duration: 30,
    score: 72,
    status: "completed",
    rounds: ["Technical"],
  },
  {
    id: 3,
    type: "System Design",
    date: "2024-01-05",
    duration: 60,
    score: 68,
    status: "completed",
    rounds: ["Technical", "System Design"],
  },
]

const interviewTemplates = [
  {
    id: "frontend",
    title: "Frontend Developer",
    description: "Focus on React, JavaScript, and UI/UX concepts",
    duration: 45,
    rounds: ["Technical Coding", "Behavioral"],
    difficulty: "medium",
    questions: 8,
  },
  {
    id: "fullstack",
    title: "Full Stack Developer",
    description: "Comprehensive interview covering frontend, backend, and databases",
    duration: 60,
    rounds: ["Technical Coding", "System Design", "Behavioral"],
    difficulty: "hard",
    questions: 12,
  },
  {
    id: "backend",
    title: "Backend Developer",
    description: "Server-side development, APIs, and database design",
    duration: 50,
    rounds: ["Technical Coding", "System Design"],
    difficulty: "medium",
    questions: 10,
  },
  {
    id: "entry",
    title: "Entry Level",
    description: "Perfect for new graduates and junior developers",
    duration: 30,
    rounds: ["Technical Coding", "Behavioral"],
    difficulty: "easy",
    questions: 6,
  },
]

export default function InterviewPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [customSettings, setCustomSettings] = useState({
    duration: 45,
    includeCoding: true,
    includeBehavioral: true,
    includeSystemDesign: false,
    difficulty: "medium",
  })
  const [showCustom, setShowCustom] = useState(false)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const startInterview = () => {
    const template = interviewTemplates.find((t) => t.id === selectedTemplate)
    if (template) {
      // In a real app, navigate to interview session
      window.location.href = `/interview/session?template=${selectedTemplate}`
    }
  }

  const startCustomInterview = () => {
    // In a real app, navigate to custom interview session
    window.location.href = `/interview/session?custom=true`
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mock Interview</h1>
          <p className="text-muted-foreground mt-2">Practice with realistic interview simulations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-2xl font-bold">{interviewHistory.length}</p>
                  <p className="text-sm text-muted-foreground">Interviews Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(interviewHistory.reduce((acc, interview) => acc + interview.duration, 0) / 60)}h
                  </p>
                  <p className="text-sm text-muted-foreground">Total Practice Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(
                      interviewHistory.reduce((acc, interview) => acc + interview.score, 0) / interviewHistory.length,
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-2xl font-bold">7</p>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interview Templates */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Interview Templates</CardTitle>
                <CardDescription>Choose from pre-configured interview scenarios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {interviewTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate === template.id
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-accent/50"
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{template.title}</h3>
                          <Badge className={getDifficultyColor(template.difficulty)}>
                            {template.difficulty.charAt(0).toUpperCase() + template.difficulty.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{template.duration} min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{template.questions} questions</span>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-2">
                          {template.rounds.map((round) => (
                            <Badge key={round} variant="secondary">
                              {round}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="ml-4">
                        {selectedTemplate === template.id && (
                          <div className="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-accent-foreground rounded-full" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Custom Interview</h3>
                    <p className="text-sm text-muted-foreground">Configure your own interview parameters</p>
                  </div>
                  <Button variant="outline" onClick={() => setShowCustom(!showCustom)} className="bg-transparent">
                    <Settings className="w-4 h-4 mr-2" />
                    Customize
                  </Button>
                </div>

                {showCustom && (
                  <div className="p-4 border rounded-lg bg-muted/30 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Duration (minutes)</label>
                        <Select
                          value={customSettings.duration.toString()}
                          onValueChange={(value) =>
                            setCustomSettings((prev) => ({ ...prev, duration: Number.parseInt(value) }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="45">45 minutes</SelectItem>
                            <SelectItem value="60">60 minutes</SelectItem>
                            <SelectItem value="90">90 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Difficulty</label>
                        <Select
                          value={customSettings.difficulty}
                          onValueChange={(value) => setCustomSettings((prev) => ({ ...prev, difficulty: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-medium">Interview Rounds</label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="coding"
                            checked={customSettings.includeCoding}
                            onCheckedChange={(checked) =>
                              setCustomSettings((prev) => ({ ...prev, includeCoding: checked as boolean }))
                            }
                          />
                          <label htmlFor="coding" className="text-sm">
                            Technical Coding
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="behavioral"
                            checked={customSettings.includeBehavioral}
                            onCheckedChange={(checked) =>
                              setCustomSettings((prev) => ({ ...prev, includeBehavioral: checked as boolean }))
                            }
                          />
                          <label htmlFor="behavioral" className="text-sm">
                            Behavioral Questions
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="system"
                            checked={customSettings.includeSystemDesign}
                            onCheckedChange={(checked) =>
                              setCustomSettings((prev) => ({ ...prev, includeSystemDesign: checked as boolean }))
                            }
                          />
                          <label htmlFor="system" className="text-sm">
                            System Design
                          </label>
                        </div>
                      </div>
                    </div>
                    <Button onClick={startCustomInterview} className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      Start Custom Interview
                    </Button>
                  </div>
                )}

                <div className="flex justify-center pt-4">
                  <Button onClick={startInterview} disabled={!selectedTemplate} size="lg">
                    <Play className="w-4 h-4 mr-2" />
                    Start Interview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interview History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Interviews</CardTitle>
              <CardDescription>Your interview practice history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {interviewHistory.map((interview) => (
                <div key={interview.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{interview.type}</h4>
                    <Badge variant="secondary">{interview.score}%</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>{interview.date}</p>
                    <p>{interview.duration} minutes</p>
                    <div className="flex space-x-1">
                      {interview.rounds.map((round) => (
                        <Badge key={round} variant="outline" className="text-xs">
                          {round}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                <Link href="/interview/history">View All History</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
