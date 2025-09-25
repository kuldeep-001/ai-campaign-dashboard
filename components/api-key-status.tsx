"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, ExternalLink } from "lucide-react"

export function ApiKeyStatus() {
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    checkApiKey()
  }, [])

  const checkApiKey = async () => {
    setIsChecking(true)
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey === 'your_actual_api_key_here') {
        setIsValid(false)
      } else {
        // Simple check - if API key exists and is not placeholder, consider it valid
        setIsValid(true)
      }
    } catch (error) {
      setIsValid(false)
    } finally {
      setIsChecking(false)
    }
  }

  if (isChecking) {
    return (
      <Alert className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Checking API key configuration...
        </AlertDescription>
      </Alert>
    )
  }

  if (isValid === false) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            Gemini API key not configured. Please set up your API key to use AI features.
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://makersuite.google.com/app/apikey', '_blank')}
            className="ml-2"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Get API Key
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="mb-4 border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">
        Gemini API key configured successfully. AI features are ready to use!
      </AlertDescription>
    </Alert>
  )
}
