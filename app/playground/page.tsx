'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Play, Copy, Download, Settings, Check, Palette, Type, Zap, ArrowLeft } from 'lucide-react'
import { CodeEditor } from '@/components/code-editor'
import Link from 'next/link'

const LANGUAGE_OPTIONS = [
  { value: 'cpp', label: 'C++', id: 54 },
  { value: 'java', label: 'Java', id: 62 },
  { value: 'python', label: 'Python', id: 71 },
  { value: 'javascript', label: 'JavaScript', id: 63 },
  { value: 'c', label: 'C', id: 50 }
]

const DEFAULT_CODE = {
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  python: `print("Hello, World!")`,
  javascript: `console.log("Hello, World!");`,
  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`
}

export default function CodePlayground() {
  const [language, setLanguage] = useState('cpp')
  const [code, setCode] = useState(DEFAULT_CODE.cpp)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [executionTime, setExecutionTime] = useState<number | null>(null)
  const [memory, setMemory] = useState<number | null>(null)
  const [memoryUsage, setMemoryUsage] = useState<number | null>(null)
  const [error, setError] = useState<string>('')
  const [status, setStatus] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    setCode(DEFAULT_CODE[newLanguage as keyof typeof DEFAULT_CODE] || '')
    setOutput('')
    setStatus(null)
    setError('')
    setExecutionTime(null)
    setMemoryUsage(null)
  }

  const runCode = async () => {
    if (!code.trim()) return

    setIsRunning(true)
    setOutput('')
    setError('')
    setExecutionTime(null)
    setMemoryUsage(null)

    try {
      const response = await fetch('/api/judge0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          input: input || ''
        })
      })

      const result = await response.json()
      
      if (result.error) {
        setError(result.message || 'Execution failed')
        setOutput(result.stderr || result.message || 'Execution failed')
        setStatus(result.status?.description || 'Error')
      } else if (result.stdout || result.stderr) {
        setOutput(result.stdout || result.stderr || 'No output')
        setStatus(result.status?.description || 'Completed')
        if (result.time) setExecutionTime(parseFloat(result.time) * 1000)
        if (result.memory) setMemoryUsage(result.memory)
      } else {
        const errorText = await response.text()
        setOutput(`API Error: ${errorText}`)
        setStatus('API Error')
      }
    } catch (error) {
      setOutput(`Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setStatus('Network Error')
    } finally {
      setIsRunning(false)
    }
  }

  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadCode = () => {
    const extensions = { cpp: 'cpp', java: 'java', python: 'py', javascript: 'js', c: 'c' }
    const extension = extensions[language as keyof typeof extensions] || 'txt'
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code.${extension}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Runtime Error':
      case 'Compilation Error':
      case 'Error':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'API Error':
      case 'Network Error':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-accent/50 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-accent-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Code Playground
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-accent/50 transition-colors">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="gap-2">
                  <Palette className="h-4 w-4" />
                  Theme Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Type className="h-4 w-4" />
                  Font Size
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Zap className="h-4 w-4" />
                  Auto-run
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="border-b border-border bg-card px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGE_OPTIONS.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {status && (
                  <Badge variant="outline" className={getStatusColor(status)}>
                    {status}
                  </Badge>
                )}
                {executionTime !== null && (
                  <Badge variant="outline">
                    {executionTime.toFixed(2)}ms
                  </Badge>
                )}
                {memoryUsage !== null && (
                  <Badge variant="outline">
                    {memoryUsage}KB
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyCode}
                  className={`transition-all duration-200 ${copied ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'hover:bg-accent/50'}`}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied && <span className="ml-1 text-xs">Copied!</span>}
                </Button>
                <Button variant="ghost" size="sm" onClick={downloadCode} className="hover:bg-accent/50 transition-colors">
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={runCode} 
                  disabled={isRunning} 
                  className="gap-2"
                >
                  <Play className="h-4 w-4" />
                  {isRunning ? 'Running...' : 'Run Code'}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-6 bg-background">
            <div className="h-full">
              <CodeEditor
                value={code}
                onChange={setCode}
                language={language}
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Input/Output */}
        <div className="w-96 border-l border-border bg-card flex flex-col">
          <div className="border-b border-border px-4 py-3">
            <h3 className="font-semibold text-foreground">Input/Output</h3>
          </div>
          
          <div className="flex-1 flex flex-col">
            {/* Input Section */}
            <div className="border-b border-border p-4">
              <label className="block text-sm font-medium mb-2 text-foreground">Input</label>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter input for your program..."
                className="min-h-[100px] resize-none"
              />
            </div>

            {/* Output Section */}
            <div className="flex-1 p-4">
              <label className="block text-sm font-medium mb-2 text-foreground">Output</label>
              <div className="bg-muted border border-border rounded-md p-3 h-full overflow-auto">
                <pre className="text-sm whitespace-pre-wrap font-mono text-foreground">
                  {output || (
                    <span className="text-muted-foreground italic">
                      Output will appear here after running your code...
                    </span>
                  )}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
