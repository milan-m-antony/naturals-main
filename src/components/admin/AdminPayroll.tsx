
import React from 'react';

const AdminPayroll: React.FC = () => {
  return (
    <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6">
       <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Branch Payroll Summary</h3>
          <div className="flex gap-2">
             <select className="bg-gray-50 dark:bg-neutral-700 p-2 rounded-lg text-xs font-bold border-none text-gray-900 dark:text-white"><option>All Staff</option></select>
             <input type="month" className="bg-gray-50 dark:bg-neutral-700 p-2 rounded-lg text-xs font-bold border-none text-gray-900 dark:text-white" />
          </div>
       </div>
       <div className="text-center py-10 text-gray-400">Payroll calculation based on appointments will appear here.</div>
    </div>
  );
};

export default AdminPayroll;
