import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, Calendar, Users, DollarSign, UserCheck, Clock, 
  Plus, Search, Phone, Mail, User, Lock, Save, CheckCircle, 
  AlertCircle, X, Edit2, Trash2, MapPin, CreditCard, CalendarClock,
  UserPlus, History, ChevronDown, ChevronUp
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { useData } from '@/store';
import { authService } from '@/services/api';

interface ReceptionistDashboardProps {
  user: { role: string; id?: number; name?: string; email?: string };
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  staffMember: {
    id: number;
    name: string;
    role: string;
    email?: string;
    phone?: string;
    avatar?: string;
  };
}

const ReceptionistDashboard: React.FC<ReceptionistDashboardProps> = (props) => {
  const { staffMember } = props;
  const { 
    appointments, 
    staff, 
    services, 
    branches,
    inventory,
    addAppointment,
    updateAppointmentStatus,
    updateAppointment,
    refreshAppointments,
    refreshStaff
  } = useData();

  const [activeModule, setActiveModule] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isCustomerSearchOpen, setIsCustomerSearchOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [customerSearchResults, setCustomerSearchResults] = useState<any[]>([]);

  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    serviceId: '',
    staffId: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    notes: '',
  });

  // Billing state
  const [billingCart, setBillingCart] = useState<any[]>([]);
  const [billingDiscount, setBillingDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  // Profile & password state
  const [profileForm, setProfileForm] = useState({
    name: staffMember?.name || '',
    email: staffMember?.email || '',
    phone: staffMember?.phone || '',
  });
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [profileStatus, setProfileStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  React.useEffect(() => {
    setProfileForm({
      name: staffMember?.name || '',
      email: staffMember?.email || '',
      phone: staffMember?.phone || '',
    });
  }, [staffMember]);

  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const todayAppointments = useMemo(() => {
    return appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]);
  }, [appointments]);

  const availableStaff = useMemo(() => {
    return staff.filter(s => s.available !== false);
  }, [staff]);

  const selectedDateAppointments = useMemo(() => {
    return appointments.filter(apt => apt.date === selectedDate);
  }, [appointments, selectedDate]);

  const handleQuickBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedService = services.find(s => s.id === parseInt(bookingForm.serviceId));
      if (!selectedService) {
        setToast({ type: 'error', msg: 'Please select a valid service' });
        return;
      }

      await addAppointment({
        customer: bookingForm.customerName,
        customerPhone: bookingForm.customerPhone,
        customerEmail: bookingForm.customerEmail,
        service: selectedService.name,
        price: selectedService.price,
        staffId: parseInt(bookingForm.staffId),
        branchId: branches[0]?.id || 1,
        date: bookingForm.date,
        time: bookingForm.time,
        notes: bookingForm.notes,
        paymentMethod: 'Pay at Venue',
      });
      setToast({ type: 'success', msg: 'Appointment booked successfully' });
      setIsBookingModalOpen(false);
      setBookingForm({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        serviceId: '',
        staffId: '',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        notes: '',
      });
      await refreshAppointments();
    } catch (err: any) {
      setToast({ type: 'error', msg: err?.response?.data?.message || 'Failed to book appointment' });
    }
  };

  const handleCustomerSearch = () => {
    if (!searchQuery.trim()) {
      setCustomerSearchResults([]);
      return;
    }
    
    // Search appointments by phone or name
    const results = appointments.filter(apt => 
      apt.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.customerPhone?.includes(searchQuery)
    );
    
    // Group by customer
    const customerMap = new Map();
    results.forEach(apt => {
      const key = apt.customerPhone || apt.customer || apt.customerName;
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          name: apt.customer || apt.customerName,
          phone: apt.customerPhone,
          email: apt.customerEmail,
          appointments: [],
          totalSpent: 0,
          lastVisit: apt.date
        });
      }
      const customer = customerMap.get(key);
      customer.appointments.push(apt);
      customer.totalSpent += apt.price || 0;
      if (apt.date > customer.lastVisit) {
        customer.lastVisit = apt.date;
      }
    });
    
    setCustomerSearchResults(Array.from(customerMap.values()));
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileStatus(null);
    setSavingProfile(true);
    try {
      await authService.updateProfile({
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
      });
      await refreshStaff();
      setProfileStatus({ type: 'success', msg: 'Profile updated successfully' });
    } catch (err: any) {
      const message = err?.response?.data?.message || (err?.response?.data?.errors ? JSON.stringify(err.response.data.errors) : err?.message || 'Failed to update profile');
      setProfileStatus({ type: 'error', msg: message });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);
    setSavingPassword(true);
    try {
      await authService.updatePassword({
        current_password: passwordForm.current,
        new_password: passwordForm.next,
        new_password_confirmation: passwordForm.confirm,
      });
      setPasswordStatus({ type: 'success', msg: 'Password updated successfully' });
      setPasswordForm({ current: '', next: '', confirm: '' });
    } catch (err: any) {
      const message = err?.response?.data?.message || (err?.response?.data?.errors ? JSON.stringify(err.response.data.errors) : err?.message || 'Failed to update password');
      setPasswordStatus({ type: 'error', msg: message });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleGenerateBill = () => {
    const subtotal = billingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = subtotal * (billingDiscount / 100);
    const total = subtotal - discountAmount;
    
    setToast({ type: 'success', msg: `Bill generated: ₹${total.toFixed(2)} - Payment: ${paymentMethod}` });
    setBillingCart([]);
    setBillingDiscount(0);
    setIsBillingModalOpen(false);
  };

  const handleReassignStaff = async (newStaffId: number) => {
    if (!selectedAppointment) return;
    try {
      await updateAppointment(selectedAppointment.id, { staffId: newStaffId });
      setToast({ type: 'success', msg: 'Staff reassigned successfully' });
      setIsReassignModalOpen(false);
      setSelectedAppointment(null);
      await refreshAppointments();
    } catch {
      setToast({ type: 'error', msg: 'Failed to reassign staff' });
    }
  };

  const handleCancelAppointment = async (appointmentId: number) => {
    try {
      await updateAppointmentStatus(appointmentId, 'Cancelled');
      setToast({ type: 'success', msg: 'Appointment cancelled' });
      await refreshAppointments();
    } catch {
      setToast({ type: 'error', msg: 'Failed to cancel appointment' });
    }
  };

  const sidebarNavItems = [
    { id: 'home', label: 'Front Desk', icon: LayoutDashboard },
    { id: 'appointments', label: 'Today\'s Schedule', icon: Calendar },
    { id: 'quick-book', label: 'Quick Booking', icon: Plus },
    { id: 'calendar', label: 'Calendar View', icon: CalendarClock },
    { id: 'customers', label: 'Customer Lookup', icon: Users },
    { id: 'billing', label: 'Billing & Payment', icon: DollarSign },
    { id: 'staff-status', label: 'Staff Availability', icon: UserCheck },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'security', label: 'Password', icon: Lock },
  ];

  const renderContent = () => {
    switch (activeModule) {
      case 'home':
        return (
          <div className="space-y-6">
            {/* Quick stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-gray-200 dark:border-neutral-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Today's Total</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{todayAppointments.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-gray-200 dark:border-neutral-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Completed</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{todayAppointments.filter(a => a.status === 'Completed').length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-gray-200 dark:border-neutral-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">{todayAppointments.filter(a => a.status === 'Scheduled').length}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-gray-200 dark:border-neutral-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Staff Available</p>
                    <p className="text-2xl font-bold text-indigo-600 mt-1">{availableStaff.length}</p>
                  </div>
                  <UserCheck className="w-8 h-8 text-indigo-500" />
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-black dark:bg-white text-white dark:text-black p-6 rounded-xl flex items-center gap-4 hover:opacity-90 transition-opacity"
              >
                <Plus className="w-8 h-8" />
                <div className="text-left">
                  <p className="font-bold text-lg">New Walk-in Booking</p>
                  <p className="text-sm opacity-80">Create appointment</p>
                </div>
              </button>
              <button
                onClick={() => setIsCustomerSearchOpen(true)}
                className="bg-blue-600 text-white p-6 rounded-xl flex items-center gap-4 hover:opacity-90 transition-opacity"
              >
                <Search className="w-8 h-8" />
                <div className="text-left">
                  <p className="font-bold text-lg">Find Customer</p>
                  <p className="text-sm opacity-80">Search by phone</p>
                </div>
              </button>
              <button
                onClick={() => setIsBillingModalOpen(true)}
                className="bg-green-600 text-white p-6 rounded-xl flex items-center gap-4 hover:opacity-90 transition-opacity"
              >
                <CreditCard className="w-8 h-8" />
                <div className="text-left">
                  <p className="font-bold text-lg">Generate Bill</p>
                  <p className="text-sm opacity-80">Create invoice</p>
                </div>
              </button>
            </div>

            {/* Today's schedule preview */}
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-gray-200 dark:border-neutral-700">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Today's Appointments</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                {todayAppointments.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">No appointments scheduled for today</p>
                ) : (
                  todayAppointments.map(apt => {
                    const aptStaff = staff.find(s => s.id === apt.staffId);
                    const aptService = services.find(s => s.id === apt.serviceId);
                    return (
                      <div key={apt.id} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-neutral-700/30 border border-gray-200 dark:border-neutral-600">
                        <div className="text-center min-w-[70px]">
                          <p className="font-bold text-sm">{apt.time}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            apt.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            apt.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                          }`}>{apt.status}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm text-gray-900 dark:text-white">{apt.customer || apt.customerName}</p>
                          <p className="text-xs text-gray-500">{aptService?.name || apt.service || 'Service'}</p>
                          <p className="text-[11px] text-gray-400">Staff: {aptStaff?.name || 'Unassigned'}</p>
                          {apt.customerPhone && <p className="text-[11px] text-gray-400"><Phone className="inline w-3 h-3" /> {apt.customerPhone}</p>}
                        </div>
                        {apt.status === 'Scheduled' && (
                          <div className="flex gap-2">
                            <button
                              onClick={async () => {
                                try {
                                  await updateAppointmentStatus(apt.id, 'Completed');
                                  setToast({ type: 'success', msg: 'Marked as completed' });
                                  await refreshAppointments();
                                } catch {
                                  setToast({ type: 'error', msg: 'Failed to update' });
                                }
                              }}
                              className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => {
                                setSelectedAppointment(apt);
                                setIsReassignModalOpen(true);
                              }}
                              className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700"
                            >
                              Reassign
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Cancel this appointment?')) {
                                  handleCancelAppointment(apt.id);
                                }
                              }}
                              className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );

      case 'appointments':
        return (
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-gray-200 dark:border-neutral-700">
            <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">Today's Full Schedule</h3>
            <div className="space-y-2">
              {todayAppointments.length === 0 ? (
                <p className="text-center text-gray-400 py-12">No appointments scheduled</p>
              ) : (
                todayAppointments.map(apt => {
                  const aptStaff = staff.find(s => s.id === apt.staffId);
                  const aptService = services.find(s => s.id === apt.serviceId);
                  return (
                    <div key={apt.id} className="grid grid-cols-12 gap-4 p-4 rounded-lg bg-gray-50 dark:bg-neutral-700/30 border border-gray-200 dark:border-neutral-600">
                      <div className="col-span-2 text-center">
                        <p className="font-bold">{apt.time}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          apt.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          apt.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                        }`}>{apt.status}</span>
                      </div>
                      <div className="col-span-3">
                        <p className="font-bold text-sm">{apt.customer || apt.customerName}</p>
                        <p className="text-xs text-gray-500">{apt.customerPhone}</p>
                      </div>
                      <div className="col-span-3">
                        <p className="text-sm">{aptService?.name || apt.service}</p>
                        <p className="text-xs text-gray-500">₹{aptService?.price || apt.amount}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm">{aptStaff?.name || 'Unassigned'}</p>
                        <p className="text-xs text-gray-500">{aptStaff?.role}</p>
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        {apt.status === 'Scheduled' && (
                          <>
                            <button
                              onClick={async () => {
                                try {
                                  await updateAppointmentStatus(apt.id, 'Completed');
                                  setToast({ type: 'success', msg: 'Completed' });
                                  await refreshAppointments();
                                } catch {
                                  setToast({ type: 'error', msg: 'Failed' });
                                }
                              }}
                              className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => {
                                setSelectedAppointment(apt);
                                setIsReassignModalOpen(true);
                              }}
                              className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                            >
                              Reassign
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Cancel this appointment?')) {
                                  handleCancelAppointment(apt.id);
                                }
                              }}
                              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );

      case 'quick-book':
        return (
          <div className="max-w-3xl mx-auto bg-white dark:bg-neutral-800 p-6 rounded-xl border border-gray-200 dark:border-neutral-700">
            <h3 className="font-bold text-xl mb-6 text-gray-900 dark:text-white">Quick Booking</h3>
            <form onSubmit={handleQuickBooking} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Customer Name *</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    required
                    value={bookingForm.customerName}
                    onChange={(e) => setBookingForm({ ...bookingForm, customerName: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none border border-transparent focus:border-black dark:focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="Enter phone"
                    required
                    value={bookingForm.customerPhone}
                    onChange={(e) => setBookingForm({ ...bookingForm, customerPhone: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none border border-transparent focus:border-black dark:focus:border-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Email (optional)</label>
                <input
                  type="email"
                  placeholder="customer@example.com"
                  value={bookingForm.customerEmail}
                  onChange={(e) => setBookingForm({ ...bookingForm, customerEmail: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none border border-transparent focus:border-black dark:focus:border-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Select Service *</label>
                <select
                  required
                  value={bookingForm.serviceId}
                  onChange={(e) => setBookingForm({ ...bookingForm, serviceId: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none border border-transparent focus:border-black dark:focus:border-white"
                >
                  <option value="">Choose a service</option>
                  {services.map(svc => (
                    <option key={svc.id} value={svc.id}>{svc.name} - ₹{svc.price}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Assign Staff *</label>
                <select
                  required
                  value={bookingForm.staffId}
                  onChange={(e) => setBookingForm({ ...bookingForm, staffId: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none border border-transparent focus:border-black dark:focus:border-white"
                >
                  <option value="">Choose staff member</option>
                  {availableStaff.map(s => (
                    <option key={s.id} value={s.id}>{s.name} - {s.role}</option>
                  ))}
                </select>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Date *</label>
                  <input
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none border border-transparent focus:border-black dark:focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Time *</label>
                  <input
                    type="time"
                    required
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none border border-transparent focus:border-black dark:focus:border-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Notes</label>
                <textarea
                  placeholder="Any special instructions..."
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none border border-transparent focus:border-black dark:focus:border-white"
                  rows={3}
                />
              </div>
              <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black p-3 rounded-lg font-bold hover:opacity-90">
                Book Appointment
              </button>
            </form>
          </div>
        );

      case 'calendar':
        const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
        
        return (
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-gray-200 dark:border-neutral-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-gray-900 dark:text-white">Calendar View</h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-gray-50 dark:bg-neutral-700 p-2 rounded-lg text-sm outline-none border border-gray-200 dark:border-neutral-600"
              />
            </div>
            
            {/* Time Slot Grid */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-neutral-700">
                    <th className="text-left p-2 font-semibold">Time</th>
                    {staff.slice(0, 4).map(s => (
                      <th key={s.id} className="text-left p-2 font-semibold">{s.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map(time => {
                    const slotsForTime = selectedDateAppointments.filter(apt => apt.time === time);
                    return (
                      <tr key={time} className="border-b border-gray-100 dark:border-neutral-800">
                        <td className="p-2 font-semibold">{time}</td>
                        {staff.slice(0, 4).map(s => {
                          const appointment = slotsForTime.find(apt => apt.staffId === s.id);
                          return (
                            <td key={s.id} className="p-2">
                              {appointment ? (
                                <div className={`text-xs p-2 rounded ${
                                  appointment.status === 'Completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                                  appointment.status === 'Scheduled' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' :
                                  'bg-gray-100 dark:bg-neutral-700 text-gray-800 dark:text-gray-200'
                                }`}>
                                  <p className="font-semibold truncate">{appointment.customer || appointment.customerName}</p>
                                  <p className="truncate">{appointment.service}</p>
                                </div>
                              ) : (
                                <div className="text-xs p-2 rounded bg-gray-50 dark:bg-neutral-700/50 text-gray-400 text-center">
                                  Free
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-3">All Appointments for {selectedDate}</h4>
              <div className="space-y-2">
                {selectedDateAppointments.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">No appointments on this date</p>
                ) : (
                  selectedDateAppointments.map(apt => {
                    const aptStaff = staff.find(s => s.id === apt.staffId);
                    return (
                      <div key={apt.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-neutral-700/30 border border-gray-200 dark:border-neutral-600">
                        <div className="min-w-[60px] text-center">
                          <p className="font-bold text-sm">{apt.time}</p>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm">{apt.customer || apt.customerName}</p>
                          <p className="text-xs text-gray-500">{apt.service}</p>
                        </div>
                        <div className="min-w-[120px]">
                          <p className="text-sm">{aptStaff?.name}</p>
                          <p className="text-xs text-gray-500">{aptStaff?.role}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          apt.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          apt.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                        }`}>{apt.status}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );

      case 'customers':
        return (
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-gray-200 dark:border-neutral-700">
            <h3 className="font-bold text-xl mb-6 text-gray-900 dark:text-white">Customer Lookup</h3>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg mb-6">
              <Phone className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or phone number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <button 
                onClick={handleCustomerSearch}
                className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90"
              >
                Search
              </button>
            </div>
            <div className="space-y-3">
              {customerSearchResults.length === 0 ? (
                <p className="text-center text-gray-400 py-12">Enter phone or name to search</p>
              ) : (
                customerSearchResults.map(apt => (
                  <div key={apt.id} className="p-4 rounded-lg bg-gray-50 dark:bg-neutral-700/30 border border-gray-200 dark:border-neutral-600">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{apt.customer || apt.customerName}</p>
                        <p className="text-sm text-gray-500"><Phone className="inline w-3 h-3" /> {apt.customerPhone}</p>
                        <p className="text-sm text-gray-500"><Mail className="inline w-3 h-3" /> {apt.customerEmail || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Last Visit</p>
                        <p className="text-sm font-semibold">{apt.date}</p>
                        <p className="text-xs text-gray-500">{apt.service}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-gray-200 dark:border-neutral-700">
              <h3 className="font-bold text-xl mb-4 text-gray-900 dark:text-white">Billing & Payment</h3>
              <button
                onClick={() => setIsBillingModalOpen(true)}
                className="w-full bg-black dark:bg-white text-white dark:text-black p-4 rounded-lg font-bold hover:opacity-90 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Generate New Bill
              </button>
            </div>
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-gray-200 dark:border-neutral-700">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Recent Transactions</h3>
              <div className="space-y-2">
                {appointments.filter(a => a.paymentStatus === 'Paid').slice(0, 10).map(apt => (
                  <div key={apt.id} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-neutral-700/30">
                    <div>
                      <p className="font-semibold text-sm">{apt.customer || apt.customerName}</p>
                      <p className="text-xs text-gray-500">{apt.date} • {apt.service}</p>
                    </div>
                    <p className="font-bold text-green-600">₹{apt.amount || services.find(s => s.id === apt.serviceId)?.price || 0}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'staff-status':
        const availableCount = staff.filter(s => {
          const todayBookings = todayAppointments.filter(a => a.staffId === s.id);
          const currentBooking = todayBookings.find(a => {
            const now = new Date();
            const [hours, minutes] = a.time.split(':').map(Number);
            const aptTime = new Date();
            aptTime.setHours(hours, minutes, 0);
            const diff = Math.abs(now.getTime() - aptTime.getTime()) / (1000 * 60);
            return a.status === 'Scheduled' && diff < 60;
          });
          return s.available !== false && !currentBooking;
        }).length;

        return (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 font-medium">Available Now</p>
                    <p className="text-4xl font-bold mt-2">{availableCount}</p>
                    <p className="text-xs opacity-80 mt-1">Ready for appointments</p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-full">
                    <UserCheck className="w-8 h-8" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 font-medium">Currently Busy</p>
                    <p className="text-4xl font-bold mt-2">{staff.length - availableCount}</p>
                    <p className="text-xs opacity-80 mt-1">With customers</p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-full">
                    <Clock className="w-8 h-8" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 font-medium">Total Staff</p>
                    <p className="text-4xl font-bold mt-2">{staff.length}</p>
                    <p className="text-xs opacity-80 mt-1">On duty today</p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-full">
                    <Users className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </div>

            {/* Staff Grid */}
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-gray-200 dark:border-neutral-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">Staff Members</h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-600 dark:text-gray-400">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-600 dark:text-gray-400">Busy</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {staff.map(s => {
                  const todayBookings = todayAppointments.filter(a => a.staffId === s.id);
                  const completedToday = todayBookings.filter(a => a.status === 'Completed').length;
                  const pendingToday = todayBookings.filter(a => a.status === 'Scheduled').length;
                  const currentBooking = todayBookings.find(a => {
                    const now = new Date();
                    const [hours, minutes] = a.time.split(':').map(Number);
                    const aptTime = new Date();
                    aptTime.setHours(hours, minutes, 0);
                    const diff = Math.abs(now.getTime() - aptTime.getTime()) / (1000 * 60);
                    return a.status === 'Scheduled' && diff < 60;
                  });
                  const isAvailable = s.available !== false && !currentBooking;

                  return (
                    <div 
                      key={s.id} 
                      className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                        isAvailable 
                          ? 'border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-white dark:from-green-900/10 dark:to-neutral-800' 
                          : 'border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-white dark:from-red-900/10 dark:to-neutral-800'
                      }`}
                    >
                      {/* Status indicator bar */}
                      <div className={`absolute top-0 left-0 right-0 h-1 ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      
                      <div className="p-5">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white ${
                              isAvailable ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-red-400 to-red-600'
                            }`}>
                              {s.name.charAt(0).toUpperCase()}
                              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                              }`}></div>
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-sm text-gray-900 dark:text-white">{s.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{s.role || s.specialty}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Current booking alert */}
                        {currentBooking && (
                          <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border border-yellow-300 dark:border-yellow-700">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-3 h-3 text-yellow-700 dark:text-yellow-400" />
                              <p className="text-xs font-bold text-yellow-800 dark:text-yellow-300">In Session</p>
                            </div>
                            <p className="text-xs font-semibold text-yellow-900 dark:text-yellow-200">{currentBooking.customer || currentBooking.customerName}</p>
                            <p className="text-xs text-yellow-700 dark:text-yellow-400">{currentBooking.service}</p>
                            <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">⏰ {currentBooking.time}</p>
                          </div>
                        )}
                        
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="text-center p-2 rounded-lg bg-white dark:bg-neutral-700/50">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{todayBookings.length}</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">Total</p>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-white dark:bg-neutral-700/50">
                            <p className="text-lg font-bold text-green-600">{completedToday}</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">Done</p>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-white dark:bg-neutral-700/50">
                            <p className="text-lg font-bold text-yellow-600">{pendingToday}</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">Pending</p>
                          </div>
                        </div>
                        
                        {/* Status badge */}
                        <div className={`w-full py-2 px-3 rounded-lg text-center font-semibold text-sm ${
                          isAvailable 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                        }`}>
                          {currentBooking ? '🔴 Busy Now' : isAvailable ? '✅ Available' : '❌ Unavailable'}
                        </div>
                        
                        {/* Schedule */}
                        {todayBookings.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
                            <button
                              onClick={() => {
                                const detail = document.getElementById(`schedule-${s.id}`);
                                if (detail) {
                                  detail.classList.toggle('hidden');
                                }
                              }}
                              className="w-full flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-2"
                            >
                              <span>Today's Schedule ({todayBookings.length})</span>
                              <ChevronDown className="w-3 h-3" />
                            </button>
                            <div id={`schedule-${s.id}`} className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
                              {todayBookings.map(apt => (
                                <div key={apt.id} className="flex items-center justify-between p-2 rounded bg-white dark:bg-neutral-700 text-xs">
                                  <div className="flex-1">
                                    <p className="font-semibold text-gray-900 dark:text-white">{apt.time}</p>
                                    <p className="text-gray-500 dark:text-gray-400 truncate text-[10px]">{apt.customer || apt.customerName}</p>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${
                                    apt.status === 'Completed' 
                                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  }`}>{apt.status}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="max-w-3xl mx-auto bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-gray-500 font-semibold">Profile</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Update your details</h3>
              </div>
            </div>
            {profileStatus && (
              <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${profileStatus.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'}`}>
                {profileStatus.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} {profileStatus.msg}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleProfileSave}>
              <div className="grid md:grid-cols-2 gap-4">
                <label className="space-y-1 text-sm">
                  <span className="text-gray-600 dark:text-gray-300 font-semibold">Full Name</span>
                  <input
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg border border-transparent focus:border-black dark:focus:border-white outline-none text-gray-900 dark:text-white"
                  />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="text-gray-600 dark:text-gray-300 font-semibold">Email</span>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg border border-transparent focus:border-black dark:focus:border-white outline-none text-gray-900 dark:text-white"
                    required
                  />
                </label>
              </div>
              <label className="space-y-1 text-sm">
                <span className="text-gray-600 dark:text-gray-300 font-semibold">Phone</span>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg border border-transparent focus:border-black dark:focus:border-white outline-none text-gray-900 dark:text-white"
                />
              </label>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-60"
                >
                  <Save className="w-4 h-4" /> {savingProfile ? 'Saving...' : 'Save profile'}
                </button>
              </div>
            </form>
          </div>
        );

      case 'security':
        return (
          <div className="max-w-2xl mx-auto bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-gray-100 dark:bg-neutral-700"><Lock className="w-5 h-5" /></div>
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-gray-500 font-semibold">Security</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Update password</h3>
              </div>
            </div>
            {passwordStatus && (
              <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${passwordStatus.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'}`}>
                {passwordStatus.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} {passwordStatus.msg}
              </div>
            )}
            <form className="space-y-4" onSubmit={handlePasswordSave}>
              <label className="space-y-1 text-sm">
                <span className="text-gray-600 dark:text-gray-300 font-semibold">Current password</span>
                <input
                  type="password"
                  required
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg border border-transparent focus:border-black dark:focus:border-white outline-none text-gray-900 dark:text-white"
                />
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                <label className="space-y-1 text-sm">
                  <span className="text-gray-600 dark:text-gray-300 font-semibold">New password</span>
                  <input
                    type="password"
                    required
                    value={passwordForm.next}
                    onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg border border-transparent focus:border-black dark:focus:border-white outline-none text-gray-900 dark:text-white"
                  />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="text-gray-600 dark:text-gray-300 font-semibold">Confirm new password</span>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg border border-transparent focus:border-black dark:focus:border-white outline-none text-gray-900 dark:text-white"
                  />
                </label>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-60"
                >
                  <Save className="w-4 h-4" /> {savingPassword ? 'Updating...' : 'Update password'}
                </button>
              </div>
            </form>
          </div>
        );

      default:
        return (
          <div className="bg-white dark:bg-neutral-800 p-8 rounded-xl border border-gray-200 dark:border-neutral-700 text-center">
            <p className="text-gray-500">Module not found</p>
          </div>
        );
    }
  };

  return (
    <>
      <DashboardLayout
        {...props}
        sidebarNavItems={sidebarNavItems}
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        pageTitle="Receptionist Portal"
      >
        {renderContent()}
      </DashboardLayout>

      {/* Quick Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Quick Booking</h3>
              <button onClick={() => setIsBookingModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleQuickBooking} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Customer Name"
                  required
                  value={bookingForm.customerName}
                  onChange={(e) => setBookingForm({ ...bookingForm, customerName: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  value={bookingForm.customerPhone}
                  onChange={(e) => setBookingForm({ ...bookingForm, customerPhone: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none"
                />
              </div>
              <input
                type="email"
                placeholder="Email (optional)"
                value={bookingForm.customerEmail}
                onChange={(e) => setBookingForm({ ...bookingForm, customerEmail: e.target.value })}
                className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none"
              />
              <select
                required
                value={bookingForm.serviceId}
                onChange={(e) => setBookingForm({ ...bookingForm, serviceId: e.target.value })}
                className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none"
              >
                <option value="">Select Service</option>
                {services.map(svc => (
                  <option key={svc.id} value={svc.id}>{svc.name} - ₹{svc.price}</option>
                ))}
              </select>
              <select
                required
                value={bookingForm.staffId}
                onChange={(e) => setBookingForm({ ...bookingForm, staffId: e.target.value })}
                className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none"
              >
                <option value="">Select Staff</option>
                {availableStaff.map(s => (
                  <option key={s.id} value={s.id}>{s.name} - {s.role}</option>
                ))}
              </select>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="date"
                  required
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none"
                />
                <input
                  type="time"
                  required
                  value={bookingForm.time}
                  onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none"
                />
              </div>
              <textarea
                placeholder="Notes (optional)"
                value={bookingForm.notes}
                onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none"
                rows={2}
              />
              <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black p-3 rounded-lg font-bold hover:opacity-90">
                Book Appointment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Customer Search Modal */}
      {isCustomerSearchOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Find Customer</h3>
              <button onClick={() => setIsCustomerSearchOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg mb-4">
              <Phone className="w-5 h-5 text-gray-400" />
              <input
                type="tel"
                placeholder="Enter phone number or name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <button 
                onClick={handleCustomerSearch}
                className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm font-bold"
              >
                Search
              </button>
            </div>
            <div className="space-y-3">
              {customerSearchResults.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm mb-4">
                    {searchQuery ? 'No customer found with this phone/name' : 'Enter phone number or name to search'}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setBookingForm({ ...bookingForm, customerPhone: searchQuery });
                        setIsCustomerSearchOpen(false);
                        setIsBookingModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg font-semibold hover:opacity-90"
                    >
                      <UserPlus className="w-4 h-4" />
                      Create New Customer Appointment
                    </button>
                  )}
                </div>
              ) : (
                customerSearchResults.map((customer, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-gray-50 dark:bg-neutral-700/30 border border-gray-200 dark:border-neutral-600">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-lg">{customer.name}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Phone className="inline w-3 h-3" /> {customer.phone || 'N/A'}
                        </p>
                        {customer.email && (
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="inline w-3 h-3" /> {customer.email}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Total Visits</p>
                        <p className="text-2xl font-bold text-blue-600">{customer.appointments.length}</p>
                        <p className="text-xs text-gray-500 mt-1">Total Spent</p>
                        <p className="text-sm font-bold text-green-600">₹{customer.totalSpent.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-neutral-600 pt-3 mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Recent Visits</p>
                        <button
                          onClick={() => {
                            setBookingForm({ 
                              ...bookingForm, 
                              customerName: customer.name,
                              customerPhone: customer.phone || '',
                              customerEmail: customer.email || ''
                            });
                            setIsCustomerSearchOpen(false);
                            setIsBookingModalOpen(true);
                          }}
                          className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                        >
                          Book Again
                        </button>
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {customer.appointments.slice(0, 5).map((apt: any) => (
                          <div key={apt.id} className="flex justify-between text-xs bg-white dark:bg-neutral-800 p-2 rounded">
                            <div>
                              <p className="font-semibold">{apt.service}</p>
                              <p className="text-gray-500">{apt.date} • {apt.time}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">₹{apt.price}</p>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                apt.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                apt.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>{apt.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Billing Modal */}
      {isBillingModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Generate Bill</h3>
              <button onClick={() => setIsBillingModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Customer Phone (optional)</label>
                <input
                  type="tel"
                  placeholder="Enter phone number to link to customer"
                  className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none border border-transparent focus:border-black dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Add Service</label>
                <select
                  onChange={(e) => {
                    const svc = services.find(s => s.id === parseInt(e.target.value));
                    if (svc) {
                      setBillingCart([...billingCart, { ...svc, quantity: 1, type: 'service' }]);
                    }
                    e.target.value = '';
                  }}
                  className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none"
                >
                  <option value="">Select service</option>
                  {services.map(svc => (
                    <option key={svc.id} value={svc.id}>{svc.name} - ₹{svc.price}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Add Product</label>
                <select
                  onChange={(e) => {
                    const item = inventory.find(i => i.id === parseInt(e.target.value));
                    if (item && item.stock > 0) {
                      // Estimate price based on category (in real app, products would have prices)
                      const estimatedPrice = item.category === 'Hair Care' ? 500 : 
                                            item.category === 'Skin Care' ? 400 : 300;
                      setBillingCart([...billingCart, { 
                        id: item.id, 
                        name: item.name, 
                        price: estimatedPrice, 
                        quantity: 1, 
                        type: 'product' 
                      }]);
                    }
                    e.target.value = '';
                  }}
                  className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none"
                >
                  <option value="">Select product</option>
                  {inventory.filter(i => i.stock > 0).map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} - {item.category} (Stock: {item.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                {billingCart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-neutral-700">
                    <div>
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        ₹{item.price} × {item.quantity} 
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-200 dark:bg-neutral-600 text-[10px]">
                          {item.type || 'service'}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const newCart = [...billingCart];
                          newCart[idx].quantity = parseInt(e.target.value) || 1;
                          setBillingCart(newCart);
                        }}
                        className="w-16 bg-white dark:bg-neutral-600 p-1 rounded text-center text-sm"
                      />
                      <button
                        onClick={() => setBillingCart(billingCart.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={billingDiscount}
                  onChange={(e) => setBillingDiscount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Cash', 'UPI', 'Card'].map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-2 rounded-lg text-sm font-semibold ${
                        paymentMethod === method
                          ? 'bg-black dark:bg-white text-white dark:text-black'
                          : 'bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-neutral-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>₹{billingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-red-600">
                  <span>Discount ({billingDiscount}%):</span>
                  <span>-₹{(billingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * billingDiscount / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>₹{(billingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * (1 - billingDiscount / 100)).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleGenerateBill}
                disabled={billingCart.length === 0}
                className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Bill & Mark as Paid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reassign Staff Modal */}
      {isReassignModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Reassign Staff</h3>
              <button onClick={() => {
                setIsReassignModalOpen(false);
                setSelectedAppointment(null);
              }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Customer: <span className="font-semibold">{selectedAppointment.customer || selectedAppointment.customerName}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Service: <span className="font-semibold">{selectedAppointment.service}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Time: <span className="font-semibold">{selectedAppointment.date} {selectedAppointment.time}</span>
              </p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold mb-2">Select New Staff Member</label>
              {availableStaff.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleReassignStaff(s.id)}
                  className={`w-full p-3 rounded-lg text-left border ${
                    selectedAppointment.staffId === s.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700'
                  }`}
                >
                  <p className="font-semibold text-sm">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.role} {selectedAppointment.staffId === s.id && '(Current)'}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm z-50 ${toast.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
          <button onClick={() => setToast(null)} className="ml-2">×</button>
        </div>
      )}
    </>
  );
};

export default ReceptionistDashboard;
