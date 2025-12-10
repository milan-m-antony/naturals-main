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
    <div className="bg-white dark:bg-neutral-950 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Why Choose NATURALS?
          </h2>
          <p className="text-gray-600 dark:text-gray-400">India's most trusted beauty & wellness destination</p>
        </div>

        {/* Features Grid - Simple 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="p-4 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-700 hover:border-yellow-400 dark:hover:border-yellow-400 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Benefits List */}
        <div className="bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-700 p-6">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">What Makes Us Special</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, idx) => (
              <div key={idx} className="space-y-2">
                {feature.benefits.map((benefit, bidx) => (
                  <div key={bidx} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseNaturals;
