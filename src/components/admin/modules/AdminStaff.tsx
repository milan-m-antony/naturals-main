
import React, { useState } from 'react';
import { Plus, CheckCircle, XCircle, X } from 'lucide-react';

interface StaffMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

interface LeaveRequest {
  id: number;
  name: string;
  dates: string;
  reason: string;
  status: string;
}

interface AdminStaffProps {
  staffList: StaffMember[];
  setStaffList: React.Dispatch<React.SetStateAction<StaffMember[]>>;
  leaveRequests: LeaveRequest[];
  setLeaveRequests: React.Dispatch<React.SetStateAction<LeaveRequest[]>>;
}

const AdminStaff: React.FC<AdminStaffProps> = ({ staffList, setStaffList, leaveRequests, setLeaveRequests }) => {
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', role: 'Senior Stylist' });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      id: Date.now(),
      name: newStaff.name,
      role: newStaff.role,
      image: `https://i.pravatar.cc/150?u=${Date.now()}`
    };
    setStaffList([...staffList, newItem]);
    setIsStaffModalOpen(false);
    setNewStaff({ name: '', email: '', role: 'Senior Stylist' });
  };

  const handleLeaveAction = (id: number, status: string) => {
    setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       {/* Staff List */}
       <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Branch Staff</h3>
            <button onClick={() => setIsStaffModalOpen(true)} className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:opacity-90">
               <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <div className="space-y-4 overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
            {staffList.map(member => (
              <div key={member.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-neutral-700/30 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-neutral-600 transition-colors">
                <img src={member.image} className="w-12 h-12 rounded-full object-cover" alt="" />
                <div className="flex-1">
                  <p className="font-bold text-sm text-gray-900 dark:text-white">{member.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                </div>
                <button className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40">Edit</button>
              </div>
            ))}
          </div>
       </div>

       {/* Leave Approval Queue */}
       <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Leave Approval Queue <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-2 align-middle">{leaveRequests.filter(r => r.status === 'Pending').length} Pending</span></h3>
          <div className="space-y-4">
             {leaveRequests.map(req => (
                <div key={req.id} className="p-4 border border-gray-100 dark:border-neutral-700 rounded-xl">
                   <div className="flex justify-between items-start mb-2">
                      <div>
                         <h4 className="font-bold text-sm text-gray-900 dark:text-white">{req.name}</h4>
                         <p className="text-xs text-gray-500 dark:text-gray-400">{req.dates}</p>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : req.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{req.status}</span>
                   </div>
                   <p className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-neutral-700/50 p-2 rounded mb-3">"{req.reason}"</p>
                   {req.status === 'Pending' && (
                      <div className="flex gap-2">
                         <button onClick={() => handleLeaveAction(req.id, 'Approved')} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-green-700 flex items-center justify-center gap-2 transition-colors"><CheckCircle className="w-3 h-3" /> Approve</button>
                         <button onClick={() => handleLeaveAction(req.id, 'Denied')} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-xs font-bold hover:bg-red-100 flex items-center justify-center gap-2 transition-colors"><XCircle className="w-3 h-3" /> Deny</button>
                      </div>
                   )}
                </div>
             ))}
          </div>
       </div>

       {/* Add Staff Modal */}
       {isStaffModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Add Staff (Branch Level)</h3>
              <button onClick={() => setIsStaffModalOpen(false)} className="text-gray-500 hover:text-black dark:hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form className="space-y-4" onSubmit={handleAddStaff}>
              <input 
                type="text" 
                placeholder="Full Name" 
                required
                value={newStaff.name}
                onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm border border-transparent focus:border-black outline-none text-gray-900 dark:text-white" 
              />
              <input 
                type="email" 
                placeholder="Email" 
                required
                value={newStaff.email}
                onChange={e => setNewStaff({...newStaff, email: e.target.value})}
                className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm border border-transparent focus:border-black outline-none text-gray-900 dark:text-white" 
              />
              <select 
                value={newStaff.role}
                onChange={e => setNewStaff({...newStaff, role: e.target.value})}
                className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm border border-transparent focus:border-black outline-none text-gray-900 dark:text-white"
              >
                <option>Senior Stylist</option>
                <option>Dermatologist</option>
                <option>Receptionist</option>
                <option>Hair Specialist</option>
              </select>
              <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black p-3 rounded-lg font-bold text-sm mt-4 hover:opacity-90 transition-opacity">Create Account</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStaff;
