"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Code, Users, BookOpen, TrendingUp, Clock, Target, ArrowRight, CheckCircle, AlertCircle, Brain, MessageSquare, Award, Star, Zap, Trophy } from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"

interface UserStats {
  coding: {
    totalProblems: number
    solvedProblems: number
    attemptedProblems: number
    categoryStats: Record<string, { solved: number; total: number }>
    difficultyStats: Record<string, { solved: number; total: number }>
    recentSubmissions: any[]
  }
  aptitude: {
    totalQuestions: number
    correctAnswers: number
    categoryStats: Record<string, { correct: number; total: number }>
    averageTime: number
    recentProgress: any[]
    testStats: {
      totalTests: number
      averageScore: number
      bestScore: number
      totalTimeSpent: number
      categoryStats: Record<string, { totalTests: number; averageScore: number; bestScore: number }>
    }
    recentTests: any[]
  }
  interview: {
    completedInterviews: number
    averageScore: number
    recentInterviews: any[]
  }
  overall: {
    studyStreak: number
    totalStudyTime: number
    averageSessionTime: number
  }
}

// Default empty stats
const defaultStats: UserStats = {
  coding: {
    totalProblems: 150,
    solvedProblems: 0,
    attemptedProblems: 0,
    categoryStats: {},
    difficultyStats: {
      'Easy': { solved: 0, total: 50 },
      'Medium': { solved: 0, total: 75 },
      'Hard': { solved: 0, total: 25 }
    },
    recentSubmissions: []
  },
  aptitude: {
    totalQuestions: 0,
    correctAnswers: 0,
    categoryStats: {},
    averageTime: 0,
    recentProgress: [],
    testStats: {
      totalTests: 0,
      averageScore: 0,
      bestScore: 0,
      totalTimeSpent: 0,
      categoryStats: {}
    },
    recentTests: []
  },
  interview: {
    completedInterviews: 0,
    averageScore: 0,
    recentInterviews: []
  },
  overall: {
    studyStreak: 0,
    totalStudyTime: 0,
    averageSessionTime: 0
  }
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<UserStats>(defaultStats)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30days")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        // Fetch comprehensive user stats
        const [progressRes, aptitudeRes, testProgressRes] = await Promise.all([
          fetch('/api/progress'),
          fetch('/api/aptitude'),
          fetch('/api/aptitude/test-progress')
        ])

        const progressData = progressRes.ok ? await progressRes.json() : { progress: {} }
        const aptitudeData = aptitudeRes.ok ? await aptitudeRes.json() : { progress: [], stats: {} }
        const testProgressData = testProgressRes.ok ? await testProgressRes.json() : { tests: [], stats: {} }

        // Calculate coding stats
        const progress = progressData.progress || {}
        const solvedProblems = Object.values(progress).filter(status => status === 'solved').length
        const attemptedProblems = Object.values(progress).filter(status => status === 'attempted').length

        // Calculate category and difficulty stats
        const categoryStats: Record<string, { solved: number; total: number }> = {}
        const difficultyStats: Record<string, { solved: number; total: number }> = {
          'Easy': { solved: 0, total: 50 },
          'Medium': { solved: 0, total: 75 },
          'Hard': { solved: 0, total: 25 }
        }

        // Calculate study time (placeholder for now)
        const totalStudyTime = 0

        setStats({
          coding: {
            totalProblems: 150,
            solvedProblems,
            attemptedProblems,
            categoryStats,
            difficultyStats,
            recentSubmissions: []
          },
          aptitude: {
            totalQuestions: aptitudeData.stats?.totalQuestions || 0,
            correctAnswers: aptitudeData.stats?.correctAnswers || 0,
            categoryStats: aptitudeData.stats?.categoryStats || {},
            averageTime: aptitudeData.stats?.averageTime || 0,
            recentProgress: aptitudeData.progress?.slice(-5) || [],
            testStats: {
              totalTests: testProgressData.stats?.totalTests || 0,
              averageScore: testProgressData.stats?.averageScore || 0,
              bestScore: testProgressData.stats?.bestScore || 0,
              totalTimeSpent: testProgressData.stats?.totalTimeSpent || 0,
              categoryStats: testProgressData.stats?.categoryStats || {}
            },
            recentTests: testProgressData.tests?.slice(-5) || []
          },
          interview: {
            completedInterviews: 0,
            averageScore: 0,
            recentInterviews: []
          },
          overall: {
            studyStreak: 0, // Will be calculated based on activity dates
            totalStudyTime,
            averageSessionTime: 0
          }
        })
      } catch (error) {
        console.error('Failed to fetch progress data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProgress()
  }, [user])

  const completionRate = stats.coding.totalProblems > 0 ? Math.round((stats.coding.solvedProblems / stats.coding.totalProblems) * 100) : 0
  const studyHours = Math.round(stats.overall.totalStudyTime / 60)
  const aptitudeAccuracy = stats.aptitude.totalQuestions > 0 ? Math.round((stats.aptitude.correctAnswers / stats.aptitude.totalQuestions) * 100) : 0

  const displayUser = user || { firstName: "Demo User", lastName: "Test", email: "demo@test.com" }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading dashboard data...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {displayUser.firstName}!</h1>
          <p className="text-muted-foreground mt-2">Ready to continue your interview preparation journey?</p>
        </div>

        {/* Header with Time Range */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard & Progress Analytics</h1>
            <p className="text-muted-foreground mt-2">Track your improvement and continue your preparation journey</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Problems Solved</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.coding.solvedProblems}</div>
              <p className="text-xs text-muted-foreground">
                {completionRate}% of {stats.coding.totalProblems} total
              </p>
              <Progress value={completionRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aptitude Score</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{aptitudeAccuracy}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.aptitude.correctAnswers} of {stats.aptitude.totalQuestions} correct
              </p>
              <Progress value={aptitudeAccuracy} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studyHours}h</div>
              <p className="text-xs text-muted-foreground">
                Avg {Math.round(stats.overall.averageSessionTime)}min per session
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.interview.completedInterviews}</div>
              <p className="text-xs text-muted-foreground">
                Avg {stats.interview.averageScore}% score
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Different Views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="coding">Coding</TabsTrigger>
            <TabsTrigger value="aptitude">Aptitude</TabsTrigger>
            <TabsTrigger value="interview">Interview</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Jump back into your preparation</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button asChild className="h-auto p-4 justify-start">
                      <Link href="/practice">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                            <Code className="w-5 h-5 text-accent" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">Continue Practice</p>
                            <p className="text-sm text-muted-foreground">Resume coding problems</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Link>
                    </Button>

                    <Button asChild variant="outline" className="h-auto p-4 justify-start bg-transparent">
                      <Link href="/interview">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-accent" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">Mock Interview</p>
                            <p className="text-sm text-muted-foreground">Practice with AI feedback</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Link>
                    </Button>

                    <Button asChild variant="outline" className="h-auto p-4 justify-start bg-transparent">
                      <Link href="/questions">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-accent" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">Question Bank</p>
                            <p className="text-sm text-muted-foreground">Browse all problems</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Link>
                    </Button>

                    <Button asChild variant="outline" className="h-auto p-4 justify-start bg-transparent">
                      <Link href="/aptitude">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                            <Brain className="w-5 h-5 text-accent" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">Aptitude Tests</p>
                            <p className="text-sm text-muted-foreground">Improve logical reasoning</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stats.aptitude.recentProgress.length > 0 ? (
                    <>
                      {stats.aptitude.recentProgress.slice(0, 3).map((progress: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4" />
                            <span className="text-sm">{progress.category} Question</span>
                          </div>
                          <Badge variant={progress.correct ? 'default' : 'destructive'}>
                            {progress.correct ? 'Correct' : 'Wrong'}
                          </Badge>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No recent activity</p>
                      <p className="text-xs">Start solving problems to see activity</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="coding" className="space-y-6">
            {/* Coding Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Coding Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Easy Problems</span>
                      <span>{stats.coding.difficultyStats.Easy?.solved || 0}/{stats.coding.difficultyStats.Easy?.total || 50}</span>
                    </div>
                    <Progress value={((stats.coding.difficultyStats.Easy?.solved || 0) / (stats.coding.difficultyStats.Easy?.total || 50)) * 100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Medium Problems</span>
                      <span>{stats.coding.difficultyStats.Medium?.solved || 0}/{stats.coding.difficultyStats.Medium?.total || 75}</span>
                    </div>
                    <Progress value={((stats.coding.difficultyStats.Medium?.solved || 0) / (stats.coding.difficultyStats.Medium?.total || 75)) * 100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Hard Problems</span>
                      <span>{stats.coding.difficultyStats.Hard?.solved || 0}/{stats.coding.difficultyStats.Hard?.total || 25}</span>
                    </div>
                    <Progress value={((stats.coding.difficultyStats.Hard?.solved || 0) / (stats.coding.difficultyStats.Hard?.total || 25)) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Category Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.entries(stats.coding.categoryStats).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(stats.coding.categoryStats).map(([category, data]) => (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{category}</span>
                            <span>{data.solved}/{data.total}</span>
                          </div>
                          <Progress value={(data.solved / data.total) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      <Code className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No coding progress yet</p>
                      <p className="text-xs">Start solving problems to see progress</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="aptitude" className="space-y-6">
            {/* Aptitude Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Aptitude Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(stats.aptitude.categoryStats).length > 0 ? (
                    Object.entries(stats.aptitude.categoryStats).map(([category, data]) => (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{category}</span>
                          <span>{data.correct}/{data.total}</span>
                        </div>
                        <Progress value={(data.correct / data.total) * 100} className="h-2" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No aptitude tests completed yet</p>
                      <p className="text-xs">Start practicing to see your progress</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Test Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Test Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{stats.aptitude.testStats.totalTests}</div>
                      <p className="text-xs text-muted-foreground">Tests Completed</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{stats.aptitude.testStats.averageScore}%</div>
                      <p className="text-xs text-muted-foreground">Average Score</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{stats.aptitude.testStats.bestScore}%</div>
                      <p className="text-xs text-muted-foreground">Best Score</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{Math.round(stats.aptitude.testStats.totalTimeSpent / 60)}m</div>
                      <p className="text-xs text-muted-foreground">Time Spent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="interview" className="space-y-6">
            {/* Interview Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Interview Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Mock Interview Feature</p>
                  <p className="text-sm">Complete mock interviews to see your progress here</p>
                  <Button asChild className="mt-4">
                    <Link href="/interview">Start Mock Interview</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Milestones you've reached in your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 border rounded-lg text-center ${stats.coding.solvedProblems > 0 ? 'bg-green-50 border-green-200' : 'opacity-50'}`}>
                <Award className={`w-8 h-8 mx-auto mb-2 ${stats.coding.solvedProblems > 0 ? 'text-green-500' : 'text-gray-400'}`} />
                <h4 className="font-medium">First Problem</h4>
                <p className="text-sm text-muted-foreground">
                  {stats.coding.solvedProblems > 0 ? 'Completed!' : 'Solve your first coding problem'}
                </p>
              </div>
              <div className={`p-4 border rounded-lg text-center ${stats.aptitude.correctAnswers > 0 ? 'bg-blue-50 border-blue-200' : 'opacity-50'}`}>
                <Brain className={`w-8 h-8 mx-auto mb-2 ${stats.aptitude.correctAnswers > 0 ? 'text-blue-500' : 'text-gray-400'}`} />
                <h4 className="font-medium">Aptitude Master</h4>
                <p className="text-sm text-muted-foreground">
                  {stats.aptitude.correctAnswers > 0 ? 'Started aptitude practice!' : 'Answer your first aptitude question'}
                </p>
              </div>
              <div className={`p-4 border rounded-lg text-center ${stats.interview.completedInterviews > 0 ? 'bg-purple-50 border-purple-200' : 'opacity-50'}`}>
                <MessageSquare className={`w-8 h-8 mx-auto mb-2 ${stats.interview.completedInterviews > 0 ? 'text-purple-500' : 'text-gray-400'}`} />
                <h4 className="font-medium">Interview Ready</h4>
                <p className="text-sm text-muted-foreground">
                  {stats.interview.completedInterviews > 0 ? 'Interview completed!' : 'Complete your first mock interview'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
