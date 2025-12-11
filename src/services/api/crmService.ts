import apiClient from './apiClient';

export const crmService = {
  /**
   * Get customer CRM profile with notes, preferences, and interaction history
   */
  async getCustomerProfile(userId: string) {
    try {
      const response = await apiClient.get(`/customers/${userId}/profile`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer profile:', error);
      throw error;
    }
  },

  /**
   * Get customer preferences
   */
  async getPreferences(userId: string) {
    try {
      const response = await apiClient.get(`/customers/${userId}/preferences`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer preferences:', error);
      throw error;
    }
  },

  /**
   * Update customer preferences
   */
  async updatePreferences(userId: string, preferences: any) {
    try {
      const response = await apiClient.put(`/customers/${userId}/preferences`, preferences);
      return response.data;
    } catch (error) {
      console.error('Error updating customer preferences:', error);
      throw error;
    }
  },

  /**
   * Add a note for a customer
   */
  async addNote(userId: string, note: string, isInternal: boolean = false, importance: number = 1) {
    try {
      const response = await apiClient.post(`/customers/${userId}/notes`, {
        note,
        is_internal: isInternal,
        importance,
      });
      return response.data;
    } catch (error) {
      console.error('Error adding customer note:', error);
      throw error;
    }
  },

  /**
   * Get customer notes
   */
  async getNotes(userId: string, page: number = 1, perPage: number = 15, important: boolean = false) {
    try {
      const response = await apiClient.get(`/customers/${userId}/notes`, {
        params: {
          page,
          per_page: perPage,
          important: important ? 1 : undefined,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer notes:', error);
      throw error;
    }
  },

  /**
   * Update a customer note
   */
  async updateNote(userId: string, noteId: number, note: string, isInternal: boolean, importance: number) {
    try {
      const response = await apiClient.put(`/customers/${userId}/notes/${noteId}`, {
        note,
        is_internal: isInternal,
        importance,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating customer note:', error);
      throw error;
    }
  },

  /**
   * Delete a customer note
   */
  async deleteNote(userId: string, noteId: number) {
    try {
      const response = await apiClient.delete(`/customers/${userId}/notes/${noteId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting customer note:', error);
      throw error;
    }
  },

  /**
   * Log a customer interaction
   */
  async logInteraction(userId: string, interaction: any) {
    try {
      const response = await apiClient.post(`/customers/${userId}/interactions`, interaction);
      return response.data;
    } catch (error) {
      console.error('Error logging customer interaction:', error);
      throw error;
    }
  },

  /**
   * Get customer interaction history
   */
  async getInteractions(
    userId: string,
    page: number = 1,
    perPage: number = 15,
    type?: string,
    channel?: string,
    ratedOnly: boolean = false
  ) {
    try {
      const response = await apiClient.get(`/customers/${userId}/interactions`, {
        params: {
          page,
          per_page: perPage,
          type,
          channel,
          rated_only: ratedOnly ? 1 : undefined,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer interactions:', error);
      throw error;
    }
  },

  /**
   * Get customer lifecycle data (lifetime value, appointment count, ratings, etc.)
   */
  async getCustomerLifecycle(userId: string) {
    try {
      const response = await apiClient.get(`/customers/${userId}/lifecycle`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer lifecycle data:', error);
      throw error;
    }
  },

  /**
   * Search customers by name, email, or phone
   */
  async searchCustomers(searchTerm: string) {
    try {
      const response = await apiClient.get('/customers/search', {
        params: {
          search: searchTerm,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching customers:', error);
      throw error;
    }
  },

  /**
   * Get customers by communication preference (for marketing campaigns)
   */
  async getCustomersByPreference(
    preference?: string,
    minLifetimeValue?: number,
    hasPreferredStaff?: boolean,
    limit: number = 100
  ) {
    try {
      const response = await apiClient.get('/customers/by-preference', {
        params: {
          communication_preference: preference,
          min_lifetime_value: minLifetimeValue,
          has_preferred_staff: hasPreferredStaff ? 1 : undefined,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customers by preference:', error);
      throw error;
    }
  },
};

export default crmService;
