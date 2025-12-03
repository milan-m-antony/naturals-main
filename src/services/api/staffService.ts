import apiClient from './client';

interface Staff {
  id: number;
  user_id: number;
  branch_id: number;
  specialty?: string;
  rating: number;
  avatar?: string;
  is_available: boolean;
  user?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  branch?: {
    id: number;
    name: string;
  };
}

interface LeaveRequest {
  id: number;
  staff_id: number;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export const staffService = {
  async getAll(params?: { branch_id?: number; is_available?: boolean }): Promise<Staff[]> {
    const response = await apiClient.get<Staff[]>('/staff', { params });
    return response.data;
  },

  async getById(id: number): Promise<Staff> {
    const response = await apiClient.get<Staff>(`/staff/${id}`);
    return response.data;
  },

  async getLeaveRequests(): Promise<LeaveRequest[]> {
    const response = await apiClient.get<LeaveRequest[]>('/leave-requests');
    return response.data;
  },

  async submitLeaveRequest(data: {
    start_date: string;
    end_date: string;
    reason: string;
  }): Promise<LeaveRequest> {
    const response = await apiClient.post<{ leave_request: LeaveRequest }>(
      '/leave-requests',
      data
    );
    return response.data.leave_request;
  },

  async updateLeaveRequest(id: number, status: 'Approved' | 'Rejected'): Promise<LeaveRequest> {
    const response = await apiClient.patch<{ leave_request: LeaveRequest }>(
      `/leave-requests/${id}`,
      { status }
    );
    return response.data.leave_request;
  },
};
