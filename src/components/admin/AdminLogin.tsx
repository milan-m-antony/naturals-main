import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/api';

interface AdminUser {
  role: 'owner' | 'manager' | 'staff';
  id?: number;
  name?: string;
  email?: string;
}

interface AdminLoginProps {
  onLogin: (result: { success: boolean; user?: AdminUser }) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });
      
      // Check if user has owner/manager/staff role (backend uses 'admin', we map to 'manager')
      const userRole = (response.user.role === 'admin' ? 'manager' : response.user.role) as 'owner' | 'manager' | 'staff';
      if (!['owner', 'manager', 'staff'].includes(userRole)) {
        setError('You do not have permission to access this portal. Only Owner, Manager, and Staff can login.');
        setIsLoading(false);
        return;
      }
      
      onLogin({
        success: true,
        user: {
          role: userRole,
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
        },
      });
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid credentials.');
      setIsLoading(false);
    }
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
            <img src="/naturals-logo.svg" alt="Naturals" className="h-16 w-16 rounded-full object-cover mx-auto" />
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
              Demo Access
            </p>
            <div className="space-y-1 mb-2">
              <p className="text-xs text-gray-600 font-mono"><strong>Owner:</strong> owner@naturals.in / password</p>
              <p className="text-xs text-gray-600 font-mono"><strong>Manager:</strong> admin@naturals.in / password</p>
              <p className="text-xs text-gray-600 font-mono"><strong>Receptionist:</strong> receptionist@naturals.in / password</p>
              <p className="text-xs text-gray-600 font-mono"><strong>Staff:</strong> priya@naturals.in / password</p>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              <strong>Note:</strong> New staff created by admin use first 6 digits of phone as password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;