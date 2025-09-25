import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, MoreHorizontal } from "lucide-react"

const topCampaigns = [
  {
    name: "Holiday Gift Guide 2024",
    performance: 94,
    revenue: "$18.2K",
    trend: "up",
    change: "+12%",
    status: "active",
  },
  {
    name: "Spring Fashion Trends",
    performance: 89,
    revenue: "$15.8K",
    trend: "up",
    change: "+8%",
    status: "completed",
  },
  {
    name: "Valentine's Day Romance",
    performance: 76,
    revenue: "$9.4K",
    trend: "down",
    change: "-3%",
    status: "scheduled",
  },
  {
    name: "New Year Fitness Goals",
    performance: 68,
    revenue: "$3.8K",
    trend: "up",
    change: "+5%",
    status: "draft",
  },
]

export function CampaignPerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Campaigns</CardTitle>
        <CardDescription>Ranked by AI performance score</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {topCampaigns.map((campaign, index) => (
          <div key={campaign.name} className="space-y-3 p-3 rounded-lg border border-border bg-card/50">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">#{index + 1}</span>
                  <h4 className="font-medium text-sm">{campaign.name}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      campaign.status === "active"
                        ? "default"
                        : campaign.status === "completed"
                          ? "secondary"
                          : "outline"
                    }
                    className="text-xs"
                  >
                    {campaign.status}
                  </Badge>
                  <Badge variant={campaign.trend === "up" ? "default" : "destructive"} className="gap-1 text-xs">
                    {campaign.trend === "up" ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {campaign.change}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Performance Score</span>
                <span className="font-medium">{campaign.performance}/100</span>
              </div>
              <Progress value={campaign.performance} className="h-2" />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Revenue</span>
              <span className="font-medium">{campaign.revenue}</span>
            </div>
          </div>
        ))}

        <Button variant="outline" className="w-full bg-transparent">
          View All Performance Data
        </Button>
      </CardContent>
    </Card>
  )
}
