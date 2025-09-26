import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/lib/types';

interface ChatInterfaceProps {
  onMessage?: (message: string) => void;
}

export default function ChatInterface({ onMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `👋 **Welcome to ChainMate!**

I'm your AI crypto analyst. I can help you:

🔍 **Analyze crypto portfolios** - Just provide a wallet address
📊 **Calculate diversity scores** - See how balanced your holdings are  
💡 **Get AI insights** - Receive personalized recommendations

Try asking:
• "Analyze this wallet: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
• "Show me Vitalik's portfolio"
• "What tokens does 0x742...571 own?"

What would you like to explore? 🚀`,
      timestamp: new Date().toISOString()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Add loading message
    const loadingMessage: ChatMessage = {
      id: `msg_${Date.now()}_loading`,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      loading: true
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage.trim(),
        }),
      });

      const result = await response.json();

      // Remove loading message
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id));

      if (result.success) {
        setMessages(prev => [...prev, result.data]);
        onMessage?.(inputMessage.trim());
      } else {
        setMessages(prev => [...prev, {
          id: `msg_${Date.now()}_error`,
          role: 'assistant',
          content: `❌ **Error**: ${result.error}\n\nPlease try again or contact support if the issue persists.`,
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      // Remove loading message
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id));
      
      setMessages(prev => [...prev, {
        id: `msg_${Date.now()}_error`,
        role: 'assistant',
        content: `❌ **Network Error**: Failed to send message. Please check your connection and try again.`,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    "Analyze Vitalik's wallet: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    "Analyze Binance wallet: 0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE",
    "What can you help me with?",
    "How do I analyze a portfolio?"
  ];

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl p-4 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : message.loading
                ? 'bg-gray-200 animate-pulse'
                : 'bg-white shadow-sm border'
            }`}>
              {message.loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600">ChainMate is thinking...</span>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  {message.content.split('\n').map((line, index) => {
                    if (line.startsWith('•')) {
                      return <div key={index} className="ml-4">• {line.substring(1).trim()}</div>;
                    } else if (line.startsWith('**') && line.endsWith('**')) {
                      return <div key={index} className="font-semibold">{line.slice(2, -2)}</div>;
                    } else if (line.includes('**')) {
                      const parts = line.split('**');
                      return (
                        <div key={index}>
                          {parts.map((part, i) => 
                            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                          )}
                        </div>
                      );
                    }
                    return line ? <div key={index}>{line}</div> : <br key={index} />;
                  })}
                </div>
              )}
              
              <div className="mt-2 text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="p-4 bg-white border-t">
          <p className="text-sm text-gray-600 mb-3">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(prompt)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 rounded-full transition-colors"
                disabled={isLoading}
              >
                {prompt.length > 50 ? `${prompt.substring(0, 47)}...` : prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <div className="flex space-x-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about crypto portfolios... (e.g., 'Analyze this wallet: 0x...')"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              'Send'
            )}
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}