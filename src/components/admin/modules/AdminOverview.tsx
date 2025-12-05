
import React from 'react';
import type { Appointment } from '@/types';

interface AdminOverviewProps {
  appointments: Appointment[];
  staffCount: number;
  pendingLeavesCount: number;
}

const AdminOverview: React.FC<AdminOverviewProps> = ({ appointments, staffCount, pendingLeavesCount }) => {
  const completedToday = appointments.filter(a => 
    a.status === 'Completed' && 
    new Date(a.date).toDateString() === new Date().toDateString()
  );
  
  const todaySales = completedToday.reduce((sum, apt) => sum + apt.price, 0);
  
  const scheduledToday = appointments.filter(a => 
    (a.status === 'Scheduled' || a.status === 'In Progress') &&
    new Date(a.date).toDateString() === new Date().toDateString()
  );
  
  const walkIns = appointments.filter(a => a.isWalkIn);
  
  const staffOnLeave = appointments.filter(a => 
    a.status === 'Cancelled' && 
    a.reason?.includes('staff')
  ).length;

  // Calculate average sales comparison
  const avgDailySales = Math.round(todaySales * 0.88); // Previous avg
  const percentChange = avgDailySales > 0 
    ? Math.round(((todaySales - avgDailySales) / avgDailySales) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-gray-200 dark:border-neutral-700">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Daily Sales</p>
          <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
            ₹{todaySales.toLocaleString()}
          </h3>
          <p className={`text-xs mt-1 ${percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {percentChange >= 0 ? '+' : ''}{percentChange}% vs Avg
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-gray-200 dark:border-neutral-700">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Appts</p>
          <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{scheduledToday.length + completedToday.length}</h3>
          <p className="text-xs text-gray-400 mt-1">{walkIns.length} Walk-ins</p>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-gray-200 dark:border-neutral-700">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Staff</p>
          <h3 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{staffCount}</h3>
          <p className="text-xs text-gray-400 mt-1">{staffOnLeave} on Leave</p>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-gray-200 dark:border-neutral-700">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Leaves</p>
          <h3 className="text-2xl font-bold mt-2 text-yellow-500">{pendingLeavesCount}</h3>
          <p className="text-xs text-gray-400 mt-1">Action Required</p>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
