const CEREBRAS_API_URL = 'https://api.cerebras.ai/v1/chat/completions';

export const cerebrasAPI = {
  chat: async (messages, systemPrompt) => {
    const apiKey = import.meta.env.VITE_CEREBRAS_API_KEY;

    if (!apiKey) {
      throw new Error(
        'Cerebras API key not configured. Please set VITE_CEREBRAS_API_KEY in your environment variables.'
      );
    }

    try {
      const response = await fetch(CEREBRAS_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            ...messages
          ],
          max_tokens: 1024,
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Cerebras API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`
        );
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Cerebras API call failed:', error);
      throw error;
    }
  }
};
