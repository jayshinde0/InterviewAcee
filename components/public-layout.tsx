import Link from "next/link"
import { ReactNode } from "react"
import { Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-accent-foreground" />
              </div>
              <Link href="/" className="text-xl font-bold">InterviewAce</Link>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <Link href="/#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</Link>
              <Link href="/#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <Footer />
    </div>
  )
}
