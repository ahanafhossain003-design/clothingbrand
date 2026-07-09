import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Tags, Image, Users, Settings, LogOut, ArrowLeft, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppStore } from '../../store';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout() {
  const location = useLocation();
  const { isDarkMode } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: ShoppingBag },
    { name: 'Categories', path: '/admin/categories', icon: Tags },
    { name: 'Orders', path: '/admin/orders', icon: Users },
    { name: 'Banners', path: '/admin/banners', icon: Image },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className={cn("min-h-screen flex bg-gray-50 dark:bg-luxury-black text-gray-900 dark:text-white", isDarkMode ? "dark" : "")}>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 hidden md:flex flex-col shrink-0">
        <div className="h-20 flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
          <h1 className="font-serif text-xl font-bold tracking-widest uppercase text-black dark:text-gold-500">
            AURELIUS ADMIN
          </h1>
        </div>
        
        <nav className="flex-grow py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors",
                  isActive 
                    ? "bg-gold-500/10 text-gold-500 border-r-2 border-gold-500" 
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-black dark:hover:text-white"
                )}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:hidden relative z-50">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:text-gold-500"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <h1 className="font-serif text-lg font-bold uppercase tracking-widest text-black dark:text-gold-500">
            AURELIUS ADMIN
          </h1>
          
          <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-gold-500">Store</Link>
        </header>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 shadow-xl z-40"
            >
              <nav className="py-2 px-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors",
                        isActive 
                          ? "bg-gold-500/10 text-gold-500 border-l-2 border-gold-500" 
                          : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-black dark:hover:text-white"
                      )}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-800">
                  <Link
                    to="/"
                    className="flex items-center space-x-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <ArrowLeft size={18} />
                    <span>Back to Store</span>
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
        
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-[#111] p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
