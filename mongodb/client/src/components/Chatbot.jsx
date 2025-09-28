// import React, { useState } from 'react';
// import axios from 'axios';

// const Chatbot = () => {
//   const [messages, setMessages] = useState([
//     { sender: 'bot', text: 'Hi! Ask me anything about farming, crops, weather, or best practices.' }
//   ]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);

//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;
//     const userMsg = { sender: 'user', text: input };
//     setMessages((msgs) => [...msgs, userMsg]);
//     setLoading(true);
//     setInput('');
//     try {
//       const res = await axios.post('http://localhost:5001/api/chat', { message: input });
//       setMessages((msgs) => [...msgs, { sender: 'bot', text: res.data.reply }]);
//     } catch (err) {
//       setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Sorry, I could not get a response.' }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: '2em auto', border: '1px solid #ccc', borderRadius: 8, background: '#f9f9f9', padding: 16 }}>
//       <h3 style={{ textAlign: 'center' }}>Farmer Chatbot</h3>
//       <div style={{ minHeight: 180, marginBottom: 12 }}>
//         {messages.map((msg, i) => (
//           <div key={i} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '8px 0' }}>
//             <span style={{ background: msg.sender === 'user' ? '#e0f7fa' : '#c8e6c9', padding: '8px 12px', borderRadius: 16, display: 'inline-block' }}>{msg.text}</span>
//           </div>
//         ))}
//         {loading && <div style={{ color: '#888', fontStyle: 'italic' }}>Bot is typing...</div>}
//       </div>
//       <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8 }}>
//         <input
//           type="text"
//           value={input}
//           onChange={e => setInput(e.target.value)}
//           placeholder="Ask about farming..."
//           style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
//         />
//         <button type="submit" disabled={loading} style={{ padding: '8px 16px', borderRadius: 8, background: '#388e3c', color: '#fff', border: 'none' }}>Send</button>
//       </form>
//     </div>
//   );
// };

// export default Chatbot;
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! 🌱 Ask me anything about farming, crops, weather, or best practices.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateSparkles = () => {
    const newSparkles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5,
    }));
    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 1500);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      generateSparkles();
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setLoading(true);
    setInput('');
    generateSparkles();

    try {
      const res = await axios.post('http://localhost:5002/api/chat', { message: input });
      setMessages((msgs) => [...msgs, { sender: 'bot', text: res.data.reply }]);
    } catch (err) {
      setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Sorry, I could not get a response.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Inline styles with animations
  const styles = {
    floatingButton: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1001,
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #4ade80, #10b981, #059669)',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4), 0 4px 8px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '40px',
      overflow: 'hidden',
    },
    floatingButtonHover: {
      transform: 'scale(1.05)',
      boxShadow: '0 12px 30px rgba(16, 185, 129, 0.5), 0 6px 12px rgba(0, 0, 0, 0.15)',
    },
    shimmerOverlay: {
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
      animation: 'shimmer 3s infinite',
    },
    pulseRing: {
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      background: 'rgba(74, 222, 128, 0.3)',
      animation: 'pulse 2s infinite',
    },
    sparkle: {
      position: 'absolute',
      color: '#fbbf24',
      fontSize: '12px',
      pointerEvents: 'none',
      animation: 'sparkleFloat 1.5s ease-out forwards',
    },
    chatContainer: {
      position: 'fixed',
      bottom: '90px',
      right: '20px',
      zIndex: 1000,
      width: '350px',
      maxWidth: 'calc(100vw - 40px)',
      maxHeight: 'calc(100vh - 120px)',
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      animation: 'slideUp 0.3s ease-out',
      overflow: 'hidden',
    },
    chatHeader: {
      background: 'linear-gradient(135deg, #4ade80, #10b981, #059669)',
      color: 'white',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      position: 'relative',
      overflow: 'hidden',
    },
    headerShimmer: {
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
      animation: 'shimmer 4s infinite',
    },
    avatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
    },
    statusDots: {
      display: 'flex',
      gap: '4px',
      marginLeft: 'auto',
    },
    statusDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: '#86efac',
    },
    messagesArea: {
      height: '280px',
      overflowY: 'auto',
      padding: '16px',
      background: 'linear-gradient(to bottom, rgba(240, 253, 244, 0.3), rgba(255, 255, 255, 0.8))',
      scrollBehavior: 'smooth',
    },
    messageContainer: {
      display: 'flex',
      marginBottom: '12px',
      animation: 'messageSlide 0.3s ease-out',
    },
    userMessage: {
      justifyContent: 'flex-end',
    },
    botMessage: {
      justifyContent: 'flex-start',
    },
    messageBubble: {
      maxWidth: '80%',
      padding: '12px 16px',
      borderRadius: '18px',
      fontSize: '14px',
      lineHeight: '1.4',
      position: 'relative',
      wordWrap: 'break-word',
    },
    userBubble: {
      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      color: 'white',
      marginLeft: '16px',
    },
    botBubble: {
      background: 'white',
      color: '#374151',
      border: '1px solid #e5e7eb',
      marginRight: '16px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    speechTail: {
      position: 'absolute',
      width: '16px',
      height: '16px',
      transform: 'rotate(45deg)',
    },
    userTail: {
      right: '-8px',
      top: '12px',
      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    },
    botTail: {
      left: '-8px',
      top: '12px',
      background: 'white',
      border: '1px solid #e5e7eb',
      borderTop: 'none',
      borderRight: 'none',
    },
    typingIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#6b7280',
      fontStyle: 'italic',
      fontSize: '14px',
    },
    typingDots: {
      display: 'flex',
      gap: '4px',
    },
    typingDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: '#10b981',
    },
    inputArea: {
      padding: '16px',
      background: 'rgba(255, 255, 255, 0.9)',
      borderTop: '1px solid rgba(229, 231, 235, 0.5)',
    },
    inputForm: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      padding: '12px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '24px',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s',
      background: 'white',
    },
    inputFocus: {
      borderColor: '#10b981',
    },
    sendButton: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #4ade80, #10b981)',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
      fontSize: '16px',
      position: 'relative',
      overflow: 'hidden',
    },
    sendButtonHover: {
      transform: 'scale(1.05)',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
    },
  };

  // CSS animations as a style tag
  const animations = `
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(200%); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes sparkleFloat {
      0% { 
        opacity: 1; 
        transform: translateY(0) scale(0); 
      }
      50% { 
        opacity: 1; 
        transform: translateY(-20px) scale(1); 
      }
      100% { 
        opacity: 0; 
        transform: translateY(-40px) scale(0); 
      }
    }
    @keyframes slideUp {
      from { 
        opacity: 0; 
        transform: translateY(20px) scale(0.95); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0) scale(1); 
      }
    }
    @keyframes messageSlide {
      from { 
        opacity: 0; 
        transform: translateX(-10px); 
      }
      to { 
        opacity: 1; 
        transform: translateX(0); 
      }
    }
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-4px); }
      60% { transform: translateY(-2px); }
    }
    .typing-dot-1 { animation: bounce 1.4s infinite; }
    .typing-dot-2 { animation: bounce 1.4s infinite 0.2s; }
    .typing-dot-3 { animation: bounce 1.4s infinite 0.4s; }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .chat-container-mobile {
        width: calc(100vw - 20px) !important;
        right: 10px !important;
        bottom: 80px !important;
        max-height: calc(100vh - 100px) !important;
      }
      .floating-button-mobile {
        bottom: 15px !important;
        right: 15px !important;
        width: 55px !important;
        height: 55px !important;
      }
    }
    
    /* Custom scrollbar for messages */
    .messages-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .messages-scrollbar::-webkit-scrollbar-track {
      background: rgba(0,0,0,0.05);
      border-radius: 3px;
    }
    .messages-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(16, 185, 129, 0.3);
      border-radius: 3px;
    }
    .messages-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(16, 185, 129, 0.5);
    }
  `;

  return (
    <>
      <style>{animations}</style>
      
      {/* Floating Chat Button */}
      <div style={{ position: 'relative' }}>
        {/* Sparkle Effects */}
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            style={{
              ...styles.sparkle,
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              animationDelay: `${sparkle.delay}s`,
            }}
          >
            ✨
          </div>
        ))}
        
        <button
          onClick={toggleChat}
          style={styles.floatingButton}
          className="floating-button-mobile"
          onMouseEnter={(e) => {
            Object.assign(e.target.style, styles.floatingButtonHover);
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4), 0 4px 8px rgba(0, 0, 0, 0.1)';
          }}
          title={isOpen ? "Close Chat" : "Open Farming Assistant"}
        >
          <div style={styles.shimmerOverlay}></div>
          <div style={styles.pulseRing}></div>
          {isOpen ? '✕' : '💬'}
        </button>
      </div>

      {/* Chat Interface */}
      {isOpen && (
        <div style={styles.chatContainer} className="chat-container-mobile">
          {/* Header */}
          <div style={styles.chatHeader}>
            <div style={styles.headerShimmer}></div>
            <div style={styles.avatar}>🌱</div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '16px' }}>Farming Assistant</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Ready to help you grow! 🌾</div>
            </div>
            <div style={styles.statusDots}>
              <div style={{ ...styles.statusDot, animation: 'pulse 2s infinite' }}></div>
              <div style={{ ...styles.statusDot, animation: 'pulse 2s infinite 0.3s' }}></div>
              <div style={{ ...styles.statusDot, animation: 'pulse 2s infinite 0.6s' }}></div>
            </div>
          </div>

          {/* Messages Area */}
          <div style={styles.messagesArea} className="messages-scrollbar">
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.messageContainer,
                  ...(msg.sender === 'user' ? styles.userMessage : styles.botMessage),
                }}
              >
                <div
                  style={{
                    ...styles.messageBubble,
                    ...(msg.sender === 'user' ? styles.userBubble : styles.botBubble),
                  }}
                >
                  {msg.sender === 'user' && (
                    <div style={{ ...styles.speechTail, ...styles.userTail }}></div>
                  )}
                  {msg.sender === 'bot' && (
                    <div style={{ ...styles.speechTail, ...styles.botTail }}></div>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
            
            {loading && (
              <div style={{ ...styles.messageContainer, ...styles.botMessage }}>
                <div style={{ ...styles.messageBubble, ...styles.botBubble }}>
                  <div style={{ ...styles.speechTail, ...styles.botTail }}></div>
                  <div style={styles.typingIndicator}>
                    <div style={styles.typingDots}>
                      <div style={{ ...styles.typingDot }} className="typing-dot-1"></div>
                      <div style={{ ...styles.typingDot }} className="typing-dot-2"></div>
                      <div style={{ ...styles.typingDot }} className="typing-dot-3"></div>
                    </div>
                    Thinking...
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={styles.inputArea}>
            <form onSubmit={sendMessage} style={styles.inputForm}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about farming..."
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                }}
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                style={{
                  ...styles.sendButton,
                  opacity: loading || !input.trim() ? 0.5 : 1,
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!loading && input.trim()) {
                    Object.assign(e.target.style, styles.sendButtonHover);
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <div style={styles.shimmerOverlay}></div>
                ➤
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;