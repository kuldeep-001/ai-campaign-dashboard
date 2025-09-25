"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Campaign, Persona, Offer } from "@/lib/types"
import { PersonaOffersTab } from "./persona-offers-tab"
import { 
  X, 
  Target, 
  Users, 
  TrendingUp, 
  Calendar, 
  Edit, 
  Rocket, 
  BarChart3, 
  MessageSquare, 
  Eye,
  DollarSign,
  Percent,
  Clock,
  CheckCircle
} from "lucide-react"

interface EnhancedCampaignPreviewProps {
  campaign: Campaign | null
  isOpen: boolean
  onClose: () => void
  onSelectCampaign: (campaign: Campaign) => void
  onEditCampaign: (campaign: Campaign) => void
  onCustomizeCampaign: (campaign: Campaign) => void
  onLaunchCampaign: (campaign: Campaign) => void
  isLaunching?: boolean
  isLaunched?: boolean
  isGeneratingPersonas?: boolean
  personasReady?: boolean
  personas?: Persona[]
  onSelectOffer?: (persona: Persona, offer: Offer) => void
}

export function EnhancedCampaignPreview({ 
  campaign, 
  isOpen, 
  onClose, 
  onSelectCampaign, 
  onEditCampaign, 
  onCustomizeCampaign, 
  onLaunchCampaign, 
  isLaunching = false, 
  isLaunched = false,
  isGeneratingPersonas = false,
  personasReady = false,
  personas = [],
  onSelectOffer
}: EnhancedCampaignPreviewProps) {
  if (!campaign) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-6xl max-h-[90vh] overflow-y-auto overflow-x-hidden w-[95vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            {campaign.title}
          </DialogTitle>
        </DialogHeader>

        {/* Success Message */}
        {isLaunched && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800">Campaign Launched Successfully! 🚀</h3>
                <p className="text-green-700 mt-1">
                  "{campaign.title}" is now live and active. You can view it in the Campaigns page.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6 w-full max-w-full">
          {/* Campaign Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{campaign.title}</CardTitle>
                  <CardDescription className="mt-2 break-words">{campaign.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {campaign.confidence}% AI Score
                  </Badge>
                  <Badge variant={campaign.status === 'ready' ? 'default' : 'secondary'}>
                    {campaign.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{campaign.targetAudience}</div>
                    <div className="text-sm text-muted-foreground">Target Audience</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{(campaign.reach || 50000).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Estimated Reach</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{campaign.season || campaign.primaryFestivalsOrSeason?.[0] || 'Festival Season'}</div>
                    <div className="text-sm text-muted-foreground">Season</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{campaign.metrics?.readinessScore || 85}%</div>
                    <div className="text-sm text-muted-foreground">Readiness</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Information Tabs */}
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="strategy">Strategy</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="personas">Persona Offers</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <ContentTab campaign={campaign} />
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <MetricsTab campaign={campaign} />
            </TabsContent>

            <TabsContent value="strategy" className="space-y-4">
              <StrategyTab campaign={campaign} />
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <TimelineTab campaign={campaign} />
            </TabsContent>

            <TabsContent value="personas" className="space-y-4">
              <PersonaOffersTab 
                campaign={campaign} 
                personas={personas} 
                onSelectOffer={onSelectOffer}
                isGeneratingPersonas={isGeneratingPersonas}
                personasReady={personasReady}
              />
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t">
            {isLaunched ? (
              <>
                <Button variant="outline" onClick={() => onCustomizeCampaign(campaign)} className="flex-1 gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Campaign
                </Button>
                <Button variant="outline" onClick={onClose} className="flex-1 gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Done
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => onCustomizeCampaign(campaign)} className="flex-1 gap-2">
                  <Edit className="h-4 w-4" />
                  Customize
                </Button>
                <Button 
                  onClick={() => onLaunchCampaign(campaign)} 
                  className="flex-1 gap-2 bg-green-600 hover:bg-green-700" 
                  disabled={isLaunching || !personasReady}
                  title={!personasReady ? "Persona offers must be ready before launching" : ""}
                >
                  <Rocket className="h-4 w-4" />
                  {isLaunching ? "Launching..." : !personasReady ? "Preparing Offers..." : "Launch Campaign"}
                </Button>
                <Button variant="outline" onClick={onClose} className="gap-2">
                  <X className="h-4 w-4" />
                  Close
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ContentTab({ campaign }: { campaign: Campaign }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Campaign Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm mb-2">Headline</h4>
              <p className="text-sm bg-muted p-3 rounded-lg break-words">{campaign.content?.headline || campaign.title || 'No headline available'}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Subheadline</h4>
              <p className="text-sm bg-muted p-3 rounded-lg break-words">{campaign.content?.subheadline || campaign.description || 'No subheadline available'}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Call to Action</h4>
              <p className="text-sm bg-muted p-3 rounded-lg break-words">{campaign.content?.callToAction || 'Learn More'}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm">Key Messages</h4>
            <ul className="space-y-2">
              {(campaign.content?.keyMessages || campaign.contentIdeas || ['No key messages available']).map((message, index) => (
                <li key={index} className="flex items-center gap-2 text-sm break-words">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="break-words">{message}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm">Visual Elements</h4>
            <div className="flex flex-wrap gap-2">
              {(campaign.content?.visualElements || ['No visual elements specified']).map((element, index) => (
                <Badge key={index} variant="outline" className="break-words">
                  {element}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Tone</h4>
              <p className="text-sm text-muted-foreground break-words">{campaign.content?.tone || 'Professional'}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Brand Voice</h4>
              <p className="text-sm text-muted-foreground break-words">{campaign.content?.brandVoice || 'Friendly and approachable'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MetricsTab({ campaign }: { campaign: Campaign }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Expected CTR</span>
              </div>
              <div className="text-2xl font-bold text-primary">{campaign.metrics?.expectedCTR || 2.5}%</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Percent className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Conversion Rate</span>
              </div>
              <div className="text-2xl font-bold text-primary">{campaign.metrics?.expectedConversionRate || 3.2}%</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Est. Revenue</span>
              </div>
              <div className="text-2xl font-bold text-green-500">${(campaign.metrics?.estimatedRevenue || 15000).toLocaleString()}</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Expected ROI</span>
              </div>
              <div className="text-2xl font-bold text-green-500">{campaign.metrics?.expectedROI || 250}%</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Readiness Score</span>
              </div>
              <div className="text-2xl font-bold text-blue-500">{campaign.metrics?.readinessScore || 85}%</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Predicted Engagement</span>
              </div>
              <div className="text-2xl font-bold text-purple-500">{campaign.metrics?.predictedEngagement || 4.2}%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StrategyTab({ campaign }: { campaign: Campaign }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Campaign Strategy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-sm mb-3">Target Audience Analysis</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Primary Audience</span>
                  <span className="font-medium">{campaign.targetAudience}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Estimated Reach</span>
                  <span className="font-medium">{(campaign.reach || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Confidence Level</span>
                  <span className="font-medium">{campaign.confidence}%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-3">Seasonal Context</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Season</span>
                  <span className="font-medium">{campaign.season}</span>
                </div>
                {campaign.festival && (
                  <div className="flex justify-between text-sm">
                    <span>Festival</span>
                    <span className="font-medium">{campaign.festival}</span>
                  </div>
                )}
                {campaign.trend && (
                  <div className="flex justify-between text-sm">
                    <span>Trend</span>
                    <span className="font-medium">{campaign.trend}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TimelineTab({ campaign }: { campaign: Campaign }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Launch Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Campaign Readiness</span>
              <span className="text-sm text-muted-foreground">{campaign.metrics?.readinessScore || 0}%</span>
            </div>
            <Progress value={campaign.metrics?.readinessScore || 0} className="h-2" />
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div>
                  <div className="font-medium text-sm">Content Creation</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div>
                  <div className="font-medium text-sm">Audience Targeting</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <div>
                  <div className="font-medium text-sm">Asset Preparation</div>
                  <div className="text-xs text-muted-foreground">In Progress</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-gray-300 rounded-full" />
                <div>
                  <div className="font-medium text-sm">Launch</div>
                  <div className="text-xs text-muted-foreground">Ready in 2-3 days</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
