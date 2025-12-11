// Razorpay Payment Integration Service

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface CreateOrderRequest {
  appointment_id: number;
  amount: number;
  description?: string;
}

interface CreateOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

class RazorpayService {
  private apiBaseUrl: string;
  private bypassMode: boolean;

  constructor() {
    this.apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api';
    // Set to true to bypass payment gateway (for testing without Razorpay credentials)
    this.bypassMode = true;
  }

  /**
   * Load Razorpay script dynamically
   */
  loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  /**
   * Create Razorpay order via backend
   */
  async createOrder(data: CreateOrderRequest, token: string): Promise<CreateOrderResponse> {
    // Bypass mode - return mock order
    if (this.bypassMode) {
      console.log('💳 Payment bypassed (test mode) - no Razorpay configured');
      return {
        order_id: `mock_order_${Date.now()}`,
        amount: data.amount * 100,
        currency: 'INR',
        key_id: 'mock_key_bypass',
      };
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create payment order');
      }

      return await response.json();
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  }

  /**
   * Verify payment on backend
   */
  async verifyPayment(
    paymentData: RazorpayResponse,
    appointmentId: number,
    token: string
  ): Promise<any> {
    // Bypass mode - return mock success
    if (this.bypassMode) {
      console.log('✅ Payment verification bypassed (test mode)');
      return {
        success: true,
        message: 'Payment bypassed - test mode enabled',
        payment: {
          id: Date.now(),
          status: 'completed',
          amount: 0,
        },
      };
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/payments/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...paymentData,
          appointment_id: appointmentId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Payment verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Verify payment error:', error);
      throw error;
    }
  }

  /**
   * Open Razorpay checkout modal
   */
  async openCheckout(
    orderData: CreateOrderResponse,
    userDetails: {
      name: string;
      email: string;
      phone: string;
    },
    onSuccess: (response: RazorpayResponse) => void,
    onFailure: (error: any) => void
  ): Promise<void> {
    const scriptLoaded = await this.loadRazorpayScript();

    if (!scriptLoaded) {
      onFailure(new Error('Failed to load Razorpay SDK'));
      return;
    }

    const options: RazorpayOptions = {
      key: orderData.key_id,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Naturals Salon',
      description: 'Appointment Payment',
      order_id: orderData.order_id,
      handler: onSuccess,
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.phone,
      },
      theme: {
        color: '#000000',
      },
      modal: {
        ondismiss: () => {
          onFailure(new Error('Payment cancelled by user'));
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  }

  /**
   * Complete payment flow
   */
  async processPayment(
    appointmentId: number,
    amount: number,
    userDetails: {
      name: string;
      email: string;
      phone: string;
    },
    token: string,
    onSuccess: () => void,
    onFailure: (error: string) => void
  ): Promise<void> {
    try {
      // Step 1: Create order on backend
      const orderData = await this.createOrder(
        {
          appointment_id: appointmentId,
          amount: amount,
          description: `Appointment booking for ${userDetails.name}`,
        },
        token
      );

      // Bypass mode - skip Razorpay modal and verify immediately
      if (this.bypassMode) {
        const mockResponse: RazorpayResponse = {
          razorpay_payment_id: `mock_pay_${Date.now()}`,
          razorpay_order_id: orderData.order_id,
          razorpay_signature: 'mock_signature_bypass',
        };
        await this.verifyPayment(mockResponse, appointmentId, token);
        onSuccess();
        return;
      }

      // Step 2: Open Razorpay checkout
      await this.openCheckout(
        orderData,
        userDetails,
        async (razorpayResponse) => {
          try {
            // Step 3: Verify payment on backend
            await this.verifyPayment(razorpayResponse, appointmentId, token);
            onSuccess();
          } catch (error: any) {
            onFailure(error.message || 'Payment verification failed');
          }
        },
        (error) => {
          onFailure(error.message || 'Payment failed');
        }
      );
    } catch (error: any) {
      onFailure(error.message || 'Failed to initiate payment');
    }
  }
}

export default new RazorpayService();
