import taddy from '../../assets/home/Taddy.png?w=480&format=webp&quality=78';
import flowers from '../../assets/home/flowers.png?w=480&format=webp&quality=78';
import chocolates from '../../assets/home/chocolates.png?w=480&format=webp&quality=78';
import balloon from '../../assets/home/Ballon.png?w=480&format=webp&quality=78';
import candal from '../../assets/home/Candal.png?w=480&format=webp&quality=78';
import watches from '../../assets/home/watches.png?w=480&format=webp&quality=78';

export const basketProducts = [
  {
    id: 'teddy',
    name: 'Teddy Bear',
    price: 899,
    weight: 0.45,
    category: 'Soft Toys',
    image: taddy,
    emoji: '🧸',
  },
  {
    id: 'chocolates',
    name: 'Chocolates',
    price: 1499,
    weight: 0.35,
    category: 'Chocolates',
    image: chocolates,
    emoji: '🍫',
  },
  {
    id: 'roses',
    name: 'Red Roses',
    price: 1299,
    weight: 0.55,
    category: 'Flowers',
    image: flowers,
    emoji: '🌹',
  },
  {
    id: 'balloon',
    name: 'Birthday Balloon',
    price: 799,
    weight: 0.1,
    category: 'Extras',
    image: balloon,
    emoji: '🎈',
  },
  {
    id: 'candle',
    name: 'Scented Candle',
    price: 699,
    weight: 0.4,
    category: 'Extras',
    image: candal,
    emoji: '🕯️',
  },
  {
    id: 'watches',
    name: 'Mens Watch',
    price: 699,
    weight: 0.4,
    category: 'Extras',
    image: watches,
    emoji: '⌚',
  },
];

export const personalizedProducts = [
  {
    name: 'Monogrammed Leather Journal',
    price: '₹4,999',
    tag: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop',
    desc: 'Handcrafted genuine leather refillable notebook binder, personalized with premium metal hot-stamping.'
  },
  {
    name: 'Engraved Brass Horizon Compass',
    price: '₹6,499',
    tag: 'Premium Keepsake',
    image: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?q=80&w=600&auto=format&fit=crop',
    desc: 'A heavy solid brass maritime compass with customized lid engraving inside a protective wood case.'
  },
  {
    name: 'Custom Script Name Necklace',
    price: '₹8,499',
    tag: 'Fine Jewelry',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
    desc: 'Hand-shaped solid 18k gold plated sterling silver script pendant custom cut to your chosen monogram.'
  },
  {
    name: 'Walnut Wood Sound Amplifier',
    price: '₹6,999',
    tag: 'Exclusive Desk',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600&auto=format&fit=crop',
    desc: 'Naturally resonating premium solid dark walnut wood phone dock with personalized initials engraving.'
  }
];

export const categories = ['All', 'Soft Toys', 'Chocolates', 'Flowers', 'Extras'];

export const emptyContactForm = {
  fullName: '',
  email: '',
  phone: '',
  subject: 'Custom personalized order',
  message: '',
};
