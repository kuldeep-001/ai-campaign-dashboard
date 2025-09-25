import { DashboardLayout } from "@/components/dashboard-layout"
import { WorkflowOverview } from "@/components/workflow-overview"
import { CampaignStats } from "@/components/campaign-stats"
import { RecentCampaigns } from "@/components/recent-campaigns"
import { QuickActions } from "@/components/quick-actions"

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">AI Campaign Manager</h1>
            <p className="text-muted-foreground text-pretty">
              Manage your generative AI seasonal lifestyle campaigns with intelligent automation
            </p>
          </div>
          <QuickActions />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <CampaignStats />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <WorkflowOverview />
          </div>
          <div>
            <RecentCampaigns />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
