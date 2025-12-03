
import React from 'react';
import { Package, AlertCircle, Plus, Search, Filter } from 'lucide-react';
import { useData } from '@/store';

const AdminInventory: React.FC = () => {
  const { inventory, updateInventory } = useData();

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'In Stock': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
        case 'Low Stock': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        case 'Critical': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
        default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Inventory Management</h2>
            <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search products..." className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm outline-none focus:border-black dark:focus:border-white" />
                </div>
                <button className="bg-black dark:bg-white text-white dark:text-black px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-90">
                    <Plus className="w-4 h-4" /> Add Item
                </button>
            </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-neutral-700/50 text-gray-500 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Item Name</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4 text-center">Stock Level</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                        {inventory.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/30 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-gray-100 dark:bg-neutral-700 flex items-center justify-center text-gray-400">
                                            <Package className="w-4 h-4" />
                                        </div>
                                        {item.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.category}</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-3">
                                        <button 
                                            onClick={() => updateInventory(item.id, Math.max(0, item.stock - 1))}
                                            className="w-6 h-6 rounded-full border border-gray-200 dark:border-neutral-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-700"
                                        >-</button>
                                        <span className="font-mono font-bold w-8 text-center dark:text-white">{item.stock}</span>
                                        <button 
                                            onClick={() => updateInventory(item.id, item.stock + 1)}
                                            className="w-6 h-6 rounded-full border border-gray-200 dark:border-neutral-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-700"
                                        >+</button>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">{item.unit}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-xs font-bold text-blue-600 hover:underline">Restock</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default AdminInventory;
