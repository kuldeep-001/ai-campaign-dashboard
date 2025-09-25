"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Persona, Offer, Campaign } from "@/lib/types"
import { Users, Target, TrendingUp, Clock, Gift, Star, CheckCircle, X } from "lucide-react"

interface PersonaOffersProps {
  campaign: Campaign
  personas: Persona[]
  onSelectOffer: (persona: Persona, offer: Offer) => void
  onClose: () => void
  isLoading?: boolean
}

export function PersonaOffers({ campaign, personas, onSelectOffer, onClose, isLoading = false }: PersonaOffersProps) {
  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Persona Offers</h3>
            <p className="text-sm text-muted-foreground">{campaign.title}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">Generating persona offers...</p>
            </div>
          </div>
        ) : personas.length > 0 ? (
          <Tabs defaultValue="persona-0" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-5 mx-4 mt-4">
              {personas.map((persona, index) => (
                <TabsTrigger key={persona.id} value={`persona-${index}`} className="text-xs">
                  {persona.name.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex-1 p-4">
              {personas.map((persona, index) => (
                <TabsContent key={persona.id} value={`persona-${index}`} className="space-y-4">
                  <PersonaCard persona={persona} onSelectOffer={onSelectOffer} />
                </TabsContent>
              ))}
            </div>
          </Tabs>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">No persona offers available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PersonaCard({ persona, onSelectOffer }: { persona: Persona; onSelectOffer: (persona: Persona, offer: Offer) => void }) {
  return (
    <div className="space-y-4">
      {/* Persona Info */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-lg">{persona.name}</CardTitle>
              <CardDescription className="mt-1">{persona.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Demographics */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Age</div>
                <div className="text-muted-foreground">{persona.demographics.age}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Income</div>
                <div className="text-muted-foreground">{persona.demographics.income}</div>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div>
            <h4 className="font-medium text-sm mb-2">Interests</h4>
            <div className="flex flex-wrap gap-1">
              {persona.demographics.interests.map((interest, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          {/* Pain Points & Motivations */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <h4 className="font-medium text-sm mb-1">Pain Points</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {persona.painPoints.map((point, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-1">Motivations</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {persona.motivations.map((motivation, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                    {motivation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offers */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Tailored Offers</h3>
        {persona.offers.map((offer) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            persona={persona}
            onSelect={() => onSelectOffer(persona, offer)}
          />
        ))}
      </div>
    </div>
  )
}

function OfferCard({ offer, persona, onSelect }: { offer: Offer; persona: Persona; onSelect: () => void }) {
  const getDiscountBadge = () => {
    if (offer.discount) {
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          {offer.discount}% OFF
        </Badge>
      )
    }
    if (offer.discountType === 'bogo') {
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600">
          BOGO
        </Badge>
      )
    }
    if (offer.discountType === 'free_shipping') {
      return (
        <Badge className="bg-purple-500 hover:bg-purple-600">
          FREE SHIPPING
        </Badge>
      )
    }
    return null
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base flex items-center gap-2">
              {offer.title}
              {offer.exclusivity && (
                <Badge variant="secondary" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  {offer.exclusivity}
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-1">{offer.description}</CardDescription>
          </div>
          {getDiscountBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Value Proposition */}
        <div className="flex items-center gap-2 text-sm">
          <Gift className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{offer.value}</span>
        </div>

        {/* Terms */}
        {offer.terms && offer.terms.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Terms & Conditions</h4>
            <ul className="space-y-1">
              {offer.terms.map((term, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  {term}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Urgency */}
        {offer.urgency && (
          <div className="flex items-center gap-2 text-sm text-orange-600">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{offer.urgency}</span>
          </div>
        )}

        {/* CTA Button */}
        <Button onClick={onSelect} className="w-full">
          {offer.callToAction}
        </Button>
      </CardContent>
    </Card>
  )
}
