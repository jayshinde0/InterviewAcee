"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Play, Send, ArrowLeft, Settings, RotateCcw } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { getProblemById, updateUserProgress, getUserProgress } from "@/lib/problems"
import { Problem } from "@/lib/problems"
import { runTestCases, TestResult } from "@/lib/test-runner"
import Link from "next/link"
import { CodeEditor } from "@/components/code-editor"
import { useAuth } from "@/contexts/auth-context"
import { useProgress } from "@/hooks/use-progress"

export default function ProblemDetailPage() {
  const params = useParams<{ id: string }>()
  const id = Number(params?.id)
  const [language, setLanguage] = useState<"java" | "python" | "cpp">("cpp")
  const [code, setCode] = useState<string>("")
  const [isRunning, setIsRunning] = useState(false)
  const [problem, setProblem] = useState<Problem | null>(null)
  const [userProgress, setUserProgress] = useState<Record<number, "Unsolved" | "In-progress" | "Solved">>({})
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<any>(null)
  const { user } = useAuth()
  const { submitCode, refreshStats } = useProgress()

  // Function to save progress to MongoDB using the progress service
  const saveProgressToDatabase = async (problemId: string, status: 'accepted' | 'wrong_answer' | 'runtime_error', testResults: TestResult[]) => {
    if (!user?._id) return
    
    try {
      const passedTests = testResults.filter(r => r.passed).length
      const totalTests = testResults.length
      
      await submitCode({
        problemId: problemId,
        programmingLanguage: language,
        sourceCode: code,
        status: status,
        executionTimeMs: Math.floor(Math.random() * 100) + 50, // Mock execution time
        memoryUsedKb: Math.floor(Math.random() * 1000) + 500, // Mock memory usage
        testCasesPassed: passedTests,
        totalTestCases: totalTests,
        errorMessage: status !== 'accepted' ? 'Some test cases failed' : undefined
      })
      
      // Refresh dashboard stats
      await refreshStats()
    } catch (error) {
      console.error('Error saving progress:', error)
    }
  }

  useEffect(() => {
    setIsMounted(true)
    fetchProblemFromMongoDB()
    setUserProgress(getUserProgress())
  }, [id])

  useEffect(() => {
    if (problem) {
      setCode(getDefaultTemplate(problem, language))
    }
  }, [problem, language])

  const fetchProblemFromMongoDB = async () => {
    try {
      const response = await fetch(`/api/problems/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProblem(data.problem)
      } else {
        // Fallback to local data if MongoDB fetch fails
        const problemData = getProblemById(id)
        if (problemData) {
          setProblem(problemData)
        }
      }
    } catch (error) {
      console.error('Error fetching problem from MongoDB:', error)
      // Fallback to local data
      const problemData = getProblemById(id)
      if (problemData) {
        setProblem(problemData)
      }
    }
  }

  const getDefaultTemplate = (problem: Problem, lang: string): string => {
    // C++ templates for specific problems
    switch (problem.title) {
      case "Two Sum":
        return `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`
      
      case "Remove Duplicates from Sorted Array":
        return `class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        
    }
};`
      
      case "Best Time to Buy and Sell Stock II":
        return `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        
    }
};`
      
      case "Contains Duplicate":
        return `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        
    }
};`
      
      case "Move Zeroes":
        return `class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        
    }
};`
      
      default:
        return `class Solution {
public:
    void solve() {
        
    }
};`
    }
  }

  const getFileExtension = (lang: string) => {
    switch (lang) {
      case "java":
        return "java"
      case "python":
        return "py"
      case "cpp":
        return "cpp"
      default:
        return "txt"
    }
  }


  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] text-white">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <div>Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] text-white">
        <div className="p-6">Problem not found.</div>
      </div>
    )
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as "java" | "python" | "cpp")
  }

  const handleRunCode = async () => {
    setIsRunning(true)
    setTestResults([])
    setSubmissionResult(null)
    try {
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500))
      
      console.log("Running code:", { problem: problem?.title, code: code.substring(0, 100), language })
      
      // Run actual test cases using the enhanced test runner
      if (problem && code.trim()) {
        console.log("Test cases:", problem.testCases)
        const results = await runTestCases(problem, code, language)
        console.log("Test results:", results)
        setTestResults(results)
        
        // Mark as in progress if not already completed
        if (!userProgress[problem.id]) {
          updateUserProgress(problem.id, "In-progress")
          setUserProgress(getUserProgress())
          // Save to database as attempted (not solved yet)
          await saveProgressToDatabase(problem.id.toString(), 'wrong_answer', results)
        }
      } else {
        setTestResults([{
          caseNumber: 1,
          passed: false,
          expected: 'Code required',
          actual: 'Please write some code to test',
          input: {}
        }])
      }
    } catch (error) {
      console.error("Test execution error:", error)
      setTestResults([{
        caseNumber: 1,
        passed: false,
        expected: 'Execution failed',
        actual: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        input: {}
      }])
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmit = async () => {
    setIsRunning(true)
    setTestResults([])
    setSubmissionResult(null)
    try {
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Run actual test cases for submission
      if (problem && code.trim()) {
        const results = await runTestCases(problem, code, language)
        setTestResults(results)
        
        // Mark as solved only if all test cases pass
        const allPassed = results.every((result: any) => result.passed)
        if (allPassed) {
          updateUserProgress(problem.id, "Solved")
          setUserProgress(getUserProgress())
          
          // Save to database as solved (accepted)
          await saveProgressToDatabase(problem.id.toString(), 'accepted', results)
          
          // Show LeetCode-style success message
          setSubmissionResult({
            status: 'Accepted',
            runtime: Math.floor(Math.random() * 50) + 10, // Mock runtime
            memory: (Math.random() * 10 + 14).toFixed(1), // Mock memory
            percentile: Math.floor(Math.random() * 30) + 70, // Mock percentile
            timestamp: new Date().toLocaleString()
          })
        } else {
          // Save to database as wrong answer
          await saveProgressToDatabase(problem.id.toString(), 'wrong_answer', results)
          
          setSubmissionResult({
            status: 'Wrong Answer',
            failedCase: results.findIndex((r: any) => !r.passed) + 1,
            timestamp: new Date().toLocaleString()
          })
        }
      } else {
        setTestResults([{
          caseNumber: 1,
          passed: false,
          expected: 'Code required',
          actual: 'Please write some code to submit',
          input: {}
        }])
      }
    } catch (error) {
      console.error("Submission error:", error)
      
      // Save to database as runtime error
      if (problem) {
        await saveProgressToDatabase(problem.id.toString(), 'runtime_error', [])
      }
      
      setSubmissionResult({
        status: 'Runtime Error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toLocaleString()
      })
    } finally {
      setIsRunning(false)
    }
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <div>Loading...</div>
        </div>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] text-white">
        <div className="p-6">Problem not found.</div>
      </div>
    )
  }

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Solved":
        return "bg-green-500/15 text-green-400"
      case "In-progress":
        return "bg-blue-500/15 text-blue-400"
      default:
        return "bg-gray-500/15 text-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/practice/category/${problem.category?.toLowerCase().replace(/\s+/g, '-') || 'array'}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {problem.category || 'Practice'}
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold">{problem.title}</h1>
              <Badge variant="secondary" className={getDifficultyColor(problem.difficulty)}>
                {problem.difficulty}
              </Badge>
              <Checkbox 
                checked={userProgress[problem.id] === "Solved"}
                disabled
                className="pointer-events-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-60px)]">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 bg-card border-r border-border overflow-hidden">
          <div className="h-full overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Problem Description */}
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">Problem Description</h2>
                <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {problem.description || "Problem description not available."}
                </div>
              </div>
              
              {/* Examples */}
              {problem.examples && problem.examples.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-base">Examples:</h3>
                  {problem.examples.map((example, index) => (
                    <div key={index} className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground">Example {index + 1}:</h4>
                      <div className="bg-muted/30 rounded-lg p-4 space-y-3 border">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Input: </span>
                          <div className="mt-1">
                            <code className="text-sm bg-background text-green-600 px-2 py-1 rounded border font-mono">{example.input}</code>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Output: </span>
                          <div className="mt-1">
                            <code className="text-sm bg-background text-blue-600 px-2 py-1 rounded border font-mono">{example.output}</code>
                          </div>
                        </div>
                        {example.explanation && (
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Explanation: </span>
                            <div className="mt-1 text-sm text-muted-foreground">
                              {example.explanation}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Constraints */}
              {problem.constraints && problem.constraints.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-base">Constraints:</h3>
                  <div className="space-y-2">
                    {problem.constraints.map((constraint, index) => (
                      <div key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="text-muted-foreground/60 mr-2">•</span>
                        <span>{constraint}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 bg-[#1e1e1e] flex flex-col">
          {/* Editor Header */}
          <div className="bg-[#2d2d30] border-b border-[#3e3e42] px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">Solution.{getFileExtension(language)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCode(getDefaultTemplate(problem, language))}
                  className="text-gray-400 hover:text-white hover:bg-[#3e3e42] h-6 px-2"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
              </div>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-32 bg-[#3c3c3c] border-[#3e3e42] text-white">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className="bg-[#2d2d30] border-[#3e3e42]">
                  <SelectItem value="java" className="text-white hover:bg-[#3e3e42]">Java</SelectItem>
                  <SelectItem value="python" className="text-white hover:bg-[#3e3e42]">Python</SelectItem>
                  <SelectItem value="cpp" className="text-white hover:bg-[#3e3e42]">C++</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Code Editor */}
          <div className="flex-1">
            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
              height="100%"
              theme="vs-dark"
            />
          </div>
          
          {/* Bottom Panel - Controls and Results */}
          <div className="bg-[#252526] border-t border-[#3e3e42] p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleRunCode} 
                variant="secondary" 
                disabled={isRunning} 
                size="sm"
                className="bg-[#0e639c] hover:bg-[#1177bb] text-white border-none"
              >
                {isRunning ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Code
                  </>
                )}
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isRunning} 
                size="sm"
                className="bg-[#28a745] hover:bg-[#218838] text-white border-none"
              >
                {isRunning ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit
                  </>
                )}
              </Button>
            </div>

            {/* Submission Result - LeetCode Style */}
          {submissionResult && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${
                submissionResult.status === 'Accepted' 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  {submissionResult.status === 'Accepted' ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      submissionResult.status === 'Accepted' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {submissionResult.status}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {submissionResult.timestamp}
                    </p>
                  </div>
                </div>
                
                {submissionResult.status === 'Accepted' && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{submissionResult.runtime} ms</div>
                      <div className="text-sm text-gray-400">Runtime</div>
                      <div className="text-xs text-green-400">Beats {submissionResult.percentile}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{submissionResult.memory} MB</div>
                      <div className="text-sm text-gray-400">Memory</div>
                      <div className="text-xs text-green-400">Beats {submissionResult.percentile + 5}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">100%</div>
                      <div className="text-sm text-gray-400">Testcases</div>
                      <div className="text-xs text-green-400">All Passed</div>
                    </div>
                  </div>
                )}
                
                {submissionResult.status === 'Wrong Answer' && (
                  <div className="mt-3">
                    <p className="text-red-400">Failed on test case {submissionResult.failedCase}</p>
                  </div>
                )}
                
                {submissionResult.status === 'Runtime Error' && (
                  <div className="mt-3">
                    <p className="text-red-400">{submissionResult.error}</p>
                  </div>
                )}
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                  >
                    Solution
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600"
                  >
                    Sync w/ LeetHub
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Test Results */}
          {testResults.length > 0 && !submissionResult && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-300">Test Results</h3>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div key={index} className="bg-[#2d2d30] border border-[#3e3e42] rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-300">
                        Test Case {result.caseNumber}
                      </span>
                      <div className="flex items-center gap-2">
                        {result.passed ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                        <span className={`text-xs px-2 py-1 rounded ${
                          result.passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {result.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-xs">
                      <div className="text-gray-400">
                        <span className="font-medium">Input:</span> {JSON.stringify(result.input)}
                      </div>
                      <div className="text-gray-400">
                        <span className="font-medium">Expected:</span> {JSON.stringify(result.expected)}
                      </div>
                      <div className="text-gray-400">
                        <span className="font-medium">Got:</span> {JSON.stringify(result.actual)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Summary */}
              <div className="mt-4 p-3 bg-[#2d2d30] border border-[#3e3e42] rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">
                    {testResults.filter(r => r.passed).length} / {testResults.length} test cases passed
                  </span>
                  {testResults.every(r => r.passed) ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}