# Payment Bypass Mode - Testing Without Razorpay

## 🎯 Current Status: BYPASS MODE ENABLED ✅

Your app is now configured to **skip Razorpay payment gateway** completely. This allows you to test the booking flow without setting up Razorpay credentials.

---

## What's Changed

### ✅ Payment Flow Now:
1. User selects services → Date/Time → Confirm
2. Chooses payment method (Card/UPI/Venue)
3. Clicks "Pay via Razorpay" → **Payment skipped automatically**
4. Booking confirmed immediately without payment processing
5. Console shows: `💳 Payment bypassed (test mode) - no Razorpay configured`

### 🔧 File Modified:
- **`src/services/razorpayService.ts`**
  - Added `bypassMode: true` flag
  - Mock order creation (no backend API call)
  - Mock payment verification (returns success immediately)
  - Skips Razorpay checkout modal entirely

- **`src/components/booking/Step3_Confirm.tsx`**
  - Shows "Test Mode - Payment Bypassed" message
  - Indicates Razorpay not configured

---

## 🔄 How to Toggle Bypass Mode

### To ENABLE Bypass (Skip Razorpay) - **CURRENT STATE**
In `src/services/razorpayService.ts`, line ~54:
```typescript
constructor() {
  this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  // Set to true to bypass payment gateway (for testing without Razorpay credentials)
  this.bypassMode = true;  // ← Currently TRUE
}
```

### To DISABLE Bypass (Use Real Razorpay)
```typescript
constructor() {
  this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  this.bypassMode = false;  // ← Change to FALSE
}
```

**After changing:**
1. Save the file
2. Vite will auto-reload
3. App will use real Razorpay (requires credentials in `.env`)

---

## 📋 Testing Bypass Mode

### Test Steps:
1. ✅ Open app at `http://localhost:3000`
2. ✅ Select any services (e.g., Haircut, Facial)
3. ✅ Choose date and time
4. ✅ Sign in (or create account)
5. ✅ On Step 3, select **"Credit/Debit Card"** or **"UPI/Wallets"**
6. ✅ Click **"Pay ₹X via Razorpay"**
7. ✅ **Payment bypassed** - Booking confirmed immediately!
8. ✅ See success message

### What You'll See:
- No Razorpay modal popup
- Instant booking confirmation
- Browser console shows bypass messages
- Yellow info message: "Test Mode - Payment Bypassed"

---

## 🚀 When to Use Real Razorpay

### Switch to `bypassMode = false` when:
- Ready to accept real payments
- Have Razorpay credentials configured
- Testing actual payment flow
- Going to production

### Requirements for Real Razorpay:
1. Razorpay account at [razorpay.com](https://razorpay.com)
2. API keys from Razorpay dashboard
3. Backend `.env` configured:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxx
   ```
4. Set `bypassMode = false` in `razorpayService.ts`

---

## 🔍 How Bypass Works

### Order Creation (bypassed):
```typescript
// Real flow: POST /api/payments/create-order
// Bypass flow: Returns mock data immediately
{
  order_id: 'mock_order_1733936400000',
  amount: 150000,  // Amount in paise
  currency: 'INR',
  key_id: 'mock_key_bypass'
}
```

### Payment Verification (bypassed):
```typescript
// Real flow: POST /api/payments/verify + signature check
// Bypass flow: Returns success immediately
{
  success: true,
  message: 'Payment bypassed - test mode enabled',
  payment: {
    id: 1733936400000,
    status: 'completed',
    amount: 0
  }
}
```

### Razorpay Modal (bypassed):
```typescript
// Real flow: Opens Razorpay checkout modal
// Bypass flow: Skips modal completely, calls onSuccess() directly
```

---

## 📊 Backend Impact

### With Bypass Mode:
- ❌ No API calls to `/api/payments/create-order`
- ❌ No API calls to `/api/payments/verify`
- ❌ No payment records in database
- ✅ Bookings still created normally
- ✅ Appointment confirmations work

### Without Bypass Mode:
- ✅ API calls to backend payment endpoints
- ✅ Razorpay order creation
- ✅ Payment verification with signature
- ✅ Payment records in database
- ⚠️ Requires Razorpay credentials configured

---

## 🐛 Troubleshooting

### "Payment gateway not configured" Error
**Cause:** Backend doesn't have Razorpay credentials

**Fix:**
- ✅ Bypass mode already enabled - error shouldn't appear
- If it does, ensure `bypassMode = true` in `razorpayService.ts`
- Refresh browser after saving

### Bypass not working
**Check:**
1. `src/services/razorpayService.ts` line 54-56
2. Ensure `this.bypassMode = true;`
3. Save file and wait for Vite to reload
4. Clear browser cache if needed
5. Check console for bypass messages

### Want to see Razorpay modal
**To test real Razorpay:**
1. Get test keys from [razorpay.com](https://razorpay.com)
2. Add to `backend/.env`
3. Set `bypassMode = false`
4. Restart both frontend and backend

---

## ⚙️ Environment Configuration

### Frontend (Bypass Mode)
No configuration needed! Works out of the box.

### Backend (For Future Real Razorpay)
File: `backend/.env`
```env
# Razorpay Configuration (not needed in bypass mode)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
```

---

## 🎨 User Experience

### Bypass Mode UI:
- Shows all payment methods (Card/UPI/Venue)
- Button says "Pay ₹X via Razorpay"
- Yellow info badge: "Test Mode - Payment Bypassed"
- No actual payment modal
- Instant confirmation

### Real Razorpay UI:
- Shows all payment methods
- Opens Razorpay secure checkout
- User enters card/UPI details
- Real payment processing
- Confirmation after successful payment

---

## 📝 Notes

- ✅ **Safe for development** - No real money involved
- ✅ **Quick testing** - Skip payment setup during development
- ✅ **Easy toggle** - One variable change to switch modes
- ⚠️ **Don't use in production** - Always disable bypass for live apps
- 💡 **Console logs** - Check browser console for bypass confirmations

---

## 🔐 Security Note

**Bypass mode is for DEVELOPMENT ONLY:**
- Mock signatures accepted
- No real verification
- No payment records
- Anyone can book without paying

**Before going live:**
1. Set `bypassMode = false`
2. Configure real Razorpay credentials
3. Test with small amounts
4. Enable webhooks
5. Monitor transactions

---

## ✅ Quick Reference

| Feature | Bypass Mode | Real Razorpay |
|---------|-------------|---------------|
| Razorpay credentials needed | ❌ No | ✅ Yes |
| Payment modal shows | ❌ No | ✅ Yes |
| Backend API calls | ❌ Skipped | ✅ Made |
| Payment records | ❌ No | ✅ Yes |
| Bookings created | ✅ Yes | ✅ Yes |
| Money charged | ❌ No | ✅ Yes |
| Setup time | 0 minutes | 15-30 minutes |
| Good for testing | ✅ Perfect | ⚠️ Use test mode |

---

**Current Mode:** ✅ **BYPASS ENABLED** - Payment gateway skipped

**To implement real payments:** See `RAZORPAY_SETUP.md`

**Happy testing! 🚀**
