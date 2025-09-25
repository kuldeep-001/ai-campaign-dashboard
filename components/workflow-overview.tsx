import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, Target, Palette, Rocket, BarChart3, ChevronRight, Clock, CheckCircle } from "lucide-react"

const workflowSteps = [
  {
    id: 1,
    title: "Generate Campaign Suggestions",
    description: "AI analyzes seasonal trends and generates campaign ideas",
    icon: Calendar,
    status: "completed",
    progress: 100,
    duration: "2-5 min",
  },
  {
    id: 2,
    title: "Select Campaign for Target Segments",
    description: "ML scoring determines best campaigns for user segments",
    icon: Target,
    status: "in-progress",
    progress: 65,
    duration: "3-7 min",
  },
  {
    id: 3,
    title: "Customize Content with AI",
    description: "Generate copy, images, and videos with brand consistency",
    icon: Palette,
    status: "pending",
    progress: 0,
    duration: "10-15 min",
  },
  {
    id: 4,
    title: "Launch & Execute via APIs",
    description: "Deploy campaigns across marketing platforms",
    icon: Rocket,
    status: "pending",
    progress: 0,
    duration: "5-10 min",
  },
  {
    id: 5,
    title: "Monitor & Evaluate Performance",
    description: "Real-time tracking and AI-powered insights",
    icon: BarChart3,
    status: "pending",
    progress: 0,
    duration: "Ongoing",
  },
]

export function WorkflowOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          Campaign Workflow Status
        </CardTitle>
        <CardDescription>Track your AI-powered campaign creation process</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {workflowSteps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card/50">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                step.status === "completed"
                  ? "bg-primary text-primary-foreground"
                  : step.status === "in-progress"
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {step.status === "completed" ? <CheckCircle className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{step.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      step.status === "completed" ? "default" : step.status === "in-progress" ? "secondary" : "outline"
                    }
                  >
                    {step.status === "completed"
                      ? "Complete"
                      : step.status === "in-progress"
                        ? "In Progress"
                        : "Pending"}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {step.duration}
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">{step.description}</p>

              {step.progress > 0 && (
                <div className="space-y-1">
                  <Progress value={step.progress} className="h-2" />
                  <div className="text-xs text-muted-foreground">{step.progress}% complete</div>
                </div>
              )}
            </div>

            {index < workflowSteps.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </div>
        ))}

        <div className="flex justify-between pt-4">
          <Button variant="outline">View Details</Button>
          <Button>Continue Workflow</Button>
        </div>
      </CardContent>
    </Card>
  )
}
