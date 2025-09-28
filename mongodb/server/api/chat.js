const express = require('express');
const router = express.Router();

const { OpenAI } = require('openai');


const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_API_KEY,
});


router.post('/', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: 'No message provided.' });
  
  // Check if HF API key is configured
  if (!process.env.HF_API_KEY || process.env.HF_API_KEY === 'your_huggingface_api_key_here') {
    console.log('🔑 Hugging Face API key not configured, using mock chatbot responses');
    
    // Simple mock responses based on keywords
    const lowerMessage = message.toLowerCase();
    let reply = '';
    
    if (lowerMessage.includes('weather')) {
      reply = '🌤️ For weather information, please use our weather feature. You can check current weather conditions for your area.';
    } else if (lowerMessage.includes('crop') || lowerMessage.includes('plant')) {
      reply = '🌱 Great question about crops! Consider factors like soil type, climate, season, and water availability when choosing crops. Our crop prediction tool can help you make informed decisions.';
    } else if (lowerMessage.includes('soil')) {
      reply = '🌍 Soil health is crucial for farming! Test your soil pH, nutrients, and organic matter content. Different crops thrive in different soil conditions.';
    } else if (lowerMessage.includes('water') || lowerMessage.includes('irrigation')) {
      reply = '💧 Proper irrigation is essential for crop success. Consider drip irrigation for water efficiency, and monitor soil moisture regularly.';
    } else if (lowerMessage.includes('pest') || lowerMessage.includes('disease')) {
      reply = '🐛 Integrated Pest Management (IPM) is the best approach. Use natural predators, crop rotation, and resistant varieties when possible.';
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      reply = '👋 Hello! I\'m your agricultural assistant. Ask me about crops, farming practices, soil management, or weather-related farming questions!';
    } else {
      reply = '🌾 I\'m here to help with your farming questions! You can ask about crop selection, soil management, irrigation, pest control, or use our other tools for weather and crop predictions.';
    }
    
    return res.json({ reply });
  }
  
  try {
    const chatCompletion = await client.chat.completions.create({
      model: "openai/gpt-oss-120b:novita",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });
    const reply = chatCompletion.choices?.[0]?.message?.content || 'Sorry, I could not understand.';
    res.json({ reply });
  } catch (err) {
    console.error('Chat API error:', err);
    res.status(500).json({ reply: 'Sorry, I could not get a response from the AI.' });
  }
});

module.exports = router;