import React, { useState, useRef, useEffect } from 'react';
import { chatAPI } from '../services/api';
import { UI_MESSAGES } from '../utils/constants';

const ChatInterface = ({ document }) => {
  // visibility toggle for the whole chat panel (controlled by the chat bubble)
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (document?.documentId) {
      loadChatHistory();
      setMessages([{
        role: 'assistant',
        content: `Hi! I'm your AI tutor. I can help you understand your uploaded content better. Ask me anything about: "${document.userPrompt}".`,
        timestamp: new Date()
      }]);
    }
  }, [document]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // focus the input when the panel opens
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 120);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      const response = await chatAPI.getChatHistory(document.documentId);
      if (response.success && response.data.messages.length > 0) {
        setMessages(response.data.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      }
    } catch (error) {
      console.error('Load chat history error:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError('');

    try {
      const response = await chatAPI.sendMessage(document.documentId, inputMessage);

      if (response.success) {
        const aiMessage = {
          role: 'assistant',
          content: response.data.aiResponse,
          timestamp: new Date(response.data.timestamp)
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        setError(response.message || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Send message error:', error);
      setError(error.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = async () => {
    try {
      await chatAPI.clearChatHistory(document.documentId);
      setMessages([{
        role: 'assistant',
        content: `Chat cleared! I'm ready to help you with your content: "${document.userPrompt}".`,
        timestamp: new Date()
      }]);
      setError('');
    } catch (error) {
      console.error('Clear chat error:', error);
      setError('Failed to clear chat history');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const suggestedQuestions = [
    "Can you explain the main concepts in simpler terms?",
    "What are the most important points I should remember?",
    "Can you give me some examples related to this content?",
    "How does this relate to real-world applications?",
    "What should I focus on when studying this material?"
  ];

  // Chat bubble (always visible) + chat panel (only when isOpen true)
  return (
    <>
      {/* Chat bubble (always visible) */}
      <button
        aria-label={isOpen ? 'Close AI Tutor chat' : 'Open AI Tutor chat'}
        onClick={() => setIsOpen(prev => !prev)}
        className={`fixed z-50 bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform duration-200 transform ${isOpen ? 'scale-95' : 'scale-100'}`}
      >
        <span className="text-2xl">💬</span>
      </button>

      {/* Chat panel - appears only when user clicks the bubble */}
      {isOpen && (
        <div className="fixed z-40 bottom-20 right-6 h-[calc(100vh-10rem)] w-[468px] bg-white border border-gray-200 shadow-2xl flex flex-col overflow-hidden rounded-3xl">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-blue-50 rounded-t-3xl">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">💬</span>
                AI Tutor Chat
              </h3>
              <p className="text-xs text-gray-600 font-medium mt-1">Ask questions about your content</p>
            </div>

            <div className="flex items-center gap-2">
              {messages.length > 1 && (
                <button
                  onClick={clearChat}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold bg-white px-3 py-1.5 rounded-lg border border-blue-300 hover:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Clear Chat
                </button>
              )}

              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat panel"
                className="text-xs text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-hide">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2 max-w-[85%]`}>
                  {message.role === 'assistant' && (
                    <div className="w-7 h-7 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs">🤖</span>
                    </div>
                  )}

                  <div
                    className={`rounded-xl px-4 py-3 shadow-md ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white ml-auto'
                        : 'bg-white text-blue-900 border border-blue-200'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                      {message.content}
                    </p>
                    <p className={`text-xs mt-2 font-medium ${
                      message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs text-white">👤</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">🤖</span>
                  </div>
                  <div className="bg-white text-blue-900 border border-blue-200 rounded-xl px-4 py-3 shadow-md">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                      <span className="text-sm font-medium">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mx-auto max-w-md">
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 shadow-md">
                  <p className="text-red-700 text-sm font-semibold text-center">{error}</p>
                </div>
              </div>
            )}

            {messages.length === 1 && !isLoading && (
              <div className="space-y-3 max-w-2xl mx-auto">
                <div className="text-center">
                  <h4 className="text-base font-semibold text-blue-900 mb-2">Suggested Questions</h4>
                  <p className="text-xs text-gray-600 font-medium mb-3">Click on any question to get started</p>
                </div>
                <div className="grid gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(question)}
                      className="text-left p-3 bg-white hover:bg-blue-50 rounded-lg border-2 border-blue-200 hover:border-blue-400 text-sm text-blue-800 font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-[1.01]"
                    >
                      <span className="text-blue-500 font-semibold mr-2">Q{index + 1}:</span>
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100 rounded-b-3xl">
            <div className="max-w-4xl mx-auto">
              <div className="relative flex items-end gap-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={"Ask your doubts , I will answer"}
                    rows={1}
                    className="w-full px-4 py-3 pr-12 text-gray-900 bg-white border border-gray-200 rounded-xl resize-none focus:border-gray-300 focus:outline-none focus:ring-0 text-base placeholder-gray-400 transition-colors duration-200 shadow-sm hover:border-gray-300"
                    disabled={isLoading}
                    style={{
                      minHeight: '48px',
                      maxHeight: '200px',
                      fontSize: '16px',
                      lineHeight: '1.5'
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
                      inputMessage.trim() && !isLoading
                        ? 'bg-black hover:bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 px-1">
                <p className="text-xs text-gray-400">
                  Press Enter to send, Shift+Enter for new line
                </p>
                <div className="text-xs text-gray-400">
                  {inputMessage.length > 0 && `${inputMessage.length} characters`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatInterface;
