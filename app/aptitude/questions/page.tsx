"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, CheckCircle, XCircle, Clock, Building } from "lucide-react"
import { useProgress } from "@/contexts/progress-context"
import { getQuestionsByCategory, getQuestionsBySubCategory, Question } from "@/lib/questions-data"

export default function QuestionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { updateProgress, isQuestionSolved, isQuestionCorrect } = useProgress()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string }>({})
  const [showResults, setShowResults] = useState<{ [questionId: string]: boolean }>({})

  const category = searchParams.get("category") || ""
  const subCategory = searchParams.get("subCategory") || ""
  
  const questions = useMemo(() => {
    if (subCategory) {
      return getQuestionsBySubCategory(category, subCategory, 20)
    }
    return getQuestionsByCategory(category)
  }, [category, subCategory])

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesSearch = question.question.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesDifficulty = difficultyFilter === "all" || question.difficulty === difficultyFilter
      return matchesSearch && matchesDifficulty
    })
  }, [questions, searchQuery, difficultyFilter])

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleSubmitAnswer = (question: Question) => {
    const selectedAnswer = selectedAnswers[question.id]
    if (!selectedAnswer) return

    const isCorrect = selectedAnswer === question.answer
    updateProgress(question.id, isCorrect)
    setShowResults(prev => ({
      ...prev,
      [question.id]: true
    }))
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getCompanyColor = (company: string) => {
    const colors = [
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
      "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300"
    ]
    const hash = company.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  if (!category) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Category not found</h2>
            <p className="text-muted-foreground mb-4">Please select a valid category.</p>
            <Button onClick={() => router.push("/aptitude")}>
              Back to Aptitude
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/aptitude")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Aptitude</span>
          </Button>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">
              {subCategory ? `${category} - ${subCategory}` : category}
            </h1>
            <p className="text-muted-foreground">
              {questions.length} questions available • Test your knowledge
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {filteredQuestions.map((question, index) => {
            const isSolved = isQuestionSolved(question.id)
            const isCorrect = isQuestionCorrect(question.id)
            const selectedAnswer = selectedAnswers[question.id]
            const showResult = showResults[question.id]

            return (
              <Card key={question.id} className="hover:bg-accent/5 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          Question {index + 1}
                        </Badge>
                        <Badge className={`text-xs ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </Badge>
                        <Badge className={`text-xs ${getCompanyColor(question.companies[0])}`}>
                          <Building className="w-3 h-3 mr-1" />
                          {question.companies[0]}
                        </Badge>
                        {isSolved && (
                          <Badge 
                            variant="default" 
                            className={`text-xs ${isCorrect ? 'bg-green-600' : 'bg-red-600'}`}
                          >
                            {isCorrect ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <XCircle className="w-3 h-3 mr-1" />
                            )}
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{question.question}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Building className="w-4 h-4" />
                        <span>Asked in: <span className="font-medium text-foreground">{question.companies.join(", ")}</span></span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = selectedAnswer === option
                      const isCorrectAnswer = option === question.answer
                      const showCorrectAnswer = showResult && isCorrectAnswer
                      const showIncorrectAnswer = showResult && isSelected && !isCorrectAnswer

                      return (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? showResult
                                ? isCorrectAnswer
                                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                  : "border-red-500 bg-red-50 dark:bg-red-900/20"
                                : "border-primary bg-primary/5"
                              : showCorrectAnswer
                              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                              : "border-border hover:border-primary/50 hover:bg-accent/50"
                          }`}
                          onClick={() => !showResult && handleAnswerSelect(question.id, option)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? showResult
                                  ? isCorrectAnswer
                                    ? "border-green-500 bg-green-500"
                                    : "border-red-500 bg-red-500"
                                  : "border-primary bg-primary"
                                : showCorrectAnswer
                                ? "border-green-500 bg-green-500"
                                : "border-muted-foreground"
                            }`}>
                              {(isSelected || showCorrectAnswer) && (
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              )}
                            </div>
                            <span className={`text-sm text-white ${
                              isSelected || showCorrectAnswer ? "font-medium" : ""
                            }`}>
                              {option}
                            </span>
                            {showCorrectAnswer && (
                              <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                            )}
                            {showIncorrectAnswer && (
                              <XCircle className="w-4 h-4 text-red-500 ml-auto" />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {selectedAnswer && !showResult && (
                    <div className="mt-4">
                      <Button
                        onClick={() => handleSubmitAnswer(question)}
                        className="w-full"
                      >
                        Submit Answer
                      </Button>
                    </div>
                  )}

                  {showResult && (
                    <div className="mt-4 p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium">Explanation:</span>
                        <Badge variant={isCorrect ? "default" : "destructive"}>
                          {isCorrect ? "Correct!" : "Incorrect"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        The correct answer is: <strong>{question.answer}</strong>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* No Results */}
        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No questions found</h3>
            <p className="mt-2 text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
