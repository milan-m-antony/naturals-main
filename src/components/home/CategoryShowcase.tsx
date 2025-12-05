import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const DEFAULT_CATEGORIES = [
  { name: 'Hair Services', image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=800' },
  { name: 'Skin Care', image: 'https://images.unsplash.com/photo-1556228852-6d45a7d8a632?auto=format&fit=crop&q=80&w=800' },
  { name: 'Hands & Feet Care', image: 'https://images.unsplash.com/photo-1519415495209-76295304a37f?auto=format&fit=crop&q=80&w=800' },
  { name: 'Bridal & Grooming', image: 'https://images.unsplash.com/photo-1617196020537-add3c04297a7?auto=format&fit=crop&q=80&w=800' },
  { name: 'Waxing', image: 'https://images.unsplash.com/photo-1616941441916-94db75fce65c?auto=format&fit=crop&q=80&w=800' },
  { name: 'Threading', image: 'https://images.unsplash.com/photo-1531750164672-b7a42337d6e8?auto=format&fit=crop&q=80&w=800' },
  { name: 'Nail Studio', image: 'https://images.unsplash.com/photo-1604338838656-2e1189d4c153?auto=format&fit=crop&q=80&w=800' },
  { name: 'Packages', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800' }
];

interface CategoryShowcaseProps {
  onCategoryClick: (categoryName: string) => void;
}

const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ onCategoryClick }) => {
  const [CATEGORIES, setCATEGORIES] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    const saved = localStorage.getItem('service_categories');
    if (saved) {
      try {
        const categories = JSON.parse(saved);
        if (Array.isArray(categories) && categories.length > 0) {
          setCATEGORIES(categories.map((cat: any) => ({
            name: cat.name || 'Unnamed Category',
            image: cat.image || DEFAULT_CATEGORIES.find(d => d.name === cat.name)?.image || DEFAULT_CATEGORIES[0].image
          })));
        }
      } catch (error) {
        console.error('Failed to parse service categories from localStorage:', error);
      }
    }
  }, []);
  return (
    <div className="bg-[#FDFBF7] dark:bg-neutral-950 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold italic text-gray-900 dark:text-white">Explore by Category</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Find the perfect treatment for your needs.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map((category) => (
            <div 
              key={category.name} 
              onClick={() => onCategoryClick(category.name)}
              className="group relative h-40 md:h-48 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-shadow duration-300"
            >
              <img 
                src={category.image || DEFAULT_CATEGORIES[0].image} 
                alt={category.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  // Fallback for broken images
                  e.currentTarget.src = DEFAULT_CATEGORIES[0].image;
                }}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
              <div className="absolute inset-0 flex items-end justify-between p-4">
                <h3 className="font-bold text-sm md:text-base text-white drop-shadow-md">{category.name}</h3>
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryShowcase;