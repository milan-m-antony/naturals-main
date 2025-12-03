
import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useData } from '@/store';
import type { Appointment } from '@/types';

interface AdminAppointmentsProps {
  appointments: Appointment[];
  staffList: any[];
  updateAppointmentStatus: (id: number, status: Appointment['status']) => void;
  getStaffName: (id: number) => string;
}

const AdminAppointments: React.FC<AdminAppointmentsProps> = ({ appointments, staffList, updateAppointmentStatus, getStaffName }) => {
  const [reassignId, setReassignId] = useState<number | null>(null);
  const [rescheduleId, setRescheduleId] = useState<number | null>(null);
  const [newDate, setNewDate] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('');
  const [toast, setToast] = useState<{type: 'success'|'error'; msg: string} | null>(null);
  const [filterDate, setFilterDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const { refreshAppointments, updateAppointment, branches, isStaffAvailable } = useData();

  const showToast = (type: 'success'|'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 2500);
  };

  // Filter and paginate
  const filteredAppointments = filterDate
    ? appointments.filter(apt => apt.date === filterDate)
    : appointments;
  
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
         <h3 className="font-bold text-lg text-gray-900 dark:text-white">Master Calendar</h3>
         <div className="flex gap-2">
            <input 
              type="date" 
              value={filterDate}
              onChange={(e) => { setFilterDate(e.target.value); setCurrentPage(1); }}
              placeholder="Filter by date"
              className="bg-gray-50 dark:bg-neutral-700 p-2 rounded-lg text-xs font-bold border-none dark:text-white" 
            />
            {filterDate && (
              <button 
                onClick={() => { setFilterDate(''); setCurrentPage(1); }}
                className="text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white px-2"
              >Clear</button>
            )}
         </div>
      </div>
      {toast && (
        <div className={`mb-4 flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${toast.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4"/> : <XCircle className="w-4 h-4"/>}
          {toast.msg}
        </div>
      )}
      <div className="space-y-4">
        {paginatedAppointments.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No appointments found</p>
        ) : (
          paginatedAppointments.map(apt => (
          <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-gray-100 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700/50 rounded-xl transition-colors">
            <div className="text-center w-full sm:w-20 bg-gray-50 dark:bg-neutral-700/50 rounded-lg p-2 sm:p-0">
              <p className="font-bold text-lg text-gray-900 dark:text-white">{apt.time.split(' ')[0]}</p>
              <p className="text-xs text-gray-400 uppercase">{apt.time.split(' ')[1]}</p>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                 <div>
                    <p className="font-bold text-base text-gray-900 dark:text-white">{apt.customer}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{apt.service}</p>
                    <p className="text-xs text-gray-400 mt-1">{apt.date}</p>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="relative">
                       {reassignId === apt.id ? (
                         <select 
                           className="bg-white dark:bg-neutral-700 border rounded px-2 py-1 text-xs text-black dark:text-white" 
                            onChange={async (e) => {
                              const newStaffId = Number(e.target.value);
                              try {
                                await updateAppointment(apt.id, { staffId: newStaffId });
                                await refreshAppointments();
                                setReassignId(null);
                                showToast('success', 'Staff reassigned');
                              } catch {
                                showToast('error', 'Failed to reassign staff');
                              }
                            }}
                           onBlur={() => setReassignId(null)}
                           autoFocus
                         >
                           {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                         </select>
                       ) : (
                         <button 
                           onClick={() => setReassignId(apt.id)}
                           className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-neutral-600 px-2 py-1 rounded transition-colors"
                         >
                           <img src={`https://i.pravatar.cc/150?u=${apt.staffId}`} className="w-6 h-6 rounded-full border border-white" alt="" />
                           <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{getStaffName(apt.staffId)}</span>
                         </button>
                       )}
                    </div>
                 </div>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
              <span className={`px-3 py-1 text-[10px] rounded-full font-bold uppercase tracking-wider ${
                apt.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                apt.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 
                apt.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
              }`}>{apt.status}</span>
              <div className="flex gap-2">
                 <button 
                   onClick={() => setRescheduleId(apt.id)}
                   className="text-xs font-bold text-gray-400 hover:text-black dark:hover:text-white border-b border-gray-300 hover:border-black dark:border-gray-600 dark:hover:border-white">Reschedule</button>
                 <button 
                   onClick={async () => {
                     await updateAppointmentStatus(apt.id, 'Cancelled');
                     await refreshAppointments();
                     showToast('success', 'Appointment cancelled');
                   }} 
                   className="text-xs font-bold text-red-400 hover:text-red-600 border-b border-red-200 hover:border-red-500"
                 >Cancel</button>
              </div>
            </div>
            {rescheduleId === apt.id && (
              <div className="mt-3 flex items-center gap-2">
                <input 
                  type="date" 
                  value={newDate} 
                  onChange={e => setNewDate(e.target.value)} 
                  className="bg-gray-50 dark:bg-neutral-700 p-2 rounded-lg text-xs font-bold border-none dark:text-white"
                />
                <input 
                  type="time" 
                  value={newTime} 
                  onChange={e => setNewTime(e.target.value)} 
                  className="bg-gray-50 dark:bg-neutral-700 p-2 rounded-lg text-xs font-bold border-none dark:text-white"
                />
                <button 
                  onClick={async () => {
                    try {
                      if (newDate && newTime && !isStaffAvailable(apt.staffId, newDate, newTime)) {
                        showToast('error', 'Staff unavailable at that time');
                        return;
                      }
                      await updateAppointment(apt.id, {
                        date: newDate || apt.date,
                        time: newTime || apt.time,
                        status: 'Scheduled',
                      } as Partial<Appointment>);
                      await refreshAppointments();
                      showToast('success', 'Appointment rescheduled');
                    } catch {
                      showToast('error', 'Failed to reschedule');
                    }
                    setRescheduleId(null);
                    setNewDate('');
                    setNewTime('');
                  }}
                  className="text-xs font-bold text-green-600 border-b border-green-300 hover:text-green-800 hover:border-green-600"
                >Confirm</button>
                <button 
                  onClick={() => { setRescheduleId(null); setNewDate(''); setNewTime(''); }}
                  className="text-xs font-bold text-gray-500 border-b border-gray-300 hover:text-black hover:border-black"
                >Cancel</button>
              </div>
            )}
          </div>
        ))
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-xs font-bold rounded bg-gray-100 dark:bg-neutral-700 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-neutral-600"
          >Prev</button>
          <span className="text-sm text-gray-600 dark:text-gray-400">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-xs font-bold rounded bg-gray-100 dark:bg-neutral-700 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-neutral-600"
          >Next</button>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;
