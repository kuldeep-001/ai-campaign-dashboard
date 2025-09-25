"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Campaign } from "@/lib/types"
import { Calendar, DollarSign, Users, Target } from "lucide-react"

interface CampaignCustomizationProps {
  campaign: Campaign | null
  isOpen: boolean
  onClose: () => void
  onSave: (customizations: any) => void
}

export function CampaignCustomization({ 
  campaign, 
  isOpen, 
  onClose, 
  onSave 
}: CampaignCustomizationProps) {
  const [customizations, setCustomizations] = useState({
    budget: campaign?.launchSettings?.budget || 5000,
    startDate: campaign?.launchSettings?.startDate ? new Date(campaign.launchSettings.startDate).toISOString().split('T')[0] : '',
    endDate: campaign?.launchSettings?.endDate ? new Date(campaign.launchSettings.endDate).toISOString().split('T')[0] : '',
    channels: campaign?.launchSettings?.channels || ['Email', 'Social'],
    targetAudience: campaign?.targetAudience || '',
    description: campaign?.description || '',
  })

  if (!campaign) return null

  const handleSave = () => {
    onSave({
      ...customizations,
      budget: Number(customizations.budget),
      startDate: new Date(customizations.startDate),
      endDate: new Date(customizations.endDate),
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Customize Campaign: {campaign.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Budget
            </Label>
            <Input
              id="budget"
              type="number"
              value={customizations.budget}
              onChange={(e) => setCustomizations(prev => ({ ...prev, budget: Number(e.target.value) }))}
              placeholder="Enter campaign budget"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={customizations.startDate}
                onChange={(e) => setCustomizations(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={customizations.endDate}
                onChange={(e) => setCustomizations(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>

          {/* Channels */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Channels
            </Label>
            <Select 
              value={customizations.channels[0]} 
              onValueChange={(value) => setCustomizations(prev => ({ ...prev, channels: [value] }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select primary channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="SMS">SMS</SelectItem>
                <SelectItem value="Social">Social Media</SelectItem>
                <SelectItem value="Display">Display Ads</SelectItem>
                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Target Audience */}
          <div className="space-y-2">
            <Label htmlFor="audience" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Target Audience
            </Label>
            <Input
              id="audience"
              value={customizations.targetAudience}
              onChange={(e) => setCustomizations(prev => ({ ...prev, targetAudience: e.target.value }))}
              placeholder="Describe your target audience"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Campaign Description</Label>
            <Textarea
              id="description"
              value={customizations.description}
              onChange={(e) => setCustomizations(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your campaign"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Customizations
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
