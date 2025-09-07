'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './auth-context'

type ProgressStatus = 'solved' | 'attempted' | 'unsolved'

interface ProgressContextType {
  progress: Record<number, ProgressStatus>
  updateProgress: (problemId: number, status: ProgressStatus, code?: string, language?: string, isCorrect?: boolean) => Promise<void>
  getProgress: (problemId: number) => ProgressStatus
  isLoading: boolean
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Record<number, ProgressStatus>>({})
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    // Load progress from API when user is available
    const loadProgress = async () => {
      if (user) {
        try {
          const response = await fetch('/api/progress')
          if (response.ok) {
            const data = await response.json()
            setProgress(data.progress || {})
          }
        } catch (error) {
          console.error('Error loading progress:', error)
        }
      } else {
        // Clear progress if no user
        setProgress({})
      }
      setIsLoading(false)
    }

    loadProgress()
  }, [user])

  const updateProgress = async (
    problemId: number, 
    status: ProgressStatus, 
    code?: string, 
    language?: string, 
    isCorrect?: boolean
  ) => {
    if (!user) return

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problemId,
          status,
          isCorrect: isCorrect || status === 'solved',
          code,
          language
        }),
      })

      if (response.ok) {
        setProgress(prev => ({
          ...prev,
          [problemId]: status
        }))
      }
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const getProgress = (problemId: number): ProgressStatus => {
    return progress[problemId] || 'unsolved'
  }

  return (
    <ProgressContext.Provider value={{ progress, updateProgress, getProgress, isLoading }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
}
