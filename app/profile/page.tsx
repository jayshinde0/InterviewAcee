"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Camera, Save, Bell, Shield, Trash2, BookOpen, Trophy, Target } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/contexts/auth-context"

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    location: "",
    website: "",
    github: "",
    linkedin: "",
  })
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    practiceReminders: true,
  })
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [stats, setStats] = useState({
    problemsSolved: 0,
    mockInterviews: 0,
    studyStreak: 0,
    completionRate: 0,
    aptitudeSets: 0,
    aptitudeTotal: 0,
    aptitudeProgress: 0,
    loading: true
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          profilePhoto: profileImage
        })
      })
      
      if (response.ok) {
        console.log('Profile updated successfully')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    }
    setIsEditing(false)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        alert('File size must be less than 1MB')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerImageUpload = () => {
    fileInputRef.current?.click()
  }

  // Fetch user profile data and stats from MongoDB
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.email) return
      
      try {
        // Fetch complete profile data
        const profileResponse = await fetch('/api/profile')
        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          
          // Update form data with actual user data
          setFormData({
            firstName: profileData.firstName || "",
            lastName: profileData.lastName || "",
            email: profileData.email || "",
            bio: profileData.bio || "",
            location: profileData.location || "",
            website: profileData.website || "",
            github: profileData.github || "",
            linkedin: profileData.linkedin || "",
          })
          
          // Set profile image
          setProfileImage(profileData.profilePhoto || null)
        }
        
        // Fetch stats
        const statsResponse = await fetch('/api/stats')
        if (statsResponse.ok) {
          const data = await statsResponse.json()
          setStats({
            problemsSolved: data.codingProgress?.solved || 0,
            mockInterviews: data.interviewProgress?.completed || 0,
            studyStreak: data.studyStreak || 0,
            completionRate: Math.round(((data.codingProgress?.solved || 0) / Math.max(data.codingProgress?.total || 1, 1)) * 100),
            aptitudeSets: data.aptitudeProgress?.setsCompleted || 0,
            aptitudeTotal: data.aptitudeProgress?.totalSets || 10,
            aptitudeProgress: Math.round(((data.aptitudeProgress?.setsCompleted || 0) / Math.max(data.aptitudeProgress?.totalSets || 1, 1)) * 100),
            loading: false
          })
        } else {
          setStats(prev => ({ ...prev, loading: false }))
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching profile data:', error)
        setStats(prev => ({ ...prev, loading: false }))
        setIsLoading(false)
      }
    }

    fetchProfileData()
    
    // Set up real-time updates every 30 seconds for stats only
    const interval = setInterval(async () => {
      try {
        const statsResponse = await fetch('/api/stats')
        if (statsResponse.ok) {
          const data = await statsResponse.json()
          setStats({
            problemsSolved: data.codingProgress?.solved || 0,
            mockInterviews: data.interviewProgress?.completed || 0,
            studyStreak: data.studyStreak || 0,
            completionRate: Math.round(((data.codingProgress?.solved || 0) / Math.max(data.codingProgress?.total || 1, 1)) * 100),
            aptitudeSets: data.aptitudeProgress?.setsCompleted || 0,
            aptitudeTotal: data.aptitudeProgress?.totalSets || 10,
            aptitudeProgress: Math.round(((data.aptitudeProgress?.setsCompleted || 0) / Math.max(data.aptitudeProgress?.totalSets || 1, 1)) * 100),
            loading: false
          })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }, 30000)
    
    return () => clearInterval(interval)
  }, [user?.email])

  if (!user || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account information and preferences</p>
        </div>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and profile details</CardDescription>
              </div>
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  "Edit Profile"
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="w-20 h-20 cursor-pointer hover:opacity-80 transition-opacity" onClick={isEditing ? triggerImageUpload : undefined}>
                  <AvatarImage src={profileImage || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">
                    {formData.firstName?.[0] || user.firstName?.[0]}
                    {formData.lastName?.[0] || user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer" onClick={triggerImageUpload}>
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              <div>
                <Button variant="outline" size="sm" disabled={!isEditing} onClick={triggerImageUpload}>
                  <Camera className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
                <p className="text-sm text-muted-foreground mt-1">JPG, GIF or PNG. 1MB max.</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="City, Country"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="github.com/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="linkedin.com/in/username"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
            <CardDescription>Your progress and achievements on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {stats.loading ? "..." : stats.problemsSolved}
                </div>
                <p className="text-sm text-muted-foreground">Problems Solved</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {stats.loading ? "..." : stats.mockInterviews}
                </div>
                <p className="text-sm text-muted-foreground">Mock Interviews</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {stats.loading ? "..." : stats.studyStreak}
                </div>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {stats.loading ? "..." : `${stats.completionRate}%`}
                </div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">JavaScript</Badge>
              <Badge variant="secondary">Python</Badge>
              <Badge variant="secondary">React</Badge>
              <Badge variant="secondary">Node.js</Badge>
              <Badge variant="secondary">System Design</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Aptitude Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Aptitude Progress</span>
            </CardTitle>
            <CardDescription>Track your progress across different aptitude test categories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {stats.loading ? "..." : stats.aptitudeSets}
                </div>
                <p className="text-sm text-muted-foreground">Sets Completed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {stats.loading ? "..." : stats.aptitudeTotal}
                </div>
                <p className="text-sm text-muted-foreground">Total Sets</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {stats.loading ? "..." : `${stats.aptitudeProgress}%`}
                </div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Aptitude Progress</span>
                  <span>{stats.aptitudeProgress}%</span>
                </div>
                <Progress value={stats.aptitudeProgress} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Quantitative Aptitude</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Logical Reasoning</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Verbal Ability</span>
                    <span>80%</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Data Interpretation</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Recent Achievement</span>
              </div>
              <Badge variant="outline">Completed 5 Sets</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notification Preferences</span>
            </CardTitle>
            <CardDescription>Choose how you want to be notified about your progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates about your progress via email</p>
              </div>
              <Switch
                checked={preferences.emailNotifications}
                onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Get notified about new features and updates</p>
              </div>
              <Switch
                checked={preferences.pushNotifications}
                onCheckedChange={(checked) => handlePreferenceChange("pushNotifications", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Progress Report</p>
                <p className="text-sm text-muted-foreground">Receive a summary of your weekly progress</p>
              </div>
              <Switch
                checked={preferences.weeklyReport}
                onCheckedChange={(checked) => handlePreferenceChange("weeklyReport", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Practice Reminders</p>
                <p className="text-sm text-muted-foreground">Get reminded to practice when you're inactive</p>
              </div>
              <Switch
                checked={preferences.practiceReminders}
                onCheckedChange={(checked) => handlePreferenceChange("practiceReminders", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-destructive">
              <Shield className="w-5 h-5" />
              <span>Danger Zone</span>
            </CardTitle>
            <CardDescription>Irreversible and destructive actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data</p>
              </div>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
