import { DashboardLayout } from "@/components/dashboard-layout"
import { PerformanceCharts } from "@/components/performance-charts"
import { MetricsOverview } from "@/components/metrics-overview"
import { CampaignPerformance } from "@/components/campaign-performance"
import { AIInsights } from "@/components/ai-insights"
import { RealTimeAlerts } from "@/components/real-time-alerts"
import { Button } from "@/components/ui/button"
import { Calendar, Download } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">Analytics & Insights</h1>
            <p className="text-muted-foreground text-pretty">
              AI-powered performance tracking and optimization recommendations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <MetricsOverview />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PerformanceCharts />
          </div>
          <div className="space-y-6">
            <CampaignPerformance />
            <RealTimeAlerts />
          </div>
        </div>

        <AIInsights />
      </div>
    </DashboardLayout>
  )
}
