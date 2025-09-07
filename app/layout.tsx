import type React from "react"
import type { Metadata } from "next"
import { Work_Sans, Open_Sans } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import { ProgressProvider } from "@/contexts/progress-context"
import { ThemeProvider } from "@/components/theme-provider"
import { SimpleScrollAnimations } from "@/components/simple-scroll-animations"
import "./globals.css"

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
})

export const metadata: Metadata = {
  title: "InterviewAce - Intelligent Interview Preparation Platform",
  description:
    "Master your technical interviews with AI-powered practice, mock interviews, and personalized learning paths.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html 
      lang="en" 
      className={`${workSans.variable} ${openSans.variable} antialiased`} 
      suppressHydrationWarning
    >
      <body className="font-sans" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange={true}
        >
          <SimpleScrollAnimations />
          <AuthProvider>
            <ProgressProvider>{children}</ProgressProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
