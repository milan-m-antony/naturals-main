// Payment Service for Razorpay integration

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getAuthHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
  'Content-Type': 'application/json',
});

export interface PaymentOrder {
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  payment_id: number;
}

export const paymentService = {
  // Create Razorpay order
  createOrder: async (appointmentId: number, amount: number, description?: string) => {
    try {
      const response = await fetch(`${API_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({
          appointment_id: appointmentId,
          amount,
          description,
        }),
      });

      if (!response.ok) throw new Error('Failed to create order');
      return response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Verify payment
  verifyPayment: async (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) => {
    try {
      const response = await fetch(`${API_URL}/api/payments/verify`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
        }),
      });

      if (!response.ok) throw new Error('Payment verification failed');
      return response.json();
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  },

  // Get payment status
  getStatus: async (appointmentId: number) => {
    try {
      const response = await fetch(
        `${API_URL}/api/payments/${appointmentId}/status`,
        { headers: getAuthHeader() }
      );

      if (!response.ok) throw new Error('Failed to fetch payment status');
      return response.json();
    } catch (error) {
      console.error('Error fetching payment status:', error);
      return null;
    }
  },

  // Request refund
  refund: async (paymentId: number, amount?: number, reason?: string) => {
    try {
      const response = await fetch(`${API_URL}/api/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({
          amount,
          reason,
        }),
      });

      if (!response.ok) throw new Error('Refund failed');
      return response.json();
    } catch (error) {
      console.error('Error requesting refund:', error);
      throw error;
    }
  },

  // Load Razorpay script
  loadRazorpayScript: (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  },

  // Open Razorpay checkout
  openCheckout: (
    order: PaymentOrder,
    onSuccess: (response: any) => void,
    onError: (error: any) => void
  ) => {
    const options = {
      key: order.key_id,
      amount: order.amount * 100, // Amount in paise
      currency: order.currency,
      order_id: order.order_id,
      handler: onSuccess,
      prefill: {
        name: localStorage.getItem('user_name') || '',
        email: localStorage.getItem('user_email') || '',
      },
      theme: {
        color: '#facc15', // Yellow theme
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.on('payment.failed', onError);
    razorpay.open();
  },
};
