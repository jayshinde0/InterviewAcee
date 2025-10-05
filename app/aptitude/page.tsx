"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AptitudePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const aptitudeCategories = [
    {
      id: "quantitative",
      title: "Quantitative Aptitude",
      description: "Mathematical and numerical reasoning",
      topics: ["Arithmetic", "Data Interpretation", "Statistics"]
    },
    {
      id: "verbal",
      title: "Verbal Reasoning",
      description: "Language skills and logical thinking",
      topics: ["Verbal Ability", "Logical Reasoning", "Reading Comprehension"]
    },
    {
      id: "general",
      title: "General Knowledge",
      description: "Current affairs and general awareness",
      topics: ["Current Affairs", "Science", "History"]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Aptitude Practice</h1>
          <p className="text-muted-foreground">
            Improve your aptitude skills with our comprehensive question bank
          </p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aptitudeCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white dark:bg-gray-800 rounded-lg border p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/aptitude/${category.id}`)}
            >
              <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {category.description}
              </p>
              <div className="space-y-1">
                {category.topics.map((topic, index) => (
                  <div
                    key={index}
                    className="text-sm text-blue-600 dark:text-blue-400"
                  >
                    • {topic}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
          <p className="text-muted-foreground">
            More aptitude categories and advanced features are being developed.
          </p>
        </div>
      </div>
    </div>
  )
}