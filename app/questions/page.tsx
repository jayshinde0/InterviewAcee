"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Code, MessageSquare, Clock, Users, Star, Play, Building } from "lucide-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"

const questions = [
  {
    id: 1,
    title: "Two Sum",
    type: "coding",
    difficulty: "easy",
    category: "Arrays",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    timeEstimate: 15,
    companies: ["Google", "Amazon", "Microsoft"],
    solved: true,
    rating: 4.5,
    attempts: 1247,
  },
  {
    id: 2,
    title: "Tell me about yourself",
    type: "behavioral",
    difficulty: "easy",
    category: "General",
    description:
      "A common opening question in interviews. Prepare a concise summary of your background, skills, and career goals.",
    timeEstimate: 5,
    companies: ["Google", "Amazon", "Microsoft", "Apple", "Meta"],
    solved: false,
    rating: 4.2,
    attempts: 892,
  },
  {
    id: 3,
    title: "Binary Tree Inorder Traversal",
    type: "coding",
    difficulty: "medium",
    category: "Trees",
    description: "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
    timeEstimate: 25,
    companies: ["Meta", "Apple", "Netflix"],
    solved: false,
    rating: 4.3,
    attempts: 1056,
  },
  {
    id: 4,
    title: "Describe a challenging project",
    type: "behavioral",
    difficulty: "medium",
    category: "Experience",
    description: "Discuss a project where you faced significant challenges and how you overcame them.",
    timeEstimate: 10,
    companies: ["Google", "Amazon", "Microsoft", "Apple", "Meta"],
    solved: true,
    rating: 4.1,
    attempts: 743,
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    type: "coding",
    difficulty: "medium",
    category: "Strings",
    description: "Given a string s, return the longest palindromic substring in s.",
    timeEstimate: 30,
    companies: ["Amazon", "Microsoft", "Google"],
    solved: false,
    rating: 4.4,
    attempts: 934,
  },
  {
    id: 6,
    title: "Why Google?",
    type: "behavioral",
    difficulty: "easy",
    category: "Motivation",
    description: "Express your genuine interest in Google's mission, products, and culture.",
    timeEstimate: 5,
    companies: ["Google"],
    solved: true,
    rating: 4.0,
    attempts: 1123,
  },
  {
    id: 7,
    title: "Merge k Sorted Lists",
    type: "coding",
    difficulty: "hard",
    category: "Linked Lists",
    description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.",
    timeEstimate: 45,
    companies: ["Google", "Meta", "Uber"],
    solved: false,
    rating: 4.6,
    attempts: 567,
  },
  {
    id: 8,
    title: "Describe your leadership style",
    type: "behavioral",
    difficulty: "hard",
    category: "Leadership",
    description: "Explain how you lead teams and motivate others, with specific examples.",
    timeEstimate: 15,
    companies: ["Amazon", "Microsoft", "Apple"],
    solved: false,
    rating: 4.2,
    attempts: 456,
  },
  {
    id: 9,
    title: "System Design: Design Instagram",
    type: "coding",
    difficulty: "hard",
    category: "System Design",
    description: "Design a photo-sharing social media platform like Instagram.",
    timeEstimate: 60,
    companies: ["Meta", "Google", "Amazon"],
    solved: false,
    rating: 4.7,
    attempts: 234,
  },
  {
    id: 10,
    title: "Why did you leave your last job?",
    type: "behavioral",
    difficulty: "medium",
    category: "Experience",
    description: "Discuss your career transitions professionally and positively.",
    timeEstimate: 8,
    companies: ["Apple", "Microsoft", "Netflix"],
    solved: false,
    rating: 4.0,
    attempts: 678,
  },
  {
    id: 11,
    title: "LRU Cache",
    type: "coding",
    difficulty: "medium",
    category: "Design",
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
    timeEstimate: 35,
    companies: ["Amazon", "Google", "Microsoft"],
    solved: true,
    rating: 4.5,
    attempts: 892,
  },
  {
    id: 12,
    title: "Tell me about Amazon's leadership principles",
    type: "behavioral",
    difficulty: "medium",
    category: "Company Culture",
    description: "Demonstrate understanding of Amazon's 16 leadership principles with examples.",
    timeEstimate: 12,
    companies: ["Amazon"],
    solved: false,
    rating: 4.3,
    attempts: 445,
  },
]

const categories = {
  coding: [
    "Arrays",
    "Strings",
    "Trees",
    "Linked Lists",
    "Dynamic Programming",
    "Graphs",
    "Sorting",
    "Design",
    "System Design",
  ],
  behavioral: [
    "General",
    "Experience",
    "Motivation",
    "Leadership",
    "Teamwork",
    "Conflict Resolution",
    "Company Culture",
  ],
}

const companies = Array.from(new Set(questions.flatMap((q) => q.companies))).sort()

export default function QuestionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCompany, setSelectedCompany] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesSearch =
        question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = selectedType === "all" || question.type === selectedType
      const matchesDifficulty = selectedDifficulty === "all" || question.difficulty === selectedDifficulty
      const matchesCategory = selectedCategory === "all" || question.category === selectedCategory
      const matchesCompany = selectedCompany === "all" || question.companies.includes(selectedCompany)
      const matchesTab = activeTab === "all" || question.type === activeTab

      return matchesSearch && matchesType && matchesDifficulty && matchesCategory && matchesCompany && matchesTab
    })
  }, [searchTerm, selectedType, selectedDifficulty, selectedCategory, selectedCompany, activeTab])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getTypeIcon = (type: string) => {
    return type === "coding" ? <Code className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Question Bank</h1>
          <p className="text-muted-foreground mt-2">
            Browse and practice from our comprehensive collection of interview questions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-2xl font-bold">{questions.filter((q) => q.type === "coding").length}</p>
                  <p className="text-sm text-muted-foreground">Coding Problems</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-2xl font-bold">{questions.filter((q) => q.type === "behavioral").length}</p>
                  <p className="text-sm text-muted-foreground">Behavioral Questions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-2xl font-bold">{questions.filter((q) => q.solved).length}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-2xl font-bold">{companies.length}</p>
                  <p className="text-sm text-muted-foreground">Companies</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round((questions.filter((q) => q.solved).length / questions.length) * 100)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="coding">Coding</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Difficulty</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="All difficulties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.values(categories)
                      .flat()
                      .map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Company</label>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder="All companies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Questions ({filteredQuestions.length})</TabsTrigger>
            <TabsTrigger value="coding">
              Coding ({filteredQuestions.filter((q) => q.type === "coding").length})
            </TabsTrigger>
            <TabsTrigger value="behavioral">
              Behavioral ({filteredQuestions.filter((q) => q.type === "behavioral").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="grid gap-4">
              {filteredQuestions.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No questions found matching your criteria.</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedType("all")
                        setSelectedDifficulty("all")
                        setSelectedCategory("all")
                        setSelectedCompany("all")
                      }}
                      className="mt-4 bg-transparent"
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredQuestions.map((question) => (
                  <Card key={question.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getTypeIcon(question.type)}
                            <CardTitle className="text-lg">{question.title}</CardTitle>
                            {question.solved && <Badge variant="secondary">Completed</Badge>}
                          </div>
                          <CardDescription className="text-sm">{question.description}</CardDescription>
                        </div>
                        <Button asChild>
                          <Link href={`/practice/${question.id}`}>
                            <Play className="w-4 h-4 mr-2" />
                            Start
                          </Link>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Badge className={getDifficultyColor(question.difficulty)}>
                            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                          </Badge>
                          <Badge variant="outline">{question.category}</Badge>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{question.timeEstimate} min</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Star className="w-4 h-4" />
                            <span>{question.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">{question.attempts} attempts</span>
                          <div className="flex space-x-1">
                            {question.companies.slice(0, 3).map((company) => (
                              <Badge
                                key={company}
                                variant="secondary"
                                className="text-xs bg-accent/20 text-accent-foreground"
                              >
                                {company}
                              </Badge>
                            ))}
                            {question.companies.length > 3 && (
                              <Badge variant="secondary" className="text-xs bg-accent/20 text-accent-foreground">
                                +{question.companies.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
