
import React, { useState } from 'react';
import { ChevronDown, Download, TrendingUp, CreditCard, ArrowUpRight, Wallet } from 'lucide-react';
import type { Appointment } from '@/types';

interface UserSpendingsProps {
  appointments: Appointment[];
  showToast: (msg: string, type?: 'success' | 'loading') => void;
}

const UserSpendings: React.FC<UserSpendingsProps> = ({ appointments, showToast }) => {
  const [selectedDateRange, setSelectedDateRange] = useState('This Month');
  const [dateRangeOpen, setDateRangeOpen] = useState(false);

  const completedApts = appointments.filter(a => a.status === 'Completed');
  const totalSpent = completedApts.reduce((sum, item) => sum + item.price, 0);
  
  // Calculate real savings from discounts
  const totalSaved = completedApts.reduce((sum, apt) => {
    // Check if service has discount
    const discountPercent = apt.discount || 0;
    const originalPrice = Math.round(apt.price / (1 - discountPercent / 100));
    const saved = originalPrice - apt.price;
    return sum + (saved > 0 ? saved : 0);
  }, 0);

  const handleDownload = (type: string) => {
    showToast(`Generating ${type}...`, 'loading');
    setTimeout(() => {
        showToast(`${type} downloaded successfully!`);
    }, 1500);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8 min-h-[500px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6 md:mb-8">
            <div>
                <h2 className="font-display text-4xl font-bold italic text-gray-900 dark:text-white mb-2">My Spendings</h2>
                <p className="text-gray-500 dark:text-gray-400">Track your beauty investments.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto scrollbar-hide pb-2 md:pb-0 relative">
                <div className="relative">
                    <button 
                        onClick={() => setDateRangeOpen(!dateRangeOpen)}
                        className="flex items-center gap-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 px-4 py-2.5 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors min-w-[120px] justify-between whitespace-nowrap"
                    >
                        <span>{selectedDateRange}</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    {dateRangeOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-gray-100 dark:border-neutral-700 z-20 p-1 animate-in fade-in zoom-in-95">
                            {['Last 30 Days', 'Last 3 Months', 'This Year', 'All Time'].map((range) => (
                                <button 
                                    key={range}
                                    onClick={() => { setSelectedDateRange(range); setDateRangeOpen(false); showToast(`Filtered by: ${range}`); }}
                                    className="w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <button 
                    onClick={() => handleDownload('Statement')}
                    className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:opacity-80 transition-opacity whitespace-nowrap"
                >
                    <Download className="w-3.5 h-3.5" /> Statement
                </button>
            </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#111827] text-white p-6 rounded-[2rem] relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Total Spent</p>
                <h3 className="font-display text-4xl font-bold italic">₹{totalSpent.toLocaleString()}</h3>
                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-green-400">
                    <TrendingUp className="w-4 h-4" /> +12% this month
                </div>
            </div>
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-[2rem] border border-gray-100 dark:border-neutral-700 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">Total Saved</p>
                <h3 className="font-display text-4xl font-bold italic text-green-600 dark:text-green-400">₹{totalSaved.toLocaleString()}</h3>
                <p className="mt-4 text-xs text-gray-400">Through offers & membership</p>
            </div>
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-[2rem] border border-gray-100 dark:border-neutral-700 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">Loyalty Points</p>
                <h3 className="font-display text-4xl font-bold italic text-yellow-500">2,450</h3>
                <p className="mt-4 text-xs text-gray-400">Redeemable on next booking</p>
            </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-6 md:p-8 border border-gray-100 dark:border-neutral-800">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Recent Transactions</h3>
            <div className="space-y-4">
                {completedApts.length === 0 ? (
                    <p className="text-gray-400 text-sm">No completed transactions yet.</p>
                ) : (
                    completedApts.map((apt) => (
                        <div key={apt.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-2xl transition-colors group border border-transparent hover:border-gray-200 dark:hover:border-neutral-700">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:shadow-md transition-all shrink-0">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-gray-900 dark:text-white truncate pr-2 text-sm md:text-base">{apt.service}</h4>
                                    <p className="text-xs text-gray-500">{new Date(apt.date).toLocaleDateString()} • {apt.time}</p>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <span className="block font-bold text-gray-900 dark:text-white text-sm md:text-base">- ₹{apt.price}</span>
                                <button className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-1 justify-end mt-1">
                                    Invoice <ArrowUpRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    </div>
  );
};

export default UserSpendings;
