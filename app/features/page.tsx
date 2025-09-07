import { PublicLayout } from "@/components/public-layout"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Code, 
  Users, 
  Brain, 
  BarChart3, 
  Target, 
  Clock, 
  CheckCircle, 
  Zap,
  Shield,
  Globe,
  Smartphone,
  Award
} from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Code,
    title: "Interactive Code Editor",
    description: "Practice coding problems in our browser-based editor with syntax highlighting, auto-completion, and instant feedback.",
    benefits: ["Real-time code execution", "Multiple language support", "Debugging tools", "Code quality analysis"]
  },
  {
    icon: Users,
    title: "AI Mock Interviews",
    description: "Experience realistic interview scenarios with our AI interviewer that adapts to your responses and provides detailed feedback.",
    benefits: ["Behavioral questions", "Technical assessments", "Real-time feedback", "Performance analytics"]
  },
  {
    icon: Brain,
    title: "Adaptive Learning",
    description: "Our AI analyzes your performance and creates personalized learning paths to focus on your weak areas.",
    benefits: ["Personalized recommendations", "Skill gap analysis", "Progress tracking", "Custom study plans"]
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Get detailed insights into your performance with comprehensive analytics and progress tracking.",
    benefits: ["Performance metrics", "Improvement trends", "Skill assessments", "Comparative analysis"]
  },
  {
    icon: Target,
    title: "Company-Specific Prep",
    description: "Practice with questions and formats used by top tech companies like Google, Microsoft, Amazon, and more.",
    benefits: ["Company question banks", "Interview formats", "Difficulty levels", "Success strategies"]
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description: "Study at your own pace with 24/7 access to all materials and the ability to schedule mock interviews.",
    benefits: ["Self-paced learning", "Anytime access", "Scheduled sessions", "Mobile compatibility"]
  }
]

const additionalFeatures = [
  { icon: CheckCircle, title: "Progress Tracking", description: "Monitor your improvement over time" },
  { icon: Zap, title: "Instant Feedback", description: "Get immediate results and explanations" },
  { icon: Shield, title: "Secure Platform", description: "Your data is protected with enterprise-grade security" },
  { icon: Globe, title: "Global Community", description: "Connect with developers worldwide" },
  { icon: Smartphone, title: "Mobile Optimized", description: "Practice anywhere, anytime on any device" },
  { icon: Award, title: "Certification Ready", description: "Prepare for industry certifications" }
]

export default function FeaturesPage() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6">
              Comprehensive Features
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Everything You Need to
              <span className="text-accent block">Ace Your Interview</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover the powerful features that make InterviewAce the most effective platform for technical interview preparation.
            </p>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader className="space-y-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <ul className="space-y-2 mt-4">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">More Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Additional tools and capabilities to enhance your learning experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 rounded-lg border border-border hover:bg-accent/5 transition-colors">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground mb-6">
            Ready to Experience These Features?
          </h2>
          <p className="text-xl text-accent-foreground/90 mb-8">
            Start your free trial today and see how InterviewAce can transform your interview preparation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <Link href="/dashboard">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-accent-foreground/20 text-accent-foreground hover:bg-accent-foreground/10" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
