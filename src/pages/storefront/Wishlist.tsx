import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../store';
import { formatCurrency } from '../../lib/utils';
import { HeartCrack } from 'lucide-react';

export default function Wishlist() {
  const { wishlist, products, toggleWishlist } = useAppStore();
  
  const wishlistProducts = wishlist
    .map(id => products.find(p => p.id === id))
    .filter(p => p !== undefined);

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center max-w-7xl mx-auto px-4">
        <HeartCrack size={64} className="text-gray-300 mb-6" />
        <h2 className="font-serif text-3xl font-bold mb-4 text-center">Your Wishlist is Empty</h2>
        <Link 
          to="/" 
          className="bg-gold-500 text-white px-8 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-gold-600 transition-colors mt-4"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl font-bold uppercase tracking-wider mb-4">Wishlist</h1>
        <div className="w-16 h-1 bg-gold-500 mx-auto" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {wishlistProducts.map(product => (
          <div key={product!.id} className="relative group">
            <Link to={`/product/${product!.id}`}>
              <div className="relative aspect-[3/4] bg-gray-200 dark:bg-luxury-gray mb-4 overflow-hidden">
                <img 
                  src={product!.images[0]} 
                  alt={product!.name}
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-gold-500 transition-colors pr-8">{product!.name}</h3>
              <div className="mt-1 flex items-center space-x-2">
                {product!.discountPrice ? (
                  <>
                    <span className="text-red-600 font-medium">{formatCurrency(product!.discountPrice)}</span>
                    <span className="text-gray-500 line-through text-sm">{formatCurrency(product!.price)}</span>
                  </>
                ) : (
                  <span className="text-gray-900 dark:text-gray-100 font-medium">{formatCurrency(product!.price)}</span>
                )}
              </div>
            </Link>
            <button 
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product!.id);
              }}
              className="absolute bottom-[4.5rem] right-0 p-2 bg-white dark:bg-luxury-gray text-gray-500 hover:text-red-500 transition-colors shadow-sm"
              title="Remove from wishlist"
            >
              <HeartCrack size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
