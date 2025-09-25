"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"

interface CampaignFiltersProps {
  onFiltersChange: (filters: {
    search: string
    status: string
    segment: string
  }) => void
}

export function CampaignFilters({ onFiltersChange }: CampaignFiltersProps) {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [segment, setSegment] = useState("all")

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onFiltersChange({ search: value, status, segment })
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    onFiltersChange({ search, status: value, segment })
  }

  const handleSegmentChange = (value: string) => {
    setSegment(value)
    onFiltersChange({ search, status, segment })
  }

  const clearAllFilters = () => {
    setSearch("")
    setStatus("all")
    setSegment("all")
    onFiltersChange({ search: "", status: "all", segment: "all" })
  }

  const activeFiltersCount = [search, status !== "all", segment !== "all"].filter(Boolean).length

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search campaigns..." 
                className="pl-9" 
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="launched">Launched</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={segment} onValueChange={handleSegmentChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Segment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Segments</SelectItem>
                <SelectItem value="premium">Premium Shoppers</SelectItem>
                <SelectItem value="health">Health Enthusiasts</SelectItem>
                <SelectItem value="couples">Couples 25-40</SelectItem>
                <SelectItem value="fashion">Fashion Forward</SelectItem>
                <SelectItem value="family">Budget Families</SelectItem>
                <SelectItem value="professional">Young Professionals</SelectItem>
                <SelectItem value="senior">Senior Citizens</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="gap-1">
                Active Filters: {activeFiltersCount}
                <X className="h-3 w-3 cursor-pointer" onClick={clearAllFilters} />
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
