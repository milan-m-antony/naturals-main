
import React, { useRef } from 'react';
import { Camera, Upload, User, Smartphone, Mail, MapPin, Trash2, Plus } from 'lucide-react';

interface UserProfileProps {
  profileData: any;
  setProfileData: React.Dispatch<React.SetStateAction<any>>;
  isEditingProfile: boolean;
  setIsEditingProfile: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveProfile: () => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  profileData, 
  setProfileData, 
  isEditingProfile, 
  setIsEditingProfile, 
  handleSaveProfile, 
  handleImageUpload 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
        <div className="mb-8">
            <h2 className="font-display text-4xl font-bold italic text-gray-900 dark:text-white mb-2">My Profile</h2>
            <p className="text-gray-500 dark:text-gray-400">Manage your personal information.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Avatar */}
            <div className="md:col-span-1">
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2.5rem] border border-gray-100 dark:border-neutral-800 text-center">
                    <div 
                        className="w-32 h-32 mx-auto rounded-full p-1 border-2 border-dashed border-gray-300 dark:border-neutral-700 mb-4 relative group cursor-pointer overflow-hidden"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <img src={profileData.image} className="w-full h-full object-cover rounded-full" alt="Profile" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                            <Camera className="w-6 h-6 text-white" />
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white">{profileData.name}</h3>
                    <p className="text-sm text-gray-500 mb-6">Gold Member</p>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border border-gray-200 dark:border-neutral-700 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 text-gray-900 dark:text-white"
                    >
                        <Upload className="w-3 h-3" /> Change Photo
                    </button>
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="md:col-span-2">
                <div className="bg-white dark:bg-neutral-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-neutral-800">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                            <User className="w-5 h-5 text-gray-400" /> Personal Details
                        </h4>
                        {!isEditingProfile && (
                            <button onClick={() => setIsEditingProfile(true)} className="text-xs font-bold text-blue-600 hover:underline">Edit Profile</button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                            <input 
                                type="text" 
                                value={profileData.name} 
                                readOnly={!isEditingProfile}
                                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                className={`w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-xl p-3 text-sm font-medium text-gray-900 dark:text-white ${isEditingProfile ? 'ring-2 ring-black/10 dark:ring-white/10' : ''}`} 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="tel" 
                                    value={profileData.phone} 
                                    readOnly={!isEditingProfile}
                                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                    className={`w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-xl p-3 pl-10 text-sm font-medium text-gray-900 dark:text-white ${isEditingProfile ? 'ring-2 ring-black/10 dark:ring-white/10' : ''}`} 
                                />
                            </div>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="email" 
                                    value={profileData.email} 
                                    readOnly={!isEditingProfile}
                                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                    className={`w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-xl p-3 pl-10 text-sm font-medium text-gray-900 dark:text-white ${isEditingProfile ? 'ring-2 ring-black/10 dark:ring-white/10' : ''}`} 
                                />
                            </div>
                        </div>
                    </div>

                    <h4 className="font-bold text-lg mb-6 flex items-center gap-2 border-t border-gray-100 dark:border-neutral-800 pt-8 text-gray-900 dark:text-white">
                        <MapPin className="w-5 h-5 text-gray-400" /> Address
                    </h4>
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl border border-gray-200 dark:border-neutral-700 flex items-start gap-4">
                            <div className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-full">
                                <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                    <span className="text-xs font-bold uppercase bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">Home</span>
                                    {isEditingProfile && (
                                        <div className="flex gap-2">
                                            <button className="text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    )}
                                </div>
                                {isEditingProfile ? (
                                    <input 
                                        type="text" 
                                        value={profileData.location} 
                                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                                        className="w-full bg-transparent border-b border-gray-300 dark:border-neutral-600 text-sm text-gray-600 dark:text-gray-400 outline-none pb-1"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{profileData.location}</p>
                                )}
                            </div>
                        </div>
                        {isEditingProfile && (
                            <button className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Add New Address
                            </button>
                        )}
                    </div>

                    {isEditingProfile && (
                        <div className="mt-10 flex justify-end gap-3">
                            <button onClick={() => setIsEditingProfile(false)} className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors dark:text-white">Cancel</button>
                            <button onClick={handleSaveProfile} className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">Save Changes</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default UserProfile;
