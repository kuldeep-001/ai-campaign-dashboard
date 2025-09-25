"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Palette, Type, ImageIcon, Video, RefreshCw, Download, Eye } from "lucide-react"

export function ContentCustomization() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState({
    headline: "Discover Your Perfect Holiday Gifts",
    subheadline: "Curated selections that bring joy to every celebration",
    cta: "Shop Holiday Collection",
    bodyText:
      "Make this holiday season unforgettable with our carefully curated gift guide. From luxury items to thoughtful surprises, find the perfect present for everyone on your list.",
  })

  const handleGenerate = async (contentType: string) => {
    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Content Customization
          </CardTitle>
          <CardDescription>
            Generate and customize copy, images, and videos with AI while maintaining brand consistency
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="copy" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="copy" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Copy & Text
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Images
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Videos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="copy" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content Generation</CardTitle>
                <CardDescription>Customize your campaign messaging</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tone">Brand Tone</Label>
                  <Input id="tone" placeholder="Friendly, professional, luxury..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keywords">Key Messages</Label>
                  <Textarea
                    id="keywords"
                    placeholder="Holiday gifts, premium quality, family traditions..."
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="audience-note">Audience Notes</Label>
                  <Textarea
                    id="audience-note"
                    placeholder="Focus on premium shoppers who value quality over price..."
                    className="min-h-[60px]"
                  />
                </div>
                <Button onClick={() => handleGenerate("copy")} disabled={isGenerating} className="w-full">
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating Copy...
                    </>
                  ) : (
                    <>
                      <Type className="h-4 w-4 mr-2" />
                      Generate Copy
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Generated Content</CardTitle>
                <CardDescription>AI-generated copy for your campaign</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Headline</Label>
                  <Input value={generatedContent.headline} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Subheadline</Label>
                  <Input value={generatedContent.subheadline} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Call to Action</Label>
                  <Input value={generatedContent.cta} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Body Text</Label>
                  <Textarea value={generatedContent.bodyText} readOnly className="min-h-[100px]" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Image Generation</CardTitle>
                <CardDescription>Create visuals that match your brand</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-style">Visual Style</Label>
                  <Input id="image-style" placeholder="Modern, minimalist, festive, luxury..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image-prompt">Image Description</Label>
                  <Textarea
                    id="image-prompt"
                    placeholder="Holiday gifts arranged elegantly on a marble surface with warm lighting..."
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input id="dimensions" placeholder="1200x800, 1080x1080, 1920x1080..." />
                </div>
                <Button onClick={() => handleGenerate("images")} disabled={isGenerating} className="w-full">
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating Images...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Generate Images
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Generated Images</CardTitle>
                <CardDescription>AI-created visuals for your campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto" />
                        <div className="text-sm text-muted-foreground">Generated Image {i}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Video Generation</CardTitle>
                <CardDescription>Create engaging video content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="video-type">Video Type</Label>
                  <Input id="video-type" placeholder="Product showcase, lifestyle, testimonial..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="video-script">Video Script/Concept</Label>
                  <Textarea
                    id="video-script"
                    placeholder="Show holiday gifts being unwrapped with family reactions..."
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="video-duration">Duration</Label>
                  <Input id="video-duration" placeholder="15s, 30s, 60s..." />
                </div>
                <Button onClick={() => handleGenerate("videos")} disabled={isGenerating} className="w-full">
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating Videos...
                    </>
                  ) : (
                    <>
                      <Video className="h-4 w-4 mr-2" />
                      Generate Videos
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Generated Videos</CardTitle>
                <CardDescription>AI-created video content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <Video className="h-8 w-8 text-muted-foreground mx-auto" />
                        <div className="text-sm text-muted-foreground">Generated Video {i}</div>
                        <Badge variant="outline">30s</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
