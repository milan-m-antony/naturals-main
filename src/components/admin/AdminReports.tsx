
import React from 'react';

const AdminReports: React.FC = () => {
  return (
    <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6">
       <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">Download Reports</h3>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Daily Financial Report', 'Monthly Branch Report', 'Staff Performance Chart'].map(report => (
             <div key={report} className="border border-gray-200 dark:border-neutral-700 p-6 rounded-xl flex flex-col items-center text-center hover:bg-gray-50 dark:hover:bg-neutral-700/30 transition-colors cursor-pointer group">
                <h4 className="font-bold text-sm mb-4 text-gray-900 dark:text-white">{report}</h4>
                <button className="bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 text-gray-800 dark:text-gray-200 text-xs font-bold py-2 px-4 rounded-lg transition-colors">Download PDF</button>
             </div>
          ))}
       </div>
    </div>
  );
};

export default AdminReports;
