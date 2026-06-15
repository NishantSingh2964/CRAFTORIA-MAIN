import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { generateBasketImage } from '../services/aiService';
import { useProducts } from '../contexts/ProductContext';
import { usePersonalized } from '../contexts/PersonalizedContext';
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
import PersonalizationModal from '../components/Personalized/PersonalizationModal.jsx';

// Data
import {
  basketProducts,
  categories,
  emptyContactForm
} from '../components/Personalized/data';
import { stories } from '../assets.js';

const Personalized = () => {
  const [contactForm, setContactForm] = useState(emptyContactForm);
  const [activeCategory, setActiveCategory] = useState('All');
  const [basketItems, setBasketItems] = useState([]);
  const [basketQuantity, setBasketQuantity] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGeneratedImages, setAiGeneratedImages] = useState([]);
  const [isPersonalizingBasket, setIsPersonalizingBasket] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products: allProducts, fetchProducts, loading: productsLoading } = useProducts();
  const { personalizedProducts: livePersonalizedProducts, fetchPersonalizedProducts, loading: personalizedLoading } = usePersonalized();

  useEffect(() => {
    if (allProducts.length === 0) fetchProducts();
    fetchPersonalizedProducts();
  }, []);

  const displayStories = stories;

  // Use live data for the Basket Builder (Choose Gifts) section
  const basketProductsList = livePersonalizedProducts.map(p => ({
    id: p._id,
    _id: p._id,
    name: p.name,
    price: p.currentPrice,
    currentPrice: p.currentPrice,
    weight: 0.5,
    category: p.category || 'Extras',
    image: p.image,
    emoji: '🎁',
    productModel: 'PersonalizedProduct'
  }));

  // Fallback to mock data if no live products exist
  const effectiveBasketProducts = basketProductsList.length > 0 ? basketProductsList : basketProducts;

  const dynamicCategories = ['All', ...new Set(effectiveBasketProducts.map(p => p.category))];

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
    .map((basketItem) => {
      const product = effectiveBasketProducts.find((item) => item.id === basketItem.id);
      if (!product) return null;
      return {
        ...product,
        quantity: basketItem.quantity,
      };
    })
    .filter(Boolean);

  const filteredBasketProducts =
    activeCategory === 'All'
      ? effectiveBasketProducts
      : effectiveBasketProducts.filter((item) => item.category === activeCategory);

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

  // Called when user clicks 'Add to Cart' — opens personalization modal first
  const handleAddToCartClick = () => {
    if (selectedItems.length === 0) {
      toast.error('Please add at least one gift');
      return;
    }
    setIsPersonalizingBasket(true);
  };

  // Called after personalization modal confirms
  const handleAddBasketToCart = async (personalization = {}) => {
    if (selectedItems.length === 0) return false;
    
    try {
      // 1. Bundle all items into one "Hamper" product
      const totalHamperPrice = selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      const firstItem = selectedItems[0];

      const hamperDetails = {
        name: 'Personalized Gift Hamper',
        id: firstItem.id, // Use first item as base ID
        price: totalHamperPrice,
        image: aiGeneratedImages[0] || firstItem.image,
        productModel: 'PersonalizedProduct'
      };

      // 2. Add the list of all items as metadata
      const hamperMetadata = {
          ...personalization,
          isHamper: true,
          items: selectedItems.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price
          })),
          totalItems: itemCount
      };

      await addToCart(hamperDetails, 1, hamperMetadata);
      
      toast.success('Your custom hamper has been added to cart! 🎁');
      setBasketItems([]);
      setAiGeneratedImages([]);
      return true;
    } catch (error) {
      console.error('Failed to add basket to cart:', error);
      toast.error('Failed to craft your hamper');
      return false;
    }
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
          categories={dynamicCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          products={filteredBasketProducts}
          productsLoading={productsLoading}
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
          onAddToCart={handleAddToCartClick}
          onWhatsApp={() => { }}
          formatPrice={formatPrice}
          aiGeneratedImages={aiGeneratedImages}
        />
        <CatalogSection stories={displayStories} />
        <ExperienceForm
          form={contactForm}
          updateField={(f, v) => setContactForm(p => ({ ...p, [f]: v }))}
          onSubmit={handleContactSubmit}
          onWhatsApp={() => { }}
        />
      </div>
      {aiGeneratedImages.length > 0 && (
        <ArtisanalRevealModal
          image={aiGeneratedImages[0]}
          selectedItems={selectedItems}
          basketTotal={basketTotal}
          onOrderNow={() => { handleAddBasketToCart({}).then(success => { if(success) navigate('/cart'); }); }}
          onWhatsApp={() => { }}
          onClose={() => setAiGeneratedImages([])}
        />
      )}
      <PersonalizationModal
        isOpen={isPersonalizingBasket}
        onClose={() => setIsPersonalizingBasket(false)}
        product={{ name: 'Your Gift Basket', personalizationType: 'Both' }}
        onConfirm={(personalization) => handleAddBasketToCart(personalization)}
      />
    </div>
  );
};


export default Personalized;
