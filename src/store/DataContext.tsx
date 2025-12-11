import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { serviceService, appointmentService, branchService, staffService, inventoryService } from '@/services/api';
import type { StaffApi, LeaveRequestApi } from '@/services/api/staffService';
import type {
  Service,
  Appointment,
  InventoryItem,
  AppointmentStatus,
  CreateAppointmentDto,
  Branch,
  Staff,
  LeaveRequest,
} from '@/types';

interface DataContextType {
  services: Service[];
  branches: Branch[];
  staff: Staff[];
  leaveRequests: LeaveRequest[];
  appointments: Appointment[];
  inventory: InventoryItem[];
  isLoading: boolean;
  error: string | null;
  refreshStaff: () => Promise<void>;
  refreshServices: () => Promise<void>;
  refreshAppointments: () => Promise<void>;
  refreshLeaveRequests: () => Promise<void>;
  refreshInventory: () => Promise<void>;
  addAppointment: (apt: CreateAppointmentDto) => Promise<Appointment>;
  updateAppointmentStatus: (id: number, status: AppointmentStatus) => Promise<void>;
  updateAppointment: (id: number, data: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: number) => Promise<void>;
  getAppointmentsByBranch: (branchId: number) => Appointment[];
  getAppointmentsByStaff: (staffId: number) => Appointment[];
  isStaffAvailable: (staffId: number, date: string, time: string) => boolean;
  updateInventory: (id: number, newStock: number) => Promise<void>;
  updateLeaveRequestStatus: (id: number, status: 'approved' | 'rejected') => Promise<void>;
  uploadStaffAvatar: (staffId: number, file: File) => Promise<string>;
  addStaff: (data: { name: string; email: string; phone?: string; role?: string; branchId: number }) => Promise<Staff>;
  updateStaff: (staffId: number, data: { name?: string; email?: string; phone?: string; role?: string }) => Promise<Staff>;
  deleteStaff: (staffId: number) => Promise<void>;
  toggleStaffAvailability: (staffId: number) => Promise<void>;
  submitReview: (appointmentId: number, rating: number, review: string) => void;
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  updateService: (id: number, updatedService: Partial<Service>) => Promise<void>;
  deleteService: (id: number) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const normalizeStaff = (member: StaffApi): Staff => ({
    id: member.id,
    name: member.user?.name ?? (member as any)?.name ?? 'Unnamed',
    role: member.specialty ?? member.role ?? member.user?.role ?? 'staff',
    email: member.user?.email,
    phone: member.user?.phone,
    specialty: member.specialty,
    branchId: (member as any).branchId ?? member.branch_id ?? member.branch?.id ?? 0,
    branchName: member.branch?.name,
    rating: member.rating,
    avatar: member.avatar || member.user?.profile_image,
    available: member.is_available,
  });

  const normalizeLeaveRequest = (request: LeaveRequestApi): LeaveRequest => ({
    id: request.id,
    staffId: (request as any).staffId ?? request.staff_id,
    staffName: request.staff?.user?.name,
    startDate: (request as any).startDate ?? request.start_date,
    endDate: (request as any).endDate ?? request.end_date,
    reason: request.reason,
    status: request.status,
  });

  const refreshStaff = async () => {
    try {
      const data = await staffService.getAll();
      setStaff(data.map(normalizeStaff));
    } catch (err: any) {
      console.error('Failed to fetch staff:', err);
      setError('Failed to load staff');
    }
  };

  const refreshServices = async () => {
    try {
      const data = await serviceService.getAll();
      setServices(data);
    } catch (err: any) {
      console.error('Failed to fetch services:', err);
      setError('Failed to load services');
    }
  };

  const refreshAppointments = async () => {
    try {
      const data = await appointmentService.getAll();
      setAppointments(data);
    } catch (err: any) {
      console.error('Failed to fetch appointments:', err);
    }
  };

  const refreshLeaveRequests = async () => {
    try {
      const response = await staffService.getLeaveRequests();
      const requests = Array.isArray(response.data) ? response.data : [];
      setLeaveRequests(requests.map(normalizeLeaveRequest));
    } catch (err: any) {
      console.error('Failed to fetch leave requests:', err);
    }
  };

  const refreshInventory = async () => {
    try {
      const data = await inventoryService.getAll();
      setInventory(data);
    } catch (err: any) {
      console.error('Failed to fetch inventory:', err);
    }
  };

  useEffect(() => {
    // Prevent multiple simultaneous loads
    if (hasLoadedOnce) {
      return;
    }
    
    const loadInitialData = async () => {
      setIsLoading(true);
      
      // Set a hard timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
        setHasLoadedOnce(true);
      }, 3000);
      
      try {
        // Load data with individual error handling
        const servicesData = await serviceService.getAll().catch(() => []);
        const branchesData = await branchService.getAll().catch(() => []);
        const staffData = await staffService.getAll().catch(() => []);
        const leaveRequestData = await staffService.getLeaveRequests().catch(() => ({ data: [] }));
        
        setServices(servicesData);
        setBranches(branchesData);
        setStaff(staffData.map(normalizeStaff));
        const requests = Array.isArray(leaveRequestData.data) ? leaveRequestData.data : [];
        setLeaveRequests(requests.map(normalizeLeaveRequest));
      } catch (err: any) {
        console.error('[DataContext] Failed to load data:', err.message);
      } finally {
        clearTimeout(timeoutId);
        setIsLoading(false);
        setHasLoadedOnce(true);
      }
    };
    loadInitialData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateLeaveRequestStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      const updated = await staffService.updateLeaveRequest(id, status);
      setLeaveRequests((prev) =>
        prev.map((lr) => (lr.id === id ? normalizeLeaveRequest(updated) : lr))
      );
    } catch (err: any) {
      console.error('Failed to update leave request:', err);
      throw err;
    }
  };

  const uploadStaffAvatar = async (staffId: number, file: File) => {
    try {
      const url = await staffService.uploadAvatar(staffId, file);
      // Update local state immediately
      setStaff((prev) => prev.map((s) => (s.id === staffId ? { ...s, avatar: url } : s)));
      // Refresh from backend to ensure consistency
      await refreshStaff();
      return url;
    } catch (err: any) {
      console.error('Failed to upload avatar:', err);
      throw err;
    }
  };

  const addStaff = async (data: {
    name: string;
    email: string;
    phone?: string;
    role?: string;
    branchId: number;
  }) => {
    try {
      const newStaffApi = await staffService.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        specialty: data.role,
        branch_id: data.branchId,
      });
      const normalized = normalizeStaff(newStaffApi);
      setStaff((prev) => [...prev, normalized]);
      return normalized;
    } catch (err: any) {
      console.error('Failed to create staff:', err);
      throw err;
    }
  };

  const updateStaff = async (staffId: number, data: {
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
  }) => {
    try {
      const updatedStaffApi = await staffService.update(staffId, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        specialty: data.role,
      });
      const normalized = normalizeStaff(updatedStaffApi);
      setStaff((prev) => prev.map((s) => (s.id === staffId ? normalized : s)));
      return normalized;
    } catch (err: any) {
      console.error('Failed to update staff:', err);
      throw err;
    }
  };

  const deleteStaff = async (staffId: number) => {
    try {
      await staffService.delete(staffId);
      setStaff((prev) => prev.filter((s) => s.id !== staffId));
    } catch (err: any) {
      console.error('Failed to delete staff:', err);
      throw err;
    }
  };

  const toggleStaffAvailability = async (staffId: number) => {
    try {
      const updatedStaffApi = await staffService.toggleAvailability(staffId);
      const normalized = normalizeStaff(updatedStaffApi);
      setStaff((prev) => prev.map((s) => (s.id === staffId ? normalized : s)));
    } catch (err: any) {
      console.error('Failed to toggle staff availability:', err);
      throw err;
    }
  };

  const addAppointment = async (apt: CreateAppointmentDto) => {
    try {
      // Convert CreateAppointmentDto to CreateAppointmentData
      const appointmentData = {
        branch_id: apt.branchId,
        staff_id: apt.staffId,
        date: apt.date,
        time: apt.time,
        customer_name: apt.customer,
        customer_phone: apt.customerPhone,
        customer_email: apt.customerEmail,
        services: [{ id: 1, price: apt.price }], // Placeholder service
        total_price: apt.price,
        payment_method: apt.paymentMethod,
        notes: apt.notes
      };
      const newAppointment = await appointmentService.create(appointmentData);
      setAppointments((prev) => [...prev, newAppointment]);
      return newAppointment;
    } catch (err: any) {
      console.error('Failed to create appointment:', err);
      throw err;
    }
  };

  const updateAppointmentStatus = async (id: number, status: AppointmentStatus) => {
    try {
      await appointmentService.updateStatus(id, status);
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
      );
    } catch (err: any) {
      console.error('Failed to update appointment:', err);
      throw err;
    }
  };

  const updateAppointment = async (id: number, data: Partial<Appointment>) => {
    try {
      const updated = await appointmentService.update(id, data);
      setAppointments((prev) => prev.map((apt) => (apt.id === id ? updated : apt)));
    } catch (err: any) {
      console.error('Failed to update appointment:', err);
      throw err;
    }
  };

  const deleteAppointment = async (id: number) => {
    try {
      await appointmentService.delete(id);
      setAppointments((prev) => prev.filter((apt) => apt.id !== id));
    } catch (err: any) {
      console.error('Failed to delete appointment:', err);
      throw err;
    }
  };

  const getAppointmentsByBranch = (branchId: number) => {
    return appointments.filter((apt) => apt.branchId === branchId);
  };

  const getAppointmentsByStaff = (staffId: number) => {
    return appointments.filter((apt) => apt.staffId === staffId);
  };

  const isStaffAvailable = (staffId: number, date: string, time: string) => {
    return !appointments.some((apt) => apt.staffId === staffId && apt.date === date && apt.time === time && apt.status !== 'Cancelled');
  };

  const updateInventory = async (id: number, newStock: number) => {
    try {
      await inventoryService.update(id, { stock: newStock });
      setInventory((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            let status: InventoryItem['status'] = 'In Stock';
            if (newStock <= item.threshold) status = 'Low Stock';
            if (newStock === 0) status = 'Critical';
            return { ...item, stock: newStock, status };
          }
          return item;
        })
      );
    } catch (err: any) {
      console.error('Failed to update inventory:', err);
      throw err;
    }
  };

  const submitReview = (appointmentId: number, rating: number, review: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, rating, review } : apt))
    );
  };

  const addService = async (service: Omit<Service, 'id'>) => {
    try {
      const newService = await serviceService.create(service);
      setServices((prev) => [...prev, newService]);
    } catch (err: any) {
      console.error('Failed to create service:', err);
      throw err;
    }
  };

  const updateService = async (id: number, updatedService: Partial<Service>) => {
    try {
      const updated = await serviceService.update(id, updatedService);
      setServices((prev) =>
        prev.map((s) => (s.id === id ? updated : s))
      );
    } catch (err: any) {
      console.error('Failed to update service:', err);
      throw err;
    }
  };

  const deleteService = async (id: number) => {
    try {
      await serviceService.delete(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      console.error('Failed to delete service:', err);
      throw err;
    }
  };

  return (
    <DataContext.Provider
      value={{
        services,
        branches,
        staff,
        leaveRequests,
        appointments,
        inventory,
        isLoading,
        error,
        refreshStaff,
        refreshServices,
        refreshAppointments,
        refreshLeaveRequests,
        refreshInventory,
        addAppointment,
        updateAppointmentStatus,
        updateAppointment,
        deleteAppointment,
        getAppointmentsByBranch,
        getAppointmentsByStaff,
        isStaffAvailable,
        updateInventory,
        updateLeaveRequestStatus,
        uploadStaffAvatar,
        addStaff,
        updateStaff,
        deleteStaff,
        toggleStaffAvailability,
        submitReview,
        addService,
        updateService,
        deleteService,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
