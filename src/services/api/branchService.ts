import apiClient from './client';

export const branchService = {
  /**
   * Get all branches
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
   * Get single branch by ID
   */
  async getById(branchId: number) {
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
  async create(branchData: {
    name: string;
    address: string;
    city: string;
    state: string;
    phone: string;
    email: string;
    is_active?: boolean;
  }) {
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
  async update(branchId: number, branchData: Partial<{
    name: string;
    address: string;
    city: string;
    state: string;
    phone: string;
    email: string;
    is_active: boolean;
  }>) {
    try {
      const response = await apiClient.put(`/branches/${branchId}`, branchData);
      return response.data;
    } catch (error) {
      console.error('Error updating branch:', error);
      throw error;
    }
  },

  /**
   * Delete branch (admin only)
   */
  async delete(branchId: number) {
    try {
      const response = await apiClient.delete(`/branches/${branchId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting branch:', error);
      throw error;
    }
  },
};

export default branchService;
