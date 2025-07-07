'use client'

import { useState, useEffect, useRef } from 'react'
import { ChatMessage } from '@/types/waterQuality'

export default function ChatBot() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initializeWebSocket()
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const initializeWebSocket = () => {
    if (isConnecting) return
    
    setIsConnecting(true)
    
    try {
      wsRef.current = new WebSocket('wss://nuocgpt-chat-bl9fc.ondigitalocean.app/ws/chat')
      
      wsRef.current.onopen = () => {
        setIsConnected(true)
        setIsConnecting(false)
        appendMessage('system', 'Connected to the chatbot')
      }
      
      wsRef.current.onmessage = (event) => {
        appendMessage('bot', event.data)
      }
      
      wsRef.current.onclose = () => {
        setIsConnected(false)
        setIsConnecting(false)
        appendMessage('system', 'Disconnected from the chatbot. Attempting to reconnect...')
        setTimeout(initializeWebSocket, 3000)
      }
      
      wsRef.current.onerror = () => {
        setIsConnected(false)
        setIsConnecting(false)
        appendMessage('system', 'Error connecting to the chatbot')
      }
    } catch (error) {
      setIsConnecting(false)
      appendMessage('system', 'Failed to connect to the chatbot')
    }
  }

  const appendMessage = (type: 'user' | 'bot' | 'system', message: string) => {
    const newMessage: ChatMessage = {
      type,
      message,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const sendMessage = () => {
    const message = inputMessage.trim()
    if (!message) return

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      appendMessage('user', message)
      wsRef.current.send(message)
      setInputMessage('')
    } else {
      appendMessage('system', 'Not connected to the server. Attempting to reconnect...')
      initializeWebSocket()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getMessageIcon = (type: 'user' | 'bot' | 'system') => {
    switch (type) {
      case 'user':
        return '👤'
      case 'bot':
        return '🤖'
      case 'system':
        return '⚙️'
      default:
        return ''
    }
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '360px',
      backgroundColor: 'white',
      border: 'none',
      borderRadius: '20px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      zIndex: 10000,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      height: isExpanded ? '440px' : '56px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #007cbf 0%, #0056b3 100%)',
          color: 'white',
          borderRadius: '20px 20px 0 0',
          cursor: 'pointer',
          fontSize: '15px',
          fontWeight: '600',
          transition: 'all 0.2s ease'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            backgroundColor: isConnected ? '#10b981' : '#ef4444',
            borderRadius: '50%',
            animation: isConnected ? 'none' : 'pulse 2s infinite'
          }}></div>
          <span style={{ fontSize: '16px' }}>💬</span>
          <span>Water Quality Assistant</span>
        </div>
        <button style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '6px',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
        >
          {isExpanded ? '▼' : '▲'}
        </button>
      </div>

      {/* Chat Body */}
      {isExpanded && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '384px',
          backgroundColor: 'white'
        }}>
          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            backgroundColor: '#f8fafc',
            maxHeight: '304px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#cbd5e1 #f1f5f9'
          }}>
            {messages.length === 0 ? (
              <div style={{
                                  textAlign: 'center',
                  color: '#64748b',
                  fontSize: '14px',
                  padding: '32px 16px',
                  fontWeight: '500'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🌊</div>
                <div>Ask me about water quality!</div>
                <div style={{ fontSize: '12px', marginTop: '4px', color: '#94a3b8' }}>
                  I can help with water analysis data
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    marginBottom: '16px',
                    justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                    animation: 'fadeIn 0.3s ease-in-out'
                  }}
                >
                  {message.type !== 'user' && (
                    <div style={{ 
                      fontSize: '20px', 
                      marginRight: '8px',
                      marginTop: '2px',
                      width: '28px',
                      height: '28px',
                      backgroundColor: message.type === 'bot' ? '#007cbf' : '#f59e0b',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      flexShrink: 0
                    }}>
                      {getMessageIcon(message.type)}
                    </div>
                  )}
                  <div style={{
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: message.type === 'user' 
                      ? '20px 20px 6px 20px' 
                      : '20px 20px 20px 6px',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    wordWrap: 'break-word',
                    backgroundColor: message.type === 'user' 
                      ? '#007cbf' 
                      : message.type === 'system'
                      ? '#fef3c7'
                      : 'white',
                    color: message.type === 'user' 
                      ? 'white' 
                      : message.type === 'system'
                      ? '#92400e'
                      : '#374151',
                    border: message.type === 'bot' ? '1px solid #e5e7eb' : 'none',
                    boxShadow: message.type !== 'user' ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                    fontWeight: '500'
                  }}>
                    {message.message}
                  </div>
                  {message.type === 'user' && (
                    <div style={{ 
                      fontSize: '20px', 
                      marginLeft: '8px',
                      marginTop: '2px',
                      width: '28px',
                      height: '28px',
                      backgroundColor: '#10b981',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      flexShrink: 0
                    }}>
                      {getMessageIcon(message.type)}
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: 'white',
            borderRadius: '0 0 20px 20px'
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '25px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: 'white',
                  color: '#374151',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#007cbf'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 124, 191, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                disabled={!isConnected}
              />
              <button
                onClick={sendMessage}
                disabled={!isConnected || !inputMessage.trim()}
                style={{
                  padding: '12px',
                  width: '44px',
                  height: '44px',
                  backgroundColor: isConnected && inputMessage.trim() ? '#007cbf' : '#cbd5e1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: isConnected && inputMessage.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '16px',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  if (isConnected && inputMessage.trim()) {
                    e.currentTarget.style.backgroundColor = '#0056b3'
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (isConnected && inputMessage.trim()) {
                    e.currentTarget.style.backgroundColor = '#007cbf'
                    e.currentTarget.style.transform = 'scale(1)'
                  }
                }}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 