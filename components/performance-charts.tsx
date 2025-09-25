"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, BarChart3, Download, RefreshCw } from "lucide-react"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const performanceData = [
  { date: "2024-01-01", impressions: 45000, clicks: 1350, conversions: 54, revenue: 2700 },
  { date: "2024-01-02", impressions: 52000, clicks: 1560, conversions: 62, revenue: 3100 },
  { date: "2024-01-03", impressions: 48000, clicks: 1440, conversions: 58, revenue: 2900 },
  { date: "2024-01-04", impressions: 61000, clicks: 1830, conversions: 73, revenue: 3650 },
  { date: "2024-01-05", impressions: 58000, clicks: 1740, conversions: 70, revenue: 3500 },
  { date: "2024-01-06", impressions: 65000, clicks: 1950, conversions: 78, revenue: 3900 },
  { date: "2024-01-07", impressions: 72000, clicks: 2160, conversions: 86, revenue: 4300 },
]

const segmentData = [
  { name: "Premium Shoppers", value: 35, color: "#8b5cf6" },
  { name: "Health Enthusiasts", value: 28, color: "#06b6d4" },
  { name: "Young Professionals", value: 22, color: "#10b981" },
  { name: "Families", value: 15, color: "#f59e0b" },
]

const campaignPerformance = [
  { name: "Holiday Gift Guide", ctr: 3.4, conversions: 312, revenue: 18200 },
  { name: "Valentine Romance", ctr: 2.8, conversions: 187, revenue: 9400 },
  { name: "Spring Wellness", ctr: 3.1, conversions: 245, revenue: 12300 },
  { name: "Winter Comfort", ctr: 2.5, conversions: 156, revenue: 7800 },
]

export function PerformanceCharts() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Campaign Performance Overview</CardTitle>
              <CardDescription>Real-time metrics across all active campaigns</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="7d">
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  className="text-muted-foreground"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                />
                <YAxis className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="impressions"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Impressions"
                />
                <Line type="monotone" dataKey="clicks" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Clicks" />
                <Line
                  type="monotone"
                  dataKey="conversions"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  name="Conversions"
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Campaign Performance by CTR
              <Badge variant="secondary" className="gap-1">
                <TrendingUp className="h-3 w-3" />
                +12%
              </Badge>
            </CardTitle>
            <CardDescription>Click-through rates across active campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={campaignPerformance}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-muted-foreground" angle={-45} textAnchor="end" height={80} />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="ctr" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Audience Segments
              <Badge variant="outline" className="gap-1">
                <BarChart3 className="h-3 w-3" />4 Active
              </Badge>
            </CardTitle>
            <CardDescription>Performance distribution by user segments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {segmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {segmentData.map((segment) => (
                <div key={segment.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
                  <span className="text-muted-foreground">{segment.name}</span>
                  <span className="font-medium ml-auto">{segment.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
