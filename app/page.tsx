import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Code, Users, BarChart3, Brain, Clock, Target } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">InterviewAce</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                How it Works
              </Link>
              <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
            </div>
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
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* animated gradient backdrop */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="animate-[pulse_8s_ease-in-out_infinite] absolute -top-1/3 -left-1/3 h-[60vh] w-[60vh] rounded-full bg-accent/30 blur-3xl" />
          <div className="animate-[pulse_10s_ease-in-out_infinite] absolute -bottom-1/3 -right-1/3 h-[60vh] w-[60vh] rounded-full bg-primary/20 blur-3xl" />
        </div>
        {/* animated subtle grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,hsl(var(--foreground)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.2)_1px,transparent_1px)] [background-size:40px_40px] animate-[pulse_12s_ease-in-out_infinite]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                Master Your Next
                <span className="text-accent block">Technical Interview</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                Prepare with confidence using our intelligent platform that adapts to your learning style. Practice
                coding, ace behavioral questions, and track your progress with personalized insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link href="/signup">
                    Start Preparing Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
                  <Link href="/demo">Watch Demo</Link>
                </Button>
              </div>
            </div>
            {/* Classical image illustration */}
            <div className="flex justify-center lg:justify-end">
              <svg viewBox="0 0 400 300" className="w-full max-w-xl text-foreground/90" aria-hidden>
                <defs>
                  <linearGradient id="g" x1="0" x2="1">
                    <stop offset="0%" stopColor="hsl(var(--accent))" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="400" height="300" rx="24" fill="url(#g)" opacity="0.08" />
                <g stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M40 220h320" opacity="0.4" />
                  <rect x="60" y="80" width="120" height="80" rx="8" opacity="0.7" />
                  <rect x="220" y="60" width="120" height="100" rx="8" opacity="0.5" />
                  <circle cx="120" cy="200" r="14" />
                  <circle cx="280" cy="200" r="14" />
                  <path d="M74 160h92M74 144h92M74 128h72" opacity="0.6" />
                  <path d="M234 116h86M234 100h86M234 84h64" opacity="0.4" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform covers every aspect of technical interview preparation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Interactive Code Practice</CardTitle>
                <CardDescription>
                  Practice with real coding problems in our integrated editor with instant feedback
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Mock Interview Sessions</CardTitle>
                <CardDescription>
                  Simulate real interview conditions with timed coding and behavioral question rounds
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>AI-Powered Recommendations</CardTitle>
                <CardDescription>
                  Get personalized question suggestions based on your performance and weak areas
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Progress Analytics</CardTitle>
                <CardDescription>
                  Track your improvement with detailed analytics and performance insights
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Behavioral Questions</CardTitle>
                <CardDescription>
                  Master HR rounds with curated behavioral questions and sample responses
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Flexible Learning</CardTitle>
                <CardDescription>
                  Study at your own pace with 24/7 access to all practice materials and resources
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How InterviewAce Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A simple 3-step process to interview success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-accent-foreground">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Assess Your Skills</h3>
              <p className="text-muted-foreground">
                Take our initial assessment to identify your strengths and areas for improvement
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-accent-foreground">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Practice & Learn</h3>
              <p className="text-muted-foreground">
                Follow your personalized learning path with targeted practice sessions
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-accent-foreground">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Ace Your Interview</h3>
              <p className="text-muted-foreground">
                Apply your skills in mock interviews and land your dream job with confidence
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose a plan that fits your preparation needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <CardDescription>Get started with core practice features</CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <p className="text-4xl font-bold text-foreground mb-4">Free</p>
                <ul className="text-muted-foreground space-y-2 mb-6">
                  <li>Weekly practice limits</li>
                  <li>Basic analytics</li>
                  <li>Community support</li>
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <Badge className="w-fit">Popular</Badge>
                <CardTitle>Pro</CardTitle>
                <CardDescription>Advanced features for serious candidates</CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <p className="text-4xl font-bold text-foreground mb-4">$9<span className="text-base align-top">/mo</span></p>
                <ul className="text-muted-foreground space-y-2 mb-6">
                  <li>Unlimited practice</li>
                  <li>AI-powered recommendations</li>
                  <li>Mock interview sessions</li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href="/signup">Start Pro</Link>
                </Button>
              </div>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Team</CardTitle>
                <CardDescription>Tools for cohorts and classrooms</CardDescription>
              </CardHeader>
              <div className="px-6 pb-6">
                <p className="text-4xl font-bold text-foreground mb-4">$29<span className="text-base align-top">/mo</span></p>
                <ul className="text-muted-foreground space-y-2 mb-6">
                  <li>Team analytics</li>
                  <li>Shared problem sets</li>
                  <li>Priority support</li>
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
