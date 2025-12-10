// services/api/featureService.ts
import { API_BASE_URL } from './config';

export interface Feature {
  id?: number;
  name: string;
  description?: string;
  icon?: string;
  category?: string;
  is_active: boolean;
  sort_order: number;
}

const getToken = () => localStorage.getItem('auth_token');
const getAuthHeader = () => {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const featureService = {
  // Get all features (public)
  getFeatures: async (category?: string) => {
    try {
      let url = `${API_BASE_URL}/features`;
      if (category) {
        url += `?category=${category}`;
      }

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch features');
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch features error:', error);
      throw error;
    }
  },

  // Get single feature
  getFeature: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/features/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch feature');
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch feature error:', error);
      throw error;
    }
  },

  // Create feature (admin only)
  createFeature: async (feature: Feature) => {
    try {
      const response = await fetch(`${API_BASE_URL}/features`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(feature)
      });

      if (!response.ok) {
        throw new Error('Failed to create feature');
      }

      return await response.json();
    } catch (error) {
      console.error('Create feature error:', error);
      throw error;
    }
  },

  // Update feature (admin only)
  updateFeature: async (id: number, feature: Partial<Feature>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/features/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(feature)
      });

      if (!response.ok) {
        throw new Error('Failed to update feature');
      }

      return await response.json();
    } catch (error) {
      console.error('Update feature error:', error);
      throw error;
    }
  },

  // Delete feature (admin only)
  deleteFeature: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/features/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete feature');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete feature error:', error);
      throw error;
    }
  },

  // Bulk update status
  bulkUpdateStatus: async (featureIds: number[], isActive: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/features/bulk-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ feature_ids: featureIds, is_active: isActive })
      });

      if (!response.ok) {
        throw new Error('Failed to update feature statuses');
      }

      return await response.json();
    } catch (error) {
      console.error('Bulk update error:', error);
      throw error;
    }
  },

  // Reorder features
  reorderFeatures: async (features: Array<{ id: number; sort_order: number }>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/features/reorder`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ features })
      });

      if (!response.ok) {
        throw new Error('Failed to reorder features');
      }

      return await response.json();
    } catch (error) {
      console.error('Reorder features error:', error);
      throw error;
    }
  }
};
