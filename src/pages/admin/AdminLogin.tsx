import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { loginAdmin, isAdminAuthenticated, isDarkMode, adminPhone, setAdminPhone } = useAppStore();
  const [phone, setPhone] = useState(adminPhone || '');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin');
    }
  }, [isAdminAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'xyz000@gmail.com' && password === '000111222') {
      loginAdmin();
      if (phone) {
        setAdminPhone(phone);
      }
      navigate('/admin');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 dark:bg-luxury-black ${isDarkMode ? 'dark' : ''}`}>
      <div className="w-full max-w-md bg-white dark:bg-[#111] p-8 border border-gray-200 dark:border-gray-900 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl font-bold uppercase tracking-widest text-black dark:text-gold-500 mb-2">AURELIUS ADMIN</h1>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Authorized Personnel Only</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-widest text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-black dark:text-white mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-gray-300 dark:border-gray-800 text-black dark:text-white px-4 py-3 focus:outline-none focus:border-gold-500 transition-colors text-sm"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-black dark:text-white mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-gray-300 dark:border-gray-800 text-black dark:text-white px-4 py-3 focus:outline-none focus:border-gold-500 transition-colors text-sm"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-black dark:text-white mb-2">Notification Number (Optional)</label>
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-transparent border border-gray-300 dark:border-gray-800 text-black dark:text-white px-4 py-3 focus:outline-none focus:border-gold-500 transition-colors text-sm"
              placeholder="+880..."
            />
            <p className="text-[10px] text-gray-500 mt-2">Enter your WhatsApp number to receive new order notifications.</p>
          </div>
          
          <button 
            type="submit"
            className="w-full bg-black dark:bg-white text-white dark:text-black h-12 text-xs font-bold tracking-widest uppercase hover:bg-gold-500 dark:hover:bg-gold-500 hover:text-black transition-colors"
          >
            Login
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-gold-500 transition-colors"
          >
            &larr; Back to Store
          </button>
        </div>
      </div>
    </div>
  );
}
