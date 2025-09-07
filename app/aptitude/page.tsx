"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Target, Brain, Calculator, MessageSquare, Zap } from "lucide-react"
import { useProgress } from "@/contexts/progress-context"
import { getQuestionsByCategory, getQuestionsBySubCategory } from "@/lib/questions-data"

const aptitudeCategories = [
  {
    id: "general",
    title: "General Aptitude",
    icon: Calculator,
    description: "Core mathematical and analytical skills",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    topics: [
      "Arithmetic Aptitude",
      "Data Interpretation",
      "Data Interpretation Test"
    ]
  },
  {
    id: "verbal-reasoning",
    title: "Verbal and Reasoning",
    icon: MessageSquare,
    description: "Language skills and logical thinking",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    topics: [
      "Verbal Ability",
      "Logical Reasoning",
      "Verbal Reasoning",
      "Non Verbal Reasoning"
    ]
  },
  {
    id: "current-affairs",
    title: "Current Affairs & GK",
    icon: Brain,
    description: "General knowledge and current events",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    topics: [
      "Current Affairs",
      "Basic General Knowledge",
      "General Science",
      "Inventions"
    ]
  },
  {
    id: "interview",
    title: "Interview",
    icon: Target,
    description: "Interview preparation and placement",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    topics: [
      "Placement Papers",
      "Group Discussion",
      "HR Interview",
      "Body Language"
    ]
  },
  {
    id: "programming",
    title: "Programming",
    icon: Zap,
    description: "Programming aptitude and technical skills",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    topics: [
      "C Programming",
      "C++ Programming",
      "Java Programming",
      "Python Programming"
    ]
  },
  {
    id: "technical-mcqs",
    title: "Technical MCQs",
    icon: Search,
    description: "Technical knowledge and concepts",
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    topics: [
      "Networking Questions",
      "Database Questions",
      "Basic Electronics",
      "Digital Electronics"
    ]
  }
]

export default function AptitudePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { progress } = useProgress()

  const filteredCategories = useMemo(() => {
    return aptitudeCategories.filter((category) => {
      const matchesSearch =
        category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.topics.some(topic => 
          topic.toLowerCase().includes(searchQuery.toLowerCase())
        )
      return matchesSearch
    })
  }, [searchQuery])

  const getCategoryProgress = (categoryTitle: string) => {
    const questions = getQuestionsByCategory(categoryTitle)
    const solved = questions.filter(q => progress[q.id]?.solved).length
    return { solved, total: questions.length }
  }

  const getSubCategoryProgress = (categoryTitle: string, subCategoryTitle: string) => {
    const questions = getQuestionsBySubCategory(categoryTitle, subCategoryTitle)
    const solved = questions.filter(q => progress[q.id]?.solved).length
    return { solved, total: questions.length }
  }

  const handleSubTopicClick = (categoryTitle: string, subTopic: string) => {
    router.push(`/aptitude/questions?category=${encodeURIComponent(categoryTitle)}&subCategory=${encodeURIComponent(subTopic)}`)
  }


  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Aptitude Tests</h1>
            <p className="text-muted-foreground">Comprehensive aptitude preparation across all categories</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search categories and topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Test Categories with Start Buttons */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => {
            const Icon = category.icon
            const progress = getCategoryProgress(category.title)
            const progressPercentage = progress.total > 0 ? Math.round((progress.solved / progress.total) * 100) : 0
            
            return (
              <Card 
                key={`test-${category.id}`} 
                className="hover:bg-accent/5 transition-colors group"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${category.bgColor} group-hover:opacity-80 transition-colors`}>
                        <Icon className={`h-6 w-6 ${category.color}`} />
                      </div>
                      <div>
                        <CardTitle className={`text-lg ${category.color} group-hover:opacity-80 transition-colors`}>
                          {category.title}
                        </CardTitle>
                        <CardDescription className="text-sm">{category.description}</CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${category.color}`}>
                        20
                      </div>
                      <div className="text-xs text-muted-foreground">
                        questions
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <Button 
                      onClick={() => router.push(`/aptitude/test/${category.id}`)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                      Start Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No categories found</h3>
            <p className="mt-2 text-muted-foreground">Try adjusting your search criteria.</p>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
