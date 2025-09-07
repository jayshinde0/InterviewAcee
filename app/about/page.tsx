import { PublicLayout } from "@/components/public-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowRight, Github, Linkedin, Mail, Heart, Users, Target, Lightbulb } from "lucide-react"
import Link from "next/link"

const teamMembers = [
  {
    name: "Jay Shinde",
    role: "Full Stack Developer",
    bio: "Passionate about creating seamless user experiences and robust backend systems.",
    avatar: "/placeholder-user.jpg",
    initials: "JS",
    skills: ["React", "Node.js", "TypeScript", "System Design", "MongoDB"]
  },
  {
    name: "Swayam Dusing", 
    role: "Backend Developer",
    bio: "Specializes in modern web technologies and creating intuitive user interfaces.",
    avatar: "/placeholder-user.jpg",
    initials: "SD",
    skills: ["Python", "Django", "MongoDB"]
  },
  {
    name: "Shiwani Nanaware",
    role: "Backend Developer", 
    bio: "Expert in building scalable APIs and database architecture for high-performance applications.",
    avatar: "/placeholder-user.jpg",
    initials: "SN",
    skills: ["React", "Node.js", "TypeScript"]
  },
  {
    name: "Srushti Ahire",
    role: "Frontend Developer",
    bio: "Develops intelligent algorithms and machine learning models for personalized learning experiences.",
    avatar: "/placeholder-user.jpg", 
    initials: "SA",
    skills: ["React", "Ui/Ux", "Tailwind CSS", "Next.js"]
  },
  {
    name: "Haiba Khan",
    role: "Frontend Developer",
    bio: "Creates user-centered designs that make complex interview preparation simple and engaging.",
    avatar: "/placeholder-user.jpg",
    initials: "HK", 
    skills: ["Figma", "User Research","React", "Ui/Ux", "Tailwind CSS",]
  }
]

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description: "We're committed to democratizing access to quality interview preparation and helping everyone land their dream job."
  },
  {
    icon: Users,
    title: "Community-First", 
    description: "We believe in the power of community and peer learning to accelerate growth and success."
  },
  {
    icon: Lightbulb,
    title: "Innovation-Focused",
    description: "We continuously innovate to provide the most effective and engaging learning experience possible."
  }
]

export default function AboutPage() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-accent/10 via-background to-accent/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 animate-slide-in-left">
              Meet Our Team
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight animate-fade-in-up animation-delay-200">
              The Minds Behind
              <span className="text-accent block animate-slide-in-right animation-delay-400">InterviewAce</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-600">
              Five passionate developers and designers united by a mission to revolutionize technical interview preparation.
            </p>
            <div className="flex justify-center animate-scale-in animation-delay-800">
              <Button size="lg" variant="outline" className="text-lg px-8 hover:scale-105 transition-all duration-300" asChild>
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-accent/10 rounded-full animate-bounce animation-delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-accent/15 rounded-full animate-bounce animation-delay-1500"></div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Our Mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            To democratize access to quality technical interview preparation and help every developer 
            land their dream job through innovative AI-powered learning experiences.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The passionate individuals behind InterviewAce, working together to transform interview preparation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center space-y-4">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-lg font-semibold bg-accent/10 text-accent">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{member.name}</CardTitle>
                    <CardDescription className="text-accent font-medium">
                      {member.role}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center leading-relaxed">
                    {member.bio}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at InterviewAce
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
           
            <h2 className="text-3xl font-bold text-foreground">Built with Passion</h2>
           
          </div>
          <p className="text-lg text-muted-foreground mb-8">
            Have questions or want to get in touch? We'd love to hear from you and help you on your interview preparation journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/contact">
                Get in Touch
                <Mail className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link href="/dashboard">
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
