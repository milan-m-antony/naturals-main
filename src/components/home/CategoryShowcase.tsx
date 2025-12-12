import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Grid2X2, Search } from 'lucide-react';
import { useData } from '@/store';

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
  const { services } = useData();
  const [CATEGORIES, setCATEGORIES] = useState(DEFAULT_CATEGORIES);

  // Count services per category
  const serviceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    services.forEach(service => {
      counts[service.category] = (counts[service.category] || 0) + 1;
    });
    return counts;
  }, [services]);

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
    <div className="bg-[#FDFBF7] dark:bg-neutral-950 py-16 md:py-24 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="inline-block bg-yellow-400 text-black px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-6 animate-in slide-in-from-bottom-2 fade-in duration-700">Browse Services</span>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-black italic tracking-tighter mb-6 text-gray-900 dark:text-white animate-in slide-in-from-bottom-4 fade-in duration-700 delay-100">
            Explore by <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Category</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed animate-in slide-in-from-bottom-6 fade-in duration-700 delay-200">
            Find the perfect treatment for your needs
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map((category, idx) => (
            <div 
              key={category.name} 
              onClick={() => onCategoryClick(category.name)}
              className="group relative h-44 md:h-56 rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 animate-in slide-in-from-bottom-8 fade-in duration-700"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <img 
                src={category.image || DEFAULT_CATEGORIES[0].image} 
                alt={category.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_CATEGORIES[0].image;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:via-black/50 transition-colors duration-300"></div>
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-6">
                {/* Top - Category Icon Badge */}
                <div className="flex justify-end">
                  <div className="w-10 h-10 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Grid2X2 className="w-5 h-5" />
                  </div>
                </div>

                {/* Bottom - Category Name and Count */}
                <div className="space-y-3">
                  <h3 className="font-display text-lg md:text-xl font-bold text-white drop-shadow-lg leading-tight">
                    {category.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm text-white/80 font-medium">
                      {serviceCounts[category.name] || 0} services
                    </span>
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-black opacity-0 group-hover:opacity-100 -translate-x-3 group-hover:translate-x-0 transition-all duration-300 shadow-lg">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
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