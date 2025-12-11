import React from 'react';
import { useData } from '@/store';
import { useTheme, useNavigation, useAuth, useBooking, useToggle } from '@/hooks';

// Layout Components
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileMenu from '@/components/layout/MobileMenu';
import BottomNav from '@/components/layout/BottomNav';

// Home Components
import Hero from '@/components/home/Hero';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import GenderSpecificServices from '@/components/home/GenderSpecificServices';
import WhyChooseNaturals from '@/components/home/WhyChooseNaturals';
import CuratedServices from '@/components/home/CuratedServices';
import ComboOffers from '@/components/home/ComboOffers';
import OffersPoster from '@/components/home/OffersPoster';

// Service Components
import ServiceMenu from '@/components/service/ServiceMenu';

// Page Components
import Contact from '@/components/pages/Contact';
import About from '@/components/pages/About';
import Membership from '@/components/pages/Membership';

// Booking Components
import BookingWizard from '@/components/booking/BookingWizard';

// Admin Components
import AdminLogin from '@/components/admin/AdminLogin';
import Dashboard from '@/components/admin/Dashboard';

// Shared Components
import WhatsAppWidget from '@/components/shared/WhatsAppWidget';
import PromoWidget from '@/components/shared/PromoWidget';
import AuthModal from '@/components/shared/AuthModal';

export const AppContent: React.FC = () => {
  const { services, isLoading, error } = useData();
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentView, initialCategory, handleNavigate, handleCategoryClick, resetCategory } = useNavigation();
  const {
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
  } = useAuth();
  const {
    selectedBranchId,
    selectedServiceId,
    bookingWizardStep,
    handleStartBooking,
    handleBookService,
    setStep,
    resetBooking,
  } = useBooking();
  const [isMobileMenuOpen, toggleMobileMenu, setMobileMenuOpen] = useToggle(false);

  // Enhanced handlers
  const handleNavigateWithBooking = (view: string) => {
    // Don't automatically set step when navigating to booking
    // Let the calling function decide the step
    handleNavigate(view as any);
  };

  const handleNavigateToDashboard = () => {
    setStep(0);
    handleNavigate('booking');
  };

  const handleStartBookingEnhanced = () => {
    resetCategory();
    handleStartBooking(); // This sets step to 1
    handleNavigate('booking');
  };

  const handleBookServiceEnhanced = (serviceId: number) => {
    resetCategory();
    handleBookService(serviceId);
    handleNavigate('booking');
  };

  const handleLoginSuccessEnhanced = () => {
    handleLoginSuccess();
    // Check if there's a pending booking
    const pending = localStorage.getItem('pendingBooking');
    if (pending) {
      try {
        const { step: savedStep } = JSON.parse(pending);
        setStep(savedStep);
      } catch {}
    }
    handleNavigate('booking');
  };

  const handleAdminLogoutEnhanced = () => {
    handleAdminLogout();
    handleNavigate('home');
  };

  const handleUserLogoutEnhanced = () => {
    handleUserLogout();
    handleNavigate('home');
  };

  // Determine if we are on the User Dashboard (Step 0 of Booking)
  const isUserDashboard = currentView === 'booking' && bookingWizardStep === 0;

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-black dark:border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Naturals...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Connection Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Render Admin View
  if (isAdminView && adminUser) {
    return (
      <Dashboard
        user={adminUser}
        onLogout={handleAdminLogoutEnhanced}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
    );
  }

  // Render Admin Login
  if (currentView === 'admin-login') {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode ? 'dark bg-neutral-950 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      {/* Top Banner */}
      <AnnouncementBar onNavigate={handleNavigateWithBooking} />

      {/* Header */}
      <Header
        onNavigate={handleNavigateWithBooking}
        currentView={currentView}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        isUserAuthenticated={isUserAuthenticated}
        onLogout={handleUserLogout}
        onSignIn={openAuthModal}
        onNavigateToDashboard={handleNavigateToDashboard}
      />

      {/* Main Content Area */}
      <main className="min-h-screen pt-20 pb-24 md:pb-8">
        {currentView === 'home' && (
          <>
            <Hero onNavigate={handleNavigateWithBooking} onBookClick={handleStartBookingEnhanced} />
            <CategoryShowcase onCategoryClick={handleCategoryClick} />
            <GenderSpecificServices onCategoryClick={handleCategoryClick} />
            <WhyChooseNaturals />
            <CuratedServices onNavigate={handleNavigateWithBooking} />
            <OffersPoster onExplore={() => handleNavigate('discounts')} />
            <ComboOffers
              services={services}
              onBook={handleBookServiceEnhanced}
              onNavigate={handleNavigateWithBooking}
            />
          </>
        )}

        {currentView === 'services' && (
          <ServiceMenu
            services={services}
            onBook={handleBookServiceEnhanced}
            initialCategory={initialCategory}
          />
        )}

        {currentView === 'discounts' && (
          <ServiceMenu
            services={services}
            onBook={handleBookServiceEnhanced}
            isOffersPage={true}
            onNavigate={handleNavigateWithBooking}
          />
        )}

        {currentView === 'contact' && <Contact />}

        {currentView === 'about' && <About />}

        {currentView === 'membership' && <Membership />}

        {currentView === 'booking' && (
          <BookingWizard
            initialBranchId={selectedBranchId}
            initialServiceId={selectedServiceId}
            initialStep={bookingWizardStep}
            onHome={() => handleNavigate('home')}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            onBook={handleBookServiceEnhanced}
            isUserAuthenticated={isUserAuthenticated}
            userProfile={userProfile}
            onNavigate={handleNavigateWithBooking}
            onStepChange={setStep}
            onLogout={handleUserLogoutEnhanced}
            onOpenAuth={openAuthModal}
          />
        )}
      </main>

      {/* Footer */}
      {currentView !== 'booking' && (
        <Footer
          onNavigate={handleNavigateWithBooking}
          onAdminNavigate={() => handleNavigate('admin-login')}
        />
      )}

      {/* Global Overlays - Hidden on Dashboard */}
      {!isUserDashboard && (
        <>
          <WhatsAppWidget />
          <PromoWidget onNavigate={handleNavigateWithBooking} />
        </>
      )}

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onNavigate={handleNavigateWithBooking}
        onStartBooking={handleStartBookingEnhanced}
      />

      <BottomNav
        currentView={currentView}
        onNavigate={handleNavigateWithBooking}
        onStartBooking={handleStartBookingEnhanced}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onLoginSuccess={handleLoginSuccessEnhanced}
      />
    </div>
  );
};
