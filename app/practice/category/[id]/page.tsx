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
  const [difficultyFilter, setDifficultyFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [problems, setProblems] = useState<Problem[]>([])
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([])
  const [userProgress, setUserProgress] = useState<Record<number, "Unsolved" | "In-progress" | "Solved">>({})
  
  useEffect(() => {
    const categoryProblems = getProblemsByCategory(categoryId)
    setProblems(categoryProblems)
    setUserProgress(getUserProgress())
  }, [categoryId])

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
    return userProgress[problemId] || "Unsolved"
  }

  const getActionText = (status: "Unsolved" | "In-progress" | "Solved") => {
    switch (status) {
      case "Solved": return "Review"
      case "In-progress": return "Continue"
      default: return "Start"
    }
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
              <table className="w-full text-sm">
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
                            <Button size="sm" asChild>
                              <Link href={`/practice/problem/${problem.id}`}>
                                {getActionText(status)}
                              </Link>
                            </Button>
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

 
