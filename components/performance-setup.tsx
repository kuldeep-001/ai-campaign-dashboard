"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Bell, Target, TrendingUp, CheckCircle } from "lucide-react"

const kpiMetrics = [
  { id: "impressions", name: "Impressions", description: "Total ad views", enabled: true },
  { id: "clicks", name: "Click-through Rate", description: "Percentage of clicks", enabled: true },
  { id: "conversions", name: "Conversions", description: "Completed actions", enabled: true },
  { id: "revenue", name: "Revenue", description: "Generated sales", enabled: true },
  { id: "engagement", name: "Engagement Rate", description: "User interactions", enabled: false },
  { id: "retention", name: "Retention Rate", description: "Return visitors", enabled: false },
]

const alertRules = [
  { id: "low-performance", name: "Low Performance Alert", threshold: "CTR < 1%", enabled: true },
  { id: "high-spend", name: "Budget Alert", threshold: "Spend > 80% of budget", enabled: true },
  { id: "conversion-drop", name: "Conversion Drop", threshold: "Conversions down 20%", enabled: false },
]

export function PerformanceSetup() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(kpiMetrics.filter((m) => m.enabled).map((m) => m.id))
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>(alertRules.filter((r) => r.enabled).map((r) => r.id))
  const [isSettingUp, setIsSettingUp] = useState(false)

  const handleMetricToggle = (metricId: string) => {
    setSelectedMetrics((prev) => (prev.includes(metricId) ? prev.filter((id) => id !== metricId) : [...prev, metricId]))
  }

  const handleAlertToggle = (alertId: string) => {
    setSelectedAlerts((prev) => (prev.includes(alertId) ? prev.filter((id) => id !== alertId) : [...prev, alertId]))
  }

  const handleSetup = async () => {
    setIsSettingUp(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSettingUp(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Performance Monitoring Setup
          </CardTitle>
          <CardDescription>Configure real-time tracking and AI-powered performance insights</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Key Performance Indicators
            </CardTitle>
            <CardDescription>Select metrics to track and analyze</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {kpiMetrics.map((metric) => (
              <div
                key={metric.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  selectedMetrics.includes(metric.id) ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedMetrics.includes(metric.id)}
                    onCheckedChange={() => handleMetricToggle(metric.id)}
                  />
                  <div>
                    <div className="font-medium">{metric.name}</div>
                    <div className="text-sm text-muted-foreground">{metric.description}</div>
                  </div>
                </div>
                <Badge variant={selectedMetrics.includes(metric.id) ? "default" : "outline"}>
                  {selectedMetrics.includes(metric.id) ? "Tracking" : "Disabled"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Alert Configuration
            </CardTitle>
            <CardDescription>Set up automated performance alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alertRules.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  selectedAlerts.includes(alert.id) ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedAlerts.includes(alert.id)}
                    onCheckedChange={() => handleAlertToggle(alert.id)}
                  />
                  <div>
                    <div className="font-medium">{alert.name}</div>
                    <div className="text-sm text-muted-foreground">{alert.threshold}</div>
                  </div>
                </div>
                <Badge variant={selectedAlerts.includes(alert.id) ? "default" : "outline"}>
                  {selectedAlerts.includes(alert.id) ? "Active" : "Disabled"}
                </Badge>
              </div>
            ))}

            <Button variant="outline" className="w-full bg-transparent">
              <Bell className="h-4 w-4 mr-2" />
              Add Custom Alert
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Reporting Configuration</CardTitle>
          <CardDescription>Set up automated reports and insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="report-frequency">Report Frequency</Label>
              <Select defaultValue="daily">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-recipients">Report Recipients</Label>
              <Input id="report-recipients" placeholder="team@company.com" />
            </div>
          </div>

          <div className="space-y-3">
            <Label>AI Insights</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="performance-insights" defaultChecked />
                <Label htmlFor="performance-insights">Performance optimization suggestions</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="audience-insights" defaultChecked />
                <Label htmlFor="audience-insights">Audience behavior analysis</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="trend-analysis" />
                <Label htmlFor="trend-analysis">Market trend correlation</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <CheckCircle className="h-5 w-5" />
            Campaign Ready for Launch
          </CardTitle>
          <CardDescription>All systems configured. Your AI-powered campaign is ready to deploy.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
            <div>
              <div className="text-muted-foreground">Tracking Metrics</div>
              <div className="text-2xl font-bold">{selectedMetrics.length}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Active Alerts</div>
              <div className="text-2xl font-bold">{selectedAlerts.length}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Report Frequency</div>
              <div className="text-2xl font-bold">Daily</div>
            </div>
            <div>
              <div className="text-muted-foreground">AI Insights</div>
              <div className="text-2xl font-bold text-green-500">Enabled</div>
            </div>
          </div>

          <Button onClick={handleSetup} disabled={isSettingUp} className="w-full">
            {isSettingUp ? (
              <>
                <TrendingUp className="h-4 w-4 mr-2 animate-pulse" />
                Setting up Monitoring...
              </>
            ) : (
              <>
                <BarChart3 className="h-4 w-4 mr-2" />
                Complete Campaign Setup
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
