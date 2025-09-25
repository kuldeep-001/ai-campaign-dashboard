import { Button } from "@/components/ui/button"
import { Bot, Calendar, Target } from "lucide-react"

export function QuickActions() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm">
        <Calendar className="h-4 w-4 mr-2" />
        Schedule
      </Button>
      <Button variant="outline" size="sm">
        <Target className="h-4 w-4 mr-2" />
        Segments
      </Button>
      <Button size="sm">
        <Bot className="h-4 w-4 mr-2" />
        AI Chat
      </Button>
    </div>
  )
}
