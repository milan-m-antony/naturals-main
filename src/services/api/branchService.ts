import apiClient from './client';

interface Branch {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email?: string;
  is_active: boolean;
}

export const branchService = {
  async getAll(): Promise<Branch[]> {
    const response = await apiClient.get<Branch[]>('/branches');
    return response.data;
  },

  async getById(id: number): Promise<Branch> {
    const response = await apiClient.get<Branch>(`/branches/${id}`);
    return response.data;
  },

  async create(data: Partial<Branch>): Promise<Branch> {
    const response = await apiClient.post<{ branch: Branch }>('/branches', data);
    return response.data.branch;
  },

  async update(id: number, data: Partial<Branch>): Promise<Branch> {
    const response = await apiClient.put<{ branch: Branch }>(`/branches/${id}`, data);
    return response.data.branch;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/branches/${id}`);
  },
};
