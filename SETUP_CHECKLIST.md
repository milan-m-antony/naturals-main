# Naturals Salon - Complete Setup Checklist

## 🎯 Quick Start (5 Minutes)

### Prerequisites Check
- [ ] Node.js 18+ installed (`node --version`)
- [ ] PHP 8.1+ installed (`php --version`)
- [ ] Composer installed (`composer --version`)
- [ ] PostgreSQL 14+ installed and running
- [ ] Git installed

### Frontend Setup
```bash
# In project root
npm install
npm run dev
```
✅ Frontend should be running on http://localhost:3001

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
# Edit .env with your database credentials
php artisan key:generate
php artisan jwt:secret

# Create database
psql -U postgres -c "CREATE DATABASE naturals_salon;"

# Run migrations and seed
php artisan migrate:fresh --seed

# Start server
php artisan serve
```
✅ Backend should be running on http://localhost:8000

## 📋 Detailed Setup Steps

### 1. Environment Configuration

#### Frontend `.env`
- [ ] Created `.env` file in root
- [ ] Set `VITE_API_URL=http://localhost:8000/api`

#### Backend `backend/.env`
- [ ] Copied from `.env.example`
- [ ] Set `DB_CONNECTION=pgsql`
- [ ] Set `DB_DATABASE=naturals_salon`
- [ ] Set `DB_USERNAME` and `DB_PASSWORD`
- [ ] Set `CORS_ALLOWED_ORIGINS=http://localhost:3001`
- [ ] Generated `APP_KEY` with `php artisan key:generate`
- [ ] Generated `JWT_SECRET` with `php artisan jwt:secret`

### 2. Database Setup

- [ ] PostgreSQL service is running
- [ ] Database `naturals_salon` created
- [ ] Migrations run successfully (`php artisan migrate`)
- [ ] Seeder completed (`php artisan db:seed`)
- [ ] Verify data:
  ```sql
  psql -U postgres naturals_salon
  SELECT COUNT(*) FROM users;      -- Should be 5
  SELECT COUNT(*) FROM services;   -- Should be 5
  SELECT COUNT(*) FROM branches;   -- Should be 2
  \q
  ```

### 3. Backend Verification

- [ ] Server starts without errors
- [ ] Test API endpoint:
  ```bash
  curl http://localhost:8000/api/services
  ```
- [ ] Should return JSON array of services
- [ ] Check routes:
  ```bash
  php artisan route:list
  ```
- [ ] Should show all API routes

### 4. Frontend Verification

- [ ] Dev server starts without errors
- [ ] No TypeScript compilation errors
- [ ] Browser opens to http://localhost:3001
- [ ] Page loads without console errors
- [ ] Can navigate through the site

### 5. API Integration Testing

- [ ] **Login Test:**
  - Navigate to site
  - Click "Sign In"
  - Email: customer@example.com
  - Password: password
  - Should successfully login
  - Check localStorage for `auth_token`

- [ ] **Services Test:**
  - Browse services page
  - Services should load from API
  - Check Network tab for GET request to `/api/services`

- [ ] **Appointment Test (logged in):**
  - Start booking wizard
  - Select service, date, time
  - Complete booking
  - Check Network tab for POST to `/api/appointments`
  - Verify in database:
    ```sql
    psql -U postgres naturals_salon
    SELECT * FROM appointments ORDER BY created_at DESC LIMIT 1;
    \q
    ```

- [ ] **Admin Test:**
  - Logout
  - Login as: admin@naturals.in / password
  - Access admin dashboard
  - Should see admin features
  - Test inventory management

## 🔧 Component Checklist

### Frontend Structure
- [ ] `src/components/` - All components organized by feature
- [ ] `src/services/api/` - 7 API service modules created
- [ ] `src/hooks/` - 6 custom hooks created
- [ ] `src/types/` - TypeScript definitions centralized
- [ ] `src/store/` - DataContext provider set up

### Backend Structure
- [ ] `backend/app/Models/` - 7 Eloquent models
- [ ] `backend/app/Http/Controllers/` - 6 controllers
- [ ] `backend/database/migrations/` - 9 migration files
- [ ] `backend/routes/api.php` - All routes defined
- [ ] `backend/config/` - auth.php, jwt.php, cors.php configured

## 🧪 Feature Testing

### Customer Features
- [ ] Can register new account
- [ ] Can login/logout
- [ ] Can browse services
- [ ] Can filter services by category
- [ ] Can view service details
- [ ] Can create appointment
- [ ] Can view appointment history
- [ ] Can add services to favorites

### Staff Features
- [ ] Can login with staff account
- [ ] Can view assigned appointments
- [ ] Can update appointment status
- [ ] Can submit leave requests
- [ ] Can view schedule

### Admin Features
- [ ] Can login with admin account
- [ ] Can create new service
- [ ] Can update existing service
- [ ] Can delete service
- [ ] Can view all appointments
- [ ] Can manage inventory
- [ ] Can approve/reject leave requests

### Owner Features
- [ ] Can login with owner account
- [ ] Has all admin permissions
- [ ] Can create new branch
- [ ] Can view business overview

## 🔐 Security Checklist

- [ ] Passwords are hashed (bcrypt)
- [ ] JWT tokens are used for authentication
- [ ] Protected routes require authentication
- [ ] Role-based access control implemented
- [ ] CORS configured properly
- [ ] SQL injection protection (Eloquent ORM)
- [ ] XSS protection enabled
- [ ] Environment variables for sensitive data
- [ ] `.env` files not committed to git

## 📱 Responsive Design

- [ ] Site works on desktop (1920x1080)
- [ ] Site works on tablet (768px)
- [ ] Site works on mobile (375px)
- [ ] Bottom navigation shows on mobile
- [ ] Mobile menu works properly

## 🎨 UI/UX Testing

- [ ] Dark mode toggle works
- [ ] All buttons are clickable
- [ ] Forms submit correctly
- [ ] Loading states show during API calls
- [ ] Error messages display properly
- [ ] Success messages/toasts work
- [ ] Modals open and close
- [ ] Navigation works across all pages

## 🚀 Performance Checklist

### Frontend
- [ ] Vite HMR working
- [ ] No unnecessary re-renders
- [ ] Images load properly
- [ ] Lazy loading implemented where needed
- [ ] Build completes without warnings
  ```bash
  npm run build
  ```

### Backend
- [ ] Queries are optimized (use eager loading)
- [ ] Indexes on foreign keys
- [ ] No N+1 query problems
- [ ] API responses are fast (< 500ms)

## 📚 Documentation

- [ ] `README.md` - Project overview
- [ ] `SETUP.md` - Comprehensive setup guide
- [ ] `ARCHITECTURE.md` - Frontend architecture
- [ ] `backend/README.md` - API documentation
- [ ] `API_TESTING.md` - API testing guide
- [ ] `INTEGRATION_GUIDE.md` - Frontend-backend integration
- [ ] `PROJECT_SUMMARY.md` - Complete project summary

## 🔍 Code Quality

### Frontend
- [ ] No TypeScript errors
- [ ] All imports use `@/` aliases
- [ ] Components are properly typed
- [ ] Consistent code formatting
- [ ] No console errors in browser

### Backend
- [ ] No PHP syntax errors
- [ ] All routes defined
- [ ] Controllers follow RESTful conventions
- [ ] Models have proper relationships
- [ ] Validation rules in place

## 🐛 Common Issues & Solutions

### Issue: CORS Error
**Solution:**
```php
// backend/config/cors.php
'allowed_origins' => ['http://localhost:3001'],
```
Restart Laravel server.

### Issue: JWT Secret Not Set
**Solution:**
```bash
cd backend
php artisan jwt:secret
```

### Issue: Database Connection Failed
**Solution:**
- Check PostgreSQL is running
- Verify credentials in `backend/.env`
- Ensure database exists

### Issue: Migrations Fail
**Solution:**
```bash
cd backend
php artisan migrate:fresh
```

### Issue: Frontend Can't Connect to Backend
**Solution:**
- Verify backend is running on port 8000
- Check `VITE_API_URL` in frontend `.env`
- Clear browser cache

## 📊 Database Verification

```sql
-- Connect to database
psql -U postgres naturals_salon

-- Check all tables exist
\dt

-- Verify data
SELECT COUNT(*) FROM users;              -- 5
SELECT COUNT(*) FROM branches;           -- 2
SELECT COUNT(*) FROM services;           -- 5
SELECT COUNT(*) FROM staff;              -- 2
SELECT COUNT(*) FROM inventory;          -- 7

-- Check relationships
SELECT 
  u.name, 
  COUNT(a.id) as appointment_count 
FROM users u 
LEFT JOIN appointments a ON u.id = a.user_id 
GROUP BY u.name;

\q
```

## 🎓 Test User Accounts

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Owner | owner@naturals.in | password | Full system access |
| Admin | admin@naturals.in | password | Management features |
| Staff | priya@naturals.in | password | Staff operations |
| Customer | customer@example.com | password | Customer features |

## ✅ Final Verification

Run through this complete flow:

1. **Customer Journey:**
   - [ ] Register new account
   - [ ] Browse services
   - [ ] Add service to favorites
   - [ ] Book appointment
   - [ ] View booking confirmation
   - [ ] Check appointment in user dashboard
   - [ ] Logout

2. **Staff Journey:**
   - [ ] Login as staff
   - [ ] View assigned appointments
   - [ ] Update appointment status to "In Progress"
   - [ ] Submit leave request
   - [ ] Logout

3. **Admin Journey:**
   - [ ] Login as admin
   - [ ] Create new service
   - [ ] View all appointments
   - [ ] Update inventory stock
   - [ ] Approve leave request
   - [ ] Logout

4. **API Testing:**
   - [ ] Test with Postman/Thunder Client
   - [ ] All CRUD operations work
   - [ ] Authentication required for protected routes
   - [ ] Role checks work correctly

## 🎉 Success Criteria

Your project is ready when:

- ✅ All prerequisites installed
- ✅ Frontend runs without errors
- ✅ Backend runs without errors
- ✅ Database connected and seeded
- ✅ Can login with all test accounts
- ✅ Can create appointments
- ✅ API integration working
- ✅ No TypeScript errors
- ✅ No PHP errors
- ✅ All features tested
- ✅ Documentation complete

## 📞 Next Steps

After completing this checklist:

1. **Customize the application:**
   - Update branding/colors
   - Add your own services
   - Configure real payment gateway
   - Add email notifications

2. **Enhance features:**
   - SMS notifications
   - Online payments
   - Advanced analytics
   - Loyalty programs

3. **Deploy to production:**
   - Set up hosting (AWS, DigitalOcean, etc.)
   - Configure domain
   - Enable HTTPS
   - Set up CI/CD pipeline

4. **Monitor and maintain:**
   - Set up error tracking (Sentry)
   - Monitor performance
   - Regular backups
   - Keep dependencies updated

---

**Congratulations! 🎊**

You now have a complete, production-ready salon management system!

Happy coding! 🚀
