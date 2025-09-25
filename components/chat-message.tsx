"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, User, Copy, ThumbsUp, ThumbsDown, Sparkles, Target, TrendingUp, Eye } from "lucide-react"
import { format } from "date-fns"
import { ChatMessage as ChatMessageType, Campaign } from "@/lib/types"

interface ChatMessageProps {
  message: ChatMessageType
  onSelectCampaign?: (campaign: Campaign) => void
}

export function ChatMessage({ message, onSelectCampaign }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className={isUser ? "bg-secondary" : "bg-primary/10"}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
        </AvatarFallback>
      </Avatar>

      <div className={`flex-1 space-y-2 ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`max-w-[80%] rounded-lg p-3 ${isUser ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"}`}
        >
          {message.type === "campaign" && message.data ? (
            <CampaignMessageContent 
              data={message.data} 
              content={message.content} 
              onSelectCampaign={onSelectCampaign}
            />
          ) : message.type === "suggestion" ? (
            <SuggestionMessageContent content={message.content} />
          ) : (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        <div
          className={`flex items-center gap-2 text-xs text-muted-foreground ${isUser ? "flex-row-reverse" : "flex-row"}`}
        >
          <span>{format(message.timestamp, "HH:mm")}</span>
          {!isUser && (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Copy className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ThumbsDown className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CampaignMessageContent({ 
  data, 
  content, 
  onSelectCampaign 
}: { 
  data: Campaign[] | Campaign | any; 
  content: string;
  onSelectCampaign?: (campaign: Campaign) => void;
}) {
  const campaigns = Array.isArray(data) ? data : [data]
  
  // Extract just the summary message from content, ignoring raw JSON and tables
  const getSummaryMessage = (content: string) => {
    // Look for a clean summary message before any JSON or table content
    const lines = content.split('\n')
    const summaryLines = []
    
    for (const line of lines) {
      // Stop when we hit JSON or table content
      if (line.includes('{') || line.includes('|') || line.includes('ID | Campaign Name')) {
        break
      }
      if (line.trim() && !line.includes('```')) {
        summaryLines.push(line)
      }
    }
    
    return summaryLines.join('\n').trim() || 'Here are some campaign suggestions for you:'
  }
  
  return (
    <div className="space-y-3">
      <p className="text-sm">{getSummaryMessage(content)}</p>
      <div className="space-y-2">
        {campaigns.map((campaign, index) => {
          // Handle both old Campaign type and new JSON response format
          const campaignData = {
            id: campaign.id || `campaign-${index}`,
            title: campaign.title || 'Untitled Campaign',
            description: campaign.description || campaign.rationale || 'No description available',
            targetAudience: campaign.targetAudience || 'General Audience',
            confidence: campaign.confidence ? Math.round(campaign.confidence * 100) : 85,
            reach: campaign.estimatedReach || campaign.reach || 50000,
            suggestedRun: campaign.suggestedRun || {},
            primaryFestivalsOrSeason: campaign.primaryFestivalsOrSeason || [],
            channels: campaign.channels || [],
            contentIdeas: campaign.contentIdeas || [],
            season: campaign.primaryFestivalsOrSeason?.[0] || campaign.season || 'Festival Season',
            status: campaign.status || 'ready',
            metrics: campaign.metrics || {
              readinessScore: 85,
              expectedCTR: 2.5,
              expectedConversionRate: 3.2,
              estimatedRevenue: 15000,
              expectedROI: 250,
              predictedEngagement: 4.2
            },
            content: campaign.content || {
              headline: campaign.title || 'Campaign Headline',
              subheadline: campaign.description || 'Campaign subheadline',
              callToAction: 'Learn More',
              keyMessages: campaign.contentIdeas || ['Key message 1', 'Key message 2'],
              visualElements: ['Festive imagery', 'Brand colors'],
              tone: 'Festive and engaging',
              brandVoice: 'Warm and welcoming'
            }
          }
          
          return (
            <Card key={campaignData.id} className="bg-background/50 border-border/50">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{campaignData.title}</h4>
                  <Badge variant="secondary" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    {campaignData.confidence}%
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {campaignData.targetAudience}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {campaignData.reach ? campaignData.reach.toLocaleString() : 'N/A'} reach
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {campaignData.description}
                </div>
                {campaignData.primaryFestivalsOrSeason.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {campaignData.primaryFestivalsOrSeason.map((festival: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {festival}
                      </Badge>
                    ))}
                  </div>
                )}
                {onSelectCampaign && (
                  <Button 
                    size="sm" 
                    className="w-full gap-2"
                    onClick={() => onSelectCampaign(campaignData as Campaign)}
                  >
                    <Eye className="h-3 w-3" />
                    View Campaign Details
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function SuggestionMessageContent({ content }: { content: string }) {
  return (
    <div className="space-y-3">
      <p className="text-sm">{content}</p>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm">
          Wellness Campaign
        </Button>
        <Button variant="outline" size="sm">
          Valentine's Ideas
        </Button>
        <Button variant="outline" size="sm">
          Spring Trends
        </Button>
      </div>
    </div>
  )
}
