/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store';

import ScrollToTop from './components/ScrollToTop';

// Layouts
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';

// Storefront Pages
import Home from './pages/storefront/Home';
import ProductView from './pages/storefront/ProductView';
import CategoryView from './pages/storefront/CategoryView';
import Cart from './pages/storefront/Cart';
import Checkout from './pages/storefront/Checkout';
import Wishlist from './pages/storefront/Wishlist';
import Search from './pages/storefront/Search';
import StaticPages from './pages/storefront/StaticPages';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCategoryDetail from './pages/admin/AdminCategoryDetail';
import AdminOrders from './pages/admin/AdminOrders';
import AdminBanners from './pages/admin/AdminBanners';
import AdminSettings from './pages/admin/AdminSettings';

const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdminAuthenticated } = useAppStore();
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  const { isDarkMode } = useAppStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Storefront Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="product/:id" element={<ProductView />} />
          <Route path="category/:slug" element={<CategoryView />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="search" element={<Search />} />
          
          {/* Static Pages */}
          <Route path="about" element={<StaticPages page="about" />} />
          <Route path="contact" element={<StaticPages page="contact" />} />
          <Route path="faq" element={<StaticPages page="faq" />} />
          <Route path="privacy" element={<StaticPages page="privacy" />} />
          <Route path="return" element={<StaticPages page="return" />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="categories/:id" element={<AdminCategoryDetail />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
