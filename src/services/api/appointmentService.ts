import apiClient from './client';
import { Appointment } from '@/types';

interface CreateAppointmentData {
  branch_id: number;
  staff_id: number;
  date: string;
  time: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  services: Array<{ id: number; price: number }>;
  total_price: number;
  payment_method?: string;
  notes?: string;
}

export const appointmentService = {
  async getAll(params?: { status?: string; date?: string }): Promise<Appointment[]> {
    const response = await apiClient.get<Appointment[]>('/appointments', { params });
    return response.data;
  },

  async getById(id: number): Promise<Appointment> {
    const response = await apiClient.get<Appointment>(`/appointments/${id}`);
    return response.data;
  },

  async create(data: CreateAppointmentData): Promise<Appointment> {
    const response = await apiClient.post<{ appointment: Appointment }>('/appointments', data);
    return response.data.appointment;
  },

  async update(id: number, data: Partial<Appointment>): Promise<Appointment> {
    const response = await apiClient.put<{ appointment: Appointment }>(`/appointments/${id}`, data);
    return response.data.appointment;
  },

  async updateStatus(id: number, status: string): Promise<Appointment> {
    const response = await apiClient.patch<{ appointment: Appointment }>(
      `/appointments/${id}/status`,
      { status }
    );
    return response.data.appointment;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/appointments/${id}`);
  },
};
