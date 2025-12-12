
import React, { useState } from 'react';
import { TrendingUp, FileText, Settings, Users, Calendar, Sparkles, Box, Image, Megaphone, Ticket, Layout, Grid, Layers, Zap, Clock } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { useData } from '@/store';

// Re-importing child components that are shared or could be adapted
import AdminOverview from './modules/AdminOverview';
import AdminAppointments from './modules/AdminAppointments';
import AdminStaff from './modules/AdminStaff';
import AdminInventory from './modules/AdminInventory';
import AdminReports from './modules/AdminReports';
import OwnerServices from './modules/OwnerServices'; // New Module
import OwnerSettings from './modules/OwnerSettings'; // New Module
import AdminMedia from './modules/AdminMedia'; // Media Management
import OwnerBanners from './modules/OwnerBanners'; // Banner Management
import OwnerCoupons from './modules/OwnerCoupons'; // Coupon Management
import OwnerCategories from './modules/OwnerCategories'; // Category Management
import OwnerHero from './modules/OwnerHero'; // Hero Slides Management
import OwnerCuratedServices from './modules/OwnerCuratedServices'; // Curated Services Management
import AdminFeatures from './modules/AdminFeatures'; // Features Management
import AdminRescheduleRequests from './modules/AdminRescheduleRequests'; // Reschedule Requests Management
import OwnerAnnouncements from './modules/OwnerAnnouncements'; // Announcements Management

interface DashboardCommonProps {
  user: { role: string };
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const OwnerDashboard: React.FC<DashboardCommonProps> = (props) => {
  const { 
    appointments, 
    staff, 
    branches,
    leaveRequests: dataLeaveRequests,
    getAppointmentsByBranch, 
    updateAppointmentStatus,
    updateLeaveRequestStatus,
    uploadStaffAvatar,
    addStaff,
    updateStaff,
    deleteStaff,
    toggleStaffAvailability,
    refreshLeaveRequests
  } = useData();
  const [activeModule, setActiveModule] = useState('overview');

  const branchAppointments = getAppointmentsByBranch(1);
  const [staffList, setStaffList] = useState(staff);
  const [leaveRequests, setLeaveRequests] = useState(dataLeaveRequests);

  // Sync with context data
  React.useEffect(() => {
    setStaffList(staff);
  }, [staff]);

  React.useEffect(() => {
    setLeaveRequests(dataLeaveRequests);
  }, [dataLeaveRequests]);
  
  const getStaffName = (id: number) => staff.find(s => s.id === id)?.name || 'Unassigned';

  const sidebarNavItems = [
    { id: 'overview', label: 'Business Overview', icon: TrendingUp },
    { id: 'appointments', label: 'Master Calendar', icon: Calendar },
    { id: 'staff', label: 'Staff Management', icon: Users },
    { id: 'inventory', label: 'Inventory', icon: Box },
    { id: 'reports', label: 'Analytics & Reports', icon: FileText },
    { id: 'reschedules', label: 'Reschedule Requests', icon: Clock },
    
    // Service Management - Top Level
    { id: 'services', label: 'Service Menu', icon: Sparkles },
    { id: 'categories', label: 'Service Categories', icon: Grid },
    
    // Content Management
    { 
      id: 'content', 
      label: 'Content Management', 
      icon: Layers,
      submenu: [
        { id: 'hero', label: 'Hero Carousel', icon: Layout },
        { id: 'curated', label: 'Curated Services', icon: Sparkles },
        { id: 'features', label: 'Website Features', icon: Zap },
        { id: 'announcements', label: 'Announcements', icon: Clock },
        { id: 'coupons', label: 'Discount Coupons', icon: Ticket },
        { id: 'banners', label: 'Promotional Banners', icon: Megaphone },
        { id: 'media', label: 'Media Library', icon: Image },
      ]
    },
    { id: 'settings', label: 'Shop Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeModule) {
      case 'overview':
        return <AdminOverview appointments={branchAppointments} staffCount={staffList.length} pendingLeavesCount={leaveRequests.filter(r => r.status === 'Pending').length} />;
      case 'appointments':
        return <AdminAppointments appointments={branchAppointments} staffList={staffList} updateAppointmentStatus={updateAppointmentStatus} getStaffName={getStaffName} />;
      case 'staff':
        return (
          <AdminStaff 
            staffList={staffList} 
            setStaffList={setStaffList} 
            leaveRequests={leaveRequests} 
            setLeaveRequests={setLeaveRequests}
            onUpdateLeaveStatus={updateLeaveRequestStatus}
            onRefreshLeaves={refreshLeaveRequests}
            onUploadAvatar={uploadStaffAvatar}
            onAddStaff={addStaff}
            onUpdateStaff={updateStaff}
            onDeleteStaff={deleteStaff}
            onToggleAvailability={toggleStaffAvailability}
            branches={branches}
          />
        );
      case 'inventory':
        return <AdminInventory />;
      case 'reports':
        return <AdminReports />;
      case 'services':
         return <OwnerServices />;
      case 'reschedules':
        return <AdminRescheduleRequests />;
      case 'categories':
        return <OwnerCategories />;
      case 'hero':
        return <OwnerHero />;
      case 'curated':
        return <OwnerCuratedServices />;
      case 'features':
        return <AdminFeatures />;
      case 'announcements':
        return <OwnerAnnouncements />;
      case 'coupons':
        return <OwnerCoupons />;
      case 'banners':
        return <OwnerBanners />;
      case 'media':
        return <AdminMedia />;
      case 'settings':
        return <OwnerSettings />;
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
      pageTitle="Owner Dashboard"
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default OwnerDashboard;
