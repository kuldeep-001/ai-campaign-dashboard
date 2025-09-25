"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, ChevronLeft, Sparkles, Target, Palette, Rocket, BarChart3 } from "lucide-react"
import { CampaignSuggestions } from "./campaign-suggestions"
import { SegmentSelection } from "./segment-selection"
import { ContentCustomization } from "./content-customization"
import { LaunchSettings } from "./launch-settings"
import { PerformanceSetup } from "./performance-setup"

const steps = [
  {
    id: "suggestions",
    title: "Generate Suggestions",
    description: "AI analyzes seasonal trends",
    icon: Sparkles,
  },
  {
    id: "segments",
    title: "Select Segments",
    description: "Choose target audiences",
    icon: Target,
  },
  {
    id: "content",
    title: "Customize Content",
    description: "Generate copy and visuals",
    icon: Palette,
  },
  {
    id: "launch",
    title: "Launch Settings",
    description: "Configure deployment",
    icon: Rocket,
  },
  {
    id: "monitoring",
    title: "Setup Monitoring",
    description: "Track performance",
    icon: BarChart3,
  },
]

export function CampaignWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps([...completedSteps, currentStep])
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= Math.max(...completedSteps, -1) + 1) {
      setCurrentStep(stepIndex)
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Campaign Creation Workflow</CardTitle>
              <CardDescription>
                Step {currentStep + 1} of {steps.length}
              </CardDescription>
            </div>
            <Badge variant="secondary">{Math.round(progress)}% Complete</Badge>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Step Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => handleStepClick(index)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    index === currentStep
                      ? "bg-primary text-primary-foreground"
                      : completedSteps.includes(index)
                        ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        : "text-muted-foreground hover:bg-muted"
                  } ${
                    index <= Math.max(...completedSteps, -1) + 1 ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                  }`}
                  disabled={index > Math.max(...completedSteps, -1) + 1}
                >
                  <step.icon className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium text-sm">{step.title}</div>
                    <div className="text-xs opacity-75">{step.description}</div>
                  </div>
                </button>
                {index < steps.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="min-h-[600px]">
        {currentStep === 0 && <CampaignSuggestions />}
        {currentStep === 1 && <SegmentSelection />}
        {currentStep === 2 && <ContentCustomization />}
        {currentStep === 3 && <LaunchSettings />}
        {currentStep === 4 && <PerformanceSetup />}
      </div>

      {/* Navigation Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
            <Button onClick={handleNext} disabled={currentStep === steps.length - 1}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
