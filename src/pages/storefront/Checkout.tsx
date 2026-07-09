import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useAppStore } from '../../store';
import { formatCurrency, cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Checkout() {
  const { cart, products, addOrder, clearCart, adminPhone } = useAppStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    fullAddress: '',
    notes: '',
  });

  const [paymentMethodType, setPaymentMethodType] = useState<'COD' | 'Advance Payment'>('COD');
  const [paymentProvider, setPaymentProvider] = useState<'bKash' | 'Nagad'>('bKash');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  
  const [isSuccess, setIsSuccess] = useState(false);

  const cartItems = cart.map(item => ({
    ...item, 
    product: products.find(p => p.id === item.productId)!
  })).filter(item => item.product !== undefined);

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product.discountPrice || item.product.price;
    return acc + (price * item.quantity);
  }, 0);

  const total = subtotal + (subtotal > 500 ? 0 : 25);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethodType === 'Advance Payment') {
      if (!senderNumber || !transactionId) {
        alert('Please enter Sender Number and Transaction ID for advance payment.');
        return;
      }
    }

    const orderItems = cartItems.map(item => ({
      productId: item.productId,
      productName: item.product.name,
      price: item.product.discountPrice || item.product.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color
    }));

    addOrder({
      status: 'Pending order',
      customerInfo: {
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        email: '', // omitted but kept for compatibility if needed, or remove from type
        fullAddress: formData.fullAddress,
        notes: formData.notes
      },
      paymentInfo: {
        method: paymentMethodType === 'COD' ? 'Cash on Delivery' : paymentProvider,
        status: paymentMethodType === 'COD' ? 'Pending' : 'Pending Verification',
        ...(paymentMethodType === 'Advance Payment' && { senderNumber, transactionId })
      },
      items: orderItems,
      totalAmount: total
    });

    setIsSuccess(true);
    
    // Defer clearing the cart so local state update has time to process,
    // avoiding the useEffect navigating back to cart.
    setTimeout(() => {
      clearCart();
    }, 10);

    setTimeout(() => {
      navigate('/');
    }, 5000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  React.useEffect(() => {
    if (cartItems.length === 0 && !isSuccess) {
      navigate('/cart');
    }
  }, [cartItems.length, isSuccess, navigate]);

  React.useEffect(() => {
    if (isSuccess) {
      window.scrollTo(0, 0);
    }
  }, [isSuccess]);

  if (cartItems.length === 0 && !isSuccess) {
    return null;
  }

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-gold-500/10 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle size={48} className="text-gold-500" />
        </motion.div>
        <h1 className="font-serif text-4xl font-bold mb-4">Thank you for your order</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Your order is confirmed
        </p>
        <button 
          onClick={() => navigate('/')}
          className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-gold-500 dark:hover:bg-gold-500 hover:text-black transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
      <h1 className="font-serif text-3xl md:text-4xl font-bold mb-12 uppercase tracking-tight text-center">Checkout</h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
        <div className="lg:col-span-2 space-y-12">
          
          {/* Shipping Info */}
          <section>
            <h2 className="text-[10px] font-bold tracking-widest uppercase border-b border-gray-200 dark:border-gray-900 pb-4 mb-6 text-gray-500">1. Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold tracking-widest uppercase text-black dark:text-white mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-800 px-4 py-3 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold tracking-widest uppercase text-black dark:text-white mb-2">Mobile Number</label>
                <input 
                  type="tel" 
                  name="mobileNumber"
                  required
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-800 px-4 py-3 focus:outline-none focus:border-gold-500 transition-colors text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold tracking-widest uppercase text-black dark:text-white mb-2">Full Delivery Address</label>
                <textarea 
                  name="fullAddress"
                  required
                  value={formData.fullAddress}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-800 px-4 py-3 focus:outline-none focus:border-gold-500 transition-colors resize-none text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold tracking-widest uppercase text-black dark:text-white mb-2">Order Notes (Optional)</label>
                <textarea 
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-800 px-4 py-3 focus:outline-none focus:border-gold-500 transition-colors resize-none text-sm"
                />
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section>
            <h2 className="text-[10px] font-bold tracking-widest uppercase border-b border-gray-200 dark:border-gray-900 pb-4 mb-6 text-gray-500">2. Payment Method</h2>
            
            <div className="space-y-4">
              <label className={cn(
                "flex items-center p-4 border cursor-pointer transition-colors",
                paymentMethodType === 'COD' 
                  ? "border-gold-500 bg-gold-500/5 dark:bg-gold-500/10" 
                  : "border-gray-300 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700"
              )}>
                <input 
                  type="radio" 
                  name="paymentMethodType" 
                  value="COD"
                  checked={paymentMethodType === 'COD'}
                  onChange={() => setPaymentMethodType('COD')}
                  className="w-4 h-4 text-gold-500 focus:ring-gold-500"
                />
                <span className="ml-3 font-bold text-xs uppercase tracking-widest">Cash on Delivery (COD)</span>
              </label>

              <label className={cn(
                "flex flex-col border cursor-pointer transition-colors",
                paymentMethodType === 'Advance Payment' 
                  ? "border-gold-500 bg-gold-500/5 dark:bg-gold-500/10" 
                  : "border-gray-300 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700"
              )}>
                <div className="flex items-center p-4" onClick={() => setPaymentMethodType('Advance Payment')}>
                  <input 
                    type="radio" 
                    name="paymentMethodType" 
                    value="Advance Payment"
                    checked={paymentMethodType === 'Advance Payment'}
                    onChange={() => setPaymentMethodType('Advance Payment')}
                    className="w-4 h-4 text-gold-500 focus:ring-gold-500"
                  />
                  <span className="ml-3 font-bold text-xs uppercase tracking-widest">Advance Payment</span>
                </div>
                
                <AnimatePresence>
                  {paymentMethodType === 'Advance Payment' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 overflow-hidden border-t border-gray-200 dark:border-gray-800"
                    >
                      <div className="mt-4 grid grid-cols-2 gap-4 mb-6">
                        <button
                          type="button"
                          onClick={() => setPaymentProvider('bKash')}
                          className={cn(
                            "py-3 font-semibold uppercase tracking-wider text-xs border transition-colors",
                            paymentProvider === 'bKash' ? "bg-[#e2136e] text-white border-[#e2136e]" : "border-gray-300 dark:border-gray-700 hover:border-gray-400"
                          )}
                        >
                          bKash
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentProvider('Nagad')}
                          className={cn(
                            "py-3 font-semibold uppercase tracking-wider text-xs border transition-colors",
                            paymentProvider === 'Nagad' ? "bg-[#ed1c24] text-white border-[#ed1c24]" : "border-gray-300 dark:border-gray-700 hover:border-gray-400"
                          )}
                        >
                          Nagad
                        </button>
                      </div>

                      <div className="bg-gray-50 dark:bg-[#111] p-6 mb-6 border border-gray-200 dark:border-gray-800">
                        <div className="mb-5">
                          <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-1">Official {paymentProvider} Account</p>
                          <p className="font-mono text-2xl font-bold text-gold-600 dark:text-gold-500 tracking-wider">01777563972</p>
                        </div>
                        
                        <div>
                          <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-3">Payment Instructions</p>
                          <ol className="list-decimal pl-4 space-y-2 text-xs text-gray-600 dark:text-gray-400 font-medium">
                            <li>Please go to your <strong>{paymentProvider}</strong> app.</li>
                            <li>Select the <strong>Send Money</strong> option to transfer the required amount.</li>
                            <li>After a successful payment, copy your <strong>Transaction ID</strong> and <strong>Account Number</strong>.</li>
                            <li>Place the details in the form below to securely confirm your order.</li>
                          </ol>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold tracking-widest uppercase text-black dark:text-white mb-2">Sender {paymentProvider} Number *</label>
                          <input 
                            type="text" 
                            required={paymentMethodType === 'Advance Payment'}
                            value={senderNumber}
                            onChange={(e) => setSenderNumber(e.target.value)}
                            placeholder="e.g. 018XXXXXXXX"
                            className="w-full bg-transparent border border-gray-300 dark:border-gray-800 px-4 py-3 focus:outline-none focus:border-gold-500 transition-colors uppercase font-mono text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold tracking-widest uppercase text-black dark:text-white mb-2">{paymentProvider} Transaction ID *</label>
                          <input 
                            type="text" 
                            required={paymentMethodType === 'Advance Payment'}
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            placeholder="e.g. 7X8B9Q2Y"
                            className="w-full bg-transparent border border-gray-300 dark:border-gray-800 px-4 py-3 focus:outline-none focus:border-gold-500 transition-colors uppercase font-mono text-sm"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </label>
            </div>
          </section>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 dark:bg-[#111] p-8 lg:sticky lg:top-24 border border-gray-200 dark:border-gray-900">
            <h2 className="text-[10px] font-bold tracking-widest uppercase mb-6 text-gray-500 border-b border-gray-200 dark:border-gray-900 pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-20 bg-gray-100 dark:bg-luxury-gray flex-shrink-0 border border-gray-200 dark:border-gray-800">
                    <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider line-clamp-1">{item.product.name}</h4>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Qty: {item.quantity}</p>
                    <p className="text-xs font-serif italic mt-1 text-gold-500">
                      {formatCurrency((item.product.discountPrice || item.product.price) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Subtotal</span>
                <span className="font-serif italic">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Shipping</span>
                <span className="font-serif italic">{subtotal > 500 ? 'Free' : formatCurrency(25)}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold tracking-widest uppercase">Total</span>
                <span className="font-serif italic text-xl text-gold-500">{formatCurrency(total)}</span>
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-black dark:bg-white text-white dark:text-black h-14 text-xs font-bold tracking-widest uppercase hover:bg-gold-500 dark:hover:bg-gold-500 hover:text-black transition-colors"
            >
              Place Order
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
