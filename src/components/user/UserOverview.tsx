
import React from 'react';
import { LayoutDashboard, Calendar, Wallet, Crown, Tag, Plus, ArrowRight, Info, Phone, Navigation, HelpCircle } from 'lucide-react';
import type { Appointment } from '@/types';
import AppointmentCountdown from '../booking/AppointmentCountdown';

interface UserOverviewProps {
  profileData: any;
  appointments: Appointment[];
  staff: any[];
  onBookNew: () => void;
  setSelectedBooking: (apt: Appointment) => void;
  onNavigate: (view: string) => void;
  setActiveTab: (tab: string) => void;
}

const UserOverview: React.FC<UserOverviewProps> = ({ 
  profileData, 
  appointments, 
  staff, 
  onBookNew, 
  setSelectedBooking, 
  onNavigate,
  setActiveTab
}) => {
  const upcoming = appointments
    .filter(a => (a.status === 'Scheduled' || a.status === 'In Progress') && new Date(a.date) >= new Date(new Date().setHours(0,0,0,0)))
    .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime())[0];

  const getStaffName = (id: number) => staff.find(s => s.id === id)?.name || 'Sarah Jenkins';

  const handleCallSalon = () => {
    window.location.href = 'tel:+919744488822';
  };

  const handleDirections = () => {
    window.open('https://www.google.com/maps/search/?api=1&query=Naturals+Salon+Loyola+Arcade+Kanjirappally', '_blank');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      {/* Welcome Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-display text-4xl font-bold italic text-gray-900 dark:text-white mb-2">
            Hello, {profileData.name.split(' ')[0]}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">Welcome back to your beauty space.</p>
        </div>
        <button 
          onClick={onBookNew}
          className="hidden md:flex bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-lg items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Booking
        </button>
      </div>

      {/* Upcoming Appointment Card */}
      {upcoming ? (
        <div className="group relative w-full rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:shadow-3xl">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=1200" 
              alt="Salon Ambience" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
          </div>
          
          <div className="relative p-6 md:p-8 flex flex-col justify-between z-10 min-h-[340px] md:min-h-[300px]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-4">
                  {upcoming.status === 'In Progress' ? (
                    <span className="flex w-fit items-center gap-1.5 bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full"></div> Live Now
                    </span>
                  ) : (
                    <span className="w-fit bg-white/20 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                      Upcoming
                    </span>
                  )}
                  <AppointmentCountdown date={upcoming.date} time={upcoming.time} theme="light" />
                </div>
                
                <h3 className="font-display text-3xl md:text-5xl font-black italic text-white mb-2 leading-tight max-w-md">
                  {upcoming.service}
                </h3>
                <p className="text-gray-300 text-sm flex items-center gap-2 mb-4">
                  With <span className="text-white font-bold border-b border-white/30 pb-0.5">{getStaffName(upcoming.staffId)}</span>
                </p>

                <div className="flex items-center gap-2 bg-yellow-400/20 backdrop-blur-sm border border-yellow-400/30 px-3 py-1.5 rounded-lg w-fit">
                  <Info className="w-3.5 h-3.5 text-yellow-300" />
                  <span className="text-[10px] font-bold text-yellow-100 tracking-wide">Please arrive 10 minutes early</span>
                </div>
              </div>
              
              <div className="hidden md:block bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center min-w-[90px]">
                <span className="block text-xs font-bold text-white/70 uppercase mb-1">{new Date(upcoming.date).toLocaleString('default', { month: 'short' })}</span>
                <span className="block text-3xl font-black text-white leading-none mb-1">{new Date(upcoming.date).getDate()}</span>
                <span className="block text-[10px] font-bold text-white/50">{upcoming.time}</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3 mt-auto">
              <button onClick={() => setSelectedBooking(upcoming)} className="w-full md:w-auto bg-white text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-yellow-400 transition-colors shadow-lg flex items-center justify-center gap-2">
                Manage Booking <ArrowRight className="w-4 h-4" />
              </button>
              
              <div className="flex w-full md:w-auto gap-2 justify-between md:justify-start">
                 <button onClick={handleCallSalon} className="flex-1 md:flex-none h-11 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 group/btn shadow-lg" title="Call Salon">
                  <Phone className="w-4 h-4 group-hover/btn:scale-110 transition-transform" /> 
                  <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Call</span>
                 </button>
                 <button onClick={handleDirections} className="flex-1 md:flex-none h-11 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 group/btn shadow-lg" title="Get Directions">
                  <Navigation className="w-4 h-4 group-hover/btn:scale-110 transition-transform" /> 
                  <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Map</span>
                 </button>
                 <button onClick={() => onNavigate('contact')} className="flex-1 md:flex-none h-11 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 group/btn shadow-lg" title="Support">
                  <HelpCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" /> 
                  <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Help</span>
                 </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-900 to-black text-white p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl text-center py-16">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          <div className="relative z-10 max-w-md mx-auto">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-6" />
            <h3 className="font-display text-3xl font-bold italic mb-2">No Upcoming Visits</h3>
            <p className="text-gray-400 mb-8">Ready for your next glow up? Book a service now.</p>
            <button 
              onClick={onBookNew}
              className="bg-white text-black px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-yellow-400 transition-colors shadow-lg inline-flex items-center gap-2"
            >
              Book Appointment <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveTab('bookings')}
          className="bg-white dark:bg-neutral-800 p-5 rounded-[2rem] border border-gray-100 dark:border-neutral-700 hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{appointments.filter(a => a.status === 'Completed').length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Visits</p>
        </div>
        
        <div 
          onClick={() => setActiveTab('spendings')}
          className="bg-white dark:bg-neutral-800 p-5 rounded-[2rem] border border-gray-100 dark:border-neutral-700 hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Wallet className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{appointments.reduce((sum, a) => a.status === 'Completed' ? sum + a.price : sum, 0).toLocaleString()}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Spent</p>
        </div>

        <div 
          onClick={() => setActiveTab('membership')}
          className="bg-white dark:bg-neutral-800 p-5 rounded-[2rem] border border-gray-100 dark:border-neutral-700 hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Crown className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">Gold</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Membership</p>
        </div>

        <div 
          onClick={() => setActiveTab('offers')}
          className="bg-white dark:bg-neutral-800 p-5 rounded-[2rem] border border-gray-100 dark:border-neutral-700 hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Tag className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">4</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Active Offers</p>
        </div>
      </div>
    </div>
  );
};

export default UserOverview;
