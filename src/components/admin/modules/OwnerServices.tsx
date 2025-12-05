
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { useData } from '@/store';
import type { Service } from '@/types';

const OwnerServices: React.FC = () => {
  const { services, addService, updateService, deleteService } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  const initialFormState = {
    name: '',
    category: 'Hair Services',
    price: 0,
    duration: 30,
    description: '',
    discount: 0
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

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
      setFormData(initialFormState);
      setSelectedImage('');
      setIsModalOpen(true);
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
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Service Menu</h2>
        <button 
          onClick={handleAddNew}
          className="bg-black dark:bg-white text-white dark:text-black px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <div key={service.id} className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-4 flex flex-col group hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-4">
               <div className="w-12 h-12 bg-gray-100 dark:bg-neutral-700 rounded-lg overflow-hidden">
                  <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
               </div>
               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(service)} className="p-2 bg-gray-100 dark:bg-neutral-700 rounded-full hover:bg-blue-50 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(service.id)} className="p-2 bg-gray-100 dark:bg-neutral-700 rounded-full hover:bg-red-50 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
               </div>
            </div>
            <div className="flex-1">
               <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{service.name}</h3>
               <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{service.category}</p>
               <div className="flex justify-between items-end border-t border-gray-100 dark:border-neutral-700 pt-3">
                  <div>
                     <p className="text-lg font-bold text-gray-900 dark:text-white">₹{service.price}</p>
                     {service.discount && service.discount > 0 ? <p className="text-[10px] text-green-500 font-bold">{service.discount}% OFF</p> : null}
                  </div>
                  <span className="text-xs font-medium text-gray-400">{service.duration} mins</span>
               </div>
            </div>
          </div>
        ))}
      </div>

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
                          {['Hair Services', 'Skin Care', 'Hands & Feet Care', 'Bridal & Grooming', 'Waxing', 'Packages'].map(c => <option key={c} value={c}>{c}</option>)}
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
