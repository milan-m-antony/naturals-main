import React, { useEffect, useState } from 'react';
import { Star, Users, Heart, TrendingUp, Award, Zap } from 'lucide-react';

const TrustAndProof: React.FC = () => {
  const [counters, setCounters] = useState({
    customers: 2500,
    services: 150,
    rating: 4.8,
    bookings: 15000
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    {
      icon: Users,
      label: 'Happy Customers',
      value: '2,500+'
    },
    {
      icon: Heart,
      label: 'Bookings This Month',
      value: '15,000+'
    },
    {
      icon: Award,
      label: 'Salon Rating',
      value: '4.8 ⭐'
    },
    {
      icon: TrendingUp,
      label: 'Services Offered',
      value: '150+'
    }
  ];

  const testimonials = [
    {
      name: 'Priya S.',
      role: 'Regular Customer',
      text: 'Best beauty salon experience ever! Professional and affordable.',
      rating: 5,
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'
    },
    {
      name: 'Anjali M.',
      role: 'Bridal Package',
      text: 'Made my wedding day special with perfect bridal makeup!',
      rating: 5,
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali'
    },
    {
      name: 'Deepa K.',
      role: 'Monthly Regular',
      text: 'Love the hair spa treatments. Highly recommend to all!',
      rating: 5,
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deepa'
    }
  ];

  return (
    <div className="bg-white dark:bg-neutral-900 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`bg-white dark:bg-neutral-900 border-2 border-gray-200 dark:border-neutral-700 rounded-2xl p-6 hover:border-yellow-400 dark:hover:border-yellow-400 transform transition-all duration-500 ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
                  {stat.label}
                </p>
                <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Testimonials Section */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 md:p-12 border-2 border-gray-200 dark:border-neutral-700">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Why Customers Love Us
            </h3>
            <p className="text-gray-600 dark:text-gray-400">Join thousands of satisfied customers and experience premium beauty & wellness services</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`bg-gray-50 dark:bg-neutral-800 border-2 border-gray-200 dark:border-neutral-700 rounded-2xl p-6 hover:border-yellow-400 dark:hover:border-yellow-400 transition-all duration-300 transform ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${(index + 4) * 100}ms` }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="flex items-center gap-2 px-6 py-3 bg-yellow-100 dark:bg-yellow-900/20 border-2 border-yellow-400 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-900/30 transition-all">
            <Award className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm font-semibold text-yellow-900 dark:text-yellow-300">Certified & Licensed</span>
          </div>
          <div className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-neutral-800 border-2 border-gray-300 dark:border-neutral-700 rounded-full hover:border-yellow-400 dark:hover:border-yellow-400 transition-all">
            <Zap className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">24/7 Customer Support</span>
          </div>
          <div className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-neutral-800 border-2 border-gray-300 dark:border-neutral-700 rounded-full hover:border-yellow-400 dark:hover:border-yellow-400 transition-all">
            <Heart className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">100% Satisfaction Guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustAndProof;
