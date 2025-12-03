import { useState, useCallback } from 'react';
import type { ViewType } from '@/types';

export const useNavigation = (initialView: ViewType = 'home') => {
  const [currentView, setCurrentView] = useState<ViewType>(initialView);
  const [initialCategory, setInitialCategory] = useState<string | null>(null);

  const handleNavigate = useCallback((view: ViewType) => {
    setInitialCategory(null);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCategoryClick = useCallback((categoryName: string) => {
    setInitialCategory(categoryName);
    setCurrentView('services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const resetCategory = useCallback(() => {
    setInitialCategory(null);
  }, []);

  return {
    currentView,
    initialCategory,
    handleNavigate,
    handleCategoryClick,
    resetCategory,
  };
};
