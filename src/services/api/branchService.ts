import apiClient from './client';

export const branchService = {
  /**
   * Get all branches (simple method for DataContext)
   */
  async getAll() {
    try {
      const response = await apiClient.get('/branches');
      return response.data.branches || response.data;
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw error;
    }
  },

  /**
   * Get all active branches with filters
   */
  async getAllBranches(city?: string, state?: string) {
    try {
      const response = await apiClient.get('/branches', {
        params: {
          city,
          state,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw error;
    }
  },

  /**
   * Get single branch details
   */
  async getBranch(branchId: number) {
    try {
      const response = await apiClient.get(`/branches/${branchId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching branch details:', error);
      throw error;
    }
  },

  /**
   * Create new branch (admin only)
   */
  async createBranch(branchData: any) {
    try {
      const response = await apiClient.post('/branches', branchData);
      return response.data;
    } catch (error) {
      console.error('Error creating branch:', error);
      throw error;
    }
  },

  /**
   * Update branch (admin only)
   */
  async updateBranch(branchId: number, branchData: any) {
    try {
      const response = await apiClient.put(`/branches/${branchId}`, branchData);
      return response.data;
    } catch (error) {
      console.error('Error updating branch:', error);
      throw error;
    }
  },

  /**
   * Get services available at branch
   */
  async getBranchServices(branchId: number) {
    try {
      const response = await apiClient.get(`/branches/${branchId}/services`);
      return response.data;
    } catch (error) {
      console.error('Error fetching branch services:', error);
      throw error;
    }
  },

  /**
   * Assign service to branch (admin only)
   */
  async assignService(branchId: number, serviceId: number, isAvailable: boolean = true) {
    try {
      const response = await apiClient.post(`/branches/${branchId}/services`, {
        service_id: serviceId,
        is_available: isAvailable,
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning service to branch:', error);
      throw error;
    }
  },

  /**
   * Remove service from branch (admin only)
   */
  async removeService(branchId: number, serviceId: number) {
    try {
      const response = await apiClient.delete(`/branches/${branchId}/services/${serviceId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing service from branch:', error);
      throw error;
    }
  },

  /**
   * Get staff working at branch
   */
  async getBranchStaff(branchId: number) {
    try {
      const response = await apiClient.get(`/branches/${branchId}/staff`);
      return response.data;
    } catch (error) {
      console.error('Error fetching branch staff:', error);
      throw error;
    }
  },

  /**
   * Assign staff to branch (admin only)
   */
  async assignStaff(branchId: number, staffId: number, isPrimary: boolean = false) {
    try {
      const response = await apiClient.post(`/branches/${branchId}/staff`, {
        staff_id: staffId,
        is_primary: isPrimary,
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning staff to branch:', error);
      throw error;
    }
  },

  /**
   * Remove staff from branch (admin only)
   */
  async removeStaff(branchId: number, staffId: number) {
    try {
      const response = await apiClient.delete(`/branches/${branchId}/staff/${staffId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing staff from branch:', error);
      throw error;
    }
  },

  /**
   * Get branch inventory
   */
  async getBranchInventory(branchId: number) {
    try {
      const response = await apiClient.get(`/branches/${branchId}/inventory`);
      return response.data;
    } catch (error) {
      console.error('Error fetching branch inventory:', error);
      throw error;
    }
  },

  /**
   * Get branch appointments
   */
  async getBranchAppointments(
    branchId: number,
    page: number = 1,
    perPage: number = 20,
    status?: string,
    startDate?: string,
    endDate?: string
  ) {
    try {
      const response = await apiClient.get(`/branches/${branchId}/appointments`, {
        params: {
          page,
          per_page: perPage,
          status,
          start_date: startDate,
          end_date: endDate,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching branch appointments:', error);
      throw error;
    }
  },

  /**
   * Get branch statistics and metrics
   */
  async getBranchStatistics(branchId: number) {
    try {
      const response = await apiClient.get(`/branches/${branchId}/statistics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching branch statistics:', error);
      throw error;
    }
  },
};

export default branchService;
