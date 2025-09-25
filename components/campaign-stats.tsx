import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Target, Zap, BarChart3 } from "lucide-react"

const stats = [
  {
    title: "Active Campaigns",
    value: "12",
    change: "+2 from last week",
    icon: Target,
    trend: "up",
  },
  {
    title: "AI Suggestions",
    value: "47",
    change: "+12 this month",
    icon: Zap,
    trend: "up",
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "+0.4% from last month",
    icon: TrendingUp,
    trend: "up",
  },
  {
    title: "Performance Score",
    value: "87",
    change: "+5 points",
    icon: BarChart3,
    trend: "up",
  },
]

export function CampaignStats() {
  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
