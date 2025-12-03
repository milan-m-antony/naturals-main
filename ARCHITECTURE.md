# Naturals Salon - Modern React Architecture

## 📁 Project Structure

```
src/
├── assets/              # Static assets (images, fonts, etc.)
│   └── images/
├── components/          # All React components (from old structure)
│   ├── admin/          # Admin dashboard components
│   ├── booking/        # Booking wizard steps
│   ├── home/           # Homepage sections
│   ├── layout/         # Layout components (Header, Footer, etc.)
│   ├── pages/          # Static pages (About, Contact, etc.)
│   ├── service/        # Service-related components
│   ├── shared/         # Shared/reusable components
│   └── user/           # User dashboard components
├── constants/          # Application constants
│   └── app.constants.ts
├── features/           # Feature-based modules (future use)
│   ├── auth/
│   ├── booking/
│   ├── admin/
│   ├── services/
│   └── user/
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication logic
│   ├── useBooking.ts   # Booking state management
│   ├── useNavigation.ts # Navigation logic
│   ├── useTheme.ts     # Dark mode management
│   ├── useToggle.ts    # Toggle state helper
│   └── index.ts
├── layouts/            # Layout wrappers (future use)
├── lib/                # External libraries and configurations
│   └── mockData.ts
├── pages/              # Page-level components (future use)
├── services/           # API and external services
│   ├── api/
│   └── index.ts
├── store/              # Global state management
│   ├── DataContext.tsx
│   └── index.ts
├── styles/             # Global styles
│   └── index.css
├── types/              # TypeScript type definitions
│   ├── appointment.types.ts
│   ├── common.types.ts
│   ├── inventory.types.ts
│   ├── service.types.ts
│   ├── user.types.ts
│   └── index.ts
├── utils/              # Utility functions
│   ├── helpers.ts      # General helpers
│   ├── service.utils.ts # Service-specific utilities
│   └── index.ts
├── App.tsx             # Main App wrapper
├── AppContent.tsx      # Main App content component
└── main.tsx            # Application entry point
```

## 🚀 Key Improvements

### 1. **Separation of Concerns**
- **Types**: All TypeScript interfaces are centralized in `/types`
- **Hooks**: Reusable logic extracted into custom hooks
- **Utils**: Pure utility functions separated from components
- **Constants**: Configuration values in one place

### 2. **Custom Hooks**
- `useTheme()` - Dark mode management
- `useAuth()` - Authentication state
- `useNavigation()` - Routing logic
- `useBooking()` - Booking flow state
- `useToggle()` - Simple toggle state

### 3. **Type Safety**
All interfaces are properly typed and exported from a central location:
```typescript
import type { Service, Appointment, UserProfile } from '@/types';
```

### 4. **Path Aliases**
Import using `@/` prefix instead of relative paths:
```typescript
import { useTheme } from '@/hooks';
import { formatCurrency } from '@/utils';
import type { Service } from '@/types';
```

### 5. **Better Code Organization**
- Components are still in `/components` for now
- Ready for feature-based migration to `/features`
- Clear separation between business logic and UI

## 📦 Import Patterns

### Old Way (Relative Paths)
```typescript
import { DataProvider } from '../../context/DataContext';
import { formatDate } from '../../utils/helpers';
```

### New Way (Path Aliases)
```typescript
import { DataProvider } from '@/store';
import { formatDate } from '@/utils';
```

## 🔄 Migration Path

### Current State
All existing components remain in `/src/components` with original structure.

### Future Enhancements
1. **Feature-based organization**: Move related components to `/features`
2. **Page components**: Create route-based pages in `/pages`
3. **Layout system**: Shared layouts in `/layouts`
4. **API layer**: Structured API calls in `/services/api`

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📝 Coding Standards

### Import Order
1. React and third-party libraries
2. Types
3. Hooks
4. Components
5. Utils and constants

### Example
```typescript
import React, { useState } from 'react';
import type { Service } from '@/types';
import { useTheme } from '@/hooks';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/utils';
import { APP_CONFIG } from '@/constants';
```

## 🎯 Next Steps

1. ✅ Create proper folder structure
2. ✅ Extract types into dedicated files
3. ✅ Create custom hooks
4. ✅ Set up path aliases
5. ✅ Update configuration files
6. ⏳ Update all component imports to use `@/` prefix
7. ⏳ Create feature-based modules
8. ⏳ Set up routing system
9. ⏳ Create API service layer

---

Built with ❤️ using React + TypeScript + Vite
