import { DashboardLayout } from "@/components/dashboard-layout"
import { CampaignWizard } from "@/components/campaign-wizard"

export default function GeneratePage() {
  return (
    <DashboardLayout>
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-balance">Generate New Campaign</h1>
            <p className="text-muted-foreground text-pretty">
              Use AI to create seasonal lifestyle campaigns tailored to your target segments
            </p>
          </div>
          <CampaignWizard />
        </div>
      </div>
    </DashboardLayout>
  )
}
