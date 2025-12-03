import React from 'react';
import { Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onAdminNavigate: () => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, onAdminNavigate }) => {
  return (
    <footer className="bg-[#FDFBF7] dark:bg-neutral-950 text-gray-900 dark:text-gray-400 py-8 md:py-12 border-t border-gray-100 dark:border-white/10 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="https://i.postimg.cc/9MQr6G9k/naturals-logo.jpg" alt="Naturals" className="h-10 w-10 rounded-full object-cover" />
              <span className="font-display text-xl font-bold italic text-gray-900 dark:text-white">Naturals</span>
            </div>
            <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              Elevating beauty through nature, science, and artistry. Experience the difference with our premium salon services.
            </p>
            <div className="flex gap-2">
               <a href="#" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"><Instagram className="w-3.5 h-3.5" /></a>
               <a href="#" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"><Facebook className="w-3.5 h-3.5" /></a>
               <a href="#" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"><Twitter className="w-3.5 h-3.5" /></a>
               <a href="#" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"><Linkedin className="w-3.5 h-3.5" /></a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider mb-3 text-gray-900 dark:text-white">Explore</h4>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <li><button onClick={() => onNavigate('services')} className="hover:text-black dark:hover:text-white transition-colors">Our Services</button></li>
              <li><button onClick={() => onNavigate('discounts')} className="hover:text-black dark:hover:text-white transition-colors">Special Offers</button></li>
              <li><button onClick={() => onNavigate('booking')} className="hover:text-black dark:hover:text-white transition-colors">Book Appointment</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-black dark:hover:text-white transition-colors">Our Location</button></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider mb-3 text-gray-900 dark:text-white">Company</h4>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <li><button onClick={() => onNavigate('about')} className="hover:text-black dark:hover:text-white transition-colors">Our Story</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-black dark:hover:text-white transition-colors">Contact Us</button></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

        </div>

        {/* Newsletter */}
        <div className="mb-8 pb-8 border-b border-gray-100 dark:border-white/10">
          <h4 className="font-bold text-xs uppercase tracking-wider mb-2 text-gray-900 dark:text-white">Stay in the loop</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Subscribe to receive exclusive offers, beauty tips, and style trends.</p>
          <div className="flex gap-2 max-w-md">
            <input 
              type="email" 
              placeholder="Email address" 
              className="flex-1 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-black dark:focus:border-white transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
            />
            <button className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity">
              Join
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
           <p>© 2024 Naturals Salon. All rights reserved.</p>
           <div className="flex flex-wrap justify-center gap-4">
              <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms of Service</a>
              <button onClick={onAdminNavigate} className="hover:text-black dark:hover:text-white transition-colors">Admin Login</button>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;