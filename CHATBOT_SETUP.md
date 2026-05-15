# Cerebras AI Chatbot Setup

Paunchy's List now includes an intelligent AI chatbot powered by Cerebras that helps developers discover the perfect extensions for their workflow.

## Features

- **Smart Recommendations**: The chatbot understands your development background, languages, frameworks, and pain points
- **Conversational Interface**: Natural dialogue to guide you toward the best extensions
- **Extension Database Integration**: Recommends real extensions from Paunchy's List
- **Fast Responses**: Uses Cerebras' lightning-fast llama-3.3-70b model

## Setup Instructions

### 1. Get Your Cerebras API Key

1. Go to [console.cerebras.ai](https://console.cerebras.ai)
2. Sign up for a free account (Cerebras offers free credits for testing)
3. Create an API key in your account settings
4. Copy your API key

### 2. Configure Environment Variables

#### Local Development

1. Copy the example env file:
   ```bash
   cd frontend
   cp .env.example .env.local
   ```

2. Open `.env.local` and add your Cerebras API key:
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_CEREBRAS_API_KEY=your_api_key_here
   ```

3. Start your development server:
   ```bash
   npm run dev
   ```

#### Production (Vercel)

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add a new variable:
   - **Name**: `VITE_CEREBRAS_API_KEY`
   - **Value**: Your Cerebras API key
4. Redeploy your project

### 3. Testing the Chatbot

1. Navigate to the **Ask AI** link in the navigation menu
2. The chatbot will greet you and ask about your development background
3. Answer naturally - tell it about:
   - Languages/frameworks you use (JavaScript, Python, React, etc.)
   - Your role (frontend, backend, fullstack, devops, gamedev)
   - Your current pain points or productivity challenges
4. The chatbot will recommend relevant extensions from the database

## How It Works

### System Prompt

The chatbot uses a specialized system prompt that:
- Understands all 81+ extensions in the Paunchy's List database
- Maps dev types to relevant categories and environments
- Asks clarifying questions to narrow down recommendations
- Provides contextual explanations for each recommendation

### Conversation Flow

```
1. Greeting → Ask about background
2. Understand → Ask clarifying questions about workflow
3. Recommend → Suggest 1-3 most relevant extensions
4. Explain → Describe why each extension fits their needs
5. Guide → Direct them to install from native marketplaces
```

## API Details

**Model**: llama-3.3-70b (Cerebras' fastest open-source model)
**Endpoint**: `https://api.cerebras.ai/v1/chat/completions`
**Max Tokens**: 1024 per response
**Temperature**: 0.7 (balanced creativity and consistency)

## Troubleshooting

### "API key not configured" Error

- Verify you've set `VITE_CEREBRAS_API_KEY` in your .env.local (dev) or Vercel (production)
- Restart your dev server after adding the environment variable
- For Vercel, redeploy after adding the environment variable

### Slow Responses

- Cerebras is extremely fast, but network latency may vary
- Check your internet connection
- Verify your API key is valid at console.cerebras.ai

### Chatbot Giving Wrong Recommendations

- The system prompt guides the AI but isn't perfect
- Consider refining the system prompt in `frontend/src/pages/Chat.jsx`
- You can customize categories and environment mappings based on your database

## Customization

### Changing the System Prompt

Edit the `SYSTEM_PROMPT` constant in `frontend/src/pages/Chat.jsx` to:
- Add domain-specific knowledge
- Change recommendation style
- Add requirements or constraints
- Adjust the conversation flow

### Styling the Chat Interface

Chat styles are in `frontend/src/styles/index.css`:
- `.chat-container` - Main chat layout
- `.message-user` / `.message-assistant` - Message styling
- `.chat-input-form` - Input area styling
- Customize colors using CSS variables: `--bg-primary`, `--accent-primary`, etc.

### API Model Selection

Change the model in `frontend/src/utils/cerebras.js`:
```javascript
model: 'llama-3.3-70b', // Change to other Cerebras models if available
```

## Cost Considerations

- Cerebras offers free API access with a generous free tier
- Each chat message uses ~100-500 tokens depending on conversation
- Monitor your usage at console.cerebras.ai
- Check pricing if you exceed free tier limits

## Next Steps

- Add email notifications when recommended extensions are released
- Create a "Save Recommendations" feature to bookmark conversation history
- Integrate with browser extension for quick recommendations
- Add multi-language support
- Create a feedback loop to improve recommendations

## Support

For Cerebras API issues: https://docs.cerebras.ai/
For Paunchy's List issues: Check the main README.md
