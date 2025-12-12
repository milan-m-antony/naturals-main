/* copilot:follow
This module is MARKED AS DONE.
It is protected. Do NOT modify unless the user explicitly asks.
*/
import React, { useEffect, useState } from 'react';
import { Edit2, Image as ImageIcon, Plus, Trash2, X } from 'lucide-react';
import { heroSlideService } from '@/services/api/heroSlideService';
import type { HeroSlide } from '@/types';

const OwnerHero: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const initialFormState = {
    title: '',
    subtitle: '',
    description: '',
    accentColor: '#FCD34D',
    badge: '',
    price: '',
    image: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await heroSlideService.getAll();
        if (mounted) setSlides(data);
      } catch (err) {
        console.error('Failed to load hero slides', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

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
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle || '',
      description: slide.description || '',
      accentColor: slide.accentColor || '#FCD34D',
      badge: slide.badge || '',
      price: slide.price || '',
      image: slide.image || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (slides.length === 1) {
      alert('Cannot delete the last slide. Add another slide first.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this hero slide?')) return;
    try {
      await heroSlideService.delete(id);
      setSlides((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Failed to delete hero slide', err);
      alert('Failed to delete hero slide. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSlide) {
        const updated = await heroSlideService.update(editingSlide.id, formData);
        setSlides((prev) => prev.map((s) => (s.id === editingSlide.id ? updated : s)));
      } else {
        const created = await heroSlideService.create(formData as Partial<HeroSlide>);
        setSlides((prev) => [...prev, created]);
      }
      setIsModalOpen(false);
      setEditingSlide(null);
      setFormData(initialFormState);
    } catch (err) {
      console.error('Failed to save hero slide', err);
      alert('Failed to save hero slide. Please try again.');
    }
  };

  const handleAddNew = () => {
    setEditingSlide(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const accentColors = [
    { name: 'Yellow', value: '#FCD34D' },
    { name: 'Pink', value: '#F9A8D4' },
    { name: 'Green', value: '#34D399' },
    { name: 'Purple', value: '#C4B5FD' },
    { name: 'Teal', value: '#14B8A6' },
    { name: 'Orange', value: '#FDBA74' },
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
        {isLoading && <p className="text-sm text-gray-500">Loading slides...</p>}
        {!isLoading && slides.length === 0 && (
          <p className="text-sm text-gray-500">No slides yet. Add your first slide.</p>
        )}
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
                    <span className="font-bold text-sm" style={{ color: slide.accentColor || '#FCD34D' }}>
                      Accent
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-bold italic text-gray-900 dark:text-white">
                    {slide.title} <span style={{ color: slide.accentColor || '#FCD34D' }}>{slide.subtitle}</span>
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700 p-6 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{editingSlide ? 'Edit Hero Slide' : 'Create Hero Slide'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase">Hero Image (Landscape)</label>
                <div className="grid md:grid-cols-2 gap-3">
                  <label className="flex items-center justify-center h-36 border-2 border-dashed border-gray-200 dark:border-neutral-700 rounded-2xl cursor-pointer hover:border-black dark:hover:border-white transition-colors">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    <div className="flex flex-col items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      {uploadingImage ? (
                        <span>Uploading...</span>
                      ) : (
                        <>
                          <ImageIcon className="w-6 h-6" />
                          <span>Click to upload</span>
                        </>
                      )}
                    </div>
                  </label>
                  {formData.image ? (
                    <div className="h-36 rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-700">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-36 rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-700 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                      No image selected
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    placeholder="Natural"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Subtitle</label>
                  <input
                    type="text"
                    required
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    placeholder="Elegance."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Badge</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    placeholder="Hair Spa"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Price / CTA</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                    placeholder="Starting @ ₹1500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                  rows={3}
                  placeholder="Premium hair care that enhances your natural beauty..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Accent Color (for subtitle)</label>
                <div className="grid grid-cols-3 gap-2">
                  {accentColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, accentColor: color.value })}
                      className={`h-12 rounded-lg flex items-center justify-center text-sm font-bold ${formData.accentColor === color.value ? 'ring-2 ring-black dark:ring-white ring-offset-2' : ''}`}
                      style={{ backgroundColor: color.value, color: '#111827' }}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="color"
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    className="h-10 w-16 rounded border border-gray-200 dark:border-neutral-700 bg-transparent"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Custom hex color</span>
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
