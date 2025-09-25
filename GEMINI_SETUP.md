# Gemini API Setup Instructions

This AI Campaign Dashboard uses Google's Gemini API to provide intelligent campaign generation and chat functionality.

## Setup Steps

1. **Get your Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Copy the API key

2. **Configure Environment Variables**
   - Create a `.env.local` file in the project root
   - Add your API key:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

## Features

- **AI-Powered Campaign Generation**: Ask the AI to create campaigns for any season, festival, or trend
- **Persona-Based Offers**: Get tailored offers for 5 different customer personas
- **Campaign Preview**: View detailed campaign information in a popup
- **Real-time Chat**: Interactive chat interface powered by Gemini AI

## Usage

1. Open the chat page
2. Ask questions like:
   - "Create a holiday campaign for premium shoppers"
   - "Generate Valentine's Day campaigns"
   - "Show me spring wellness campaigns"
   - "Create Black Friday campaigns"

3. Select any generated campaign to view detailed information
4. Click "View Persona Offers" to see tailored offers for different customer personas

## Troubleshooting

- Make sure your API key is correctly set in `.env.local`
- Check the browser console for any API errors
- Ensure you have a stable internet connection
- The API key should start with "AIza" for Gemini API
