'use client'

import { useEffect } from 'react'

interface SmoothScrollProps {
  children: React.ReactNode
  className?: string
}

export function SmoothScroll({ children, className = '' }: SmoothScrollProps) {
  useEffect(() => {
    // Apply smooth scrolling to html element
    if (typeof window !== 'undefined') {
      document.documentElement.style.scrollBehavior = 'smooth'
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.documentElement.style.scrollBehavior = 'auto'
      }
    }
  }, [])

  return (
    <div className={`smooth-scroll-container ${className}`}>
      {children}
    </div>
  )
}

// CSS-based scroll animations hook
export function useScrollAnimations() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
        } else {
          entry.target.classList.remove('animate-in')
        }
      })
    }, observerOptions)

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .scale-in, .slide-in')
    animatedElements.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
    }
  }, [])
}

// Utility functions for smooth scrolling
export const scrollUtils = {
  // Scroll to top
  scrollToTop: () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  },

  // Scroll to element
  scrollToElement: (selector: string, options?: { offset?: number }) => {
    const element = document.querySelector(selector)
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - (options?.offset || 0)
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  },

  // Get current scroll position
  getScroll: () => {
    return window.pageYOffset || document.documentElement.scrollTop
  },
}
