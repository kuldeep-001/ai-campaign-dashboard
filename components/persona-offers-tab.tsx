"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Persona, Offer, Campaign } from "@/lib/types"
import { Users, ChevronDown, ChevronUp } from "lucide-react"

interface PersonaOffersTabProps {
  campaign: Campaign
  personas: Persona[]
  onSelectOffer?: (persona: Persona, offer: Offer) => void
  isGeneratingPersonas: boolean
  personasReady: boolean
}

export function PersonaOffersTab({ 
  campaign, 
  personas, 
  onSelectOffer, 
  isGeneratingPersonas, 
  personasReady 
}: PersonaOffersTabProps) {
  const [expandedPersonas, setExpandedPersonas] = useState<Set<string>>(new Set())

  const togglePersonaExpansion = (personaId: string) => {
    setExpandedPersonas(prev => {
      const newSet = new Set(prev)
      if (newSet.has(personaId)) {
        newSet.delete(personaId)
      } else {
        newSet.add(personaId)
      }
      return newSet
    })
  }
  if (isGeneratingPersonas) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Generating persona offers...</p>
        </div>
      </div>
    )
  }

  if (!personasReady || personas.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Persona offers are being prepared...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Persona Offers</h3>
        <Badge variant="secondary" className="gap-1">
          <Users className="h-3 w-3" />
          {personas.length} Personas
        </Badge>
      </div>

      <div className="grid gap-4">
        {personas.map((persona, index) => {
          const isExpanded = expandedPersonas.has(persona.id)
          const offersToShow = isExpanded ? persona.offers : persona.offers?.slice(0, 6)
          const hasMoreOffers = persona.offers && persona.offers.length > 6
          
          return (
            <Card key={persona.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {persona.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-base">{persona.name}</CardTitle>
                    <CardDescription className="text-sm">{persona.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {persona.offers?.length || 0} Offers
                    </Badge>
                    {hasMoreOffers && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePersonaExpansion(persona.id)}
                        className="h-6 px-2 text-xs"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-3 w-3 mr-1" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3 mr-1" />
                            Show All
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {offersToShow?.map((offer, offerIndex) => (
                    <div 
                      key={offer.id} 
                      className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => onSelectOffer?.(persona, offer)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm line-clamp-2">{offer.title}</h4>
                        {offer.discount && (
                          <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">
                            {offer.discount}% off
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {offer.description}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-primary">{offer.value}</span>
                        <span className="text-muted-foreground">{offer.discountType}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
