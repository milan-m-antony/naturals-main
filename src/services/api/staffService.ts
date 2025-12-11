import apiClient from './client';

export interface StaffApi {
  id: number;
  user_id: number;
  branch_id: number;
  specialty?: string;
  rating?: number;
  avatar?: string;
  is_available?: boolean;
  role?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role?: string;
    profile_image?: string;
  };
  branch?: {
    id: number;
    name: string;
  };
}

export interface LeaveRequestApi {
  id: number;
  staff_id: number;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'Pending' | 'Approved' | 'Rejected';
  staff?: StaffApi;
}

export interface LeaveRequestResponse {
  data: LeaveRequestApi[];
  meta?: unknown;
  links?: unknown;
}

export const staffService = {
  async getAll(params?: { branch_id?: number; is_available?: boolean }): Promise<StaffApi[]> {
    const response = await apiClient.get<StaffApi[]>('/staff', { params });
    return response.data;
  },

  async getById(id: number): Promise<StaffApi> {
    const response = await apiClient.get<StaffApi>(`/staff/${id}`);
    return response.data;
  },

  async getLeaveRequests(params?: { status?: string }): Promise<LeaveRequestResponse> {
    const response = await apiClient.get<LeaveRequestResponse | LeaveRequestApi[]>(
      '/leave-requests',
      { params }
    );

    if (Array.isArray(response.data)) {
      return { data: response.data };
    }

    return response.data as LeaveRequestResponse;
  },

  async submitLeaveRequest(data: {
    start_date: string;
    end_date: string;
    reason: string;
  }): Promise<LeaveRequestApi> {
    const response = await apiClient.post<{ leave_request: LeaveRequestApi }>(
      '/leave-requests',
      data
    );
    return response.data.leave_request;
  },

  async updateLeaveRequest(id: number, status: 'approved' | 'rejected'): Promise<LeaveRequestApi> {
    const response = await apiClient.patch<{ leave_request: LeaveRequestApi }>(
      `/leave-requests/${id}`,
      { status }
    );
    return response.data.leave_request;
  },

  async uploadAvatar(staffId: number, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post<{ avatar_url: string }>(
      `/staff/${staffId}/avatar`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return response.data.avatar_url;
  },

  async create(data: {
    name: string;
    email: string;
    phone?: string;
    role?: string;
    specialty?: string;
    branch_id: number;
  }): Promise<StaffApi> {
    const response = await apiClient.post<{ staff: StaffApi }>('/staff', data);
    return response.data.staff;
  },

  async update(staffId: number, data: {
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
    specialty?: string;
    is_available?: boolean;
  }): Promise<StaffApi> {
    const response = await apiClient.put<{ staff: StaffApi }>(`/staff/${staffId}`, data);
    return response.data.staff;
  },

  async delete(staffId: number): Promise<void> {
    await apiClient.delete(`/staff/${staffId}`);
  },

  async toggleAvailability(staffId: number): Promise<StaffApi> {
    const response = await apiClient.patch<{ staff: StaffApi }>(`/staff/${staffId}/toggle-availability`);
    return response.data.staff;
  },
};
