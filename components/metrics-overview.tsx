import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, Target, DollarSign, BarChart3, Eye, MousePointer } from "lucide-react"

const metrics = [
  {
    title: "Total Impressions",
    value: "2.4M",
    change: "+18%",
    trend: "up",
    icon: Eye,
    description: "vs last month",
  },
  {
    title: "Click-Through Rate",
    value: "3.2%",
    change: "+0.4%",
    trend: "up",
    icon: MousePointer,
    description: "average across campaigns",
  },
  {
    title: "Conversion Rate",
    value: "2.8%",
    change: "-0.2%",
    trend: "down",
    icon: Target,
    description: "vs last month",
  },
  {
    title: "Revenue Generated",
    value: "$47.2K",
    change: "+22%",
    trend: "up",
    icon: DollarSign,
    description: "total campaign revenue",
  },
  {
    title: "Active Segments",
    value: "12",
    change: "+3",
    trend: "up",
    icon: Users,
    description: "targeted user groups",
  },
  {
    title: "Performance Score",
    value: "87",
    change: "+5",
    trend: "up",
    icon: BarChart3,
    description: "AI-calculated score",
  },
]

export function MetricsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={metric.trend === "up" ? "default" : "destructive"} className="gap-1 text-xs">
                {metric.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {metric.change}
              </Badge>
              <span className="text-xs text-muted-foreground">{metric.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
