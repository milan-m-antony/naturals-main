# NATURALS Salon - Kanjirappally

Modern beauty salon booking & management system.

## Quick Start

**Backend:**
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

**Frontend:**
```bash
npm install
npm run dev
```

**URLs:** http://localhost:3000 (frontend) | http://localhost:8000 (backend)

## Features

**Customer:** Booking wizard | Payment (Razorpay) | User accounts | Dark mode | Responsive

**Admin/Manager:** Dashboard | Appointments | Staff & leaves | Inventory | POS | Payroll | Reports | Coupons & Banners

**Owner:** All admin features + Content management (Hero Carousel, Service Categories, Curated Services, Media Library) + Shop settings

## Login Credentials

```
Owner:    owner@naturals.com    / owner123
Manager:  manager@naturals.com  / manager123
Staff:    staff@naturals.com    / staff123
```

## Tech Stack

React 18 + TypeScript + Vite + Tailwind | Laravel 10 + PostgreSQL + JWT | Razorpay

## Payment Mode

**Status:** Bypass mode (testing)

**Enable production:** Add Razorpay keys to `backend/.env` and set `bypassMode = false` in `src/services/razorpayService.ts`

---

See `.github/copilot-instructions.md` for development guidelines and [CHECKLIST.md](CHECKLIST.md) for tested features.
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
