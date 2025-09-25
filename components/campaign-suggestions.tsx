"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Sparkles, Calendar, TrendingUp, RefreshCw, Heart, Gift, Snowflake, Sun } from "lucide-react"

const seasonalSuggestions = [
  {
    id: 1,
    title: "Holiday Gift Guide 2024",
    season: "Winter",
    description:
      "Curated gift recommendations for the holiday season with personalized suggestions based on recipient preferences and budget.",
    targetAudience: "Gift shoppers, families, professionals",
    estimatedReach: "250K",
    confidence: 94,
    icon: Gift,
    tags: ["Holiday", "Gifts", "Shopping", "Family"],
  },
  {
    id: 2,
    title: "Valentine's Day Romance Collection",
    season: "Winter",
    description: "Romantic lifestyle products and experiences perfect for couples celebrating Valentine's Day.",
    targetAudience: "Couples 25-45, romantic gift buyers",
    estimatedReach: "180K",
    confidence: 87,
    icon: Heart,
    tags: ["Romance", "Couples", "Gifts", "Experiences"],
  },
  {
    id: 3,
    title: "Spring Wellness Reset",
    season: "Spring",
    description: "Health and wellness products to help customers start fresh with spring cleaning for mind and body.",
    targetAudience: "Health enthusiasts, wellness seekers",
    estimatedReach: "320K",
    confidence: 91,
    icon: Sun,
    tags: ["Wellness", "Health", "Spring", "Lifestyle"],
  },
  {
    id: 4,
    title: "Winter Comfort Essentials",
    season: "Winter",
    description: "Cozy home products and comfort items to make the cold season more enjoyable and warm.",
    targetAudience: "Homeowners, comfort seekers",
    estimatedReach: "200K",
    confidence: 89,
    icon: Snowflake,
    tags: ["Comfort", "Home", "Winter", "Cozy"],
  },
]

export function CampaignSuggestions() {
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null)
  const [customPrompt, setCustomPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Campaign Suggestions
          </CardTitle>
          <CardDescription>
            Our AI has analyzed current seasonal trends, holidays, and market data to suggest these campaigns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {seasonalSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedSuggestion === suggestion.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedSuggestion(suggestion.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <suggestion.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{suggestion.title}</h3>
                      <Badge variant="secondary">{suggestion.season}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {suggestion.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Reach: <span className="font-medium">{suggestion.estimatedReach}</span>
                      </span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="font-medium">{suggestion.confidence}% confidence</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate More Suggestions
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom Campaign Prompt</CardTitle>
          <CardDescription>
            Describe your specific campaign needs and let AI generate tailored suggestions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="custom-prompt">Campaign Requirements</Label>
            <Textarea
              id="custom-prompt"
              placeholder="Example: Create a summer campaign for outdoor enthusiasts focusing on hiking gear and adventure experiences for millennials..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <Button onClick={handleGenerate} disabled={!customPrompt.trim() || isGenerating}>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Custom Campaign
          </Button>
        </CardContent>
      </Card>

      {selectedSuggestion && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-primary">Selected Campaign</CardTitle>
            <CardDescription>{seasonalSuggestions.find((s) => s.id === selectedSuggestion)?.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Ready to proceed to segment selection</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
