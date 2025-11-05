"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard-layout"
import { BookOpen, Clock, Users, TrendingUp, Play, Search, RefreshCw } from "lucide-react"

export default function AptitudePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Default categories with their styling
  const defaultCategories = [
    {
      id: "general",
      title: "General Aptitude",
      description: "Mathematical and numerical reasoning",
      topics: ["Arithmetic", "Data Interpretation", "Statistics", "Number Systems"],
      questions: 0,
      difficulty: "Medium",
      timeLimit: "20 min",
      color: "bg-blue-500"
    },
    {
      id: "verbal-reasoning",
      title: "Verbal & Reasoning",
      description: "Language skills and logical thinking",
      topics: ["Verbal Ability", "Logical Reasoning", "Reading Comprehension", "Analogies"],
      questions: 0,
      difficulty: "Medium",
      timeLimit: "20 min",
      color: "bg-green-500"
    },
    {
      id: "current-affairs",
      title: "Current Affairs & GK",
      description: "Current affairs and general awareness",
      topics: ["Current Affairs", "Science", "History", "Geography"],
      questions: 0,
      difficulty: "Easy",
      timeLimit: "20 min",
      color: "bg-purple-500"
    },
    {
      id: "technical-mcqs",
      title: "Technical MCQs",
      description: "Technical knowledge and concepts",
      topics: ["Programming", "Data Structures", "Algorithms", "System Design"],
      questions: 0,
      difficulty: "Hard",
      timeLimit: "20 min",
      color: "bg-orange-500"
    },
    {
      id: "interview",
      title: "Interview Questions",
      description: "Common interview questions and scenarios",
      topics: ["Behavioral", "Technical", "HR Questions", "Problem Solving"],
      questions: 0,
      difficulty: "Medium",
      timeLimit: "20 min",
      color: "bg-red-500"
    },
    {
      id: "programming",
      title: "Programming Questions",
      description: "Programming concepts and coding questions",
      topics: ["Coding", "Logic Building", "Syntax", "Best Practices"],
      questions: 0,
      difficulty: "Hard",
      timeLimit: "20 min",
      color: "bg-indigo-500"
    }
  ]

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/aptitude/categories')
      if (response.ok) {
        const data = await response.json()

        // Merge default categories with database categories and update question counts
        const updatedCategories = defaultCategories.map(defaultCat => {
          const dbCategory = data.categories.find((cat: any) => cat.categoryId === defaultCat.id)
          return {
            ...defaultCat,
            questions: dbCategory ? dbCategory.actualQuestionCount : 0
          }
        })

        // Add any additional categories from database that aren't in defaults
        const additionalCategories = data.categories
          .filter((cat: any) => !defaultCategories.find(def => def.id === cat.categoryId))
          .map((cat: any) => ({
            id: cat.categoryId,
            title: cat.name,
            description: cat.description || "Custom category",
            topics: ["Custom Questions"],
            questions: cat.actualQuestionCount || 0,
            difficulty: "Medium",
            timeLimit: "20 min",
            color: "bg-teal-500" // Default color for custom categories
          }))

        setCategories([...updatedCategories, ...additionalCategories])
      } else {
        // Fallback to default categories if API fails
        setCategories(defaultCategories)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories(defaultCategories)
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.topics.some((topic: string) => topic.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Hard": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Aptitude Practice</h1>
            <p className="text-muted-foreground">
              Improve your aptitude skills with our comprehensive question bank
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button
              variant="outline"
              onClick={fetchCategories}
              disabled={loading}
              className="whitespace-nowrap"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/admin/aptitude')}
              className="whitespace-nowrap"
            >
              Manage Questions
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
              <p className="text-xs text-muted-foreground">Available test categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {categories.reduce((total, cat) => total + cat.questions, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Practice questions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">20 min</div>
              <p className="text-xs text-muted-foreground">Per test session</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">Average score</p>
            </CardContent>
          </Card>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Loading categories...</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4`}>
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <Badge className={getDifficultyColor(category.difficulty)}>
                      {category.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {category.questions} Questions
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {category.timeLimit}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Topics covered:</p>
                    <div className="flex flex-wrap gap-1">
                      {category.topics.slice(0, 3).map((topic: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {category.topics.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{category.topics.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => router.push(`/aptitude/test/${category.id}`)}
                    disabled={category.questions === 0}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {category.questions === 0 ? 'No Questions' : 'Start Test'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No categories found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}