"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Target, Brain, Star } from "lucide-react"

const userSegments = [
  {
    id: "premium-shoppers",
    name: "Premium Shoppers",
    description: "High-value customers with luxury preferences",
    size: "45K users",
    relevanceScore: 94,
    characteristics: ["High income", "Brand conscious", "Quality focused"],
    avgOrderValue: "$280",
    conversionRate: "4.2%",
  },
  {
    id: "health-enthusiasts",
    name: "Health Enthusiasts",
    description: "Active lifestyle and wellness-focused users",
    size: "78K users",
    relevanceScore: 87,
    characteristics: ["Fitness focused", "Organic preferences", "Active lifestyle"],
    avgOrderValue: "$120",
    conversionRate: "3.8%",
  },
  {
    id: "young-professionals",
    name: "Young Professionals",
    description: "Career-focused millennials and Gen Z",
    size: "92K users",
    relevanceScore: 82,
    characteristics: ["Tech-savvy", "Time-conscious", "Career-focused"],
    avgOrderValue: "$95",
    conversionRate: "3.1%",
  },
  {
    id: "families",
    name: "Family Shoppers",
    description: "Parents shopping for family needs",
    size: "156K users",
    relevanceScore: 89,
    characteristics: ["Value-conscious", "Bulk buyers", "Safety focused"],
    avgOrderValue: "$180",
    conversionRate: "3.5%",
  },
  {
    id: "eco-conscious",
    name: "Eco-Conscious Consumers",
    description: "Environmentally aware shoppers",
    size: "63K users",
    relevanceScore: 76,
    characteristics: ["Sustainability focused", "Ethical buyers", "Research-driven"],
    avgOrderValue: "$140",
    conversionRate: "2.9%",
  },
]

export function SegmentSelection() {
  const [selectedSegments, setSelectedSegments] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleSegmentToggle = (segmentId: string) => {
    setSelectedSegments((prev) =>
      prev.includes(segmentId) ? prev.filter((id) => id !== segmentId) : [...prev, segmentId],
    )
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsAnalyzing(false)
  }

  const totalReach = selectedSegments.reduce((total, segmentId) => {
    const segment = userSegments.find((s) => s.id === segmentId)
    return total + (segment ? Number.parseInt(segment.size.replace(/[^\d]/g, "")) : 0)
  }, 0)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Target Segment Selection
          </CardTitle>
          <CardDescription>AI has scored each segment based on relevance to your selected campaign</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {userSegments.map((segment) => (
              <div
                key={segment.id}
                className={`p-4 rounded-lg border transition-all ${
                  selectedSegments.includes(segment.id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={selectedSegments.includes(segment.id)}
                    onCheckedChange={() => handleSegmentToggle(segment.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{segment.name}</h3>
                        <p className="text-sm text-muted-foreground">{segment.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Brain className="h-4 w-4 text-primary" />
                          <span className="font-medium">{segment.relevanceScore}%</span>
                        </div>
                        <div className="text-sm text-muted-foreground">AI Score</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Relevance Score</span>
                        <span className="font-medium">{segment.relevanceScore}%</span>
                      </div>
                      <Progress value={segment.relevanceScore} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Audience Size</div>
                        <div className="font-medium">{segment.size}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Avg Order Value</div>
                        <div className="font-medium">{segment.avgOrderValue}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Conversion Rate</div>
                        <div className="font-medium">{segment.conversionRate}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {segment.characteristics.map((char) => (
                        <Badge key={char} variant="outline" className="text-xs">
                          {char}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-pulse" />
                  Analyzing Segments...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Re-analyze Segments
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedSegments.length > 0 && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Star className="h-5 w-5" />
              Selected Segments Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Total Segments</div>
                <div className="text-2xl font-bold">{selectedSegments.length}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Combined Reach</div>
                <div className="text-2xl font-bold">{totalReach}K</div>
              </div>
              <div>
                <div className="text-muted-foreground">Avg AI Score</div>
                <div className="text-2xl font-bold">
                  {Math.round(
                    selectedSegments.reduce((total, segmentId) => {
                      const segment = userSegments.find((s) => s.id === segmentId)
                      return total + (segment?.relevanceScore || 0)
                    }, 0) / selectedSegments.length,
                  )}
                  %
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Est. Performance</div>
                <div className="text-2xl font-bold text-green-500">High</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
