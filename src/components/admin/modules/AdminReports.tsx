
import React from 'react';
import { TrendingUp, Users, DollarSign, Calendar, Download, BarChart3, PieChart, Filter } from 'lucide-react';
import { useData } from '@/store';

const AdminReports: React.FC = () => {
   const { appointments = [], staff = [] } = useData() || {};

  // Calculate real metrics from data
  const completedAppointments = appointments.filter(a => a.status === 'Completed');
  const totalRevenue = completedAppointments.reduce((sum, a) => sum + a.price, 0);
  const avgOrderValue = completedAppointments.length > 0 ? Math.round(totalRevenue / completedAppointments.length) : 0;

  // Top performer
   const staffPerformance = staff
      .map(member => ({
         ...member,
         appointmentCount: appointments.filter(a => a.staffId === member.id && a.status === 'Completed').length,
      }))
      .sort((a, b) => b.appointmentCount - a.appointmentCount);
   const topPerformer = staffPerformance[0];
   const topPerformerInitial = topPerformer?.name ? topPerformer.name.charAt(0) : '—';

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
       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-1">
          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-gray-500 font-semibold">Analytics & Reports</p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Performance snapshot (single location)</h2>
          </div>
          <div className="flex gap-2">
             <button className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-200">
               <Filter className="w-4 h-4" /> Last 7 days
             </button>
             <button className="inline-flex items-center gap-2 px-3 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-xs font-semibold shadow-sm">
               <Download className="w-4 h-4" /> Export CSV
             </button>
          </div>
       </div>

       {/* Metrics Cards */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-neutral-800 p-5 rounded-2xl border border-gray-200 dark:border-neutral-700">
             <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Revenue</p>
             <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"><DollarSign className="w-4 h-4" /></div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">₹{totalRevenue.toLocaleString()}</h3>
             </div>
             <p className="text-[10px] text-gray-400 mt-3">{completedAppointments.length} completed appointments</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 p-5 rounded-2xl border border-gray-200 dark:border-neutral-700">
             <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Avg. Order Value</p>
             <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200"><TrendingUp className="w-4 h-4" /></div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">₹{avgOrderValue.toLocaleString()}</h3>
             </div>
             <p className="text-[10px] text-gray-400 mt-3">Single-location average basket size</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 p-5 rounded-2xl border border-gray-200 dark:border-neutral-700">
             <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Completion Rate</p>
             <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200"><BarChart3 className="w-4 h-4" /></div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{appointments.length ? Math.round((completedAppointments.length / appointments.length) * 100) : 0}%</h3>
             </div>
             <p className="text-[10px] text-gray-400 mt-3">Completed vs total bookings</p>
          </div>
          <div className="bg-white dark:bg-neutral-800 p-5 rounded-2xl border border-gray-200 dark:border-neutral-700">
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Top Performer</p>
                   {topPerformer ? (
                      <div className="flex items-center gap-3 mt-1">
                           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">
                              {topPerformerInitial}
                           </div>
                           <div>
                               <h4 className="font-bold text-gray-900 dark:text-white">{topPerformer.name || '—'}</h4>
                               <p className="text-[11px] text-gray-500">{topPerformer.appointmentCount ?? 0} appts</p>
                           </div>
                      </div>
                   ) : (
                      <p className="text-sm text-gray-500 mt-2">No data yet</p>
                   )}
          </div>
       </div>

       {/* Weekly Revenue Chart (CSS Only) */}
       <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-gray-200 dark:border-neutral-700">
          <div className="flex justify-between items-center mb-6">
             <div>
               <h3 className="font-bold text-lg text-gray-900 dark:text-white">Weekly Revenue</h3>
               <p className="text-xs text-gray-500">Past 7 days | hover for amounts</p>
             </div>
             <div className="flex gap-2">
                <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500"><div className="w-2 h-2 rounded-full bg-black dark:bg-white"></div> Current</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400"><div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-neutral-600"></div> Baseline</span>
             </div>
          </div>
          
          <div className="h-48 flex items-end justify-between gap-2 md:gap-4 px-2">
             {revenuePercentages.map((height, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1 group cursor-pointer">
                   <div className="relative w-full max-w-[44px] flex items-end h-40 bg-gray-50 dark:bg-neutral-900 rounded-t-lg overflow-hidden">
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

       {/* Reports list */}
       <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6">
         <div className="flex items-center justify-between mb-4">
           <h3 className="font-bold text-lg text-gray-900 dark:text-white">Reports & Exports</h3>
           <div className="flex gap-2 text-[11px] text-gray-500 items-center"><PieChart className="w-4 h-4" /> PDF & CSV available</div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[{title:'Daily Financial Report',desc:'Revenue, payments, refunds'}, {title:'Monthly Performance',desc:'Trendlines and KPIs'}, {title:'Staff Performance',desc:'Completed services by staff'}].map(report => (
               <div key={report.title} className="border border-gray-200 dark:border-neutral-700 p-5 rounded-xl flex flex-col gap-3 hover:bg-gray-50 dark:hover:bg-neutral-700/30 transition-colors">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{report.title}</h4>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{report.desc}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-black dark:bg-white text-white dark:text-black text-xs font-semibold py-2 rounded-lg hover:opacity-90">Download PDF</button>
                    <button className="px-3 py-2 text-xs font-semibold border border-gray-200 dark:border-neutral-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700">CSV</button>
                  </div>
               </div>
            ))}
         </div>
       </div>
    </div>
  );
};

export default AdminReports;
