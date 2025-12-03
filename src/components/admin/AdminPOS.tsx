
import React, { useState } from 'react';
import { Printer, X } from 'lucide-react';
import { useData } from '@/store';

const AdminPOS: React.FC = () => {
  const { services } = useData();
  const [posCart, setPosCart] = useState<any[]>([]);
  const [invoiceSuccess, setInvoiceSuccess] = useState(false);

  const handleGenerateInvoice = () => {
    setInvoiceSuccess(true);
    setTimeout(() => {
      setInvoiceSuccess(false);
      setPosCart([]);
    }, 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
      <div className="lg:col-span-8 space-y-4 overflow-y-auto custom-scrollbar pr-2">
        <div className="sticky top-0 bg-[#F4F5F7] dark:bg-neutral-950 z-10 pb-2">
           <input type="text" placeholder="Search services to add to bill..." className="w-full bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 p-4 rounded-xl text-sm outline-none focus:border-yellow-400 dark:focus:border-yellow-400 text-gray-900 dark:text-white" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {services.map(s => (
            <button 
              key={s.id} 
              onClick={() => setPosCart([...posCart, s])} 
              className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-gray-200 dark:border-neutral-700 text-left hover:border-yellow-400 dark:hover:border-yellow-400 hover:shadow-md transition-all flex flex-col justify-between h-28 group"
            >
              <p className="font-bold text-sm line-clamp-2 text-gray-900 dark:text-white">{s.name}</p>
              <div className="flex justify-between items-center mt-2">
                 <p className="text-xs text-gray-500 dark:text-gray-400">{s.category}</p>
                 <p className="font-bold text-sm text-gray-900 dark:text-white">₹{s.price}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="lg:col-span-4 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6 flex flex-col shadow-xl h-fit">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900 dark:text-white"><Printer className="w-5 h-5" /> New Invoice</h3>
        <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar mb-4 border-t border-b border-gray-100 dark:border-neutral-700 py-2 max-h-[200px]">
          {posCart.length === 0 ? <p className="text-center text-gray-400 text-xs py-4">Cart is empty</p> : posCart.map((item, i) => (
            <div key={i} className="flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-neutral-700/50 rounded-lg group">
              <span className="font-medium truncate pr-2 text-gray-900 dark:text-white">{item.name}</span>
              <div className="flex items-center gap-3">
                 <span className="font-bold text-gray-900 dark:text-white">₹{item.price}</span>
                 <button onClick={() => setPosCart(posCart.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500"><X className="w-3 h-3" /></button>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="flex justify-between font-bold text-xl border-t border-gray-200 dark:border-neutral-700 pt-4 mb-4 text-gray-900 dark:text-white">
            <span>Total</span>
            <span>₹{Math.round(posCart.reduce((sum, item) => sum + item.price, 0) * 1.18)}</span>
          </div>
          {invoiceSuccess ? (
            <div className="bg-green-100 text-green-800 p-3 rounded-xl text-center text-xs font-bold">Invoice Generated!</div>
          ) : (
            <button 
              onClick={handleGenerateInvoice}
              disabled={posCart.length === 0}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold text-xs uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Generate & Print Invoice
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPOS;
