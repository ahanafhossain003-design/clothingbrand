import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import { Save } from 'lucide-react';

export default function AdminSettings() {
  const { adminPhone, setAdminPhone } = useAppStore();
  const [phone, setPhone] = useState(adminPhone || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPhone(adminPhone || '');
  }, [adminPhone]);

  const handleSave = () => {
    setAdminPhone(phone);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-black dark:text-white">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage admin configurations</p>
        </div>
      </div>

      <div className="bg-white dark:bg-black p-6 rounded-lg border border-gray-100 dark:border-gray-800 max-w-2xl">
        <h2 className="text-sm font-bold uppercase tracking-widest text-black dark:text-white mb-6">Order Notifications</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">WhatsApp Notification Number</label>
            <p className="text-xs text-gray-400 mb-3">Enter your mobile number with country code (e.g. +8801700000000) to receive order notifications via WhatsApp when a customer places an order.</p>
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+880..." 
              className="w-full border border-gray-300 dark:border-gray-700 px-4 py-3 bg-transparent text-sm focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="pt-4">
            <button 
              onClick={handleSave}
              className="bg-black dark:bg-white text-white dark:text-black h-12 px-8 flex items-center justify-center text-xs font-bold uppercase tracking-widest hover:bg-gold-500 dark:hover:bg-gold-500 hover:text-black transition-colors"
            >
              <Save size={16} className="mr-2" />
              Save Settings
            </button>
            {saved && (
              <span className="ml-4 text-xs font-bold uppercase tracking-widest text-green-500">Saved successfully!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
