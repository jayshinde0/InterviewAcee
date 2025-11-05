"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Plus, Edit, Trash2, Search, RefreshCw, BookOpen, Filter, X, Check, AlertCircle, Shield } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

interface AptitudeQuestion {
  _id: string
  categoryId: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  difficultyLevel: 'easy' | 'medium' | 'hard'
  createdAt: string
}

export default function AptitudeAdminPage() {
  const [questions, setQuestions] = useState<AptitudeQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<AptitudeQuestion | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  const categories = [
    { id: 'general', name: 'General Aptitude' },
    { id: 'verbal-reasoning', name: 'Verbal & Reasoning' },
    { id: 'current-affairs', name: 'Current Affairs & GK' },
    { id: 'technical-mcqs', name: 'Technical MCQs' },
    { id: 'interview', name: 'Interview Questions' },
    { id: 'programming', name: 'Programming Questions' },
    { id: 'dynamic', name: 'Dynamic Questions' }
  ]

  const [formData, setFormData] = useState({
    categoryId: 'dynamic', // Default to dynamic category
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    difficultyLevel: 'medium' as 'easy' | 'medium' | 'hard'
  })

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory && selectedCategory !== 'all') params.append('categoryId', selectedCategory)
      if (selectedDifficulty && selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty)
      if (searchQuery) params.append('search', searchQuery)
      
      const response = await fetch(`/api/aptitude/manage?${params}`)
      if (response.ok) {
        const data = await response.json()
        setQuestions(data.questions)
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuthorization()
  }, [])

  useEffect(() => {
    if (isAuthorized) {
      fetchQuestions()
    }
  }, [selectedCategory, selectedDifficulty, searchQuery, isAuthorized])

  const checkAuthorization = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const userData = await response.json()
        // Check if user is admin or has admin privileges
        if (userData.user?.role === 'admin' || userData.user?.email === 'jayshinde4554@gmail.com') {
          setIsAuthorized(true)
        } else {
          // Redirect to dashboard if not authorized
          window.location.href = '/dashboard'
        }
      } else {
        // Redirect to login if not authenticated
        window.location.href = '/auth/login'
      }
    } catch (error) {
      console.error('Authorization check failed:', error)
      window.location.href = '/auth/login'
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingQuestion ? '/api/aptitude/manage' : '/api/aptitude/manage'
      const method = editingQuestion ? 'PUT' : 'POST'
      const body = editingQuestion 
        ? { ...formData, questionId: editingQuestion._id }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        await fetchQuestions()
        resetForm()
        alert(editingQuestion ? 'Question updated successfully!' : 'Question created successfully!')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error saving question:', error)
      alert('Error saving question')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/aptitude/manage?questionId=${questionId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchQuestions()
        alert('Question deleted successfully!')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting question:', error)
      alert('Error deleting question')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (question: AptitudeQuestion) => {
    setEditingQuestion(question)
    setFormData({
      categoryId: question.categoryId,
      question: question.question,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || '',
      difficultyLevel: question.difficultyLevel
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setEditingQuestion(null)
    setFormData({
      categoryId: 'dynamic', // Default to dynamic category
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      difficultyLevel: 'medium'
    })
    setShowForm(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'hard': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Show loading while checking authorization
  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Checking permissions...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Show unauthorized message if not admin
  if (!isAuthorized) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <Shield className="h-12 w-12 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
            <Button onClick={() => window.location.href = '/dashboard'}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Question Bank</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Manage and organize your aptitude test questions
            </p>
          </div>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-lg">
                <Plus className="h-5 w-5 mr-2" />
                Create Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {editingQuestion ? 'Edit Question' : 'Create New Question'}
                </DialogTitle>
                <DialogDescription>
                  {editingQuestion ? 'Update the question details below.' : 'Fill in the details to create a new question.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Category</Label>
                    <Select value={formData.categoryId} onValueChange={(value) => setFormData({...formData, categoryId: value})}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Difficulty Level</Label>
                    <Select value={formData.difficultyLevel} onValueChange={(value: 'easy' | 'medium' | 'hard') => setFormData({...formData, difficultyLevel: value})}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>Easy</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <span>Medium</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="hard">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span>Hard</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Question</Label>
                  <Textarea
                    value={formData.question}
                    onChange={(e) => setFormData({...formData, question: e.target.value})}
                    placeholder="Enter your question here..."
                    className="min-h-[100px] resize-none"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-medium">Answer Options</Label>
                  <div className="space-y-3">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg bg-muted/30">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={formData.correctAnswer === index}
                            onChange={() => setFormData({...formData, correctAnswer: index})}
                            className="w-4 h-4 text-primary"
                          />
                          <span className="text-sm font-medium text-muted-foreground">
                            {String.fromCharCode(65 + index)}.
                          </span>
                        </div>
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...formData.options]
                            newOptions[index] = e.target.value
                            setFormData({...formData, options: newOptions})
                          }}
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          className="flex-1"
                          required
                        />
                        {formData.correctAnswer === index && (
                          <Check className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Select the correct answer by clicking the radio button next to it
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Explanation (Optional)</Label>
                  <Textarea
                    value={formData.explanation}
                    onChange={(e) => setFormData({...formData, explanation: e.target.value})}
                    placeholder="Provide an explanation for the correct answer..."
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <Separator />

                <div className="flex justify-end space-x-3">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading} className="min-w-[120px]">
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        {editingQuestion ? 'Update' : 'Create'} Question
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Questions</p>
                  <p className="text-3xl font-bold">{questions.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Categories</p>
                  <p className="text-3xl font-bold">{categories.length}</p>
                </div>
                <Filter className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Easy Questions</p>
                  <p className="text-3xl font-bold">
                    {questions.filter(q => q.difficultyLevel === 'easy').length}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Hard Questions</p>
                  <p className="text-3xl font-bold">
                    {questions.filter(q => q.difficultyLevel === 'hard').length}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Filters & Search</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Search Questions</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by question text..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Difficulty</Label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="All difficulties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All difficulties</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={fetchQuestions} disabled={loading} variant="outline" className="h-11 w-full">
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Questions ({questions.length})</CardTitle>
              </div>
              {questions.length > 0 && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Showing {questions.length} questions</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-3">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto" />
                  <p className="text-muted-foreground">Loading questions...</p>
                </div>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">No questions found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all'
                      ? 'Try adjusting your filters or search terms.'
                      : 'Get started by creating your first question.'}
                  </p>
                </div>
                <Button onClick={() => setShowForm(true)} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Question
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question._id} className="group relative border rounded-xl p-6 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-background to-muted/20">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-4">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                              {index + 1}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="text-xs">
                                {categories.find(c => c.id === question.categoryId)?.name}
                              </Badge>
                              <Badge className={`text-xs ${getDifficultyColor(question.difficultyLevel)}`}>
                                <div className={`w-2 h-2 rounded-full mr-1 ${
                                  question.difficultyLevel === 'easy' ? 'bg-green-600' :
                                  question.difficultyLevel === 'medium' ? 'bg-yellow-600' : 'bg-red-600'
                                }`}></div>
                                {question.difficultyLevel.charAt(0).toUpperCase() + question.difficultyLevel.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(question)} className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(question._id)} className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Question */}
                        <div className="space-y-3">
                          <h3 className="text-lg font-medium leading-relaxed text-foreground">
                            {question.question}
                          </h3>
                          
                          {/* Options */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                                optionIndex === question.correctAnswer 
                                  ? 'bg-green-50 border-green-200 text-green-800' 
                                  : 'bg-muted/30 border-border hover:bg-muted/50'
                              }`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                  optionIndex === question.correctAnswer
                                    ? 'bg-green-600 text-white'
                                    : 'bg-muted-foreground/20 text-muted-foreground'
                                }`}>
                                  {String.fromCharCode(65 + optionIndex)}
                                </div>
                                <span className="flex-1 text-sm">{option}</span>
                                {optionIndex === question.correctAnswer && (
                                  <Check className="h-4 w-4 text-green-600" />
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Explanation */}
                          {question.explanation && (
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="flex items-start space-x-2">
                                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-blue-900 mb-1">Explanation</p>
                                  <p className="text-sm text-blue-800">{question.explanation}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}