import React, { useState, useMemo } from 'react';
import { Heart, Sparkles, Zap, Crown, TrendingUp, Clock } from 'lucide-react';
import { useData } from '@/store';

const GenderSpecificServices: React.FC<{ onCategoryClick: (category: string) => void }> = ({ onCategoryClick }) => {
  const { services } = useData();
  const [activeTab, setActiveTab] = useState<'women' | 'men'>('women');

  // Categorize services by gender
  const categorizedServices = useMemo(() => {
    const categoryMap: Record<string, { icon: any; services: string[]; isTrending: boolean; discount: number }> = {
      'Hair Services': {
        icon: Sparkles,
        services: [],
        isTrending: false,
        discount: 0
      },
      'Skin Care': {
        icon: Heart,
        services: [],
        isTrending: false,
        discount: 0
      },
      'Hands & Feet Care': {
        icon: Crown,
        services: [],
        isTrending: false,
        discount: 0
      },
      'Bridal & Grooming': {
        icon: Crown,
        services: [],
        isTrending: false,
        discount: 0
      },
      'Waxing': {
        icon: Zap,
        services: [],
        isTrending: false,
        discount: 0
      },
      'Threading': {
        icon: Zap,
        services: [],
        isTrending: false,
        discount: 0
      },
      'Nail Studio': {
        icon: Crown,
        services: [],
        isTrending: false,
        discount: 0
      }
    };

    // Group services by category and track trending/discounts
    services.forEach(service => {
      if (categoryMap[service.category]) {
        categoryMap[service.category].services.push(service.name);
        if ((service.discount || 0) > 15) categoryMap[service.category].isTrending = true;
        categoryMap[service.category].discount = Math.max(categoryMap[service.category].discount, service.discount || 0);
      }
    });

    return categoryMap;
  }, [services]);

  const womenServices = [
    {
      id: 1,
      title: 'Hair Care',
      description: 'Color treatments, hair spa, smoothening',
      icon: Sparkles,
      services: categorizedServices['Hair Services'].services.slice(0, 3),
      price: '₹1500 - ₹5000',
      trending: categorizedServices['Hair Services'].isTrending
    },
    {
      id: 2,
      title: 'Skin Care',
      description: 'Professional facials for every skin type',
      icon: Heart,
      services: categorizedServices['Skin Care'].services.slice(0, 3),
      price: '₹800 - ₹3000',
      trending: categorizedServices['Skin Care'].isTrending
    },
    {
      id: 3,
      title: 'Bridal & Special',
      description: 'Complete packages with hair, makeup & skin',
      icon: Crown,
      services: categorizedServices['Bridal & Grooming'].services.slice(0, 3),
      price: '₹5000 - ₹15000',
      trending: categorizedServices['Bridal & Grooming'].isTrending
    },
    {
      id: 4,
      title: 'Waxing & Threading',
      description: 'Hair removal & shaping services',
      icon: Zap,
      services: [...(categorizedServices['Waxing'].services.slice(0, 1) || []), ...(categorizedServices['Threading'].services.slice(0, 2) || [])].slice(0, 3),
      price: '₹300 - ₹2000',
      trending: categorizedServices['Waxing'].isTrending || categorizedServices['Threading'].isTrending
    },
    {
      id: 5,
      title: 'Nail Studio',
      description: 'Nail designs, extensions & pedicures',
      icon: Crown,
      services: categorizedServices['Nail Studio'].services.slice(0, 3),
      price: '₹500 - ₹2500',
      trending: categorizedServices['Nail Studio'].isTrending
    },
    {
      id: 6,
      title: 'Hands & Feet Care',
      description: 'Manicure and pedicure services',
      icon: Crown,
      services: categorizedServices['Hands & Feet Care'].services.slice(0, 3),
      price: '₹400 - ₹2000',
      trending: categorizedServices['Hands & Feet Care'].isTrending
    }
  ];

  const menServices = [
    {
      id: 1,
      title: 'Grooming',
      description: 'Professional beard care & styling',
      icon: Crown,
      services: categorizedServices['Hair Services'].services.slice(0, 3),
      price: '₹300 - ₹1000',
      trending: categorizedServices['Hair Services'].isTrending
    },
    {
      id: 2,
      title: 'Skin Care',
      description: 'Specialized facials for men',
      icon: Sparkles,
      services: categorizedServices['Skin Care'].services.slice(0, 3),
      price: '₹800 - ₹2500',
      trending: categorizedServices['Skin Care'].isTrending
    },
    {
      id: 3,
      title: 'Body Care',
      description: 'Complete grooming for active men',
      icon: Zap,
      services: categorizedServices['Waxing'].services.slice(0, 3),
      price: '₹500 - ₹1500',
      trending: categorizedServices['Waxing'].isTrending
    },
    {
      id: 4,
      title: 'Wellness',
      description: 'Massage & relaxation therapies',
      icon: Heart,
      services: ['Massage', 'Therapy', 'Relax'],
      price: '₹1000 - ₹3000',
      trending: false
    },
    {
      id: 5,
      title: 'Hair Care',
      description: 'Hair restoration & treatment',
      icon: TrendingUp,
      services: ['Hair Spa', 'Treatment', 'Care'],
      price: '₹800 - ₹2000',
      trending: false
    },
    {
      id: 6,
      title: 'Nail Care',
      description: 'Complete nail grooming',
      icon: Crown,
      services: ['Manicure', 'Pedicure', 'Trim'],
      price: '₹400 - ₹1500',
      trending: false
    }
  ];

  const displayServices = activeTab === 'women' ? womenServices : menServices;

  return (
    <div className="bg-[#FDFBF7] dark:bg-neutral-950 py-16 md:py-24 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="inline-block bg-yellow-400 text-black px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-6 animate-in slide-in-from-bottom-2 fade-in duration-700">Complete Solutions</span>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-black italic tracking-tighter mb-6 text-gray-900 dark:text-white animate-in slide-in-from-bottom-4 fade-in duration-700 delay-100">
            Services for <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Everyone</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed animate-in slide-in-from-bottom-6 fade-in duration-700 delay-200">
            Specialized treatments for men and women
          </p>
        </div>

        {/* Tab Switcher - Enhanced */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/10 rounded-full p-2 gap-2 shadow-lg">
            <button
              onClick={() => setActiveTab('women')}
              className={`px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'women'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              👩‍🦰 Women's Services
            </button>
            <button
              onClick={() => setActiveTab('men')}
              className={`px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'men'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-black shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              👨‍🦱 Men's Services
            </button>
          </div>
        </div>

        {/* Services Grid - Enhanced Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {displayServices.map((serviceGroup, idx) => {
            const Icon = serviceGroup.icon;
            return (
              <div
                key={serviceGroup.id}
                onClick={() => onCategoryClick(serviceGroup.services[0])}
                className="group relative overflow-hidden bg-white dark:bg-neutral-900/50 rounded-[2rem] border border-gray-200 dark:border-white/10 p-8 hover:border-yellow-400 dark:hover:border-yellow-400 transition-all duration-500 hover:shadow-2xl cursor-pointer hover:-translate-y-2 animate-in slide-in-from-bottom-8 fade-in duration-700"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Trending Badge */}
                {serviceGroup.trending && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    Trending
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-orange-400 transition-all duration-300">
                    {serviceGroup.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-5">
                    {serviceGroup.description}
                  </p>

                  {/* Services List */}
                  <div className="space-y-2 mb-6 pb-6 border-b border-gray-200 dark:border-neutral-700/50">
                    {serviceGroup.services.map((service, serviceIdx) => (
                      <div key={serviceIdx} className="flex items-center gap-3 group/item">
                        <div className="w-2 h-2 rounded-full bg-yellow-400 group-hover/item:bg-gradient-to-r group-hover/item:from-yellow-400 group-hover/item:to-orange-400"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors duration-300">
                          {service}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 dark:text-white text-lg">
                      {serviceGroup.price}
                    </span>
                    <button className="px-4 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider hover:shadow-lg hover:scale-110 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-orange-400 group-hover:text-black dark:group-hover:text-black">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GenderSpecificServices;
