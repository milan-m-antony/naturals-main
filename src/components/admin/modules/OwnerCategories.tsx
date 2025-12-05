
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Grid } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  image: string;
}

const OwnerCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('service_categories');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Hair Services', image: '' },
      { id: 2, name: 'Skin Care', image: '' },
      { id: 3, name: 'Hands & Feet Care', image: '' },
      { id: 4, name: 'Bridal & Grooming', image: '' },
      { id: 5, name: 'Waxing', image: '' },
      { id: 6, name: 'Threading', image: '' },
      { id: 7, name: 'Nail Studio', image: '' },
      { id: 8, name: 'Packages', image: '' },
    ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const initialFormState = {
    name: '',
    image: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    localStorage.setItem('service_categories', JSON.stringify(categories));
  }, [categories]);

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
    setFormData({ name: category.name, image: category.image });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...formData, id: c.id } : c));
    } else {
      setCategories([...categories, { ...formData, id: Date.now() }]);
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Service Categories</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage categories displayed on homepage</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map(category => (
          <div key={category.id} className="group relative bg-white dark:bg-neutral-800 rounded-2xl border border-gray-200 dark:border-neutral-700 overflow-hidden">
            <div className="relative h-40 bg-gray-100 dark:bg-neutral-700">
              {category.image ? (
                <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Grid className="w-12 h-12 text-gray-300 dark:text-neutral-600" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button 
                  onClick={() => handleEdit(category)}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30"
                >
                  <Edit2 className="w-4 h-4 text-white" />
                </button>
                <button 
                  onClick={() => handleDelete(category.id)}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            <div className="p-3 text-center">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">{category.name}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700 p-6 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Category Name</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="Hair Services"
                  className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white" 
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase">Category Image</label>
                
                {/* Upload Button */}
                <div className="mb-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                    <ImageIcon className="w-4 h-4" />
                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                </div>

                {/* Preview Selected Image */}
                {formData.image && (
                  <div className="relative h-48 rounded-lg overflow-hidden border-2 border-black dark:border-white">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Image Grid */}
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                  {getMediaLibraryImages().length === 0 ? (
                    <div className="col-span-4 text-center py-4 text-sm text-gray-500">
                      No images uploaded. Upload an image above.
                    </div>
                  ) : (
                    getMediaLibraryImages().map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setFormData({ ...formData, image: img })}
                        className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          formData.image === img ? 'border-black dark:border-white' : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))
                  )}
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-black dark:bg-white text-white dark:text-black py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity mt-4"
              >
                {editingCategory ? 'Update Category' : 'Add Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerCategories;
