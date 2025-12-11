export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  email?: string;
  city?: string;
  state?: string;
}

export interface Staff {
  id: number;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  specialty?: string;
  branchId: number;
  branchName?: string;
  rating?: number;
  avatar?: string;
  available?: boolean;
}

export interface LeaveRequest {
  id: number;
  staffId: number;
  staffName?: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'Pending' | 'Approved' | 'Rejected';
}

export type ViewType = 'home' | 'services' | 'discounts' | 'contact' | 'about' | 'membership' | 'booking' | 'admin-login';

export type ThemeMode = 'light' | 'dark';
