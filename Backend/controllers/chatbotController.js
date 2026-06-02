const Product = require('../models/Product');
const Occasion = require('../models/Occasion');

/**
 * Controller for handling Chatbot AI interactions using OpenRouter
 */
exports.chatWithAI = async (req, res) => {
    try {
        const { messages, websiteInfo } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ success: false, message: 'Invalid messages format' });
        }

        // Fetch products and occasions to provide context to the AI
        const products = await Product.find({ isAvailable: true }).select('name category currentPrice description recipients personalizationType');
        const occasions = await Occasion.find({ isActive: true }).select('name');

        const productSummary = products.map(p => 
            `- ${p.name} (Category: ${p.category}, Price: ₹${p.currentPrice}, Best for: ${p.recipients.join(', ')}, Customization: ${p.personalizationType}) - ${p.description.substring(0, 100)}...`
        ).join('\n');

        const occasionList = occasions.map(o => o.name).join(', ');

        const systemPrompt = `
            STRICT SYSTEM RULE: You are a specialized customer support and sales assistant for CRAFTORIA. 
            Your objective is to help with questions regarding CRAFTORIA's products, orders, delivery, and policies.

            WEBSITE INFO: ${JSON.stringify(websiteInfo)}

            OUR PRODUCTS:
            ${productSummary}

            SPECIAL OCCASIONS WE COVER: ${occasionList}

            USER ASSISTANCE GUIDELINES:
            1. PRODUCT INFO: If asked about products, provide details from the "OUR PRODUCTS" list. Always mention prices in ₹ (INR).
            2. GIFT RECOMMENDATIONS: If a user asks for a gift for someone (e.g., "gift for boyfriend") or for an occasion (e.g., "anniversary gift"), recommend specific products from our list based on the search intent.
            3. MISSING ITEMS: If a user asks for something we don't have (like "flowers"), politely explain that we specialize in personalized treasures and suggest a "Gift Combo" or a high-quality personalized item as a more lasting alternative.
            4. ORDER PROCESS: If asked how to order, explain this 5-step process:
               a. Browse our collections.
               b. Select a product and provide customization (name/photo).
               c. Add to cart.
               d. Pay securely via Stripe (Credit/Debit/UPI).
               e. Receive your personalized gift in 3-5 business days.

            STRICT LIMITATIONS:
            1. NEVER answer questions about general knowledge, science, history, coding, or anything unrelated to CRAFTORIA.
            2. If a user asks a non-CRAFTORIA question, politely respond: "I'm sorry, I am specifically designed to assist with CRAFTORIA-related queries only. I cannot provide information on this topic."
            3. If unsure, refer them to support@craftorio.in or WhatsApp.
            4. Be polite, enthusiastic, and professional.
        `;

        const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "CRAFTORIO Support",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "openai/gpt-3.5-turbo",
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
