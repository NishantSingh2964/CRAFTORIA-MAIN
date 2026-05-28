import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { Toaster } from 'react-hot-toast';
import SubscribeModal from '../components/SubscribeModal';
import UserSync from '../components/UserSync';
import { useClerkMount } from '../providers/LazyClerk';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const Layout = () => {
  const { clerkReady } = useClerkMount();

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <ScrollToTop />
      {clerkReady && <UserSync />}
      <SEO />

      {/* Sticky/Fixed Navbar */}
      <Navbar />
      <Toaster toastOptions={{ ariaProps: { role: 'status', 'aria-live': 'polite' } }} />
      <SubscribeModal />

      <main id="main-content" className="flex-grow" tabIndex={-1}>
        <Outlet />
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
