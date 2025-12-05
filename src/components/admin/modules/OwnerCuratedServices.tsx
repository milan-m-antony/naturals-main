import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Image as ImageIcon, Sparkles } from 'lucide-react';

interface HairServicePin {
  top: string;
  left: string;
  label: string;
}

interface HairServiceImage {
  id: number;
  image: string;
  alt: string;
  pins: HairServicePin[];
}

interface SkinFeature {
  id: number;
  text: string;
}

interface BridalSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  icon: 'crown' | 'gift' | 'heart';
}

interface CuratedServicesData {
  sectionTitle: string;
  sectionDescription: string;
  hairStudio: HairServiceImage[];
  skinFeatures: SkinFeature[];
  skinImage: string;
  bridalSlides: BridalSlide[];
}

const DEFAULT_DATA: CuratedServicesData = {
  sectionTitle: "Curated Services",
  sectionDescription: "Expertly designed treatments using premium organic products.",
  hairStudio: [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400",
      alt: "Hair Cut",
      pins: [
        { top: "40%", left: "50%", label: "CREATIVE CUT" },
        { top: "70%", left: "30%", label: "BANGS TRIM" }
      ]
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400",
      alt: "Color",
      pins: [
        { top: "30%", left: "60%", label: "GLOBAL COLOR" },
        { top: "60%", left: "40%", label: "HIGHLIGHTS" }
      ]
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=400",
      alt: "Spa",
      pins: [{ top: "50%", left: "50%", label: "HAIR SPA" }]
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=400",
      alt: "Styling",
      pins: [
        { top: "30%", left: "70%", label: "BLOW DRY" },
        { top: "70%", left: "40%", label: "KERATIN" }
      ]
    }
  ],
  skinFeatures: [
    { id: 1, text: "RADIANCE" },
    { id: 2, text: "HYDRATION" },
    { id: 3, text: "YOUTH" },
    { id: 4, text: "GLOW" }
  ],
  skinImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800",
  bridalSlides: [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=800",
      title: "Bridal Suite",
      subtitle: "For your special day",
      icon: "crown"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=800",
      title: "Combo Offers",
      subtitle: "Full Body Polishing",
      icon: "gift"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800",
      title: "Pre-Wedding",
      subtitle: "Glow Treatments",
      icon: "heart"
    }
  ]
};

const OwnerCuratedServices: React.FC = () => {
  const [data, setData] = useState<CuratedServicesData>(DEFAULT_DATA);
  const [editMode, setEditMode] = useState<'header' | 'hair' | 'skin' | 'bridal' | null>(null);
  const [tempData, setTempData] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('curated_services');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData({ ...DEFAULT_DATA, ...parsed });
      } catch (error) {
        console.error('Failed to parse curated services data:', error);
      }
    }
  }, []);

  const saveData = (newData: CuratedServicesData) => {
    setData(newData);
    localStorage.setItem('curated_services', JSON.stringify(newData));
  };

  const handleSave = () => {
    if (!tempData) return;
    
    switch (editMode) {
      case 'header':
        saveData({ ...data, sectionTitle: tempData.title, sectionDescription: tempData.description });
        break;
      case 'skin':
        saveData({ ...data, skinFeatures: tempData.features, skinImage: tempData.image });
        break;
      case 'bridal':
        saveData({ ...data, bridalSlides: tempData });
        break;
    }
    
    setEditMode(null);
    setTempData(null);
  };

  const startEditHeader = () => {
    setEditMode('header');
    setTempData({ title: data.sectionTitle, description: data.sectionDescription });
  };

  const startEditSkin = () => {
    setEditMode('skin');
    setTempData({ features: [...data.skinFeatures], image: data.skinImage });
  };

  const startEditBridal = () => {
    setEditMode('bridal');
    setTempData([...data.bridalSlides]);
  };

  const addSkinFeature = () => {
    if (!tempData) return;
    const newFeature = { id: Date.now(), text: "NEW FEATURE" };
    setTempData({ ...tempData, features: [...tempData.features, newFeature] });
  };

  const deleteSkinFeature = (id: number) => {
    if (!tempData) return;
    setTempData({ ...tempData, features: tempData.features.filter((f: SkinFeature) => f.id !== id) });
  };

  const updateSkinFeature = (id: number, text: string) => {
    if (!tempData) return;
    setTempData({
      ...tempData,
      features: tempData.features.map((f: SkinFeature) => f.id === id ? { ...f, text } : f)
    });
  };

  const addBridalSlide = () => {
    if (!tempData) return;
    const newSlide: BridalSlide = {
      id: Date.now(),
      image: "",
      title: "New Slide",
      subtitle: "Description",
      icon: "crown"
    };
    setTempData([...tempData, newSlide]);
  };

  const deleteBridalSlide = (id: number) => {
    if (!tempData || tempData.length <= 1) return;
    setTempData(tempData.filter((s: BridalSlide) => s.id !== id));
  };

  const updateBridalSlide = (id: number, field: keyof BridalSlide, value: any) => {
    if (!tempData) return;
    setTempData(tempData.map((s: BridalSlide) => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleImageUpload = (callback: (url: string) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          callback(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Curated Services</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage the curated services showcase section</p>
        </div>
      </div>

      {/* Section Header */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Section Header
          </h2>
          {editMode !== 'header' ? (
            <button
              onClick={startEditHeader}
              className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-bold hover:scale-105 transition-transform"
            >
              <Edit2 className="w-4 h-4" /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:scale-105 transition-transform"
              >
                <Save className="w-4 h-4" /> Save
              </button>
              <button
                onClick={() => { setEditMode(null); setTempData(null); }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-bold hover:scale-105 transition-transform"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          )}
        </div>

        {editMode === 'header' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={tempData?.title || ''}
                onChange={(e) => setTempData({ ...tempData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <input
                type="text"
                value={tempData?.description || ''}
                onChange={(e) => setTempData({ ...tempData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{data.sectionTitle}</h3>
            <p className="text-gray-600 dark:text-gray-400">{data.sectionDescription}</p>
          </div>
        )}
      </div>

      {/* Skin Lounge Features */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Skin Lounge Features</h2>
          {editMode !== 'skin' ? (
            <button
              onClick={startEditSkin}
              className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-bold hover:scale-105 transition-transform"
            >
              <Edit2 className="w-4 h-4" /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:scale-105 transition-transform"
              >
                <Save className="w-4 h-4" /> Save
              </button>
              <button
                onClick={() => { setEditMode(null); setTempData(null); }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-bold hover:scale-105 transition-transform"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          )}
        </div>

        {editMode === 'skin' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Background Image</label>
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  value={tempData?.image || ''}
                  onChange={(e) => setTempData({ ...tempData, image: e.target.value })}
                  placeholder="Enter image URL"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                />
                <button
                  onClick={() => handleImageUpload((url) => setTempData({ ...tempData, image: url }))}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-neutral-800 rounded-xl text-sm font-bold hover:bg-gray-200 dark:hover:bg-neutral-700"
                >
                  <ImageIcon className="w-4 h-4" /> Upload
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Animated Text Features</label>
                <button
                  onClick={addSkinFeature}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:scale-105 transition-transform"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {tempData?.features?.map((feature: SkinFeature) => (
                  <div key={feature.id} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={feature.text}
                      onChange={(e) => updateSkinFeature(feature.id, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => deleteSkinFeature(feature.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Features:</strong> {data.skinFeatures.map(f => f.text).join(', ')}
            </div>
            {data.skinImage && (
              <img src={data.skinImage} alt="Skin Lounge" className="w-full h-40 object-cover rounded-xl" />
            )}
          </div>
        )}
      </div>

      {/* Bridal & Combo Slides */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bridal & Combo Carousel</h2>
          {editMode !== 'bridal' ? (
            <button
              onClick={startEditBridal}
              className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-bold hover:scale-105 transition-transform"
            >
              <Edit2 className="w-4 h-4" /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:scale-105 transition-transform"
              >
                <Save className="w-4 h-4" /> Save
              </button>
              <button
                onClick={() => { setEditMode(null); setTempData(null); }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-bold hover:scale-105 transition-transform"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          )}
        </div>

        {editMode === 'bridal' ? (
          <div className="space-y-4">
            <button
              onClick={addBridalSlide}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:scale-105 transition-transform"
            >
              <Plus className="w-4 h-4" /> Add Slide
            </button>

            {tempData?.map((slide: BridalSlide) => (
              <div key={slide.id} className="p-4 border border-gray-200 dark:border-white/10 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-900 dark:text-white">Slide {slide.id}</h4>
                  {tempData.length > 1 && (
                    <button
                      onClick={() => deleteBridalSlide(slide.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={slide.image}
                      onChange={(e) => updateBridalSlide(slide.id, 'image', e.target.value)}
                      placeholder="Image URL"
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
                    />
                    <button
                      onClick={() => handleImageUpload((url) => updateBridalSlide(slide.id, 'image', url))}
                      className="px-3 py-2 bg-gray-100 dark:bg-neutral-800 rounded-lg text-xs font-bold hover:bg-gray-200 dark:hover:bg-neutral-700"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Title</label>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => updateBridalSlide(slide.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={slide.subtitle}
                      onChange={(e) => updateBridalSlide(slide.id, 'subtitle', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Icon</label>
                  <select
                    value={slide.icon}
                    onChange={(e) => updateBridalSlide(slide.id, 'icon', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="crown">Crown</option>
                    <option value="gift">Gift</option>
                    <option value="heart">Heart</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.bridalSlides.map((slide) => (
              <div key={slide.id} className="relative rounded-xl overflow-hidden h-48">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-3 left-3">
                  <h4 className="font-bold text-white text-sm">{slide.title}</h4>
                  <p className="text-white/70 text-xs">{slide.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerCuratedServices;
