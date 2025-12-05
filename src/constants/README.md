# Constants Directory

Application-wide constants and configuration.

## Files

### app.constants.ts

**API Configuration**
- Base API URL
- API timeout
- Request headers

**Enums**
- Appointment statuses
- User roles (customer, owner, manager, staff)
- Payment methods
- Service categories

**Constants**
- Default pagination size
- Max file upload size
- Feature flags
- App version

## Usage

```javascript
import { API_BASE_URL, APPOINTMENT_STATUS, USER_ROLES } from '@/constants';

const isApproved = status === APPOINTMENT_STATUS.APPROVED;

if (role === USER_ROLES.OWNER) {
  // Owner-only logic
}
```

## Adding New Constants

1. Add to appropriate section in `app.constants.ts`
2. Export from `index.ts`
3. Use throughout app with path alias

```javascript
import { YOUR_CONSTANT } from '@/constants';
```

## Best Practices

- Use UPPER_SNAKE_CASE for constants
- Group related constants together
- Document constant purposes
- Avoid magic numbers/strings
- Update when adding features