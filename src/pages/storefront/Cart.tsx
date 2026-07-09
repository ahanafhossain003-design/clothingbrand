import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import { useAppStore } from '../../store';
import { formatCurrency } from '../../lib/utils';
import { motion } from 'framer-motion';

export default function Cart() {
  const { cart, products, removeFromCart, updateCartQuantity } = useAppStore();
  const navigate = useNavigate();

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product !== undefined);

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product!.discountPrice || item.product!.price;
    return acc + (price * item.quantity);
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center max-w-7xl mx-auto px-4">
        <ShoppingBag size={64} className="text-gray-300 mb-6" />
        <h2 className="font-serif text-3xl font-bold mb-4 text-center">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Looks like you haven't added anything to your cart yet. Discover our latest collections and find something you love.
        </p>
        <Link 
          to="/" 
          className="bg-gold-500 text-white px-8 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-gold-600 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
      <h1 className="font-serif text-3xl md:text-4xl mb-12 font-bold tracking-tight text-center">Your Shopping Bag</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-0">
          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 dark:border-gray-900 text-[10px] font-bold tracking-widest uppercase text-gray-500">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
          </div>
          
          {cartItems.map((item) => {
            const price = item.product!.discountPrice || item.product!.price;
            return (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                key={item.id} 
                className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center py-6 border-b border-gray-200 dark:border-gray-900 last:border-0"
              >
                {/* Product Info */}
                <div className="col-span-6 flex items-center w-full">
                  <div className="w-24 h-32 bg-gray-100 dark:bg-luxury-gray flex-shrink-0 border border-gray-200 dark:border-gray-800">
                    <img src={item.product!.images[0]} alt={item.product!.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="ml-6 flex-1">
                    <Link to={`/product/${item.product!.id}`} className="text-sm font-bold uppercase tracking-wider text-black dark:text-white hover:text-gold-500 transition-colors block mb-1">
                      {item.product!.name}
                    </Link>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest space-y-1">
                      {item.size && <span>Size: {item.size} </span>}
                      {item.color && <span>| Color: {item.color}</span>}
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-[10px] text-gray-400 hover:text-gold-500 font-bold uppercase tracking-widest mt-4 flex items-center transition-colors"
                    >
                      <Trash2 size={12} className="mr-1" /> Remove
                    </button>
                  </div>
                </div>
                
                {/* Price (Mobile hidden, Desktop shown) */}
                <div className="col-span-2 text-center hidden md:block text-sm font-serif italic text-black dark:text-white">
                  {formatCurrency(price)}
                </div>
                
                {/* Quantity & Mobile Price */}
                <div className="col-span-2 flex md:justify-center w-full md:w-auto justify-between items-center mt-4 md:mt-0">
                  <span className="md:hidden font-serif italic text-sm">{formatCurrency(price)}</span>
                  <div className="flex items-center border border-gray-300 dark:border-gray-700 h-10 w-24">
                    <button 
                      onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-gold-500 transition-colors"
                    ><Minus size={12}/></button>
                    <span className="flex-1 text-center text-xs font-bold text-black dark:text-white">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.id, Math.min(item.product!.inventory, item.quantity + 1))}
                      className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-gold-500 transition-colors"
                    ><Plus size={12}/></button>
                  </div>
                </div>
                
                {/* Total */}
                <div className="col-span-2 text-right w-full md:w-auto flex justify-between md:block mt-4 md:mt-0 pt-4 md:pt-0 border-t border-gray-100 md:border-0">
                  <span className="md:hidden text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total</span>
                  <span className="text-sm font-serif italic text-black dark:text-white">{formatCurrency(price * item.quantity)}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 dark:bg-[#111] p-8 lg:sticky lg:top-24 h-fit border border-gray-200 dark:border-gray-900">
            <h2 className="text-xs font-bold mb-6 tracking-widest uppercase text-black dark:text-white">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Subtotal</span>
                <span className="font-serif italic text-sm text-black dark:text-white">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Shipping</span>
                <span className="font-serif italic text-sm text-black dark:text-white">{subtotal > 500 ? 'Free' : formatCurrency(25)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Tax</span>
                <span className="font-serif italic text-sm text-black dark:text-white">Calculated at checkout</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-bold uppercase tracking-widest text-xs text-black dark:text-white">Estimated Total</span>
                <span className="font-serif italic text-xl text-gold-500">{formatCurrency(subtotal + (subtotal > 500 ? 0 : 25))}</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-black dark:bg-white text-white dark:text-black h-14 font-bold tracking-widest uppercase hover:bg-gold-500 dark:hover:bg-gold-500 hover:text-black transition-colors flex justify-center items-center text-xs"
            >
              Proceed to Checkout
            </button>
            
            <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 text-center mt-6">
              Secure Checkout • Free Returns
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
