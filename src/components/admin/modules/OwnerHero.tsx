
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Play } from 'lucide-react';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  badge: string;
  price: string;
  image: string;
}

const OwnerHero: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>(() => {
    const saved = localStorage.getItem('hero_slides');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: 'Natural',
        subtitle: 'Elegance.',
        description: 'Premium hair care that enhances your natural beauty. Expert stylists, organic products.',
        accent: 'text-yellow-300',
        badge: 'Hair Spa',
        price: 'Starting @ ₹1500',
        image: ''
      }
    ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const initialFormState = {
    title: '',
    subtitle: '',
    description: '',
    accent: 'text-yellow-300',
    badge: '',
    price: '',
    image: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    localStorage.setItem('hero_slides', JSON.stringify(slides));
  }, [slides]);

  const getMediaLibraryImages = (): string[] => {
    const saved = localStorage.getItem('media_library');
    if (!saved) return [];
    const media = JSON.parse(saved);
    return media.filter((item: any) => item.type === 'banner' || item.type === 'gallery').map((item: any) => item.url);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      
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
      
      setFormData({ ...formData, image: imageUrl });
      setUploadingImage(false);
    };

    reader.readAsDataURL(file);
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData(slide);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (slides.length === 1) {
      alert('Cannot delete the last slide. Add another slide first.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this hero slide?')) {
      setSlides(slides.filter(s => s.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSlide) {
      setSlides(slides.map(s => s.id === editingSlide.id ? { ...formData, id: s.id } : s));
    } else {
      setSlides([...slides, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setEditingSlide(null);
    setFormData(initialFormState);
  };

  const handleAddNew = () => {
    setEditingSlide(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const accentColors = [
    { name: 'Yellow', value: 'text-yellow-300' },
    { name: 'Pink', value: 'text-pink-300' },
    { name: 'Green', value: 'text-green-300' },
    { name: 'Purple', value: 'text-purple-300' },
    { name: 'Teal', value: 'text-teal-300' },
    { name: 'Orange', value: 'text-orange-300' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Hero Carousel</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage homepage hero slides</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add Slide
        </button>
      </div>

      <div className="space-y-4">
        {slides.map((slide, index) => (
          <div key={slide.id} className="group bg-white dark:bg-neutral-800 rounded-2xl border border-gray-200 dark:border-neutral-700 overflow-hidden flex flex-col md:flex-row">
            <div className="relative w-full md:w-48 h-48 md:h-auto bg-gray-100 dark:bg-neutral-700">
              {slide.image ? (
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-300 dark:text-neutral-600" />
                </div>
              )}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
                Slide {index + 1}
              </div>
            </div>
            
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white px-3 py-1 rounded-full text-xs font-bold">
                      {slide.badge}
                    </span>
                    <span className={`font-bold text-sm ${slide.accent}`}>
                      {slide.accent.split('-')[1].toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-bold italic text-gray-900 dark:text-white">
                    {slide.title} <span className={slide.accent}>{slide.subtitle}</span>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{slide.description}</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white mt-3">{slide.price}</p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => handleEdit(slide)}
                  className="flex-1 bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-neutral-600 flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(slide.id)}
                  className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-2 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700 p-6 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingSlide ? 'Edit Hero Slide' : 'Create Hero Slide'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Image Upload */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase">Hero Image (Landscape)</label>
                
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

                {formData.image && (
                  <div className="relative h-48 rounded-lg overflow-hidden border-2 border-black dark:border-white">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                  {getMediaLibraryImages().length === 0 ? (
                    <div className="col-span-3 text-center py-4 text-sm text-gray-500">
                      No images uploaded. Upload an image above.
                    </div>
                  ) : (
                    getMediaLibraryImages().map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setFormData({ ...formData, image: img })}
                        className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          formData.image === img ? 'border-black dark:border-white' : 'border-transparent hover:border-gray-300'
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
                  <label className="text-xs font-bold text-gray-500 uppercase">Main Title</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    placeholder="Natural"
                    className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Subtitle</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.subtitle} 
                    onChange={e => setFormData({...formData, subtitle: e.target.value})} 
                    placeholder="Elegance."
                    className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                <textarea 
                  rows={3} 
                  required 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="Premium hair care that enhances your natural beauty..."
                  className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white resize-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Badge Text</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.badge} 
                    onChange={e => setFormData({...formData, badge: e.target.value})} 
                    placeholder="Hair Spa"
                    className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Price/CTA Text</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})} 
                    placeholder="Starting @ ₹1500"
                    className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Accent Color (for subtitle)</label>
                <div className="grid grid-cols-3 gap-3">
                  {accentColors.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({...formData, accent: color.value})}
                      className={`h-12 rounded-lg flex items-center justify-center text-sm font-bold ${formData.accent === color.value ? 'ring-2 ring-black dark:ring-white ring-offset-2' : ''}`}
                      style={{ 
                        background: color.value.includes('yellow') ? '#FCD34D' :
                                   color.value.includes('pink') ? '#F9A8D4' :
                                   color.value.includes('green') ? '#6EE7B7' :
                                   color.value.includes('purple') ? '#C084FC' :
                                   color.value.includes('teal') ? '#5EEAD4' : '#FDBA74'
                      }}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-black dark:bg-white text-white dark:text-black py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity mt-4"
              >
                {editingSlide ? 'Update Slide' : 'Add Slide'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerHero;
