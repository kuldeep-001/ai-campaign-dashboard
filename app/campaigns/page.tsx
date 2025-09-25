"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CampaignList } from "@/components/campaign-list"
import { CampaignFilters } from "@/components/campaign-filters"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import { useCampaigns } from "@/lib/campaign-context"

export default function CampaignsPage() {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    segment: "all"
  })
  const { launchedCampaigns, getCampaignPersonas } = useCampaigns()

  // Export all campaigns as JSON
  const exportAllCampaigns = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalCampaigns: launchedCampaigns.length,
      campaigns: launchedCampaigns.map(campaign => {
        const personas = getCampaignPersonas(campaign.id)
        return {
          id: campaign.id,
          title: campaign.title,
          description: campaign.description,
          status: campaign.status,
          targetAudience: campaign.targetAudience,
          reach: campaign.reach,
          confidence: campaign.confidence,
          content: campaign.content,
          metrics: campaign.metrics,
          launchSettings: campaign.launchSettings,
          customizations: campaign.customizations,
          launchedAt: campaign.launchedAt,
          createdAt: campaign.createdAt,
          updatedAt: campaign.updatedAt,
          personas: personas, // Include persona offers
        }
      })
    }
    
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `all_campaigns_export_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">Campaigns</h1>
            <p className="text-muted-foreground text-pretty">Manage and monitor your AI-generated seasonal campaigns</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportAllCampaigns}>
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
            <Button size="sm" onClick={() => window.location.href = '/chat'}>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </div>

        <CampaignFilters onFiltersChange={setFilters} />
        <CampaignList filters={filters} />
      </div>
    </DashboardLayout>
  )
}
