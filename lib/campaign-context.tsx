"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Campaign, Persona } from './types'

interface CampaignContextType {
  campaigns: Campaign[]
  launchedCampaigns: Campaign[]
  campaignPersonas: { [campaignId: string]: Persona[] }
  addCampaign: (campaign: Campaign) => void
  updateCampaign: (id: string, updates: Partial<Campaign>) => void
  launchCampaign: (campaign: Campaign) => void
  customizeCampaign: (id: string, customizations: any) => void
  saveCampaignPersonas: (campaignId: string, personas: Persona[]) => void
  getCampaignPersonas: (campaignId: string) => Persona[]
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined)

export function CampaignProvider({ children }: { children: React.ReactNode }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [launchedCampaigns, setLaunchedCampaigns] = useState<Campaign[]>([])
  const [campaignPersonas, setCampaignPersonasState] = useState<{ [campaignId: string]: Persona[] }>({})

  // Load campaigns from localStorage on mount
  useEffect(() => {
    const savedCampaigns = localStorage.getItem('campaigns')
    const savedLaunchedCampaigns = localStorage.getItem('launchedCampaigns')
    const savedCampaignPersonas = localStorage.getItem('campaignPersonas')
    
    if (savedCampaigns) {
      setCampaigns(JSON.parse(savedCampaigns))
    }
    if (savedLaunchedCampaigns) {
      setLaunchedCampaigns(JSON.parse(savedLaunchedCampaigns))
    }
    if (savedCampaignPersonas) {
      setCampaignPersonasState(JSON.parse(savedCampaignPersonas))
    }
  }, [])

  // Save campaigns to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('campaigns', JSON.stringify(campaigns))
  }, [campaigns])

  useEffect(() => {
    localStorage.setItem('launchedCampaigns', JSON.stringify(launchedCampaigns))
  }, [launchedCampaigns])

  useEffect(() => {
    localStorage.setItem('campaignPersonas', JSON.stringify(campaignPersonas))
  }, [campaignPersonas])

  const addCampaign = (campaign: Campaign) => {
    setCampaigns(prev => [...prev, campaign])
  }

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === id ? { ...campaign, ...updates } : campaign
    ))
  }

  const launchCampaign = (campaign: Campaign) => {
    const launchedCampaign = {
      ...campaign,
      status: 'launched' as const,
      launchedAt: new Date(),
      updatedAt: new Date()
    }
    
    setLaunchedCampaigns(prev => [...prev, launchedCampaign])
    updateCampaign(campaign.id, { status: 'launched', launchedAt: new Date() })
  }

  const customizeCampaign = (id: string, customizations: any) => {
    updateCampaign(id, {
      ...customizations,
      updatedAt: new Date()
    })
  }

  const saveCampaignPersonas = (campaignId: string, personas: Persona[]) => {
    setCampaignPersonasState(prev => ({
      ...prev,
      [campaignId]: personas
    }))
  }

  const getCampaignPersonas = (campaignId: string): Persona[] => {
    return campaignPersonas[campaignId] || []
  }

  return (
    <CampaignContext.Provider value={{
      campaigns,
      launchedCampaigns,
      campaignPersonas,
      addCampaign,
      updateCampaign,
      launchCampaign,
      customizeCampaign,
      saveCampaignPersonas,
      getCampaignPersonas
    }}>
      {children}
    </CampaignContext.Provider>
  )
}

export function useCampaigns() {
  const context = useContext(CampaignContext)
  if (context === undefined) {
    throw new Error('useCampaigns must be used within a CampaignProvider')
  }
  return context
}
