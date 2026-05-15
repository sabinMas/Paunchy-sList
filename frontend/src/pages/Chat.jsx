import { useState, useRef, useEffect } from 'react';
import { cerebrasAPI } from '../utils/cerebras';

const SYSTEM_PROMPT = `You are an expert extension recommendation assistant for Paunchy's List, a comprehensive platform for discovering developer tools and extensions across VS Code, JetBrains, Unreal Engine, Browsers, and AI platforms.

Your role is to:
1. Understand the user's development workflow, languages, tools, and pain points
2. Ask clarifying questions to understand their specific needs
3. Recommend the most suitable extensions from Paunchy's List
4. Explain why each extension is a good fit for their use case
5. When recommending extensions, provide their names and what environments they're available in

Available categories: productivity, testing, ai, themes, debugging, languages
Available environments: VS Code, JetBrains, Unreal Engine, Browser, AI Agent

Start by greeting the user and asking about their development background (languages, frameworks, tools they use). Then progressively understand their pain points and recommend extensions.

Be conversational, friendly, and genuinely helpful. Ask follow-up questions to make targeted recommendations. When recommending, be specific about which extension solves which problem.`;

export default function Chat({ onSelectProduct, extensions }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "👋 Hi! I'm your extension recommendation assistant. I help developers find the perfect tools and extensions for their workflow.\n\nTo get started, tell me a bit about yourself:\n- What languages/frameworks do you primarily work with?\n- What's your role? (frontend, backend, fullstack, devops, gamedev, etc.)\n- What are your biggest productivity pain points right now?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await cerebrasAPI.chat([
        ...conversationHistory,
        { role: 'user', content: input }
      ], SYSTEM_PROMPT);

      const assistantMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: response
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: "Sorry, I encountered an error. Please make sure your Cerebras API key is configured properly. You can check the browser console for more details."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="container">
          <h1>Extension Recommendation Assistant</h1>
          <p>Powered by Cerebras AI</p>
        </div>
      </div>

      <div className="chat-content">
        <div className="messages-container">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message message-${msg.role}`}
            >
              <div className="message-bubble">
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message message-assistant">
              <div className="message-bubble typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="chat-input-form">
          <div className="input-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell me about your development needs..."
              disabled={loading}
              className="chat-input"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="send-button"
            >
              {loading ? '...' : '→'}
            </button>
          </div>
          <p className="input-hint">
            💡 Describe your workflow, tech stack, or specific problems you're trying to solve
          </p>
        </form>
      </div>
    </div>
  );
}
