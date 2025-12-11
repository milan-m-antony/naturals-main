import React, { useState } from 'react';
import { LayoutDashboard, Calendar, Settings, DollarSign, Clock, Bell, CheckCircle, AlertCircle, Phone, Mail, Upload, HelpCircle, User, Lock, Save } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { useData } from '@/store';
import { authService } from '@/services/api';

interface StaffMember {
  id: number; name: string; role: string; image: string;
}

interface DashboardCommonProps {
  user: { role: string }; onLogout: () => void; isDarkMode: boolean; toggleTheme: () => void;
}

interface StaffDashboardProps extends DashboardCommonProps {
  staffMember: StaffMember;
  variant?: 'staff' | 'receptionist';
}

const StaffDashboard: React.FC<StaffDashboardProps> = (props) => {
  const { staffMember, variant = 'staff' } = props;
  const { getAppointmentsByStaff, updateAppointmentStatus, refreshStaff } = useData();
  
  // Safety check
  if (!staffMember) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  // Fetch appointments for this staff member from context
  const staffAppointments = getAppointmentsByStaff(staffMember.id);

  React.useEffect(() => {
    setProfileForm({
      name: staffMember?.name || '',
      email: staffMember?.email || '',
      phone: staffMember?.phone || '',
    });
  }, [staffMember]);

  const [activeModule, setActiveModule] = useState('home');
  const [appointmentFilter, setAppointmentFilter] = useState<'today' | 'upcoming' | 'past'>('today');
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  
  const [leaves, setLeaves] = useState([
    { id: 1, dates: 'Jan 10 - Jan 12', reason: 'Family Event', status: 'Approved' },
    { id: 2, dates: 'Feb 05', reason: 'Sick Leave', status: 'Denied' }
  ]);
  const [leaveForm, setLeaveForm] = useState({ start: '', end: '', reason: '' });

  const [profileForm, setProfileForm] = useState({
    name: staffMember?.name || '',
    email: staffMember?.email || '',
    phone: staffMember?.phone || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    next: '',
    confirm: '',
  });
  const [profileStatus, setProfileStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const sidebarNavItems = variant === 'receptionist'
    ? [
        { id: 'home', label: 'Front Desk', icon: LayoutDashboard },
        { id: 'appointments', label: 'Bookings', icon: Calendar },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Password', icon: Lock },
      ]
    : [
        { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'appointments', label: 'My Appointments', icon: Calendar },
        { id: 'leaves', label: 'My Leaves', icon: Clock },
        { id: 'payroll', label: 'My Payroll', icon: DollarSign },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Password', icon: Lock },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];

  // Handlers
  const handleMarkCompleted = (id: number) => {
    updateAppointmentStatus(id, 'Completed');
    if (selectedAppointment && selectedAppointment.id === id) {
      setSelectedAppointment({ ...selectedAppointment, status: 'Completed' });
    }
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveForm.start || !leaveForm.end || !leaveForm.reason) return;
    
    const newLeave = {
      id: Date.now(),
      dates: `${new Date(leaveForm.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(leaveForm.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      reason: leaveForm.reason,
      status: 'Pending'
    };
    
    setLeaves([newLeave, ...leaves]);
    setLeaveForm({ start: '', end: '', reason: '' });
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

  // Filter Logic
  const filteredAppointments = staffAppointments.filter(apt => {
    const aptDateStr = apt.date;
    const todayStr = new Date().toISOString().split('T')[0];
    
    if (appointmentFilter === 'today') return aptDateStr === todayStr;
    if (appointmentFilter === 'upcoming') return aptDateStr > todayStr;
    if (appointmentFilter === 'past') return aptDateStr < todayStr;
    return true;
  });

  const todayAppointments = staffAppointments.filter(a => a.date === new Date().toISOString().split('T')[0]);

  const renderContent = () => {
    switch (activeModule) {
      case 'home':
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-gray-200 dark:border-neutral-700 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Today's Count</p>
                    <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                      {todayAppointments.length}
                    </h3>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-full text-blue-600">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-gray-200 dark:border-neutral-700 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Completed</p>
                    <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                      {todayAppointments.filter(a => a.status === 'Completed').length}
                    </h3>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-full text-green-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-gray-200 dark:border-neutral-700 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending</p>
                    <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                      {todayAppointments.filter(a => a.status !== 'Completed' && a.status !== 'Cancelled').length}
                    </h3>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-full text-yellow-600">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Schedule Preview */}
            <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Today's Appointments</h3>
                <button onClick={() => setActiveModule('appointments')} className="text-xs font-bold text-blue-600 hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                {todayAppointments.length === 0 ? <p className="text-gray-400 text-sm">No appointments for today.</p> : 
                  todayAppointments.map(apt => (
                  <div key={apt.id} className={`p-4 rounded-xl flex items-center gap-4 border border-transparent transition-all ${apt.status === 'Scheduled' ? 'bg-black text-white shadow-lg' : 'bg-gray-50 dark:bg-neutral-700/30 hover:border-gray-200'}`}>
                    <div className="text-center w-16">
                      <p className="font-bold">{apt.time.split(' ')[0]}</p>
                      <p className={`text-[10px] uppercase ${apt.status === 'Scheduled' ? 'text-yellow-400' : 'text-gray-400'}`}>{apt.time.split(' ')[1]}</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{apt.customer}</p>
                      <p className={`text-xs ${apt.status === 'Scheduled' ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>{apt.service}</p>
                    </div>
                    <div className="flex items-center gap-2">
                       {apt.status === 'Scheduled' && (
                         <button onClick={() => handleMarkCompleted(apt.id)} className="bg-yellow-400 text-black px-3 py-1 rounded-full text-[10px] font-bold uppercase hover:bg-yellow-300">Complete</button>
                       )}
                       <span className={`px-2 py-1 text-[10px] rounded-full font-bold ${
                        apt.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                        apt.status === 'Scheduled' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700'
                      }`}>{apt.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'appointments':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6 min-h-[500px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">My Appointments</h3>
                <div className="bg-gray-100 dark:bg-neutral-700 p-1 rounded-full flex text-xs font-bold">
                  {['today', 'upcoming', 'past'].map((filter) => (
                    <button 
                      key={filter}
                      onClick={() => setAppointmentFilter(filter as any)}
                      className={`px-4 py-2 rounded-full capitalize transition-all ${appointmentFilter === filter ? 'bg-white dark:bg-neutral-600 shadow-sm text-black dark:text-white' : 'text-gray-500 hover:text-black dark:hover:text-white'}
                    `}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4 overflow-y-auto max-h-[600px] custom-scrollbar pr-2">
                {filteredAppointments.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">No appointments found.</div>
                ) : (
                  filteredAppointments.map(apt => (
                    <div 
                      key={apt.id} 
                      onClick={() => setSelectedAppointment(apt)}
                      className={`border cursor-pointer rounded-xl p-4 hover:shadow-md transition-all ${selectedAppointment?.id === apt.id ? 'border-black dark:border-white bg-gray-50 dark:bg-neutral-700' : 'border-gray-100 dark:border-neutral-700 bg-white dark:bg-neutral-800'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <div className="bg-blue-50 dark:bg-blue-900/20 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                            {apt.time.split(' ')[0]}<br/>{apt.time.split(' ')[1]}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">{apt.customer}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{apt.service}</p>
                            <p className="text-[10px] text-gray-400 mt-1">{apt.date}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          apt.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                          apt.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Appointment Details Drawer */}
            <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6 h-fit sticky top-6">
               {selectedAppointment ? (
                 <div className="space-y-6">
                    <h3 className="font-bold text-lg border-b border-gray-100 dark:border-neutral-700 pb-4">Booking Details</h3>
                    <div>
                       <p className="text-xs text-gray-500 uppercase font-bold mb-1">Customer</p>
                       <p className="font-bold text-lg">{selectedAppointment.customer}</p>
                       <p className="text-sm text-gray-500">{selectedAppointment.customerPhone || '+91 98765 43210'}</p>
                    </div>
                    <div>
                       <p className="text-xs text-gray-500 uppercase font-bold mb-1">Service</p>
                       <p className="font-bold">{selectedAppointment.service}</p>
                       <p className="text-sm text-gray-500">₹{selectedAppointment.price}</p>
                    </div>
                    <div>
                       <p className="text-xs text-gray-500 uppercase font-bold mb-1">Notes</p>
                       <p className="text-sm italic bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-yellow-800 dark:text-yellow-200 border border-yellow-100 dark:border-yellow-900/30">
                         {selectedAppointment.notes || 'No specific notes.'}
                       </p>
                    </div>
                    <div className="pt-4 border-t border-gray-100 dark:border-neutral-700">
                       {selectedAppointment.status !== 'Completed' ? (
                         <button 
                           onClick={() => handleMarkCompleted(selectedAppointment.id)}
                           className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-green-700 transition-colors mb-2"
                         >
                           Mark Completed
                         </button>
                       ) : (
                         <button className="w-full bg-gray-100 dark:bg-neutral-700 text-gray-400 py-3 rounded-xl font-bold text-sm uppercase tracking-widest cursor-not-allowed">
                           Completed
                         </button>
                       )}
                       <button onClick={() => setSelectedAppointment(null)} className="w-full text-gray-500 text-xs font-bold uppercase py-2 hover:text-black dark:hover:text-white">Close</button>
                    </div>
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
                    <Calendar className="w-12 h-12 mb-2 opacity-20" />
                    <p className="text-sm">Select an appointment to view details.</p>
                 </div>
               )}
            </div>
          </div>
        );

      case 'leaves':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6 h-fit">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Request Leave</h3>
              <form className="space-y-4" onSubmit={handleLeaveSubmit}>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Start Date</label>
                  <input 
                    type="date" 
                    required
                    className="w-full bg-gray-50 dark:bg-neutral-700 border-none rounded-lg p-3 text-sm outline-none text-gray-900 dark:text-white" 
                    value={leaveForm.start}
                    onChange={e => setLeaveForm({...leaveForm, start: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">End Date</label>
                  <input 
                    type="date" 
                    required
                    className="w-full bg-gray-50 dark:bg-neutral-700 border-none rounded-lg p-3 text-sm outline-none text-gray-900 dark:text-white"
                    value={leaveForm.end}
                    onChange={e => setLeaveForm({...leaveForm, end: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Reason</label>
                  <textarea 
                    rows={3} 
                    required
                    className="w-full bg-gray-50 dark:bg-neutral-700 border-none rounded-lg p-3 text-sm outline-none text-gray-900 dark:text-white"
                    placeholder="Reason for leave..."
                    value={leaveForm.reason}
                    onChange={e => setLeaveForm({...leaveForm, reason: e.target.value})}
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-3 rounded-xl text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
                  Submit Request
                </button>
              </form>
            </div>
            <div className="md:col-span-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Leave History</h3>
              <div className="overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-neutral-700/50 text-xs uppercase font-bold text-gray-500">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Dates</th>
                      <th className="px-4 py-3">Reason</th>
                      <th className="px-4 py-3 rounded-r-lg text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                    {leaves.map(leave => (
                      <tr key={leave.id}>
                        <td className="px-4 py-3 font-medium">{leave.dates}</td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{leave.reason}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                            leave.status === 'Approved' ? 'bg-green-100 text-green-700' :
                            leave.status === 'Denied' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {leave.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
              <div className="text-right text-xs text-gray-500">{variant === 'receptionist' ? 'Reception team' : 'Service staff'}</div>
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
                    placeholder="Your name"
                  />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="text-gray-600 dark:text-gray-300 font-semibold">Email</span>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-neutral-700 pl-9 p-3 rounded-lg border border-transparent focus:border-black dark:focus:border-white outline-none text-gray-900 dark:text-white"
                      placeholder="email@naturals.in"
                      required
                    />
                  </div>
                </label>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <label className="space-y-1 text-sm">
                  <span className="text-gray-600 dark:text-gray-300 font-semibold">Phone</span>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full bg-gray-50 dark:bg-neutral-700 pl-9 p-3 rounded-lg border border-transparent focus:border-black dark:focus:border-white outline-none text-gray-900 dark:text-white"
                      placeholder="Phone number"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500">First 6 digits set the default password for new staff.</p>
                </label>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-semibold shadow-sm hover:opacity-90 disabled:opacity-60"
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
              <div className="p-3 rounded-full bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-200"><Lock className="w-5 h-5" /></div>
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
              <label className="space-y-1 text-sm w-full">
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
              <div className="flex items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-semibold shadow-sm hover:opacity-90 disabled:opacity-60"
                >
                  <Save className="w-4 h-4" /> {savingPassword ? 'Updating...' : 'Update password'}
                </button>
              </div>
            </form>
            <p className="text-[11px] text-gray-500">Use a strong password that is not shared. Receptionist and staff accounts are scoped to their roles.</p>
          </div>
        );

      case 'payroll':
        return (
          <div className="space-y-6">
             <div className="text-center py-10 text-gray-400">Payroll data coming soon based on completed appointments.</div>
          </div>
        );

      default:
        return <div className="text-center py-20 bg-white dark:bg-neutral-800 rounded-xl"><p>Module coming soon.</p></div>;
    }
  };

  return (
    <DashboardLayout
      {...props}
      sidebarNavItems={sidebarNavItems}
      activeModule={activeModule}
      setActiveModule={setActiveModule}
      pageTitle={variant === 'receptionist' ? 'Receptionist Portal' : 'Staff / Service Portal'}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default StaffDashboard;