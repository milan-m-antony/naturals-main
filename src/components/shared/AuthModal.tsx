import React, { useState } from 'react';
import { X, ArrowRight, Loader2 } from 'lucide-react';
import { authService } from '@/services/api';

// Google Logo SVG Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await authService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        });
      } else {
        await authService.login({
          email: formData.email,
          password: formData.password
        });
      }
      onLoginSuccess();
      onClose();
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      if (status === 401) {
        setError(data?.error || data?.message || 'Invalid email or password.');
      } else if (status === 422 && data?.errors) {
        const messages = Object.values<any>(data.errors).flat().join(' ');
        setError(messages || 'Please check the form fields.');
      } else {
        setError(data?.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-neutral-900 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors backdrop-blur-md"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Image with Gradient Fade */}
        <div className="h-36 relative w-full shrink-0">
           <img 
             src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800" 
             alt="Spa Treatment" 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent dark:from-neutral-900 dark:via-neutral-900/20"></div>
        </div>

        {/* Content Container */}
        <div className="px-8 pb-8 relative -mt-10 overflow-y-auto custom-scrollbar">
          
          {/* Floating Toggle Pill */}
          <div className="flex justify-center mb-5">
            <div className="bg-white dark:bg-neutral-800 p-1 rounded-full shadow-lg flex relative z-10">
              <button 
                onClick={() => setIsSignUp(false)}
                className={`
                  px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all 
                  ${!isSignUp 
                    ? 'bg-black text-white' 
                    : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'}
                `}
              >
                Sign In
              </button>
              <button 
                onClick={() => setIsSignUp(true)}
                className={`
                  px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all 
                  ${isSignUp 
                    ? 'bg-black text-white' 
                    : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'}
                `}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Title Section */}
          <div className="text-center mb-6">
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {isSignUp ? 'Join Naturals' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isSignUp ? 'Create an account to start booking' : 'Enter your details to sign in'}
            </p>
            {error && (
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            
            {isSignUp && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-black dark:focus:border-white transition-all dark:text-white placeholder:text-gray-400"
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-black dark:focus:border-white transition-all dark:text-white placeholder:text-gray-400"
                />
              </div>
            )}

            <input 
              type="email" 
              placeholder="Email Address" 
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-black dark:focus:border-white transition-all dark:text-white placeholder:text-gray-400"
            />

            <input 
              type="password" 
              placeholder="Password" 
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-black dark:focus:border-white transition-all dark:text-white placeholder:text-gray-400"
            />

            {!isSignUp && (
              <div className="flex justify-end">
                <button type="button" className="text-[10px] font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                  Forgot Password?
                </button>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white dark:bg-white dark:text-black py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isSignUp ? 'Create Account' : 'Sign In')}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-white/10"></div></div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
              <span className="bg-white dark:bg-neutral-900 px-4 text-gray-400">Or continue with</span>
            </div>
          </div>

          <button 
            onClick={() => { setIsLoading(true); setTimeout(() => { setIsLoading(false); onLoginSuccess(); }, 1500); }}
            className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-white/10 transition-all text-gray-700 dark:text-white"
          >
            <GoogleIcon />
            Google
          </button>

        </div>
      </div>
    </div>
  );
};

export default AuthModal;