import { useState, useCallback, useEffect } from 'react';
import { authService } from '@/services/api';
import type { UserProfile, AdminUser, User } from '@/types';

export const useAuth = () => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Check authentication on mount - only set user auth for customers, not admin/staff
  useEffect(() => {
    const token = authService.getToken();
    const user = authService.getCurrentUser();
    if (token && user && user.role === 'customer') {
      setIsUserAuthenticated(true);
      setUserProfile(user);
    }
  }, []);

  const handleLoginSuccess = useCallback(() => {
    const user = authService.getCurrentUser();
    if (user && user.role === 'customer') {
      setIsUserAuthenticated(true);
      setUserProfile(user);
    }
    setIsAuthModalOpen(false);
  }, []);

  const handleUserLogout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setIsUserAuthenticated(false);
    setUserProfile(null);
  }, []);

  const handleAdminLogin = useCallback((result: { success: boolean; user?: AdminUser }) => {
    if (result.success && result.user) {
      setAdminUser(result.user);
      setIsAdminView(true);
    }
  }, []);

  const handleAdminLogout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Admin logout error:', err);
    }
    setAdminUser(null);
    setIsAdminView(false);
  }, []);

  const openAuthModal = useCallback(() => {
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  return {
    isUserAuthenticated,
    userProfile,
    isAuthModalOpen,
    isAdminView,
    adminUser,
    handleLoginSuccess,
    handleUserLogout,
    handleAdminLogin,
    handleAdminLogout,
    openAuthModal,
    closeAuthModal,
  };
};
