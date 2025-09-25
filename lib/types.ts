// Campaign and persona types for the AI Campaign Dashboard

export interface Campaign {
  id: string
  title: string
  description: string
  season: string
  festival?: string
  trend?: string
  targetAudience: string
  reach: number
  confidence: number
  status: 'draft' | 'ready' | 'launched' | 'completed'
  createdAt: Date
  updatedAt: Date
  launchedAt?: Date
  content: CampaignContent
  metrics: CampaignMetrics
  personas: Persona[]
  // Additional properties for JSON response compatibility
  contentIdeas?: string[]
  primaryFestivalsOrSeason?: string[]
  channels?: string[]
  suggestedRun?: {
    start: string
    end: string
  }
  // Campaign management fields
  customizations?: any
  launchSettings?: {
    budget?: number
    startDate?: Date
    endDate?: Date
    channels?: string[]
  }
}

export interface CampaignContent {
  headline: string
  subheadline: string
  description: string
  callToAction: string
  keyMessages: string[]
  visualElements: string[]
  tone: string
  brandVoice: string
}

export interface CampaignMetrics {
  expectedCTR: number
  expectedConversionRate: number
  estimatedRevenue: number
  expectedROI: number
  readinessScore: number
  predictedEngagement: number
}

export interface Persona {
  id: string
  name: string
  description: string
  demographics: {
    age: string
    income: string
    location: string
    interests: string[]
  }
  painPoints: string[]
  motivations: string[]
  offers: Offer[]
  preferredChannels: string[]
  messagingTone: string
}

export interface Offer {
  id: string
  title: string
  description: string
  discount?: number
  discountType: 'percentage' | 'fixed' | 'bogo' | 'free_shipping' | 'points' | 'cashback' | 'service' | 'event' | 'access' | 'membership' | 'upgrade' | 'package' | 'challenge' | 'warranty' | 'family' | 'education'
  value: string
  terms: string[]
  urgency?: string
  exclusivity?: string
  callToAction: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type: 'text' | 'campaign' | 'suggestion' | 'personas' | 'offers'
  data?: Campaign | Persona[] | Offer[] | any
}

export interface GeminiResponse {
  campaigns?: Campaign[]
  message: string
  type: 'text' | 'campaign' | 'suggestion' | 'personas' | 'offers'
  data?: any
}

export interface CampaignFilters {
  season?: string
  festival?: string
  trend?: string
  audience?: string
  budget?: string
  duration?: string
}

export interface PersonaOffers {
  campaignId: string
  campaignTitle: string
  personas: Persona[]
}
