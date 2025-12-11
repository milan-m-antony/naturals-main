import React, { useState } from 'react';
import { Gift, Check, X } from 'lucide-react';
import { couponService } from '../../services/api/couponService';

interface CouponInputProps {
  totalAmount: number;
  onDiscountApplied: (discount: number, couponCode: string) => void;
  onDiscountRemoved: () => void;
}

const CouponInput: React.FC<CouponInputProps> = ({
  totalAmount,
  onDiscountApplied,
  onDiscountRemoved,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await couponService.validate(couponCode.toUpperCase(), totalAmount);

      if (result && result.valid) {
        setAppliedCoupon(result.code);
        setDiscountAmount(result.discount_amount);
        setSuccess(`Coupon applied! You saved ₹${result.discount_amount.toFixed(2)}`);
        onDiscountApplied(result.discount_amount, result.code);
        setCouponCode('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid coupon code');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setError('');
    setSuccess('');
    setCouponCode('');
    onDiscountRemoved();
  };

  if (appliedCoupon) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-400 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-bold text-green-700 dark:text-green-400">Coupon Applied</p>
              <p className="text-sm text-green-600 dark:text-green-300">
                {appliedCoupon} • Saved ₹{discountAmount.toFixed(2)}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
        <Gift className="w-4 h-4 inline mr-2 text-yellow-500" />
        Coupon Code (Optional)
      </label>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          disabled={loading}
          className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white font-bold uppercase focus:outline-none focus:border-yellow-400"
        />
        <button
          onClick={handleValidateCoupon}
          disabled={loading}
          className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Checking...' : 'Apply'}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {success && (
        <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
      )}
    </div>
  );
};

export default CouponInput;
