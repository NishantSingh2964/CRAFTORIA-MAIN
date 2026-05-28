import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { generateBasketImage } from '../services/aiService';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/formatPrice';

// Assets
import basket from '../assets/home/basket.png?w=480&format=webp&quality=78';
import personalizeImage from '../assets/home/personalize.png?w=1200&format=webp&quality=80';

// Sub-components
import PersonalizedHero from '../components/Personalized/PersonalizedHero';
import BasketBuilder from '../components/Personalized/BasketBuilder';
import CatalogSection from '../components/Personalized/CatalogSection';
import ExperienceForm from '../components/Personalized/ExperienceForm';
import ArtisanalRevealModal from '../components/Personalized/ArtisanalRevealModal.jsx';

// Data
import { 
  basketProducts, 
  personalizedProducts, 
  categories, 
  emptyContactForm 
} from '../components/Personalized/data';

const Personalized = () => {
  const [contactForm, setContactForm] = useState(emptyContactForm);
  const [activeCategory, setActiveCategory] = useState('All');
  const [basketItems, setBasketItems] = useState([]);
  const [basketQuantity, setBasketQuantity] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGeneratedImages, setAiGeneratedImages] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    if (aiGeneratedImages.length > 0) {
      const scrollY = window.scrollY;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
  }, [aiGeneratedImages]);

  const selectedItems = basketItems
    .map((basketItem) => ({
      ...basketProducts.find((item) => item.id === basketItem.id),
      quantity: basketItem.quantity,
    }))
    .filter(Boolean);

  const filteredBasketProducts =
    activeCategory === 'All'
      ? basketProducts
      : basketProducts.filter((item) => item.category === activeCategory);

  const basketTotal = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const basketWeight = selectedItems.reduce((total, item) => total + item.weight * item.quantity, 0);
  const itemCount = selectedItems.reduce((total, item) => total + item.quantity, 0);

  const addBasketItem = (item) => {
    setBasketItems((prev) => {
      const existing = prev.find((basketItem) => basketItem.id === item.id);
      if (existing) {
        return prev.map((basketItem) =>
          basketItem.id === item.id
            ? { ...basketItem, quantity: basketItem.quantity + 1 }
            : basketItem
        );
      }
      return [...prev, { id: item.id, quantity: 1 }];
    });
  };

  const updateBasketItemQuantity = (itemId, nextQuantity) => {
    setBasketItems((prev) =>
      nextQuantity <= 0
        ? prev.filter((item) => item.id !== itemId)
        : prev.map((item) => (item.id === itemId ? { ...item, quantity: nextQuantity } : item))
    );
  };

  const handleGenerateAI = async () => {
    if (selectedItems.length === 0) {
      toast.error('Add items first!');
      return;
    }
    setIsGenerating(true);
    const loadingToast = toast.loading('Artisan AI is crafting your hamper...');
    try {
      const urls = await generateBasketImage(selectedItems);
      setAiGeneratedImages([urls[0]]);
      toast.success('Hamper ready!', { id: loadingToast });
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddBasketToCart = () => {
    if (selectedItems.length === 0) {
      toast.error('Please add at least one gift');
      return;
    }
    addToCart({
      id: `custom-basket-${Date.now()}`,
      name: `Custom Gift Basket (${itemCount} items)`,
      category: 'Personalized',
      currentPrice: formatPrice(basketTotal),
      originalPrice: formatPrice(basketTotal),
      image: aiGeneratedImages.length > 0 ? aiGeneratedImages[0] : selectedItems[0].image,
      description: selectedItems.map(i => `${i.name} x${i.quantity}`).join(', '),
      rating: 5,
      badge: 'Custom Basket',
    }, basketQuantity);
    toast.success('Added to cart');
    return true;
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    toast.success('Message sent successfully!');
    setContactForm(emptyContactForm);
  };

  return (
    <div className="relative bg-[#fcfbf9] min-h-screen pb-16 overflow-hidden">
      <PersonalizedHero image={personalizeImage} />
      <div className="site-container relative z-10 pt-16 sm:pt-20">
        <BasketBuilder 
           basket={basket}
           basketItems={basketItems}
           categories={categories}
           activeCategory={activeCategory}
           onCategoryChange={setActiveCategory}
           products={filteredBasketProducts}
           selectedItems={selectedItems}
           basketTotal={basketTotal}
           basketWeight={basketWeight}
           itemCount={itemCount}
           basketQuantity={basketQuantity}
           onQuantityChange={setBasketQuantity}
           onAddItem={addBasketItem}
           onUpdateItemQuantity={updateBasketItemQuantity}
           onClearBasket={() => setBasketItems([])}
           onGenerateAI={handleGenerateAI}
           isGenerating={isGenerating}
           onAddToCart={handleAddBasketToCart}
           onWhatsApp={() => {}} 
           formatPrice={formatPrice}
           aiGeneratedImages={aiGeneratedImages}
        />
        <CatalogSection products={personalizedProducts} />
        <ExperienceForm 
           form={contactForm}
           updateField={(f, v) => setContactForm(p => ({...p, [f]: v}))}
           onSubmit={handleContactSubmit}
           onWhatsApp={() => {}}
        />
      </div>
      {aiGeneratedImages.length > 0 && (
        <ArtisanalRevealModal 
          image={aiGeneratedImages[0]} 
          selectedItems={selectedItems} 
          basketTotal={basketTotal} 
          onOrderNow={() => { handleAddBasketToCart(); navigate('/cart'); }} 
          onWhatsApp={() => {}} 
          onClose={() => setAiGeneratedImages([])} 
        />
      )}
    </div>
  );
};

export default Personalized;
