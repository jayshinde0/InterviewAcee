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
          <h1 className="text-3xl font-bold text-foreground">Practice Leetcode Problems</h1>
          <p className="text-muted-foreground mt-2">Sharpen your coding skills with our PrepLeet Module</p>
        </div>



        {/* Search Section */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search Problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>



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
            href={`/codepractice/companies/${encodeURIComponent(company)}`}
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
