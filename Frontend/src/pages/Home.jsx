import React, { lazy, Suspense } from 'react';
import Hero from '../components/Hero';
import LazyMount from '../components/LazyMount';

const Categories = lazy(() => import('../components/Categories'));
const CustomerFavorites = lazy(() => import('../components/CustomerFavorites'));
const MostReviewedProducts = lazy(() => import('../components/MostReviewedProducts'));
const PromoBanner = lazy(() => import('../components/PromoBanner'));
const Occasions = lazy(() => import('../components/Occasions'));
const Features = lazy(() => import('../components/Features'));
const ContactUs = lazy(() => import('../components/ContactUs'));
const Testimonials = lazy(() => import('../components/Testimonials'));

const SectionFallback = ({ tall = false }) => (
  <div
    className={`animate-pulse bg-gray-100/80 ${tall ? 'min-h-[320px]' : 'min-h-[200px]'}`}
    aria-hidden="true"
  />
);

const Home = () => {
  return (
    <div className="bg-[#fafafa]">
      <Hero />

      <LazyMount minHeight="280px">
        <Suspense fallback={<SectionFallback />}>
          <Categories />
        </Suspense>
      </LazyMount>

      <LazyMount minHeight="400px">
        <Suspense fallback={<SectionFallback tall />}>
          <CustomerFavorites />
        </Suspense>
      </LazyMount>

      <LazyMount minHeight="400px">
        <Suspense fallback={<SectionFallback tall />}>
          <MostReviewedProducts />
        </Suspense>
      </LazyMount>

      <LazyMount minHeight="240px">
        <Suspense fallback={<SectionFallback />}>
          <PromoBanner />
        </Suspense>
      </LazyMount>

      <LazyMount minHeight="360px">
        <Suspense fallback={<SectionFallback tall />}>
          <Occasions />
        </Suspense>
      </LazyMount>

      <LazyMount minHeight="400px">
        <Suspense fallback={<SectionFallback tall />}>
          <Features />
        </Suspense>
      </LazyMount>

      <LazyMount minHeight="280px">
        <Suspense fallback={<SectionFallback />}>
          <ContactUs />
        </Suspense>
      </LazyMount>

      <LazyMount minHeight="320px">
        <Suspense fallback={<SectionFallback tall />}>
          <Testimonials />
        </Suspense>
      </LazyMount>
    </div>
  );
};

export default Home;
