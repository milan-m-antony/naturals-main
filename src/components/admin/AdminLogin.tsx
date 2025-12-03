import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AdminUser {
  role: 'owner' | 'admin' | 'staff';
}

interface AdminLoginProps {
  onLogin: (result: { success: boolean; user?: AdminUser }) => void;
}

const ROLES = {
  'owner@naturals.com': { role: 'owner', password: 'password' },
  'admin@naturals.com': { role: 'admin', password: 'password' },
  'staff@naturals.com': { role: 'staff', password: 'password' },
} as const;

type ValidEmail = keyof typeof ROLES;

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const userCredentials = ROLES[email as ValidEmail];
      if (userCredentials && password === userCredentials.password) {
        onLogin({ success: true, user: { role: userCredentials.role } });
      } else {
        setError('Invalid credentials.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-yellow-100 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-100 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>

      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-700">
        
        <div className="h-40 bg-black relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black"></div>
          <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
          <div className="relative z-10 text-center">
            <img src="https://i.postimg.cc/9MQr6G9k/naturals-logo.jpg" alt="Naturals" className="h-16 w-16 rounded-full object-cover mx-auto" />
            <div className="mt-2 inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Admin Portal</p>
            </div>
          </div>
        </div>

        <div className="p-10">
          {error && (
            <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-sm flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative group">
                <Mail className="w-5 h-5 text-gray-400 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-black transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-[1.5rem] py-4 pl-14 pr-4 text-sm font-bold text-gray-900 outline-none focus:border-black focus:bg-white transition-all placeholder:text-gray-400 placeholder:font-normal"
                  placeholder="role@naturals.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <Lock className="w-5 h-5 text-gray-400 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-black transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-[1.5rem] py-4 pl-14 pr-14 text-sm font-bold text-gray-900 outline-none focus:border-black focus:bg-white transition-all placeholder:text-gray-400 placeholder:font-normal"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-black text-white py-4 rounded-[1.5rem] font-bold text-sm tracking-widest uppercase hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-left bg-gray-50 py-3 px-4 rounded-2xl border border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold text-center mb-2">
              Demo Access (password: `password`)
            </p>
            <div className="space-y-1">
              <p className="text-xs text-gray-600 font-mono"><strong>Owner:</strong> owner@naturals.com</p>
              <p className="text-xs text-gray-600 font-mono"><strong>Manager:</strong> admin@naturals.com</p>
              <p className="text-xs text-gray-600 font-mono"><strong>Staff:</strong> staff@naturals.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;