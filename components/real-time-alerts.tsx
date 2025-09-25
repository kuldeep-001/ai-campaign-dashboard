"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, AlertTriangle, CheckCircle, Info, X, Eye } from "lucide-react"
import { format } from "date-fns"

const alerts = [
  {
    id: 1,
    type: "critical",
    title: "Budget Alert: Holiday Campaign",
    message:
      "Campaign has spent 85% of daily budget by 2 PM. Consider increasing budget or pausing to preserve evening traffic.",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    campaign: "Holiday Gift Guide",
    action: "Increase Budget",
    dismissed: false,
  },
  {
    id: 2,
    type: "warning",
    title: "Performance Drop Detected",
    message: "Valentine's Romance campaign CTR dropped 18% in the last 2 hours. Possible ad fatigue detected.",
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    campaign: "Valentine Romance",
    action: "Refresh Creative",
    dismissed: false,
  },
  {
    id: 3,
    type: "success",
    title: "Conversion Spike",
    message: "Spring Wellness campaign conversions up 34% compared to yesterday. Current optimization working well.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    campaign: "Spring Wellness",
    action: "Scale Up",
    dismissed: false,
  },
  {
    id: 4,
    type: "info",
    title: "Audience Insight Available",
    message:
      "New audience segment identified: 'Eco-conscious millennials' showing high engagement. Consider targeting.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    campaign: "All Campaigns",
    action: "Review Insight",
    dismissed: false,
  },
]

export function RealTimeAlerts() {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getAlertBadgeVariant = (type: string) => {
    switch (type) {
      case "critical":
        return "destructive"
      case "warning":
        return "secondary"
      case "success":
        return "default"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Real-Time Alerts
              <Badge variant="secondary" className="ml-2">
                {alerts.filter((a) => !a.dismissed).length} Active
              </Badge>
            </CardTitle>
            <CardDescription>Automated monitoring and performance alerts across all campaigns</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts
          .filter((alert) => !alert.dismissed)
          .map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${
                alert.type === "critical"
                  ? "border-destructive bg-destructive/5"
                  : alert.type === "warning"
                    ? "border-yellow-500 bg-yellow-500/5"
                    : alert.type === "success"
                      ? "border-green-500 bg-green-500/5"
                      : "border-border bg-card/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      <Badge variant={getAlertBadgeVariant(alert.type)} className="text-xs">
                        {alert.type}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground">{alert.message}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{alert.campaign}</span>
                      <span>{format(alert.timestamp, "HH:mm")}</span>
                    </div>
                    <Button size="sm" variant={alert.type === "critical" ? "default" : "outline"}>
                      {alert.action}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

        {alerts.filter((alert) => !alert.dismissed).length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p>All systems running smoothly</p>
            <p className="text-sm">No active alerts at this time</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
