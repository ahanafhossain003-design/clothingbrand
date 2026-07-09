import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Menu, X, User, Moon, Sun, ChevronDown, MoreVertical, ArrowLeft, Pin } from 'lucide-react';
import { useAppStore } from '../store';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
  const { cart, wishlist, categories, isDarkMode, toggleDarkMode } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const sortedCategories = [...categories].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  return (
    <div className={cn("min-h-screen flex flex-col max-w-[100vw] overflow-x-hidden", isDarkMode ? "dark" : "")}>
      {/* Top Bar */}
      <div className="hidden md:flex bg-gold-500 text-black py-2 text-[9px] font-bold uppercase tracking-[0.2em] justify-center items-center">
        Free Express Shipping on Orders Over $500 <span className="opacity-50 mx-4">|</span> Secure Payments: bKash, Nagad, Amex
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-black text-white border-b border-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Back to Home Button */}
              {!isHomePage && (
                <Link to="/" className="text-white hover:text-gold-500 transition-colors mr-3 md:mr-6" title="Back to Home">
                  <ArrowLeft size={24} />
                </Link>
              )}
              
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 -ml-2 text-white hover:text-gold-500"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Logo (Desktop only here) */}
              <Link to="/" className="hidden md:flex flex-shrink-0 items-center justify-center">
                <h1 className="font-serif text-2xl tracking-widest text-gold-500 font-bold">
                  AURELIUS
                </h1>
              </Link>
            </div>
            
            {/* Logo (Mobile only) */}
            <Link to="/" className="md:hidden flex-shrink-0 flex items-center justify-center">
              <h1 className="font-serif text-2xl tracking-widest text-gold-500 font-bold">
                AURELIUS
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6 text-xs uppercase tracking-widest font-medium">
              <Link to="/" className="text-gray-300 hover:text-gold-500 transition-colors">
                HOME
              </Link>
              <div className="relative group flex items-center">
                <button className="flex items-center space-x-1 text-gray-300 group-hover:text-gold-500 transition-colors uppercase">
                  <span>COLLECTIONS</span>
                  <ChevronDown size={14} />
                </button>
                <div className="absolute left-0 top-full pt-4 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="bg-white dark:bg-luxury-black shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col py-2">
                    {sortedCategories.map(cat => (
                      <Link 
                        key={cat.id} 
                        to={`/category/${cat.slug}`}
                        className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gold-500 dark:hover:text-gold-500 transition-colors flex items-center"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <Link to="/about" className="text-gray-300 hover:text-gold-500 transition-colors">
                ABOUT
              </Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-4 md:space-x-6">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-white hover:text-gold-500 transition-colors hidden md:flex items-center relative"
              >
                <div className="w-4 h-4 border border-gray-400 rounded-full mr-2"></div>
                <span className="text-[10px] uppercase tracking-tighter opacity-70">Search</span>
              </button>
              
              <Link to="/wishlist" className="relative text-white hover:text-gold-500 transition-colors w-5 h-5 flex items-center justify-center border border-white rounded-full text-[10px] font-medium">
                W
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold-500 text-black text-[8px] px-1 rounded-full font-bold">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              
              <Link to="/cart" className="relative text-white hover:text-gold-500 transition-colors w-5 h-5 flex items-center justify-center border border-white rounded-full text-[10px] font-medium">
                C
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold-500 text-black text-[8px] px-1 rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link to="/admin" className="text-white hover:text-gold-500 transition-colors flex items-center justify-center">
                <MoreVertical size={18} />
              </Link>

              <button 
                onClick={toggleDarkMode}
                className="text-white hover:text-gold-500 transition-colors flex items-center justify-center"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-luxury-black overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search for products..." 
                    className="w-full bg-gray-100 dark:bg-luxury-gray text-gray-900 dark:text-white px-4 py-3 pl-12 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-shadow"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        navigate(`/search?q=${e.currentTarget.value}`);
                        setIsSearchOpen(false);
                      }
                    }}
                  />
                  <Search size={20} className="absolute left-4 top-3.5 text-gray-400" />
                  <button 
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-luxury-black border-t border-gray-200 dark:border-gray-800 shadow-xl"
            >
              <div className="px-4 py-6 space-y-4 flex flex-col">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium tracking-wide">HOME</Link>
                <div className="py-2 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-sm text-gray-500 mb-2 font-medium tracking-widest uppercase">Categories</p>
                  <div className="grid grid-cols-2 gap-2">
                    {sortedCategories.map(cat => (
                      <Link 
                        key={cat.id} 
                        to={`/category/${cat.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-gray-600 dark:text-gray-300 hover:text-gold-500 flex items-center"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium tracking-wide border-t border-gray-100 dark:border-gray-800 pt-4">ADMIN DASHBOARD</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-black text-white pt-16 pb-8 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h2 className="font-serif text-2xl tracking-widest font-bold mb-4 text-gold-500">AURELIUS</h2>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Elevating modern luxury through timeless design, impeccable craftsmanship, and uncompromising quality.
              </p>
            </div>
            
            <div>
              <h3 className="text-[10px] font-bold tracking-widest uppercase mb-4 text-gray-500">Shop</h3>
              <ul className="space-y-3">
                {sortedCategories.slice(0, 4).map(cat => (
                  <li key={cat.id}>
                    <Link to={`/category/${cat.slug}`} className="text-gray-400 hover:text-gold-500 transition-colors text-xs uppercase tracking-wider flex items-center">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-[10px] font-bold tracking-widest uppercase mb-4 text-gray-500">Support</h3>
              <ul className="space-y-3 text-xs uppercase tracking-wider text-gray-400">
                <li><Link to="/faq" className="hover:text-gold-500 transition-colors">FAQ</Link></li>
                <li><Link to="/contact" className="hover:text-gold-500 transition-colors">Contact Us</Link></li>
                <li><Link to="/return" className="hover:text-gold-500 transition-colors">Returns & Exchanges</Link></li>
                <li><Link to="/privacy" className="hover:text-gold-500 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-[10px] font-bold tracking-widest uppercase mb-4 text-gray-500">Newsletter</h3>
              <p className="text-gray-400 text-[10px] mb-4 uppercase tracking-tighter leading-tight">Sign up for 10% off your first order.</p>
              <form className="flex border border-gray-800 focus-within:border-gold-500 transition-colors" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter email" 
                  className="bg-transparent text-white px-4 py-2 flex-grow focus:outline-none text-xs"
                />
                <button type="submit" className="bg-gold-500 text-black px-4 py-2 text-[10px] font-bold hover:bg-gold-400 transition-colors uppercase tracking-widest">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
            <p>&copy; {new Date().getFullYear()} AURELIUS. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="hover:text-white transition-colors cursor-pointer">Instagram</span>
              <span className="hover:text-white transition-colors cursor-pointer">Twitter</span>
              <span className="hover:text-white transition-colors cursor-pointer">Pinterest</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
