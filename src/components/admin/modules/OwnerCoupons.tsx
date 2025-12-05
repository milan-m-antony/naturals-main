
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Copy, Tag } from 'lucide-react';

interface Coupon {
  id: number;
  code: string;
  discount: string;
  service: string;
  tag: string;
  validUntil: string;
  maxUses: number;
  currentUses: number;
  bg: string;
  text: string;
  border: string;
  copyBtn: string;
}

const OwnerCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('user_offers');
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  
  const initialFormState = {
    code: '',
    discount: '10',
    service: 'All Services',
    tag: 'LIMITED',
    validUntil: '',
    maxUses: 100,
    currentUses: 0,
    bg: 'bg-[#8B5CF6] dark:bg-[#7C3AED]',
    text: 'text-white',
    border: 'border-white/20',
    copyBtn: 'bg-white/20 text-white hover:bg-white/30'
  };
  
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    localStorage.setItem('user_offers', JSON.stringify(coupons));
  }, [coupons]);

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData(coupon);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      setCoupons(coupons.filter(c => c.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const offText = formData.service === 'All Services' ? 'New' : 'OFF';
    if (editingCoupon) {
      setCoupons(coupons.map(c => c.id === editingCoupon.id ? { ...formData, offText, id: c.id } : c));
    } else {
      setCoupons([...coupons, { ...formData, offText, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setEditingCoupon(null);
    setFormData(initialFormState);
  };

  const handleAddNew = () => {
    setEditingCoupon(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const colorPresets = [
    { name: 'Purple', bg: 'bg-[#8B5CF6] dark:bg-[#7C3AED]', text: 'text-white', border: 'border-white/20', copyBtn: 'bg-white/20 text-white hover:bg-white/30' },
    { name: 'Yellow', bg: 'bg-[#FFC107] dark:bg-[#ECA609]', text: 'text-black', border: 'border-black/10', copyBtn: 'bg-white/90 text-black hover:bg-white' },
    { name: 'Green', bg: 'bg-[#10B981] dark:bg-[#059669]', text: 'text-white', border: 'border-white/20', copyBtn: 'bg-white/20 text-white hover:bg-white/30' },
    { name: 'Blue', bg: 'bg-[#06B6D4] dark:bg-[#0891B2]', text: 'text-white', border: 'border-white/20', copyBtn: 'bg-white/20 text-white hover:bg-white/30' },
    { name: 'Red', bg: 'bg-[#EF4444] dark:bg-[#DC2626]', text: 'text-white', border: 'border-white/20', copyBtn: 'bg-white/20 text-white hover:bg-white/30' },
    { name: 'Orange', bg: 'bg-[#F97316] dark:bg-[#EA580C]', text: 'text-white', border: 'border-white/20', copyBtn: 'bg-white/20 text-white hover:bg-white/30' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Discount Coupons</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create and manage promotional codes</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add Coupon
        </button>
      </div>

      {coupons.length === 0 ? (
        <div className="bg-white dark:bg-neutral-800 p-12 rounded-2xl border border-gray-200 dark:border-neutral-700 text-center">
          <Tag className="w-16 h-16 mx-auto text-gray-300 dark:text-neutral-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">No coupons created yet</p>
          <button onClick={handleAddNew} className="text-black dark:text-white font-medium hover:underline">
            Create your first coupon
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map(coupon => (
            <div key={coupon.id} className={`relative h-72 ${coupon.bg} rounded-[1.5rem] overflow-hidden shadow-lg group`}>
              {/* Cutouts */}
              <div className="absolute top-[62%] -left-3 w-6 h-6 bg-[#FDFBF7] dark:bg-neutral-950 rounded-full z-10"></div>
              <div className="absolute top-[62%] -right-3 w-6 h-6 bg-[#FDFBF7] dark:bg-neutral-950 rounded-full z-10"></div>
              
              {/* Dashed Line */}
              <div className={`absolute top-[62%] left-5 right-5 border-t-2 border-dashed ${coupon.border} z-0`}></div>

              {/* Top Part */}
              <div className="h-[62%] p-6 relative flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${coupon.text === 'text-white' ? 'bg-white/20 backdrop-blur-sm' : 'bg-black/10'} ${coupon.text}`}>
                    {coupon.tag}
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button 
                      onClick={() => handleEdit(coupon)}
                      className={`p-1.5 rounded-full ${coupon.text === 'text-white' ? 'bg-white/20 hover:bg-white/30' : 'bg-black/10 hover:bg-black/20'}`}
                    >
                      <Edit2 className={`w-3 h-3 ${coupon.text}`} />
                    </button>
                    <button 
                      onClick={() => handleDelete(coupon.id)}
                      className={`p-1.5 rounded-full ${coupon.text === 'text-white' ? 'bg-white/20 hover:bg-white/30' : 'bg-black/10 hover:bg-black/20'}`}
                    >
                      <Trash2 className={`w-3 h-3 ${coupon.text}`} />
                    </button>
                  </div>
                </div>
                
                <div>
                  <h4 className={`font-display text-5xl font-black italic ${coupon.text} leading-none mb-1`}>{coupon.discount}%</h4>
                  <div className={`flex flex-col leading-none ${coupon.text}`}>
                    <span className="text-xs font-medium uppercase tracking-wide opacity-90">OFF on</span>
                    <span className="text-lg font-bold mt-0.5">{coupon.service}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Part */}
              <div className="h-[38%] p-6 flex flex-col justify-between">
                <div className={`flex items-center justify-between ${coupon.text}`}>
                  <span className="text-xs font-medium opacity-80">Coupon Code</span>
                  <span className="text-xs opacity-60">{coupon.currentUses}/{coupon.maxUses} used</span>
                </div>
                <div className={`flex items-center gap-2 p-3 rounded-lg border ${coupon.border} ${coupon.text === 'text-white' ? 'bg-white/10' : 'bg-black/5'}`}>
                  <code className={`flex-1 text-sm font-bold tracking-widest ${coupon.text}`}>{coupon.code}</code>
                  <Copy className={`w-4 h-4 opacity-60 ${coupon.text}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700 p-6 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Coupon Code</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.code} 
                    onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} 
                    placeholder="SAVE20"
                    maxLength={15}
                    className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white font-mono" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Discount (%)</label>
                  <input 
                    type="number" 
                    required 
                    min="1"
                    max="100"
                    value={formData.discount} 
                    onChange={e => setFormData({...formData, discount: e.target.value})} 
                    className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Service / Category</label>
                <input 
                  type="text" 
                  required 
                  value={formData.service} 
                  onChange={e => setFormData({...formData, service: e.target.value})} 
                  placeholder="Hair Spa, Facials, All Services"
                  className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Valid Until</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.validUntil} 
                    onChange={e => setFormData({...formData, validUntil: e.target.value})} 
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Max Uses</label>
                  <input 
                    type="number" 
                    required 
                    min="1"
                    value={formData.maxUses} 
                    onChange={e => setFormData({...formData, maxUses: Number(e.target.value)})} 
                    className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Color Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {colorPresets.map(preset => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setFormData({...formData, bg: preset.bg, text: preset.text, border: preset.border, copyBtn: preset.copyBtn})}
                      className={`h-16 rounded-lg ${preset.bg} flex items-center justify-center text-sm font-bold ${preset.text} ${formData.bg === preset.bg ? 'ring-2 ring-black dark:ring-white ring-offset-2' : ''}`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-black dark:bg-white text-white dark:text-black py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity mt-4"
              >
                {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerCoupons;
