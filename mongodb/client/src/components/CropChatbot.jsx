import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './CropChatbot.css';

const CropChatbot = ({ predictionContext }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: '👋 Hello! I\'m your AI farming assistant. I can help you understand your crop predictions, answer questions about soil health, fertilizers, and farming practices. How can I help you today?',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const quickQuestions = [
        "Why was this crop recommended?",
        "How can I improve my soil?",
        "What fertilizers should I use?",
        "When is the best planting time?",
        "How much water does this crop need?",
        "What are common pests for this crop?"
    ];

    const getContextualResponse = (userQuestion) => {
        const question = userQuestion.toLowerCase();

        // Context-aware responses based on prediction data
        if (predictionContext) {
            const { predictedCrop, N, P, K, ph, temperature, humidity, rainfall } = predictionContext;

            // Why this crop?
            if (question.includes('why') && (question.includes('crop') || question.includes('recommend'))) {
                let reasons = [];
                
                if (N >= 40 && P >= 30 && K >= 40) {
                    reasons.push('your soil has excellent nutrient levels');
                }
                if (ph >= 6.0 && ph <= 7.5) {
                    reasons.push('your soil pH is optimal');
                }
                if (temperature >= 20 && temperature <= 30) {
                    reasons.push('the temperature conditions are ideal');
                }
                if (rainfall >= 100) {
                    reasons.push('adequate rainfall for this crop');
                }

                return `${predictedCrop?.charAt(0).toUpperCase() + predictedCrop?.slice(1)} was recommended because ${reasons.length > 0 ? reasons.join(', ') + '.' : 'it matches your soil and environmental conditions well.'} This crop typically thrives in conditions similar to yours.`;
            }

            // Soil improvement
            if (question.includes('soil') && (question.includes('improve') || question.includes('better'))) {
                let suggestions = [];
                
                if (N < 40) suggestions.push('add nitrogen-rich fertilizers like Urea');
                if (P < 30) suggestions.push('apply phosphorus through DAP or SSP');
                if (K < 40) suggestions.push('use potassium fertilizers like MOP');
                if (ph < 6.0) suggestions.push('add lime to increase pH');
                if (ph > 7.5) suggestions.push('add sulfur to decrease pH');

                if (suggestions.length > 0) {
                    return `To improve your soil, I recommend: ${suggestions.join('; ')}. Also, consider adding organic matter like compost to enhance soil structure and microbial activity.`;
                }
                return 'Your soil is in good condition! To maintain it, regularly add organic matter, practice crop rotation, and avoid over-fertilization.';
            }

            // Fertilizer recommendations
            if (question.includes('fertilizer') || question.includes('fertiliser')) {
                let fertilizers = [];
                
                if (N < 40) fertilizers.push(`Nitrogen: Apply Urea (46-0-0) at 50-75 kg/acre`);
                if (P < 30) fertilizers.push(`Phosphorus: Apply DAP (18-46-0) at 20-35 kg/acre`);
                if (K < 40) fertilizers.push(`Potassium: Apply MOP (60% K2O) at 30-50 kg/acre`);

                if (fertilizers.length > 0) {
                    return `Based on your soil analysis:\n\n${fertilizers.join('\n')}\n\nApply fertilizers in split doses for better absorption and reduced wastage.`;
                }
                return 'Your nutrient levels are optimal! Apply light maintenance doses (10-15 kg/acre) of balanced NPK fertilizer.';
            }

            // Planting time
            if (question.includes('plant') && (question.includes('when') || question.includes('time'))) {
                const cropSeasons = {
                    rice: 'Kharif season (June-July)',
                    wheat: 'Rabi season (October-November)',
                    maize: 'Kharif season (June-July) or Rabi season (October-November)',
                    cotton: 'Kharif season (April-May)',
                    sugarcane: 'February-March or October-November',
                    jute: 'March-April',
                    pulses: 'Rabi season (October-November)'
                };
                
                const season = cropSeasons[predictedCrop?.toLowerCase()] || 'Based on your local climate, consult with local agricultural extension services';
                return `${predictedCrop?.charAt(0).toUpperCase() + predictedCrop?.slice(1)} is typically planted during ${season}. Ensure soil temperature and moisture conditions are favorable before sowing.`;
            }

            // Water requirements
            if (question.includes('water') || question.includes('irrigat')) {
                const waterNeeds = {
                    rice: 'high (1200-1500mm)',
                    wheat: 'moderate (450-650mm)',
                    maize: 'moderate (500-800mm)',
                    cotton: 'moderate (700-1300mm)',
                    sugarcane: 'high (1500-2500mm)',
                    pulses: 'low to moderate (300-500mm)'
                };
                
                const need = waterNeeds[predictedCrop?.toLowerCase()] || 'varies by variety';
                return `${predictedCrop?.charAt(0).toUpperCase() + predictedCrop?.slice(1)} has ${need} water requirements. With your current rainfall of ${rainfall}mm, ${rainfall >= 100 ? 'you may need minimal supplementary irrigation' : 'plan for adequate irrigation'}. Use drip or sprinkler systems for water efficiency.`;
            }

            // Pest management
            if (question.includes('pest') || question.includes('disease') || question.includes('insect')) {
                const pests = {
                    rice: 'stem borers, leaf folders, and blast disease',
                    wheat: 'aphids, rust diseases, and termites',
                    maize: 'fall armyworm, stem borers, and blight',
                    cotton: 'bollworms, whiteflies, and bacterial blight',
                    sugarcane: 'shoot borers, red rot, and smut'
                };
                
                const commonPests = pests[predictedCrop?.toLowerCase()] || 'various pests depending on the region';
                return `Common pests for ${predictedCrop} include ${commonPests}. Use integrated pest management (IPM): monitor regularly, use resistant varieties, practice crop rotation, and apply pesticides only when threshold levels are reached.`;
            }
        }

        // General farming questions
        if (question.includes('npk') || question.includes('nutrient')) {
            return 'NPK refers to Nitrogen (N), Phosphorus (P), and Potassium (K) - the three primary nutrients plants need. N promotes leafy growth, P supports root and flower development, and K enhances overall plant health and disease resistance.';
        }

        if (question.includes('ph') && question.includes('important')) {
            return 'Soil pH (6.0-7.5 is ideal for most crops) affects nutrient availability. Too acidic (<6.0) or alkaline (>7.5) soil can lock up nutrients, making them unavailable to plants even if present in the soil.';
        }

        if (question.includes('organic') && question.includes('farming')) {
            return 'Organic farming uses natural fertilizers (compost, manure), biological pest control, and crop rotation. It improves soil health, reduces chemical residues, and can fetch premium prices. However, it requires more knowledge and may have lower initial yields.';
        }

        if (question.includes('crop rotation')) {
            return 'Crop rotation involves growing different crops in sequence on the same land. Benefits include: breaking pest and disease cycles, improving soil fertility (especially with legumes), reducing soil erosion, and improving soil structure.';
        }

        if (question.includes('compost') || question.includes('manure')) {
            return 'Organic matter like compost and manure improves soil structure, water retention, microbial activity, and provides slow-release nutrients. Apply 5-10 tons per acre annually for best results. Well-decomposed compost is better than fresh manure.';
        }

        // Default response
        return "I'm here to help with crop predictions, soil health, fertilizers, and farming practices. Try asking about:\n\n• Why a specific crop was recommended\n• How to improve your soil\n• Fertilizer recommendations\n• Planting times and seasons\n• Water requirements\n• Pest and disease management\n\nOr click one of the quick question buttons below!";
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            type: 'user',
            text: inputMessage,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        // Simulate AI thinking delay
        setTimeout(() => {
            const botResponse = {
                id: messages.length + 2,
                type: 'bot',
                text: getContextualResponse(inputMessage),
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 800 + Math.random() * 700);
    };

    const handleQuickQuestion = (question) => {
        setInputMessage(question);
        setTimeout(() => {
            handleSendMessage();
        }, 100);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTimestamp = (date) => {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    return (
        <>
            {/* Chat Toggle Button */}
            {!isOpen && (
                <button 
                    className="chat-toggle-btn"
                    onClick={() => setIsOpen(true)}
                    title="Open AI Chat Assistant"
                >
                    💬
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="crop-chatbot">
                    <div className="chat-header">
                        <div className="chat-header-info">
                            <div className="bot-avatar">🤖</div>
                            <div className="bot-info">
                                <h3>AI Farming Assistant</h3>
                                <span className="bot-status">
                                    <span className="status-dot"></span>
                                    Online
                                </span>
                            </div>
                        </div>
                        <button 
                            className="chat-close-btn"
                            onClick={() => setIsOpen(false)}
                            title="Close chat"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((message) => (
                            <div 
                                key={message.id} 
                                className={`message ${message.type}`}
                            >
                                {message.type === 'bot' && (
                                    <div className="message-avatar">🤖</div>
                                )}
                                <div className="message-content">
                                    <div className="message-text">{message.text}</div>
                                    <div className="message-timestamp">
                                        {formatTimestamp(message.timestamp)}
                                    </div>
                                </div>
                                {message.type === 'user' && (
                                    <div className="message-avatar user">👤</div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className="message bot typing">
                                <div className="message-avatar">🤖</div>
                                <div className="message-content">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Questions */}
                    <div className="quick-questions">
                        <p className="quick-questions-label">Quick Questions:</p>
                        <div className="quick-questions-grid">
                            {quickQuestions.map((question, index) => (
                                <button
                                    key={index}
                                    className="quick-question-btn"
                                    onClick={() => handleQuickQuestion(question)}
                                >
                                    {question}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="chat-input-container">
                        <textarea
                            ref={inputRef}
                            className="chat-input"
                            placeholder="Ask me anything about farming..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            rows={1}
                        />
                        <button 
                            className="chat-send-btn"
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isTyping}
                        >
                            <span className="send-icon">📤</span>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default CropChatbot;
