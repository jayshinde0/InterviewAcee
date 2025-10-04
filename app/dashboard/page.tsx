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
import { useProgress } from "@/hooks/use-progress"
import { useEffect, useState } from "react"

// Dashboard now uses the useProgress hook for live data

export default function DashboardPage() {
  const { user } = useAuth()
  const { stats: progressStats, activityHistory, loading, error } = useProgress()
  const [timeRange, setTimeRange] = useState("30days")
  const [activeTab, setActiveTab] = useState("overview")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show loading state while fetching progress data or not mounted
  if (loading || !mounted) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your progress...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const displayUser = user || { firstName: "Demo User", lastName: "Test", email: "demo@test.com" }

  if (loading) {
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
              <div className="text-2xl font-bold" suppressHydrationWarning>
                {progressStats?.coding_problems_solved || 0} / 15
              </div>
              <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                {progressStats?.coding_problems_attempted || 0} attempted
              </p>
              <Progress 
                value={((progressStats?.coding_problems_solved || 0) / 15) * 100} 
                className="mt-2" 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aptitude Score</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" suppressHydrationWarning>
                {Math.round(progressStats?.aptitude_average_score || 0)}%
              </div>
              <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                {progressStats?.aptitude_tests_completed || 0} tests completed
              </p>
              <Progress value={progressStats?.aptitude_average_score || 0} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" suppressHydrationWarning>
                {Math.round((progressStats?.total_study_time_minutes || 0) / 60)}h
              </div>
              <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                {progressStats?.current_streak_days || 0} day streak
              </p>
              <div className="flex items-center mt-2">
                <Zap className="h-3 w-3 text-orange-500 mr-1" />
                <span className="text-xs text-orange-500" suppressHydrationWarning>
                  {progressStats?.current_streak_days || 0} days
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" suppressHydrationWarning>
                {progressStats?.interviews_completed || 0}
              </div>
              <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                Avg {Math.round(progressStats?.interview_average_rating || 0)}/5 rating
              </p>
              <Progress 
                value={progressStats?.interview_average_rating ? 
                  (progressStats.interview_average_rating / 5) * 100 : 0} 
                className="mt-2" 
              />
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest learning activities</CardDescription>
          </CardHeader>
          <CardContent>
            {activityHistory.length > 0 ? (
              <div className="space-y-3">
                {activityHistory.slice(0, 5).map((activity: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {activity.activity_type === 'aptitude_test' && <Brain className="h-4 w-4 text-blue-500" />}
                      {activity.activity_type === 'coding_submission' && <Code className="h-4 w-4 text-green-500" />}
                      {activity.activity_type === 'interview_session' && <MessageSquare className="h-4 w-4 text-purple-500" />}
                      <div>
                        <p className="font-medium capitalize">
                          {activity.activity_type.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(activity.activity_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {activity.duration_minutes}m
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No activity yet. Start practicing to see your progress!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump back into your preparation</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="h-auto p-4 justify-start">
              <Link href="/practice">
                <div className="flex items-center gap-3">
                  <Code className="h-6 w-6" />
                  <div className="text-left">
                    <div className="font-medium">Code Practice</div>
                    <div className="text-sm opacity-70">Solve coding problems</div>
                  </div>
                </div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 justify-start">
              <Link href="/aptitude">
                <div className="flex items-center gap-3">
                  <Brain className="h-6 w-6" />
                  <div className="text-left">
                    <div className="font-medium">Aptitude Tests</div>
                    <div className="text-sm opacity-70">Practice aptitude questions</div>
                  </div>
                </div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 justify-start">
              <Link href="/interview">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-6 w-6" />
                  <div className="text-left">
                    <div className="font-medium">Mock Interview</div>
                    <div className="text-sm opacity-70">Practice interviews</div>
                  </div>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Your learning milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 border rounded-lg text-center ${(progressStats?.coding_problems_solved || 0) > 0 ? 'bg-green-50 border-green-200' : 'opacity-50'}`}>
                <Award className={`w-8 h-8 mx-auto mb-2 ${(progressStats?.coding_problems_solved || 0) > 0 ? 'text-green-500' : 'text-gray-400'}`} />
                <h4 className="font-medium">First Problem</h4>
                <p className="text-sm text-muted-foreground">
                  {(progressStats?.coding_problems_solved || 0) > 0 ? 'Completed!' : 'Solve your first coding problem'}
                </p>
              </div>
              
              <div className={`p-4 border rounded-lg text-center ${(progressStats?.aptitude_tests_completed || 0) > 0 ? 'bg-blue-50 border-blue-200' : 'opacity-50'}`}>
                <Brain className={`w-8 h-8 mx-auto mb-2 ${(progressStats?.aptitude_tests_completed || 0) > 0 ? 'text-blue-500' : 'text-gray-400'}`} />
                <h4 className="font-medium">Aptitude Master</h4>
                <p className="text-sm text-muted-foreground">
                  {(progressStats?.aptitude_tests_completed || 0) > 0 ? 'Started aptitude practice!' : 'Complete your first aptitude test'}
                </p>
              </div>
              
              <div className={`p-4 border rounded-lg text-center ${(progressStats?.interviews_completed || 0) > 0 ? 'bg-purple-50 border-purple-200' : 'opacity-50'}`}>
                <MessageSquare className={`w-8 h-8 mx-auto mb-2 ${(progressStats?.interviews_completed || 0) > 0 ? 'text-purple-500' : 'text-gray-400'}`} />
                <h4 className="font-medium">Interview Ready</h4>
                <p className="text-sm text-muted-foreground">
                  {(progressStats?.interviews_completed || 0) > 0 ? 'Interview completed!' : 'Complete your first mock interview'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Different Views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="coding">Coding</TabsTrigger>
            <TabsTrigger value="aptitude">Aptitude</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your Learning Journey</h3>
              <p className="text-muted-foreground mb-6">Track your progress across all areas</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="p-4 border rounded-lg">
                  <Code className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="font-medium">{progressStats?.coding_problems_solved || 0} Problems</p>
                  <p className="text-sm text-muted-foreground">Solved</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <Brain className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="font-medium">{progressStats?.aptitude_tests_completed || 0} Tests</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="font-medium">{Math.round((progressStats?.total_study_time_minutes || 0) / 60)}h</p>
                  <p className="text-sm text-muted-foreground">Study Time</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="coding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Coding Progress
                </CardTitle>
                <CardDescription>
                  {progressStats?.coding_problems_solved || 0} problems solved, {progressStats?.coding_problems_attempted || 0} attempted
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Success Rate</span>
                    <span className="font-medium">
                      {progressStats?.coding_problems_attempted ? 
                        Math.round((progressStats.coding_problems_solved / progressStats.coding_problems_attempted) * 100) : 0}%
                    </span>
                  </div>
                  <Progress 
                    value={progressStats?.coding_problems_attempted ? 
                      (progressStats.coding_problems_solved / progressStats.coding_problems_attempted) * 100 : 0} 
                  />
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{progressStats?.coding_accepted_submissions || 0}</div>
                      <p className="text-sm text-muted-foreground">Accepted</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold">{progressStats?.coding_total_submissions || 0}</div>
                      <p className="text-sm text-muted-foreground">Total Submissions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="aptitude" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Aptitude Progress
                </CardTitle>
                <CardDescription>
                  {progressStats?.aptitude_tests_completed || 0} tests completed with {Math.round(progressStats?.aptitude_average_score || 0)}% average score
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Score</span>
                    <span className="font-medium">{Math.round(progressStats?.aptitude_average_score || 0)}%</span>
                  </div>
                  <Progress value={progressStats?.aptitude_average_score || 0} />
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{progressStats?.aptitude_correct_answers || 0}</div>
                      <p className="text-sm text-muted-foreground">Correct Answers</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold">{progressStats?.aptitude_total_questions_answered || 0}</div>
                      <p className="text-sm text-muted-foreground">Total Questions</p>
                    </div>
                  </div>
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
              <div className={`p-4 border rounded-lg text-center ${(progressStats?.coding_problems_solved || 0) > 0 ? 'bg-green-50 border-green-200' : 'opacity-50'}`}>
                <Award className={`w-8 h-8 mx-auto mb-2 ${(progressStats?.coding_problems_solved || 0) > 0 ? 'text-green-500' : 'text-gray-400'}`} />
                <h4 className="font-medium">First Problem</h4>
                <p className="text-sm text-muted-foreground">
                  {(progressStats?.coding_problems_solved || 0) > 0 ? 'Completed!' : 'Solve your first coding problem'}
                </p>
              </div>
              <div className={`p-4 border rounded-lg text-center ${(progressStats?.aptitude_correct_answers || 0) > 0 ? 'bg-blue-50 border-blue-200' : 'opacity-50'}`}>
                <Brain className={`w-8 h-8 mx-auto mb-2 ${(progressStats?.aptitude_correct_answers || 0) > 0 ? 'text-blue-500' : 'text-gray-400'}`} />
                <h4 className="font-medium">Aptitude Master</h4>
                <p className="text-sm text-muted-foreground">
                  {(progressStats?.aptitude_correct_answers || 0) > 0 ? 'Started aptitude practice!' : 'Answer your first aptitude question'}
                </p>
              </div>
              <div className={`p-4 border rounded-lg text-center ${(progressStats?.interviews_completed || 0) > 0 ? 'bg-purple-50 border-purple-200' : 'opacity-50'}`}>
                <MessageSquare className={`w-8 h-8 mx-auto mb-2 ${(progressStats?.interviews_completed || 0) > 0 ? 'text-purple-500' : 'text-gray-400'}`} />
                <h4 className="font-medium">Interview Ready</h4>
                <p className="text-sm text-muted-foreground">
                  {(progressStats?.interviews_completed || 0) > 0 ? 'Interview completed!' : 'Complete your first mock interview'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
