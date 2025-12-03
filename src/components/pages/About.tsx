
import React from 'react';
import { TrendingUp, Users, Sparkles, Globe, ArrowRight, Award, Star, Check } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-500 bg-[#FDFBF7] dark:bg-neutral-950 transition-colors duration-500">
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block font-bold text-xs tracking-[0.3em] uppercase mb-6 animate-in slide-in-from-bottom-4 duration-700 bg-yellow-400 text-black px-4 py-1.5 rounded-full">Our Story</span>
          <h1 className="font-display text-5xl sm:text-6xl md:text-8xl font-black italic tracking-tighter mb-8 leading-[0.9] text-gray-900 dark:text-white">
            Redefining <br /> Beauty in <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">India.</span>
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed px-4">
            Conceived with the idea of the modern Indian, Naturals has pioneered a new era in the hair and beauty care industry.
          </p>
        </div>
        
        {/* Abstract Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-100/30 dark:bg-orange-900/10 rounded-full blur-[100px] -z-0"></div>
      </div>

      {/* Founders Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
           
           {/* Images */}
           <div className="relative">
              <div className="relative z-10 grid grid-cols-2 gap-4">
                 <div className="space-y-4 mt-12">
                    <div className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-xl">
                       <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600" alt="K. Veena" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="text-center">
                       <h3 className="font-display text-xl font-bold italic text-gray-900 dark:text-white">K. Veena</h3>
                       <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Founder</p>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-xl">
                       <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600" alt="CK Kumaravel" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="text-center">
                       <h3 className="font-display text-xl font-bold italic text-gray-900 dark:text-white">CK Kumaravel</h3>
                       <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Co-founder & CEO</p>
                    </div>
                 </div>
              </div>
              {/* Decorative shapes */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-gray-200 dark:border-white/10 rounded-full opacity-50 -z-0"></div>
           </div>

           {/* Text */}
           <div className="space-y-8">
              <h2 className="font-display text-4xl font-bold italic text-gray-900 dark:text-white">The Beginning</h2>
              <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                 <p>
                   Founded by <strong>K. Veena</strong>, whose knowledge of the international beauty industry pioneered a new era in India, Naturals made a path-breaking change in how the beauty industry was perceived.
                 </p>
                 <p>
                   In the early 2000s, she made that dream a reality by setting up her first salon in Chennai. It took only a short while to understand the market potential and the ever-increasing demand for professional grooming.
                 </p>
                 <p>
                   In 2004, her husband <strong>CK Kumaravel</strong> joined as co-founder & CEO. Ever since, the Naturals team has met every challenge in this competitive industry, becoming India's most prominent chain of hair and beauty salons.
                 </p>
              </div>
              
              <div className="flex gap-8 pt-4 border-t border-gray-100 dark:border-white/10">
                 <div>
                    <span className="block text-3xl font-bold text-gray-900 dark:text-white">750+</span>
                    <span className="text-xs uppercase tracking-widest text-gray-500">Salons Today</span>
                 </div>
                 <div>
                    <span className="block text-3xl font-bold text-gray-900 dark:text-white">30L+</span>
                    <span className="text-xs uppercase tracking-widest text-gray-500">Happy Customers</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Vision 2029 Section */}
      <div className="bg-black text-white py-24 md:py-32 relative overflow-hidden">
         
         {/* Background Effects */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/30 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/30 rounded-full blur-[120px]"></div>

         <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
               <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-6">The Future</span>
               <h2 className="font-display text-5xl md:text-7xl font-black italic tracking-tighter mb-6">
                 Naturals 3.0 <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Vision 2029</span>
               </h2>
               <p className="text-gray-400 text-lg leading-relaxed">
                 We aim to revolutionize the beauty industry by seamlessly integrating cutting-edge technology and empowering women entrepreneurs.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* Card 1 */}
               <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all group">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Globe className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">3000 Salons</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    We plan to expand our presence by opening 3000 new outlets by the end of 2029 through a scalable business model and strategic locations.
                  </p>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full w-1/4 bg-purple-500 rounded-full"></div>
                  </div>
               </div>

               {/* Card 2 */}
               <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl">KEY GOAL</div>
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Users className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">1000+ Women</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    Empowering over 1000 women to become successful beauty entrepreneurs through comprehensive training, mentorship, and support.
                  </p>
                  <div className="flex -space-x-2 mb-2">
                     {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-gray-800 overflow-hidden">
                           <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="" className="w-full h-full object-cover" />
                        </div>
                     ))}
                  </div>
               </div>

               {/* Card 3 */}
               <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all group">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">AI Integration</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    Leveraging AI for personalized beauty solutions, virtual consultations, and streamlining operations to set a new standard in beauty innovation.
                  </p>
                  <button className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all text-cyan-400">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* Values / Legacy */}
      <div className="py-24 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
         <div className="bg-white dark:bg-neutral-900 rounded-[3rem] p-12 md:p-20 shadow-xl text-center relative overflow-hidden border border-gray-100 dark:border-white/5">
            <Award className="w-20 h-20 text-yellow-400 mx-auto mb-8 opacity-20" />
            <h2 className="font-display text-3xl md:text-5xl font-bold italic mb-6 text-gray-900 dark:text-white">A Legacy of Excellence</h2>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-10">
              "Naturals isn't just a salon; it's a movement. A movement that believes in the power of transformation, not just for our customers, but for the thousands of women we empower."
            </p>
            <div className="font-display text-xl font-bold text-gray-900 dark:text-white">- The Founders</div>
         </div>
      </div>

    </div>
  );
};

export default About;
