# Lib Directory

Library utilities and mock data.

## mockData.ts

Mock data for development and testing.

**Contains:**
- Mock services with various categories
- Mock users and staff members
- Mock appointments
- Mock branches/locations
- Mock inventory items
- Mock offers and coupons

**Usage:**

```javascript
import { mockServices, mockUsers, mockAppointments } from '@/lib/mockData';

// Display mock data in dev
console.log(mockServices);
```

**Format:**
- Services: name, price, duration, category, discount
- Users: name, email, phone, profile
- Appointments: date, time, status, serviceIds
- Staff: specialization, availability, rating

## When to Use

- Development without backend
- Testing components
- UI demos
- Placeholder content

## Switching to Real Data

Replace mock data imports with API service calls:

```javascript
// Before
import { mockServices } from '@/lib/mockData';

// After
import { serviceService } from '@/services/api';
const mockServices = await serviceService.getAll();
```

## Related Files
- `/services/api` - Replace with real API calls
- `/store` - Manages data fetching
- `/types` - Type definitions for mock data