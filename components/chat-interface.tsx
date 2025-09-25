"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, Sparkles, Mic, Paperclip, MoreHorizontal } from "lucide-react"
import { ChatMessage } from "./chat-message"
import { ChatSuggestions } from "./chat-suggestions"
import { EnhancedCampaignPreview } from "./enhanced-campaign-preview"
import { PersonaOffers } from "./persona-offers"
import { ApiKeyStatus } from "./api-key-status"
import { CampaignCustomization } from "./campaign-customization"
import { geminiService } from "@/lib/gemini-service"
import { Campaign, Persona, Offer, ChatMessage as ChatMessageType } from "@/lib/types"
import { useCampaigns } from "@/lib/campaign-context"
import { useToast } from "@/hooks/use-toast"

const initialMessages: ChatMessageType[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hello! I'm your AI Campaign Assistant powered by Gemini. I can help you create, optimize, and manage your seasonal lifestyle campaigns. What would you like to work on today?",
    timestamp: new Date(),
    type: "text",
  },
]

const quickSuggestions = [
  "Create a holiday campaign for premium shoppers",
  "Generate Valentine's Day campaigns",
  "Create spring wellness campaigns",
  "Show me trending seasonal opportunities",
  "Create Black Friday campaigns",
]

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessageType[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [showCampaignPreview, setShowCampaignPreview] = useState(false)
  const [showPersonaOffers, setShowPersonaOffers] = useState(false)
  const [personas, setPersonas] = useState<Persona[]>([])
  const [isGeneratingPersonas, setIsGeneratingPersonas] = useState(false)
  const [personasReady, setPersonasReady] = useState(false)
  const [showCustomization, setShowCustomization] = useState(false)
  const [customizingCampaign, setCustomizingCampaign] = useState<Campaign | null>(null)
  const [isLaunching, setIsLaunching] = useState(false)
  const [isLaunched, setIsLaunched] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Campaign management
  const { addCampaign, launchCampaign, customizeCampaign, saveCampaignPersonas, getCampaignPersonas } = useCampaigns()

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (message?: string) => {
    const messageText = message || input.trim()
    if (!messageText) return

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Use Gemini API for real AI responses
      const response = await geminiService.chatResponse(messageText)
      
      const aiMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
        type: response.type,
        data: response.data,
      }

      setMessages((prev) => [...prev, aiMessage])
      
      // If campaigns were generated, show them
      if (response.campaigns && response.campaigns.length > 0) {
        setSelectedCampaign(response.campaigns[0])
        setShowCampaignPreview(true)
      }
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I encountered an error. Please make sure your Gemini API key is configured correctly and try again.",
        timestamp: new Date(),
        type: "text",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewCampaignDetails = async (campaign: Campaign) => {
    console.log('Viewing campaign details:', campaign)
    setSelectedCampaign(campaign)
    setShowCampaignPreview(true)
    setShowPersonaOffers(false)
    setIsLaunched(false) // Reset launched state for new campaign
    
    // Pre-load persona offers in the background
    console.log('Pre-loading persona offers for campaign:', campaign.title)
    setPersonas([]) // Clear previous personas
    setPersonasReady(false) // Reset personas ready state
    setIsGeneratingPersonas(true)
    
    try {
      const generatedPersonas = await geminiService.generatePersonaOffers(campaign)
      console.log('Pre-loaded personas:', generatedPersonas.length)
      setPersonas(generatedPersonas)
      // Save personas to context for export
      saveCampaignPersonas(campaign.id, generatedPersonas)
      // Mark personas as ready
      setPersonasReady(true)
    } catch (error) {
      console.error('Error pre-loading persona offers:', error)
      // Fallback to default personas
      const defaultPersonas = geminiService.getDefaultPersonas(campaign)
      setPersonas(defaultPersonas)
      saveCampaignPersonas(campaign.id, defaultPersonas)
      // Mark personas as ready even with defaults
      setPersonasReady(true)
    } finally {
      setIsGeneratingPersonas(false)
    }
  }

  const handleSelectCampaign = async (campaign: Campaign) => {
    console.log('Selected campaign:', campaign)
    setSelectedCampaign(campaign)
    setShowCampaignPreview(false)
    setShowPersonaOffers(true)
    
    // If personas are already loaded for this campaign, use them
    if (personas.length > 0) {
      console.log('Using pre-loaded personas:', personas.length)
      return
    }
    
    // If no personas are loaded, generate them now
    console.log('Generating persona offers for campaign:', campaign.title)
    setPersonas([])
    setIsGeneratingPersonas(true)
    
    try {
      // Generate persona offers for the selected campaign
      const generatedPersonas = await geminiService.generatePersonaOffers(campaign)
      console.log('Generated personas:', generatedPersonas)
      
      // Ensure each persona has 12 offers
      const personasWithFullOffers = generatedPersonas.map(persona => ({
        ...persona,
        offers: persona.offers || []
      }))
      
      console.log('Personas with offers count:', personasWithFullOffers.map(p => ({ name: p.name, offerCount: p.offers.length })))
      setPersonas(personasWithFullOffers)
      // Save personas to context for export
      saveCampaignPersonas(campaign.id, personasWithFullOffers)
      // Mark personas as ready
      setPersonasReady(true)
    } catch (error) {
      console.error('Error generating persona offers:', error)
      // Use default personas if API fails
      const defaultPersonas = geminiService.getDefaultPersonas(campaign)
      setPersonas(defaultPersonas)
      saveCampaignPersonas(campaign.id, defaultPersonas)
      // Mark personas as ready even with defaults
      setPersonasReady(true)
    } finally {
      setIsGeneratingPersonas(false)
    }
  }

  const handleSelectOffer = (persona: Persona, offer: Offer) => {
    // Handle offer selection - could open a modal, navigate to checkout, etc.
    console.log('Selected offer:', { persona: persona.name, offer: offer.title })
    // You can add more functionality here like opening a checkout flow
  }

  const handleEditCampaign = (campaign: Campaign) => {
    // Handle campaign editing - could open an edit modal or navigate to edit page
    console.log('Edit campaign:', campaign.title)
    // You can add more functionality here
  }

  const handleCustomizeCampaign = (campaign: Campaign) => {
    console.log('Customize campaign:', campaign.title)
    // Add campaign to campaigns list if not already there
    addCampaign(campaign)
    
    // Show customization modal
    setCustomizingCampaign(campaign)
    setShowCustomization(true)
  }

  const handleSaveCustomization = (customizations: any) => {
    if (customizingCampaign) {
      customizeCampaign(customizingCampaign.id, {
        customizations,
        launchSettings: {
          budget: customizations.budget,
          startDate: customizations.startDate,
          endDate: customizations.endDate,
          channels: customizations.channels
        },
        targetAudience: customizations.targetAudience,
        description: customizations.description
      })
    }
    setShowCustomization(false)
    setCustomizingCampaign(null)
  }

  const { toast } = useToast()
  
  const handleLaunchCampaign = (campaign: Campaign) => {
    console.log('Launch campaign:', campaign.title)
    setIsLaunching(true)
    
    // Add campaign to campaigns list if not already there
    addCampaign(campaign)
    
    // Launch the campaign
    launchCampaign(campaign)
    
    // Show success state in dialog
    setTimeout(() => {
      setIsLaunching(false)
      setIsLaunched(true)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">AI Campaign Assistant</h2>
                <p className="text-sm text-muted-foreground">Online • Ready to help with your campaigns</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3" />
                AI Powered
              </Badge>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* API Key Status */}
        {/* <div className="px-4 pt-4">
          <ApiKeyStatus />
        </div> */}

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                onSelectCampaign={handleViewCampaignDetails}
              />
            ))}
            {isLoading && (
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted max-w-xs">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Suggestions */}
        {/* <div className="border-t border-border p-4">
          <ChatSuggestions suggestions={quickSuggestions} onSuggestionClick={handleSend} />
        </div> */}

        {/* Input Area */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about campaigns, trends, or content ideas..."
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button onClick={() => handleSend()} disabled={!input.trim() || isLoading} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Campaign Preview Dialog */}
      <EnhancedCampaignPreview
        campaign={selectedCampaign}
        isOpen={showCampaignPreview}
        onClose={() => {
          setShowCampaignPreview(false)
          setIsLaunched(false)
        }}
        onSelectCampaign={handleSelectCampaign}
        onEditCampaign={handleEditCampaign}
        onCustomizeCampaign={handleCustomizeCampaign}
        onLaunchCampaign={handleLaunchCampaign}
        isLaunching={isLaunching}
        isLaunched={isLaunched}
        isGeneratingPersonas={isGeneratingPersonas}
        personasReady={personasReady}
      />

      {/* Campaign Customization Dialog */}
      <CampaignCustomization
        campaign={customizingCampaign}
        isOpen={showCustomization}
        onClose={() => setShowCustomization(false)}
        onSave={handleSaveCustomization}
      />

      {/* Persona Offers Sidebar */}
      {showPersonaOffers && selectedCampaign && (
        <div className="w-96 border-l border-border">
          <PersonaOffers
            campaign={selectedCampaign}
            personas={personas}
            onSelectOffer={handleSelectOffer}
            onClose={() => setShowPersonaOffers(false)}
            isLoading={isGeneratingPersonas}
          />
        </div>
      )}
    </div>
  )
}
