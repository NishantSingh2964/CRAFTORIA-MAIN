import { useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { products } from '../assets';

const SITE_NAME = 'CRAFTORIA';
const DEFAULT_DESCRIPTION =
  'Shop premium gifts, personalized keepsakes, luxury hampers, flowers, candles, chocolates and thoughtful presents for every occasion at CRAFTORIA.';
const DEFAULT_KEYWORDS =
  'premium gifts, personalized gifts, luxury hampers, gift delivery, birthday gifts, anniversary gifts, corporate gifts, CRAFTORIA';

const routeMeta = {
  '/': {
    title: 'CRAFTORIA | Premium Gifts, Hampers and Personalized Keepsakes',
    description: DEFAULT_DESCRIPTION,
    keywords: DEFAULT_KEYWORDS,
  },
  '/collections': {
    title: 'Gift Collections | Premium Hampers, Flowers and Keepsakes | CRAFTORIA',
    description:
      'Browse CRAFTORIA gift collections with premium hampers, flowers, chocolates, candles, soft toys and personalized keepsakes for every celebration.',
    keywords:
      'gift collections, luxury hampers, flowers, chocolates, soft toys, personalized gifts, premium gifts',
  },
  '/gifts-by-occasion': {
    title: 'Gifts by Occasion | Birthday, Anniversary and Corporate Gifts | CRAFTORIA',
    description:
      'Find curated gifts by occasion, including birthdays, anniversaries, Valentine gifts, housewarming gifts and corporate milestone presents.',
    keywords:
      'birthday gifts, anniversary gifts, Valentine gifts, housewarming gifts, corporate gifts, occasion gifts',
  },
  '/personalized': {
    title: 'Personalized Gifts | Custom Engraved Keepsakes | CRAFTORIA',
    description:
      'Create personalized gifts with names, initials, messages and engraved details across keepsakes, journals, jewellery and custom gift orders.',
    keywords:
      'personalized gifts, customized gifts, engraved gifts, monogram gifts, custom keepsakes',
  },
  '/our-story': {
    title: 'Our Story | Thoughtful Gifting by CRAFTORIA',
    description:
      'Discover CRAFTORIA, a premium gifting brand creating thoughtful, personal and memorable gifts for celebrations across India.',
    keywords: 'about CRAFTORIA, gifting brand, thoughtful gifts, premium gifting India',
  },
  '/cart': {
    title: 'Your Cart | CRAFTORIA',
    description: 'Review the gifts in your CRAFTORIA cart before checkout.',
    noIndex: true,
  },
  '/checkout': {
    title: 'Checkout | CRAFTORIA',
    description: 'Complete your CRAFTORIA gift order securely.',
    noIndex: true,
  },
  '/my-orders': {
    title: 'My Orders | CRAFTORIA',
    description: 'Track your CRAFTORIA orders and delivery details.',
    noIndex: true,
  },
};

const setMeta = (selector, attributes) => {
  const head = document.head;
  let element = head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    Object.entries(attributes.identity).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    head.appendChild(element);
  }

  Object.entries(attributes.values).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

const setLink = (selector, attributes) => {
  const head = document.head;
  let element = head.querySelector(selector);

  if (!element) {
    element = document.createElement('link');
    Object.entries(attributes.identity).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    head.appendChild(element);
  }

  Object.entries(attributes.values).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

const parsePrice = (price) => String(price).replace(/[^\d.]/g, '');

const getAbsoluteUrl = (path) => {
  if (!path) return window.location.origin;
  if (/^https?:\/\//i.test(path)) return path;
  return `${window.location.origin}${path.startsWith('/') ? path : `/${path}`}`;
};

const SEO = () => {
  const location = useLocation();
  const { id } = useParams();

  const meta = useMemo(() => {
    if (location.pathname.startsWith('/product/')) {
      const product = products.find((item) => item.id === Number(id));

      if (product) {
        return {
          title: `${product.name} | Buy Premium Gift Online | CRAFTORIA`,
          description: product.description,
          keywords: `${product.name}, ${product.category}, premium gift, personalized gift, CRAFTORIA`,
          image: product.image,
          type: 'product',
          product,
        };
      }
    }

    return routeMeta[location.pathname] || routeMeta['/'];
  }, [id, location.pathname]);

  useEffect(() => {
    const canonicalUrl = getAbsoluteUrl(`${location.pathname}${location.search}`);
    const imageUrl = getAbsoluteUrl(meta.image || '/favicon.svg');
    const robots = meta.noIndex ? 'noindex, nofollow' : 'index, follow';

    document.title = meta.title;

    setMeta('meta[name="description"]', {
      identity: { name: 'description' },
      values: { content: meta.description || DEFAULT_DESCRIPTION },
    });
    setMeta('meta[name="keywords"]', {
      identity: { name: 'keywords' },
      values: { content: meta.keywords || DEFAULT_KEYWORDS },
    });
    setMeta('meta[name="robots"]', {
      identity: { name: 'robots' },
      values: { content: robots },
    });
    setLink('link[rel="canonical"]', {
      identity: { rel: 'canonical' },
      values: { href: canonicalUrl },
    });

    setMeta('meta[property="og:site_name"]', {
      identity: { property: 'og:site_name' },
      values: { content: SITE_NAME },
    });
    setMeta('meta[property="og:title"]', {
      identity: { property: 'og:title' },
      values: { content: meta.title },
    });
    setMeta('meta[property="og:description"]', {
      identity: { property: 'og:description' },
      values: { content: meta.description || DEFAULT_DESCRIPTION },
    });
    setMeta('meta[property="og:type"]', {
      identity: { property: 'og:type' },
      values: { content: meta.type === 'product' ? 'product' : 'website' },
    });
    setMeta('meta[property="og:url"]', {
      identity: { property: 'og:url' },
      values: { content: canonicalUrl },
    });
    setMeta('meta[property="og:image"]', {
      identity: { property: 'og:image' },
      values: { content: imageUrl },
    });

    setMeta('meta[name="twitter:card"]', {
      identity: { name: 'twitter:card' },
      values: { content: 'summary_large_image' },
    });
    setMeta('meta[name="twitter:title"]', {
      identity: { name: 'twitter:title' },
      values: { content: meta.title },
    });
    setMeta('meta[name="twitter:description"]', {
      identity: { name: 'twitter:description' },
      values: { content: meta.description || DEFAULT_DESCRIPTION },
    });
    setMeta('meta[name="twitter:image"]', {
      identity: { name: 'twitter:image' },
      values: { content: imageUrl },
    });

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': meta.product ? 'Product' : 'WebSite',
      ...(meta.product
        ? {
            name: meta.product.name,
            description: meta.product.description,
            image: imageUrl,
            brand: {
              '@type': 'Brand',
              name: SITE_NAME,
            },
            category: meta.product.category,
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: meta.product.rating,
              reviewCount: meta.product.testimonials?.length || 1,
            },
            offers: {
              '@type': 'Offer',
              url: canonicalUrl,
              priceCurrency: 'INR',
              price: parsePrice(meta.product.currentPrice),
              availability: 'https://schema.org/InStock',
            },
          }
        : {
            name: SITE_NAME,
            url: window.location.origin,
            description: DEFAULT_DESCRIPTION,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${window.location.origin}/collections?search={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          }),
    };

    let script = document.getElementById('route-json-ld');
    if (!script) {
      script = document.createElement('script');
      script.id = 'route-json-ld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);
  }, [location.pathname, location.search, meta]);

  return null;
};

export default SEO;
