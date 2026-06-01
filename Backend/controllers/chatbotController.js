/**
 * Controller for handling Chatbot AI interactions using OpenRouter
 */
exports.chatWithAI = async (req, res) => {
    try {
        const { messages, websiteInfo } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ success: false, message: 'Invalid messages format' });
        }

        const systemPrompt = `
            STRICT SYSTEM RULE: You are a specialized customer support assistant ONLY for CRAFTORIA. 
            Your ONLY objective is to help with questions regarding CRAFTORIA's products, orders, delivery, and policies.

            Information: ${JSON.stringify(websiteInfo)}

            STRICT LIMITATIONS:
            1. NEVER answer questions about general knowledge, science, history, coding (e.g., "What is HTML?"), or anything unrelated to this shop.
            2. If a user asks a non-CRAFTORIA question, politely respond EXCLUSIVELY with: "I'm sorry, I am specifically designed to assist with CRAFTORIA-related queries only. I cannot provide information on this topic."
            3. If you are unsure if an answer is in the provided Information, refer the user to support@craftorio.in or WhatsApp.
            4. Be polite, concise, and professional. Use ₹ (INR) for all prices.
        `;

        const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "HTTP-Referer": "http://localhost:5173", // Optional, for OpenRouter rankings
                "X-Title": "CRAFTORIO Support", // Optional
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "openai/gpt-3.5-turbo", // Or any model you prefer
                "messages": [
                    { "role": "system", "content": systemPrompt },
                    ...messages
                ]
            })
        });

        const data = await openRouterResponse.json();

        if (data.error) {
            console.error('OpenRouter Error:', data.error);
            return res.status(500).json({ success: false, message: 'AI Service Error' });
        }

        res.status(200).json({
            success: true,
            reply: data.choices[0].message.content
        });

    } catch (error) {
        console.error('Chatbot Controller Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
