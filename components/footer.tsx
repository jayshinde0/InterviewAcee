import Link from "next/link"
import { Brain } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">InterviewAce</span>
          </div>
          <nav className="flex flex-wrap gap-6 text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link href="/features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Link href="https://twitter.com" className="hover:text-foreground transition-colors" aria-label="Twitter">X</Link>
            <Link href="https://github.com" className="hover:text-foreground transition-colors" aria-label="GitHub">GitHub</Link>
            <Link href="https://linkedin.com" className="hover:text-foreground transition-colors" aria-label="LinkedIn">LinkedIn</Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center">
          <div className="flex flex-col gap-3 items-center md:flex-row md:justify-center md:gap-6">
            <span className="text-muted-foreground">Ready to practice smarter?</span>
            <div className="flex gap-4">
              <Link href="/signup" className="text-accent hover:underline">Start free</Link>
              <Link href="/demo" className="text-muted-foreground hover:text-foreground">Watch demo</Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground">Talk to us</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
