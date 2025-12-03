
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Clock, ArrowRight, MessageCircle, Navigation, Globe, Share2, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

interface ContactCardProps {
  title: string;
  subtitle: string;
  details: React.ReactNode;
  image: string;
  tag: string;
  tagColor: string;
  actionLabel: string;
  onAction: () => void;
  icon: React.ElementType;
}

const ContactCard: React.FC<ContactCardProps> = ({ 
  title, subtitle, details, image, tag, tagColor, actionLabel, onAction, icon: Icon 
}) => {
  return (
    <div 
      onClick={onAction}
      className="group relative h-[420px] sm:h-[480px] md:h-[500px] w-full rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] overflow-hidden transition-all duration-[1500ms] hover:shadow-2xl hover:shadow-black/20 dark:hover:shadow-white/5 border border-transparent hover:border-black/5 dark:hover:border-white/10 cursor-pointer"
    >
      {/* Background Image */}
      <img 
        src={image} 
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 opacity-70 transition-opacity duration-[1500ms] group-hover:opacity-80"></div>
      
      {/* Top Tag */}
      <div className="absolute top-3 sm:top-4 md:top-6 left-3 sm:left-4 md:left-6 z-10">
         <span className={`${tagColor} text-white px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1.5 sm:gap-2 w-fit transform transition-transform group-hover:scale-105`}>
           <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {tag}
         </span>
      </div>

      {/* Bottom Content - Floating Glass Card */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-3 sm:left-4 md:left-6 right-3 sm:right-4 md:right-6 z-10">
         <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 sm:p-5 md:p-6 lg:p-8 rounded-[1.5rem] sm:rounded-[1.75rem] md:rounded-[2rem] text-white transition-all duration-[1500ms] group-hover:bg-white/20 group-hover:border-white/30 group-hover:translate-y-0 group-hover:shadow-2xl">
            <div className="mb-4 sm:mb-5 md:mb-6">
               <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="h-0.5 w-6 sm:w-8 rounded-full bg-yellow-400"></div>
                  <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-yellow-400">{subtitle}</span>
               </div>
               <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold italic leading-none">{title}</h3>
            </div>
            
            <div className="text-sm sm:text-base text-gray-200 font-medium mb-4 sm:mb-6 md:mb-8 leading-relaxed opacity-90 border-l-2 border-white/20 pl-3 sm:pl-4">
               {details}
            </div>
            
            <div className="flex items-center justify-between border-t border-white/10 pt-3 sm:pt-4 md:pt-5">
               <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white group-hover:text-yellow-300 transition-colors">{actionLabel}</span>
               <button className="bg-white text-black p-2.5 sm:p-3 md:p-3.5 rounded-full hover:bg-yellow-400 transition-all shadow-lg transform group-hover:rotate-[-45deg] duration-500">
                   <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

const HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=2000",
    tag: "Naturals Kanjirappally",
    title: "Visit Our Shop",
    description: "Experience premium beauty services in a luxurious, relaxing environment designed just for you."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=2000",
    tag: "Ambience",
    title: "Relax & Rejuvenate",
    description: "Step into a sanctuary of peace where modern aesthetics meet traditional comfort."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&q=80&w=2000",
    tag: "Professional Care",
    title: "Expert Stylists",
    description: "Our certified stylists and therapists are dedicated to bringing out your best look."
  }
];

const Contact: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [areCardsVisible, setAreCardsVisible] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);
  
  const cardsSectionRef = useRef<HTMLDivElement>(null);
  const mapSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Cards Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAreCardsVisible(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.2, 
        rootMargin: "0px"
      }
    );

    if (cardsSectionRef.current) {
      observer.observe(cardsSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Map Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsMapVisible(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.25, 
        rootMargin: "0px"
      }
    );

    if (mapSectionRef.current) {
      observer.observe(mapSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleGetDirections = () => {
    const query = encodeURIComponent("Naturals Salon Loyola arcade puthenangadi junction Tambalakkadu road Kanjirappally");
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:+919744488822`, '_self');
  };

  const handleWhatsApp = () => {
    const phoneNumber = "919744488822"; 
    const message = encodeURIComponent("Hi Naturals, I would like to book an appointment.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-neutral-950 transition-colors duration-500 pb-32 md:pb-20">
      
      {/* 1. Curved Hero Section with Auto-Slideshow */}
      <div className="relative h-[60vh] min-h-[480px] sm:min-h-[550px] md:min-h-[600px] w-full flex items-center justify-center overflow-hidden rounded-b-[2rem] sm:rounded-b-[3rem] md:rounded-b-[4rem] lg:rounded-b-[6rem] shadow-2xl bg-black transform translate-z-0">
         {HERO_SLIDES.map((slide, index) => (
            <div 
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
               <img 
                 src={slide.image} 
                 alt={slide.title} 
                 className="absolute inset-0 w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/90"></div>
            </div>
         ))}
         
         <div className="relative z-20 text-center px-4 max-w-5xl mx-auto flex flex-col items-center pb-12 sm:pb-16 md:pb-20">
            {HERO_SLIDES.map((slide, index) => (
                <div 
                  key={slide.id}
                  className={`transition-all duration-1000 absolute w-full left-0 right-0 flex flex-col items-center ${index === currentSlide ? 'opacity-100 translate-y-0 relative' : 'opacity-0 translate-y-12 absolute pointer-events-none'}`}
                >
                    <span className="inline-block py-1.5 sm:py-2 px-4 sm:px-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-4 sm:mb-6 md:mb-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {slide.tag}
                    </span>
                    <h1 className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-black italic text-white mb-4 sm:mb-6 md:mb-8 tracking-tighter drop-shadow-2xl leading-[0.9]">
                       {slide.title}
                    </h1>
                    <p className="text-gray-200 max-w-2xl mx-auto text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed font-light tracking-wide drop-shadow-lg opacity-90 px-4">
                       {slide.description}
                    </p>
                </div>
            ))}
         </div>

         {/* Slide Indicators */}
         <div className="absolute bottom-16 z-30 flex gap-3">
            {HERO_SLIDES.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-500 shadow-sm ${idx === currentSlide ? 'w-12 bg-white' : 'w-3 bg-white/30 hover:bg-white/60'}`}
                />
            ))}
         </div>
      </div>

      {/* 2. Cards Grid - Animated Reveal */}
      <div 
        ref={cardsSectionRef}
        className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 mt-12 sm:mt-16 md:mt-24 relative z-20 mb-16 sm:mb-24 md:mb-32"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          
          {/* Location Card - Slides in from LEFT */}
          <div className={`transition-all duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)] transform ${areCardsVisible ? 'translate-x-0 opacity-100' : '-translate-x-24 opacity-0'}`}>
            <ContactCard 
              title="Loyola Arcade"
              subtitle="Location"
              tag="Kanjirappally"
              tagColor="bg-blue-600"
              image="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
              icon={MapPin}
              details={
                <>
                  Loyola Arcade, Puthenangadi Jn,<br/>
                  Tambalakkadu Road, Kerala 686507
                </>
              }
              actionLabel="Get Directions"
              onAction={handleGetDirections}
            />
          </div>

          {/* Contact Card - Slides in from BOTTOM */}
          <div className={`transition-all duration-[1500ms] delay-200 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${areCardsVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}>
            <ContactCard 
              title="Reservations"
              subtitle="Contact"
              tag="24/7 Support"
              tagColor="bg-purple-600"
              image="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800"
              icon={Phone}
              details={
                <div className="space-y-2">
                  <span className="block text-2xl font-bold">+91 97444 88822</span>
                  <span className="block text-white/70">04828 204422</span>
                </div>
              }
              actionLabel="Call Now"
              onAction={handleCall}
            />
          </div>

          {/* Hours Card - Slides in from RIGHT */}
          <div className={`transition-all duration-[1500ms] delay-400 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${areCardsVisible ? 'translate-x-0 opacity-100' : 'translate-x-24 opacity-0'}`}>
            <ContactCard 
              title="Opening Hours"
              subtitle="Visit Us"
              tag="Open Today"
              tagColor="bg-green-600"
              image="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&q=80&w=800"
              icon={Clock}
              details={
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-yellow-400 mb-1">Mon - Sat</span>
                    <span className="text-xl">09:00 - 20:00</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-yellow-400 mb-1">Sunday</span>
                    <span className="text-xl">10:00 - 19:00</span>
                  </div>
                </div>
              }
              actionLabel="View Schedule"
              onAction={() => {}} 
            />
          </div>

        </div>
      </div>

      {/* 3. Map Section - Full Width Design with Animated Reveal */}
      <div 
         ref={mapSectionRef}
         className={`max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pb-8 md:pb-0 transition-all duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)] transform ${isMapVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-32'}`}
      >
         <div className="relative rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/5 group bg-white dark:bg-neutral-900">
            
            {/* Map Container */}
            <div className="relative h-[450px] sm:h-[550px] md:h-[650px] lg:h-[700px] w-full">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3934.336647976936!2d76.7725963147908!3d9.556774993156824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMzMnMjQuNCJOIDc2wrA0Nic0MC42IkU!5e0!3m2!1sen!2sin!4v1625562145884!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  loading="lazy"
                  title="Naturals Kanjirappally Map"
                  className="w-full h-full grayscale-[0.1] hover:grayscale-0 transition-all duration-700 dark:invert-[0.9] dark:hue-rotate-180"
                ></iframe>
                
                {/* Floating Location Card */}
                <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-auto md:w-[380px] bg-white dark:bg-neutral-900 shadow-2xl p-1 rounded-[1.25rem] sm:rounded-[1.5rem] md:rounded-[2rem] animate-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-white/10 p-4 sm:p-5 md:p-6 rounded-[1.15rem] sm:rounded-[1.4rem] md:rounded-[1.8rem]">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                                <Navigation className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">Naturals Salon</h3>
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Loyola Arcade, Kanjirappally</p>
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-between text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-500 dark:text-gray-400 mb-4 sm:mb-5 md:mb-6 bg-gray-50 dark:bg-neutral-800 p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl gap-1">
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></span> Open Now</span>
                            <span className="hidden sm:inline">•</span>
                            <span>Closes 8 PM</span>
                            <span className="hidden sm:inline">•</span>
                            <span>4.8 ★ (2k+)</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            <button 
                                onClick={handleGetDirections}
                                className="bg-black dark:bg-white text-white dark:text-black py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl font-bold text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider sm:tracking-widest hover:scale-[1.02] transition-transform shadow-lg"
                            >
                                Directions
                            </button>
                            <button 
                                onClick={handleCall}
                                className="bg-gray-100 dark:bg-neutral-800 text-black dark:text-white py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl font-bold text-[9px] sm:text-[10px] md:text-xs uppercase tracking-wider sm:tracking-widest hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                            >
                                Call Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Top Right Floating Actions */}
                <div className="absolute top-3 sm:top-4 md:top-6 right-3 sm:right-4 md:right-6 flex flex-col gap-2 sm:gap-3">
                     <button 
                        onClick={handleWhatsApp}
                        className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-white dark:bg-neutral-900 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform text-[#25D366]"
                        title="Chat on WhatsApp"
                     >
                        <MessageCircle className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 fill-current" />
                     </button>
                </div>
            </div>
            
            {/* Social Connect Footer - Redesigned */}
            <div className="bg-white dark:bg-neutral-900 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 border-t border-gray-100 dark:border-white/5">
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                    {[
                        { id: 'instagram', icon: Instagram, label: 'Instagram', color: 'hover:text-pink-600' },
                        { id: 'facebook', icon: Facebook, label: 'Facebook', color: 'hover:text-blue-600' },
                        { id: 'twitter', icon: Twitter, label: 'Twitter', color: 'hover:text-sky-500' },
                        { id: 'youtube', icon: Youtube, label: 'YouTube', color: 'hover:text-red-600' }
                    ].map((social) => (
                        <a 
                            key={social.id} 
                            href="#" 
                            className={`p-3 sm:p-3.5 md:p-4 rounded-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-600 dark:text-gray-400 hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-lg ${social.color}`}
                            aria-label={social.label}
                        >
                            <social.icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6" />
                        </a>
                    ))}
                </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default Contact;
