# QUICK START GUIDE

## Setup

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve  # http://localhost:8000
```

### Frontend
```bash
npm install
npm run dev  # http://localhost:5173
```

## Environment Variables

**Backend (.env):**
```
DB_DATABASE=naturals_db
DB_USERNAME=root
DB_PASSWORD=
JWT_SECRET=(auto-generated)
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:8000
```

## Default Accounts

**Admin:**
- Email: admin@naturals.com
- Password: admin123

**Customer:**
- Register via Auth Modal

## File Locations

### Customer Features
- Booking wizard: `src/components/booking/BookingWizard.tsx`
- User dashboard: `src/components/booking/Step0_Dashboard.tsx`
- Reviews tab: `src/components/user/UserReviews.tsx`
- Bookings: `src/components/user/UserBookings.tsx`

### Admin Features
- Owner dashboard: `src/components/admin/OwnerDashboard.tsx`
- Reschedule requests: `src/components/admin/modules/AdminRescheduleRequests.tsx`
- Service management: `src/components/admin/modules/AdminInventory.tsx`

### Backend
- Controllers: `backend/app/Http/Controllers/`
- Models: `backend/app/Models/`
- Migrations: `backend/database/migrations/`
- Routes: `backend/routes/api.php`

## Database Tables
- users, services, appointments, bookings
- service_reviews (new)
- appointment_reschedules (new)

## API Testing
```bash
# Get services with ratings
curl http://localhost:8000/api/services

# Submit review (requires auth)
curl -X POST http://localhost:8000/api/services/1/reviews \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"rating": 5, "review": "Great service!"}'

# Request reschedule
curl -X POST http://localhost:8000/api/appointments/1/reschedule \
  -H "Authorization: Bearer {token}" \
  -d '{"new_date": "2024-12-20", "new_time": "14:00"}'
```

## Common Issues

**Migration error:** Run `php artisan migrate:fresh`  
**Port conflict:** Change port in vite.config.ts or php artisan serve --port=8001  
**CORS error:** Check `backend/config/cors.php` allows localhost:5173  
**Auth token:** Stored in localStorage as 'auth_token'
