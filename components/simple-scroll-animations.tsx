'use client'

import { useEffect } from 'react'

export function SimpleScrollAnimations() {
  useEffect(() => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .scale-in')
    animatedElements.forEach((el) => observer.observe(el))

    // Cleanup
    return () => {
      animatedElements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return null
}

// Utility functions for smooth scrolling
export const scrollUtils = {
  // Scroll to top
  scrollToTop: () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },

  // Scroll to element
  scrollToElement: (selector: string, offset = 0) => {
    const element = document.querySelector(selector)
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      })
    }
  },

  // Get current scroll position
  getScrollPosition: () => {
    return window.pageYOffset || document.documentElement.scrollTop
  }
}
