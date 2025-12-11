
import React, { useState, useEffect } from 'react';
import { Calendar, Users, FileText, Printer, Box, TrendingUp, Image, Megaphone, Ticket } from 'lucide-react';
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
import AdminMedia from './modules/AdminMedia';
import OwnerBanners from './modules/OwnerBanners';
import OwnerCoupons from './modules/OwnerCoupons'; 

interface DashboardCommonProps {
  user: { role: string };
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const AdminDashboard: React.FC<DashboardCommonProps> = (props) => {
  const {
    appointments,
    staff,
    leaveRequests,
    branches,
    getAppointmentsByBranch,
    updateAppointmentStatus,
    refreshAppointments,
    refreshInventory,
    refreshStaff,
    refreshLeaveRequests,
    uploadStaffAvatar,
    updateLeaveRequestStatus,
    addStaff,
    updateStaff,
  } = useData();
  const [activeModule, setActiveModule] = useState('overview');

  // Load latest data for admin modules
  useEffect(() => {
    refreshAppointments().catch(() => {});
    refreshInventory().catch(() => {});
    refreshStaff().catch(() => {});
    refreshLeaveRequests().catch(() => {});
  }, [refreshAppointments, refreshInventory, refreshLeaveRequests, refreshStaff]);

  // Let's assume branch 1 is the admin's branch
  const branchAppointments = getAppointmentsByBranch(1);
  
  // Staff and leave data will be managed here for child components
  const [staffList, setStaffList] = useState(staff);
  const [dashboardLeaves, setDashboardLeaves] = useState(leaveRequests);

  useEffect(() => {
    setStaffList(staff);
  }, [staff]);

  useEffect(() => {
    setDashboardLeaves(leaveRequests);
  }, [leaveRequests]);
  
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
    { id: 'coupons', label: 'Coupons', icon: Ticket },
    { id: 'banners', label: 'Banners', icon: Megaphone },
    { id: 'media', label: 'Media Library', icon: Image },
  ];

  const renderContent = () => {
    switch (activeModule) {
      case 'overview':
        return (
          <AdminOverview
            appointments={branchAppointments}
            staffCount={staffList.length}
            pendingLeavesCount={dashboardLeaves.filter((r) => r.status.toLowerCase() === 'pending').length}
          />
        );
      case 'appointments':
        return <AdminAppointments appointments={branchAppointments} staffList={staffList} updateAppointmentStatus={updateAppointmentStatus} getStaffName={getStaffName} />;
      case 'staff':
        return (
          <AdminStaff
            staffList={staffList}
            setStaffList={setStaffList}
            leaveRequests={dashboardLeaves}
            setLeaveRequests={setDashboardLeaves}
            onUpdateLeaveStatus={updateLeaveRequestStatus}
            onRefreshLeaves={refreshLeaveRequests}
            onUploadAvatar={uploadStaffAvatar}
            onAddStaff={addStaff}
            onUpdateStaff={updateStaff}
            branches={branches}
          />
        );
      case 'inventory':
        return <AdminInventory />;
      case 'payroll':
        return <AdminPayroll />;
      case 'pos':
        return <AdminPOS />;
      case 'reports':
        return <AdminReports />;
      case 'coupons':
        return <OwnerCoupons />;
      case 'banners':
        return <OwnerBanners />;
      case 'media':
        return <AdminMedia />;
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
      pageTitle="Branch Manager"
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default AdminDashboard;
