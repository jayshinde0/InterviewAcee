"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, AlertCircle, Tag, Code, Lightbulb, Copy, Play } from "lucide-react"
import Link from "next/link"

interface CodeSnippet {
  code: string
  lang: string
  langSlug: string
}

interface TopicTag {
  name: string
  slug: string
}

interface SimilarQuestion {
  difficulty: string
  title: string
  titleSlug: string
}

interface Problem {
  codeSnippets: CodeSnippet[]
  companyTagStats: any
  content: string
  difficulty: "Easy" | "Medium" | "Hard"
  exampleTestcaseList: string[]
  hints: string[]
  questionId: string
  similarQuestionList: SimilarQuestion[]
  title: string
  topicTags: TopicTag[]
}

export default function ProblemDetailPage() {
  const { slug } = useParams()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string>("python3")
  const [activeTab, setActiveTab] = useState<"description" | "solutions" | "hints">("description")

  useEffect(() => {
    async function fetchProblem() {
      try {
        setError(null)
        setLoading(true)
        const res = await fetch(`/api/prepleet/problemdetail/${slug}`)
        
        if (!res.ok) {
          throw new Error(`Failed to fetch problem: ${res.status}`)
        }
        
        const data = await res.json()
        
        // Expecting a single problem object, not an array
        if (!data || typeof data !== 'object') {
          throw new Error("Invalid problem data received")
        }
        
        setProblem(data)
      } catch (error) {
        console.error("Error fetching problem:", error)
        setError(error instanceof Error ? error.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProblem()
    }
  }, [slug])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-500/15 text-emerald-500"
      case "Medium":
        return "bg-amber-500/15 text-amber-500"
      case "Hard":
        return "bg-rose-500/15 text-rose-500"
      default:
        return "bg-gray-500/15 text-gray-400"
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getCurrentCodeSnippet = () => {
    return problem?.codeSnippets?.find(snippet => snippet.langSlug === selectedLanguage)?.code || ""
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading problem details...</p>
        </div>
      </div>
    )
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/codepractice">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Practice
              </Link>
            </Button>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <div>
                  <h3 className="text-lg font-semibold">Error Loading Problem</h3>
                  <p className="text-muted-foreground mt-2">
                    {error || "Problem not found"}
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link href="/codepractice">Back to Practice</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/codepractice">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Practice
            </Link>
          </Button>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem Description */}
          
          <Card className="lg:col-span-1">
            <CardHeader>
                              <div>
                  <h1 className="text-2xl font-bold">{problem.title}</h1>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={getDifficultyColor(problem.difficulty)}>
                      {problem.difficulty}
                    </Badge>
                    <span className="text-sm text-muted-foreground">ID: {problem.questionId}</span>
                  </div>
                </div>
              <div className="flex gap-4 border-b">
                <Button
                  variant={activeTab === "description" ? "default" : "ghost"}
                  onClick={() => setActiveTab("description")}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  Description
                </Button>
                <Button
                  variant={activeTab === "hints" ? "default" : "ghost"}
                  onClick={() => setActiveTab("hints")}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  Hints ({problem.hints?.length || 0})
                </Button>
                <Button
                  variant={activeTab === "solutions" ? "default" : "ghost"}
                  onClick={() => setActiveTab("solutions")}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  Similar Questions ({problem.similarQuestionList?.length || 0})
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-5">

              {activeTab === "description" && (
                <div className="space-y-6">
                  {/* Topic Tags */}
                  {problem.topicTags && problem.topicTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {problem.topicTags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Problem Content */}
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: problem.content }}
                  />

                  {/* Examples */}
                  {problem.exampleTestcaseList && problem.exampleTestcaseList.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Examples:</h3>
                      {problem.exampleTestcaseList.map((example, index) => (
                        <div key={index} className="bg-muted p-3 rounded-lg">
                          <pre className="text-sm whitespace-pre-wrap">{example}</pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "hints" && (
                <div className="space-y-4">
                  {problem.hints && problem.hints.length > 0 ? (
                    problem.hints.map((hint, index) => (
                      <div key={index} className="flex gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                        <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{hint}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No hints available for this problem.</p>
                  )}
                </div>
              )}

              {activeTab === "solutions" && (
                <div className="space-y-4">
                  {problem.similarQuestionList && problem.similarQuestionList.length > 0 ? (
                    <div>
                      <h4 className="font-semibold mb-3">Similar Questions:</h4>
                      <div className="space-y-2">
                        {problem.similarQuestionList.map((question, index) => (
                          <div key={index} className="flex justify-between items-center p-2 hover:bg-accent rounded">
                            <span className="text-sm">{question.title}</span>
                            <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
                              {question.difficulty}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No similar questions available.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Code Editor Area */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Code Solution</CardTitle>
                <div className="flex gap-2">
                  {problem.codeSnippets && problem.codeSnippets.length > 0 && (
                    <select 
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="px-3 py-1 border rounded text-sm"
                    >
                      {problem.codeSnippets.map((snippet) => (
                        <option key={snippet.langSlug} value={snippet.langSlug}>
                          {snippet.lang}
                        </option>
                      ))}
                    </select>
                  )}
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(getCurrentCodeSnippet())}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button size="sm">
                    <Play className="h-4 w-4 mr-1" />
                    Run Code
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                <pre className="whitespace-pre-wrap">{getCurrentCodeSnippet()}</pre>
              </div>
              
              {/* Submission Area */}
              <div className="mt-4 p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Test Your Solution</h4>
                <textarea 
                  placeholder="Enter your test cases here..."
                  className="w-full h-20 p-2 border rounded text-sm"
                />
                <Button className="w-full mt-2">
                  Submit Solution
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}