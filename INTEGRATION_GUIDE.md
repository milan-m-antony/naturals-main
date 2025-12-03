# Frontend-Backend Integration Guide

Step-by-step guide to connect your React frontend with the Laravel backend.

## Prerequisites

✅ Frontend running on http://localhost:3001  
✅ Backend running on http://localhost:8000  
✅ PostgreSQL database created and seeded  
✅ axios package installed in frontend

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      React Frontend                         │
│                   (http://localhost:3001)                   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Components (UI Layer)                               │  │
│  │  - BookingWizard.tsx                                 │  │
│  │  - ServiceMenu.tsx                                   │  │
│  │  - AdminDashboard.tsx                                │  │
│  └─────────────────┬────────────────────────────────────┘  │
│                    │ uses                                   │
│  ┌─────────────────▼────────────────────────────────────┐  │
│  │  API Services (Business Logic)                       │  │
│  │  - authService.ts                                    │  │
│  │  - appointmentService.ts                             │  │
│  │  - serviceService.ts                                 │  │
│  └─────────────────┬────────────────────────────────────┘  │
│                    │ uses                                   │
│  ┌─────────────────▼────────────────────────────────────┐  │
│  │  API Client (HTTP Layer)                             │  │
│  │  - Axios instance                                    │  │
│  │  - Token management                                  │  │
│  │  - Error handling                                    │  │
│  └─────────────────┬────────────────────────────────────┘  │
└────────────────────┼────────────────────────────────────────┘
                     │
                     │ HTTP/JSON
                     │ Authorization: Bearer <token>
                     │
┌────────────────────▼────────────────────────────────────────┐
│                     Laravel Backend                         │
│                   (http://localhost:8000)                   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Routes (api.php)                                    │  │
│  │  - Public routes                                     │  │
│  │  - Protected routes (JWT middleware)                 │  │
│  └─────────────────┬────────────────────────────────────┘  │
│                    │ calls                                  │
│  ┌─────────────────▼────────────────────────────────────┐  │
│  │  Controllers (Business Logic)                        │  │
│  │  - AuthController                                    │  │
│  │  - AppointmentController                             │  │
│  │  - ServiceController                                 │  │
│  └─────────────────┬────────────────────────────────────┘  │
│                    │ uses                                   │
│  ┌─────────────────▼────────────────────────────────────┐  │
│  │  Models (Data Layer)                                 │  │
│  │  - Eloquent ORM                                      │  │
│  │  - Relationships                                     │  │
│  └─────────────────┬────────────────────────────────────┘  │
│                    │                                        │
│  ┌─────────────────▼────────────────────────────────────┐  │
│  │  PostgreSQL Database                                 │  │
│  │  - naturals_salon                                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Step 1: Verify Environment Configuration

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

### Backend (backend/.env)
```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
JWT_SECRET=your_generated_secret
APP_KEY=your_generated_key
```

## Step 2: Update DataContext to Use Real API

Replace mock data with API calls in `src/store/DataContext.tsx`:

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  authService, 
  serviceService, 
  appointmentService,
  branchService,
  staffService,
  inventoryService 
} from '@/services/api';
import type { Service, Appointment, Staff, InventoryItem } from '@/types';

interface DataContextType {
  services: Service[];
  appointments: Appointment[];
  staff: Staff[];
  inventory: InventoryItem[];
  branches: any[];
  isLoading: boolean;
  error: string | null;
  
  // Service methods
  addService: (service: Service) => Promise<void>;
  updateService: (service: Service) => Promise<void>;
  deleteService: (id: number) => Promise<void>;
  
  // Appointment methods
  addAppointment: (appointment: any) => Promise<void>;
  updateAppointment: (appointment: Appointment) => Promise<void>;
  deleteAppointment: (id: number) => Promise<void>;
  
  // Inventory methods
  updateInventoryStock: (id: number, stock: number) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load public data (no auth required)
      const [servicesData, branchesData, staffData] = await Promise.all([
        serviceService.getAll(),
        branchService.getAll(),
        staffService.getAll(),
      ]);

      setServices(servicesData);
      setBranches(branchesData);
      setStaff(staffData);

      // Load protected data if user is authenticated
      const user = authService.getCurrentUser();
      if (user) {
        const [appointmentsData, inventoryData] = await Promise.all([
          appointmentService.getAll(),
          user.role === 'admin' || user.role === 'owner' 
            ? inventoryService.getAll()
            : Promise.resolve([]),
        ]);

        setAppointments(appointmentsData);
        setInventory(inventoryData);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      console.error('Data loading error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addService = async (service: Service) => {
    const newService = await serviceService.create(service);
    setServices([...services, newService]);
  };

  const updateService = async (service: Service) => {
    const updated = await serviceService.update(service.id, service);
    setServices(services.map(s => s.id === updated.id ? updated : s));
  };

  const deleteService = async (id: number) => {
    await serviceService.delete(id);
    setServices(services.filter(s => s.id !== id));
  };

  const addAppointment = async (appointmentData: any) => {
    const newAppointment = await appointmentService.create(appointmentData);
    setAppointments([...appointments, newAppointment]);
  };

  const updateAppointment = async (appointment: Appointment) => {
    const updated = await appointmentService.update(appointment.id, appointment);
    setAppointments(appointments.map(a => a.id === updated.id ? updated : a));
  };

  const deleteAppointment = async (id: number) => {
    await appointmentService.delete(id);
    setAppointments(appointments.filter(a => a.id !== id));
  };

  const updateInventoryStock = async (id: number, stock: number) => {
    const updated = await inventoryService.update(id, { stock });
    setInventory(inventory.map(i => i.id === updated.id ? updated : i));
  };

  return (
    <DataContext.Provider value={{
      services,
      appointments,
      staff,
      inventory,
      branches,
      isLoading,
      error,
      addService,
      updateService,
      deleteService,
      addAppointment,
      updateAppointment,
      deleteAppointment,
      updateInventoryStock,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
```

## Step 3: Update AuthModal Component

Modify `src/components/shared/AuthModal.tsx` to use real authentication:

```typescript
import { useState } from 'react';
import { X } from 'lucide-react';
import { authService } from '@/services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: any) => void;
}

export default function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await authService.login({ email, password });
        onLogin(response.user);
        onClose();
      } else {
        const response = await authService.register({ 
          name, 
          email, 
          password,
          phone 
        });
        onLogin(response.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of the component
}
```

## Step 4: Update BookingWizard Component

Modify appointment creation in `src/components/booking/Step3_Confirm.tsx`:

```typescript
import { useState } from 'react';
import { appointmentService } from '@/services/api';

// Inside your confirm step component:
const handleConfirmBooking = async () => {
  setIsLoading(true);
  
  try {
    const appointmentData = {
      branch_id: selectedBranch.id,
      staff_id: selectedStaff.id,
      date: selectedDate,
      time: selectedTime,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      services: selectedServices.map(s => ({
        id: s.id,
        price: s.price
      })),
      total_price: totalPrice,
      payment_method: paymentMethod,
      notes: specialRequests
    };

    const newAppointment = await appointmentService.create(appointmentData);
    
    // Navigate to success page
    onComplete(newAppointment);
  } catch (error: any) {
    setError(error.response?.data?.message || 'Booking failed');
  } finally {
    setIsLoading(false);
  }
};
```

## Step 5: Update Service Management

Modify admin service management in admin components:

```typescript
import { serviceService } from '@/services/api';

// Create service
const handleCreateService = async (serviceData: any) => {
  try {
    const newService = await serviceService.create(serviceData);
    // Update UI
  } catch (error) {
    console.error('Failed to create service:', error);
  }
};

// Update service
const handleUpdateService = async (id: number, updates: any) => {
  try {
    const updated = await serviceService.update(id, updates);
    // Update UI
  } catch (error) {
    console.error('Failed to update service:', error);
  }
};

// Delete service
const handleDeleteService = async (id: number) => {
  try {
    await serviceService.delete(id);
    // Update UI
  } catch (error) {
    console.error('Failed to delete service:', error);
  }
};
```

## Step 6: Add Loading & Error States

Create a loading component `src/components/shared/LoadingSpinner.tsx`:

```typescript
export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
    </div>
  );
}
```

Create an error component `src/components/shared/ErrorMessage.tsx`:

```typescript
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-red-600 text-xl mb-4">{message}</div>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
        >
          Retry
        </button>
      )}
    </div>
  );
}
```

## Step 7: Test the Integration

### Test Authentication Flow

1. **Start both servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   php artisan serve

   # Terminal 2 - Frontend
   npm run dev
   ```

2. **Open browser:** http://localhost:3001

3. **Test login:**
   - Click "Sign In"
   - Email: customer@example.com
   - Password: password
   - Should see user profile loaded

4. **Test booking:**
   - Browse services
   - Select a service
   - Complete booking wizard
   - Check appointment created in database

5. **Test admin features:**
   - Login as: admin@naturals.in / password
   - Access admin dashboard
   - Try creating/updating a service
   - Check inventory management

### Verify API Calls in Browser DevTools

1. Open DevTools (F12)
2. Go to Network tab
3. Filter: XHR or Fetch
4. Should see:
   - `POST /api/login` - Returns token
   - `GET /api/me` - Returns user profile
   - `GET /api/services` - Returns services
   - `POST /api/appointments` - Creates booking

### Check Request Headers

Each authenticated request should have:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
Content-Type: application/json
Accept: application/json
```

## Step 8: Handle Common Errors

### CORS Error

**Symptom:** "Access to XMLHttpRequest blocked by CORS policy"

**Fix:**
```php
// backend/config/cors.php
'allowed_origins' => ['http://localhost:3001'],
```

Restart Laravel server.

### 401 Unauthorized

**Symptom:** API returns 401 for protected routes

**Fix:**
- Check token is saved: `localStorage.getItem('auth_token')`
- Verify token in request headers
- Try login again to get fresh token

### 500 Internal Server Error

**Symptom:** API returns 500 error

**Fix:**
- Check Laravel logs: `backend/storage/logs/laravel.log`
- Verify database connection
- Check `.env` configuration

### Network Error

**Symptom:** "Network Error" in console

**Fix:**
- Verify backend is running: `php artisan serve`
- Check API URL in `.env`: `VITE_API_URL=http://localhost:8000/api`
- Test backend directly: `curl http://localhost:8000/api/services`

## Step 9: Production Deployment

### Frontend Build

```bash
npm run build
# Output in dist/ folder
```

### Backend Optimization

```bash
cd backend
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Environment Updates

**Frontend:**
```env
VITE_API_URL=https://api.yourdomain.com/api
```

**Backend:**
```env
APP_ENV=production
APP_DEBUG=false
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

## Testing Checklist

- [ ] Login with customer account
- [ ] Register new account
- [ ] Browse services (public)
- [ ] Create appointment
- [ ] View appointment history
- [ ] Update appointment status (staff)
- [ ] Manage services (admin)
- [ ] View inventory (admin)
- [ ] Approve leave requests (admin)
- [ ] Logout and token cleanup

## Debugging Tips

1. **Enable API response logging:**
   ```typescript
   // src/services/api/client.ts
   apiClient.interceptors.response.use(
     (response) => {
       console.log('API Response:', response.data);
       return response;
     }
   );
   ```

2. **Check Laravel logs:**
   ```bash
   tail -f backend/storage/logs/laravel.log
   ```

3. **Verify database:**
   ```bash
   psql -U postgres naturals_salon
   SELECT * FROM appointments;
   \q
   ```

4. **Test API directly:**
   ```bash
   # Login
   curl -X POST http://localhost:8000/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"customer@example.com","password":"password"}'
   ```

## Next Steps

Once integration is working:

1. ✅ Replace all mock data with API calls
2. ✅ Add proper error handling to all API calls
3. ✅ Implement loading states throughout the app
4. ✅ Add success/error toast notifications
5. ✅ Implement proper form validation
6. ✅ Add pagination for large lists
7. ✅ Implement real-time updates (optional)
8. ✅ Add comprehensive testing

## Support

If you encounter issues:

1. Check `API_TESTING.md` for endpoint examples
2. Review `backend/README.md` for API documentation
3. Check browser console for frontend errors
4. Check `backend/storage/logs/laravel.log` for backend errors
5. Verify environment configuration

Happy coding! 🚀
