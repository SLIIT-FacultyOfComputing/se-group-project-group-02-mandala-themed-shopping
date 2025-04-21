"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
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
  const [username, setUsername] = useState(session?.user?.name || "")
  const [email] = useState(session?.user?.email || "")
  const [bio, setBio] = useState("I'm passionate about mandala art and spiritual home decor.")
  const [location, setLocation] = useState("San Francisco, CA")
  const [website, setWebsite] = useState("https://example.com")

  const handleUpdate = () => {
    toast.success("Profile updated successfully!")
    // Future: Call API to update profile
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        <div className="text-center relative py-6">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-contain bg-center bg-no-repeat opacity-10"
            style={{
              backgroundImage:
                'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%239333ea" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm0-200c-27.6 0-50 22.4-50 50s22.4 50 50 50 50-22.4 50-50-22.4-50-50-50zm0 80c-16.5 0-30-13.5-30-30s13.5-30 30-30 30 13.5 30 30-13.5 30-30 30zm0-320c-27.6 0-50 22.4-50 50s22.4 50 50 50 50-22.4 50-50-22.4-50-50-50zm0 80c-16.5 0-30-13.5-30-30s13.5-30 30-30 30 13.5 30 30-13.5 30-30 30zm0 80c-27.6 0-50 22.4-50 50s22.4 50 50 50 50-22.4 50-50-22.4-50-50-50zm0 80c-16.5 0-30-13.5-30-30s13.5-30 30-30 30 13.5 30 30-13.5 30-30 30z"></path></svg>\')',
            }}
          ></div>
          <div className="flex items-center justify-center gap-2">
            <User className="h-6 w-6 text-purple-600" />
            <h1 className="text-3xl font-bold text-purple-800">My Spiritual Journey</h1>
          </div>
          <p className="text-purple-600 mt-1">Customize your profile and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md">
            <TabsTrigger
              value="profile"
              className="rounded-full data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800"
            >
              <User className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="rounded-full data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800"
            >
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="rounded-full data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800"
            >
              <Shield className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger
              value="integrations"
              className="rounded-full data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800"
            >
              <Globe className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Integrations</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400"></div>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-medium text-purple-800">Personal Information</h3>
                    </div>
                    <Separator className="mb-6 bg-purple-100" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="font-medium text-purple-700">
                          Username
                        </Label>
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="border-purple-200 focus-visible:ring-purple-400 rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-medium text-purple-700">
                          Email
                        </Label>
                        <Input
                          id="email"
                          value={email}
                          disabled
                          className="bg-purple-50 border-purple-200 text-purple-500 cursor-not-allowed rounded-xl"
                        />
                        <p className="text-xs text-purple-500">Your email cannot be changed</p>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bio" className="font-medium text-purple-700">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Tell us about your spiritual journey"
                          className="min-h-[120px] resize-none border-purple-200 focus-visible:ring-purple-400 rounded-xl"
                        />
                        <p className="text-xs text-purple-500">
                          Share your connection to mandala art and spiritual practices
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location" className="font-medium text-purple-700">
                          Location
                        </Label>
                        <Input
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="City, Country"
                          className="border-purple-200 focus-visible:ring-purple-400 rounded-xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website" className="font-medium text-purple-700">
                          Website
                        </Label>
                        <Input
                          id="website"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://example.com"
                          className="border-purple-200 focus-visible:ring-purple-400 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={handleUpdate}
                size="lg"
                className="gap-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 rounded-full px-8 transition-all hover:gap-3 shadow-md"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400"></div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Bell className="h-4 w-4 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium text-purple-800">Notification Preferences</h3>
                </div>
                <Separator className="mb-6 bg-purple-100" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-base text-purple-800">Email notifications</Label>
                      <p className="text-sm text-purple-600">Receive email notifications about new mandala products</p>
                    </div>
                    <Switch className="data-[state=checked]:bg-purple-600" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-base text-purple-800">Push notifications</Label>
                      <p className="text-sm text-purple-600">Receive push notifications about special offers</p>
                    </div>
                    <Switch className="data-[state=checked]:bg-purple-600" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-base text-purple-800">Spiritual journey updates</Label>
                      <p className="text-sm text-purple-600">
                        Receive updates about meditation and mindfulness practices
                      </p>
                    </div>
                    <Switch className="data-[state=checked]:bg-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400"></div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium text-purple-800">Security Settings</h3>
                </div>
                <Separator className="mb-6 bg-purple-100" />

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-purple-700">Change Password</h4>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password" className="text-purple-700">
                          Current Password
                        </Label>
                        <Input
                          id="current-password"
                          type="password"
                          className="border-purple-200 focus-visible:ring-purple-400 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password" className="text-purple-700">
                          New Password
                        </Label>
                        <Input
                          id="new-password"
                          type="password"
                          className="border-purple-200 focus-visible:ring-purple-400 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="text-purple-700">
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          className="border-purple-200 focus-visible:ring-purple-400 rounded-xl"
                        />
                      </div>
                      <Button className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 rounded-xl">
                        Update Password
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400"></div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Globe className="h-4 w-4 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium text-purple-800">Connected Accounts</h3>
                </div>
                <Separator className="mb-6 bg-purple-100" />

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-purple-800">Twitter</h4>
                        <p className="text-sm text-purple-600">Not connected</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="border-purple-300 text-purple-700 hover:bg-purple-100 rounded-xl"
                    >
                      Connect
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-[#4267B2] flex items-center justify-center text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-purple-800">Facebook</h4>
                        <p className="text-sm text-purple-600">Not connected</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="border-purple-300 text-purple-700 hover:bg-purple-100 rounded-xl"
                    >
                      Connect
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-purple-800">Instagram</h4>
                        <p className="text-sm text-purple-600">Connected as @mandala_lover</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="border-purple-300 text-purple-700 hover:bg-purple-100 rounded-xl"
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="h-16 w-full bg-gradient-to-t from-purple-100 to-transparent"></div>
    </div>
  )
}
