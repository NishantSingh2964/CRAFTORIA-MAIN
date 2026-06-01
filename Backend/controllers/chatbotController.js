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
            You are a helpful and friendly customer support AI for CRAFTORIO, an Indian personalized gift shop.
            Use the following information to answer user queries accurately:
            ${JSON.stringify(websiteInfo)}

            Guidelines:
            - Be polite, professional, and empathetic.
            - If you don't know the answer, ask the user to contact support via WhatsApp or email (support@craftorio.in).
            - Keep answers concise and relevant.
            - Format prices in ₹ (INR).
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
