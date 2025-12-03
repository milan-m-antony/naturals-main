import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '@/store';
import type { Appointment } from '@/types';

// Import new step components
import Step0_Dashboard from './Step0_Dashboard';
import Step1_Services from './Step1_Services';
import Step2_Schedule from './Step2_Schedule';
import Step3_Confirm from './Step3_Confirm';
import Step4_Success from './Step4_Success';
import BookingDetailModal from './BookingDetailModal';


interface BookingWizardProps {
  initialBranchId: number | null;
  initialServiceId: number | null;
  initialStep?: number;
  onHome: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onBook: (serviceId: number) => void;
  isUserAuthenticated: boolean;
  userProfile: any | null;
  onNavigate: (view: string) => void;
  onStepChange?: (step: number) => void;
  onLogout: () => void;
  onOpenAuth: () => void;
}

const COUPONS: { [key: string]: { type: 'percent' | 'flat'; value: number } } = {
  'GLOW50': { type: 'percent', value: 50 },
  'WELCOME10': { type: 'percent', value: 10 },
  'SAVE200': { type: 'flat', value: 200 }
};

const BookingWizard: React.FC<BookingWizardProps> = ({ 
    initialBranchId, initialServiceId, initialStep = 0, onHome, isDarkMode, toggleTheme, onBook,
    isUserAuthenticated, userProfile, onNavigate, onStepChange, onLogout, onOpenAuth
}) => {
  const { services, addAppointment, appointments, branches, staff, updateAppointmentStatus, refreshAppointments, isStaffAvailable } = useData();
  
  const [step, setStep] = useState(initialStep);
  const [serviceSearch, setServiceSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const [bookingData, setBookingData] = useState({
    branchId: initialBranchId || 1,
    serviceIds: initialServiceId ? [initialServiceId] : [] as number[],
    date: '',
    time: '',
    userName: userProfile?.name || '',
    userEmail: userProfile?.email || '',
    userPhone: userProfile?.phone || '',
  });

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; value: number; type: 'percent' | 'flat' } | null>(null);
  const [couponError, setCouponError] = useState('');

  const [bookingFilter, setBookingFilter] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<Appointment | null>(null);
  const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [fromAddMore, setFromAddMore] = useState(false);
  const [lastBookedAppointments, setLastBookedAppointments] = useState<Appointment[]>([]);

  // Notify parent of step changes
  useEffect(() => {
    if (onStepChange) {
      onStepChange(step);
    }
  }, [step, onStepChange]);

  // Restore booking state after login
  useEffect(() => {
    if (isUserAuthenticated && userProfile) {
      const pending = localStorage.getItem('pendingBooking');
      if (pending) {
        try {
          const { step: savedStep, bookingData: savedData, serviceIds } = JSON.parse(pending);
          setBookingData(prev => ({ ...prev, ...savedData, serviceIds: serviceIds || prev.serviceIds }));
          setStep(savedStep);
          localStorage.removeItem('pendingBooking');
        } catch {}
      }
    }
  }, [isUserAuthenticated, userProfile]);

  // Pre-fill user data from profile whenever userProfile changes
  useEffect(() => {
    if (isUserAuthenticated && userProfile) {
      setBookingData(prev => ({
        ...prev,
        userName: userProfile.name || prev.userName,
        userEmail: userProfile.email || prev.userEmail,
        userPhone: userProfile.phone || prev.userPhone,
      }));
    }
  }, [isUserAuthenticated, userProfile]);

  // Effect to handle prop changes for step and service ID - ONLY on mount
  useEffect(() => {
    if (initialServiceId) {
      setStep(1); 
      if (!bookingData.serviceIds.includes(initialServiceId)) {
         setBookingData(prev => ({ ...prev, serviceIds: [initialServiceId] }));
      }
    } else if (initialStep !== undefined) {
      // If not authenticated and initialStep is 0, start at step 1 instead
      if (!isUserAuthenticated && initialStep === 0) {
        setStep(1);
      } else {
        setStep(initialStep);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

  useEffect(() => {
    if (step !== 1) {
        setFromAddMore(false);
    }
  }, [step]);

  const myAppointments = useMemo(() => {
    if (!userProfile) return appointments;
    const email = (userProfile.email || '').toLowerCase();
    const name = (userProfile.name || '').toLowerCase();
    return appointments.filter(apt => {
      const aptEmail = (apt.customerEmail || '').toLowerCase();
      const aptName = (apt.customer || '').toLowerCase();
      return (email && aptEmail === email) || (name && aptName === name);
    });
  }, [appointments, userProfile]);

  const upcomingAppointments = useMemo(() => myAppointments
    .filter(apt => {
        const aptDate = new Date(apt.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return aptDate >= today && apt.status !== 'Completed' && apt.status !== 'Cancelled';
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [myAppointments]);
  
  const filteredAppointments = useMemo(() => {
    const sortedAppointments = [...myAppointments].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (bookingFilter === 'upcoming') return upcomingAppointments;
    if (bookingFilter === 'completed') return sortedAppointments.filter(apt => apt.status === 'Completed');
    if (bookingFilter === 'cancelled') return sortedAppointments.filter(apt => apt.status === 'Cancelled');
    return [];
  }, [myAppointments, bookingFilter, upcomingAppointments]);

  const getStatusPill = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'In Progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleCancelBooking = (id: number) => {
    updateAppointmentStatus(id, 'Cancelled');
    showToast('Appointment cancelled successfully', 'success');
    setSelectedBooking(null);
  };
  
  const handleReschedule = (serviceId: number) => {
    onBook(serviceId);
    setSelectedBooking(null);
  };

  const serviceDetails = selectedBooking ? services.find(s => s.name === selectedBooking.service) : null;
  const staffDetails = selectedBooking ? staff.find(s => s.id === selectedBooking.staffId) : null;
  const branchDetails = selectedBooking ? branches.find(b => b.id === selectedBooking.branchId) : null;

  const toggleService = (id: number) => {
    const service = services.find(s => s.id === id);
    if (service && (service.slots ?? 0) === 0) return;
    setBookingData(prev => {
      const exists = prev.serviceIds.includes(id);
      if (exists) return { ...prev, serviceIds: prev.serviceIds.filter(sid => sid !== id) };
      return { ...prev, serviceIds: [...prev.serviceIds, id] };
    });
  };

  const clearServices = () => {
    setBookingData(prev => ({ ...prev, serviceIds: [] }));
  };

  const getServicePrice = (s: any) => s.price * (1 - (s.discount || 0)/100);

  const selectedServices = services.filter(s => bookingData.serviceIds.includes(s.id));
  const subTotal = selectedServices.reduce((sum, s) => sum + getServicePrice(s), 0);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'flat') return Math.min(appliedCoupon.value, subTotal);
    return (subTotal * appliedCoupon.value) / 100;
  }, [appliedCoupon, subTotal]);

  const taxAmount = (subTotal - discountAmount) * 0.18;
  const totalAmount = subTotal - discountAmount + taxAmount;

  const handleApplyCoupon = () => {
    const code = couponCode.toUpperCase();
    const coupon = COUPONS[code];
    if (coupon) {
      setAppliedCoupon({ code, ...coupon });
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  // --- Calendar Logic ---
  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayOffset = firstDayOfMonth.getDay(); // 0 is Sunday
    
    const today = new Date();
    today.setHours(0,0,0,0);

    // Mock unavailable dates (e.g. fully booked)
    const unavailableDates = [5, 12, 18, 25]; // Example days of current month

    const days = [];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Empty slots for days before start of month
    for (let i = 0; i < startDayOffset; i++) {
        days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const currentDate = new Date(year, month, i);
        const dateString = currentDate.toLocaleDateString('en-CA'); // YYYY-MM-DD
        const isSelected = bookingData.date === dateString;
        const isToday = currentDate.getTime() === today.getTime();
        const isPast = currentDate < today;
        const isUnavailable = unavailableDates.includes(i) || isPast;

        days.push(
            <button
                key={i}
                disabled={isUnavailable}
                onClick={() => setBookingData(prev => ({ ...prev, date: dateString }))}
                className={`
                    h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all relative
                    ${isSelected ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg scale-110 z-10 font-bold' : ''}
                    ${!isSelected && !isUnavailable ? 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200' : ''}
                    ${isToday && !isSelected ? 'ring-2 ring-yellow-400 text-black dark:text-white font-bold' : ''}
                    ${isUnavailable ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed line-through decoration-gray-300 dark:decoration-gray-600' : ''}
                `}
                title={isUnavailable ? (isPast ? "Past Date" : "Fully Booked") : ""}
            >
                {i}
                {isToday && !isSelected && !isUnavailable && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full"></span>}
            </button>
        );
    }

    return { weekDays, days };
  };

  const { weekDays, days: daysArray } = renderCalendar();
  const timeSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '06:00 PM'];

  // --- Step Navigation ---
  const handleNext = () => {
    // Validate Step 1: must have at least one service
    if (step === 1 && bookingData.serviceIds.length === 0) {
      showToast('Please select at least one service', 'error');
      return;
    }
    // Validate Step 2: must have date and time
    if (step === 2 && (!bookingData.date || !bookingData.time)) {
      showToast('Please select date and time', 'error');
      return;
    }
    setStep(prev => prev + 1);
  };
  const handleBack = () => setStep(prev => prev - 1);

  const handleConfirmBooking = async () => {
    if (!isUserAuthenticated) {
      showToast('Please sign in to book', 'error');
      onNavigate('home');
      return;
    }

    const createdAppointments: Appointment[] = [];
    
    try {
      for (const service of selectedServices) {
        const assignedStaffId = Math.floor(Math.random() * staff.length) + 1;
        const price = service.price * (1 - (service.discount || 0) / 100);

        // Staff availability check
        if (!isStaffAvailable(assignedStaffId, bookingData.date, bookingData.time)) {
          showToast('Selected time is unavailable. Pick another.', 'error');
          setStep(2);
          return;
        }
        
        // Payload for API - match backend expectations
        const aptPayload = {
            branch_id: bookingData.branchId,
            staff_id: assignedStaffId,
            date: bookingData.date,
            time: bookingData.time,
            customer_name: bookingData.userName,
            customer_phone: bookingData.userPhone,
            customer_email: bookingData.userEmail,
            services: [{ id: service.id, price: price }],
            total_price: price,
            payment_method: 'Pay at Venue',
            notes: 'Booked via Web App'
        };
        
        const created = await addAppointment(aptPayload);
        console.log('Created appointment:', created);
        createdAppointments.push(created);
      }
      
      console.log('All created appointments:', createdAppointments);
      setLastBookedAppointments(createdAppointments);
      showToast('Booking Confirmed! See you soon.', 'success');
      setStep(4);
    } catch (err) {
      showToast('Booking failed. Please try again.', 'error');
    }
  };

  const handleFinishBooking = async () => {
      // Reset State
      setBookingData({
        branchId: 1,
        serviceIds: [],
        date: '',
        time: '',
        userName: userProfile?.name || '',
        userEmail: userProfile?.email || '',
        userPhone: userProfile?.phone || '',
      });
      setAppliedCoupon(null);
      setCouponCode('');
      setLastBookedAppointments([]);
      
      // Refresh and go to Dashboard
      try {
        await refreshAppointments();
      } catch {}
      setStep(0);
      setBookingFilter('upcoming');
  };

  const handleAddMoreServices = () => {
      setFromAddMore(true);
      setStep(1); // Go back to services
  };

  const handleBookNew = () => {
      setBookingData(prev => ({ ...prev, serviceIds: [], date: '', time: '' }));
      setStep(1);
  };

  const getBranchName = () => {
      return branches.find(b => b.id === bookingData.branchId)?.name || 'Naturals Salon';
  };

  return (
    <div className="min-h-screen">
        
        {/* Toast Notification */}
        {toast.show && (
            <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-full shadow-xl animate-in slide-in-from-right-10 fade-in duration-300 font-bold text-sm ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {toast.message}
            </div>
        )}

        {/* Step Renderer */}
        {step === 0 && (
            <Step0_Dashboard 
                onHome={onHome}
                bookingFilter={bookingFilter}
                setBookingFilter={setBookingFilter}
                onBookNew={handleBookNew}
                filteredAppointments={filteredAppointments}
                setSelectedBooking={setSelectedBooking}
                getStatusPill={getStatusPill}
                userProfile={userProfile}
                onNavigate={onNavigate}
                toggleTheme={toggleTheme}
                isDarkMode={isDarkMode}
                onLogout={onLogout}
            />
        )}

        {step === 1 && (
            <Step1_Services 
                onBack={() => {
                    if (fromAddMore) {
                        setStep(2); 
                        setFromAddMore(false);
                    } else if (initialStep === 1) {
                        // User entered directly via 'Book Now' -> Exit to Home
                        onHome(); 
                    } else {
                        // User came from Dashboard -> Return to Dashboard
                        setStep(0);
                    }
                }}
                onNext={handleNext}
                serviceSearch={serviceSearch}
                setServiceSearch={setServiceSearch}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                bookingData={bookingData}
                toggleService={toggleService}
                clearServices={clearServices}
                subTotal={subTotal}
                fromAddMore={fromAddMore}
                setFromAddMore={setFromAddMore}
            />
        )}

        {step === 2 && (
            <Step2_Schedule 
                onBack={handleBack}
                onNext={handleNext}
                bookingData={bookingData}
                setBookingData={setBookingData}
                currentMonth={currentMonth}
                handlePrevMonth={handlePrevMonth}
                handleNextMonth={handleNextMonth}
                weekDays={weekDays}
                daysArray={daysArray}
                timeSlots={timeSlots}
                selectedServices={selectedServices}
                subTotal={subTotal}
                discountAmount={discountAmount}
                taxAmount={taxAmount}
                totalAmount={totalAmount}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                couponError={couponError}
                setCouponError={setCouponError}
                appliedCoupon={appliedCoupon}
                handleApplyCoupon={handleApplyCoupon}
                handleRemoveCoupon={handleRemoveCoupon}
                onAddMoreServices={handleAddMoreServices}
            />
        )}

        {step === 3 && (
            <Step3_Confirm 
                onConfirm={handleConfirmBooking}
                onBack={handleBack}
                totalAmount={totalAmount}
                selectedServices={selectedServices}
                bookingData={bookingData}
                setBookingData={setBookingData}
                isUserAuthenticated={isUserAuthenticated}
                userProfile={userProfile}
                onOpenAuth={() => {
                    // Save current booking state before opening auth
                    localStorage.setItem('pendingBooking', JSON.stringify({ step: 3, bookingData, serviceIds: bookingData.serviceIds }));
                    onOpenAuth();
                }}
            />
        )}

        {step === 4 && (
            <Step4_Success 
                appointments={lastBookedAppointments}
                onViewBookings={handleFinishBooking}
                branchName={getBranchName()}
                staffData={staff}
                totalAmount={totalAmount}
            />
        )}

        {/* Detail Modal */}
        {selectedBooking && (
            <BookingDetailModal 
                selectedBooking={selectedBooking}
                serviceDetails={serviceDetails}
                branchDetails={branchDetails}
                staffDetails={staffDetails}
                getStatusPill={getStatusPill}
                onClose={() => setSelectedBooking(null)}
                onReschedule={handleReschedule}
                onCancel={handleCancelBooking}
            />
        )}
    </div>
  );
};

export default BookingWizard;