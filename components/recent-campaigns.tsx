import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Calendar, Target } from "lucide-react"

const campaigns = [
  {
    id: 1,
    name: "Holiday Gift Guide 2024",
    status: "active",
    segment: "Premium Shoppers",
    performance: "High",
    lastUpdated: "2 hours ago",
  },
  {
    id: 2,
    name: "New Year Fitness Goals",
    status: "draft",
    segment: "Health Enthusiasts",
    performance: "Medium",
    lastUpdated: "1 day ago",
  },
  {
    id: 3,
    name: "Valentine's Day Romance",
    status: "scheduled",
    segment: "Couples 25-40",
    performance: "High",
    lastUpdated: "3 days ago",
  },
  {
    id: 4,
    name: "Spring Fashion Trends",
    status: "completed",
    segment: "Fashion Forward",
    performance: "Very High",
    lastUpdated: "1 week ago",
  },
]

export function RecentCampaigns() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Campaigns</CardTitle>
        <CardDescription>Your latest AI-generated campaigns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50"
          >
            <div className="space-y-1">
              <h4 className="font-medium text-sm">{campaign.name}</h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Target className="h-3 w-3" />
                {campaign.segment}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {campaign.lastUpdated}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  campaign.status === "active"
                    ? "default"
                    : campaign.status === "scheduled"
                      ? "secondary"
                      : campaign.status === "draft"
                        ? "outline"
                        : "secondary"
                }
              >
                {campaign.status}
              </Badge>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full bg-transparent">
          View All Campaigns
        </Button>
      </CardContent>
    </Card>
  )
}
