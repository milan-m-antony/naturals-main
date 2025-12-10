import React, { useState } from 'react';
import { Heart, Sparkles, Zap, Crown, TrendingUp, Clock } from 'lucide-react';

const GenderSpecificServices: React.FC<{ onCategoryClick: (category: string) => void }> = ({ onCategoryClick }) => {
  const [activeTab, setActiveTab] = useState<'women' | 'men'>('women');

  const womenServices = [
    {
      id: 1,
      title: 'Hair Care',
      description: 'Color treatments, hair spa, smoothening',
      icon: Sparkles,
      services: ['Hair Spa', 'Hair Coloring', 'Smoothening'],
      price: '₹1500 - ₹5000',
      trending: true
    },
    {
      id: 2,
      title: 'Skin Care',
      description: 'Professional facials for every skin type',
      icon: Heart,
      services: ['Facials', 'Treatments', 'Glow'],
      price: '₹800 - ₹3000',
      trending: true
    },
    {
      id: 3,
      title: 'Bridal & Special',
      description: 'Complete packages with hair, makeup & skin',
      icon: Crown,
      services: ['Bridal', 'Pre-Wedding', 'Makeup'],
      price: '₹5000 - ₹15000',
      trending: false
    },
    {
      id: 4,
      title: 'Waxing & Threading',
      description: 'Hair removal & shaping services',
      icon: Zap,
      services: ['Waxing', 'Threading', 'Bleaching'],
      price: '₹300 - ₹2000',
      trending: false
    },
    {
      id: 5,
      title: 'Nail Studio',
      description: 'Nail designs, extensions & pedicures',
      icon: Crown,
      services: ['Manicure', 'Nail Art', 'Pedicure'],
      price: '₹500 - ₹2500',
      trending: false
    },
    {
      id: 6,
      title: 'Packages',
      description: 'Special combo packages and offers',
      icon: TrendingUp,
      services: ['Packages', 'Combos', 'Offers'],
      price: '₹1000 - ₹5000',
      trending: false
    }
  ];

  const menServices = [
    {
      id: 1,
      title: 'Grooming',
      description: 'Professional beard care & styling',
      icon: Crown,
      services: ['Beard Trim', 'Hair Cut', 'Styling'],
      price: '₹300 - ₹1000',
      trending: true
    },
    {
      id: 2,
      title: 'Skin Care',
      description: 'Specialized facials for men',
      icon: Sparkles,
      services: ['Facials', 'Cleanse', 'Anti-Acne'],
      price: '₹800 - ₹2500',
      trending: true
    },
    {
      id: 3,
      title: 'Body Care',
      description: 'Complete grooming for active men',
      icon: Zap,
      services: ['Body Wax', 'Trim', 'Shape'],
      price: '₹500 - ₹1500',
      trending: false
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

  const services = activeTab === 'women' ? womenServices : menServices;

  return (
    <div className="bg-white dark:bg-neutral-950 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Services for Everyone
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Specialized treatments for men and women</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-gray-100 dark:bg-neutral-800 rounded-full p-1 gap-1">
            <button
              onClick={() => setActiveTab('women')}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                activeTab === 'women'
                  ? 'bg-yellow-400 text-black'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Women's Services
            </button>
            <button
              onClick={() => setActiveTab('men')}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                activeTab === 'men'
                  ? 'bg-yellow-400 text-black'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Men's Services
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((serviceGroup) => (
            <div
              key={serviceGroup.id}
              onClick={() => onCategoryClick(serviceGroup.services[0])}
              className="group relative bg-white dark:bg-neutral-900 rounded-lg border-2 border-gray-200 dark:border-neutral-700 hover:border-yellow-400 dark:hover:border-yellow-400 transition-all hover:shadow-lg cursor-pointer overflow-hidden"
            >
              {/* Trending Badge */}
              {serviceGroup.trending && (
                <div className="absolute top-3 right-3 z-20 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  TRENDING
                </div>
              )}

              {/* Content */}
              <div className="p-5">
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 mb-3">
                  {React.createElement(serviceGroup.icon, { className: 'w-5 h-5' })}
                </div>

                {/* Text */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {serviceGroup.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {serviceGroup.description}
                </p>

                {/* Services List */}
                <div className="space-y-1.5 mb-4 pb-4 border-b border-gray-200 dark:border-neutral-700">
                  {serviceGroup.services.map((service, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-yellow-400"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{service}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {serviceGroup.price}
                  </span>
                  <button className="px-3 py-1.5 rounded-lg bg-black dark:bg-white text-white dark:text-black text-xs font-bold hover:opacity-90 transition-opacity">
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenderSpecificServices;
