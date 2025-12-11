import React from 'react';
import AdminDashboard from './AdminDashboard';
import StaffDashboard from './StaffDashboard';
import OwnerDashboard from './OwnerDashboard';
import ReceptionistDashboard from './ReceptionistDashboard';
import { useData } from '@/store';

interface AdminUser {
  role: 'owner' | 'manager' | 'staff';
  id?: number;
  name?: string;
  email?: string;
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
    case 'manager':
      return (
        <AdminDashboard 
          {...commonProps}
        />
      );
    case 'staff': {
      const matchedStaff = staff.find((member) => {
        if (!user.email || !member.email) return false;
        return member.email.toLowerCase() === user.email.toLowerCase();
      }) || staff.find((member) => member.id === user.id) || staff[0];

      if (!matchedStaff) {
        return <div className="p-8 text-center">Loading staff data...</div>;
      }

      const roleLabel = (matchedStaff.role || '').toLowerCase();
      const isReceptionist = roleLabel.includes('reception');

      if (isReceptionist) {
        return <ReceptionistDashboard {...commonProps} staffMember={matchedStaff} />;
      }
      return <StaffDashboard {...commonProps} staffMember={matchedStaff} />;
    }
    default:
      return <div>Invalid user role.</div>;
  }
};

export default Dashboard;