
import React, { useState, useEffect } from 'react';
import { Calendar, Users, FileText, Printer, Box, TrendingUp } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { useData } from '@/store';

// Import refactored components
import AdminOverview from './modules/AdminOverview';
import AdminAppointments from './modules/AdminAppointments';
import AdminStaff from './modules/AdminStaff';
import AdminPayroll from './modules/AdminPayroll';
import AdminPOS from './modules/AdminPOS';
import AdminReports from './modules/AdminReports';
import AdminInventory from './modules/AdminInventory'; 

interface DashboardCommonProps {
  user: { role: string };
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const AdminDashboard: React.FC<DashboardCommonProps> = (props) => {
  const { appointments, staff, getAppointmentsByBranch, updateAppointmentStatus, refreshAppointments, refreshInventory } = useData();
  const [activeModule, setActiveModule] = useState('overview');

  // Load latest data for admin modules
  useEffect(() => {
    refreshAppointments().catch(() => {});
    refreshInventory().catch(() => {});
  }, [refreshAppointments, refreshInventory]);

  // Let's assume branch 1 is the admin's branch
  const branchAppointments = getAppointmentsByBranch(1);
  
  // Staff and leave data will be managed here for child components
  const [staffList, setStaffList] = useState(staff);
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, name: 'Priya Sharma', dates: 'Jan 10 - Jan 12', reason: 'Family Event', status: 'Pending' },
    { id: 2, name: 'Robert Fox', dates: 'Feb 05', reason: 'Sick Leave', status: 'Approved' }
  ]);
  
  const getStaffName = (id: number) => {
      const staffMember = staff.find(s => s.id === id);
      return staffMember ? staffMember.name : 'Unassigned';
  };

  const sidebarNavItems = [
    { id: 'overview', label: 'Dashboard', icon: TrendingUp },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'staff', label: 'Staff & Leaves', icon: Users },
    { id: 'inventory', label: 'Inventory', icon: Box }, 
    { id: 'pos', label: 'Point of Sale', icon: Printer },
    { id: 'payroll', label: 'Payroll', icon: FileText },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  const renderContent = () => {
    switch (activeModule) {
      case 'overview':
        return <AdminOverview appointments={branchAppointments} staffCount={staffList.length} pendingLeavesCount={leaveRequests.filter(r => r.status === 'Pending').length} />;
      case 'appointments':
        return <AdminAppointments appointments={branchAppointments} staffList={staffList} updateAppointmentStatus={updateAppointmentStatus} getStaffName={getStaffName} />;
      case 'staff':
        return <AdminStaff staffList={staffList} setStaffList={setStaffList} leaveRequests={leaveRequests} setLeaveRequests={setLeaveRequests} />;
      case 'inventory':
        return <AdminInventory />;
      case 'payroll':
        return <AdminPayroll />;
      case 'pos':
        return <AdminPOS />;
      case 'reports':
        return <AdminReports />;
      default:
        return <div>Module coming soon.</div>;
    }
  };

  return (
    <DashboardLayout 
      {...props} 
      sidebarNavItems={sidebarNavItems}
      activeModule={activeModule}
      setActiveModule={setActiveModule}
      pageTitle="Branch Admin"
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default AdminDashboard;
