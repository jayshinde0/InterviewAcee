"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Play, RotateCcw, Save, Clock, CheckCircle, XCircle, Code, FileText, TestTube, Lightbulb } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useParams } from "next/navigation"

// Mock problem data
const problemData = {
  1: {
    id: 1,
    title: "Two Sum",
    difficulty: "easy",
    category: "Arrays",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    testCases: [
      { input: "[2,7,11,15], 9", expected: "[0,1]", hidden: false },
      { input: "[3,2,4], 6", expected: "[1,2]", hidden: false },
      { input: "[3,3], 6", expected: "[0,1]", hidden: false },
      { input: "[1,2,3,4,5], 8", expected: "[2,4]", hidden: true },
      { input: "[0,4,3,0], 0", expected: "[0,3]", hidden: true },
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Write your solution here
    
}`,
      python: `def two_sum(nums, target):
    # Write your solution here
    pass`,
      java: `public int[] twoSum(int[] nums, int target) {
    // Write your solution here
    
}`,
    },
    hints: [
      "Try using a hash map to store the numbers you've seen so far.",
      "For each number, check if target - number exists in your hash map.",
      "Don't forget to return the indices, not the values themselves.",
    ],
  },
}

export default function PracticePage() {
  const params = useParams()
  const problemId = Number.parseInt(params.id as string)
  const problem = problemData[problemId as keyof typeof problemData]

  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [code, setCode] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])
  const [showHints, setShowHints] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(true)

  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode[selectedLanguage as keyof typeof problem.starterCode] || "")
    }
  }, [selectedLanguage, problem])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const runCode = async () => {
    setIsRunning(true)
    // Simulate code execution
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock test results
    const mockResults = problem.testCases.map((testCase, index) => ({
      ...testCase,
      passed: Math.random() > 0.3, // 70% pass rate for demo
      actualOutput: index < 2 ? testCase.expected : "[1,3]", // Mock some failures
      runtime: Math.floor(Math.random() * 100) + 50,
      memory: Math.floor(Math.random() * 20) + 10,
    }))

    setTestResults(mockResults)
    setIsRunning(false)
  }

  const submitSolution = async () => {
    setIsRunning(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock submission results
    const allPassed = testResults.every((result) => result.passed)
    if (allPassed) {
      setIsTimerRunning(false)
      // In a real app, save progress and redirect
      console.log("Solution accepted!")
    }
    setIsRunning(false)
  }

  const resetCode = () => {
    setCode(problem.starterCode[selectedLanguage as keyof typeof problem.starterCode] || "")
    setTestResults([])
  }

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

  if (!problem) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p>Problem not found</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-foreground">{problem.title}</h1>
            <Badge className={getDifficultyColor(problem.difficulty)}>
              {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
            </Badge>
            <Badge variant="outline">{problem.category}</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeElapsed)}</span>
            </div>
            <Button variant="outline" onClick={() => setShowHints(!showHints)} size="sm" className="bg-transparent">
              <Lightbulb className="w-4 h-4 mr-2" />
              Hints
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
          {/* Problem Description */}
          <div className="flex flex-col space-y-4">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Problem Description</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 overflow-y-auto">
                <div>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{problem.description}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Examples:</h4>
                  {problem.examples.map((example, index) => (
                    <div key={index} className="bg-muted p-3 rounded-lg mb-3">
                      <p className="text-sm">
                        <strong>Input:</strong> {example.input}
                      </p>
                      <p className="text-sm">
                        <strong>Output:</strong> {example.output}
                      </p>
                      {example.explanation && (
                        <p className="text-sm text-muted-foreground mt-1">
                          <strong>Explanation:</strong> {example.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-2">Constraints:</h4>
                  <ul className="text-sm space-y-1">
                    {problem.constraints.map((constraint, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-muted-foreground">•</span>
                        <span>{constraint}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {showHints && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center space-x-2">
                        <Lightbulb className="w-4 h-4" />
                        <span>Hints:</span>
                      </h4>
                      {problem.hints.map((hint, index) => (
                        <div key={index} className="bg-accent/10 p-3 rounded-lg mb-2">
                          <p className="text-sm">
                            <strong>Hint {index + 1}:</strong> {hint}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Code Editor */}
          <div className="flex flex-col space-y-4">
            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Code className="w-5 h-5" />
                    <span>Code Editor</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" onClick={resetCode} className="bg-transparent">
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-1 font-mono text-sm resize-none min-h-[300px]"
                  placeholder="Write your solution here..."
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <Button onClick={runCode} disabled={isRunning} size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      {isRunning ? "Running..." : "Run Code"}
                    </Button>
                    <Button onClick={submitSolution} disabled={isRunning || testResults.length === 0} size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Submit
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {code.split("\n").length} lines • {code.length} characters
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test Results */}
            {testResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TestTube className="w-5 h-5" />
                    <span>Test Results</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {testResults.map((result, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          result.passed
                            ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                            : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {result.passed ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span className="text-sm font-medium">
                              Test Case {index + 1} {result.hidden && "(Hidden)"}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {result.runtime}ms • {result.memory}MB
                          </div>
                        </div>
                        {!result.hidden && (
                          <div className="text-xs space-y-1">
                            <p>
                              <strong>Input:</strong> {result.input}
                            </p>
                            <p>
                              <strong>Expected:</strong> {result.expected}
                            </p>
                            <p>
                              <strong>Actual:</strong> {result.actualOutput}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Test Cases Passed</span>
                        <span>
                          {testResults.filter((r) => r.passed).length} / {testResults.length}
                        </span>
                      </div>
                      <Progress
                        value={(testResults.filter((r) => r.passed).length / testResults.length) * 100}
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
