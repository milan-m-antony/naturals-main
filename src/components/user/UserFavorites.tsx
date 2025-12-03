
import React from 'react';
import { Heart } from 'lucide-react';

interface UserFavoritesProps {
  services: any[];
  onBookNew: () => void;
}

const UserFavorites: React.FC<UserFavoritesProps> = ({ services, onBookNew }) => {
  // Mock favorites by filtering services
  const favoriteIds = [101, 106, 201]; 
  const favoriteServices = services.filter(s => favoriteIds.includes(s.id));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8">
            <h2 className="font-display text-4xl font-bold italic text-gray-900 dark:text-white mb-2">Favorites</h2>
            <p className="text-gray-500 dark:text-gray-400">Your go-to treatments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteServices.map(service => (
                <div key={service.id} className="group bg-white dark:bg-neutral-900 p-4 rounded-[2rem] border border-gray-100 dark:border-neutral-800 hover:shadow-xl transition-all cursor-pointer">
                    <div className="h-48 rounded-[1.5rem] overflow-hidden mb-4 relative">
                        <img src={service.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                        <button className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md rounded-full text-red-500 hover:bg-white transition-colors">
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
    </div>
  );
};

export default UserFavorites;
