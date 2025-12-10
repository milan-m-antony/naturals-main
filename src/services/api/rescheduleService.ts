import { API_BASE_URL } from './config';

interface RescheduleRequestData {
  new_date: string;
  new_time: string;
  reason?: string;
}

interface RescheduleRequest {
  id: number;
  appointment_id: number;
  original_date: string;
  original_time: string;
  new_date: string;
  new_time: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  staff_id?: number;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  appointment?: {
    id: number;
    date: string;
    time: string;
    service: string;
    status: string;
  };
}

export const requestReschedule = async (appointmentId: number, rescheduleData: RescheduleRequestData): Promise<{
  message: string;
  data: RescheduleRequest;
}> => {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/reschedule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(rescheduleData)
  });

  if (!response.ok) {
    throw new Error('Failed to submit reschedule request');
  }

  return response.json();
};

export const getRescheduleRequests = async (page: number = 1): Promise<{
  data: RescheduleRequest[];
  current_page: number;
  last_page: number;
  total: number;
}> => {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}/reschedule-requests?page=${page}`, {
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch reschedule requests');
  }

  return response.json();
};

export const approveReschedule = async (rescheduleId: number, status: 'approved' | 'rejected', adminNotes?: string): Promise<{
  message: string;
  data: RescheduleRequest;
}> => {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}/reschedule-requests/${rescheduleId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify({ 
      status, 
      admin_notes: adminNotes 
    })
  });

  if (!response.ok) {
    throw new Error('Failed to update reschedule request');
  }

  return response.json();
};
