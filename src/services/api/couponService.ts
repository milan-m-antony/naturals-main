// Coupon API Service

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getAuthHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
  'Content-Type': 'application/json',
});

export interface Coupon {
  id: number;
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase: number;
  max_discount?: number;
  valid_until: string;
}

export interface CouponValidation {
  valid: boolean;
  coupon_id: number;
  code: string;
  discount_type: string;
  discount_value: number;
  discount_amount: number;
  final_amount: number;
}

export const couponService = {
  // Get available coupons
  getAvailable: async (): Promise<Coupon[]> => {
    try {
      const response = await fetch(`${API_URL}/api/coupons`, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch coupons');
      return response.json();
    } catch (error) {
      console.error('Error fetching coupons:', error);
      return [];
    }
  },

  // Validate coupon code
  validate: async (code: string, amount: number): Promise<CouponValidation | null> => {
    try {
      const response = await fetch(`${API_URL}/api/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, amount }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Invalid coupon');
      }

      return response.json();
    } catch (error) {
      console.error('Coupon validation error:', error);
      return null;
    }
  },

  // Apply coupon to appointment
  apply: async (couponId: number, appointmentId: number, discountAmount: number) => {
    try {
      const response = await fetch(`${API_URL}/api/coupons/apply`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({
          coupon_id: couponId,
          appointment_id: appointmentId,
          discount_amount: discountAmount,
        }),
      });

      if (!response.ok) throw new Error('Failed to apply coupon');
      return response.json();
    } catch (error) {
      console.error('Error applying coupon:', error);
      throw error;
    }
  },
};
