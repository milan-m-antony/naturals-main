import React, { useState } from 'react';
import { CheckCircle, Leaf, Zap, Shield, Users } from 'lucide-react';

const WhyChooseNaturals: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Leaf,
      title: 'Premium Products',
      description: 'Only organic and eco-friendly products for your skin',
      benefits: ['100% natural', 'Dermatologist tested', 'Chemical-free']
    },
    {
      icon: Zap,
      title: 'Quick Bookings',
      description: 'Same-day appointments with flexible time slots',
      benefits: ['Instant confirmation', 'Real-time slots', 'Easy rescheduling']
    },
    {
      icon: Shield,
      title: 'Hygiene & Safety',
      description: 'Strict protocols and sterilized equipment',
      benefits: ['Hospital-grade cleaning', 'Single-use items', 'ISO certified']
    },
    {
      icon: Users,
      title: 'Personalized Care',
      description: 'Customized treatments based on your needs',
      benefits: ['Skin analysis', 'Custom solutions', '1-on-1 consultation']
    }
  ];

  return (
    <div className="bg-[#FDFBF7] dark:bg-neutral-950 py-16 md:py-24 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="inline-block bg-yellow-400 text-black px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-6 animate-in slide-in-from-bottom-2 fade-in duration-700">Premium Care</span>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-black italic tracking-tighter mb-6 text-gray-900 dark:text-white animate-in slide-in-from-bottom-4 fade-in duration-700 delay-100">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">NATURALS?</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed animate-in slide-in-from-bottom-6 fade-in duration-700 delay-200">
            India's most trusted beauty & wellness destination
          </p>
        </div>

        {/* Features Grid - Enhanced Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden bg-white dark:bg-neutral-900/50 rounded-[2rem] border border-gray-200 dark:border-white/10 p-8 hover:border-yellow-400 dark:hover:border-yellow-400 transition-all duration-500 hover:shadow-2xl hover:scale-105 animate-in slide-in-from-bottom-8 fade-in duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 mb-5 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/20 to-orange-100/20 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-[3rem] -z-10"></div>
          <div className="bg-white dark:bg-neutral-900/50 backdrop-blur-sm rounded-[3rem] border border-gray-200 dark:border-white/10 p-10 md:p-14">
            <div className="mb-12">
              <h3 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 italic">
                What Makes Us <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Special</span>
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Discover our commitment to excellence</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, idx) => (
                <div key={idx} className="space-y-4">
                  {feature.benefits.map((benefit, bidx) => (
                    <div key={bidx} className="flex items-start gap-3 group/item animate-in slide-in-from-left-4 fade-in duration-500" style={{ animationDelay: `${idx * 100 + bidx * 50}ms` }}>
                      <div className="w-6 h-6 rounded-full bg-yellow-400/20 flex items-center justify-center mt-0.5 group-hover/item:bg-yellow-400/40 transition-colors duration-300">
                        <CheckCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors duration-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseNaturals;
