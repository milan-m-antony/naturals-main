import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Sun, Moon, Bell, Menu, X, ChevronRight, ChevronDown, User } from 'lucide-react';

interface SubMenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  submenu?: SubMenuItem[];
}

interface DashboardLayoutProps {
  user: { role: string } | null;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  sidebarNavItems: NavItem[];
  activeModule: string;
  setActiveModule: (module: string) => void;
  pageTitle: string;
  children: React.ReactNode;
}

// Mock Notifications
const DASHBOARD_NOTIFICATIONS = [
  { id: 1, title: 'New Leave Request', msg: 'Sarah requested leave for tomorrow', time: '10m ago', type: 'alert' },
  { id: 2, title: 'Stock Alert', msg: 'L\'Oreal Shampoo is low on stock', time: '1h ago', type: 'warning' },
  { id: 3, title: 'System Update', msg: 'Maintenance scheduled for Sunday', time: '1d ago', type: 'info' },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  onLogout,
  isDarkMode,
  toggleTheme,
  sidebarNavItems,
  activeModule,
  setActiveModule,
  pageTitle,
  children
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  
  // Close dropdowns when clicking outside
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`h-screen w-full flex overflow-hidden font-sans transition-colors duration-500 ${isDarkMode ? 'dark bg-neutral-950 text-white' : 'bg-[#F4F5F7] text-gray-900'}`}>
      
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-200"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-[70]
        w-[280px] h-full max-h-screen
        bg-white dark:bg-neutral-900
        border-r border-gray-200 dark:border-neutral-800
        flex flex-col
        shadow-2xl lg:shadow-none
        transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header - Fixed */}
        <div className="h-20 flex items-center justify-between px-8 border-b border-gray-100 dark:border-neutral-800 shrink-0">
           <img src="/naturals-logo.svg" alt="Naturals" className="h-9 w-9 rounded-full object-cover" />
           <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 text-gray-500 hover:text-black dark:hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {/* Nav Items - Scrollable */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
           <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Menu</p>
           {sidebarNavItems.map((item) => (
             <div key={item.id}>
               <button
                 onClick={() => {
                   if (item.submenu) {
                     setExpandedMenus(prev => 
                       prev.includes(item.id) 
                         ? prev.filter(id => id !== item.id)
                         : [...prev, item.id]
                     );
                   } else {
                     setActiveModule(item.id);
                     setIsSidebarOpen(false);
                   }
                 }}
                 className={`
                   w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 group
                   ${!item.submenu && activeModule === item.id 
                     ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg' 
                     : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white'}
                 `}
               >
                 <div className="flex items-center gap-3">
                   <item.icon className={`w-5 h-5 ${!item.submenu && activeModule === item.id ? 'text-yellow-400 dark:text-black' : 'text-gray-400 group-hover:text-black dark:group-hover:text-white'}`} />
                   <span>{item.label}</span>
                 </div>
                 {item.submenu ? (
                   <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedMenus.includes(item.id) ? 'rotate-180' : ''}`} />
                 ) : (
                   activeModule === item.id && <ChevronRight className="w-4 h-4 opacity-50" />
                 )}
               </button>
               
               {/* Submenu Items */}
               {item.submenu && expandedMenus.includes(item.id) && (
                 <div className="ml-4 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                   {item.submenu.map((subitem) => (
                     <button
                       key={subitem.id}
                       onClick={() => { setActiveModule(subitem.id); setIsSidebarOpen(false); }}
                       className={`
                         w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 group
                         ${activeModule === subitem.id 
                           ? 'bg-black/90 dark:bg-white/90 text-white dark:text-black shadow-md' 
                           : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white'}
                       `}
                     >
                       <subitem.icon className={`w-4 h-4 ${activeModule === subitem.id ? 'text-yellow-400 dark:text-black' : 'text-gray-400 group-hover:text-black dark:group-hover:text-white'}`} />
                       <span>{subitem.label}</span>
                     </button>
                   ))}
                 </div>
               )}
             </div>
           ))}
        </div>

        {/* Footer / Logout - Fixed */}
        <div className="p-4 border-t border-gray-100 dark:border-neutral-800 shrink-0 bg-gray-50/50 dark:bg-neutral-900/50 space-y-2">
           <button 
             onClick={onLogout}
             className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
           >
             <LogOut className="w-5 h-5" /> Logout
           </button>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        
        {/* Top Header */}
        <header className="h-20 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shrink-0">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-600 dark:text-white transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{pageTitle}</h2>
           </div>

           <div className="flex items-center gap-2 md:gap-4">
              {/* Desktop Theme Toggle - Ensured Visibility */}
              <button 
                onClick={toggleTheme} 
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500 dark:text-gray-400 transition-colors border border-gray-200 dark:border-neutral-800"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {/* Notification Dropdown */}
              <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className={`p-2.5 rounded-full transition-colors relative ${isNotifOpen ? 'bg-gray-100 dark:bg-neutral-800 text-black dark:text-white' : 'hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500 dark:text-gray-400'}`}
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-neutral-900"></span>
                </button>

                {isNotifOpen && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800 overflow-hidden animate-in fade-in zoom-in-95 z-50">
                    <div className="p-4 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center">
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white">Notifications</h3>
                      <span className="text-[10px] bg-black dark:bg-white text-white dark:text-black px-2 py-0.5 rounded-full font-bold">3 New</span>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {DASHBOARD_NOTIFICATIONS.map(n => (
                        <div key={n.id} className="p-4 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors border-b border-gray-50 dark:border-neutral-800/50 last:border-0 cursor-pointer">
                           <div className="flex justify-between items-start mb-1">
                              <h4 className="text-xs font-bold text-gray-900 dark:text-white">{n.title}</h4>
                              <span className="text-[9px] text-gray-400">{n.time}</span>
                           </div>
                           <p className="text-xs text-gray-500 dark:text-gray-400">{n.msg}</p>
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-3 text-xs font-bold text-center text-gray-500 hover:text-black dark:hover:text-white bg-gray-50 dark:bg-neutral-800/50">View All Activity</button>
                  </div>
                )}
              </div>

              <div className="h-8 w-px bg-gray-200 dark:bg-neutral-800 mx-1 hidden md:block"></div>
              
              {/* Profile Dropdown */}
              <div className="relative pl-2" ref={profileRef}>
                 <button 
                   onClick={() => setIsProfileOpen(!isProfileOpen)}
                   className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                 >
                    <div className="text-right hidden md:block">
                        <p className="text-xs font-bold text-gray-900 dark:text-white capitalize">{user?.role === 'admin' ? 'Manager' : (user?.role || 'User')}</p>
                        <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Logged In</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-800 overflow-hidden border-2 border-white dark:border-neutral-700 shadow-sm">
                        <img src={`https://i.pravatar.cc/100?u=${user?.role}`} alt="" className="w-full h-full object-cover" />
                    </div>
                 </button>

                 {isProfileOpen && (
                   <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800 overflow-hidden animate-in fade-in zoom-in-95 z-50 p-1">
                      <button onClick={() => { setActiveModule('settings'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold hover:bg-gray-50 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-200 transition-colors">
                         <User className="w-4 h-4" /> My Profile
                      </button>
                      <div className="h-px bg-gray-100 dark:bg-neutral-800 my-1"></div>
                      <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors">
                         <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                   </div>
                 )}
              </div>
           </div>
        </header>

        {/* Scrollable Main */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar bg-[#F4F5F7] dark:bg-neutral-950">
           <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
             {children}
           </div>
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;