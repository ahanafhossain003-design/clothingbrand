import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowLeft, Check } from 'lucide-react';
import { useAppStore } from '../../store';
import { formatCurrency, cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export default function ProductView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, wishlist } = useAppStore();
  
  const product = products.find(p => p.id === id);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(product?.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif mb-4">Product Not Found</h2>
        <Link to="/" className="text-gold-500 hover:underline">Return to Home</Link>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 0) {
      alert('Please select a size');
      return false;
    }
    if (!selectedColor && product.colors.length > 0) {
      alert('Please select a color');
      return false;
    }
    
    addToCart({
      productId: product.id,
      quantity,
      size: selectedSize,
      color: selectedColor
    });
    
    return true;
  };

  const handleBuyNow = () => {
    if (handleAddToCart()) {
      navigate('/checkout');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center text-sm text-gray-500 hover:text-gold-500 mb-8 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Image Gallery */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-4 order-2 md:order-1 overflow-x-auto md:overflow-y-auto scrollbar-hide">
            {product.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={cn(
                  "w-20 h-28 flex-shrink-0 bg-gray-100 dark:bg-luxury-gray overflow-hidden border transition-colors",
                  selectedImage === idx ? "border-gold-500" : "border-transparent"
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          
          {/* Main Image with Zoom */}
          <div 
            className="relative flex-1 aspect-[3/4] bg-gray-100 dark:bg-luxury-gray order-1 md:order-2 overflow-hidden cursor-crosshair group"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img 
              src={product.images[selectedImage] || product.images[0]} 
              alt={product.name}
              className={cn(
                "w-full h-full object-cover object-center transition-transform duration-200",
                isZoomed ? "scale-[2]" : "scale-100"
              )}
              style={isZoomed ? { transformOrigin: `${mousePosition.x}% ${mousePosition.y}%` } : undefined}
            />
            {product.discountPrice && (
              <div className="absolute top-4 left-4 bg-gold-500 text-black text-[10px] font-bold px-3 py-1 uppercase tracking-widest z-10">
                -Sale
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col pt-4">
          <nav className="flex space-x-2 text-[10px] uppercase tracking-widest text-gray-500 mb-6">
            <Link to="/" className="hover:text-gold-500 transition-colors">Home</Link>
            <span>/</span>
            <Link to={`/category/${product.categoryId}`} className="hover:text-gold-500 transition-colors">{product.categoryId}</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white truncate max-w-[200px]">{product.name}</span>
          </nav>

          <h1 className="font-serif text-3xl md:text-5xl font-bold text-black dark:text-white mb-4 leading-tight">{product.name}</h1>
          <div className="flex items-center space-x-4 mb-8">
            {product.discountPrice ? (
              <>
                <span className="text-2xl text-gold-500 font-serif italic">{formatCurrency(product.discountPrice)}</span>
                <span className="text-lg text-gray-400 line-through">{formatCurrency(product.price)}</span>
              </>
            ) : (
              <span className="text-2xl text-black dark:text-white font-serif italic">{formatCurrency(product.price)}</span>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="space-y-6 mb-8">
            {/* Colors */}
            {product.colors.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white">
                    Color: <span className="text-gray-500">{selectedColor}</span>
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all",
                        selectedColor === color 
                          ? "border-gold-500 p-0.5" 
                          : "border-transparent hover:border-gray-300"
                      )}
                      title={color}
                    >
                      <div className="w-full h-full rounded-full border border-gray-200" style={{ backgroundColor: color.toLowerCase() === 'white' ? '#fff' : color.toLowerCase() === 'black' ? '#000' : color.toLowerCase() === 'gold' ? '#C5A059' : color.toLowerCase() }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white">
                    Size: <span className="text-gray-500">{selectedSize}</span>
                  </h3>
                  <button className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-gold-500 underline underline-offset-4">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "w-12 h-12 flex items-center justify-center text-xs font-medium border transition-colors",
                        selectedSize === size 
                          ? "border-gold-500 bg-gold-500 text-black font-bold" 
                          : "border-gray-200 dark:border-gray-800 hover:border-gold-500 text-gray-700 dark:text-gray-300"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-3">Quantity</h3>
              <div className="flex items-center border border-gray-300 dark:border-gray-700 w-32 h-12">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-gold-500 transition-colors"
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity}
                  readOnly
                  className="flex-1 text-center bg-transparent focus:outline-none text-sm font-medium"
                />
                <button 
                  onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                  className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-gold-500 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {product.sizeChartImage && (
            <div className="mb-6 border border-gray-100 dark:border-gray-800 rounded p-2">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Size Chart</h4>
              <img src={product.sizeChartImage} alt="Size Chart" className="w-full h-auto object-contain" />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col space-y-4 mb-8">
            <div className="flex space-x-4">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-black dark:bg-white text-white dark:text-black h-14 flex items-center justify-center text-xs font-bold uppercase tracking-widest hover:bg-gold-500 dark:hover:bg-gold-500 hover:text-black transition-colors"
              >
                Add to Cart
              </button>
              <button 
                onClick={() => toggleWishlist(product.id)}
                className={cn(
                  "w-14 h-14 flex items-center justify-center border transition-colors",
                  isWishlisted 
                    ? "border-gold-500 text-gold-500 bg-gold-500/10" 
                    : "border-gray-300 dark:border-gray-700 text-gray-500 hover:border-gold-500 hover:text-gold-500"
                )}
              >
                <Heart size={20} className={isWishlisted ? "fill-current" : ""} />
              </button>
            </div>
            <button 
              onClick={handleBuyNow}
              className="w-full h-14 border border-black dark:border-white text-black dark:text-white flex items-center justify-center text-xs font-bold uppercase tracking-widest hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors"
            >
              Buy it Now
            </button>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-auto">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <Check size={16} className="text-green-500" />
              <span>In stock ({product.inventory} available)</span>
            </div>
            <p className="text-sm text-gray-500">Free shipping on orders over $500. Returns accepted within 30 days.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
