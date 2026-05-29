import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import { ProductProvider } from './contexts/ProductContext';
import { OccasionProvider } from './contexts/OccasionContext';
import { AdminProvider } from './contexts/AdminContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ReviewProvider } from './contexts/ReviewContext';
import Loader from './components/Loader';
import { LazyClerkProvider } from './providers/LazyClerk';

const clerkPubKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Home from './pages/Home';
const Collections = lazy(() => import('./pages/Collections'));
const GiftsByOccasion = lazy(() => import('./pages/GiftsByOccasion'));
const Personalized = lazy(() => import('./pages/Personalized'));
const OurStory = lazy(() => import('./pages/OurStory'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Success = lazy(() => import('./pages/Success'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin Pages
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminAddProduct = lazy(() => import('./pages/admin/AddProduct'));
const AdminEditProduct = lazy(() => import('./pages/admin/EditProduct'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminExpenses = lazy(() => import('./pages/admin/Expenses'));
const AdminOccasions = lazy(() => import('./pages/admin/Occasions'));
const AdminAddOccasion = lazy(() => import('./pages/admin/AddOccasion'));
const AdminEditOccasion = lazy(() => import('./pages/admin/EditOccasion'));
const AdminNotifications = lazy(() => import('./pages/admin/Notifications'));

const PageFallback = () => <Loader message="Arranging your gifts..." />;

const App = () => {
  const [showLoader, setShowLoader] = useState(false);

  return (
    <>
      {showLoader && <Loader onFinish={() => setShowLoader(false)} />}
      <Router>
        <LazyClerkProvider publishableKey={clerkPubKey}>
          <ProductProvider>
            <OccasionProvider>
              <OrderProvider>
                <CartProvider>
                  <NotificationProvider>
                    <ReviewProvider>
                      <Suspense fallback={<PageFallback />}>
                        <Routes>
                          {/* Public Frontend Routes */}
                          <Route path="/" element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="collections" element={<Collections />} />
                            <Route path="gifts-by-occasion" element={<GiftsByOccasion />} />
                            <Route path="personalized" element={<Personalized />} />
                            <Route path="our-story" element={<OurStory />} />
                            <Route path="product/:id" element={<ProductDetail />} />
                            <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                            <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                            <Route path="success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
                            <Route path="my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                            <Route path="*" element={<NotFound />} />
                          </Route>

                          {/* Admin Routes */}
                          <Route path="/admin" element={
                            <AdminRoute>
                              <AdminProvider>
                                <AdminLayout />
                              </AdminProvider>
                            </AdminRoute>
                          }>
                            <Route index element={<Navigate to="/admin/dashboard" replace />} />
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="products" element={<AdminProducts />} />
                            <Route path="products/add" element={<AdminAddProduct />} />
                            <Route path="products/edit/:id" element={<AdminEditProduct />} />
                            <Route path="orders" element={<AdminOrders />} />
                            <Route path="users" element={<AdminUsers />} />
                            <Route path="expenses" element={<AdminExpenses />} />
                            <Route path="occasions" element={<AdminOccasions />} />
                            <Route path="occasions/add" element={<AdminAddOccasion />} />
                            <Route path="occasions/edit/:id" element={<AdminEditOccasion />} />
                            <Route path="notifications" element={<AdminNotifications />} />
                          </Route>


                        </Routes>
                      </Suspense>
                    </ReviewProvider>
                  </NotificationProvider>
                </CartProvider>
              </OrderProvider>
            </OccasionProvider>
          </ProductProvider>
        </LazyClerkProvider>
      </Router>
    </>
  );
};

export default App;
