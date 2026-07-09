import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAppStore } from '../../store';
import { formatCurrency } from '../../lib/utils';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { products } = useAppStore();
  
  const [localQuery, setLocalQuery] = useState(query);
  
  const results = products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: localQuery });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 min-h-[60vh]">
      <div className="max-w-2xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="relative">
          <input 
            type="text" 
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Search for products..." 
            className="w-full bg-transparent border border-gray-300 dark:border-gray-800 text-black dark:text-white px-4 py-4 pl-12 focus:outline-none focus:border-gold-500 transition-colors text-sm"
          />
          <SearchIcon size={20} className="absolute left-4 top-4 text-gray-400" />
          <button type="submit" className="absolute right-2 top-2 bg-black dark:bg-white text-white dark:text-black px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gold-500 dark:hover:bg-gold-500 hover:text-black transition-colors">
            Search
          </button>
        </form>
      </div>

      <div className="text-center mb-12">
        <h1 className="font-serif text-3xl font-bold tracking-widest uppercase mb-4 italic text-black dark:text-white">
          {query ? `Results for "${query}"` : 'All Products'}
        </h1>
        <div className="w-16 h-0.5 bg-gold-500 mx-auto mb-4" />
        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">{results.length} Products</p>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-xs font-bold uppercase tracking-widest">
          We couldn't find any matches for your search.
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map(product => (
            <Link key={product.id} to={`/product/${product.id}`} className="group cursor-pointer">
              <div className="aspect-[3/4] bg-gray-100 dark:bg-luxury-gray mb-3 relative overflow-hidden">
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />
                {product.discountPrice && (
                  <div className="absolute top-3 left-3 bg-gold-500 text-black text-[9px] px-2 py-1 font-bold tracking-widest">
                    -Sale
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-black text-white py-3 text-center text-[10px] font-bold uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  View Details
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-black dark:text-white">{product.name}</h4>
                  {product.colors && product.colors.length > 0 && (
                      <div className="flex space-x-1 mt-2">
                        {product.colors.slice(0,3).map((color, i) => (
                           <div key={i} className="w-2 h-2 rounded-full border border-gray-300 dark:border-gray-700" style={{ backgroundColor: color.toLowerCase() === 'white' ? '#fff' : color.toLowerCase() === 'black' ? '#000' : '#C5A059' }}></div>
                        ))}
                      </div>
                    )}
                </div>
                <div className="text-right">
                  {product.discountPrice ? (
                    <div className="flex flex-col">
                      <span className="text-[10px] font-serif italic text-gold-500">{formatCurrency(product.discountPrice)}</span>
                      <span className="text-[9px] line-through text-gray-400">{formatCurrency(product.price)}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-serif italic text-black dark:text-white">{formatCurrency(product.price)}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
