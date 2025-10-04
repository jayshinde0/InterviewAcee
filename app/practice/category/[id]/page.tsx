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
import { History, Clock, CheckCircle, XCircle } from "lucide-react"

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
  }, [categoryId, user?.id])

  const fetchProblemsFromMongoDB = async () => {
    try {
      console.log('Fetching problems for category:', categoryId)
      const response = await fetch(`/api/problems/category/${categoryId}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('MongoDB problems fetched:', data.problems?.length || 0)
        if (data.problems && data.problems.length > 0) {
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
      setProblems(categoryProblems)
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
    if (!userId || submissionHistory[problemId]) return submissionHistory[problemId]
    
    try {
      const history = await getCodingHistory(problemId)
      setSubmissionHistory(prev => ({ ...prev, [problemId]: history }))
      return history
    } catch (error) {
      console.error('Error fetching submission history:', error)
      return []
    }
  }

  // Filter problems based on difficulty and search query
  useEffect(() => {
    let filtered = filterProblemsByDifficulty(problems, difficultyFilter)
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(problem =>
        problem.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    setFilteredProblems(filtered)
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

    const loadHistory = async () => {
      setLoading(true)
      try {
        const historyData = await fetchSubmissionHistory(problemId)
        setHistory(historyData)
      } catch (error) {
        console.error('Error loading history:', error)
      } finally {
        setLoading(false)
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
            <DialogTitle>Submission History</DialogTitle>
            <DialogDescription>
              All submissions for this problem
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh]">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No submissions found for this problem
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((submission, index) => (
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
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {submission.testCasesPassed}/{submission.totalTestCases} tests passed
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {submission.programmingLanguage?.toUpperCase()}
                        </div>
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
                        View Code
                      </summary>
                      <div className="mt-2 p-3 bg-muted rounded border">
                        <pre className="text-xs overflow-x-auto">
                          <code>{submission.sourceCode}</code>
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
                <CardTitle>{filteredProblems[0]?.category || problems[0]?.category || "Problems"}</CardTitle>
                <CardDescription>
                  {filteredProblems.length} of {problems.length} problems
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
                  {filteredProblems.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-2 py-8 text-center text-muted-foreground">
                        {searchQuery ? `No problems found matching "${searchQuery}"` : "No problems found"}
                      </td>
                    </tr>
                  ) : (
                    filteredProblems.map((problem) => {
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

 
