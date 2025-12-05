
import React from 'react';
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import { useData } from '@/store';

const AdminReports: React.FC = () => {
  const { appointments, staff } = useData();

  // Calculate real metrics from data
  const completedAppointments = appointments.filter(a => a.status === 'Completed');
  const totalRevenue = completedAppointments.reduce((sum, a) => sum + a.price, 0);
  const avgOrderValue = completedAppointments.length > 0 ? Math.round(totalRevenue / completedAppointments.length) : 0;

  // Top performer
  const staffPerformance = staff.map(member => ({
    ...member,
    appointmentCount: appointments.filter(a => a.staffId === member.id && a.status === 'Completed').length
  })).sort((a, b) => b.appointmentCount - a.appointmentCount);
  const topPerformer = staffPerformance[0];

  // Weekly revenue data (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const revenueData = last7Days.map(date => {
    const dayAppointments = completedAppointments.filter(a => a.date === date);
    const dayRevenue = dayAppointments.reduce((sum, a) => sum + a.price, 0);
    return dayRevenue;
  });

  const maxRevenue = Math.max(...revenueData, 1);
  const revenuePercentages = revenueData.map(rev => (rev / maxRevenue) * 100);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Business Analytics</h2>
          <div className="flex gap-2">
             <input type="date" className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-xs font-bold outline-none dark:text-white" />
          </div>
       </div>

       {/* Metrics Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-gray-200 dark:border-neutral-700">
             <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Revenue</p>
             <div className="flex items-end gap-2">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">₹{totalRevenue.toLocaleString()}</h3>
             </div>
             <p className="text-[10px] text-gray-400 mt-4">From {completedAppointments.length} completed appointments</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-gray-200 dark:border-neutral-700">
             <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Avg. Order Value</p>
             <div className="flex items-end gap-2">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">₹{avgOrderValue.toLocaleString()}</h3>
             </div>
             <p className="text-[10px] text-gray-400 mt-4">Based on all completed appointments</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-gray-200 dark:border-neutral-700">
             <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Top Performer</p>
             {topPerformer ? (
               <div className="flex items-center gap-4 mt-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {topPerformer.name.charAt(0)}
                  </div>
                  <div>
                     <h4 className="font-bold text-gray-900 dark:text-white">{topPerformer.name}</h4>
                     <p className="text-xs text-gray-500">{topPerformer.appointmentCount} Appointments</p>
                  </div>
               </div>
             ) : (
               <p className="text-sm text-gray-500 mt-2">No data available</p>
             )}
          </div>
       </div>

       {/* Weekly Revenue Chart (CSS Only) */}
       <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-center mb-8">
             <h3 className="font-bold text-lg text-gray-900 dark:text-white">Weekly Revenue</h3>
             <div className="flex gap-2">
                <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500"><div className="w-2 h-2 rounded-full bg-black dark:bg-white"></div> Current Week</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400"><div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-neutral-600"></div> Last Week</span>
             </div>
          </div>
          
          <div className="h-48 flex items-end justify-between gap-2 md:gap-4 px-2">
             {revenuePercentages.map((height, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1 group cursor-pointer">
                   <div className="relative w-full max-w-[40px] flex items-end h-40 bg-gray-50 dark:bg-neutral-900 rounded-t-lg overflow-hidden">
                      {/* Bar */}
                      <div 
                        className="w-full bg-black dark:bg-white group-hover:opacity-80 transition-all duration-500 ease-out" 
                        style={{ height: `${height || 5}%` }}
                      ></div>
                      {/* Tooltip */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                         ₹{revenueData[idx].toLocaleString()}
                      </div>
                   </div>
                   <span className="text-[10px] font-bold text-gray-400 mt-2 uppercase">{days[idx]}</span>
                </div>
             ))}
          </div>
       </div>

       {/* Download Reports Grid (Existing) */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Daily Financial Report', 'Monthly Branch Report', 'Staff Performance Chart'].map(report => (
             <div key={report} className="border border-gray-200 dark:border-neutral-700 p-6 rounded-xl flex flex-col items-center text-center hover:bg-gray-50 dark:hover:bg-neutral-700/30 transition-colors cursor-pointer group bg-white dark:bg-neutral-800">
                <div className="bg-gray-100 dark:bg-neutral-700 p-3 rounded-full mb-3 text-gray-600 dark:text-gray-300">
                   <Calendar className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm mb-4 text-gray-900 dark:text-white">{report}</h4>
                <button className="bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 text-gray-800 dark:text-gray-200 text-xs font-bold py-2 px-4 rounded-lg transition-colors">Download PDF</button>
             </div>
          ))}
       </div>
    </div>
  );
};

export default AdminReports;
