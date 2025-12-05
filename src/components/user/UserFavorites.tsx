
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface UserFavoritesProps {
  services: any[];
  onBookNew: () => void;
}

const UserFavorites: React.FC<UserFavoritesProps> = ({ services, onBookNew }) => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('user_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('user_favorites', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const toggleFavorite = (serviceId: number) => {
    setFavoriteIds(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const favoriteServices = services.filter(s => favoriteIds.includes(s.id));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8">
            <h2 className="font-display text-4xl font-bold italic text-gray-900 dark:text-white mb-2">Favorites</h2>
            <p className="text-gray-500 dark:text-gray-400">Your go-to treatments.</p>
        </div>

        {favoriteServices.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto text-gray-300 dark:text-neutral-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No favorites yet</p>
            <button onClick={onBookNew} className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform">
              Browse Services
            </button>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteServices.map(service => (
                <div key={service.id} className="group bg-white dark:bg-neutral-900 p-4 rounded-[2rem] border border-gray-100 dark:border-neutral-800 hover:shadow-xl transition-all cursor-pointer">
                    <div className="h-48 rounded-[1.5rem] overflow-hidden mb-4 relative">
                        <img src={service.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleFavorite(service.id); }}
                          className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md rounded-full text-red-500 hover:bg-white transition-colors"
                        >
                            <Heart className="w-4 h-4 fill-current" />
                        </button>
                    </div>
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-1">{service.name}</h3>
                            <span className="font-bold text-sm">₹{service.price}</span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-4">{service.description}</p>
                        <button 
                            onClick={onBookNew}
                            className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            ))}
        </div>
        )}
    </div>
  );
};

export default UserFavorites;
