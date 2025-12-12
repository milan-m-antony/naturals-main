/* copilot:follow
This module is part of Announcement Bar management.
It is protected. Do NOT modify unless the user explicitly asks.
*/

import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export interface Announcement {
  id?: number;
  text: string;
  icon: string;
  action: string;
  link_target: string;
  sort_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const announcementService = {
  async getAll(): Promise<Announcement[]> {
    try {
      const response = await axios.get(`${API_BASE}/announcements`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      return [];
    }
  },

  async create(data: Announcement): Promise<Announcement> {
    const token = localStorage.getItem('auth_token');
    const response = await axios.post(`${API_BASE}/announcements`, data, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  async update(id: number, data: Announcement): Promise<Announcement> {
    const token = localStorage.getItem('auth_token');
    const response = await axios.put(`${API_BASE}/announcements/${id}`, data, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    const token = localStorage.getItem('auth_token');
    await axios.delete(`${API_BASE}/announcements/${id}`, {
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
  },
};
