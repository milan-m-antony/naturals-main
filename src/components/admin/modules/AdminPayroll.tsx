
import React, { useState } from 'react';
import { DollarSign, Download, Search } from 'lucide-react';
import { useData } from '@/store';

const AdminPayroll: React.FC = () => {
  const { staff, appointments } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate payroll data
  const payrollData = staff.map(member => {
    const memberAppointments = appointments.filter(a => a.staffId === member.id && a.status === 'Completed');
    const totalRevenue = memberAppointments.reduce((sum, a) => sum + a.price, 0);
    const completedCount = memberAppointments.length;
    const baseSalary = 15000; // Mock base
    const commissionRate = 0.10; // 10%
    const commission = totalRevenue * commissionRate;
    const totalPayout = baseSalary + commission;

    return {
      ...member,
      completedCount,
      totalRevenue,
      baseSalary,
      commission,
      totalPayout
    };
  });

  const filteredStaff = payrollData.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Payroll Management</h3>
          <div className="flex gap-2 w-full md:w-auto">
             <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search staff..." 
                  className="pl-9 pr-4 py-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm outline-none w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <button className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider">
                <Download className="w-3 h-3" /> Export
             </button>
          </div>
       </div>

       <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-neutral-700/50 text-gray-500 font-bold uppercase text-xs">
                   <tr>
                      <th className="px-6 py-4">Staff Member</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4 text-center">Appts</th>
                      <th className="px-6 py-4 text-right">Revenue</th>
                      <th className="px-6 py-4 text-right">Commission (10%)</th>
                      <th className="px-6 py-4 text-right">Total Payout</th>
                      <th className="px-6 py-4 text-center">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                   {filteredStaff.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-neutral-700/30 transition-colors">
                         <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                            <div className="flex items-center gap-3">
                               <img src={member.image} alt="" className="w-8 h-8 rounded-full object-cover" />
                               {member.name}
                            </div>
                         </td>
                         <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{member.role}</td>
                         <td className="px-6 py-4 text-center font-medium">{member.completedCount}</td>
                         <td className="px-6 py-4 text-right font-mono text-gray-600 dark:text-gray-300">₹{member.totalRevenue.toLocaleString()}</td>
                         <td className="px-6 py-4 text-right font-mono text-green-600 dark:text-green-400">+₹{member.commission.toLocaleString()}</td>
                         <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white text-base">₹{member.totalPayout.toLocaleString()}</td>
                         <td className="px-6 py-4 text-center">
                            <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded text-[10px] font-bold uppercase">Paid</span>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};

export default AdminPayroll;
