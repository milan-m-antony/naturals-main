# Types Directory

TypeScript type definitions and interfaces.

## Core Types

### Service
Salon service offering.

```
id, name, category, price, duration, description, image, 
discount, slots, rating, reviews
```

### Appointment
Booking appointment.

```
id, userId, staffId, date, time, status, totalPrice, serviceIds
```

### User
Customer account.

```
id, name, email, phone, profileImage, membershipStatus, joinDate
```

### Staff
Salon staff member.

```
id, name, email, phone, specialization, rating, experience
```

### LeaveRequest
Staff leave request.

```
id, staffId, startDate, endDate, reason, status (pending/approved/rejected)
```

### Inventory
Inventory items.

```
id, name, category, quantity, unit, reorderLevel, supplier, lastRestocked
```

## Usage

Import types in components:

```javascript
import type { Service, User } from '@/types';

const handleService = (service: Service) => {
  console.log(service.name);
};
```

## Organization

- `service.types.ts` - Service related
- `appointment.types.ts` - Appointment related
- `user.types.ts` - User and auth related
- `inventory.types.ts` - Inventory related
- `common.types.ts` - Generic types
- `index.ts` - Exports all types

## Best Practices

- Always type function parameters
- Use optional `?` for non-required fields
- Keep types DRY (don't repeat yourself)
- Export from index for consistency
