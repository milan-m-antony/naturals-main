import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Search, Filter, ChevronDown } from 'lucide-react';
import { approveReschedule, getRescheduleRequests } from '@/services/api/rescheduleService';

interface RescheduleRequest {
  id: number;
  appointment_id: number;
  original_date: string;
  original_time: string;
  new_date: string;
  new_time: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  appointment?: {
    id: number;
    date: string;
    time: string;
    service: string;
    user_id: number;
    customer_name: string;
  };
}

const AdminRescheduleRequests: React.FC = () => {
  const [requests, setRequests] = useState<RescheduleRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<RescheduleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<RescheduleRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await getRescheduleRequests(1);
      setRequests(response.data);
      filterRequests(response.data, statusFilter, searchQuery);
    } catch (error) {
      console.error('Failed to load reschedule requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = (allRequests: RescheduleRequest[], status: string, search: string) => {
    let filtered = allRequests;

    if (status !== 'all') {
      filtered = filtered.filter(r => r.status === status);
    }

    if (search) {
      filtered = filtered.filter(r =>
        r.appointment?.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        r.appointment?.service.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  };

  const handleStatusFilterChange = (status: 'all' | 'pending' | 'approved' | 'rejected') => {
    setStatusFilter(status);
    filterRequests(requests, status, searchQuery);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    filterRequests(requests, statusFilter, query);
  };

  const handleApprove = async (request: RescheduleRequest) => {
    try {
      await approveReschedule(request.id, 'approved', adminNotes);
      setRequests(requests.map(r => r.id === request.id ? { ...r, status: 'approved' } : r));
      filterRequests(requests.map(r => r.id === request.id ? { ...r, status: 'approved' } : r), statusFilter, searchQuery);
      setSelectedRequest(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Failed to approve request:', error);
    }
  };

  const handleReject = async (request: RescheduleRequest) => {
    try {
      await approveReschedule(request.id, 'rejected', adminNotes);
      setRequests(requests.map(r => r.id === request.id ? { ...r, status: 'rejected' } : r));
      filterRequests(requests.map(r => r.id === request.id ? { ...r, status: 'rejected' } : r), statusFilter, searchQuery);
      setSelectedRequest(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Reschedule Requests</h3>
        <p className="text-gray-600 dark:text-gray-400">Manage customer appointment reschedule requests</p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-neutral-900 rounded-[2rem] p-6 border border-gray-100 dark:border-neutral-800 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customer or service..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="flex gap-2">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilterChange(status as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  statusFilter === status
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin">
            <div className="w-8 h-8 border-4 border-gray-200 dark:border-neutral-700 border-t-yellow-400 rounded-full"></div>
          </div>
          <p className="mt-4 text-gray-500">Loading reschedule requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-[2rem] border border-dashed border-gray-200 dark:border-neutral-800">
          <Calendar className="w-12 h-12 text-gray-300 dark:text-neutral-700 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No reschedule requests found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request.id} className="bg-white dark:bg-neutral-900 rounded-[2rem] p-6 border border-gray-100 dark:border-neutral-800 hover:border-gray-200 dark:hover:border-neutral-700 transition-all">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="font-bold text-gray-900 dark:text-white">{request.appointment?.customer_name}</h4>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      request.status === 'approved' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {request.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{request.appointment?.service}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <p className="text-gray-500 font-bold uppercase mb-1">Current Date</p>
                      <p className="text-gray-900 dark:text-white font-bold">{new Date(request.original_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-bold uppercase mb-1">Current Time</p>
                      <p className="text-gray-900 dark:text-white font-bold">{request.original_time}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-bold uppercase mb-1">Requested Date</p>
                      <p className="text-yellow-600 dark:text-yellow-400 font-bold">{new Date(request.new_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-bold uppercase mb-1">Requested Time</p>
                      <p className="text-yellow-600 dark:text-yellow-400 font-bold">{request.new_time}</p>
                    </div>
                  </div>

                  {request.reason && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-neutral-800 rounded-xl">
                      <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">Reason</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{request.reason}</p>
                    </div>
                  )}
                </div>

                {request.status === 'pending' && (
                  <div className="flex gap-3 w-full md:w-auto">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="flex-1 md:flex-none bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="flex-1 md:flex-none bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Response Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95">
            <h3 className="font-display text-2xl font-bold italic text-gray-900 dark:text-white mb-6">
              {selectedRequest.status === 'pending' ? 'Add Response' : 'Request Details'}
            </h3>

            <div className="mb-6 p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl">
              <p className="text-xs font-bold uppercase text-gray-500 mb-1">Customer</p>
              <p className="text-gray-900 dark:text-white font-bold">{selectedRequest.appointment?.customer_name}</p>
            </div>

            {selectedRequest.status === 'pending' && (
              <>
                <textarea
                  placeholder="Add optional admin notes..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-neutral-800 rounded-xl p-4 text-sm outline-none border border-transparent focus:border-yellow-400 mb-6 min-h-[100px] text-gray-900 dark:text-white resize-none"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(selectedRequest)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold uppercase text-xs tracking-wider transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedRequest)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold uppercase text-xs tracking-wider transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </>
            )}

            <button
              onClick={() => setSelectedRequest(null)}
              className="w-full mt-4 bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white py-3 rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRescheduleRequests;
