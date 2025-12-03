
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Store, LogOut, Sun, Moon, Bell, Menu, X,
  LayoutDashboard, Calendar, Wallet, Crown, Tag, Heart, User, Settings,
  Loader2
} from 'lucide-react';
import { useData } from '@/store';
import type { Appointment } from '@/types';

// Import new User Components
import UserOverview from '../user/UserOverview';
import UserBookings from '../user/UserBookings';
import UserSpendings from '../user/UserSpendings';
import UserMembershipCards from '../user/UserMembershipCards';
import UserOffers from '../user/UserOffers';
import UserNotifications from '../user/UserNotifications';
import UserFavorites from '../user/UserFavorites';
import UserProfile from '../user/UserProfile';
import UserSettings from '../user/UserSettings';

interface Step0DashboardProps {
    onHome: () => void;
    bookingFilter: 'upcoming' | 'completed' | 'cancelled';
    setBookingFilter: (filter: 'upcoming' | 'completed' | 'cancelled') => void;
    onBookNew: () => void;
    filteredAppointments: Appointment[];
    setSelectedBooking: (apt: Appointment) => void;
    getStatusPill: (status: string) => string;
    userProfile: any;
    onNavigate: (view: string) => void;
    toggleTheme: () => void;
    isDarkMode: boolean;
    onLogout: () => void;
}

const MOCK_NOTIFICATIONS = [
    { id: 1, title: 'Booking Confirmed', message: 'Your booking for Hair Spa is confirmed for tomorrow at 10:00 AM.', time: '2 hours ago', type: 'booking', read: false },
    { id: 2, title: 'Weekend Sale!', message: 'Get flat 20% off on all facials this Saturday. Book now!', time: '1 day ago', type: 'offer', read: false },
    { id: 3, title: 'Welcome Gold Member', message: 'Congratulations! You have been upgraded to Gold tier membership.', time: '3 days ago', type: 'info', read: true },
    { id: 4, title: 'Payment Successful', message: 'Transaction ID #TXN88392 for ₹1,500 was successful.', time: '5 days ago', type: 'info', read: true },
    { id: 5, title: 'Style Tip', message: 'Check out our new blog on summer hair care essentials.', time: '1 week ago', type: 'info', read: true }
];

const Step0_Dashboard: React.FC<Step0DashboardProps> = ({
    onHome,
    bookingFilter,
    setBookingFilter,
    onBookNew,
    filteredAppointments,
    setSelectedBooking,
    userProfile,
    onNavigate,
    toggleTheme,
    isDarkMode,
    onLogout
}) => {
    const { appointments, staff, services, refreshAppointments } = useData();
    const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'spendings' | 'membership' | 'offers' | 'favorites' | 'profile' | 'settings' | 'notifications'>('overview');
    const [navHistory, setNavHistory] = useState<string[]>(['overview']);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    // Toast State
    const [toast, setToast] = useState<{show: boolean, msg: string, type: 'success' | 'loading'} | null>(null);

    // Profile Edit State (Kept in Parent for Header Access)
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({
        name: userProfile?.name || 'Alice Freeman',
        phone: userProfile?.phone || '+91 9876 543 210',
        email: userProfile?.email || 'alice.freeman@example.com',
        location: userProfile?.location || 'Loyola Arcade, Kanjirappally, Kerala',
        image: userProfile?.image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
    });

    // Notifications State (Kept in Parent for Sidebar Badge)
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [notifFilter, setNotifFilter] = useState<'all' | 'unread' | 'offer'>('all');

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const whatsapp = document.getElementById('whatsapp-widget');
        const promo = document.getElementById('promo-widget');
        
        if (whatsapp) whatsapp.style.display = 'none';
        if (promo) promo.style.display = 'none';

        return () => {
            if (whatsapp) whatsapp.style.display = '';
            if (promo) promo.style.display = '';
        };
    }, []);

    // Load latest appointments whenever user profile becomes available/changes
    useEffect(() => {
        if (userProfile) {
            refreshAppointments().catch(() => {});
        }
    }, [userProfile, refreshAppointments]);

    // Sidebar Navigation Items
    const navItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'bookings', label: 'My Bookings', icon: Calendar },
        { id: 'spendings', label: 'Spendings', icon: Wallet },
        { id: 'membership', label: 'Membership', icon: Crown },
        { id: 'offers', label: 'Offers & Rewards', icon: Tag },
        // Notifications removed from sidebar, accessible via bell icon only
        { id: 'favorites', label: 'Favorites', icon: Heart },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    // -- Helpers --
    const showToast = (msg: string, type: 'success' | 'loading' = 'success', duration = 3000) => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast(null), duration);
    };

    const handleNavClick = (id: string) => {
        if (activeTab === id) {
            setSidebarOpen(false);
            return;
        }
        setNavHistory(prev => [...prev, id]);
        setActiveTab(id as any);
        setSidebarOpen(false);
    };

    const handleBack = () => {
        if (navHistory.length > 1) {
            const newHistory = [...navHistory];
            newHistory.pop(); // Remove active tab
            const prevTab = newHistory[newHistory.length - 1];
            setNavHistory(newHistory);
            setActiveTab(prevTab as any);
        }
    };

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        showToast('All notifications marked as read');
    };

    const handleSaveProfile = () => {
        setIsEditingProfile(false);
        showToast('Profile updated successfully!');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            showToast('Uploading image...', 'loading', 1500);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData(prev => ({ ...prev, image: reader.result as string }));
                setTimeout(() => showToast('Profile photo updated!'), 1500);
            };
            reader.readAsDataURL(file);
        }
    };

    // Sidebar Component
    const Sidebar = ({ isMobile = false }: { isMobile?: boolean }) => {
        const collapsed = isMobile ? false : isCollapsed;

        return (
            <div className={`h-full flex flex-col bg-white dark:bg-neutral-900 w-full border-r border-gray-100 dark:border-neutral-800 transition-all duration-300 relative`}>
                
                {/* Logo Section & Toggle */}
                <div className={`flex items-center h-24 shrink-0 transition-all duration-300 ${collapsed ? 'justify-center px-2' : 'justify-between px-6'}`}>
                    
                    <div className="flex items-center gap-3 w-full">
                         {/* Toggle Button - LEFT (Desktop Only) */}
                        {!isMobile && (
                            <button 
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className={`w-10 h-10 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white transition-colors shrink-0`}
                                title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        )}

                        {/* Desktop Branding - Only show if NOT collapsed AND NOT mobile */}
                        {!collapsed && !isMobile && (
                            <div className="flex items-center gap-3 overflow-hidden animate-in fade-in duration-300">
                                <img src="https://i.postimg.cc/9MQr6G9k/naturals-logo.jpg" alt="Naturals" className="h-8 w-8 rounded-full object-cover" />
                                <div className="overflow-hidden whitespace-nowrap">
                                    <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white leading-none tracking-tight">Naturals</h2>
                                </div>
                            </div>
                        )}
                        
                        {/* Mobile Header (Branding + Close) - Only show if Mobile */}
                        {isMobile && (
                             <div className="flex items-center gap-3 w-full justify-between">
                                <div className="flex items-center gap-3">
                                    <img src="https://i.postimg.cc/9MQr6G9k/naturals-logo.jpg" alt="Naturals" className="h-8 w-8 rounded-full object-cover" />
                                    <h2 className="font-display font-bold text-xl text-gray-900 dark:text-white leading-none tracking-tight">Naturals</h2>
                                </div>
                                <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-black dark:hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                             </div>
                        )}
                    </div>
                </div>

                {/* Navigation List */}
                <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar overflow-x-hidden py-4">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                title={collapsed ? item.label : ''}
                                className={`
                                    w-full flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-3.5 rounded-xl transition-all duration-200 group relative
                                    ${isActive ? 'bg-[#FFF8F0] dark:bg-white/10' : 'hover:bg-gray-50 dark:hover:bg-neutral-800'}
                                `}
                            >
                                <div className={`flex items-center gap-4 ${collapsed ? 'justify-center w-full' : ''}`}>
                                    <div className="relative">
                                        <item.icon 
                                            className={`w-5 h-5 transition-colors shrink-0 ${isActive ? 'text-orange-500 dark:text-orange-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} 
                                            strokeWidth={2}
                                        />
                                        {/* Badge removed from sidebar logic for notifications as it's not in the list anymore */}
                                    </div>
                                    {!collapsed && (
                                        <span className={`text-sm font-medium transition-colors whitespace-nowrap ${isActive ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                                            {item.label}
                                        </span>
                                    )}
                                </div>
                                {!collapsed && isActive && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></div>
                                    </div>
                                )}
                                {collapsed && isActive && (
                                    <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-orange-50 shadow-sm"></div>
                                )}
                            </button>
                        )
                    })}
                </nav>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[60] bg-[#FDFBF7] dark:bg-black flex overflow-hidden">
            
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-24 right-6 z-[100] px-6 py-3 rounded-full shadow-2xl animate-in slide-in-from-top-5 fade-in duration-300 font-bold text-sm flex items-center gap-2 ${toast.type === 'loading' ? 'bg-white dark:bg-neutral-800 text-black dark:text-white' : 'bg-black text-white dark:bg-white dark:text-black'}`}>
                    {toast.type === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
                    {toast.msg}
                </div>
            )}

            {/* Sidebar (Desktop) */}
            <aside className={`hidden lg:block shrink-0 h-full shadow-xl z-20 transition-all duration-300 ${isCollapsed ? 'w-[80px]' : 'w-[280px]'}`}>
                <Sidebar />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-[70] lg:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
                    <div className="absolute inset-y-0 left-0 w-[280px] shadow-2xl animate-in slide-in-from-left duration-300">
                        <Sidebar isMobile={true} />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-full relative bg-[#FDFBF7] dark:bg-neutral-950 transition-colors duration-300">
                
                {/* Custom Dashboard Header */}
                <div className="h-16 md:h-20 flex items-center justify-between px-4 md:px-8 border-b border-gray-100 dark:border-white/5 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        {/* Mobile Sidebar Toggle */}
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
                            <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
                        </button>
                        
                        {/* Back Button */}
                        <button 
                            onClick={handleBack}
                            disabled={navHistory.length <= 1}
                            className={`w-10 h-10 rounded-full border border-gray-200 dark:border-neutral-700 flex items-center justify-center transition-colors ${
                                navHistory.length <= 1
                                    ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed opacity-50' 
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800'
                            }`} 
                            title="Back"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>

                        {/* Salon Front Page Button - Home */}
                        <button 
                            onClick={onHome} 
                            className="w-10 h-10 rounded-full border border-gray-200 dark:border-neutral-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors" 
                            title="Go to Salon Home"
                        >
                            <Store className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        {/* Logout/Exit */}
                        <button onClick={onLogout} className="w-10 h-10 rounded-full border border-gray-200 dark:border-neutral-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors" title="Logout">
                            <LogOut className="w-5 h-5" />
                        </button>

                        {/* Theme Toggle */}
                        <button onClick={toggleTheme} className="w-10 h-10 rounded-full border border-gray-200 dark:border-neutral-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {/* Bell */}
                        <button 
                            onClick={() => handleNavClick('notifications')}
                            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors relative ${activeTab === 'notifications' ? 'bg-black text-white dark:bg-white dark:text-black border-transparent' : 'border-gray-200 dark:border-neutral-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800'}`}
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-neutral-900"></span>
                            )}
                        </button>
                        
                        {/* Profile Pic */}
                        <div 
                            onClick={() => handleNavClick('profile')}
                            className="hidden md:block w-10 h-10 rounded-full bg-gray-200 overflow-hidden ml-2 border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                        >
                             <img src={profileData.image} className="w-full h-full object-cover" alt="" />
                        </div>
                    </div>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
                    <div className="max-w-6xl mx-auto pb-20">
                        {activeTab === 'overview' && (
                            <UserOverview 
                                profileData={profileData}
                                appointments={appointments}
                                staff={staff}
                                onBookNew={onBookNew}
                                setSelectedBooking={setSelectedBooking}
                                onNavigate={onNavigate}
                                setActiveTab={(tab) => handleNavClick(tab)}
                            />
                        )}
                        {activeTab === 'bookings' && (
                            <UserBookings 
                                appointments={appointments}
                                services={services}
                                staff={staff}
                                setSelectedBooking={setSelectedBooking}
                                showToast={showToast}
                            />
                        )}
                        {activeTab === 'spendings' && (
                            <UserSpendings 
                                appointments={appointments}
                                showToast={showToast}
                            />
                        )}
                        {activeTab === 'membership' && (
                            <UserMembershipCards />
                        )}
                        {activeTab === 'offers' && (
                            <UserOffers 
                                showToast={showToast}
                            />
                        )}
                        {activeTab === 'notifications' && (
                            <UserNotifications 
                                notifications={notifications}
                                setNotifications={setNotifications}
                                notifFilter={notifFilter}
                                setNotifFilter={setNotifFilter}
                                handleMarkAllRead={handleMarkAllRead}
                                onClose={handleBack}
                            />
                        )}
                        {activeTab === 'favorites' && (
                            <UserFavorites 
                                services={services}
                                onBookNew={onBookNew}
                            />
                        )}
                        {activeTab === 'profile' && (
                            <UserProfile 
                                profileData={profileData}
                                setProfileData={setProfileData}
                                isEditingProfile={isEditingProfile}
                                setIsEditingProfile={setIsEditingProfile}
                                handleSaveProfile={handleSaveProfile}
                                handleImageUpload={handleImageUpload}
                            />
                        )}
                        {activeTab === 'settings' && (
                            <UserSettings 
                                isDarkMode={isDarkMode}
                                toggleTheme={toggleTheme}
                                onLogout={onLogout}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Step0_Dashboard;
