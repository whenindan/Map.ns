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

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '360px',
      backgroundColor: '#1a1a1a',
      border: '1px solid #404040',
      borderRadius: '12px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
      zIndex: 10000,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      height: isExpanded ? '440px' : '56px',
      overflow: 'hidden',
      fontFamily: '"Open Sans", sans-serif'
    }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          backgroundColor: '#000000',
          color: 'white',
          borderRadius: '12px 12px 0 0',
          cursor: 'pointer',
          fontSize: '15px',
          fontWeight: '600',
          transition: 'all 0.2s ease',
          borderBottom: '1px solid #404040'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            backgroundColor: isConnected ? '#ffffff' : '#666666',
            borderRadius: '50%',
            transition: 'background-color 0.3s ease'
          }}></div>
          <span>Water Quality Assistant</span>
        </div>
        <button style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '14px',
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: '4px',
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
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {/* Chat Body */}
      {isExpanded && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          height: '384px',
          backgroundColor: '#1a1a1a'
        }}>
          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            backgroundColor: '#0a0a0a',
            maxHeight: '304px',
            scrollbarWidth: 'thin',
            scrollbarColor: '#404040 #1a1a1a'
          }}>
            {messages.length === 0 ? (
              <div style={{
                textAlign: 'center',
                color: '#666666',
                fontSize: '14px',
                padding: '32px 16px',
                fontWeight: '500'
              }}>
                <div style={{ fontSize: '16px', marginBottom: '12px', color: '#ffffff' }}>
                  Water Quality Assistant
                </div>
                <div style={{ fontSize: '13px', color: '#666666' }}>
                  Ask me about water quality data and analysis
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
                      marginRight: '8px',
                      marginTop: '8px',
                      width: '6px',
                      height: '6px',
                      backgroundColor: message.type === 'bot' ? '#ffffff' : '#666666',
                      borderRadius: '50%',
                      flexShrink: 0,
                      alignSelf: 'flex-start'
                    }}>
                    </div>
                  )}
                  <div style={{
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    wordWrap: 'break-word',
                    backgroundColor: message.type === 'user'
                      ? '#ffffff'
                      : message.type === 'system'
                        ? '#262626'
                        : '#1a1a1a',
                    color: message.type === 'user'
                      ? '#000000'
                      : message.type === 'system'
                        ? '#a3a3a3'
                        : '#e5e5e5',
                    border: message.type !== 'user' ? '1px solid #404040' : 'none',
                    fontWeight: '400'
                  }}>
                    {message.message}
                  </div>
                  {message.type === 'user' && (
                    <div style={{
                      marginLeft: '8px',
                      marginTop: '8px',
                      width: '6px',
                      height: '6px',
                      backgroundColor: '#ffffff',
                      borderRadius: '50%',
                      flexShrink: 0,
                      alignSelf: 'flex-start'
                    }}>
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
            borderTop: '1px solid #404040',
            backgroundColor: '#1a1a1a',
            borderRadius: '0 0 12px 12px'
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
                  padding: '10px 14px',
                  border: '1px solid #404040',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#0a0a0a',
                  color: '#ffffff',
                  transition: 'all 0.2s ease',
                  fontWeight: '400'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#666666'
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255, 255, 255, 0.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#404040'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                disabled={!isConnected}
              />
              <button
                onClick={sendMessage}
                disabled={!isConnected || !inputMessage.trim()}
                style={{
                  padding: '10px 16px',
                  backgroundColor: isConnected && inputMessage.trim() ? '#ffffff' : '#404040',
                  color: isConnected && inputMessage.trim() ? '#000000' : '#666666',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isConnected && inputMessage.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  fontWeight: '600',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  if (isConnected && inputMessage.trim()) {
                    e.currentTarget.style.backgroundColor = '#e5e5e5'
                  }
                }}
                onMouseLeave={(e) => {
                  if (isConnected && inputMessage.trim()) {
                    e.currentTarget.style.backgroundColor = '#ffffff'
                  }
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}