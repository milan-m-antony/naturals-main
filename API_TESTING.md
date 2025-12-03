# API Testing Guide

Quick reference for testing the Naturals Salon API endpoints.

## Base URL

```
http://localhost:8000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Test Accounts

```
Owner:    owner@naturals.in / password
Admin:    admin@naturals.in / password
Staff:    priya@naturals.in / password
Customer: customer@example.com / password
```

## Quick Test Scenarios

### 1. Register New User

```bash
POST /api/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password",
  "phone": "+91 98765 00000"
}
```

**Expected:** 201 Created with user object and JWT token

### 2. Login

```bash
POST /api/login
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "password"
}
```

**Expected:** 200 OK with user object and JWT token  
**Save the token** for subsequent requests

### 3. Get Current User

```bash
GET /api/me
Authorization: Bearer YOUR_TOKEN
```

**Expected:** 200 OK with user profile

### 4. Get All Services

```bash
GET /api/services
```

**Expected:** 200 OK with array of services (no auth required)

**Filter by category:**
```bash
GET /api/services?category=Hair
```

**Search:**
```bash
GET /api/services?search=facial
```

### 5. Get Single Service

```bash
GET /api/services/1
```

**Expected:** 200 OK with service object

### 6. Create Appointment (Customer)

```bash
POST /api/appointments
Authorization: Bearer CUSTOMER_TOKEN
Content-Type: application/json

{
  "branch_id": 1,
  "staff_id": 1,
  "date": "2024-02-15",
  "time": "14:00",
  "customer_name": "John Doe",
  "customer_phone": "+91 98765 43214",
  "customer_email": "customer@example.com",
  "services": [
    {
      "id": 1,
      "price": 499
    }
  ],
  "total_price": 499,
  "payment_method": "Pay at Venue",
  "notes": "Please call before arriving"
}
```

**Expected:** 201 Created with appointment object

### 7. Get My Appointments (Customer)

```bash
GET /api/appointments
Authorization: Bearer CUSTOMER_TOKEN
```

**Expected:** 200 OK with array of customer's appointments

**Filter by status:**
```bash
GET /api/appointments?status=Scheduled
```

**Filter by date:**
```bash
GET /api/appointments?date=2024-02-15
```

### 8. Update Appointment Status (Staff)

```bash
PATCH /api/appointments/1/status
Authorization: Bearer STAFF_TOKEN
Content-Type: application/json

{
  "status": "In Progress"
}
```

**Expected:** 200 OK with updated appointment

**Valid statuses:**
- Scheduled
- In Progress
- Completed
- Cancelled
- Pending

### 9. Get All Branches

```bash
GET /api/branches
```

**Expected:** 200 OK with array of active branches (no auth required)

### 10. Get Staff List

```bash
GET /api/staff
```

**Expected:** 200 OK with array of staff (no auth required)

**Filter by branch:**
```bash
GET /api/staff?branch_id=1
```

**Filter by availability:**
```bash
GET /api/staff?is_available=true
```

### 11. Submit Leave Request (Staff)

```bash
POST /api/leave-requests
Authorization: Bearer STAFF_TOKEN
Content-Type: application/json

{
  "start_date": "2024-02-20",
  "end_date": "2024-02-22",
  "reason": "Personal vacation"
}
```

**Expected:** 201 Created with leave request object

### 12. Get Leave Requests

```bash
GET /api/leave-requests
Authorization: Bearer STAFF_TOKEN
```

**Expected:** 200 OK with array of leave requests

### 13. Approve Leave Request (Admin)

```bash
PATCH /api/leave-requests/1
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "status": "Approved"
}
```

**Expected:** 200 OK with updated leave request

**Valid statuses:**
- Approved
- Rejected
- Pending

### 14. Create Service (Admin)

```bash
POST /api/services
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "name": "Deep Tissue Massage",
  "category": "Spa",
  "sub_category": "Massage",
  "price": 1599,
  "duration": 60,
  "description": "Relaxing deep tissue massage therapy",
  "slots": 5,
  "discount": 0,
  "is_active": true
}
```

**Expected:** 201 Created with service object

### 15. Get Inventory (Admin)

```bash
GET /api/inventory
Authorization: Bearer ADMIN_TOKEN
```

**Expected:** 200 OK with array of inventory items

**Filter by status:**
```bash
GET /api/inventory?status=Low Stock
```

**Filter by category:**
```bash
GET /api/inventory?category=Hair Care
```

### 16. Update Inventory Stock (Admin)

```bash
PUT /api/inventory/1
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "stock": 50
}
```

**Expected:** 200 OK with updated inventory item  
**Note:** Status is automatically calculated based on stock and threshold

### 17. Create Branch (Owner)

```bash
POST /api/branches
Authorization: Bearer OWNER_TOKEN
Content-Type: application/json

{
  "name": "Naturals Whitefield",
  "address": "ITPL Main Road",
  "city": "Bangalore",
  "state": "Karnataka",
  "phone": "+91 80 4112 3458",
  "email": "whitefield@naturals.in",
  "is_active": true
}
```

**Expected:** 201 Created with branch object

### 18. Logout

```bash
POST /api/logout
Authorization: Bearer YOUR_TOKEN
```

**Expected:** 200 OK with success message

### 19. Refresh Token

```bash
POST /api/refresh
Authorization: Bearer YOUR_TOKEN
```

**Expected:** 200 OK with new JWT token

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```

**Cause:** Missing or invalid token

### 403 Forbidden
```json
{
  "message": "Forbidden - Insufficient permissions"
}
```

**Cause:** User role doesn't have access to this endpoint

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

**Cause:** Invalid ID or resource doesn't exist

### 422 Validation Error
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 6 characters."]
  }
}
```

**Cause:** Invalid input data

## Testing with cURL

### Example: Complete Login Flow

```bash
# 1. Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "password"
  }'

# Save the token from response

# 2. Get profile
curl -X GET http://localhost:8000/api/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 3. Create appointment
curl -X POST http://localhost:8000/api/appointments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "branch_id": 1,
    "staff_id": 1,
    "date": "2024-02-15",
    "time": "14:00",
    "customer_name": "John Doe",
    "services": [{"id": 1, "price": 499}],
    "total_price": 499
  }'
```

## Testing with Postman

### Setup

1. Create a new collection: "Naturals Salon API"
2. Set collection variable `base_url` = `http://localhost:8000/api`
3. Create environment with `token` variable

### Pre-request Script (Collection Level)

```javascript
pm.environment.set("token", pm.environment.get("token"));
```

### Test Script for Login

```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.token);
}
```

### Authorization Setup

Add to collection authorization:
- Type: Bearer Token
- Token: `{{token}}`

## Testing with Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create new request
3. Set environment variable `token`
4. Use `{{token}}` in Bearer Token field
5. Save response token using Tests tab:
   ```javascript
   tc.setVar("token", json.token);
   ```

## Common Testing Workflows

### Customer Journey
1. Register → Login → Browse Services → Create Appointment → View Appointments

### Staff Journey
1. Login → View Assigned Appointments → Update Status → Submit Leave Request

### Admin Journey
1. Login → Manage Services → View All Appointments → Manage Inventory → Approve Leave

### Owner Journey
1. Login → View Business Overview → Create Branch → Manage Staff → View Reports

## Database Reset

To reset database with fresh seed data:

```bash
cd backend
php artisan migrate:fresh --seed
```

**Warning:** This deletes all data!

## Tips

- **Always check response status codes** before reading the body
- **Save tokens** from login/register responses
- **Use correct role** for protected endpoints
- **Check validation errors** in 422 responses
- **Refresh tokens** before they expire (60 minutes)
- **Include Content-Type** header for POST/PUT requests

## Quick Reference Table

| Endpoint | Method | Auth | Role Required |
|----------|--------|------|---------------|
| /api/register | POST | No | None |
| /api/login | POST | No | None |
| /api/services | GET | No | None |
| /api/appointments | GET | Yes | Any |
| /api/appointments | POST | Yes | Any |
| /api/leave-requests | POST | Yes | Staff |
| /api/inventory | GET | Yes | Admin/Owner |
| /api/branches | POST | Yes | Admin/Owner |

Full API documentation: See `backend/README.md`
