# NATURALS Beauty Salon - Kanjirappally

Complete beauty salon management system with customer booking and admin dashboards.

## Tech Stack
- **Frontend:** React 18 + TypeScript + Tailwind CSS + Vite
- **Backend:** Laravel PHP + MySQL
- **Auth:** JWT tokens

## Features

### Customer Portal
- 🗓️ Multi-step booking wizard
- ⭐ Service reviews & ratings (1-5 stars)
- 📅 Appointment reschedule requests
- 👤 User dashboard with bookings & reviews
- 🎨 Dark mode support
- 📱 Fully responsive

### Admin Dashboards

**Owner Dashboard:**
- Business analytics & reports
- Service management (CRUD)
- Staff management
- Reschedule request approvals
- Full system access

**Manager/Receptionist:**
- Appointment calendar
- POS billing system
- Staff scheduling
- Walk-in bookings

**Staff/Stylist:**
- Personal schedule view
- Appointment management
- Task completion tracking

## Quick Start

### Frontend Setup
```bash
npm install
npm run dev
```
Access at: `http://localhost:5173`

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```
Access at: `http://localhost:8000`

## Recent Features (Session 7)
- ⭐ Per-service rating system with auto-calculated averages
- 📝 "My Reviews" dashboard tab for customers
- 🔄 Appointment reschedule system with admin approval
- 📊 Admin reschedule management interface
- 🗄️ New database tables: `service_reviews`, `appointment_reschedules`
- 🔌 6 new API endpoints for reviews & reschedules

## Documentation
- `QUICK_START.md` - Detailed setup guide
- `API_REFERENCE.md` - API endpoints reference
- `BACKEND_FRONTEND_INTEGRATION.md` - Integration guide
- `copilot-instructions.md` - Development guidelines
- `feature.md` - Feature specifications

## Theme
- **Colors:** Yellow (#facc15), White, Black
- **No gradients** (locked design)
- **Dark mode:** Full support with `dark:` prefixes
- **Borders:** 2px rounded

## Project Structure
```
src/
├── components/
│   ├── admin/          # Admin dashboards
│   ├── booking/        # Booking wizard
│   ├── user/           # Customer dashboard
│   └── service/        # Service cards & menus
├── services/api/       # API service layer
└── context/            # Global state

backend/
├── app/
│   ├── Models/         # Eloquent models
│   └── Http/Controllers/
├── database/migrations/
└── routes/api.php
```

## License
Proprietary - NATURALS Salon Kanjirappally
