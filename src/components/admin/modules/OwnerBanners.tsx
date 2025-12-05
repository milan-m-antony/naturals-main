
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Eye } from 'lucide-react';

interface Banner {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  bgImage: string;
  ctaText: string;
  theme: {
    tagBg: string;
    subtitleColor: string;
  };
}

const OwnerBanners: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem('banners');
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const initialFormState = {
    tag: '',
    title: '',
    subtitle: '',
    description: '',
    bgImage: '',
    ctaText: 'Explore Now',
    theme: {
      tagBg: 'bg-red-500',
      subtitleColor: 'text-yellow-300'
    }
  };
  
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    localStorage.setItem('banners', JSON.stringify(banners));
  }, [banners]);

  const getMediaLibraryImages = (): string[] => {
    const saved = localStorage.getItem('media_library');
    if (!saved) return [];
    const media = JSON.parse(saved);
    return media.filter((item: any) => item.type === 'banner').map((item: any) => item.url);
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
        type: 'banner',
        size: `${(file.size / 1024).toFixed(1)} KB`,
        uploadedAt: new Date().toISOString()
      };
      media.push(newItem);
      localStorage.setItem('media_library', JSON.stringify(media));
      
      // Set as selected image
      setFormData({ ...formData, bgImage: imageUrl });
      setUploadingImage(false);
    };

    reader.readAsDataURL(file);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData(banner);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      setBanners(banners.filter(b => b.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBanner) {
      setBanners(banners.map(b => b.id === editingBanner.id ? { ...formData, id: b.id } : b));
    } else {
      setBanners([...banners, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setEditingBanner(null);
    setFormData(initialFormState);
  };

  const handleAddNew = () => {
    setEditingBanner(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const colorOptions = [
    { name: 'Red', bg: 'bg-red-500' },
    { name: 'Pink', bg: 'bg-pink-500' },
    { name: 'Blue', bg: 'bg-blue-500' },
    { name: 'Green', bg: 'bg-green-500' },
    { name: 'Yellow', bg: 'bg-yellow-500' },
    { name: 'Purple', bg: 'bg-purple-500' },
    { name: 'Orange', bg: 'bg-orange-500' },
  ];

  const textColorOptions = [
    { name: 'Yellow', color: 'text-yellow-300' },
    { name: 'Pink', color: 'text-pink-200' },
    { name: 'Blue', color: 'text-blue-200' },
    { name: 'Green', color: 'text-green-200' },
    { name: 'White', color: 'text-white' },
    { name: 'Orange', color: 'text-orange-200' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Promotional Banners</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage homepage carousel banners</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      {banners.length === 0 ? (
        <div className="bg-white dark:bg-neutral-800 p-12 rounded-2xl border border-gray-200 dark:border-neutral-700 text-center">
          <ImageIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-neutral-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">No banners created yet</p>
          <button onClick={handleAddNew} className="text-black dark:text-white font-medium hover:underline">
            Create your first banner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {banners.map(banner => (
            <div key={banner.id} className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-200 dark:border-neutral-700 overflow-hidden group">
              <div className="relative h-48 overflow-hidden">
                {banner.bgImage ? (
                  <img src={banner.bgImage} alt={banner.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className={`${banner.theme.tagBg} text-white px-3 py-1 rounded-full text-xs font-bold inline-block mb-2`}>
                    {banner.tag}
                  </span>
                  <h3 className="text-white font-bold text-xl mb-1">{banner.title}</h3>
                  <p className={`${banner.theme.subtitleColor} font-bold text-lg`}>{banner.subtitle}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{banner.description}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(banner)}
                    className="flex-1 bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-neutral-600 flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(banner.id)}
                    className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-2 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700 p-6 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingBanner ? 'Edit Banner' : 'Create New Banner'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Banner Image */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase">Banner Image (Landscape)</label>
                
                {/* Upload Button */}
                <div className="mb-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                    <ImageIcon className="w-4 h-4" />
                    {uploadingImage ? 'Uploading...' : 'Upload New Banner'}
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
                {formData.bgImage && (
                  <div className="relative h-48 rounded-lg overflow-hidden border-2 border-black dark:border-white">
                    <img src={formData.bgImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Image Grid */}
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                  {getMediaLibraryImages().length === 0 ? (
                    <div className="col-span-3 text-center py-4 text-sm text-gray-500">
                      No banner images uploaded. Upload an image above.
                    </div>
                  ) : (
                    getMediaLibraryImages().map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setFormData({ ...formData, bgImage: img })}
                        className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          formData.bgImage === img ? 'border-black dark:border-white' : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Text Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Tag Label</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.tag} 
                    onChange={e => setFormData({...formData, tag: e.target.value})} 
                    placeholder="Limited Time"
                    className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">CTA Button Text</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.ctaText} 
                    onChange={e => setFormData({...formData, ctaText: e.target.value})} 
                    className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Main Title</label>
                <input 
                  type="text" 
                  required 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder="Mega Beauty Sale"
                  className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Subtitle (Highlight)</label>
                <input 
                  type="text" 
                  required 
                  value={formData.subtitle} 
                  onChange={e => setFormData({...formData, subtitle: e.target.value})} 
                  placeholder="UP TO 50% OFF"
                  className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                <textarea 
                  rows={3} 
                  required 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="Brief description of the offer..."
                  className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white resize-none" 
                />
              </div>

              {/* Theme Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Tag Background Color</label>
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map(option => (
                      <button
                        key={option.bg}
                        type="button"
                        onClick={() => setFormData({...formData, theme: {...formData.theme, tagBg: option.bg}})}
                        className={`h-10 rounded-lg ${option.bg} ${formData.theme.tagBg === option.bg ? 'ring-2 ring-black dark:ring-white ring-offset-2' : ''}`}
                        title={option.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Subtitle Text Color</label>
                  <div className="grid grid-cols-3 gap-2">
                    {textColorOptions.map(option => (
                      <button
                        key={option.color}
                        type="button"
                        onClick={() => setFormData({...formData, theme: {...formData.theme, subtitleColor: option.color}})}
                        className={`h-10 rounded-lg bg-gray-800 flex items-center justify-center text-xs font-bold ${option.color} ${formData.theme.subtitleColor === option.color ? 'ring-2 ring-black dark:ring-white ring-offset-2' : ''}`}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-black dark:bg-white text-white dark:text-black py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity mt-4"
              >
                {editingBanner ? 'Update Banner' : 'Create Banner'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerBanners;
