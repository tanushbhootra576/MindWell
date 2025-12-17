const express = require('express');
const router = express.Router();
const Groq = require("groq-sdk");
const auth = require('../middleware/auth');

// Initialize Groq API
const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
    console.error("GROQ_API_KEY is missing in .env file");
}
const groq = new Groq({ apiKey });

// @route   POST /api/ai/chat
// @desc    Get AI response
// @access  Private
router.post('/chat', auth, async (req, res) => {
    try {
        const { message, userContext } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        // Build personalized system prompt with user context
        let systemPrompt = `You are a compassionate and helpful mental wellness companion named MindWell. 
        Your goal is to provide supportive, non-judgmental, and empathetic responses. 
        If a user expresses serious distress or self-harm, gently encourage them to seek professional help or contact emergency services.
        Keep responses concise (under 100 words) unless asked for more detail.`;

        // Add user context to personalize responses
        if (userContext) {
            const { name, age, goals, mentalHealthFocus, healthInterests } = userContext;
            let contextInfo = '';

            if (name) contextInfo += `The user's name is ${name}. `;
            if (age) contextInfo += `They are ${age} years old. `;
            if (goals && goals.length > 0) contextInfo += `Their wellness goals include: ${goals.join(', ')}. `;
            if (mentalHealthFocus && mentalHealthFocus.length > 0) contextInfo += `They're focusing on: ${mentalHealthFocus.join(', ')}. `;
            if (healthInterests && healthInterests.length > 0) contextInfo += `They're interested in: ${healthInterests.join(', ')}. `;

            if (contextInfo) {
                systemPrompt += `\n\nUser Profile Information:\n${contextInfo}\nPersonalize your responses based on their profile.`;
            }
        }

        // Use Groq's llama model for fast inference
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            model: "llama-3.3-70b-versatile", // Fast and capable model
            temperature: 0.7,
            max_tokens: 500,
        });

        const text = chatCompletion.choices[0]?.message?.content || "I'm here to help. Could you tell me more?";

        res.json({ reply: text });
    } catch (error) {
        console.error("AI Chat Error Details:", error);
        // Send more specific error to client for debugging
        res.status(500).json({
            message: `AI Error: ${error.message || "Unknown error"}`,
            error: error.message
        });
    }
});

module.exports = router;