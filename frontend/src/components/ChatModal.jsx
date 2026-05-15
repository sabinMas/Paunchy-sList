import { useState, useRef, useEffect } from 'react';
import { cerebrasAPI } from '../utils/cerebras';

export default function ChatModal({ isOpen, onClose }) {
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

  // Reset messages when modal opens
  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          id: 1,
          role: 'assistant',
          content: "👋 Hi! I'm your extension recommendation assistant. I help developers find the perfect tools and extensions for their workflow.\n\nTo get started, tell me a bit about yourself:\n- What languages/frameworks do you primarily work with?\n- What's your role? (frontend, backend, fullstack, devops, gamedev, etc.)\n- What are your biggest productivity pain points right now?"
        }
      ]);
      setInput('');
    }
  }, [isOpen]);

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
      ]);

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
        content: "Sorry, I encountered an error. This might be due to a server configuration issue. Please check back shortly, or contact support if the issue persists."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="chat-modal-overlay" onClick={onClose} />

      {/* Modal */}
      <div className="chat-modal">
        {/* Header */}
        <div className="chat-modal-header">
          <h3>Extension Assistant</h3>
          <button className="chat-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Messages */}
        <div className="chat-modal-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message chat-message-${msg.role}`}
            >
              <div className="chat-message-bubble">
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat-message chat-message-assistant">
              <div className="chat-message-bubble typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="chat-modal-form">
          <div className="chat-modal-input-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about extensions..."
              disabled={loading}
              className="chat-modal-input"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="chat-modal-send"
            >
              {loading ? '...' : '→'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
