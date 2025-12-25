"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "react-hot-toast"
import { User, Bell, Shield, Globe, Save } from "lucide-react"

export default function UserSettingsPage() {
  const { data: session } = useSession()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [website, setWebsite] = useState("")
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  useEffect(() => {
    if (session?.user) {
      setUsername(session.user.name || "")
      setEmail(session.user.email || "")
      // Optionally fetch user profile details if stored in DB
    }
  }, [session])

  const handleUpdate = async () => {
    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          bio,
          location,
          website,
        }),
      })

      if (!res.ok) throw new Error("Failed to update profile")
      toast.success("Profile updated!")
    } catch (err) {
      toast.error("Failed to update profile")
    }
  }

  const handlePasswordUpdate = async () => {
    const currentPassword = (document.getElementById("current-password") as HTMLInputElement)?.value
    const newPassword = (document.getElementById("new-password") as HTMLInputElement)?.value
    const confirmPassword = (document.getElementById("confirm-password") as HTMLInputElement)?.value

    // Clear form validation
    document.getElementById("password-error")?.remove()

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      showPasswordError("All password fields are required")
      return
    }

    if (newPassword !== confirmPassword) {
      showPasswordError("New passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      showPasswordError("New password must be at least 8 characters")
      return
    }

    setIsUpdatingPassword(true)

    try {
      const res = await fetch("/api/users/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.error) {
          showPasswordError(data.error)
        } else {
          showPasswordError("Failed to update password")
        }
        return
      }

      // Clear form fields on success
      const currentPasswordField = document.getElementById("current-password") as HTMLInputElement;
      if (currentPasswordField) currentPasswordField.value = "";

      const newPasswordField = document.getElementById("new-password") as HTMLInputElement;
      if (newPasswordField) newPasswordField.value = "";

      const confirmPasswordField = document.getElementById("confirm-password") as HTMLInputElement;
      if (confirmPasswordField) confirmPasswordField.value = "";
      
      toast.success("Password updated successfully!")
    } catch (err) {
      toast.error("Failed to update password")
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const showPasswordError = (message: string) => {
    // Remove existing error message if any
    document.getElementById("password-error")?.remove()
    
    // Create new error element
    const errorDiv = document.createElement("div")
    errorDiv.id = "password-error"
    errorDiv.className = "text-red-500 text-sm mt-2"
    errorDiv.textContent = message
    
    // Append to the security form
    const securityForm = document.querySelector('[value="security"] .p-6')
    securityForm?.appendChild(errorDiv)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-purple-200">
      <div className="max-w-7xl mx-auto p-8 space-y-6">
        <div className="text-center relative py-6">
          <div className="flex items-center justify-center gap-2">
            <User className="h-6 w-6 text-purple-600" />
            <h1 className="text-3xl font-bold text-purple-800">My Spiritual Journey</h1>
          </div>
          <p className="text-purple-600 mt-1">Customize your profile and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6 bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-md">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-white/80 backdrop-blur-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="username" className="font-medium text-purple-600">Username</Label>
                    <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="border-purple-200 focus-visible:ring-purple-400 rounded-xl shadow-sm" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="font-medium text-purple-600">Email</Label>
                    <Input id="email" value={email} disabled className="border-purple-200 focus-visible:ring-purple-400 rounded-xl shadow-sm bg-gray-100 cursor-not-allowed" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="bio" className="font-medium text-purple-600">Bio</Label>
                    <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} className="border-purple-200 focus-visible:ring-purple-400 rounded-xl shadow-sm" />
                  </div>
                  <div>
                    <Label htmlFor="location" className="font-medium text-purple-600">Location</Label>
                    <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="border-purple-200 focus-visible:ring-purple-400 rounded-xl shadow-sm" />
                  </div>
                  <div>
                    <Label htmlFor="website" className="font-medium text-purple-600">Website</Label>
                    <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} className="border-purple-200 focus-visible:ring-purple-400 rounded-xl shadow-sm" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleUpdate} className="bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-sm hover:shadow transition-all">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="bg-white/80 backdrop-blur-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="current-password" className="font-medium text-purple-600">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div>
                  <Label htmlFor="new-password" className="font-medium text-purple-600">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirm-password" className="font-medium text-purple-600">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <Button
                  onClick={handlePasswordUpdate}
                  disabled={isUpdatingPassword}
                  className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-sm hover:shadow transition-all"
                >
                  {isUpdatingPassword ? "Updating..." : "Update Password"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="bg-white/80 backdrop-blur-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-purple-800">Email Notifications</h4>
                  <p className="text-sm text-gray-500">Receive email notifications for important updates.</p>
                  <div className="flex items-center justify-between mt-4">
                    <Label htmlFor="email-notifications" className="font-medium text-purple-600">Enable Email Notifications</Label>
                    <Switch id="email-notifications" />
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="text-lg font-medium text-purple-800">In-App Notifications</h4>
                  <p className="text-sm text-gray-500">Receive notifications within the application.</p>
                  <div className="flex items-center justify-between mt-4">
                    <Label htmlFor="in-app-notifications" className="font-medium text-purple-600">Enable In-App Notifications</Label>
                    <Switch id="in-app-notifications" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <Card className="bg-white/80 backdrop-blur-md hover:shadow-lg transition-shadow rounded-xl overflow-hidden">
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-purple-800">Connected Accounts</h4>
                  <p className="text-sm text-gray-500">Manage your connected third-party accounts.</p>
                  <div className="mt-4 text-gray-600">
                    No integrations configured yet.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
