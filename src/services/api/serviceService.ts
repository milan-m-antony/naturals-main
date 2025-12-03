import apiClient from './client';
import { Service } from '@/types';

export const serviceService = {
  async getAll(params?: { category?: string; search?: string }): Promise<Service[]> {
    const response = await apiClient.get<Service[]>('/services', { params });
    return response.data;
  },

  async getById(id: number): Promise<Service> {
    const response = await apiClient.get<Service>(`/services/${id}`);
    return response.data;
  },

  async create(data: Partial<Service>): Promise<Service> {
    const response = await apiClient.post<{ service: Service }>('/services', data);
    return response.data.service;
  },

  async update(id: number, data: Partial<Service>): Promise<Service> {
    const response = await apiClient.put<{ service: Service }>(`/services/${id}`, data);
    return response.data.service;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/services/${id}`);
  },
};
