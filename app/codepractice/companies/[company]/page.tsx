"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Problem {
  Company: string
  Difficulty: "EASY" | "MEDIUM" | "HARD"
  Link: string
  Slug: string
  Title: string
}

export default function CompanyPage() {
  const { company } = useParams()
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProblems() {
      try {
        const res = await fetch(`/api/prepleet/compspec/${company}`)
        if (!res.ok) throw new Error("Failed to fetch problems")
        const data = await res.json()
        setProblems(data)
      } catch (error) {
        console.error("Error fetching problems:", error)
      } finally {
        setLoading(false)
      }
    }

    if (company) fetchProblems()
  }, [company])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-emerald-500/15 text-emerald-500"
      case "MEDIUM":
        return "bg-amber-500/15 text-amber-500"
      case "HARD":
        return "bg-rose-500/15 text-rose-500"
      default:
        return "bg-gray-500/15 text-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Back Button */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/codepractice">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Practice
            </Link>
          </Button>
        </div>
    <Card>
      <CardHeader>
        <CardTitle>{company} Problems</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading problems...</p>
        ) : problems.length === 0 ? (
          <p>No problems found for {company}</p>
        ) : (
          <div className="space-y-3">
            {problems.map((p, idx) => (
              <Link
                key={idx}
                href={`/codepractice/problem/${encodeURIComponent(p.Slug)}`}
                target="_blank"
                className="block border rounded-lg p-3 hover:bg-accent transition-colors"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{p.Title}</h3>
                  <Badge className={getDifficultyColor(p.Difficulty)}>
                    {p.Difficulty}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
      </div>
    </div>
  )
}
