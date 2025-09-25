"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Rocket, CalendarIcon, Settings, Zap, Mail, MessageSquare, Globe } from "lucide-react"
import { format } from "date-fns"

const platforms = [
  { id: "braze", name: "Braze", icon: Mail, connected: true },
  { id: "moengage", name: "MoEngage", icon: MessageSquare, connected: true },
  { id: "salesforce", name: "Salesforce Marketing Cloud", icon: Globe, connected: false },
  { id: "sendgrid", name: "SendGrid", icon: Mail, connected: true },
]

export function LaunchSettings() {
  const [launchDate, setLaunchDate] = useState<Date>()
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["braze", "moengage"])
  const [isScheduling, setIsScheduling] = useState(false)

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((id) => id !== platformId) : [...prev, platformId],
    )
  }

  const handleSchedule = async () => {
    setIsScheduling(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsScheduling(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            Launch & Execute Settings
          </CardTitle>
          <CardDescription>Configure deployment across your marketing platforms via API integrations</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Platform Selection</CardTitle>
            <CardDescription>Choose where to deploy your campaign</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  selectedPlatforms.includes(platform.id) ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedPlatforms.includes(platform.id)}
                    onCheckedChange={() => handlePlatformToggle(platform.id)}
                    disabled={!platform.connected}
                  />
                  <platform.icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{platform.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {platform.connected ? "Connected" : "Not connected"}
                    </div>
                  </div>
                </div>
                <Badge variant={platform.connected ? "default" : "outline"}>
                  {platform.connected ? "Ready" : "Setup Required"}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full bg-transparent">
              <Settings className="h-4 w-4 mr-2" />
              Manage Integrations
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Schedule & Timing</CardTitle>
            <CardDescription>Set when your campaign goes live</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Launch Type</Label>
              <Select defaultValue="scheduled">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Launch Immediately</SelectItem>
                  <SelectItem value="scheduled">Schedule for Later</SelectItem>
                  <SelectItem value="draft">Save as Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Launch Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {launchDate ? format(launchDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={launchDate} onSelect={setLaunchDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="launch-time">Launch Time</Label>
              <Input id="launch-time" type="time" defaultValue="09:00" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="utc">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">Eastern Time</SelectItem>
                  <SelectItem value="pst">Pacific Time</SelectItem>
                  <SelectItem value="cet">Central European Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Campaign Configuration</CardTitle>
          <CardDescription>Final settings before launch</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Daily Budget</Label>
              <Input id="budget" placeholder="$500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Campaign Duration</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Advanced Options</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="ab-test" />
                <Label htmlFor="ab-test">Enable A/B testing</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="frequency-cap" />
                <Label htmlFor="frequency-cap">Set frequency cap</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="auto-optimize" />
                <Label htmlFor="auto-optimize">Auto-optimize performance</Label>
              </div>
            </div>
          </div>

          <Button onClick={handleSchedule} disabled={isScheduling} className="w-full">
            {isScheduling ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-pulse" />
                Scheduling Campaign...
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4 mr-2" />
                Schedule Campaign Launch
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
