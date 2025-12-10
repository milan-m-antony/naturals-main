# BACKEND-FRONTEND INTEGRATION

## API Connection

**Base URL:** `process.env.VITE_API_URL || 'http://localhost:8000'`  
**Auth Token:** Stored in `localStorage.getItem('auth_token')`  
**Headers:** `Authorization: Bearer {token}`

## Service Files

**Location:** `src/services/api/`

```typescript
// Example API service pattern
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
  'Content-Type': 'application/json',
});

export const fetchData = async () => {
  const response = await fetch(`${API_URL}/api/endpoint`, {
    headers: getAuthHeaders(),
  });
  return response.json();
};
```

## Key Integrations

### 1. Service Reviews
**Frontend:** `src/components/service/ServiceCard.tsx`  
**Backend:** `AppointmentController::submitServiceReview()`  
**Flow:**
1. User completes appointment
2. Clicks "Rate" in UserBookings
3. Submits rating (1-5) + review text
4. POST to `/api/services/{id}/reviews`
5. Backend calculates average rating
6. ServiceCard displays ⭐ X.X (count)

### 2. Appointment Reschedule
**Frontend:** `src/components/user/UserBookings.tsx`  
**Backend:** `AppointmentController::requestReschedule()`  
**Flow:**
1. User clicks "Reschedule" on booking
2. Selects new date/time + reason
3. POST to `/api/appointments/{id}/reschedule`
4. Backend creates reschedule request (status: pending)
5. Auto-navigates to booking page
6. Admin approves/rejects in AdminRescheduleRequests

### 3. Authentication
**Frontend:** `src/context/DataContext.tsx`  
**Backend:** `AuthController`  
**Flow:**
1. User submits login form
2. POST to `/api/login` with email/password
3. Backend validates and returns { user, token }
4. Frontend stores token in localStorage
5. All subsequent requests include Bearer token

### 4. Booking System
**Frontend:** `src/components/booking/BookingWizard.tsx`  
**Backend:** `AppointmentController::store()`  
**Steps:**
1. Step1: Select services
2. Step2: Choose date/time
3. Step3: Review & confirm
4. POST to `/api/appointments`
5. Step4: Success page

## Error Handling

```typescript
// Frontend pattern
try {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
} catch (error) {
  console.error('API Error:', error);
  showToast('error', error.message);
}
```

## Backend Controllers

**AppointmentController:**
- `index()` - Get user appointments
- `store()` - Create appointment
- `submitServiceReview()` - Submit review
- `requestReschedule()` - Request reschedule
- `approveReschedule()` - Approve/reject (admin)

**ServiceController:**
- `index()` - Get services with ratings
- `show()` - Get single service

**AuthController:**
- `register()` - Create account
- `login()` - Authenticate
- `logout()` - Invalidate token

## Database Relationships

```
User
├─ hasMany: Appointments
└─ hasMany: ServiceReviews

Service
├─ hasMany: ServiceReviews
└─ hasMany: Appointments

Appointment
├─ belongsTo: User
├─ belongsTo: Service
├─ hasOne: ServiceReview
└─ hasMany: AppointmentReschedules

ServiceReview
├─ belongsTo: User
├─ belongsTo: Service
└─ belongsTo: Appointment

AppointmentReschedule
├─ belongsTo: Appointment
└─ belongsTo: Staff (User)
```

## Environment Setup

**Backend (.env):**
```
DB_DATABASE=naturals_db
FRONTEND_URL=http://localhost:5173
JWT_SECRET=auto-generated
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:8000
```

## CORS Configuration

**backend/config/cors.php:**
```php
'paths' => ['api/*'],
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

## Testing Integration

**Check Backend:**
```bash
curl http://localhost:8000/api/services
```

**Check Auth:**
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'
```

**Check Protected Route:**
```bash
curl http://localhost:8000/api/appointments \
  -H "Authorization: Bearer YOUR_TOKEN"
```
