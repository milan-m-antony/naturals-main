# Services Directory

API service layer for backend communication.

## Structure

### `/api`
API client and service modules for REST endpoints.

**apiClient.ts** - Axios instance with base config
- Base URL: http://127.0.0.1:8000/api
- Headers and interceptors
- Error handling

**Services:**

- **authService.ts** - Authentication endpoints
  - Login/Signup
  - Token management
  - Logout

- **serviceService.ts** - Service management
  - Get all services
  - Filter by category
  - Search services
  - Get single service

- **appointmentService.ts** - Booking operations
  - Create appointment
  - Get user appointments
  - Cancel appointment
  - Update appointment status

- **branchService.ts** - Branch/location data
  - Get all branches
  - Get branch details

- **staffService.ts** - Staff information
  - Get all staff
  - Get staff specialization
  - Staff availability

- **inventoryService.ts** - Inventory management
  - Get inventory items
  - Check stock levels
  - Update inventory

**index.ts** - Barrel export for all services

## Usage

```javascript
import { serviceService, appointmentService } from '@/services/api';

// Get services
const services = await serviceService.getAll();

// Book appointment
const appointment = await appointmentService.create({
  serviceIds: [1, 2],
  date: '2025-12-25',
  time: '10:00',
});
```

## Error Handling

All services include error handling:

```javascript
try {
  const data = await serviceService.getAll();
} catch (error) {
  const message = error.response?.data?.message || 'Error occurred';
  console.error(message);
}
```

## Response Format

Standard API response format:

```javascript
{
  success: true,
  data: { /* response data */ },
  message: 'Optional message'
}
```

## Configuration

Base URL configured in `apiClient.ts`:
- Development: http://127.0.0.1:8000/api
- Backend: Laravel API server

## Related Files
- `/types` - Type definitions for API responses
- `/store` - Uses these services for data fetching
- `/hooks` - Custom hooks that use services