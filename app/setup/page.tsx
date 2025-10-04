"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2, Database, Code, Users } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function SetupPage() {
  const [initStatus, setInitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [seedStatus, setSeedStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [problemCount, setProblemCount] = useState<number>(0)

  const initializeDatabase = async () => {
    setInitStatus('loading')
    try {
      const response = await fetch('/api/init-db', { method: 'POST' })
      if (response.ok) {
        setInitStatus('success')
      } else {
        setInitStatus('error')
      }
    } catch (error) {
      console.error('Error initializing database:', error)
      setInitStatus('error')
    }
  }

  const seedProblems = async () => {
    setSeedStatus('loading')
    try {
      const response = await fetch('/api/seed-problems', { method: 'POST' })
      if (response.ok) {
        setSeedStatus('success')
        // Test problems after seeding
        testProblems()
      } else {
        setSeedStatus('error')
      }
    } catch (error) {
      console.error('Error seeding problems:', error)
      setSeedStatus('error')
    }
  }

  const testProblems = async () => {
    setTestStatus('loading')
    try {
      const response = await fetch('/api/test-problems')
      if (response.ok) {
        const data = await response.json()
        setProblemCount(data.totalProblems)
        setTestStatus('success')
      } else {
        setTestStatus('error')
      }
    } catch (error) {
      console.error('Error testing problems:', error)
      setTestStatus('error')
    }
  }

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Setup InterviewAce</h1>
          <p className="text-muted-foreground mt-2">Initialize your coding practice environment</p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 max-w-2xl">
          {/* Step 1: Initialize Database */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Database className="h-6 w-6 text-blue-500" />
                <div>
                  <CardTitle>Step 1: Initialize Database</CardTitle>
                  <CardDescription>Set up MongoDB collections and indexes</CardDescription>
                </div>
                <StatusIcon status={initStatus} />
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={initializeDatabase} 
                disabled={initStatus === 'loading'}
                className="w-full"
              >
                {initStatus === 'loading' ? 'Initializing...' : 'Initialize Database'}
              </Button>
            </CardContent>
          </Card>

          {/* Step 2: Seed Problems */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Code className="h-6 w-6 text-green-500" />
                <div>
                  <CardTitle>Step 2: Seed Problems</CardTitle>
                  <CardDescription>Add 15 coding problems (5 Array problems)</CardDescription>
                </div>
                <StatusIcon status={seedStatus} />
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={seedProblems} 
                disabled={seedStatus === 'loading' || initStatus !== 'success'}
                className="w-full"
              >
                {seedStatus === 'loading' ? 'Seeding Problems...' : 'Seed Problems'}
              </Button>
            </CardContent>
          </Card>

          {/* Step 3: Test Setup */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-purple-500" />
                <div>
                  <CardTitle>Step 3: Verify Setup</CardTitle>
                  <CardDescription>Test that problems are loaded correctly</CardDescription>
                </div>
                <StatusIcon status={testStatus} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={testProblems} 
                disabled={testStatus === 'loading'}
                variant="outline"
                className="w-full"
              >
                {testStatus === 'loading' ? 'Testing...' : 'Test Problems'}
              </Button>
              
              {testStatus === 'success' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 font-medium">
                    ✅ Setup Complete! Found {problemCount} problems in database.
                  </p>
                  <p className="text-green-600 text-sm mt-1">
                    You can now go to <a href="/practice" className="underline">Practice</a> to start coding!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        {testStatus === 'success' && (
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Jump to different sections</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button asChild>
                <a href="/practice">Go to Practice</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/practice/category/arrays">Array Problems</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/dashboard">Dashboard</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}