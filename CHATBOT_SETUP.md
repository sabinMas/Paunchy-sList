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

The API key is configured **only on the backend** for security. It is never exposed to the client.

#### Local Development

1. In the `backend` directory, copy the example env file:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Open `backend/.env` and add your Cerebras API key:
   ```
   CEREBRAS_API_KEY=your_api_key_here
   ```

3. Start your backend server:
   ```bash
   npm run dev
   ```

4. In another terminal, start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

#### Production (Vercel)

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add a new variable:
   - **Name**: `CEREBRAS_API_KEY`
   - **Value**: Your Cerebras API key
   - **Environments**: Production and Preview
4. Redeploy your project

The backend will now have secure access to your API key.

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

## Architecture

### Secure Backend Proxy

The chatbot uses a **secure backend proxy architecture**:

1. **Frontend** → Sends chat message to `POST /api/extensions/chat`
2. **Backend** → Receives request with user's message
3. **Backend** → Uses `CEREBRAS_API_KEY` (from environment, never exposed)
4. **Backend** → Calls Cerebras API securely with the API key
5. **Backend** → Returns response to frontend
6. **Frontend** → Displays response to user

**Benefits**:
- ✅ API key never leaves your backend
- ✅ API key not visible in browser or network requests
- ✅ You control rate limiting and access
- ✅ Can add authentication layer if needed
- ✅ Safe from API key theft

## API Details

**Model**: llama-3.3-70b (Cerebras' fastest open-source model)
**Backend Endpoint**: `POST /api/extensions/chat`
**Cerebras Endpoint**: `https://api.cerebras.ai/v1/chat/completions` (backend only)
**Max Tokens**: 1024 per response
**Temperature**: 0.7 (balanced creativity and consistency)

## Troubleshooting

### "Cerebras API key not configured on server" Error

- Verify you've set `CEREBRAS_API_KEY` in `backend/.env` (dev) or Vercel environment variables (production)
- Make sure you set it in the **backend** environment, not the frontend
- Restart your backend server after adding the environment variable
- For Vercel, redeploy after adding the environment variable
- Check Vercel's deployment logs to confirm the variable is being read

### Chat doesn't work, shows "Server configuration issue" Error

- Check backend console logs for errors
- Verify `CEREBRAS_API_KEY` is correctly set
- Verify your API key is valid at [console.cerebras.ai](https://console.cerebras.ai)
- Check that the backend endpoint `POST /api/extensions/chat` is accessible
- Ensure backend server is running when testing locally

### Slow Responses

- Cerebras is extremely fast, but network latency may vary
- Check your internet connection
- Check backend logs to see if the Cerebras API call is being made
- Verify your Cerebras account has available credits

### Chatbot Giving Wrong Recommendations

- The system prompt guides the AI but isn't perfect
- Consider refining the system prompt in `backend/src/controllers/extensionsController.js` (look for `chatWithCerebras`)
- You can customize categories and environment mappings based on your database

## Customization

### Changing the System Prompt

Edit the system prompt in `backend/src/controllers/extensionsController.js` in the `chatWithCerebras` function to:
- Add domain-specific knowledge
- Change recommendation style
- Add requirements or constraints
- Adjust the conversation flow

The system prompt is embedded in the backend controller for security (not exposed to frontend).

### Styling the Chat Interface

Chat styles are in `frontend/src/styles/index.css`:
- `.chat-container` - Main chat layout
- `.message-user` / `.message-assistant` - Message styling
- `.chat-input-form` - Input area styling
- Customize colors using CSS variables: `--bg-primary`, `--accent-primary`, etc.

### API Model Selection

Change the model in `backend/src/controllers/extensionsController.js` in the `chatWithCerebras` function:
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
