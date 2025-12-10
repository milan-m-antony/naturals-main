# API REFERENCE

Base URL: `http://localhost:8000/api`  
Auth Header: `Authorization: Bearer {token}`

## Services

**Get All Services**
```
GET /services
Response: [{ id, name, price, duration, category_id, rating, reviews_count }]
```

**Get Service Reviews**
```
GET /services/{id}/reviews?page=1
Response: { data: [{ id, rating, review, user_name, created_at }], meta }
```

**Submit Service Review** (Auth)
```
POST /services/{id}/reviews
Body: { rating: 1-5, review: "text", appointment_id?: number }
Response: { message, review }
```

## Appointments

**Get User Appointments** (Auth)
```
GET /appointments
Response: [{ id, service, date, time, status }]
```

**Create Appointment** (Auth)
```
POST /appointments
Body: { service_id, date, time, notes? }
Response: { appointment }
```

**Request Reschedule** (Auth)
```
POST /appointments/{id}/reschedule
Body: { new_date, new_time, reason? }
Response: { message, reschedule_request }
```

## Reschedule Requests

**Get Reschedule Requests** (Auth)
```
GET /reschedule-requests?page=1
Response: { data: [{ id, appointment, original_date, new_date, status }] }
```

**Approve/Reject Reschedule** (Staff/Admin)
```
PATCH /reschedule-requests/{id}
Body: { status: "approved"|"rejected", admin_notes? }
Response: { message, reschedule }
```

## Reviews

**Get User's Reviews** (Auth)
```
GET /my-reviews
Response: [{ id, service_name, rating, review, created_at }]
```

## Auth

**Register**
```
POST /register
Body: { name, email, password, password_confirmation, phone? }
Response: { user, token }
```

**Login**
```
POST /login
Body: { email, password }
Response: { user, token }
```

**Logout** (Auth)
```
POST /logout
Response: { message }
```

## Categories

**Get Categories**
```
GET /service-categories?active=true
Response: [{ id, name, description, image, service_count }]
```

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Server Error
