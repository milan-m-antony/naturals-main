
import React, { useState } from 'react';
import { Package, AlertCircle, Plus, Search, Filter, X } from 'lucide-react';
import { useData } from '@/store';

const AdminInventory: React.FC = () => {
  const { inventory, updateInventory } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Hair Care',
    stock: 0,
    unit: 'units'
  });

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, would call addInventoryItem from context
    console.log('Adding item:', newItem);
    setIsAddModalOpen(false);
    setNewItem({ name: '', category: 'Hair Care', stock: 0, unit: 'units' });
  };

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
                    <input 
                      type="text" 
                      placeholder="Search products..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-sm outline-none focus:border-black dark:focus:border-white" 
                    />
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-black dark:bg-white text-white dark:text-black px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-90">
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
                        {filteredInventory.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                              {searchQuery ? 'No items found matching your search' : 'No inventory items'}
                            </td>
                          </tr>
                        ) : (
                        filteredInventory.map((item) => (
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
                        ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Add Item Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsAddModalOpen(false)}>
            <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-md w-full" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700 p-6 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Inventory Item</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddItem} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Item Name</label>
                  <input 
                    type="text" 
                    required 
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white" 
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                  <select 
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white"
                  >
                    <option>Hair Care</option>
                    <option>Skin Care</option>
                    <option>Styling Tools</option>
                    <option>Consumables</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Initial Stock</label>
                    <input 
                      type="number" 
                      required 
                      min="0"
                      value={newItem.stock}
                      onChange={(e) => setNewItem({...newItem, stock: Number(e.target.value)})}
                      className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Unit</label>
                    <select 
                      value={newItem.unit}
                      onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white"
                    >
                      <option>units</option>
                      <option>bottles</option>
                      <option>kg</option>
                      <option>liters</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-black dark:bg-white text-white dark:text-black py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity mt-4"
                >
                  Add Item
                </button>
              </form>
            </div>
          </div>
        )}
    </div>
  );
};

export default AdminInventory;
