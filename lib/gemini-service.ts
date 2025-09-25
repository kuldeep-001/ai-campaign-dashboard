import { GoogleGenerativeAI } from '@google/generative-ai'
import { Campaign, Persona, Offer, GeminiResponse, CampaignFilters } from './types'

export class GeminiService {
  private getApiKey(): string {
    const apiKey = "AIzaSyChIFlkGJl2-JK0C1DjJTawnb4VG6xiHMQ"
    console.log('Gemini API Key loaded:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND')
    return apiKey
  }

  private getModel() {
    const apiKey = this.getApiKey()
    if (!apiKey) {
      throw new Error('Gemini API key not configured')
    }
    const genAI = new GoogleGenerativeAI(apiKey)
    return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  }

  async generateCampaigns(query: string, filters?: CampaignFilters): Promise<GeminiResponse> {
    try {
      const model = this.getModel()
      const prompt = this.buildCampaignPrompt(query, filters)
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      return this.parseCampaignResponse(text, query)
    } catch (error) {
      console.error('Error generating campaigns:', error)
      return {
        message: 'Sorry, I encountered an error while generating campaigns. Please try again.',
        type: 'text'
      }
    }
  }

  async generatePersonaOffers(campaign: Campaign): Promise<Persona[]> {
    try {
      console.log('🎯 Building persona offers prompt for campaign:', campaign.title)
      console.log('📅 Campaign season/festival:', campaign.season || campaign.primaryFestivalsOrSeason?.[0] || 'General season')
      console.log('👥 Target audience:', campaign.targetAudience)
      const model = this.getModel()
      const prompt = this.buildPersonaOffersPrompt(campaign)
      console.log('📝 Generated prompt length:', prompt.length)
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      console.log('Received response from Gemini:', text.substring(0, 200) + '...')
      
      const personas = this.parsePersonaOffersResponse(text, campaign)
      console.log('Parsed personas count:', personas.length)
      return personas
    } catch (error) {
      console.error('Error generating persona offers:', error)
      console.log('Falling back to default personas')
      return this.getDefaultPersonas(campaign)
    }
  }

  async chatResponse(message: string, context?: any): Promise<GeminiResponse> {
    try {
      console.log('Attempting to call Gemini API...')
      const model = this.getModel()
      const prompt = this.buildChatPrompt(message, context)
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      return this.parseChatResponse(text, message)
    } catch (error) {
      console.error('Error generating chat response:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Error details:', {
        message: errorMessage,
        status: (error as any)?.status,
        code: (error as any)?.code
      })
      return {
        message: `I apologize, but I encountered an error: ${errorMessage}. Please check your API key configuration.`,
        type: 'text'
      }
    }
  }

  private buildCampaignPrompt(query: string, filters?: CampaignFilters): string {
    const season = filters?.season || 'current season'
    const festival = filters?.festival || 'relevant festivals'
    const trend = filters?.trend || 'current trends'
    
    return `You are an expert marketing strategist and campaign creator. Generate 3-5 detailed marketing campaigns based on the user's request.

User Query: "${query}"
Season: ${season}
Festival: ${festival}
Trend: ${trend}

For each campaign, provide a JSON response with the following structure:
{
  "campaigns": [
    {
      "id": "unique_id",
      "title": "Campaign Title",
      "description": "Detailed campaign description",
      "season": "season_name",
      "festival": "festival_name_if_applicable",
      "trend": "trend_name_if_applicable",
      "targetAudience": "audience_description",
      "reach": estimated_reach_number,
      "confidence": confidence_percentage,
      "status": "ready",
      "content": {
        "headline": "Compelling headline",
        "subheadline": "Supporting subheadline",
        "description": "Campaign description",
        "callToAction": "Clear CTA",
        "keyMessages": ["message1", "message2", "message3"],
        "visualElements": ["element1", "element2"],
        "tone": "tone_description",
        "brandVoice": "brand_voice_description"
      },
      "metrics": {
        "expectedCTR": percentage,
        "expectedConversionRate": percentage,
        "estimatedRevenue": revenue_number,
        "expectedROI": roi_percentage,
        "readinessScore": readiness_percentage,
        "predictedEngagement": engagement_score
      }
    }
  ],
  "message": "Summary message about the generated campaigns",
  "type": "campaign"
}

Make the campaigns creative, data-driven, and tailored to the specific query. Include seasonal elements, trending topics, and relevant festivals when applicable.`
  }

  private buildPersonaOffersPrompt(campaign: Campaign): string {
    const keyMessages = campaign.content?.keyMessages || campaign.contentIdeas || ['General campaign message']
    const season = campaign.season || campaign.primaryFestivalsOrSeason?.[0] || 'General season'
    
    return `You are an expert in customer personas and offer creation for Indian marketing campaigns. Based on the campaign "${campaign.title}", create 5 different personas with tailored offers.

Campaign Details:
- Title: ${campaign.title}
- Description: ${campaign.description}
- Target Audience: ${campaign.targetAudience}
- Season/Festival: ${season}
- Key Messages: ${keyMessages.join(', ')}
- Channels: ${campaign.channels?.join(', ') || 'Email, SMS, Social'}

Create 5 diverse personas with different demographics, interests, and pain points. Each persona MUST have exactly 12 tailored offers that align with the campaign and Indian market preferences. Do not return fewer than 12 offers per persona.

Return JSON in this format:
{
  "personas": [
    {
      "id": "persona_1",
      "name": "Persona Name",
      "description": "Detailed persona description",
      "demographics": {
        "age": "age_range",
        "income": "income_range",
        "location": "location_type",
        "interests": ["interest1", "interest2", "interest3"]
      },
      "painPoints": ["pain1", "pain2"],
      "motivations": ["motivation1", "motivation2"],
      "offers": [
        {
          "id": "offer_1",
          "title": "Offer Title",
          "description": "Offer description",
          "discount": discount_percentage,
          "discountType": "percentage",
          "value": "value_proposition",
          "terms": ["term1", "term2"],
          "urgency": "urgency_text",
          "callToAction": "CTA text"
        }
      ],
      "preferredChannels": ["channel1", "channel2"],
      "messagingTone": "tone_description"
    }
  ]
}

Make personas diverse and realistic, with offers that genuinely appeal to each persona's specific needs and motivations. Focus on Indian market preferences and cultural context.`
  }

  private buildChatPrompt(message: string, context?: any): string {
    return `You are "Campaign Planner AI" embedded in the CampaignAI chat.
Goal: help the user plan, preview, customize, and launch seasonal/festival marketing campaigns for India.

Timezone: Asia/Kolkata (IST). Today: ${new Date().toISOString().split('T')[0]}.

========================
USER INTENTS YOU SUPPORT
========================
1) SuggestCampaigns
   The user asks for ideas within a date window/count/focus (e.g., "4 campaigns between Oct 2025–Jan 2026 for Indian festivals").
   • Filter seeded campaigns that overlap the window and focus.
   • If fewer than requested, synthesize extras aligned to Indian seasons/festivals (source="generated").
   • Return (A) a concise human table and (B) a machine JSON payload.

2) CampaignDetails
   The user selects/asks about one campaign (by id/title).
   • Produce a brief (goal, audience, channels, key dates) and a 5-persona × 12-offers matrix (total 60 offers).
   • Use seeded offers first (convert dates dd/MM/yyyy → ISO). If needed, synthesize the rest (source="generated").
   • Keep offer availability within the campaign's suggested run where possible.
   • Return (A) human brief + matrix and (B) machine JSON.

3) CustomizeCampaign (optional free-text edits)
   The user requests changes (dates, channels, audience, copy ideas).
   • Apply edits to the last selected campaign context.
   • Return updated summary + JSON diff.

4) LaunchCampaign (user says "launch"/"go live")
   • Recommend final run dates and checklist.
   • Return JSON with "status":"ready_to_launch"; the app will actually mark status="active" after API success.

========================
OUTPUT CONTRACTS (STRICT)
========================

A) SuggestCampaigns
Human (table with EXACT columns):
| ID | Campaign Name | Suggested Run (dd MMM yyyy – dd MMM yyyy) | Primary Festivals/Season | Target Audience | Confidence | Source |

Machine (single fenced JSON):
{
  "intent": "SuggestCampaigns",
  "campaigns": [
    {
      "id": "string",
      "title": "string",
      "suggestedRun": { "start": "YYYY-MM-DD", "end": "YYYY-MM-DD" },
      "primaryFestivalsOrSeason": ["string"],
      "targetAudience": "string",
      "confidence": number,
      "source": "dummy"|"generated",
      "rationale": "≤200 chars",
      "channels": string[],
      "contentIdeas": string[]
    }
  ],
  "notes": "cultural/privacy alignment notes if any"
}

B) CampaignDetails
Human:
- Brief (bullets): goal, audience, channels, key dates (preheat/main/remarketing)
- Offers Matrix table: columns = Persona 1..5, rows = 5 offers.
  Each cell lines:
  • Offer Title
  • Product/Category
  • Value
  • Channel
  • Personalization Note
  • Availability (dd MMM yyyy – dd MMM yyyy)

Machine (single fenced JSON):
{
  "intent": "CampaignDetails",
  "campaign": {
    "id": "string",
    "title": "string",
    "suggestedRun": { "start": "YYYY-MM-DD", "end": "YYYY-MM-DD" },
    "goals": ["string"],
    "audience": "string",
    "channels": ["Email","SMS","Push","Social","Display","WhatsApp"],
    "timing": { "preheatDays": number, "mainBurstDays": number, "remarketingDays": number }
  },
  "personas": [
    {"id":"p1","name":"High-Value Loyalists","traits":["AOV high","frequent buyers"]},
    {"id":"p2","name":"Budget Families","traits":["value-seeking","family needs"]},
    {"id":"p3","name":"Young Professionals","traits":["urban","convenience-first"]},
    {"id":"p4","name":"Students & Gen Z","traits":["price-sensitive","social-first"]},
    {"id":"p5","name":"Regional/Cultural Shoppers","traits":["festival-led","regional tastes"]}
  ],
  "offersByPersona": {
    "p1": [ PersonaOfferView x5 ],
    "p2": [ x5 ],
    "p3": [ x5 ],
    "p4": [ x5 ],
    "p5": [ x5 ]
  },
  "preview": {
    "hero": { "headline": "string", "sub": "string", "cta": "string" },
    "kpis": ["CTR","CVR","ROAS","Segment Lift"]
  },
  "status": "draft"
}

========================
GUARDRAILS & STYLE
========================
- India-first cultural alignment; avoid stereotypes.
- No PII; lawful segmenting only.
- Deterministic columns/keys; exactly ONE fenced JSON block per reply.
- Be concise for human text; keep rationales ≤200 chars.
- If the user asks to launch, return JSON with "status":"ready_to_launch" and recommended run; the app will set status="active" after APIs succeed.

User Message: "${message}"

Context: ${context ? JSON.stringify(context) : 'None'}

Respond as the Campaign Planner AI following the exact specifications above.`
  }

  private parseCampaignResponse(text: string, query: string): GeminiResponse {
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          campaigns: parsed.campaigns,
          message: parsed.message || `I've created ${parsed.campaigns?.length || 0} campaigns based on your request: "${query}"`,
          type: 'campaign',
          data: parsed.campaigns
        }
      }
    } catch (error) {
      console.error('Error parsing campaign response:', error)
    }

    return {
      message: `I've analyzed your request about "${query}" and can help create campaigns. Let me know more specific details about what you're looking for.`,
      type: 'text'
    }
  }

  private parsePersonaOffersResponse(text: string, campaign: Campaign): Persona[] {
    try {
      console.log('Parsing persona offers response...')
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        console.log('Parsed JSON:', parsed)
        
        if (parsed.personas && Array.isArray(parsed.personas)) {
          console.log('Found personas:', parsed.personas.length)
          
          // Ensure each persona has 12 offers, but prioritize AI-generated content
          const personasWithFullOffers = parsed.personas.map((persona: any, index: number) => {
            const defaultPersona = this.getDefaultPersonas(campaign)[index] || this.getDefaultPersonas(campaign)[0]
            
            // Use AI-generated persona as base, only fall back to defaults for missing fields
            return {
              ...defaultPersona, // Default structure
              ...persona, // AI-generated content (overrides defaults)
              offers: persona.offers && persona.offers.length >= 12 ? persona.offers : 
                     persona.offers && persona.offers.length > 0 ? 
                       [...persona.offers, ...defaultPersona.offers.slice(persona.offers.length, 12)] :
                       defaultPersona.offers
            }
          })
          
          console.log('✅ Final personas for campaign:', campaign.title)
          console.log('👥 Persona names:', personasWithFullOffers.map((p: Persona) => p.name))
          console.log('📊 Persona offer counts:', personasWithFullOffers.map((p: Persona) => ({ name: p.name, offerCount: p.offers.length })))
          return personasWithFullOffers
        }
      }
    } catch (error) {
      console.error('Error parsing persona offers response:', error)
    }

    console.log('Falling back to default personas')
    return this.getDefaultPersonas(campaign)
  }

  private parseChatResponse(text: string, message: string): GeminiResponse {
    try {
      // Look for JSON blocks in the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        
        // Handle different intent types
        if (parsed.intent === 'SuggestCampaigns') {
          return {
            message: `I've found ${parsed.campaigns.length} campaign suggestions for you. Click on any campaign to view details and launch it.`,
            type: 'campaign',
            data: parsed.campaigns // Pass campaigns array directly
          }
        } else if (parsed.intent === 'CampaignDetails') {
          return {
            message: `Here are the detailed campaign specifications and persona offers.`,
            type: 'campaign',
            data: parsed
          }
        } else if (parsed.intent === 'LaunchCampaign') {
          return {
            message: text,
            type: 'text',
            data: parsed
          }
        } else {
          return {
            message: text,
            type: 'text',
            data: parsed
          }
        }
      }
    } catch (error) {
      console.error('Error parsing chat response:', error)
    }

    return {
      message: text,
      type: 'text'
    }
  }

  private formatCampaignSuggestionsTable(campaigns: any[]): string {
    let table = '| ID | Campaign Name | Suggested Run (dd MMM yyyy – dd MMM yyyy) | Primary Festivals/Season | Target Audience | Confidence | Source |\n'
    table += '|----|---------------|-------------------------------------------|-------------------------|-----------------|------------|--------|\n'
    
    campaigns.forEach(campaign => {
      const startDate = new Date(campaign.suggestedRun.start).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      const endDate = new Date(campaign.suggestedRun.end).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      const runPeriod = `${startDate} – ${endDate}`
      const festivals = campaign.primaryFestivalsOrSeason.join(', ')
      
      table += `| ${campaign.id} | ${campaign.title} | ${runPeriod} | ${festivals} | ${campaign.targetAudience} | ${campaign.confidence}% | ${campaign.source} |\n`
    })
    
    return table
  }

  private formatCampaignDetails(details: any): string {
    let result = `**Campaign Brief:**\n`
    result += `• **Goal:** ${details.campaign.goals.join(', ')}\n`
    result += `• **Audience:** ${details.campaign.audience}\n`
    result += `• **Channels:** ${details.campaign.channels.join(', ')}\n`
    result += `• **Timing:** ${details.campaign.timing.preheatDays} days preheat, ${details.campaign.timing.mainBurstDays} days main, ${details.campaign.timing.remarketingDays} days remarketing\n\n`
    
    result += `**Offers Matrix:**\n`
    result += `| | High-Value Loyalists | Budget Families | Young Professionals | Students & Gen Z | Regional/Cultural Shoppers |\n`
    result += `|---|-------------------|-----------------|-------------------|------------------|---------------------------|\n`
    
    // Create 5 rows of offers (one for each persona)
    for (let i = 0; i < 5; i++) {
      let row = `| **Offer ${i + 1}** |`
      
      details.personas.forEach((persona: any) => {
        const offers = details.offersByPersona[persona.id] || []
        const offer = offers[i] || {}
        
        if (offer.title) {
          const startDate = new Date(offer.availability?.start || details.campaign.suggestedRun.start).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          const endDate = new Date(offer.availability?.end || details.campaign.suggestedRun.end).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          
          row += ` ${offer.title}<br/>${offer.product || 'N/A'}<br/>${offer.value || 'N/A'}<br/>${offer.channel || 'N/A'}<br/>${offer.personalization || 'N/A'}<br/>${startDate} – ${endDate} |`
        } else {
          row += ` - |`
        }
      })
      
      result += row + '\n'
    }
    
    return result
  }

  getDefaultPersonas(campaign: Campaign): Persona[] {
    // Create campaign-specific default personas
    const campaignTheme = campaign.title?.toLowerCase() || 'general'
    const season = campaign.season || campaign.primaryFestivalsOrSeason?.[0] || 'General season'
    
    return [
      {
        id: 'persona_1',
        name: `The ${season} Enthusiast`,
        description: `Tech-savvy ${season} enthusiast who values experiences and seasonal celebrations`,
        demographics: {
          age: '25-35',
          income: '$50K-$80K',
          location: 'Urban',
          interests: ['Technology', 'Sustainability', 'Social Media', 'Travel']
        },
        painPoints: ['FOMO', 'Budget constraints', 'Time management'],
        motivations: ['Social status', 'Personal growth', 'Environmental impact'],
        offers: [
          {
            id: 'offer_1',
            title: 'Early Bird Special',
            description: 'Get 20% off when you book early',
            discount: 20,
            discountType: 'percentage',
            value: 'Save up to $100',
            terms: ['Valid for 48 hours', 'New customers only'],
            urgency: 'Limited time offer',
            callToAction: 'Book Now & Save'
          },
          {
            id: 'offer_2',
            title: 'Social Media Exclusive',
            description: 'Follow us for special discounts',
            discount: 15,
            discountType: 'percentage',
            value: 'Exclusive social offers',
            terms: ['Must follow on Instagram', 'Valid for 7 days'],
            callToAction: 'Follow & Save'
          },
          {
            id: 'offer_3',
            title: 'Referral Bonus',
            description: 'Refer friends and earn rewards',
            discountType: 'bogo',
            value: 'Get 1 free for every 2 referrals',
            terms: ['Valid referrals only', 'Maximum 5 per month'],
            callToAction: 'Refer & Earn'
          },
          {
            id: 'offer_4',
            title: 'Student Discount',
            description: 'Special rates for students',
            discount: 25,
            discountType: 'percentage',
            value: 'Student exclusive pricing',
            terms: ['Valid student ID required', 'First-time students only'],
            callToAction: 'Verify & Save'
          },
          {
            id: 'offer_5',
            title: 'Bundle Deal',
            description: 'Buy more, save more',
            discount: 30,
            discountType: 'percentage',
            value: 'Up to 30% off bundles',
            terms: ['Minimum 3 items', 'Valid for 30 days'],
            callToAction: 'Bundle & Save'
          },
          {
            id: 'offer_6',
            title: 'Flash Sale',
            description: 'Limited time flash sale',
            discount: 40,
            discountType: 'percentage',
            value: 'Flash sale pricing',
            terms: ['Limited quantities', 'Valid for 2 hours only'],
            urgency: 'Flash sale ends soon',
            callToAction: 'Shop Now'
          },
          {
            id: 'offer_7',
            title: 'Loyalty Rewards',
            description: 'Earn points with every purchase',
            discountType: 'points',
            value: '1000 points = $10 off',
            terms: ['Points expire in 1 year', 'Minimum 500 points to redeem'],
            callToAction: 'Join Loyalty Program'
          },
          {
            id: 'offer_8',
            title: 'Free Shipping',
            description: 'Free delivery on all orders',
            discountType: 'free_shipping',
            value: 'Free shipping nationwide',
            terms: ['No minimum order', 'Valid for 7 days'],
            callToAction: 'Shop with Free Shipping'
          },
          {
            id: 'offer_9',
            title: 'Seasonal Special',
            description: 'Special seasonal pricing',
            discount: 20,
            discountType: 'percentage',
            value: 'Seasonal discount',
            terms: ['Limited time only', 'While supplies last'],
            callToAction: 'Get Seasonal Deal'
          },
          {
            id: 'offer_10',
            title: 'New Customer Welcome',
            description: 'Welcome bonus for new customers',
            discount: 50,
            discountType: 'percentage',
            value: '50% off first order',
            terms: ['New customers only', 'Maximum $50 discount'],
            callToAction: 'Welcome Offer'
          },
          {
            id: 'offer_11',
            title: 'VIP Access',
            description: 'Exclusive VIP member benefits',
            discount: 35,
            discountType: 'percentage',
            value: 'VIP member pricing',
            terms: ['VIP membership required', 'Valid for 1 year'],
            callToAction: 'Join VIP'
          },
          {
            id: 'offer_12',
            title: 'Cashback Rewards',
            description: 'Earn cashback on purchases',
            discount: 10,
            discountType: 'cashback',
            value: '10% cashback',
            terms: ['Cashback credited in 30 days', 'Minimum $25 purchase'],
            callToAction: 'Earn Cashback'
          }
        ],
        preferredChannels: ['Instagram', 'TikTok', 'Email'],
        messagingTone: 'Casual, trendy, authentic'
      },
      {
        id: 'persona_2',
        name: `The ${season} Luxury Shopper`,
        description: `High-income professional who values quality and exclusive ${season} experiences`,
        demographics: {
          age: '35-50',
          income: '$100K+',
          location: 'Suburban/Urban',
          interests: ['Luxury goods', 'Fine dining', 'Travel', 'Art']
        },
        painPoints: ['Time scarcity', 'Quality assurance', 'Exclusivity'],
        motivations: ['Status', 'Quality', 'Exclusivity', 'Convenience'],
        offers: [
          {
            id: 'offer_1',
            title: 'VIP Exclusive Access',
            description: 'Priority access to limited edition items',
            discountType: 'bogo',
            value: 'Buy one, get one free',
            terms: ['VIP members only', 'While supplies last'],
            exclusivity: 'VIP exclusive',
            callToAction: 'Claim VIP Access'
          },
          {
            id: 'offer_2',
            title: 'Premium Collection',
            description: 'Access to premium product line',
            discount: 25,
            discountType: 'percentage',
            value: 'Premium member pricing',
            terms: ['VIP membership required', 'Limited quantities'],
            callToAction: 'Shop Premium'
          },
          {
            id: 'offer_3',
            title: 'Concierge Service',
            description: 'Personal shopping assistance',
            discountType: 'service',
            value: 'Free personal consultation',
            terms: ['VIP members only', 'By appointment only'],
            callToAction: 'Book Consultation'
          },
          {
            id: 'offer_4',
            title: 'Exclusive Events',
            description: 'Invitation to exclusive events',
            discountType: 'event',
            value: 'VIP event access',
            terms: ['Members only', 'Limited seating'],
            callToAction: 'RSVP Now'
          },
          {
            id: 'offer_5',
            title: 'Luxury Gift Wrapping',
            description: 'Complimentary premium gift wrapping',
            discountType: 'service',
            value: 'Free luxury wrapping',
            terms: ['Minimum $200 purchase', 'Valid for 30 days'],
            callToAction: 'Add Gift Wrapping'
          },
          {
            id: 'offer_6',
            title: 'Priority Shipping',
            description: 'Expedited delivery service',
            discountType: 'service',
            value: 'Free express shipping',
            terms: ['VIP members only', 'Within 24 hours'],
            callToAction: 'Express Delivery'
          },
          {
            id: 'offer_7',
            title: 'Exclusive Preview',
            description: 'Early access to new collections',
            discountType: 'access',
            value: 'First to shop new arrivals',
            terms: ['VIP members only', 'Limited time'],
            callToAction: 'Preview Collection'
          },
          {
            id: 'offer_8',
            title: 'Personal Stylist',
            description: 'Free personal styling service',
            discountType: 'service',
            value: 'Complimentary styling',
            terms: ['VIP members only', 'In-store only'],
            callToAction: 'Book Styling'
          },
          {
            id: 'offer_9',
            title: 'Luxury Rewards',
            description: 'Enhanced loyalty program benefits',
            discountType: 'points',
            value: '2x points on all purchases',
            terms: ['VIP members only', 'Points never expire'],
            callToAction: 'Join VIP Rewards'
          },
          {
            id: 'offer_10',
            title: 'Exclusive Discounts',
            description: 'Members-only pricing on select items',
            discount: 30,
            discountType: 'percentage',
            value: 'VIP member pricing',
            terms: ['VIP members only', 'Selected items'],
            callToAction: 'Shop VIP Prices'
          },
          {
            id: 'offer_11',
            title: 'Complimentary Alterations',
            description: 'Free tailoring services',
            discountType: 'service',
            value: 'Free alterations',
            terms: ['VIP members only', 'Valid for 60 days'],
            callToAction: 'Schedule Alterations'
          },
          {
            id: 'offer_12',
            title: 'Exclusive Accessories',
            description: 'Access to limited edition accessories',
            discountType: 'access',
            value: 'Exclusive accessory collection',
            terms: ['VIP members only', 'While supplies last'],
            callToAction: 'Shop Accessories'
          }
        ],
        preferredChannels: ['Email', 'Direct mail', 'Concierge'],
        messagingTone: 'Sophisticated, exclusive, premium'
      },
      {
        id: 'persona_3',
        name: `The ${season} Family Planner`,
        description: `Price-sensitive families looking for value and practical ${season} celebrations`,
        demographics: {
          age: '30-45',
          income: '$40K-$70K',
          location: 'Suburban',
          interests: ['Family activities', 'Budgeting', 'Home improvement', 'Education']
        },
        painPoints: ['Budget constraints', 'Family needs', 'Value for money'],
        motivations: ['Family wellbeing', 'Savings', 'Practicality', 'Reliability'],
        offers: [
          {
            id: 'offer_1',
            title: 'Family Bundle Deal',
            description: 'Special family package with maximum savings',
            discount: 30,
            discountType: 'percentage',
            value: 'Save up to $200 for the whole family',
            terms: ['Family of 4+', 'Valid for 30 days'],
            callToAction: 'Get Family Deal'
          },
          {
            id: 'offer_2',
            title: 'Kids Eat Free',
            description: 'Free kids meals with adult purchase',
            discountType: 'bogo',
            value: 'Kids eat free',
            terms: ['One child per adult', 'Valid for 7 days'],
            callToAction: 'Family Dining'
          },
          {
            id: 'offer_3',
            title: 'Bulk Purchase Discount',
            description: 'Save more when you buy in bulk',
            discount: 25,
            discountType: 'percentage',
            value: 'Up to 25% off bulk orders',
            terms: ['Minimum 5 items', 'Valid for 60 days'],
            callToAction: 'Buy in Bulk'
          },
          {
            id: 'offer_4',
            title: 'Family Membership',
            description: 'Annual family membership benefits',
            discountType: 'membership',
            value: 'Family membership perks',
            terms: ['Valid for 1 year', 'Up to 6 family members'],
            callToAction: 'Join Family Plan'
          },
          {
            id: 'offer_5',
            title: 'Weekend Special',
            description: 'Special weekend family pricing',
            discount: 20,
            discountType: 'percentage',
            value: 'Weekend family discount',
            terms: ['Weekends only', 'Family of 3+'],
            callToAction: 'Weekend Deal'
          },
          {
            id: 'offer_6',
            title: 'Educational Discount',
            description: 'Special rates for educational purchases',
            discount: 15,
            discountType: 'percentage',
            value: 'Educational pricing',
            terms: ['Valid school ID required', 'Educational items only'],
            callToAction: 'Verify Education'
          },
          {
            id: 'offer_7',
            title: 'Family Rewards',
            description: 'Earn points for family purchases',
            discountType: 'points',
            value: 'Family loyalty points',
            terms: ['Points shared across family', 'Never expire'],
            callToAction: 'Join Family Rewards'
          },
          {
            id: 'offer_8',
            title: 'Free Home Delivery',
            description: 'Complimentary home delivery',
            discountType: 'free_shipping',
            value: 'Free delivery to your door',
            terms: ['Minimum $50 order', 'Within 10km radius'],
            callToAction: 'Home Delivery'
          },
          {
            id: 'offer_9',
            title: 'Family Size Upgrade',
            description: 'Free size upgrade for family orders',
            discountType: 'upgrade',
            value: 'Free size upgrade',
            terms: ['Family orders only', 'While supplies last'],
            callToAction: 'Upgrade Size'
          },
          {
            id: 'offer_10',
            title: 'Multi-Purchase Deal',
            description: 'Buy multiple items and save',
            discount: 35,
            discountType: 'percentage',
            value: 'Multi-purchase savings',
            terms: ['Minimum 3 different items', 'Valid for 45 days'],
            callToAction: 'Multi-Buy Deal'
          },
          {
            id: 'offer_11',
            title: 'Family Event Package',
            description: 'Special pricing for family events',
            discountType: 'package',
            value: 'Event package pricing',
            terms: ['Advance booking required', 'Minimum 10 people'],
            callToAction: 'Book Event'
          },
          {
            id: 'offer_12',
            title: 'Seasonal Family Offer',
            description: 'Special seasonal family pricing',
            discount: 40,
            discountType: 'percentage',
            value: 'Seasonal family discount',
            terms: ['Limited time only', 'Family of 4+'],
            callToAction: 'Seasonal Deal'
          }
        ],
        preferredChannels: ['Email', 'Facebook', 'Direct mail'],
        messagingTone: 'Warm, trustworthy, value-focused'
      },
      {
        id: 'persona_4',
        name: `The ${season} Wellness Seeker`,
        description: `Health and wellness focused individual prioritizing self-care during ${season}`,
        demographics: {
          age: '25-45',
          income: '$60K-$90K',
          location: 'Urban/Suburban',
          interests: ['Fitness', 'Nutrition', 'Mental health', 'Sustainability']
        },
        painPoints: ['Time for self-care', 'Finding quality products', 'Staying motivated'],
        motivations: ['Health improvement', 'Wellness', 'Personal growth', 'Sustainability'],
        offers: [
          {
            id: 'offer_1',
            title: 'Wellness Starter Pack',
            description: 'Complete wellness package to kickstart your journey',
            discount: 25,
            discountType: 'percentage',
            value: 'Everything you need to start',
            terms: ['First-time wellness customers', 'Includes free consultation'],
            callToAction: 'Start Your Wellness Journey'
          },
          {
            id: 'offer_2',
            title: 'Fitness Challenge',
            description: 'Join our 30-day fitness challenge',
            discountType: 'challenge',
            value: 'Free fitness program',
            terms: ['30-day commitment', 'Daily check-ins required'],
            callToAction: 'Join Challenge'
          },
          {
            id: 'offer_3',
            title: 'Nutrition Consultation',
            description: 'Free personalized nutrition plan',
            discountType: 'service',
            value: 'Complimentary consultation',
            terms: ['First-time customers', 'Valid for 30 days'],
            callToAction: 'Book Consultation'
          },
          {
            id: 'offer_4',
            title: 'Wellness Subscription',
            description: 'Monthly wellness box delivery',
            discount: 20,
            discountType: 'percentage',
            value: 'Monthly wellness products',
            terms: ['3-month minimum', 'Cancel anytime'],
            callToAction: 'Subscribe Now'
          },
          {
            id: 'offer_5',
            title: 'Group Fitness Classes',
            description: 'Access to all group fitness classes',
            discount: 30,
            discountType: 'percentage',
            value: 'Unlimited group classes',
            terms: ['Monthly membership', 'All locations'],
            callToAction: 'Join Classes'
          },
          {
            id: 'offer_6',
            title: 'Health Assessment',
            description: 'Comprehensive health assessment',
            discountType: 'service',
            value: 'Free health evaluation',
            terms: ['New members only', 'Valid for 60 days'],
            callToAction: 'Schedule Assessment'
          },
          {
            id: 'offer_7',
            title: 'Wellness Rewards',
            description: 'Earn points for healthy activities',
            discountType: 'points',
            value: 'Wellness activity points',
            terms: ['Track daily activities', 'Redeem for products'],
            callToAction: 'Start Earning'
          },
          {
            id: 'offer_8',
            title: 'Personal Training',
            description: 'One-on-one personal training session',
            discount: 50,
            discountType: 'percentage',
            value: '50% off first session',
            terms: ['New clients only', 'Valid for 14 days'],
            callToAction: 'Book Training'
          },
          {
            id: 'offer_9',
            title: 'Wellness App Access',
            description: 'Premium wellness app features',
            discountType: 'access',
            value: 'Full app access',
            terms: ['6-month subscription', 'All features included'],
            callToAction: 'Download App'
          },
          {
            id: 'offer_10',
            title: 'Healthy Meal Plans',
            description: 'Customized meal planning service',
            discount: 40,
            discountType: 'percentage',
            value: 'Personalized meal plans',
            terms: ['Weekly meal plans', 'Dietary preferences considered'],
            callToAction: 'Get Meal Plans'
          },
          {
            id: 'offer_11',
            title: 'Wellness Retreat',
            description: 'Weekend wellness retreat access',
            discountType: 'event',
            value: 'Retreat participation',
            terms: ['Advance booking required', 'Limited spots'],
            callToAction: 'Reserve Spot'
          },
          {
            id: 'offer_12',
            title: 'Health Supplements',
            description: 'Premium health supplements',
            discount: 25,
            discountType: 'percentage',
            value: 'Quality supplements',
            terms: ['Monthly delivery', 'Cancel anytime'],
            callToAction: 'Order Supplements'
          }
        ],
        preferredChannels: ['Instagram', 'Email', 'Health apps'],
        messagingTone: 'Motivational, supportive, health-focused'
      },
      {
        id: 'persona_5',
        name: `The ${season} Traditionalist`,
        description: `Experienced professional with established ${season} traditions and higher disposable income`,
        demographics: {
          age: '50-65',
          income: '$80K-$120K',
          location: 'Suburban/Urban',
          interests: ['Travel', 'Hobbies', 'Family', 'Retirement planning']
        },
        painPoints: ['Technology adoption', 'Changing market', 'Time management'],
        motivations: ['Quality', 'Reliability', 'Value', 'Legacy'],
        offers: [
          {
            id: 'offer_1',
            title: 'Lifetime Value Package',
            description: 'Comprehensive package with ongoing benefits',
            discount: 15,
            discountType: 'percentage',
            value: 'Best value with lifetime support',
            terms: ['Lifetime warranty', 'Priority support', 'Annual reviews'],
            callToAction: 'Secure Your Future'
          },
          {
            id: 'offer_2',
            title: 'Senior Citizen Discount',
            description: 'Special pricing for senior citizens',
            discount: 20,
            discountType: 'percentage',
            value: 'Senior citizen pricing',
            terms: ['Valid ID required', 'Age 60+'],
            callToAction: 'Verify Age'
          },
          {
            id: 'offer_3',
            title: 'Priority Customer Service',
            description: 'Dedicated customer service line',
            discountType: 'service',
            value: 'Priority support access',
            terms: ['Dedicated phone line', 'Faster response times'],
            callToAction: 'Call Priority Line'
          },
          {
            id: 'offer_4',
            title: 'Comprehensive Warranty',
            description: 'Extended warranty coverage',
            discountType: 'warranty',
            value: 'Extended protection',
            terms: ['5-year warranty', 'All repairs covered'],
            callToAction: 'Add Warranty'
          },
          {
            id: 'offer_5',
            title: 'Personal Consultation',
            description: 'One-on-one consultation service',
            discountType: 'service',
            value: 'Personal advisor',
            terms: ['Free consultation', 'Expert guidance'],
            callToAction: 'Book Consultation'
          },
          {
            id: 'offer_6',
            title: 'Legacy Planning',
            description: 'Estate and legacy planning services',
            discountType: 'service',
            value: 'Legacy planning support',
            terms: ['Professional guidance', 'Comprehensive planning'],
            callToAction: 'Plan Legacy'
          },
          {
            id: 'offer_7',
            title: 'Premium Support',
            description: 'White-glove customer service',
            discountType: 'service',
            value: 'Premium support experience',
            terms: ['Dedicated account manager', '24/7 support'],
            callToAction: 'Get Premium Support'
          },
          {
            id: 'offer_8',
            title: 'Family Benefits',
            description: 'Extended benefits for family members',
            discountType: 'family',
            value: 'Family coverage',
            terms: ['Spouse and children included', 'Shared benefits'],
            callToAction: 'Add Family'
          },
          {
            id: 'offer_9',
            title: 'Annual Review',
            description: 'Complimentary annual service review',
            discountType: 'service',
            value: 'Free annual review',
            terms: ['Yearly checkup', 'Performance optimization'],
            callToAction: 'Schedule Review'
          },
          {
            id: 'offer_10',
            title: 'Exclusive Access',
            description: 'Access to premium features',
            discountType: 'access',
            value: 'Premium features',
            terms: ['Advanced tools', 'Exclusive content'],
            callToAction: 'Access Premium'
          },
          {
            id: 'offer_11',
            title: 'Retirement Planning',
            description: 'Comprehensive retirement planning',
            discountType: 'service',
            value: 'Retirement guidance',
            terms: ['Financial planning', 'Investment advice'],
            callToAction: 'Plan Retirement'
          },
          {
            id: 'offer_12',
            title: 'Lifetime Learning',
            description: 'Continuous education and training',
            discountType: 'education',
            value: 'Lifetime learning access',
            terms: ['Ongoing education', 'Skill development'],
            callToAction: 'Start Learning'
          }
        ],
        preferredChannels: ['Email', 'Phone', 'Direct mail'],
        messagingTone: 'Professional, trustworthy, respectful'
      }
    ]
  }
}

export const geminiService = new GeminiService()
