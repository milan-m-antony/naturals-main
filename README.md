# NATURALS Salon - Kanjirappally

Modern beauty salon booking & management system.

---

## 🚀 Quick Start

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Frontend
```bash
npm install
npm run dev
```

**URLs:** Frontend: `http://localhost:3000` | Backend: `http://localhost:8000`

---

## ✨ Features

### Customer
- 🗓️ Online booking (4-step wizard with animations)
- 💳 Payment (Razorpay: Card/UPI/Venue)
- 🔐 User accounts
- 🌙 Dark mode
- 📱 Responsive

### Admin (Manager)
- 📊 Dashboard
- 📅 Appointments
- 👥 Staff & leaves
- 📦 Inventory
- 💰 POS
- 💵 Payroll
- 📈 Reports
- 🎟️ Coupons & Banners

### Owner (All manager features +)
- **Content Management:**
  - Service Categories
  - Hero Carousel
  - Curated Services
  - Website Features
  - Discount Coupons
  - Promotional Banners
  - Media Library (separate storage per section)
- ⚙️ Shop settings
- 🎯 Service menu
- 🔄 Reschedule requests

---

## 🔑 Login

```
Owner:    owner@naturals.com    / owner123
Manager:  manager@naturals.com  / manager123
Staff:    staff@naturals.com    / staff123
```

---

## 💳 Payment

**Status:** Bypass mode (testing without credentials)

**Enable:**
1. Get keys from [razorpay.com](https://razorpay.com)
2. Add to `backend/.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxx
   ```
3. Set `bypassMode = false` in `src/services/razorpayService.ts`

📖 **Details:** `PAYMENT_BYPASS_MODE.md`

---

## 🛠️ Tech Stack

**Frontend:** React 18 + TypeScript + Vite + TailwindCSS  
**Backend:** Laravel 10 + PostgreSQL + JWT  
**Payment:** Razorpay PHP SDK

---

## 📁 Structure

```
src/
├── components/
│   ├── booking/       # Booking wizard
│   └── admin/
│       └── modules/   # Admin features
├── services/          # API services
└── styles/            # Animations

backend/
├── app/Http/Controllers/
├── database/migrations/
└── routes/
```

---

## 📖 Docs

- `STATUS.md` - Project status
- `PAYMENT_BYPASS_MODE.md` - Payment setup
- `UI_ENHANCEMENTS.md` - UI features
- `RAZORPAY_SETUP.md` - Payment guide

---

## 🎨 Highlights

### Booking Flow
1. Select Services
2. Choose Date & Time
3. Payment & Confirmation (animated)
4. Success (confetti effect)

### Payment Options
- Card (Razorpay)
- UPI/Wallets
- Pay at Venue

### Content Management
**Separate media per section:**
- Upload/delete images & videos
- Section-specific galleries
- Preview modal

---

## 🐛 Troubleshooting

**Backend:**
```bash
php artisan config:clear
php artisan cache:clear
```

**Payment:** Check `bypassMode` in `razorpayService.ts`

**Database:**
```bash
php artisan migrate:fresh --seed
```

**Logs:**  
Frontend: Browser console  
Backend: `backend/storage/logs/laravel.log`

---

**Built for NATURALS Salon, Kanjirappally**
