// services/api/reviewService.ts
import { API_BASE_URL } from './config';

export const reviewService = {
  // Submit a review for an appointment
  submitReview: async (appointmentId: number, rating: number, review: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ rating, review })
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      return await response.json();
    } catch (error) {
      console.error('Review submission error:', error);
      throw error;
    }
  },

  // Get all reviews with pagination
  getReviews: async (page: number = 1) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews?page=${page}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch reviews error:', error);
      throw error;
    }
  }
};
