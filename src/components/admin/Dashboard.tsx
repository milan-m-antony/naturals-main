import React from 'react';
import AdminDashboard from './AdminDashboard';
import StaffDashboard from './StaffDashboard';
import OwnerDashboard from './OwnerDashboard';
import { useData } from '@/store';

interface AdminUser {
  role: 'owner' | 'admin' | 'staff';
}

interface DashboardProps {
  user: AdminUser | null;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, isDarkMode, toggleTheme }) => {
  const { staff } = useData();

  if (!user) {
    return <div>Error: No user role found.</div>;
  }
  
  const commonProps = {
    user,
    onLogout,
    isDarkMode,
    toggleTheme,
  };

  switch (user.role) {
    case 'owner':
      return <OwnerDashboard {...commonProps} />;
    case 'admin':
      return (
        <AdminDashboard 
          {...commonProps}
        />
      );
    case 'staff':
      // For demo, we assume the logged-in staff is the 4th one (Priya) or just the first found
      const currentStaff = staff.find(s => s.id === 4) || staff[0];
      return <StaffDashboard {...commonProps} staffMember={currentStaff} />;
    default:
      return <div>Invalid user role.</div>;
  }
};

export default Dashboard;