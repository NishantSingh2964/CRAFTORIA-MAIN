import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const AUTH_PATHS = ['/cart', '/checkout', '/success', '/my-orders', '/admin', '/product'];

const ClerkMountContext = createContext({
  clerkReady: false,
  ensureClerk: () => Promise.resolve(),
});

export const useClerkMount = () => useContext(ClerkMountContext);

import { useAuth } from '@clerk/clerk-react';
import { setTokenGetter } from '../services/api';

const AuthBridge = () => {
  const { getToken } = useAuth();
  useEffect(() => {
    setTokenGetter(getToken);
  }, [getToken]);
  return null;
};

export function LazyClerkProvider({ children, publishableKey }) {
  const { pathname } = useLocation();
  const [ClerkProvider, setClerkProvider] = useState(null);
  const readyResolvers = useRef([]);

  const notifyReady = useCallback(() => {
    readyResolvers.current.forEach((resolve) => resolve());
    readyResolvers.current = [];
  }, []);

  const loadClerk = useCallback(() => {
    if (ClerkProvider || !publishableKey) return Promise.resolve();
    return import('@clerk/clerk-react').then((mod) => {
      setClerkProvider(() => mod.ClerkProvider);
    });
  }, [ClerkProvider, publishableKey]);

  const ensureClerk = useCallback(() => {
    const promise = new Promise((resolve) => {
      if (ClerkProvider) {
        resolve();
        return;
      }
      readyResolvers.current.push(resolve);
    });
    void loadClerk();
    return promise;
  }, [ClerkProvider, loadClerk]);

  useEffect(() => {
    if (!publishableKey) return;

    if (AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
      void loadClerk();
      return;
    }

    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(() => loadClerk(), { timeout: 3500 });
      return () => cancelIdleCallback(id);
    }

    const timer = setTimeout(() => loadClerk(), 2500);
    return () => clearTimeout(timer);
  }, [pathname, publishableKey, loadClerk]);

  useEffect(() => {
    if (ClerkProvider) notifyReady();
  }, [ClerkProvider, notifyReady]);

  const value = {
    clerkReady: Boolean(ClerkProvider),
    ensureClerk,
  };

  return (
    <ClerkMountContext.Provider value={value}>
      {ClerkProvider ? (
        <ClerkProvider publishableKey={publishableKey}>
          <AuthBridge />
          {children}
        </ClerkProvider>
      ) : (
        // Check if we are on a path that NEEDS Clerk immediately
        AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ? (
          <div className="flex min-h-screen items-center justify-center bg-white">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#760000]" />
          </div>
        ) : (
          children
        )
      )}
    </ClerkMountContext.Provider>
  );
}
