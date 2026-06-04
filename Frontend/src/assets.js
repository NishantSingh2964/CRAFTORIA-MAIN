// Product & asset images — resized WebP at build time (vite-imagetools)
import image1 from './assets/home/image1.png?w=480&format=webp&quality=70';
import image2 from './assets/home/image2.png?w=440&format=webp&quality=52';
import image3 from './assets/home/image3.png?w=480&format=webp&quality=68';
import image4 from './assets/home/image4.png?w=480&format=webp&quality=70';
import image5 from './assets/home/image5.png?w=480&format=webp&quality=70';
import image6 from './assets/home/image6.png?w=480&format=webp&quality=70';
import image7 from './assets/home/image7.png?w=480&format=webp&quality=70';
import image8 from './assets/home/image8.png?w=480&format=webp&quality=70';
import image9 from './assets/home/image9.png?w=480&format=webp&quality=70';
import image10 from './assets/home/image10.png?w=480&format=webp&quality=70';
import image11 from './assets/home/image11.png?w=480&format=webp&quality=70';
import image12 from './assets/home/image12.png?w=480&format=webp&quality=70';
import image13 from './assets/home/image13.png?w=480&format=webp&quality=70';

import boyfriendImg from './assets/home/boyfriend.png?w=400&format=webp&quality=74';
import girlfriendImg from './assets/home/girlfriend.png?w=400&format=webp&quality=74';
import husbandImg from './assets/home/Husband.png?w=400&format=webp&quality=74';
import wifeImg from './assets/home/Wife.png?w=400&format=webp&quality=74';
import fatherImg from './assets/home/Father.png?w=400&format=webp&quality=74';
import motherImg from './assets/home/Mother.png?w=400&format=webp&quality=74';
import grandfatherImg from './assets/home/GranfFather.png?w=400&format=webp&quality=74';
import basket from './assets/home/basket.png?w=360&format=webp&quality=74';
import flowers from './assets/home/Ballon.png?w=360&format=webp&quality=74';
import taddy from './assets/home/chocolates.png?w=360&format=webp&quality=74';
import chocolates from './assets/home/flowers.png?w=360&format=webp&quality=74';
import balloon from './assets/home/Candal.png?w=360&format=webp&quality=74';
import candal from './assets/home/Taddy.png?w=360&format=webp&quality=74';
import watches from './assets/home/watches.png?w=360&format=webp&quality=74';

export const products = [
  {
    id: 1,
    name: 'Elegant Red Velvet Rose Bouquet',
    category: 'Flowers & Cakes',
    originalPrice: '₹1,799',
    currentPrice: '₹1,299',
    image: image1,
    description: 'An elegant arrangement of twelve freshly cut premium red velvet roses, wrapped beautifully in premium gold-accented matte black craft paper with a tailored satin crimson ribbon.',
    rating: 4.9,
    badge: 'Best Seller',
    testimonials: [
      {
        user: 'Ananya Sharma',
        comment: 'Absolutely stunning roses! They smelled divine and lasted for over a week. Packaging was extremely premium.'
      },
      {
        user: 'Vikram Mehta',
        comment: 'Surprised my wife on our anniversary. The bouquet looked exactly like the pictures, if not better!'
      }
    ]
  },
  {
    id: 2,
    name: 'Royal Monogram Personalized Keepsake Box',
    category: 'Personalized',
    originalPrice: '₹2,199',
    currentPrice: '₹1,599',
    image: image2,
    description: 'A solid mahogany wooden keepsake box lined with luxury velvet inside, custom engraved on the top plate with your monogram, message, or special date.',
    rating: 5.0,
    badge: 'Exclusive',
    testimonials: [
      {
        user: 'Rohan Malhotra',
        comment: 'Beautiful wood craftsmanship! The engraving details are highly refined and precise. Made a perfect wedding gift.'
      },
      {
        user: 'Priyanka Sen',
        comment: 'A lovely box to store my old letters. The personalized brass plate looks exceptionally luxurious.'
      }
    ]
  },
  {
    id: 3,
    name: 'Luxury French Lavender Scented Candle Set',
    category: 'Hampers & Decor',
    originalPrice: '₹999',
    currentPrice: '₹699',
    image: image3,
    description: 'An exquisite hand-poured soy wax candle infused with natural organic French lavender essential oils, complete with a natural crackling wood wick and luxury glass jar.',
    rating: 4.8,
    badge: 'Popular',
    testimonials: [
      {
        user: 'Divya Iyer',
        comment: 'The scent throw is incredible! It fills the entire room within minutes. Relaxing crackling sound.'
      }
    ]
  },
  {
    id: 4,
    name: 'Plush Custom Embroidery Teddy Bear',
    category: 'Keepsakes',
    originalPrice: '₹1,299',
    currentPrice: '₹899',
    image: image4,
    description: 'Super-soft, allergen-free plush cream teddy bear wearing a customized miniature knitted sweater embroidered with your name or special message.',
    rating: 4.7,
    badge: 'Trending',
    testimonials: [
      {
        user: 'Karan Johar',
        comment: 'So soft and cuddly! The embroidery was incredibly neat. My daughter absolutely loved it.'
      }
    ]
  },
  {
    id: 5,
    name: 'Grand Gourmet Celebration Gift Hamper',
    category: 'Luxury Hampers',
    originalPrice: '₹3,499',
    currentPrice: '₹2,499',
    image: image5,
    description: 'Our ultimate luxury hamper featuring hand-rolled dark chocolate hazelnut pralines, premium roasted almonds, cold-pressed fruit syrups, and an organic herbal tea canister.',
    rating: 4.9,
    badge: 'Best Seller',
    testimonials: [
      {
        user: 'Sandeep Bansal',
        comment: 'Best gift box ever! Everything inside was of premium quality, and the heavy trunk container is highly reusable.'
      },
      {
        user: 'Neha Kapoor',
        comment: 'Sent this to a corporate client. They were absolutely wowed by the scale and sophistication of the presentation!'
      }
    ]
  },
  {
    id: 6,
    name: 'Gilded Golden Hazelnut Truffle Chest',
    category: 'Luxury Hampers',
    originalPrice: '₹1,999',
    currentPrice: '₹1,499',
    image: image6,
    description: 'An opulent brass-embellished emerald green treasure chest holding 24 gourmet, hand-rolled gilded hazelnut Belgian pralines.',
    rating: 5.0,
    badge: 'Chef Choice',
    testimonials: [
      {
        user: 'Meera Rajput',
        comment: 'The chocolates melted beautifully in the mouth. The golden chest feels heavy and premium.'
      }
    ]
  },
  {
    id: 7,
    name: 'Prosperity Imperial Jade Plant Duo',
    category: 'Plants & Corporate',
    originalPrice: '₹1,199',
    currentPrice: '₹799',
    image: image7,
    description: 'A matching pair of lucky high-grade dwarf Jade plants housed in custom-sculpted white self-watering ceramic pots, adorned with golden accent plates.',
    rating: 4.8,
    badge: 'Eco Friendly',
    testimonials: [
      {
        user: 'Amit Trivedi',
        comment: 'Very healthy plants, arrived in perfect condition with triple-layered protective cardboard. Pot looks elegant.'
      }
    ]
  },
  {
    id: 8,
    name: 'Walnut Wood Executive Tech Organizer',
    category: 'Corporate Gifts',
    originalPrice: '₹2,799',
    currentPrice: '₹1,999',
    image: image8,
    description: 'Handcrafted solid walnut wood desk companion with integrated fast wireless phone charger, pen holder slot, and magnetic paperclip tray.',
    rating: 4.9,
    badge: 'New Arrival',
    testimonials: [
      {
        user: 'Rahul Roy',
        comment: 'Decluttered my study desk completely! Highly functional, heavy wood grain feels premium. Fast charging works great.'
      }
    ]
  },
  {
    id: 9,
    name: 'Monogrammed Silver Keepsake Necklace',
    category: 'Personalized',
    originalPrice: '₹2,499',
    currentPrice: '₹1,899',
    image: image9,
    description: 'A highly polished custom initial pendant made from pure 925 sterling silver, complete with an adjustable box chain and premium gift packaging.',
    rating: 4.9,
    badge: 'Premium Jewelry',
    testimonials: [
      {
        user: 'Tanvi Shah',
        comment: 'Shines so beautifully! Doesn’t tarnish even after daily wear. The personalized monogram is exceptionally graceful.'
      }
    ]
  },
  {
    id: 10,
    name: 'Exotic Purple Orchid & Vanilla Sponge',
    category: 'Flowers & Cakes',
    originalPrice: '₹2,299',
    currentPrice: '₹1,699',
    image: image10,
    description: 'A magnificent combination of exotic fresh purple orchids arranged in a glass vase, paired with our signature half-kg French vanilla layered buttercream sponge cake.',
    rating: 4.7,
    badge: 'Most Loved',
    testimonials: [
      {
        user: 'Kritika Roy',
        comment: 'The orchids are fresh and the cake was incredibly soft, moist, and not overly sweet. Highly recommended combo!'
      }
    ]
  },
  {
    id: 11,
    name: 'Monogram Italian Leather Travel Duo',
    category: 'Personalized',
    originalPrice: '₹2,999',
    currentPrice: '₹2,199',
    image: image11,
    description: 'Matching full-grain tan Italian leather passport cover and baggage tag set, hot-stamped with your selected custom initials in gold leaf lettering.',
    rating: 5.0,
    badge: 'Luxury Travel',
    testimonials: [
      {
        user: 'Siddharth Sen',
        comment: 'Top quality leather. Smells beautiful, soft to touch, and the gold lettering is very crisp.'
      }
    ]
  },
  {
    id: 12,
    name: 'Sovereign Blooming White Tea Gift Kit',
    category: 'Luxury Hampers',
    originalPrice: '₹1,999',
    currentPrice: '₹1,399',
    image: image12,
    description: 'A set of twelve rare blooming white tea flower pods housed in custom tins, complete with a double-walled clear borosilicate glass infuser mug.',
    rating: 4.8,
    badge: 'Trending',
    testimonials: [
      {
        user: 'Pallavi Joshi',
        comment: 'Watching the tea flower bloom is such a relaxing ritual. The taste is incredibly smooth and floral.'
      }
    ]
  },
  {
    id: 13,
    name: 'Midnight Crimson Rose Dome',
    category: 'Flowers & Cakes',
    originalPrice: '₹2,199',
    currentPrice: '₹1,499',
    image: image13,
    description: 'A single, perfectly preserved red rose housed inside a thick borosilicate glass dome with warm glowing LED string lights, standing on a dark wooden base.',
    rating: 5.0,
    badge: 'Romantic',
    testimonials: [
      {
        user: 'Ishaan Verma',
        comment: 'Looks like the rose from Beauty and the Beast! Exceptional warm glow. Makes a magic nightstand light.'
      }
    ]
  },
  {
    id: 14,
    name: 'Premium Boyfriend E-Gift Card',
    category: 'Gift Cards',
    originalPrice: '₹2,000',
    currentPrice: '₹1,500',
    image: basket,
    description: 'Show your boyfriend how much you care with a customizable E-Gift Card. Let him choose his favorite premium hampers, personalized accessories, or gourmet treats.',
    rating: 4.8,
    badge: 'Popular',
    testimonials: [
      {
        user: 'Aditi Sharma',
        comment: 'He was so happy to receive this! He got a customized tech organizer which he absolutely loves.'
      }
    ]
  },
  {
    id: 15,
    name: 'Premium Girlfriend E-Gift Card',
    category: 'Gift Cards',
    originalPrice: '₹2,000',
    currentPrice: '₹1,500',
    image: flowers,
    description: 'Celebrate your girlfriend with an exquisite E-Gift Card. Perfect for letting her pick from our collections of preserved rose domes, luxury spa sets, or custom jewelry.',
    rating: 4.9,
    badge: 'Trending',
    testimonials: [
      {
        user: 'Rahul Verma',
        comment: 'Super convenient and beautifully designed gift card. She loved selecting her own rose dome!'
      }
    ]
  },
  {
    id: 16,
    name: 'Premium Husband E-Gift Card',
    category: 'Gift Cards',
    originalPrice: '₹3,000',
    currentPrice: '₹2,500',
    image: taddy,
    description: 'A special E-Gift Card for your husband. Let him choose from our finest executive tech organizers, leather travel kits, or premium gourmet hampers.',
    rating: 4.9,
    badge: 'Best Seller',
    testimonials: [
      {
        user: 'Sneha Kapoor',
        comment: 'The perfect anniversary gift. He loved being able to select his own Italian leather travel duo.'
      }
    ]
  },
  {
    id: 17,
    name: 'Premium Wife E-Gift Card',
    category: 'Gift Cards',
    originalPrice: '₹3,000',
    currentPrice: '₹2,500',
    image: chocolates,
    description: 'Delight your wife with a premium E-Gift Card. Allows her to choose from our high-end personalized jewelry, luxury home decor, or floral combos.',
    rating: 5.0,
    badge: 'Most Loved',
    testimonials: [
      {
        user: 'Amit Saxena',
        comment: 'She used it to order the silver keepsake necklace and orchids. Beautiful presentation.'
      }
    ]
  },
  {
    id: 18,
    name: 'Premium Father E-Gift Card',
    category: 'Gift Cards',
    originalPrice: '₹2,500',
    currentPrice: '₹2,000',
    image: balloon,
    description: "Honour your dad with a Father's Day or birthday E-Gift Card. Let him choose from our curated collections of desk accessories, plants, or premium tea kits.",
    rating: 4.8,
    badge: 'Strongest',
    testimonials: [
      {
        user: 'Rohit Mehta',
        comment: 'Gave this to my father. He picked the Jade plant duo and was very impressed with the quality.'
      }
    ]
  },
  {
    id: 19,
    name: 'Premium Mother E-Gift Card',
    category: 'Gift Cards',
    originalPrice: '₹2,500',
    currentPrice: '₹2,000',
    image: candal,
    description: 'Show your love for mother with a warm E-Gift Card. Let her choose from beautiful blooming teas, custom keepsake boxes, or fresh floral arrangements.',
    rating: 4.9,
    badge: 'Warmest',
    testimonials: [
      {
        user: 'Pooja Iyer',
        comment: 'She loved the presentation of the e-gift card and chose the blooming white tea kit.'
      }
    ]
  },
  {
    id: 20,
    name: 'Premium Grandfather E-Gift Card',
    category: 'Gift Cards',
    originalPrice: '₹2,000',
    currentPrice: '₹1,500',
    image: watches,
    description: 'A thoughtful E-Gift Card for your grandfather. Let him select from our calming botanical collections, custom tea sets, or comfortable keepsakes.',
    rating: 4.9,
    badge: 'Wise',
    testimonials: [
      {
        user: 'Nikhil Sen',
        comment: 'Very easy for my grandfather to use. He picked the Jade plants and was delighted.'
      }
    ]
  }
];


// Helper to retrieve products by category
export const getProductsByCategory = (category) => {
  if (category === 'All') return products;
  return products.filter(p => p.category === category);
};

// Recipient categories list for custom menus
export const recipientsList = [
  { id: 1, name: 'Boyfriend', image: boyfriendImg, badge: 'Popular' },
  { id: 2, name: 'Girlfriend', image: girlfriendImg, badge: 'Trending' },
  { id: 3, name: 'Husband', image: husbandImg, badge: 'Best Seller' },
  { id: 4, name: 'Wife', image: wifeImg, badge: 'Most Loved' },
  { id: 5, name: 'Father', image: fatherImg, badge: 'Strongest' },
  { id: 6, name: 'Mother', image: motherImg, badge: 'Warmest' },
  { id: 7, name: 'Grandfather', image: grandfatherImg, badge: 'Wise' }
];

// Occasions list for occasion curation grid
export const occasionsList = [
  {
    name: 'Birthdays',
    filter: 'Birthday',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop',
    desc: 'Celebrate another beautiful year of their journey with customized hampers, gourmet desserts, and personalized keepsakes.',
    tag: 'Celebrate Life'
  },
  {
    name: 'Anniversaries',
    filter: 'Anniversary',
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop',
    desc: 'Honour milestones of togetherness with sophisticated matching watches, luxury floral arrangements, and gold-leaf embossed memoirs.',
    tag: 'Eternal Love'
  },
  {
    name: "Valentine's Day",
    filter: "Valentine's Day",
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop',
    desc: 'Whisper words of devotion through rare heart-shaped velvet chocolate boxes, bespoke message frames, and beautiful red rose cascades.',
    tag: 'Deep Devotion'
  },
  {
    name: 'Housewarmings',
    filter: 'Housewarming',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop',
    desc: 'Congratulate them on their fresh beginnings with rich organic cedarwood diffuser sets, handcrafted wind chimes, and walnut serving trays.',
    tag: 'Warm Welcomes'
  },
  {
    name: 'Corporate Milestone',
    filter: 'Corporate Milestone',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop',
    desc: 'Cultivate strong professional bonds through executive smart notebooks, matte black brass pens, and custom branded hampers.',
    tag: 'True Excellence'
  },
  {
    name: 'Congratulations',
    filter: 'Congratulations',
    image: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=600&auto=format&fit=crop',
    desc: 'Applaud their triumphs and success with glittering celebratory champagne flutes, dry fruit combinations, and lucky jade plants.',
    tag: 'Cheers to Success'
  },
  {
    name: "Mother's & Father's Day",
    filter: "Parents Appreciation",
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop',
    desc: "Express deep gratitude to the ones who built your world with preserved flowers, organic beauty kits, and personalized message hampers.",
    tag: "Heartfelt Thanks"
  },
  {
    name: 'Graduation Milestones',
    filter: 'Graduation',
    image: image8,
    desc: "Honor their hard work and major educational milestones with sleek leather portfolios, premium fountain pens, and executive desk accessories.",
    tag: "Bright Futures"
  },
  {
    name: 'Baby Showers',
    filter: 'Baby Shower',
    image: image4,
    desc: "Welcome the precious new arrival with ultra-soft allergen-free plush teddy bears, certified organic baby skincare sets, and engraved keepsake boxes.",
    tag: "Pure Innocence"
  }
];

export const stories = [
  {
    id: 'leather-journal-story',
    name: 'The Traveler\'s Legacy',
    tag: 'Reader Story',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop',
    description: 'How a monogrammed leather journal became a bridge between a father and daughter across oceans.',
    sections: [
      {
        title: "A Departure to Remember",
        paragraphs: [
          "When Sarah moved to London for her PhD, her father gave her a Monogrammed Leather Journal from CRAFTORIA. He had it embossed with her late grandfather's initials, 'J.R.S.', in a timeless serif font. It wasn't just a notebook; it was a heavy, tan-colored artifact of genuine full-grain leather that smelled of oak and old libraries.",
          "What started as a simple diary in a rainy studio apartment in South Kensington quickly evolved into something far more profound. Sarah began to treat the pages with a certain reverence. She didn't just write; she documented. She sketched the intricate gargoyles of Westminster Abbey, pressed wildflowers from her weekend trips to the Cotswolds between the thick ivory pages, and recorded the quiet observations of a young woman coming into her own in a foreign land."
        ]
      },
      {
        title: "The Silent Companion",
        paragraphs: [
          "The journal became a silent companion during the lonely nights of her first winter. 'I would sit in a small cafe called The Muffin Man, and as the steam rose from my tea, I would unpack my day onto those pages,' she recalls. 'The resistance of the paper against my fountain pen felt grounding. It made my transient life feel permanent.'",
          "There were days when the academic pressure felt insurmountable, and the grey London sky seemed to weigh down on her. In those moments, she would turn to the first page, where her father had written a small note: 'Your story is just beginning. Write it well.' That single sentence, preserved in ink on premium paper, gave her the strength to continue."
        ]
      },
      {
        title: "A Return to Home",
        paragraphs: [
          "On her first trip back home to Mumbai, nearly a year later, she sat with her father in their sun-drenched balcony. She placed the journal on his lap. As he ran his weathered fingers over the embossed initials of his own father, his eyes misted over. They spent hours going through it—the sketches, the pressed petals, and the recorded fears and triumphs of a daughter he had missed dearly.",
          "'It's not just a book, Sarah,' he said, his voice thick with emotion. 'It's the first volume of your legacy. You've carried our family name to places your grandfather only ever dreamed of.' Today, that journal is nearly full, its leather softened by time and touch, serving as a living bridge across oceans and generations."
        ]
      }
    ],
    relatedProductId: 2,
    quote: "A journal is a mirror to the soul, and CRAFTORIA made mine look beautiful.",
    author: "Sarah J., London"
  },
  {
    id: 'brass-compass-story',
    name: 'Finding North Together',
    tag: 'Anniversary Special',
    image: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?q=80&w=600&auto=format&fit=crop',
    description: 'An engraved brass compass that guided a couple through their first year of marriage.',
    sections: [
      {
        title: "The Restless Spirits",
        paragraphs: [
          "Vikram and Ananya were always explorers, their relationship forged in the high peaks of the Himalayas and the quiet backwaters of Kerala. For their first anniversary, Ananya wanted something that captured the essence of their restless spirits and their steady commitment. She chose the Engraved Brass Horizon Compass from CRAFTORIA.",
          "The compass was a heavy, solid piece of maritime engineering. Its polished lid hid a secret—a custom engraving that Ananya had labored over for weeks. 'So you always find your way back to me,' it read, etched in a graceful script that contrasted with the rugged metal."
        ]
      },
      {
        title: "Alone in the Atlantic",
        paragraphs: [
          "Months into their marriage, Vikram accepted a high-stakes maritime engineering project that required him to be at sea for weeks at a time. The transition was difficult. In the middle of the Atlantic, with the vast, dark horizon stretching endlessly in every direction, the loneliness could be overwhelming.",
          "'In those moments, when the satellite internet is spotty and the GPS is just a cold, blue screen, I reach into my cabin drawer for that compass,' Vikram says. 'The brass feels warm from the cabin's heat, and the weight of it in my palm is incredibly comforting. It’s a physical manifestation of home. I look at the needle dancing, and then I read Ananya's words inside the lid. It centers me.'"
        ]
      },
      {
        title: "The Talisman of Home",
        paragraphs: [
          "When he finally returns home, the compass is the first thing he puts on their bedside table. It has developed a slight patina from the salt air, a record of the journey it has shared with him. For Ananya and Vikram, it isn't just a navigational tool; it's a talisman that ensures they are never truly lost, as long as they have each other.",
          "Every time they plan a new adventure, they consult the compass first. It has become a ritual—a way to honor the past while looking toward the future. It reminded them that while the world is vast and full of wonders, the most important journey is the one they take together."
        ]
      }
    ],
    relatedProductId: 7,
    quote: "Gifts should speak louder than words. This one screamed love.",
    author: "Ananya M., Mumbai"
  },
  {
    id: 'name-necklace-story',
    name: 'A Name to Remember',
    tag: 'Self Love',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
    description: 'A custom script name necklace that helped a young woman reclaim her identity.',
    sections: [
      {
        title: "The Search for Self",
        paragraphs: [
          "After a difficult year of major life transitions—a career change, a cross-country move, and the end of a long-term relationship—Maya felt like she had lost her sense of self. She had spent so many years being someone's partner, someone's employee, and someone's daughter that she had forgotten who Maya actually was.",
          "To mark the beginning of her new chapter in Bangalore, she decided to treat herself to something that was purely HER. She ordered the Custom Script Name Necklace in 18k Gold from CRAFTORIA."
        ]
      },
      {
        title: "A Piece of Art",
        paragraphs: [
          "'I remember opening the box and seeing my name in that beautiful, flowing script,' Maya explains. 'It was the first time in a long time I had seen my name not as part of a signature on a document or a label on a mailbox, but as a piece of art. It felt like a reclamation.'",
          "The hand-shaped script was delicate yet strong, just like Maya herself. She began wearing it every single day. It became a ritual—fastening the clasp in the morning was a commitment to being true to herself that day. It was no longer just jewelry; it was a daily affirmation."
        ]
      },
      {
        title: "The Armor of Confidence",
        paragraphs: [
          "'It's my armor,' she says. 'In boardrooms where I'm the only woman, or at social events where I'm still finding my footing, I find myself habitually touching the 'M' of the necklace. It's a tactile reminder of my journey. When I look in the mirror now, I don't see a woman defined by her circumstances.'",
          "One year later, Maya has built a life she loves. The necklace has slightly dulled in its shine but has gained a glow of confidence that only comes from self-love. 'CRAFTORIA didn't just sell me jewelry; they sold me a way to remember who I am.'"
        ]
      }
    ],
    relatedProductId: 9,
    quote: "CRAFTORIA didn't just sell me jewelry; they sold me confidence.",
    author: "Maya R., Bangalore"
  },
  {
    id: 'walnut-amplifier-story',
    name: 'Echoes of the Past',
    tag: 'Retirement Gift',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600&auto=format&fit=crop',
    description: 'Why a walnut wood amplifier was the perfect retirement gift for a legendary music teacher.',
    sections: [
      {
        title: "The Legend of the Hall",
        paragraphs: [
          "Mr. Henderson taught classical music at the city’s oldest conservatory for over 40 years. Generations of musicians had passed through his doors, all of them inspired by his unwavering devotion to 'the organic soul of sound.' When the time came for his retirement, his former students wanted to give him something that resonated with his philosophy.",
          "They chose the Walnut Wood Sound Amplifier from CRAFTORIA. 'We knew he despised the cold, synthetic quality of modern Bluetooth speakers,' says one of his former pupils. 'He always taught us that wood is the secret to warmth. It’s what gives a Stradivarius its voice.'"
        ]
      },
      {
        title: "The Silence Between the Notes",
        paragraphs: [
          "The students had a favorite quote by Mozart engraved into the rich, dark grain of the base: 'The music is not in the notes, but in the silence between.' This wasn't just a gift; it was a message of respect for a man who understood the profound power of resonance.",
          "The amplifier worked on pure physics, no complex circuits or batteries required. Just a precisely carved acoustic chamber inside a solid block of walnut wood. It was a marvel of minimalist design that mirrored Mr. Henderson's own disciplined approach to music."
        ]
      },
      {
        title: "A Garden of Sound",
        paragraphs: [
          "Today, if you visit Mr. Henderson's quiet garden in the northern suburbs, you'll find him sitting on his porch. His phone rests in the custom walnut dock. The natural resonance of the hollowed-out premium walnut wood amplifies the sound with a rich, acoustic quality that digital devices simply cannot replicate.",
          "'It captures the overtones perfectly,' Mr. Henderson says, with a satisfied smile. 'It doesn't just make the music louder; it makes it richer. It sounds like the halls of my old conservatory—pure, organic, and full of life. It’s the perfect companion for a man who spent his life chasing the truth in every chord.'"
        ]
      }
    ],
    relatedProductId: 8,
    quote: "Sometimes, the simplest things resonate the loudest.",
    author: "Class of 2024"
  }
];
