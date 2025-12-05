
import React, { useState, useEffect } from 'react';
import { Save, Clock, MapPin, Phone, Mail, Globe } from 'lucide-react';

const OwnerSettings: React.FC = () => {
  const [shopDetails, setShopDetails] = useState(() => {
    const saved = localStorage.getItem('shop_settings');
    return saved ? JSON.parse(saved) : {
      name: 'Naturals Salon Kanjirappally',
      address: 'Loyola Arcade, Puthenangadi Jn, Kanjirappally, Kerala 686507',
      phone: '+91 97444 88822',
      email: 'kanjirappally@naturals.com',
      website: 'www.naturals.in',
      gstin: '32ABCDE1234F1Z5'
    };
  });

  const [hours, setHours] = useState(() => {
    const saved = localStorage.getItem('shop_hours');
    return saved ? JSON.parse(saved) : {
      open: '09:00',
      close: '20:00'
    };
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShopDetails({ ...shopDetails, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem('shop_settings', JSON.stringify(shopDetails));
    localStorage.setItem('shop_hours', JSON.stringify(hours));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Shop Settings</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure your shop details and operating hours</p>
          </div>
          <button onClick={handleSave} className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${saveSuccess ? 'bg-green-500 text-white' : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90'}`}>
             <Save className="w-4 h-4" /> {saveSuccess ? 'Saved!' : 'Save Changes'}
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Info */}
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-gray-200 dark:border-neutral-700 space-y-4">
             <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white border-b border-gray-100 dark:border-neutral-700 pb-2">General Information</h3>
             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Shop Name</label>
                <input type="text" name="name" value={shopDetails.name} onChange={handleChange} className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white" />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Address</label>
                <div className="relative">
                   <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                   <input type="text" name="address" value={shopDetails.address} onChange={handleChange} className="w-full bg-gray-50 dark:bg-neutral-700 p-3 pl-9 rounded-lg text-sm outline-none dark:text-white" />
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase">Phone</label>
                   <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" name="phone" value={shopDetails.phone} onChange={handleChange} className="w-full bg-gray-50 dark:bg-neutral-700 p-3 pl-9 rounded-lg text-sm outline-none dark:text-white" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                   <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="email" name="email" value={shopDetails.email} onChange={handleChange} className="w-full bg-gray-50 dark:bg-neutral-700 p-3 pl-9 rounded-lg text-sm outline-none dark:text-white" />
                   </div>
                </div>
             </div>
          </div>

          {/* Operations */}
          <div className="space-y-6">
             <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-gray-200 dark:border-neutral-700 space-y-4">
                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white border-b border-gray-100 dark:border-neutral-700 pb-2">Operating Hours</h3>
                <div className="flex items-center gap-4">
                   <div className="flex-1 space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Open Time</label>
                      <div className="relative">
                         <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                         <input type="time" value={hours.open} onChange={(e) => setHours({...hours, open: e.target.value})} className="w-full bg-gray-50 dark:bg-neutral-700 p-3 pl-9 rounded-lg text-sm outline-none dark:text-white" />
                      </div>
                   </div>
                   <div className="flex-1 space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Close Time</label>
                      <div className="relative">
                         <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                         <input type="time" value={hours.close} onChange={(e) => setHours({...hours, close: e.target.value})} className="w-full bg-gray-50 dark:bg-neutral-700 p-3 pl-9 rounded-lg text-sm outline-none dark:text-white" />
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-gray-200 dark:border-neutral-700 space-y-4">
                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white border-b border-gray-100 dark:border-neutral-700 pb-2">Business Details</h3>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase">GSTIN / Tax ID</label>
                   <input type="text" name="gstin" value={shopDetails.gstin} onChange={handleChange} className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase">Website</label>
                   <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" name="website" value={shopDetails.website} onChange={handleChange} className="w-full bg-gray-50 dark:bg-neutral-700 p-3 pl-9 rounded-lg text-sm outline-none dark:text-white" />
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default OwnerSettings;
