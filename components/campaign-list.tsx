"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Calendar, Target, TrendingUp, Users, Eye, Edit, Trash2, Rocket, Download } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCampaigns } from "@/lib/campaign-context"
import { Campaign } from "@/lib/types"

const getStatusColor = (status: string) => {
  switch (status) {
    case 'launched':
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'draft':
      return 'bg-gray-100 text-gray-800'
    case 'scheduled':
      return 'bg-blue-100 text-blue-800'
    case 'completed':
      return 'bg-purple-100 text-purple-800'
    case 'paused':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getPerformanceColor = (performance: string) => {
  switch (performance) {
    case 'High':
      return 'text-green-600'
    case 'Medium':
      return 'text-yellow-600'
    case 'Low':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

interface CampaignListProps {
  filters?: {
    search: string
    status: string
    segment: string
  }
}

export function CampaignList({ filters = { search: "", status: "all", segment: "all" } }: CampaignListProps) {
  const { launchedCampaigns, getCampaignPersonas } = useCampaigns()
  
  // Convert launched campaigns to display format
  const allCampaigns = launchedCampaigns.map(campaign => ({
    id: campaign.id,
    name: campaign.title,
    status: campaign.status,
    segment: campaign.targetAudience,
    performance: campaign.metrics?.expectedCTR && campaign.metrics.expectedCTR > 3 ? 'High' : 
                 campaign.metrics?.expectedCTR && campaign.metrics.expectedCTR > 1.5 ? 'Medium' : 'Low',
    impressions: campaign.metrics?.predictedEngagement ? `${Math.round(campaign.metrics.predictedEngagement * 1000)}K` : '0',
    clicks: campaign.metrics?.expectedCTR ? `${Math.round(campaign.metrics.expectedCTR * 100)}K` : '0',
    conversions: campaign.metrics?.expectedConversionRate ? `${Math.round(campaign.metrics.expectedConversionRate * 1000)}` : '0',
    ctr: campaign.metrics?.expectedCTR ? `${campaign.metrics.expectedCTR.toFixed(2)}%` : '0%',
    lastUpdated: campaign.launchedAt ? `${Math.floor((Date.now() - new Date(campaign.launchedAt).getTime()) / (1000 * 60 * 60))} hours ago` : 'Just now',
    budget: campaign.launchSettings?.budget ? `$${campaign.launchSettings.budget.toLocaleString()}` : '$5,000',
    spent: campaign.launchSettings?.budget ? `$${Math.round(campaign.launchSettings.budget * 0.3).toLocaleString()}` : '$1,500',
    originalCampaign: campaign, // Keep reference to original campaign for export
  }))

  // Filter campaigns based on search and filters
  const displayCampaigns = useMemo(() => {
    return allCampaigns.filter(campaign => {
      const matchesSearch = !filters.search || 
        campaign.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        campaign.segment.toLowerCase().includes(filters.search.toLowerCase())
      
      const matchesStatus = filters.status === "all" || 
        campaign.status.toLowerCase() === filters.status.toLowerCase()
      
      const matchesSegment = filters.segment === "all" || 
        campaign.segment.toLowerCase().includes(filters.segment.toLowerCase())
      
      return matchesSearch && matchesStatus && matchesSegment
    })
  }, [allCampaigns, filters])

  // Export single campaign as JSON
  const exportCampaign = (campaign: any) => {
    const personas = getCampaignPersonas(campaign.originalCampaign.id)
    const exportData = {
      id: campaign.originalCampaign.id,
      title: campaign.originalCampaign.title,
      description: campaign.originalCampaign.description,
      status: campaign.originalCampaign.status,
      targetAudience: campaign.originalCampaign.targetAudience,
      reach: campaign.originalCampaign.reach,
      confidence: campaign.originalCampaign.confidence,
      content: campaign.originalCampaign.content,
      metrics: campaign.originalCampaign.metrics,
      launchSettings: campaign.originalCampaign.launchSettings,
      customizations: campaign.originalCampaign.customizations,
      launchedAt: campaign.originalCampaign.launchedAt,
      createdAt: campaign.originalCampaign.createdAt,
      updatedAt: campaign.originalCampaign.updatedAt,
      personas: personas, // Include persona offers
    }
    
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${campaign.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_campaign.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Export all filtered campaigns as JSON
  const exportAllCampaigns = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalCampaigns: displayCampaigns.length,
      filters: filters,
      campaigns: displayCampaigns.map(campaign => {
        const personas = getCampaignPersonas(campaign.originalCampaign.id)
        return {
          id: campaign.originalCampaign.id,
          title: campaign.originalCampaign.title,
          description: campaign.originalCampaign.description,
          status: campaign.originalCampaign.status,
          targetAudience: campaign.originalCampaign.targetAudience,
          reach: campaign.originalCampaign.reach,
          confidence: campaign.originalCampaign.confidence,
          content: campaign.originalCampaign.content,
          metrics: campaign.originalCampaign.metrics,
          launchSettings: campaign.originalCampaign.launchSettings,
          customizations: campaign.originalCampaign.customizations,
          launchedAt: campaign.originalCampaign.launchedAt,
          createdAt: campaign.originalCampaign.createdAt,
          updatedAt: campaign.originalCampaign.updatedAt,
          personas: personas, // Include persona offers
        }
      })
    }
    
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `campaigns_export_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (displayCampaigns.length === 0) {
    const hasFilters = filters.search || filters.status !== "all" || filters.segment !== "all"
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>Manage your AI-generated marketing campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Rocket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {hasFilters ? "No campaigns match your filters" : "No campaigns launched yet"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {hasFilters 
                ? "Try adjusting your search or filter criteria to see more campaigns."
                : "Launch your first campaign from the AI Chat to see it here."
              }
            </p>
            {hasFilters ? (
              <Button variant="outline" onClick={() => window.location.reload()}>
                Clear Filters
              </Button>
            ) : (
              <Button onClick={() => window.location.href = '/chat'}>
                Go to AI Chat
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Campaigns ({displayCampaigns.length})</CardTitle>
        <CardDescription>Manage your AI-generated marketing campaigns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition-colors"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium">{campaign.name}</h3>
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Target className="h-3 w-3" />
                    {campaign.segment}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {campaign.impressions} impressions
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    <span className={getPerformanceColor(campaign.performance)}>
                      {campaign.performance} performance
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {campaign.lastUpdated}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Clicks: </span>
                    <span className="font-medium">{campaign.clicks}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Conversions: </span>
                    <span className="font-medium">{campaign.conversions}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CTR: </span>
                    <span className="font-medium">{campaign.ctr}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Budget: </span>
                    <span className="font-medium">{campaign.budget}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Analytics
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportCampaign(campaign)}>
                      <Download className="h-4 w-4 mr-2" />
                      Export as JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}