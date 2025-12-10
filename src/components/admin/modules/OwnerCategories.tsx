import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Grid, Search, Loader } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  image: string;
  description?: string;
  isActive?: boolean;
}

interface CategoryFilter {
  searchTerm: string;
  isActive: 'all' | 'active' | 'inactive';
}

const OwnerCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('service_categories');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Hair Services', image: '', description: 'Professional hair cutting, coloring, and treatments', isActive: true },
      { id: 2, name: 'Skin Care', image: '', description: 'Facial treatments and skincare services', isActive: true },
      { id: 3, name: 'Hands & Feet Care', image: '', description: 'Manicure and pedicure services', isActive: true },
      { id: 4, name: 'Bridal & Grooming', image: '', description: 'Special occasion and bridal packages', isActive: true },
      { id: 5, name: 'Waxing', image: '', description: 'Hair removal and waxing services', isActive: true },
      { id: 6, name: 'Threading', image: '', description: 'Traditional threading services', isActive: true },
      { id: 7, name: 'Nail Studio', image: '', description: 'Nail art and nail care', isActive: true },
      { id: 8, name: 'Packages', image: '', description: 'Special combo packages and offers', isActive: true },
    ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [filter, setFilter] = useState<CategoryFilter>({ searchTerm: '', isActive: 'all' });
  const [isSaving, setIsSaving] = useState(false);

  const initialFormState = {
    name: '',
    image: '',
    description: '',
    isActive: true
  };
  
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    localStorage.setItem('service_categories', JSON.stringify(categories));
  }, [categories]);

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
                         (category.description?.toLowerCase().includes(filter.searchTerm.toLowerCase()) ?? false);
    const matchesActive = filter.isActive === 'all' || 
                         (filter.isActive === 'active' ? category.isActive : !category.isActive);
    return matchesSearch && matchesActive;
  });

  const activeCount = categories.filter(c => c.isActive).length;
  const totalCount = categories.length;

  const getMediaLibraryImages = (): string[] => {
    const saved = localStorage.getItem('media_library');
    if (!saved) return [];
    const media = JSON.parse(saved);
    return media.filter((item: any) => item.type === 'gallery' || item.type === 'service').map((item: any) => item.url);
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
        type: 'gallery',
        size: `${(file.size / 1024).toFixed(1)} KB`,
        uploadedAt: new Date().toISOString()
      };
      media.push(newItem);
      localStorage.setItem('media_library', JSON.stringify(media));
      
      setFormData({ ...formData, image: imageUrl });
      setUploadingImage(false);
    };

    reader.readAsDataURL(file);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ 
      name: category.name, 
      image: category.image,
      description: category.description || '',
      isActive: category.isActive ?? true
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this category? Services in this category will not be affected.')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const toggleCategoryStatus = (id: number) => {
    setCategories(categories.map(c => 
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Category name is required');
      return;
    }

    setIsSaving(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (editingCategory) {
      setCategories(categories.map(c => 
        c.id === editingCategory.id ? { 
          id: c.id,
          name: formData.name, 
          image: formData.image,
          description: formData.description,
          isActive: formData.isActive
        } : c
      ));
    } else {
      setCategories([...categories, { 
        id: Date.now(), 
        name: formData.name, 
        image: formData.image,
        description: formData.description,
        isActive: formData.isActive
      }]);
    }
    
    setIsSaving(false);
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData(initialFormState);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Service Categories</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage {totalCount} categories - {activeCount} active</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-90 transition-opacity w-fit"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-white/10 p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search categories..."
              value={filter.searchTerm}
              onChange={e => setFilter({ ...filter, searchTerm: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'inactive'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilter({ ...filter, isActive: status })}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-colors ${
                  filter.isActive === status
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
                }`}
              >
                {status === 'all' ? 'All' : status === 'active' ? '✓ Active' : '✕ Inactive'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredCategories.map(category => (
          <div key={category.id} className="group relative bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-700 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
            <div className="relative h-40 bg-gray-100 dark:bg-neutral-700">
              {category.image ? (
                <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-700 dark:to-neutral-800">
                  <Grid className="w-12 h-12 text-gray-300 dark:text-neutral-600" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                <button 
                  onClick={() => handleEdit(category)}
                  className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/40 text-white transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(category.id)}
                  className="p-2.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-red-500/40 text-white transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {!category.isActive && (
                <div className="absolute top-2 right-2 bg-red-500/90 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                  INACTIVE
                </div>
              )}
            </div>
            <div className="p-3 text-center border-t border-gray-200 dark:border-neutral-700">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">{category.name}</h3>
              {category.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{category.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-sm">No categories found</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700 p-6 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingCategory ? '✏️ Edit Category' : '➕ Add New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Category Name *</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="e.g., Hair Services"
                  className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="Brief description of this category..."
                  rows={3}
                  className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white resize-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Category Image</label>
                
                <div className="relative">
                  {formData.image ? (
                    <div className="relative group">
                      <img src={formData.image} alt="preview" className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-neutral-700" />
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, image: ''})}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-lg p-8 text-center">
                      <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Click to upload or drag and drop</p>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden" 
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="inline-block px-4 py-2 bg-gray-100 dark:bg-neutral-800 rounded-lg text-xs font-bold cursor-pointer hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors">
                        {uploadingImage ? 'Uploading...' : 'Choose Image'}
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                <input 
                  type="checkbox" 
                  id="is-active"
                  checked={formData.isActive} 
                  onChange={e => setFormData({...formData, isActive: e.target.checked})} 
                  className="w-4 h-4 rounded accent-black dark:accent-white"
                />
                <label htmlFor="is-active" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                  Active on Homepage
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-neutral-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-lg text-sm font-bold bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 rounded-lg text-sm font-bold bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingCategory ? 'Update Category' : 'Create Category'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerCategories;
