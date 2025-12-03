import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { serviceService, appointmentService, branchService, staffService, inventoryService } from '@/services/api';
import type {
  Service,
  Appointment,
  InventoryItem,
  AppointmentStatus,
  CreateAppointmentDto,
  Branch,
  Staff,
} from '@/types';

interface DataContextType {
  services: Service[];
  branches: Branch[];
  staff: Staff[];
  appointments: Appointment[];
  inventory: InventoryItem[];
  isLoading: boolean;
  error: string | null;
  refreshServices: () => Promise<void>;
  refreshAppointments: () => Promise<void>;
  refreshInventory: () => Promise<void>;
  addAppointment: (apt: CreateAppointmentDto) => Promise<Appointment>;
  updateAppointmentStatus: (id: number, status: AppointmentStatus) => Promise<void>;
  updateAppointment: (id: number, data: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: number) => Promise<void>;
  getAppointmentsByBranch: (branchId: number) => Appointment[];
  getAppointmentsByStaff: (staffId: number) => Appointment[];
  isStaffAvailable: (staffId: number, date: string, time: string) => boolean;
  updateInventory: (id: number, newStock: number) => Promise<void>;
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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const refreshInventory = async () => {
    try {
      const data = await inventoryService.getAll();
      setInventory(data);
    } catch (err: any) {
      console.error('Failed to fetch inventory:', err);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [servicesData, branchesData, staffData] = await Promise.all([
          serviceService.getAll(),
          branchService.getAll(),
          staffService.getAll(),
        ]);
        setServices(servicesData);
        setBranches(branchesData);
        setStaff(staffData);
      } catch (err: any) {
        console.error('Failed to load initial data:', err);
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const addAppointment = async (apt: CreateAppointmentDto) => {
    try {
      const newAppointment = await appointmentService.create(apt);
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
        appointments,
        inventory,
        isLoading,
        error,
        refreshServices,
        refreshAppointments,
        refreshInventory,
        addAppointment,
        updateAppointmentStatus,
        updateAppointment,
        deleteAppointment,
        getAppointmentsByBranch,
        getAppointmentsByStaff,
        isStaffAvailable,
        updateInventory,
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
