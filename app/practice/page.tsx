"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Clock, Star, Target, CheckCircle, Search } from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { getCategories, getCategoryStats, getOverallStats } from "@/lib/problems"
import { useState, useMemo, useEffect } from "react"

export default function PracticeOverviewPage() {
  const categories = getCategories()
  const categoryStats = getCategoryStats()
  const overallStats = getOverallStats()
  const [searchQuery, setSearchQuery] = useState("")
  const [companies, setCompanies] = useState<string[]>([]) // store company list
  const [loading, setLoading] = useState(true)

  // Fetch companies from API
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch("/api/prepleet/companies");
        const data = await res.json()
        setCompanies(data)
      } catch (err) {
        console.error("Error fetching companies:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCompanies()
  }, [])

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categoryStats
    return categoryStats.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [categoryStats, searchQuery])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-500/15 text-emerald-400"
      case "Medium":
        return "bg-amber-500/15 text-amber-400"
      case "Hard":
        return "bg-rose-500/15 text-rose-400"
      default:
        return "bg-gray-500/15 text-gray-400"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Coding Practice</h1>
          <p className="text-muted-foreground mt-2">Sharpen your coding skills with our interactive problems</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Problems Solved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.solved} / {overallStats.total}</div>
              <p className="text-xs text-muted-foreground">Great pace! Keep going.</p>
              <Progress value={overallStats.completionRate} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Problems being worked on</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Target className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.completionRate}%</div>
              <p className="text-xs text-muted-foreground">Overall progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Problems</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.total}</div>
              <p className="text-xs text-muted-foreground">Available to solve</p>
            </CardContent>
          </Card>
        </div>

        {/* Search Section */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Choose a topic to start practicing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredCategories.map((category) => (
                <Link key={category.id} href={`/practice/category/${category.id}`}>
                  <div className="flex flex-col rounded-lg border p-4 hover:bg-accent transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{category.name}</h3>
                      <Badge variant="secondary">{category.total}</Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Solved:</span>
                        <span className="text-green-500">{category.solved}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>In Progress:</span>
                        <span className="text-blue-500">{category.inProgress}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Easy: {category.easy}</span>
                        <span>Medium: {category.medium}</span>
                        <span>Hard: {category.hard}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Progress value={(category.solved / category.total) * 100} className="h-2" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Companies Section */}
<Card>
  <CardHeader>
    <CardTitle>Companies</CardTitle>
    <CardDescription>Filter problems by company tags</CardDescription>
  </CardHeader>
  <CardContent>
    {loading ? (
      <p className="text-muted-foreground">Loading companies...</p>
    ) : (
      <div className="flex flex-wrap gap-2">
        {companies.map((company, index) => (
          <Link
            key={index}
            href={`/practice/companies/${encodeURIComponent(company)}`}
          >
            <Badge
              variant="outline"
              className="px-3 py-1 cursor-pointer hover:bg-accent transition-colors"
            >
              {company}
            </Badge>
          </Link>
        ))}
      </div>
    )}
  </CardContent>
</Card>
      </div>
    </DashboardLayout>
  )
}
