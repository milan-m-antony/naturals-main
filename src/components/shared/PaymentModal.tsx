import React, { useState, useEffect } from 'react';
import { X, Loader, Check, AlertCircle } from 'lucide-react';
import { paymentService } from '../../services/api/paymentService';

interface PaymentModalProps {
  isOpen: boolean;
  appointmentId: number;
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  appointmentId,
  amount,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && !razorpayLoaded) {
      paymentService.loadRazorpayScript().then(setRazorpayLoaded);
    }
  }, [isOpen, razorpayLoaded]);

  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded) {
      setError('Payment system not loaded. Please refresh and try again.');
      return;
    }

    setLoading(true);
    setPaymentStatus('processing');
    setError('');

    try {
      // Create order
      const order = await paymentService.createOrder(appointmentId, amount);

      // Open Razorpay checkout
      paymentService.openCheckout(
        order,
        async (response: any) => {
          try {
            // Verify payment
            await paymentService.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            setPaymentStatus('success');
            setTimeout(() => {
              onSuccess();
              onClose();
            }, 2000);
          } catch (err) {
            setPaymentStatus('error');
            setError('Payment verification failed');
          } finally {
            setLoading(false);
          }
        },
        (error: any) => {
          setPaymentStatus('error');
          setError('Payment failed. Please try again.');
          setLoading(false);
        }
      );
    } catch (err) {
      setPaymentStatus('error');
      setError(err instanceof Error ? err.message : 'Payment setup failed');
      setLoading(false);
    }
  };

  const handleCOD = () => {
    setPaymentStatus('success');
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Choose Payment Method</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Amount Display */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Amount</p>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">₹{amount.toFixed(2)}</p>
          </div>

          {/* Payment Methods */}
          {paymentStatus === 'idle' && (
            <>
              {/* Razorpay */}
              <label className="flex items-center gap-4 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-yellow-400 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <p className="font-bold text-gray-900 dark:text-white">Online Payment</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Card, UPI, Net Banking (Razorpay)
                  </p>
                </div>
              </label>

              {/* Cash on Delivery */}
              <label className="flex items-center gap-4 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-yellow-400 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <p className="font-bold text-gray-900 dark:text-white">Pay at Salon</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Pay during your appointment
                  </p>
                </div>
              </label>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={paymentMethod === 'razorpay' ? handleRazorpayPayment : handleCOD}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader className="w-4 h-4 animate-spin" />}
                  {paymentMethod === 'razorpay' ? 'Pay Online' : 'Proceed'}
                </button>
              </div>
            </>
          )}

          {/* Processing State */}
          {paymentStatus === 'processing' && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader className="w-8 h-8 animate-spin text-yellow-400" />
              <p className="text-center text-gray-700 dark:text-gray-300">Processing payment...</p>
            </div>
          )}

          {/* Success State */}
          {paymentStatus === 'success' && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-center font-bold text-gray-900 dark:text-white">Payment Successful!</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Your appointment is confirmed.
              </p>
            </div>
          )}

          {/* Error State */}
          {paymentStatus === 'error' && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-center font-bold text-gray-900 dark:text-white">Payment Failed</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">{error}</p>
              <button
                onClick={() => setPaymentStatus('idle')}
                className="mt-4 px-6 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
