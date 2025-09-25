"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { X, Target, Users, TrendingUp, Calendar, Edit, Rocket } from "lucide-react"

interface CampaignPreviewProps {
  onClose: () => void
}

export function CampaignPreview({ onClose }: CampaignPreviewProps) {
  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Campaign Preview</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-auto">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Premium Holiday Gift Guide 2024</CardTitle>
              <Badge variant="secondary" className="gap-1">
                <TrendingUp className="h-3 w-3" />
                94% AI Score
              </Badge>
            </div>
            <CardDescription>Curated luxury gifts for the holiday season</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Premium Shoppers</div>
                  <div className="text-muted-foreground">45K users</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">250K Reach</div>
                  <div className="text-muted-foreground">Estimated</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Campaign Readiness</span>
                <span className="font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Generated Content</h4>
              <div className="p-3 bg-muted rounded-lg text-sm">
                <div className="font-medium mb-1">Headline:</div>
                <p>"Discover Gifts That Create Lasting Memories"</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Target Segments</h4>
              <div className="flex flex-wrap gap-1">
                <Badge variant="outline">High Income</Badge>
                <Badge variant="outline">Brand Conscious</Badge>
                <Badge variant="outline">Quality Focused</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Launch Timeline</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Ready to launch in 2-3 days</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Performance Predictions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-muted-foreground">Expected CTR</div>
                <div className="font-medium">3.2%</div>
              </div>
              <div>
                <div className="text-muted-foreground">Conv. Rate</div>
                <div className="font-medium">4.1%</div>
              </div>
              <div>
                <div className="text-muted-foreground">Est. Revenue</div>
                <div className="font-medium">$18.5K</div>
              </div>
              <div>
                <div className="text-muted-foreground">ROI</div>
                <div className="font-medium text-green-500">340%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Button className="w-full gap-2">
            <Edit className="h-4 w-4" />
            Customize Campaign
          </Button>
          <Button variant="outline" className="w-full gap-2 bg-transparent">
            <Rocket className="h-4 w-4" />
            Launch Now
          </Button>
        </div>
      </div>
    </div>
  )
}
