# Backend Development TODO List

**Status:** Backend foundation phase  
**Priority:** High - Core infrastructure needed for frontend integration  
**Deadline:** 2 weeks

## Phase 1: Backend Setup & Authentication (Priority: 🔴 HIGH)

### Environment & Database Setup
- [ ] **Setup .env file**
  - Copy .env.example to .env
  - Set DB_CONNECTION=pgsql
  - Configure DB_HOST, DB_NAME, DB_USER, DB_PASSWORD
  - Set SANCTUM_STATEFUL_DOMAINS=localhost:3001
  - Set CORS_ALLOWED_ORIGINS=http://localhost:3001

- [ ] **Run composer install**
  ```bash
  composer install
  ```

- [ ] **Generate application key**
  ```bash
  php artisan key:generate
  ```

- [ ] **Generate JWT secret** (if using JWT)
  ```bash
  php artisan jwt:secret
  ```

- [ ] **Create PostgreSQL database**
  ```bash
  createdb naturals_salon
  ```

### Database Migrations
- [ ] **Create User migration** (if not exists)
  - Fields: id, name, email, password, phone, role, profile_image, membership_tier, total_visits, total_spent, timestamps

- [ ] **Create Service migration**
  - Fields: id, name, category, sub_category, description, price, duration, image, slots, discount, includes (JSON), is_members_only, offer_valid_until, rating, reviews_count, timestamps

- [ ] **Create Branch migration**
  - Fields: id, name, address, city, state, phone, email, is_active, timestamps

- [ ] **Create Staff migration**
  - Fields: id, user_id (FK), branch_id (FK), specialty, rating, avatar, is_available, timestamps

- [ ] **Create Appointment migration**
  - Fields: id, user_id (FK), staff_id (FK), branch_id (FK), service_ids (JSON), date, time, customer_name, customer_phone, customer_email, total_price, status, payment_method, payment_status, notes, rating, review, timestamps

- [ ] **Create Inventory migration**
  - Fields: id, name, category, stock, unit, threshold, status, timestamps

- [ ] **Create LeaveRequest migration**
  - Fields: id, staff_id (FK), start_date, end_date, reason, status, timestamps

- [ ] **Run all migrations**
  ```bash
  php artisan migrate
  ```

### Authentication Implementation
- [ ] **Setup Sanctum** (Laravel's built-in API auth)
  - Install: `composer require laravel/sanctum`
  - Publish: `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"`
  - Migrate: `php artisan migrate`

- [ ] **Update AuthController**
  - [ ] `register()` - Create user, return token
  - [ ] `login()` - Validate credentials, return token
  - [ ] `logout()` - Revoke current token
  - [ ] `me()` - Return current user
  - [ ] `refresh()` - Refresh token (if using JWT)
  - [ ] Error handling for invalid credentials

- [ ] **Test authentication endpoints**
  - Register new user
  - Login with valid credentials
  - Login with invalid credentials
  - Get current user with token
  - Logout

- [ ] **Setup middleware**
  - [ ] Create `role` middleware for role-based access
  - [ ] Apply to admin routes in api.php

---

## Phase 2: Core API Implementation (Priority: 🔴 HIGH)

### Service Management
- [ ] **Update ServiceController**
  - [ ] `index()` - List services with filtering (category, search)
  - [ ] `show()` - Get service by ID
  - [ ] `store()` - Create service (admin only)
  - [ ] `update()` - Update service (admin only)
  - [ ] `destroy()` - Delete service (admin only)

- [ ] **Update Service Model**
  - [ ] Define relationships
  - [ ] Add scopes for filtering
  - [ ] Add helper methods (getDiscountedPrice, etc)

- [ ] **Test service endpoints**
  - Get all services
  - Filter by category
  - Search by name
  - Get single service
  - Create (admin)
  - Update (admin)
  - Delete (admin)

### Appointment Management
- [ ] **Update AppointmentController**
  - [ ] `index()` - List user's appointments (with filtering)
  - [ ] `show()` - Get appointment by ID
  - [ ] `store()` - Create appointment
    - [ ] Validate service availability
    - [ ] Check staff availability
    - [ ] Create appointment
    - [ ] Return confirmation
  - [ ] `update()` - Update appointment (customer can update notes)
  - [ ] `updateStatus()` - Change status (admin/staff only)
  - [ ] `destroy()` - Cancel appointment

- [ ] **Update Appointment Model**
  - [ ] Define relationships (user, staff, branch, services)
  - [ ] Add validation for time slots
  - [ ] Add status transition logic
  - [ ] Add scopes for filtering by status, date

- [ ] **Implement Staff Availability Check**
  - [ ] Create method: `isStaffAvailable(staffId, date, time, duration)`
  - [ ] Query appointments for conflicts
  - [ ] Consider staff leave requests

- [ ] **Test appointment endpoints**
  - Create appointment (valid)
  - Create appointment (slot taken)
  - Create appointment (staff unavailable)
  - List user appointments
  - Update appointment status
  - Cancel appointment

### Branch Management
- [ ] **Update BranchController**
  - [ ] `index()` - List all branches
  - [ ] `show()` - Get branch details
  - [ ] `store()` - Create branch (admin only)
  - [ ] `update()` - Update branch (admin only)
  - [ ] `destroy()` - Delete branch (admin only)

- [ ] **Update Branch Model**
  - [ ] Define relationships (staff, appointments)
  - [ ] Add helper methods

- [ ] **Test branch endpoints**
  - Get all branches
  - Get single branch
  - Create branch (admin)
  - Update branch (admin)
  - Delete branch (admin)

### Staff Management
- [ ] **Update StaffController**
  - [ ] `index()` - List staff (with filtering)
  - [ ] `show()` - Get staff details
  - [ ] `leaveRequests()` - Get staff leave requests
  - [ ] `submitLeaveRequest()` - Submit leave request
  - [ ] `updateLeaveRequest()` - Approve/reject leave

- [ ] **Update Staff Model**
  - [ ] Define relationships (user, branch, appointments, leaveRequests)
  - [ ] Add helper methods (getAvailability, etc)

- [ ] **Test staff endpoints**
  - List all staff
  - Get staff by ID
  - Submit leave request
  - Approve leave request
  - Reject leave request

---

## Phase 3: Admin Features (Priority: 🟠 MEDIUM)

### Inventory Management
- [ ] **Update InventoryController**
  - [ ] `index()` - List inventory with filtering
  - [ ] `show()` - Get item details
  - [ ] `store()` - Create item (admin only)
  - [ ] `update()` - Update stock & status
  - [ ] `destroy()` - Delete item (admin only)

- [ ] **Update Inventory Model**
  - [ ] Add logic for status calculation
  - [ ] Add scopes for filtering (status, category)

- [ ] **Test inventory endpoints**
  - List inventory
  - Filter by status
  - Update stock
  - Create inventory item
  - Delete inventory item

### Admin Statistics & Reporting
- [ ] **Create StatsController** (new)
  - [ ] `overview()` - Dashboard overview
    - Total revenue
    - Total appointments this month
    - Total customers
    - Average rating
  - [ ] `appointmentStats()` - Appointment analytics
  - [ ] `revenueStats()` - Revenue breakdown
  - [ ] `staffPerformance()` - Staff statistics
  - [ ] `customerAnalytics()` - Customer data

- [ ] **Create database queries for stats**
  - [ ] Sum revenue by date range
  - [ ] Count appointments by status
  - [ ] Calculate staff performance metrics
  - [ ] Get top performing services

- [ ] **Test statistics endpoints**
  - Get dashboard overview
  - Get monthly revenue
  - Get staff performance

### Role-Based Access Control
- [ ] **Create/Update role middleware**
  - [ ] `role:admin,owner` - Owner and admin only
  - [ ] `role:staff` - Staff only
  - [ ] Apply to routes

- [ ] **Test access control**
  - Admin can access admin routes
  - Staff cannot access admin routes
  - Customer can access appointment routes

---

## Phase 4: Database Seeding (Priority: 🟠 MEDIUM)

### Create Seeders
- [ ] **UserSeeder**
  - [ ] Create 1 owner user
  - [ ] Create 2 admin users
  - [ ] Create 5 staff members
  - [ ] Create 10 customer users

- [ ] **BranchSeeder**
  - [ ] Create 3-5 salon branches
  - [ ] Add realistic addresses & contact info

- [ ] **StaffSeeder**
  - [ ] Assign staff to branches
  - [ ] Set specialties & ratings

- [ ] **ServiceSeeder**
  - [ ] Create 30+ services
  - [ ] Organize by category
  - [ ] Add pricing & duration

- [ ] **InventorySeeder**
  - [ ] Create 50+ inventory items
  - [ ] Set stock levels & thresholds

- [ ] **AppointmentSeeder**
  - [ ] Create 100+ sample appointments
  - [ ] Distribute across branches & staff
  - [ ] Vary statuses

### Run Seeders
- [ ] Create DatabaseSeeder.php with all seeder calls
- [ ] Run: `php artisan db:seed`
- [ ] Verify data in database

---

## Phase 5: Testing & Validation (Priority: 🟠 MEDIUM)

### API Testing
- [ ] **Test all endpoints** (use Postman/Insomnia)
  - [ ] Public endpoints (no auth)
  - [ ] Protected endpoints (with auth)
  - [ ] Admin endpoints (role-based)

- [ ] **Test error scenarios**
  - [ ] Invalid credentials
  - [ ] Missing required fields
  - [ ] Unauthorized access
  - [ ] Resource not found (404)

- [ ] **Test edge cases**
  - [ ] Staff availability conflicts
  - [ ] Overbooking attempts
  - [ ] Expired tokens
  - [ ] Concurrent requests

### Frontend Integration Testing
- [ ] **Connect frontend to backend**
  - Update VITE_API_URL in frontend .env
  - Test login flow
  - Test service browsing
  - Test booking creation
  - Test appointment viewing

- [ ] **Test user flows**
  - [ ] Customer: Browse → Book → Pay
  - [ ] Staff: View appointments → Update status
  - [ ] Admin: View dashboard → Manage inventory

---

## Phase 6: Advanced Features (Priority: 🟡 LOW)

### Payment Processing
- [ ] **Integrate Razorpay** (for India)
  - [ ] Install SDK
  - [ ] Create payment route
  - [ ] Create payment controller
  - [ ] Handle webhooks

- [ ] **Alternative: Stripe** (international)
  - [ ] Install Stripe SDK
  - [ ] Create payment endpoint
  - [ ] Handle payment intents

### Notifications
- [ ] **Email notifications**
  - [ ] Appointment confirmation
  - [ ] Reminder before appointment
  - [ ] Appointment completion

- [ ] **SMS notifications** (Twilio)
  - [ ] Booking confirmation
  - [ ] Appointment reminders

### Additional Features
- [ ] **Review & Rating System**
  - [ ] Store ratings in appointments
  - [ ] Calculate service ratings
  - [ ] Display reviews on services

- [ ] **Membership Logic**
  - [ ] Membership tiers
  - [ ] Discount logic
  - [ ] Loyalty points

- [ ] **Coupon System**
  - [ ] Create coupons
  - [ ] Validate coupons
  - [ ] Apply discounts

---

## Phase 7: Deployment & Optimization (Priority: 🟡 LOW)

### Performance
- [ ] **Add caching**
  - Cache services list
  - Cache branch data
  - Cache staff availability

- [ ] **Optimize queries**
  - Add indexes to database
  - Use eager loading
  - Avoid N+1 queries

- [ ] **Rate limiting**
  - Prevent API abuse
  - Throttle login attempts

### Security
- [ ] **CORS configuration**
  - Only allow frontend domain
  - Restrict methods

- [ ] **Input validation**
  - Sanitize all inputs
  - Validate data types
  - Implement request validation

- [ ] **SQL injection prevention**
  - Use parameterized queries
  - Use Laravel's query builder

### Testing
- [ ] **Write unit tests**
  - Test controller logic
  - Test model methods

- [ ] **Write integration tests**
  - Test API endpoints
  - Test with database

---

## Testing Checklist

### ✅ Core Features
- [ ] User registration works
- [ ] User login works
- [ ] Services load correctly
- [ ] Can create appointment
- [ ] Can view appointments
- [ ] Can cancel appointment
- [ ] Can update staff availability
- [ ] Can manage inventory

### ✅ Admin Features
- [ ] Can create service
- [ ] Can edit service
- [ ] Can delete service
- [ ] Can view dashboard stats
- [ ] Can manage staff
- [ ] Can view reports

### ✅ Security
- [ ] Unauthenticated users blocked from protected routes
- [ ] Staff can't access admin routes
- [ ] Customers can only see their own appointments
- [ ] JWT tokens expire correctly
- [ ] CORS is properly configured

---

## Common Issues & Solutions

### Issue: CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Update `config/cors.php` with frontend URL

### Issue: Token Invalid
```
Unauthenticated
```
**Solution:** Ensure token is being sent in header: `Authorization: Bearer <token>`

### Issue: Database Connection Failed
```
SQLSTATE[HY000]
```
**Solution:** Check PostgreSQL is running, verify .env credentials

### Issue: Migration Error
```
SQLSTATE[HY000]: Column not found
```
**Solution:** Check migration syntax, run `php artisan migrate:refresh` carefully

---

## Useful Resources

- Laravel Docs: https://laravel.com/docs
- Sanctum Auth: https://laravel.com/docs/sanctum
- Eloquent ORM: https://laravel.com/docs/eloquent
- API Best Practices: https://laravel.com/docs/routing#json-endpoints
- PostgreSQL: https://www.postgresql.org/docs/

---

## Progress Tracking

**Week 1 Goal:** Setup + Auth (Phases 1-2)
- [ ] Environment configured
- [ ] Database migrations complete
- [ ] Authentication working
- [ ] Core APIs functional

**Week 2 Goal:** Admin features + Testing (Phases 3-5)
- [ ] Admin endpoints complete
- [ ] Inventory management working
- [ ] Frontend integration tested
- [ ] All critical endpoints tested

---

**Last Updated:** December 5, 2025  
**Assigned To:** Backend Developer  
**Status:** Ready to start  
**Estimated Effort:** 80-100 hours over 2 weeks