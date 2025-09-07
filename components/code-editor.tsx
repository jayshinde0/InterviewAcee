"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import dynamic from "next/dynamic"

// Dynamically import Monaco Editor with no SSR
const Editor = dynamic(
  () => import('@monaco-editor/react'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-[#1e1e1e] text-gray-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <div>Loading VS Code Editor...</div>
        </div>
      </div>
    )
  }
)

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language: string
  height?: string
  theme?: string
}

export function CodeEditor({ value, onChange, language, height = "100%", theme = "vs-dark" }: CodeEditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const getMonacoLanguage = (lang: string) => {
    switch (lang) {
      case "java": return "java"
      case "python": return "python"
      case "cpp": return "cpp"
      case "javascript": return "javascript"
      case "typescript": return "typescript"
      default: return "plaintext"
    }
  }

  // Show loading state during hydration
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-full bg-[#1e1e1e] text-gray-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <div>Initializing Editor...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <Editor
        height={height}
        language={getMonacoLanguage(language)}
        value={value}
        onChange={(val) => onChange(val || "")}
        theme={theme}
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', Monaco, 'Inconsolata', 'Liberation Mono', 'Menlo', 'Courier', monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          wordWrap: 'on',
          lineNumbers: 'on',
          renderWhitespace: 'selection',
          cursorBlinking: 'blink',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          contextmenu: true,
          mouseWheelZoom: true,
          quickSuggestions: true,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true
          },
          padding: { top: 16, bottom: 16 },
          folding: true,
          foldingStrategy: 'indentation',
          showFoldingControls: 'mouseover',
          unfoldOnClickAfterEndOfLine: true,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            useShadows: false,
            verticalHasArrows: false,
            horizontalHasArrows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10
          }
        }}
      />
    </div>
  )
}
