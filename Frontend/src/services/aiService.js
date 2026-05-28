/**
 * AI Service using Pollinations.ai for high-quality artisan gift basket pre-visualization.
 */
export const generateBasketImage = async (items) => {
  if (!items || items.length === 0) throw new Error('Basket is empty');

  // Construct a professional artisanal prompt
  const query = items.map(item => `${item.quantity} ${item.name}`).join(', ');
  const promptText = `luxury gift basket with ${query}, professional studio photography, white background`;
  console.log('📝 [AI] Direct Prompt:', promptText);
  const prompt = encodeURIComponent(promptText);

  // Skip proxies and go direct to the generation engine with a wide aspect ratio
  const directUrl = `https://image.pollinations.ai/prompt/${prompt}?width=1080&height=600&seed=${Math.floor(Math.random() * 99999)}&nologo=true`;

  return [directUrl];
};
