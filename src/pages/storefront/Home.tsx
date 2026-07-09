import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Pin, Search } from 'lucide-react';
import { useAppStore } from '../../store';
import { formatCurrency } from '../../lib/utils';
import MediaRenderer from '../../components/MediaRenderer';

export default function Home() {
  const { banners, categories, products, bannerSlideshow } = useAppStore();
  const navigate = useNavigate();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [bannerMediaTypes, setBannerMediaTypes] = useState<Record<string, 'img' | 'video'>>({});

  const sortedBanners = [...banners].sort((a, b) => a.order - b.order);
  const sortedCategories = [...categories].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const safeBannerIndex = sortedBanners.length > 0 ? currentBanner % sortedBanners.length : 0;

  // Banner Auto-slider (2s as requested)
  useEffect(() => {
    if (sortedBanners.length <= 1 || !bannerSlideshow) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % sortedBanners.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [sortedBanners.length, bannerSlideshow]);

  return (
    <div>
      {/* Hero Slider */}
      <div className="relative h-[65vh] md:h-[80vh] w-full bg-[#111] overflow-hidden">
        {sortedBanners.length > 0 ? (
          <>
            <AnimatePresence initial={false}>
              {sortedBanners.map((banner, index) => (
                index === safeBannerIndex && (
                  <motion.div
                key={banner.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 flex items-center"
              >
                <div className="absolute inset-0 z-0">
                  <MediaRenderer 
                    url={banner.imageUrl} 
                    className="absolute inset-0 w-full h-full object-cover" 
                    muted={isMuted} 
                    onMediaTypeResolve={(type) => setBannerMediaTypes(prev => ({...prev, [banner.id]: type}))}
                  />
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10 opacity-70" />
                
                {/* Sound Toggle Button (Video Only) */}
                {bannerMediaTypes[banner.id] === 'video' && (
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="absolute bottom-8 right-8 z-30 p-3 bg-black/30 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-all"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                )}
                
                {/* Content */}
                <div className="relative z-20 px-4 sm:px-10 md:px-20 max-w-4xl">
                  {banner.subtitle && (
                    <motion.span 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-gold-500 uppercase tracking-[0.3em] text-[10px] md:text-xs font-bold mb-4 block"
                    >
                      {banner.subtitle}
                    </motion.span>
                  )}
                  {banner.title && (
                    <motion.h2 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="font-serif text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight italic"
                    >
                      {banner.title.split(' ').map((word, i, arr) => (
                        i === arr.length - 1 ? <span key={i} className="not-italic">{word}</span> : `${word} `
                      ))}
                    </motion.h2>
                  )}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex space-x-4"
                  >
                    <Link 
                      to="/category/all" 
                      className="px-8 py-3 border border-white text-white font-bold uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-colors hidden sm:block"
                    >
                      View Lookbook
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
                )
              ))}
            </AnimatePresence>

            {/* Slider Navigation Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
              {sortedBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentBanner(idx)}
                  className={`h-[2px] transition-all duration-300 ${idx === safeBannerIndex ? 'w-12 bg-gold-500' : 'w-12 bg-white/30'}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            No banners available
          </div>
        )}
      </div>

      {/* Categories & Featured Products Section */}
      <div className="max-w-screen-2xl mx-auto w-full px-6 py-8 border-b border-gray-100 dark:border-gray-800">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            }
          }}
          className="relative max-w-2xl mx-auto"
        >
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-b border-black dark:border-white bg-transparent py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-gold-500 transition-colors uppercase tracking-widest placeholder:text-gray-400"
          />
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </form>
      </div>

      <div className="flex-grow flex flex-col md:flex-row max-w-screen-2xl mx-auto w-full">
        {/* Categories Sidebar */}
        <div className="md:w-48 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">Quick Browse</h3>
            <ul className="flex flex-row md:flex-col space-x-4 md:space-x-0 md:space-y-3 text-[11px] font-medium uppercase tracking-wider overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
              {sortedCategories.slice(0, 6).map(cat => (
                <li key={cat.id} className="whitespace-nowrap flex items-center">
                  <Link to={`/category/${cat.slug}`} className="text-gray-500 hover:text-gold-500 transition-colors flex items-center">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden md:block p-4 bg-gray-50 dark:bg-black/50 border border-gray-100 dark:border-gray-800 mt-8">
            <p className="text-[9px] uppercase tracking-tighter leading-tight text-gray-600 dark:text-gray-400">Newsletter: Sign up for 10% off your first order.</p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow p-4 md:p-8">
          
          {/* Featured Categories Grid */}
          {sortedCategories.filter(c => c.pinned).length > 0 && (
            <div className="mb-12">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">Featured Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sortedCategories.filter(c => c.pinned).slice(0, 4).map(cat => (
                  <Link key={cat.id} to={`/category/${cat.slug}`} className="group relative h-40 overflow-hidden bg-gray-100">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-500 text-xs">No Image</div>
                    )}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                      <span className="text-white font-bold uppercase tracking-widest text-sm">{cat.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Featured Products Grid */}
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Featured Collection</h2>
            <Link to="/search" className="text-[10px] font-bold uppercase tracking-widest hover:text-gold-500 transition-colors border-b border-black dark:border-white pb-1">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.filter(p => p.featured).slice(0, 6).map(product => (
              <Link key={product.id} to={`/product/${product.id}`} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-gray-100 dark:bg-luxury-gray mb-3 relative overflow-hidden">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                  />
                  {product.discountPrice ? (
                    <div className="absolute top-3 left-3 bg-gold-500 text-black text-[9px] px-2 py-1 font-bold tracking-widest">
                      -Sale
                    </div>
                  ) : product.id.includes('1') ? (
                     <div className="absolute top-3 left-3 bg-black text-white text-[9px] px-2 py-1 font-bold tracking-widest">
                      NEW
                    </div>
                  ) : null}
                  <div className="absolute inset-x-0 bottom-0 bg-black text-white py-3 text-center text-[10px] font-bold uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    View Details
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider">{product.name}</h4>
                    {product.colors.length > 0 && (
                      <div className="flex space-x-1 mt-2">
                        {product.colors.slice(0,3).map((color, i) => (
                           <div key={i} className="w-2 h-2 rounded-full border border-gray-300" style={{ backgroundColor: color.toLowerCase() === 'white' ? '#fff' : color.toLowerCase() === 'black' ? '#000' : '#C5A059' }}></div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    {product.discountPrice ? (
                      <>
                        <span className="text-[10px] line-through text-gray-400 mr-1">{formatCurrency(product.price)}</span>
                        <span className="text-xs font-serif italic text-gold-500">{formatCurrency(product.discountPrice)}</span>
                      </>
                    ) : (
                      <span className="text-xs font-serif italic">{formatCurrency(product.price)}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
