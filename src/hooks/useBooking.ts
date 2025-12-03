import { useState, useCallback } from 'react';

export const useBooking = () => {
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [bookingWizardStep, setBookingWizardStep] = useState(0);

  const handleStartBooking = useCallback(() => {
    setSelectedServiceId(null);
    setBookingWizardStep(1);
  }, []);

  const handleBookService = useCallback((serviceId: number) => {
    setSelectedServiceId(serviceId);
    setBookingWizardStep(1);
  }, []);

  const resetBooking = useCallback(() => {
    setSelectedServiceId(null);
    setBookingWizardStep(0);
  }, []);

  const setStep = useCallback((step: number) => {
    setBookingWizardStep(step);
    // Clear serviceId when going to dashboard
    if (step === 0) {
      setSelectedServiceId(null);
    }
  }, []);

  return {
    selectedBranchId,
    selectedServiceId,
    bookingWizardStep,
    handleStartBooking,
    handleBookService,
    resetBooking,
    setSelectedBranchId,
    setStep,
  };
};
