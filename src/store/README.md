# Store Directory

Global state management using React Context API.

## DataContext

Main context managing application data and API calls.

### Provided State

**Data:**
- `services` - Array of all services
- `appointments` - Array of appointments
- `staff` - Array of staff members
- `branches` - Array of branches
- `inventory` - Array of inventory items

**Loading States:**
- `loadingServices` - Loading state for services
- `loadingAppointments` - Loading state for appointments

**Functions:**
- `fetchServices()` - Fetch all services
- `fetchAppointments()` - Fetch appointments
- `fetchStaff()` - Fetch staff list
- `createAppointment(data)` - Book appointment
- `updateAppointment(id, data)` - Update appointment
- `createService(service)` - Create service
- `deleteService(id)` - Delete service

### Usage

```javascript
import { useData } from '@/store';

function MyComponent() {
  const { services, loadingServices } = useData();
  
  if (loadingServices) return <Loading />;
  
  return services.map(s => <ServiceCard key={s.id} service={s} />);
}
```

## API Service Layer

DataContext uses these services:
- `serviceService` - Service operations
- `appointmentService` - Appointment booking
- `staffService` - Staff data
- `authService` - Authentication
- `branchService` - Branch management
- `inventoryService` - Inventory management

## Error Handling

```javascript
try {
  await fetchServices();
} catch (error) {
  const message = error.response?.data?.message || 'Error occurred';
  console.error(message);
}
```

## Best Practices

1. **One concern per context** - Don't mix auth and data
2. **Memoize context value** - Prevent unnecessary re-renders
3. **Handle loading states** - Show loader while fetching
4. **Meaningful error messages** - Help users understand issues
5. **Use with hooks** - `useData()` for accessing state

## Performance

- Context value is memoized to prevent re-renders
- Only subscribe to needed data with hooks
- Consider splitting if context gets too large

## Related Files
- `/hooks/useAuth` - Authentication context
- `/hooks/useBooking` - Booking state
- `/services/api` - API service layer
- `/types` - Data type definitions
