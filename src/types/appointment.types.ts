export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'Pending' | 'In Progress';
export type PaymentStatus = 'Paid' | 'Pending' | 'Refunded';
export type PaymentMethod = 'Card' | 'UPI' | 'Cash' | 'Pay at Venue';

export interface Appointment {
  id: number;
  date: string; // YYYY-MM-DD
  time: string;
  customer: string;
  service: string;
  price: number;
  status: AppointmentStatus;
  staffId: number;
  branchId: number;
  notes?: string;
  customerPhone?: string;
  customerEmail?: string;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  rating?: number;
  review?: string;
}

export interface CreateAppointmentDto {
  date: string;
  time: string;
  customer: string;
  service: string;
  price: number;
  staffId: number;
  branchId: number;
  notes?: string;
  customerPhone?: string;
  customerEmail?: string;
  paymentMethod?: PaymentMethod;
}
