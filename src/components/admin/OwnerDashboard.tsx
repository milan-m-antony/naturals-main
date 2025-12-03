
import React, { useState } from 'react';
import { TrendingUp, FileText, Settings, Users, Calendar, Sparkles, Box } from 'lucide-react';
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

interface DashboardCommonProps {
  user: { role: string };
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const OwnerDashboard: React.FC<DashboardCommonProps> = (props) => {
  const { appointments, staff, getAppointmentsByBranch, updateAppointmentStatus } = useData();
  const [activeModule, setActiveModule] = useState('overview');

  const branchAppointments = getAppointmentsByBranch(1);
  const [staffList, setStaffList] = useState(staff);
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, name: 'Priya Sharma', dates: 'Jan 10 - Jan 12', reason: 'Family Event', status: 'Pending' },
    { id: 2, name: 'Robert Fox', dates: 'Feb 05', reason: 'Sick Leave', status: 'Approved' }
  ]);
  
  const getStaffName = (id: number) => staff.find(s => s.id === id)?.name || 'Unassigned';

  const sidebarNavItems = [
    { id: 'overview', label: 'Business Overview', icon: TrendingUp },
    { id: 'appointments', label: 'Master Calendar', icon: Calendar },
    { id: 'staff', label: 'Staff Management', icon: Users },
    { id: 'inventory', label: 'Inventory', icon: Box },
    { id: 'reports', label: 'Analytics & Reports', icon: FileText },
    { id: 'services', label: 'Service Menu', icon: Sparkles },
    { id: 'settings', label: 'Shop Settings', icon: Settings },
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
      case 'reports':
        return <AdminReports />;
      case 'services':
         return <OwnerServices />;
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
