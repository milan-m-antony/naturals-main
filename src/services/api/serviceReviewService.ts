import { API_BASE_URL } from './config';

interface ServiceReviewData {
  rating: number;
  review?: string;
  appointment_id?: number;
}

interface ServiceReview {
  id: number;
  service_id: number;
  user_id: number;
  appointment_id?: number;
  rating: number;
  review?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

interface ServiceReviewResponse {
  message: string;
  data: ServiceReview;
  service_rating?: {
    rating: number;
    reviews_count: number;
  };
}

export const submitServiceReview = async (serviceId: number, reviewData: ServiceReviewData): Promise<ServiceReviewResponse> => {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}/services/${serviceId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(reviewData)
  });

  if (!response.ok) {
    throw new Error('Failed to submit review');
  }

  return response.json();
};

export const getServiceReviews = async (serviceId: number, page: number = 1): Promise<{
  data: ServiceReview[];
  current_page: number;
  last_page: number;
  total: number;
}> => {
  const response = await fetch(`${API_BASE_URL}/services/${serviceId}/reviews?page=${page}`);

  if (!response.ok) {
    throw new Error('Failed to fetch reviews');
  }

  return response.json();
};
