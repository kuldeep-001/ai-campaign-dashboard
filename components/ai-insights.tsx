"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Target, Zap } from "lucide-react"

const insights = [
  {
    id: 1,
    type: "optimization",
    title: "Audience Targeting Opportunity",
    description:
      "Your Holiday Gift Guide campaign shows 23% higher engagement with users aged 35-44. Consider expanding this segment allocation.",
    impact: "high",
    confidence: 87,
    action: "Adjust targeting",
    icon: Target,
  },
  {
    id: 2,
    type: "performance",
    title: "Content Performance Alert",
    description:
      "Video content in your Valentine's campaign is outperforming static images by 340%. Recommend increasing video budget allocation.",
    impact: "medium",
    confidence: 92,
    action: "Increase video spend",
    icon: TrendingUp,
  },
  {
    id: 3,
    type: "trend",
    title: "Seasonal Trend Detection",
    description:
      "AI detected emerging trend: 'Sustainable gifting' searches up 180% this week. Consider adding eco-friendly product lines.",
    impact: "high",
    confidence: 78,
    action: "Create eco campaign",
    icon: Lightbulb,
  },
  {
    id: 4,
    type: "warning",
    title: "Budget Optimization Needed",
    description:
      "Spring Wellness campaign is spending 15% above optimal rate with diminishing returns. Recommend budget reallocation.",
    impact: "medium",
    confidence: 85,
    action: "Optimize budget",
    icon: AlertTriangle,
  },
]

const performancePredictions = [
  {
    campaign: "Holiday Gift Guide",
    currentCTR: 3.4,
    predictedCTR: 4.1,
    improvement: "+20%",
    confidence: 89,
  },
  {
    campaign: "Valentine Romance",
    currentCTR: 2.8,
    predictedCTR: 3.2,
    improvement: "+14%",
    confidence: 76,
  },
  {
    campaign: "Spring Wellness",
    currentCTR: 3.1,
    predictedCTR: 2.9,
    improvement: "-6%",
    confidence: 82,
  },
]

export function AIInsights() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI-Powered Insights
          </CardTitle>
          <CardDescription>Real-time analysis and optimization recommendations from your campaign data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border ${
                insight.impact === "high"
                  ? "border-primary bg-primary/5"
                  : insight.type === "warning"
                    ? "border-destructive bg-destructive/5"
                    : "border-border bg-card/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    insight.impact === "high"
                      ? "bg-primary/10"
                      : insight.type === "warning"
                        ? "bg-destructive/10"
                        : "bg-muted"
                  }`}
                >
                  <insight.icon
                    className={`h-4 w-4 ${
                      insight.impact === "high"
                        ? "text-primary"
                        : insight.type === "warning"
                          ? "text-destructive"
                          : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{insight.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          insight.impact === "high"
                            ? "default"
                            : insight.type === "warning"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {insight.impact} impact
                      </Badge>
                      <Badge variant="outline">{insight.confidence}% confidence</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Recommended action: </span>
                      <span className="font-medium">{insight.action}</span>
                    </div>
                    <Button size="sm" variant={insight.impact === "high" ? "default" : "outline"}>
                      <Zap className="h-3 w-3 mr-1" />
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Predictions</CardTitle>
          <CardDescription>AI forecasts based on current trends and historical data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {performancePredictions.map((prediction) => (
            <div key={prediction.campaign} className="p-4 rounded-lg border border-border bg-card/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{prediction.campaign}</h4>
                <Badge variant={prediction.improvement.startsWith("+") ? "default" : "destructive"} className="gap-1">
                  {prediction.improvement.startsWith("+") ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {prediction.improvement}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                <div>
                  <div className="text-muted-foreground">Current CTR</div>
                  <div className="font-medium">{prediction.currentCTR}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Predicted CTR</div>
                  <div className="font-medium">{prediction.predictedCTR}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Confidence</div>
                  <div className="font-medium">{prediction.confidence}%</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Prediction Confidence</span>
                  <span>{prediction.confidence}%</span>
                </div>
                <Progress value={prediction.confidence} className="h-2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
