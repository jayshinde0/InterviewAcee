"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, ArrowLeft } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getProblemsByCategory, filterProblemsByDifficulty, getUserProgress, updateUserProgress } from "@/lib/problems"
import { Problem } from "@/lib/problems"
import { useAuth } from "@/contexts/auth-context"
import { useProgress } from "@/hooks/use-progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, Clock, CheckCircle, XCircle, Trash2, RefreshCw } from "lucide-react"

function DifficultyBadge({ level }: { level: "Easy" | "Medium" | "Hard" }) {
  const color = level === "Easy" ? "bg-emerald-500/15 text-emerald-400" : level === "Medium" ? "bg-amber-500/15 text-amber-400" : "bg-rose-500/15 text-rose-400"
  return <span className={`rounded px-2 py-1 text-xs ${color}`}>{level}</span>
}

function StatusBadge({ status }: { status: "Unsolved" | "In-progress" | "Solved" }) {
  const color = status === "Solved" ? "bg-green-500/15 text-green-400" : status === "In-progress" ? "bg-blue-500/15 text-blue-400" : "bg-gray-500/15 text-gray-400"
  return <span className={`rounded px-2 py-1 text-xs ${color}`}>{status}</span>
}

export default function CategoryPage() {
  const params = useParams<{ id: string }>()
  const categoryId = params?.id as string
  const { user } = useAuth()
  const { getCodingHistory } = useProgress()
  const [difficultyFilter, setDifficultyFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [problems, setProblems] = useState<Problem[]>([])
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([])
  const [userProgress, setUserProgress] = useState<Record<number, "Unsolved" | "In-progress" | "Solved">>({})
  const [mongoProgress, setMongoProgress] = useState<Record<string, string>>({})
  const [submissionHistory, setSubmissionHistory] = useState<Record<string, any[]>>({})
  
  useEffect(() => {
    fetchProblemsFromMongoDB()
    setUserProgress(getUserProgress())
    
    // Fetch MongoDB progress
    if (user?._id || user?.email) {
      fetchMongoProgress()
    }
  }, [categoryId, user?._id])

  const fetchProblemsFromMongoDB = async () => {
    try {
      console.log('Fetching problems for category:', categoryId)
      const response = await fetch(`/api/problems/category/${categoryId}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('MongoDB problems fetched:', data.problems?.length || 0)
        if (data.problems && Array.isArray(data.problems) && data.problems.length > 0) {
          setProblems(data.problems)
          return
        }
      }
      
      // Fallback to local data if MongoDB fetch fails or returns empty
      console.log('Falling back to local data for category:', categoryId)
      const categoryProblems = getProblemsByCategory(categoryId)
      console.log('Local problems found:', categoryProblems.length)
      setProblems(categoryProblems)
      
    } catch (error) {
      console.error('Error fetching problems from MongoDB:', error)
      // Fallback to local data
      const categoryProblems = getProblemsByCategory(categoryId)
      console.log('Fallback: Local problems found:', categoryProblems.length)
      setProblems(Array.isArray(categoryProblems) ? categoryProblems : [])
    }
  }

  const fetchMongoProgress = async () => {
    const userId = user?._id?.toString() || user?.email
    if (!userId) return
    
    try {
      const response = await fetch(`/api/user-problem-progress?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setMongoProgress(data.progress || {})
      }
    } catch (error) {
      console.error('Error fetching progress:', error)
    }
  }

  const fetchSubmissionHistory = async (problemId: string) => {
    const userId = user?._id?.toString() || user?.email
    if (!userId) return []
    
    // Return cached history if it exists and is an array
    if (submissionHistory[problemId] && Array.isArray(submissionHistory[problemId])) {
      console.log('Returning cached history for problem', problemId, submissionHistory[problemId])
      return submissionHistory[problemId]
    }
    
    try {
      console.log('Fetching submission history for problem:', problemId, 'user:', userId)
      
      // Call submissions API directly
      const response = await fetch(`/api/submissions?problemId=${problemId}`)
      if (!response.ok) {
        console.error('Submissions API response not ok:', response.status, response.statusText)
        return []
      }
      
      const data = await response.json()
      console.log('Submissions API response:', data)
      
      const history = data.submissions || data.history || []
      const historyArray = Array.isArray(history) ? history : []
      
      console.log('Processed history array:', historyArray)
      setSubmissionHistory(prev => ({ ...prev, [problemId]: historyArray }))
      return historyArray
    } catch (error) {
      console.error('Error fetching submission history:', error)
      return []
    }
  }

  // Filter problems based on difficulty and search query
  useEffect(() => {
    if (!Array.isArray(problems)) {
      setFilteredProblems([])
      return
    }
    
    let filtered = filterProblemsByDifficulty(problems, difficultyFilter)
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(problem =>
        problem.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    setFilteredProblems(Array.isArray(filtered) ? filtered : [])
  }, [problems, difficultyFilter, searchQuery])

  const getProblemStatus = (problemId: number) => {
    // Use MongoDB progress if available, otherwise fall back to local progress
    const mongoStatus = mongoProgress[problemId.toString()]
    if (mongoStatus === 'solved') return "Solved"
    if (mongoStatus === 'attempted') return "In-progress"
    
    // Fall back to local progress
    return userProgress[problemId] || "Unsolved"
  }

  const getActionText = (status: "Unsolved" | "In-progress" | "Solved") => {
    switch (status) {
      case "Solved": return "Review"
      case "In-progress": return "Continue"
      default: return "Start"
    }
  }

  const SubmissionHistory = ({ problemId }: { problemId: string }) => {
    const [history, setHistory] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState<string | null>(null)

    const loadHistory = async () => {
      setLoading(true)
      try {
        const historyData = await fetchSubmissionHistory(problemId)
        console.log('Loaded history data:', historyData)
        setHistory(Array.isArray(historyData) ? historyData : [])
      } catch (error) {
        console.error('Error loading history:', error)
        setHistory([])
      } finally {
        setLoading(false)
      }
    }

    const deleteSubmission = async (submissionId: string) => {
      if (!confirm('Are you sure you want to delete this submission?')) return
      
      setDeleting(submissionId)
      try {
        const response = await fetch(`/api/submissions/${submissionId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          // Remove from local state
          setHistory(prev => prev.filter(sub => sub._id !== submissionId))
          // Also remove from cache
          setSubmissionHistory(prev => ({
            ...prev,
            [problemId]: prev[problemId]?.filter(sub => sub._id !== submissionId) || []
          }))
        } else {
          console.error('Failed to delete submission')
          alert('Failed to delete submission')
        }
      } catch (error) {
        console.error('Error deleting submission:', error)
        alert('Error deleting submission')
      } finally {
        setDeleting(null)
      }
    }

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" onClick={loadHistory} className="px-2">
            <History className="h-3 w-3 mr-1" />
            History
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Submission History</DialogTitle>
                <DialogDescription>
                  All submissions for this problem
                </DialogDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={loadHistory}
                disabled={loading}
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Refresh
              </Button>
            </div>
          </DialogHeader>
          <ScrollArea className="h-[60vh]">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : !Array.isArray(history) || history.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No submissions found for this problem
              </div>
            ) : (
              <div className="space-y-4">
                {Array.isArray(history) && history.map((submission, index) => (
                  <div key={submission._id || index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {submission.status === 'accepted' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <div className="font-medium capitalize">
                            {submission.status?.replace('_', ' ') || 'Unknown'}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {new Date(submission.submittedAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {submission.testCasesPassed || 0}/{submission.totalTestCases || 0} tests passed
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {submission.programmingLanguage?.toUpperCase() || submission.language?.toUpperCase() || 'N/A'}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteSubmission(submission._id)}
                          disabled={deleting === submission._id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          {deleting === submission._id ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {submission.executionTimeMs && (
                      <div className="flex gap-4 text-sm">
                        <span>Runtime: {submission.executionTimeMs}ms</span>
                        {submission.memoryUsedKb && (
                          <span>Memory: {Math.round(submission.memoryUsedKb / 1024 * 100) / 100}MB</span>
                        )}
                      </div>
                    )}
                    
                    <details className="group">
                      <summary className="cursor-pointer text-sm font-medium text-primary hover:underline">
                        View Code ({(submission.sourceCode || submission.code || '').length} characters)
                      </summary>
                      <div className="mt-2 p-3 bg-muted rounded border">
                        <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                          <code>{submission.sourceCode || submission.code || 'No code available'}</code>
                        </pre>
                      </div>
                    </details>
                    
                    {submission.errorMessage && (
                      <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        <strong>Error:</strong> {submission.errorMessage}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Back Button */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/practice">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Practice
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{(filteredProblems && filteredProblems[0]?.category) || (problems && problems[0]?.category) || "Problems"}</CardTitle>
                <CardDescription>
                  {(filteredProblems?.length || 0)} of {(problems?.length || 0)} problems
                  {searchQuery && ` matching "${searchQuery}"`}
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search problems..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm table-fixed">
                <colgroup>
                  <col className="w-[40%]" />
                  <col className="w-[15%]" />
                  <col className="w-[15%]" />
                  <col className="w-[30%]" />
                </colgroup>
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="px-2 py-2 font-medium">Title</th>
                    <th className="px-2 py-2 font-medium">Difficulty</th>
                    <th className="px-2 py-2 font-medium">Status</th>
                    <th className="px-2 py-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {!filteredProblems || filteredProblems.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-2 py-8 text-center text-muted-foreground">
                        {searchQuery ? `No problems found matching "${searchQuery}"` : "No problems found"}
                      </td>
                    </tr>
                  ) : (
                    Array.isArray(filteredProblems) && filteredProblems.map((problem) => {
                      const status = getProblemStatus(problem.id)
                      return (
                        <tr key={problem.id} className="border-t hover:bg-muted/50">
                          <td className="px-2 py-3">
                            <Link href={`/practice/problem/${problem.id}`} className="hover:underline font-medium">
                              {problem.title}
                            </Link>
                          </td>
                          <td className="px-2 py-3">
                            <DifficultyBadge level={problem.difficulty} />
                          </td>
                          <td className="px-2 py-3">
                            <StatusBadge status={status} />
                          </td>
                          <td className="px-2 py-3">
                            <div className="flex gap-1 items-center">
                              <Button size="sm" asChild className="min-w-[70px]">
                                <Link href={`/practice/problem/${problem.id}`}>
                                  {getActionText(status)}
                                </Link>
                              </Button>
                              {status === "Solved" && (
                                <SubmissionHistory problemId={problem.id.toString()} />
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

 
