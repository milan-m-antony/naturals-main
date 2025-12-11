# Razorpay Integration - Setup Guide

## ✅ What's Included

The Razorpay payment gateway has been fully integrated into your Naturals Salon app:

### Backend (Laravel)
- ✅ Razorpay PHP SDK installed (`razorpay/razorpay`)
- ✅ PaymentController with create order & verify endpoints
- ✅ Configuration file at `backend/config/razorpay.php`
- ✅ Environment variables setup

### Frontend (React)
- ✅ Razorpay service at `src/services/razorpayService.ts`
- ✅ Booking confirmation component updated
- ✅ Automatic Razorpay SDK loading
- ✅ Payment verification flow

---

## 🚀 Setup Instructions

### Step 1: Get Razorpay Credentials

1. Sign up at [https://razorpay.com](https://razorpay.com)
2. Go to Dashboard → Settings → API Keys
3. Generate Test/Live API Keys
4. Copy **Key ID** and **Key Secret**

### Step 2: Configure Backend

1. Open `backend/.env` file
2. Add your Razorpay credentials:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxx
```

**For Testing:** Use test keys (starts with `rzp_test_`)
**For Production:** Use live keys (starts with `rzp_live_`)

### Step 3: Verify Installation

```bash
# Navigate to backend
cd backend

# Check if Razorpay package is installed
composer show razorpay/razorpay
```

---

## 🔄 Payment Flow

### How It Works:

1. **User selects services** → Chooses date/time → Confirms booking
2. **Selects payment method**:
   - Credit/Debit Card
   - UPI/Wallets
   - Pay at Venue (no online payment)
3. **Clicks "Pay via Razorpay"**:
   - Frontend creates order via backend API
   - Backend creates Razorpay order
   - Returns order ID and amount
4. **Razorpay Checkout opens**:
   - User enters payment details
   - Completes payment
5. **Payment verification**:
   - Razorpay sends response with payment ID
   - Frontend sends to backend for verification
   - Backend verifies signature
   - Updates payment status in database
6. **Booking confirmed** → User sees success page

---

## 📡 API Endpoints

### 1. Create Order
```
POST /api/payments/create-order
Authorization: Bearer {token}

Request:
{
  "appointment_id": 123,
  "amount": 1500,
  "description": "Appointment booking"
}

Response:
{
  "order_id": "order_xxxxxxxxxxxxx",
  "amount": 150000,
  "currency": "INR",
  "key_id": "rzp_test_xxxxxxxxx"
}
```

### 2. Verify Payment
```
POST /api/payments/verify
Authorization: Bearer {token}

Request:
{
  "razorpay_payment_id": "pay_xxxxxxxxxxxxx",
  "razorpay_order_id": "order_xxxxxxxxxxxxx",
  "razorpay_signature": "xxxxxxxxxxxxxxxxxxxxxxx",
  "appointment_id": 123
}

Response:
{
  "success": true,
  "message": "Payment verified successfully",
  "payment": {
    "id": 456,
    "status": "completed",
    ...
  }
}
```

---

## 🧪 Testing

### Test Card Numbers (Razorpay Test Mode)

**Success:**
- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name

**Failure:**
- Card: `4000 0000 0000 0002`
- This will simulate a failed payment

### Test UPI
- UPI ID: `success@razorpay`
- This will auto-approve in test mode

### Testing Steps:

1. Ensure `.env` has test keys (`rzp_test_...`)
2. Start backend: `cd backend && php artisan serve`
3. Start frontend: `npm run dev`
4. Go through booking flow
5. Select Card/UPI payment
6. Use test credentials above
7. Complete payment
8. Verify booking is confirmed

---

## 🔒 Security Features

✅ **Payment signature verification** - All payments verified server-side
✅ **HTTPS enforcement** - Required in production
✅ **JWT authentication** - Protected endpoints
✅ **Order ID validation** - Prevents replay attacks
✅ **Amount verification** - Checks payment amount matches order
✅ **Webhook support** - Real-time payment updates (optional)

---

## 🌐 Frontend Integration

The Razorpay integration is already added to:

**File:** `src/components/booking/Step3_Confirm.tsx`

Features:
- Automatic SDK loading
- Payment error handling
- Loading states
- Success/failure callbacks
- User-friendly error messages

**File:** `src/services/razorpayService.ts`

Methods:
- `loadRazorpayScript()` - Loads Razorpay SDK
- `createOrder()` - Creates order via backend
- `verifyPayment()` - Verifies payment
- `openCheckout()` - Opens Razorpay modal
- `processPayment()` - Complete flow handler

---

## 💳 Payment Methods Supported

Via Razorpay:
- ✅ Credit Cards (Visa, Mastercard, Amex, etc.)
- ✅ Debit Cards
- ✅ UPI (Google Pay, PhonePe, Paytm, etc.)
- ✅ Wallets (Paytm, Mobikwik, etc.)
- ✅ Net Banking
- ✅ EMI options (if enabled)

---

## ⚙️ Configuration Options

### Backend Config (`backend/config/razorpay.php`)
```php
return [
    'key_id' => env('RAZORPAY_KEY_ID'),
    'key_secret' => env('RAZORPAY_KEY_SECRET'),
];
```

### Frontend Config
Update `src/services/razorpayService.ts`:
- `apiBaseUrl` - Your backend API URL
- `theme.color` - Razorpay checkout theme color
- `name` - Business name shown in checkout

---

## 📊 Database Schema

**payments table:**
```sql
id
appointment_id
user_id
razorpay_order_id
razorpay_payment_id
razorpay_signature
amount
currency (default: INR)
status (pending/completed/failed)
payment_method
notes
created_at
updated_at
```

---

## 🚨 Common Issues

### Issue: "Payment gateway not configured"
**Solution:** 
- Check `.env` has `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
- Run `php artisan config:clear`
- Restart Laravel server

### Issue: Razorpay checkout doesn't open
**Solution:**
- Check browser console for errors
- Ensure Razorpay script loads (check Network tab)
- Verify key_id in response is correct

### Issue: Payment verification fails
**Solution:**
- Check signature validation in backend
- Ensure key_secret matches in `.env`
- Verify order_id and payment_id are correct

### Issue: CORS errors
**Solution:**
- Update `backend/config/cors.php`
- Add your frontend URL to allowed origins
- Clear config cache: `php artisan config:clear`

---

## 🔄 Webhooks (Optional Enhancement)

For production, set up webhooks to handle:
- Payment success/failure notifications
- Refund processing
- Subscription renewals

**Setup:**
1. Go to Razorpay Dashboard → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
3. Select events: `payment.captured`, `payment.failed`
4. Create webhook secret
5. Add to `.env`: `RAZORPAY_WEBHOOK_SECRET=whsec_xxxxx`

---

## 📈 Going Live

### Checklist:

- [ ] Get live API keys from Razorpay
- [ ] Update `.env` with live keys
- [ ] Enable HTTPS on your domain
- [ ] Test live payments with small amounts
- [ ] Set up webhooks for production
- [ ] Configure settlement account
- [ ] Enable required payment methods
- [ ] Set payment limits if needed
- [ ] Test refund flow
- [ ] Monitor payment analytics

---

## 💰 Pricing

Razorpay charges:
- **Domestic cards:** 2% per transaction
- **UPI:** 0% (free during promotional period)
- **Wallets:** 2% per transaction
- **International cards:** 3% + ₹3 per transaction

Check latest pricing at [razorpay.com/pricing](https://razorpay.com/pricing)

---

## 📞 Support

**Razorpay:**
- Dashboard: [dashboard.razorpay.com](https://dashboard.razorpay.com)
- Docs: [razorpay.com/docs](https://razorpay.com/docs)
- Support: support@razorpay.com

**Integration:**
- Backend: Check `backend/app/Http/Controllers/PaymentController.php`
- Frontend: Check `src/services/razorpayService.ts`
- Test mode enabled by default

---

## ✅ Quick Test

```bash
# 1. Start backend
cd backend
php artisan serve

# 2. Start frontend (in another terminal)
npm run dev

# 3. Test flow:
# - Go to http://localhost:3000
# - Select services
# - Choose date/time
# - Click "Confirm Booking"
# - Select "Credit/Debit Card" or "UPI"
# - Click "Pay via Razorpay"
# - Use test card: 4111 1111 1111 1111
# - Complete payment
# - Booking should be confirmed!
```

---

**🎉 Razorpay integration complete and ready to use!**

For any issues, check the browser console and Laravel logs (`backend/storage/logs/laravel.log`).
