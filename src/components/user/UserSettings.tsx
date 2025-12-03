
import React, { useState } from 'react';
import { Moon, Sun, BellRing, Mail, Shield, ChevronsRight, LogOut, Smartphone, MessageSquare } from 'lucide-react';

interface UserSettingsProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onLogout: () => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ isDarkMode, toggleTheme, onLogout }) => {
  const [reminders, setReminders] = useState({ whatsapp: true, sms: false });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
        <div className="mb-8 text-center">
            <h2 className="font-display text-4xl font-bold italic text-gray-900 dark:text-white mb-2">Settings</h2>
            <p className="text-gray-500 dark:text-gray-400">Customize your app experience.</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-neutral-800 space-y-8">
            
            {/* Appearance */}
            <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 ml-2">Appearance</h4>
                <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-2xl p-2">
                    <button onClick={toggleTheme} className="w-full flex items-center justify-between p-4 hover:bg-white dark:hover:bg-neutral-800 rounded-xl transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-full dark:bg-purple-900/30 dark:text-purple-400">
                                {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white">Dark Mode</span>
                        </div>
                        <div className={`w-12 h-7 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-black' : 'bg-gray-300'}`}>
                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Notifications & Reminders */}
            <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 ml-2">Notifications & Reminders</h4>
                <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-2xl p-2 space-y-1">
                    <div className="flex items-center justify-between p-4 hover:bg-white dark:hover:bg-neutral-800 rounded-xl transition-all">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
                                <BellRing className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white text-sm">Push Notifications</p>
                                <p className="text-xs text-gray-500">Booking updates & offers</p>
                            </div>
                        </div>
                        <div className="w-12 h-7 rounded-full bg-black p-1">
                            <div className="w-5 h-5 bg-white rounded-full shadow-sm translate-x-5"></div>
                        </div>
                    </div>
                    {/* Automated Reminders */}
                    <div className="flex items-center justify-between p-4 hover:bg-white dark:hover:bg-neutral-800 rounded-xl transition-all cursor-pointer" onClick={() => setReminders(prev => ({...prev, whatsapp: !prev.whatsapp}))}>
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-green-100 text-green-600 rounded-full dark:bg-green-900/30 dark:text-green-400">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white text-sm">WhatsApp Reminders</p>
                                <p className="text-xs text-gray-500">Get reminders 24h before appt.</p>
                            </div>
                        </div>
                        <div className={`w-12 h-7 rounded-full p-1 transition-colors ${reminders.whatsapp ? 'bg-black' : 'bg-gray-300'}`}>
                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${reminders.whatsapp ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 hover:bg-white dark:hover:bg-neutral-800 rounded-xl transition-all cursor-pointer" onClick={() => setReminders(prev => ({...prev, sms: !prev.sms}))}>
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-full dark:bg-orange-900/30 dark:text-orange-400">
                                <Smartphone className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white text-sm">SMS Alerts</p>
                                <p className="text-xs text-gray-500">Simple text reminders</p>
                            </div>
                        </div>
                        <div className={`w-12 h-7 rounded-full p-1 transition-colors ${reminders.sms ? 'bg-black' : 'bg-gray-300'}`}>
                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${reminders.sms ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account */}
            <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 ml-2">Account</h4>
                <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-2xl p-2 space-y-1">
                    <button className="w-full flex items-center justify-between p-4 hover:bg-white dark:hover:bg-neutral-800 rounded-xl transition-all text-left">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-gray-200 text-gray-600 rounded-full dark:bg-neutral-700 dark:text-gray-300">
                                <Shield className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white text-sm">Privacy & Security</span>
                        </div>
                        <ChevronsRight className="w-4 h-4 text-gray-400" />
                    </button>
                    <button onClick={onLogout} className="w-full flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all text-left group">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-red-100 text-red-600 rounded-full dark:bg-red-900/30 dark:text-red-400">
                                <LogOut className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-red-600 dark:text-red-400 text-sm">Log Out</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default UserSettings;
