
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, ChevronDown, Zap } from 'lucide-react';
import { useData } from '@/store';
import type { Service } from '@/types';
import { DEFAULT_HAIR_SERVICES } from './DefaultServices';

interface Category {
  id: number;
  name: string;
  image?: string;
  description?: string;
  isActive?: boolean;
}

const OwnerServices: React.FC = () => {
  const { services, addService, updateService, deleteService } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  
  const initialFormState = {
    name: '',
    category: '',
    price: 0,
    duration: 30,
    description: '',
    discount: 0
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Load categories from localStorage and react to changes
  useEffect(() => {
    const loadCategories = () => {
      const saved = localStorage.getItem('service_categories');
      const fallback = [
        { id: 1, name: 'Hair Services', image: '', description: 'Professional hair cutting, coloring, and treatments', isActive: true },
        { id: 2, name: 'Skin Care', image: '', description: 'Facial treatments and skincare services', isActive: true },
        { id: 3, name: 'Hands & Feet Care', image: '', description: 'Manicure and pedicure services', isActive: true },
        { id: 4, name: 'Bridal & Grooming', image: '', description: 'Special occasion and bridal packages', isActive: true },
        { id: 5, name: 'Waxing', image: '', description: 'Hair removal and waxing services', isActive: true },
        { id: 6, name: 'Threading', image: '', description: 'Traditional threading services', isActive: true },
        { id: 7, name: 'Nail Studio', image: '', description: 'Nail art and nail care', isActive: true },
        { id: 8, name: 'Packages', image: '', description: 'Special combo packages and offers', isActive: true },
      ];

      try {
        const loadedCategories = saved ? JSON.parse(saved) : fallback;
        setCategories(loadedCategories);
        // Reset form/category filter defaults when list changes
        setFormData(prev => ({ ...prev, category: loadedCategories[0]?.name || '' }));
        setCategoryFilter(prev => (prev === 'All' ? 'All' : loadedCategories.find(c => c.name === prev)?.name || 'All'));
      } catch (error) {
        console.error('Failed to load categories:', error);
        setCategories(fallback);
        setFormData(prev => ({ ...prev, category: fallback[0].name }));
      }
    };

    loadCategories();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'service_categories') loadCategories();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const getServicesByCategory = (categoryName: string) => {
    return services.filter(s => s.category === categoryName);
  };

  const filteredCategories = categoryFilter === 'All'
    ? categories
    : categories.filter(c => c.name === categoryFilter);

  const toggleCategoryExpand = (categoryName: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      category: service.category,
      price: service.price,
      duration: service.duration,
      description: service.description,
      discount: service.discount || 0
    });
    setSelectedImage(service.image || '');
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteService(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) {
      alert('Please select a category');
      return;
    }
    if (editingService) {
      updateService(editingService.id, { ...formData, image: selectedImage });
    } else {
      addService({ ...formData, image: selectedImage });
    }
    setIsModalOpen(false);
    setEditingService(null);
    setFormData(initialFormState);
    setSelectedImage('');
  };

  const handleAddNew = () => {
      setEditingService(null);
      setFormData({ ...initialFormState, category: categories[0]?.name || '' });
      setSelectedImage('');
      setIsModalOpen(true);
  };

  const handleLoadDefaultServices = async () => {
    if (services.length > 0) {
      alert('You already have services. Clear them first if you want to load defaults.');
      return;
    }
    
    for (const serviceData of DEFAULT_HAIR_SERVICES) {
      try {
        await addService(serviceData);
      } catch (error) {
        console.error('Error adding default service:', error);
      }
    }
    alert(`${DEFAULT_HAIR_SERVICES.length} Hair Services loaded successfully!`);
  };

  const getMediaLibraryImages = (): string[] => {
    const saved = localStorage.getItem('media_library');
    if (!saved) return [];
    const media = JSON.parse(saved);
    return media.filter((item: any) => item.type === 'service').map((item: any) => item.url);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      
      // Save to media library
      const saved = localStorage.getItem('media_library');
      const media = saved ? JSON.parse(saved) : [];
      const newItem = {
        id: Date.now(),
        url: imageUrl,
        name: file.name,
        type: 'service',
        size: `${(file.size / 1024).toFixed(1)} KB`,
        uploadedAt: new Date().toISOString()
      };
      media.push(newItem);
      localStorage.setItem('media_library', JSON.stringify(media));
      
      // Set as selected image
      setSelectedImage(imageUrl);
      setUploadingImage(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Service Menu</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total: {services.length} services</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-end">
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl px-3 py-2">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Category</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-sm text-gray-900 dark:text-white outline-none"
            >
              <option value="All">All</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          {services.length === 0 && (
            <button 
              onClick={handleLoadDefaultServices}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
            >
              <Zap className="w-4 h-4" /> Load Hair Services
            </button>
          )}
          <button 
            onClick={handleAddNew}
            className="bg-black dark:bg-white text-white dark:text-black px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Add Service
          </button>
        </div>
      </div>

      {/* Empty State */}
      {services.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-neutral-800/50 rounded-2xl border border-gray-200 dark:border-neutral-700">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No services added yet</p>
          <button 
            onClick={handleAddNew}
            className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm font-bold inline-flex items-center gap-2 hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Create First Service
          </button>
        </div>
      )}

      {/* Categories with Services */}
      {filteredCategories.map(category => {
        const categoryServices = getServicesByCategory(category.name);
        const isExpanded = expandedCategories.includes(category.name);
        
        return (
          <div key={category.id} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl overflow-hidden">
            {/* Category Header */}
            <button
              onClick={() => toggleCategoryExpand(category.name)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors"
            >
              <div className="flex items-center gap-3 text-left">
                {category.image && (
                  <img src={category.image} alt={category.name} className="w-10 h-10 rounded-lg object-cover" />
                )}
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{category.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {categoryServices.length} {categoryServices.length === 1 ? 'service' : 'services'}
                  </p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            {/* Services Grid */}
            {isExpanded && (
              <div className="p-4 border-t border-gray-200 dark:border-neutral-700">
                {categoryServices.length === 0 ? (
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-6">
                    No services in this category
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryServices.map(service => (
                      <div key={service.id} className="bg-gray-50 dark:bg-neutral-700/50 border border-gray-200 dark:border-neutral-600 rounded-xl p-4 flex flex-col group hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-3">
                          <div className="w-12 h-12 bg-gray-200 dark:bg-neutral-600 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={service.image} alt={service.name} className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/50'} />
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(service)} className="p-1.5 bg-white dark:bg-neutral-600 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDelete(service.id)} className="p-1.5 bg-white dark:bg-neutral-600 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1 line-clamp-2">{service.name}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{service.description}</p>
                          <div className="flex justify-between items-end border-t border-gray-200 dark:border-neutral-600 pt-3">
                            <div>
                              <p className="text-lg font-bold text-gray-900 dark:text-white">₹{service.price}</p>
                              {service.discount && service.discount > 0 && <p className="text-[10px] text-green-600 dark:text-green-400 font-bold">{service.discount}% OFF</p>}
                            </div>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{service.duration}m</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
           <div className="bg-white dark:bg-neutral-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg text-gray-900 dark:text-white">{editingService ? 'Edit Service' : 'New Service'}</h3>
                 <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-black dark:hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-gray-500 uppercase">Name</label>
                       <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                       <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white">
                          <option value="">Select a category</option>
                          {categories.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                       </select>
                    </div>
                 </div>
                 <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-gray-500 uppercase">Price (₹)</label>
                       <input type="number" required min="0" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-gray-500 uppercase">Duration (min)</label>
                       <input type="number" required min="5" value={formData.duration} onChange={e => setFormData({...formData, duration: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-gray-500 uppercase">Discount (%)</label>
                       <input type="number" min="0" max="100" value={formData.discount} onChange={e => setFormData({...formData, discount: Number(e.target.value)})} className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white" />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                    <textarea rows={3} required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white resize-none" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Service Image</label>
                    
                    {/* Upload Button */}
                    <div className="mb-3">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                        <ImageIcon className="w-4 h-4" />
                        {uploadingImage ? 'Uploading...' : 'Upload New Image'}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>

                    {/* Image Grid */}
                    <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                      {getMediaLibraryImages().length === 0 ? (
                        <div className="col-span-4 text-center py-4 text-sm text-gray-500">
                          No service images uploaded. Upload an image above or go to Media Library.
                        </div>
                      ) : (
                        getMediaLibraryImages().map((img, idx) => (
                          <div
                            key={idx}
                            onClick={() => setSelectedImage(img)}
                            className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                              selectedImage === img ? 'border-black dark:border-white' : 'border-transparent hover:border-gray-300'
                            }`}
                          >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))
                      )}
                    </div>
                 </div>
                 <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity mt-4">
                    {editingService ? 'Update Service' : 'Create Service'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default OwnerServices;
