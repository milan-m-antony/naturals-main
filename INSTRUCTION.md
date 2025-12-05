# Backend Development & Integration Instructions

**Important:** Do NOT push to GitHub until explicitly approved.

## Current Status

### ✅ Completed Modules (Frontend)
1. **UI/UX** - Fully responsive, mobile-optimized (2-column grids)
2. **Authentication** - Login/Register flows with localStorage persistence
3. **Booking System** - 5-step wizard (services → schedule → confirm → payment → success)
4. **Admin Dashboards** - Owner/Manager/Staff interfaces
5. **User Account** - Profile, bookings, favorites, notifications, offers, spendings
6. **Service Management** - Browse, filter, search, wishlist
7. **Type Safety** - Full TypeScript with no `any` types in business logic
8. **Documentation** - 11 comprehensive README files across all src/ directories
9. **Git Repository** - Initialized, committed, pushed to GitHub

### ⏳ Partially Complete (Backend)
1. **Database Models** - All 7 models created (User, Service, Appointment, Staff, Branch, Inventory, LeaveRequest)
2. **API Routes** - Basic routing structure in place
3. **Controllers** - 7 controllers exist but need implementation
4. **Migrations** - Need to be created and tested
5. **Seeders** - Need sample data

### 📋 Pending (Backend Implementation)
See BACKEND_TODO.md for detailed task list

---

## Architecture Overview

### Frontend Stack
- **React** 19.2 + TypeScript
- **Vite** 6.2 (dev server at localhost:3001)
- **Tailwind CSS** 3.4 (responsive design)
- **Context API** (state management)
- **Axios** (HTTP client)

### Backend Stack
- **Laravel** 11 (PHP framework)
- **Laravel Sanctum** (API token authentication)
- **PostgreSQL** (database)
- **Eloquent ORM** (data layer)

### API Communication
```
Frontend (React) ←→ HTTP/JSON ←→ Backend (Laravel)
                    with JWT/Bearer tokens
```

---

## API Endpoint Structure

### Public Routes (No Auth Required)
```
POST   /api/register              - User registration
POST   /api/login                 - User login
GET    /api/services              - List all services
GET    /api/services/{id}         - Get service details
GET    /api/branches              - List all branches
GET    /api/branches/{id}         - Get branch details
GET    /api/staff                 - List all staff
GET    /api/staff/{id}            - Get staff details
```

### Protected Routes (Auth Required)
```
POST   /api/logout                - User logout
POST   /api/refresh               - Refresh JWT token
GET    /api/me                    - Get current user

GET    /api/appointments          - List user appointments
GET    /api/appointments/{id}     - Get appointment details
POST   /api/appointments          - Create appointment
PUT    /api/appointments/{id}     - Update appointment
PATCH  /api/appointments/{id}/status - Update appointment status
DELETE /api/appointments/{id}     - Cancel appointment

GET    /api/leave-requests        - List leave requests
POST   /api/leave-requests        - Submit leave request
PATCH  /api/leave-requests/{id}   - Approve/reject leave request
```

### Admin-Only Routes
```
POST   /api/services              - Create service
PUT    /api/services/{id}         - Update service
DELETE /api/services/{id}         - Delete service

POST   /api/branches              - Create branch
PUT    /api/branches/{id}         - Update branch
DELETE /api/branches/{id}         - Delete branch

GET    /api/inventory             - List inventory
GET    /api/inventory/{id}        - Get inventory item
POST   /api/inventory             - Create inventory item
PUT    /api/inventory/{id}        - Update inventory item
DELETE /api/inventory/{id}        - Delete inventory item
```

---

## Data Models

### User
```typescript
{
  id: number
  name: string
  email: string (unique)
  password: string (hashed)
  phone?: string
  role: 'owner' | 'admin' | 'staff' | 'customer'
  profile_image?: string
  membership_tier?: string
  total_visits?: number
  total_spent?: number
  created_at: timestamp
  updated_at: timestamp
}
```

### Service
```typescript
{
  id: number
  name: string
  category: string
  sub_category?: string
  description: string
  price: number
  duration: number (minutes)
  image?: string
  slots?: number
  discount?: number
  includes?: string[]
  is_members_only?: boolean
  offer_valid_until?: date
  rating?: number
  reviews_count?: number
  created_at: timestamp
  updated_at: timestamp
}
```

### Appointment
```typescript
{
  id: number
  user_id: number (FK to User)
  staff_id: number (FK to Staff)
  branch_id: number (FK to Branch)
  service_ids: number[] (many services)
  date: date
  time: time
  customer_name: string
  customer_phone?: string
  customer_email?: string
  total_price: number
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Pending' | 'In Progress'
  payment_method?: 'Card' | 'UPI' | 'Cash' | 'Pay at Venue'
  payment_status?: 'Paid' | 'Pending' | 'Refunded'
  notes?: string
  rating?: number (1-5)
  review?: string
  created_at: timestamp
  updated_at: timestamp
}
```

### Staff
```typescript
{
  id: number
  user_id: number (FK to User)
  branch_id: number (FK to Branch)
  specialty?: string
  rating: number
  avatar?: string
  is_available: boolean
  created_at: timestamp
  updated_at: timestamp
}
```

### Branch
```typescript
{
  id: number
  name: string
  address: string
  city: string
  state: string
  phone: string
  email?: string
  is_active: boolean
  created_at: timestamp
  updated_at: timestamp
}
```

### Inventory
```typescript
{
  id: number
  name: string
  category: string
  stock: number
  unit: string
  threshold: number
  status: 'In Stock' | 'Low Stock' | 'Critical'
  created_at: timestamp
  updated_at: timestamp
}
```

### LeaveRequest
```typescript
{
  id: number
  staff_id: number (FK to Staff)
  start_date: date
  end_date: date
  reason: string
  status: 'Pending' | 'Approved' | 'Rejected'
  created_at: timestamp
  updated_at: timestamp
}
```

---

## Frontend Features Requiring Backend

### 1. Authentication
- ✅ Login/Register UI
- ⏳ Backend: authService endpoints

### 2. Booking System
- ✅ Service browsing & selection
- ✅ Schedule picker
- ✅ Payment method selection
- ⏳ Backend: Create appointment API
- ⏳ Backend: Validate staff availability
- ⏳ Backend: Payment processing

### 3. Appointment Management
- ✅ View bookings
- ✅ Cancel appointment
- ✅ Add reviews/ratings
- ⏳ Backend: Fetch user appointments
- ⏳ Backend: Update appointment status

### 4. Admin Dashboards
- ✅ Overview (stats, charts)
- ✅ Staff management
- ✅ Inventory management
- ✅ Reports & analytics
- ⏳ Backend: Admin endpoints
- ⏳ Backend: Statistics queries

### 5. User Profile
- ✅ View/edit profile
- ✅ View membership
- ✅ Spending history
- ✅ Notifications
- ⏳ Backend: Update user profile
- ⏳ Backend: Membership logic

---

## Next Steps (Priority Order)

### Phase 1: Backend Foundation (Week 1)
1. Setup Laravel environment (see backend/README.md)
2. Create all database migrations
3. Implement User authentication (JWT/Sanctum)
4. Seed sample data (services, branches, staff)
5. Test auth endpoints

### Phase 2: Core API Implementation (Week 2)
1. Complete Service Controller
2. Complete Appointment Controller
3. Implement staff availability logic
4. Add appointment status updates
5. Test with frontend

### Phase 3: Admin Features (Week 3)
1. Complete Branch Controller
2. Complete Inventory Controller
3. Admin-only middleware
4. Statistics/reporting endpoints
5. Admin dashboard testing

### Phase 4: Advanced Features (Week 4)
1. Payment processing (Razorpay/Stripe)
2. Email notifications
3. SMS alerts (Twilio)
4. Review/rating system
5. Membership logic

### Phase 5: Testing & Deployment (Week 5)
1. Unit tests for controllers
2. API integration tests
3. Security audits
4. Performance optimization
5. Production deployment

---

## Running Frontend & Backend Locally

### Frontend
```bash
cd c:\projects\NATURALS-MAIN
npm install
npm run dev
# Opens at http://localhost:3001
```

### Backend
```bash
cd c:\projects\NATURALS-MAIN\backend
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret (if using JWT)
php artisan migrate --seed
php artisan serve
# Runs at http://localhost:8000
```

---

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

### Backend (.env)
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=naturals_salon
DB_USERNAME=postgres
DB_PASSWORD=password

SANCTUM_STATEFUL_DOMAINS=localhost:3001
CORS_ALLOWED_ORIGINS=http://localhost:3001

JWT_SECRET=generated_secret
APP_KEY=generated_key
```

---

## Testing API Endpoints

Use Postman or CLI:

```bash
# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get services
curl http://localhost:8000/api/services

# Create appointment (with token)
curl -X POST http://localhost:8000/api/appointments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"service_id":1,"staff_id":1,"date":"2025-01-15","time":"10:00"}'
```

---

## Common Issues & Solutions

### CORS Errors
- Ensure frontend URL in backend CORS config
- Clear browser cache
- Restart backend server

### Auth Token Expires
- Implement refresh token endpoint
- Auto-refresh on 401 response
- Handle logout on token expiry

### API Timeout
- Increase PHP timeout
- Add caching for frequent queries
- Optimize database queries

### Database Connection
- Verify PostgreSQL is running
- Check connection credentials in .env
- Run migrations: `php artisan migrate`

---

## Useful Commands

```bash
# Laravel
php artisan migrate              # Run migrations
php artisan migrate:rollback     # Revert migrations
php artisan db:seed              # Seed database
php artisan tinker               # Interactive shell
php artisan serve --port=8001    # Run on different port

# Git
git status                        # Check changes
git add .                         # Stage all
git commit -m "message"          # Commit (NOT PUSHED until approved)
git log --oneline                # View commits
```

---

## Contact & Support

For integration issues, check:
1. INTEGRATION_GUIDE.md - Detailed integration steps
2. API_TESTING.md - API testing procedures
3. Backend routes/api.php - Endpoint definitions
4. Frontend src/services/api/ - Service definitions

---

**Last Updated:** December 5, 2025
**Status:** Frontend Complete, Backend Pending
**Git Status:** Staged changes, not pushed to GitHub