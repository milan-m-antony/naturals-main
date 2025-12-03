
import React from 'react';
import { Bell, Calendar, Tag, Info, X } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: string;
  read: boolean;
}

interface UserNotificationsProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  notifFilter: 'all' | 'unread' | 'offer';
  setNotifFilter: (filter: 'all' | 'unread' | 'offer') => void;
  handleMarkAllRead: () => void;
  onClose: () => void;
}

const UserNotifications: React.FC<UserNotificationsProps> = ({ 
  notifications, 
  setNotifications, 
  notifFilter, 
  setNotifFilter, 
  handleMarkAllRead,
  onClose
}) => {
  const filteredNotifs = notifications.filter(n => {
    if (notifFilter === 'unread') return !n.read;
    if (notifFilter === 'offer') return n.type === 'offer';
    return true;
  });

  const getNotifIcon = (type: string) => {
    switch (type) {
        case 'booking': return <Calendar className="w-4 h-4 text-white" />;
        case 'offer': return <Tag className="w-4 h-4 text-black" />;
        default: return <Info className="w-4 h-4 text-white" />;
    }
  };

  const getNotifBg = (type: string) => {
    switch (type) {
        case 'booking': return 'bg-neutral-900 dark:bg-white dark:text-black';
        case 'offer': return 'bg-yellow-400';
        default: return 'bg-blue-500';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
        <div className="flex justify-between items-start mb-8">
            <div>
                <h2 className="font-display text-4xl font-bold italic text-gray-900 dark:text-white mb-2">Notifications</h2>
                <p className="text-gray-500 dark:text-gray-400">Stay updated on your bookings.</p>
            </div>
            <div className="flex flex-col items-end gap-2">
                <button 
                    onClick={onClose} 
                    className="md:hidden p-2 bg-gray-100 dark:bg-neutral-800 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                    title="Close"
                >
                    <X className="w-5 h-5" />
                </button>
                {notifications.some(n => !n.read) && (
                    <button onClick={handleMarkAllRead} className="text-xs font-bold text-blue-600 hover:underline">Mark all as read</button>
                )}
            </div>
        </div>

        <div className="mb-6 flex gap-2">
            {['all', 'unread', 'offer'].map((f) => (
                <button
                    key={f}
                    onClick={() => setNotifFilter(f as any)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${notifFilter === f ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400'}`}
                >
                    {f}
                </button>
            ))}
        </div>

        <div className="space-y-4">
            {filteredNotifs.length === 0 ? (
                <div className="text-center py-20 text-gray-400 bg-white dark:bg-neutral-900 rounded-[2rem] border border-dashed border-gray-200 dark:border-neutral-800">
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No notifications found.</p>
                </div>
            ) : (
                filteredNotifs.map(notif => (
                    <div key={notif.id} className={`p-5 rounded-2xl border transition-all ${notif.read ? 'bg-white dark:bg-neutral-900 border-gray-100 dark:border-neutral-800' : 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30'}`}>
                        <div className="flex gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getNotifBg(notif.type)}`}>
                                {getNotifIcon(notif.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`font-bold text-sm ${notif.read ? 'text-gray-900 dark:text-white' : 'text-blue-900 dark:text-blue-100'}`}>{notif.title}</h4>
                                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{notif.time}</span>
                                </div>
                                <p className={`text-sm leading-relaxed ${notif.read ? 'text-gray-500 dark:text-gray-400' : 'text-blue-800 dark:text-blue-200'}`}>{notif.message}</p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
};

export default UserNotifications;
