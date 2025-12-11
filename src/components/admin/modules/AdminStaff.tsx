
import React, { useMemo, useState } from 'react';
import { Plus, CheckCircle, XCircle, X, Search, Users, ClipboardList, UserCheck, AlertCircle, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

interface StaffMember {
  id: number;
  name: string;
  role?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  available?: boolean;
}

interface LeaveRequest {
  id: number;
  staffId: number;
  staffName?: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
}

interface AdminStaffProps {
  staffList: StaffMember[];
  setStaffList: React.Dispatch<React.SetStateAction<StaffMember[]>>;
  leaveRequests: LeaveRequest[];
  setLeaveRequests: React.Dispatch<React.SetStateAction<LeaveRequest[]>>;
  onUpdateLeaveStatus?: (id: number, status: 'approved' | 'rejected') => Promise<void>;
  onRefreshLeaves?: () => Promise<void>;
  onUploadAvatar?: (staffId: number, file: File) => Promise<string>;
  onAddStaff?: (data: { name: string; email: string; phone?: string; role?: string; branchId: number }) => Promise<any>;
  onUpdateStaff?: (staffId: number, data: { name?: string; email?: string; phone?: string; role?: string }) => Promise<any>;
  onDeleteStaff?: (staffId: number) => Promise<void>;
  onToggleAvailability?: (staffId: number) => Promise<void>;
  branches?: any[];
}

const AdminStaff: React.FC<AdminStaffProps> = ({ staffList, setStaffList, leaveRequests, setLeaveRequests, onUpdateLeaveStatus, onRefreshLeaves, onUploadAvatar, onAddStaff, onUpdateStaff, onDeleteStaff, onToggleAvailability, branches }) => {
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', phone: '', role: 'Service Provider (Staff)', avatar: '' });
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // Store file for upload
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Auto-dismiss toast after 3 seconds
  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const pendingLeaves = leaveRequests.filter(r => r.status === 'Pending' || r.status.toLowerCase() === 'pending').length;
  const approvedLeaves = leaveRequests.filter(r => r.status === 'Approved' || r.status.toLowerCase() === 'approved').length;
  const filteredStaff = useMemo(() => {
    const safeStaff = Array.isArray(staffList) ? staffList : [];
    const safeSearch = (search || '').toLowerCase();
    return safeStaff.filter(member => {
      const name = member?.name || '';
      const role = member?.role || '';
      const matchesSearch = name.toLowerCase().includes(safeSearch);
      const matchesRole = roleFilter === 'all' ? true : role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [staffList, search, roleFilter]);

  const derivedPassword = useMemo(() => {
    const digits = (newStaff.phone || '').replace(/\D/g, '');
    return digits.length >= 6 ? digits.slice(0, 6) : '';
  }, [newStaff.phone]);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (modalMode === 'edit' && editingId) {
        // Update existing staff
        if (onUpdateStaff) {
          await onUpdateStaff(editingId, {
            name: newStaff.name,
            email: newStaff.email,
            phone: newStaff.phone,
            role: newStaff.role,
          });
          setToast({ type: 'success', msg: 'Staff updated successfully' });
        } else {
          // Fallback to local state
          const avatar = newStaff.avatar?.trim() || `https://i.pravatar.cc/150?u=${editingId}`;
          setStaffList(prev => prev.map(m => m.id === editingId ? {
            ...m,
            name: newStaff.name,
            email: newStaff.email,
            phone: newStaff.phone,
            role: newStaff.role,
            avatar,
          } : m));
        }
      } else {
        // Create new staff
        if (onAddStaff && branches && branches.length > 0) {
          const createdStaff = await onAddStaff({
            name: newStaff.name,
            email: newStaff.email,
            phone: newStaff.phone,
            role: newStaff.role,
            branchId: branches[0].id,
          });
          
          // Upload avatar if file was selected
          if (avatarFile && onUploadAvatar && createdStaff?.id) {
            try {
              await onUploadAvatar(createdStaff.id, avatarFile);
              setToast({ type: 'success', msg: 'Staff created with photo successfully' });
            } catch (err) {
              console.error('Failed to upload avatar:', err);
              setToast({ type: 'success', msg: 'Staff created (photo upload failed)' });
            }
          } else {
            setToast({ type: 'success', msg: 'Staff created successfully' });
          }
        } else {
          console.warn('Missing onAddStaff or branches:', { onAddStaff: !!onAddStaff, branches: branches?.length });
          // Fallback to local state (should not happen in production)
          const newItem = {
            id: Date.now(),
            name: newStaff.name,
            role: newStaff.role,
            email: newStaff.email,
            phone: newStaff.phone,
            avatar: newStaff.avatar,
          };
          setStaffList([...staffList, newItem]);
          setToast({ type: 'success', msg: 'Staff added (local only - missing backend connection)' });
        }
      }
      
      setIsStaffModalOpen(false);
      setEditingId(null);
      setModalMode('add');
      setNewStaff({ name: '', email: '', phone: '', role: 'Service Provider (Staff)', avatar: '' });
      setAvatarFile(null); // Clear file
    } catch (err: any) {
      console.error('Failed to save staff:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      const errorMsg = err.response?.data?.message || err.response?.data?.errors || err.message || 'Failed to save staff';
      setToast({ type: 'error', msg: typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg });
    }
  };

  const startEdit = (member: StaffMember) => {
    setModalMode('edit');
    setEditingId(member.id);
    setNewStaff({
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      role: member.role || 'Service Provider (Staff)',
      avatar: member.avatar || '',
    });
    setIsStaffModalOpen(true);
  };

  const handleLeaveAction = (id: number, status: string) => {
    const normalized = status.toLowerCase() === 'approved' ? 'approved' : 'rejected';

    const persist = async () => {
      try {
        if (onUpdateLeaveStatus) {
          await onUpdateLeaveStatus(id, normalized);
        }
        setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, status: normalized } : req));
        if (onRefreshLeaves) {
          await onRefreshLeaves();
        }
        setToast({ type: 'success', msg: `Leave ${normalized}` });
      } catch (err) {
        console.error('Failed to update leave request', err);
        setToast({ type: 'error', msg: 'Failed to update leave request' });
      }
    };

    void persist();
  };

  const handleImageChange = (file?: File | null) => {
    if (!file) return;
    
    // Show preview
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setNewStaff(prev => ({ ...prev, avatar: result }));
    };
    reader.readAsDataURL(file);

    // Store file for upload
    setAvatarFile(file);

    // If editing existing staff, upload immediately
    if (modalMode === 'edit' && editingId && onUploadAvatar) {
      const upload = async () => {
        try {
          const url = await onUploadAvatar(editingId, file);
          setStaffList(prev => prev.map(s => s.id === editingId ? { ...s, avatar: url } : s));
          setToast({ type: 'success', msg: 'Profile photo updated' });
        } catch (err) {
          console.error('Failed to upload avatar', err);
          setToast({ type: 'error', msg: 'Upload failed' });
        }
      };
      void upload();
    }
  };

  const formatDate = (value: string) => {
    const parsed = new Date(value);
    return Number.isNaN(parsed.valueOf()) ? value : parsed.toLocaleDateString();
  };

  const renderStatusTag = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized === 'pending') return 'bg-amber-100 text-amber-800';
    if (normalized === 'approved') return 'bg-emerald-100 text-emerald-800';
    if (normalized === 'rejected' || normalized === 'denied') return 'bg-gray-200 text-gray-700';
    return 'bg-gray-200 text-gray-700';
  };

  const handleDeleteStaff = async (member: StaffMember) => {
    if (!confirm(`⚠️ PERMANENT DELETE\n\nAre you sure you want to permanently delete ${member.name}?\n\nThis will:\n• Remove the staff member from the database\n• Delete their user account\n• Remove all associated data\n\nThis action CANNOT be undone!`)) {
      return;
    }

    try {
      if (onDeleteStaff) {
        await onDeleteStaff(member.id);
        setToast({ type: 'success', msg: `${member.name} permanently deleted` });
      } else {
        setStaffList(prev => prev.filter(s => s.id !== member.id));
      }
    } catch (err: any) {
      console.error('Failed to delete staff:', err);
      setToast({ type: 'error', msg: err.response?.data?.message || 'Failed to delete staff' });
    }
  };

  const handleToggleAvailability = async (member: StaffMember) => {
    try {
      if (onToggleAvailability) {
        await onToggleAvailability(member.id);
        setToast({ type: 'success', msg: `Staff ${member.available ? 'disabled' : 'enabled'}` });
      } else {
        setStaffList(prev => prev.map(s => s.id === member.id ? { ...s, available: !s.available } : s));
      }
    } catch (err: any) {
      console.error('Failed to toggle availability:', err);
      setToast({ type: 'error', msg: 'Failed to update availability' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header + actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-gray-500 font-semibold">Staff Management</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Team overview & leave control</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsStaffModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-semibold shadow-sm hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Add staff
          </button>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4 flex items-center gap-3">
          <div className="p-3 rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200"><Users className="w-5 h-5" /></div>
          <div>
            <p className="text-xs text-gray-500">Total staff</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{staffList.length}</p>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4 flex items-center gap-3">
          <div className="p-3 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"><ClipboardList className="w-5 h-5" /></div>
          <div>
            <p className="text-xs text-gray-500">Pending leave</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{pendingLeaves}</p>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4 flex items-center gap-3">
          <div className="p-3 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200"><UserCheck className="w-5 h-5" /></div>
          <div>
            <p className="text-xs text-gray-500">Approved leave (YTD)</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{approvedLeaves}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Staff List */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Team roster</h3>
              <p className="text-xs text-gray-500">Single-location team; edit inline soon.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-neutral-700 rounded-lg px-3 py-2 border border-transparent focus-within:border-black dark:focus-within:border-white">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search staff"
                  className="bg-transparent text-sm outline-none text-gray-800 dark:text-white w-full"
                />
              </div>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="bg-gray-50 dark:bg-neutral-700 rounded-lg px-3 py-2 text-sm border border-transparent focus:border-black dark:focus:border-white text-gray-800 dark:text-white"
              >
                <option value="all">All roles</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Service Provider (Staff)">Service Provider (Staff)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[440px] custom-scrollbar pr-1">
            {filteredStaff.length === 0 && (
              <div className="border border-dashed border-gray-200 dark:border-neutral-700 rounded-xl p-8 text-center text-sm text-gray-500">No staff match your filters.</div>
            )}
            {filteredStaff.map(member => (
              <div 
                key={member.id} 
                className={`flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 ${
                  member.available === false 
                    ? 'bg-gray-100 dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 opacity-60' 
                    : 'bg-gray-50 dark:bg-neutral-700/30 border-transparent hover:border-gray-200 dark:hover:border-neutral-600'
                }`}
              >
                <div className="relative">
                  <img 
                    src={member.avatar || `https://i.pravatar.cc/150?u=${member.id}`} 
                    className={`w-12 h-12 rounded-full object-cover transition-all duration-300 ${
                      member.available === false ? 'grayscale opacity-50' : ''
                    }`}
                    alt={member.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes('pravatar')) {
                        target.src = `https://i.pravatar.cc/150?u=${member.id}`;
                      }
                    }}
                  />
                  {member.available === false && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-bold text-sm truncate ${
                      member.available === false 
                        ? 'text-gray-500 dark:text-gray-400 line-through' 
                        : 'text-gray-900 dark:text-white'
                    }`}>{member.name}</p>
                    {member.available === false && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-full font-semibold animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        Disabled
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                  {member.phone && <p className="text-[11px] text-gray-400">{member.phone}</p>}
                </div>
                <div className="flex items-center gap-2">
                  {/* Toggle Switch */}
                  <button 
                    onClick={() => handleToggleAvailability(member)} 
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                      member.available === false 
                        ? 'bg-gray-300 dark:bg-gray-600' 
                        : 'bg-green-500 dark:bg-green-600'
                    }`}
                    title={member.available === false ? 'Click to enable' : 'Click to disable'}
                  >
                    <span 
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        member.available === false ? 'translate-x-1' : 'translate-x-6'
                      }`}
                    />
                  </button>
                  
                  <button 
                    onClick={() => startEdit(member)} 
                    className="text-xs font-semibold text-blue-700 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    Edit
                  </button>
                  
                  <button 
                    onClick={() => handleDeleteStaff(member)} 
                    className="text-xs font-semibold text-red-700 bg-red-50 dark:bg-red-900/30 dark:text-red-100 p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 hover:scale-110 transition-all duration-200"
                    title="Delete staff permanently"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Approval Queue */}
        <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Leave queue</h3>
            <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-bold">{pendingLeaves} Pending</span>
          </div>
          <div className="space-y-4">
            {leaveRequests.map(req => (
              <div key={req.id} className="p-4 border border-gray-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{req.staffName || 'Unknown staff'}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{req.startDate === req.endDate ? formatDate(req.startDate) : `${formatDate(req.startDate)} - ${formatDate(req.endDate)}`}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${renderStatusTag(req.status)}`}>
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-neutral-700/60 border border-gray-100 dark:border-neutral-700 p-2 rounded mb-3">"{req.reason || 'No reason provided'}"</p>
                {(req.status === 'Pending' || req.status.toLowerCase() === 'pending') && (
                  <div className="flex gap-2">
                    <button onClick={() => handleLeaveAction(req.id, 'approved')} className="flex-1 bg-black text-white py-2 rounded-lg text-xs font-bold hover:opacity-90 flex items-center justify-center gap-2 transition-colors"><CheckCircle className="w-3 h-3" /> Approve</button>
                    <button onClick={() => handleLeaveAction(req.id, 'rejected')} className="flex-1 border border-gray-300 dark:border-neutral-600 text-gray-800 dark:text-gray-100 py-2 rounded-lg text-xs font-bold hover:bg-gray-100 dark:hover:bg-neutral-700 flex items-center justify-center gap-2 transition-colors"><XCircle className="w-3 h-3" /> Deny</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{modalMode === 'edit' ? 'Edit Staff' : 'Add New Staff'}</h3>
                <p className="text-xs text-gray-500 mt-1">Only managers and owners can create staff accounts</p>
              </div>
              <button onClick={() => setIsStaffModalOpen(false)} className="text-gray-500 hover:text-black dark:hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form className="space-y-4" onSubmit={handleAddStaff}>
              <input
                type="text"
                placeholder="Full Name"
                required
                value={newStaff.name}
                onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm border border-transparent focus:border-black outline-none text-gray-900 dark:text-white"
              />
              <input
                type="email"
                placeholder="Email"
                required
                value={newStaff.email}
                onChange={e => setNewStaff({ ...newStaff, email: e.target.value })}
                className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm border border-transparent focus:border-black outline-none text-gray-900 dark:text-white"
              />
              <div className="bg-gray-50 dark:bg-neutral-700/60 border border-gray-200 dark:border-neutral-600 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-300">
                <p className="font-semibold text-gray-800 dark:text-white mb-1">🔑 Login Credentials to Share</p>
                <p>Email: <span className="font-mono font-bold">{newStaff.email || 'staff-email'}</span></p>
                <p>Password: <span className="font-mono font-bold bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">{derivedPassword || 'first 6 digits of phone'}</span> (auto-set)</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                  💡 The password is the <strong>first 6 digits</strong> of the phone number. Staff can login at <strong>/admin-login</strong> and change their password in Settings.
                </p>
              </div>
              <input
                type="tel"
                placeholder="Phone"
                required
                value={newStaff.phone}
                onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })}
                className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm border border-transparent focus:border-black outline-none text-gray-900 dark:text-white"
              />
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-neutral-700 overflow-hidden">
                    {newStaff.avatar ? (
                      <img src={newStaff.avatar} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">Preview</div>
                    )}
                  </div>
                  <label className="cursor-pointer text-xs font-semibold text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-neutral-700 px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-600 hover:bg-gray-200 dark:hover:bg-neutral-600">
                    Upload profile photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleImageChange(e.target.files?.[0])}
                    />
                  </label>
                </div>
                <p className="text-[11px] text-gray-500">JPG/PNG, up to ~2MB. Uses backend storage when editing existing staff.</p>
              </div>
              <select
                value={newStaff.role}
                onChange={e => setNewStaff({ ...newStaff, role: e.target.value })}
                className="w-full bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm border border-transparent focus:border-black outline-none text-gray-900 dark:text-white"
              >
                <option>Receptionist</option>
                <option>Service Provider (Staff)</option>
              </select>
              <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black p-3 rounded-lg font-bold text-sm mt-4 hover:opacity-90 transition-opacity">{modalMode === 'edit' ? 'Save Changes' : 'Create Account'}</button>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm ${toast.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
          <button onClick={() => setToast(null)} className="ml-2 text-xs text-gray-600">Dismiss</button>
        </div>
      )}
    </div>
  );
};

export default AdminStaff;
