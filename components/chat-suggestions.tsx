"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Target, Calendar, TrendingUp, BarChart3 } from "lucide-react"

interface ChatSuggestionsProps {
  suggestions: string[]
  onSuggestionClick: (suggestion: string) => void
}

const suggestionIcons = [Sparkles, Target, Calendar, TrendingUp, BarChart3]

export function ChatSuggestions({ suggestions, onSuggestionClick }: ChatSuggestionsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="gap-1">
          <Sparkles className="h-3 w-3" />
          Quick Actions
        </Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestionIcons[index % suggestionIcons.length]
          return (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              onClick={() => onSuggestionClick(suggestion)}
              className="gap-2 text-left justify-start"
            >
              <Icon className="h-3 w-3" />
              {suggestion}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
