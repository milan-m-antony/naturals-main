# Source Code Structure

Organized React application with TypeScript.

## Directory Organization

```
src/
├── components/      # React components by feature
├── hooks/          # Custom React hooks
├── types/          # TypeScript definitions
├── utils/          # Helper functions
├── services/       # API service layer
├── store/          # Context-based state management
├── constants/      # App-wide constants
├── lib/            # Libraries and mock data
├── styles/         # Global CSS
├── App.tsx         # Main app component
├── AppContent.tsx  # App content with routing
└── main.tsx        # React entry point
```

## Key Directories

### `/components`
React components organized by feature:
- Admin dashboards
- Booking wizard (5-step flow)
- Homepage sections
- Layout components
- Pages (About, Contact, Membership)
- Services browsing
- Shared widgets
- User account

📖 [Components Guide](./components/README.md)

### `/hooks`
Custom React hooks for state logic:
- `useAuth()` - Authentication
- `useTheme()` - Dark mode
- `useNavigation()` - Navigation
- `useBooking()` - Booking state
- `useToggle()` - Boolean toggle

📖 [Hooks Guide](./hooks/README.md)

### `/types`
TypeScript type definitions:
- Service, Appointment, User
- Staff, LeaveRequest, Inventory
- API responses, filters

📖 [Types Guide](./types/README.md)

### `/utils`
Helper functions:
- Formatting (price, date)
- Validation (email, phone)
- Array operations
- DOM utilities

📖 [Utils Guide](./utils/README.md)

### `/services`
API service layer:
- REST client configuration
- Service, Appointment, Auth endpoints
- Error handling
- Request/response management

📖 [Services Guide](./services/README.md)

### `/store`
Global state management:
- React Context API
- DataContext provider
- State sharing across app

📖 [Store Guide](./store/README.md)

### `/constants`
Application constants:
- API configuration
- Enums (roles, statuses)
- Feature flags

📖 [Constants Guide](./constants/README.md)

### `/lib`
Libraries and utilities:
- Mock data for development
- Reusable library code

📖 [Lib Guide](./lib/README.md)

## Key Files

### `main.tsx`
React app entry point. Renders `App` component into DOM.

### `App.tsx`
Root app wrapper with theme and context providers.

### `AppContent.tsx`
Main app logic with view routing and state management.

## Import Pattern

Always use path aliases (no relative imports):

```javascript
// ✅ Correct
import Component from '@/components/home/Hero';
import { useAuth } from '@/hooks';
import type { Service } from '@/types';
import { formatPrice } from '@/utils';

// ❌ Wrong
import Component from '../../../components/home/Hero';
```

## Architecture Decisions

### React Context API
- Chosen for simplicity (no Redux overhead)
- Good for app of this size
- Easy to migrate to Redux if needed

### Component Organization
- Feature-based folders (booking, home, etc)
- Shared components in `/shared`
- Pages in `/pages`
- Layouts in `/layout`

### Mobile-First Design
- All components responsive from start
- 2-column grids on mobile
- Touch-friendly (44x44px buttons)
- Bottom navigation support

### Type Safety
- Full TypeScript coverage
- Proper type imports
- No `any` types in business logic
- Generic API response types

## Development Workflow

1. **Create component** in appropriate folder
2. **Add props interface** with TypeScript
3. **Import utilities** from `@/utils`
4. **Use hooks** for state (useAuth, useBooking, etc)
5. **Fetch data** from DataContext (useData)
6. **Style with Tailwind** CSS classes

## Building & Deployment

### Development
```bash
npm run dev
# http://localhost:3001
```

### Production Build
```bash
npm run build
# Creates optimized dist/ folder
```

### Preview Build
```bash
npm run preview
# Test production build locally
```

## Project Statistics

- **Components**: 50+
- **Custom Hooks**: 5
- **API Services**: 6
- **Type Definitions**: 20+
- **Utility Functions**: 30+

## Responsive Breakpoints

- **Mobile**: < 640px (default)
- **Small**: sm: 640px
- **Medium**: md: 768px
- **Large**: lg: 1024px

## Mobile Optimizations

✅ Viewport configuration
✅ 2-column card grids
✅ Bottom navigation clearance
✅ Touch-friendly sizes
✅ No horizontal scroll
✅ No pinch zoom
✅ Smooth scrolling

## Tech Stack

- **React** 19.2 - UI library
- **TypeScript** - Type safety
- **Vite** 6.2 - Build tool
- **Tailwind CSS** 3.4 - Styling
- **Axios** - HTTP client

## Next Steps

1. **Connect to Backend** - Update API URLs in `/services`
2. **Add Tests** - Jest/Vitest for components and hooks
3. **Performance** - Lighthouse optimization
4. **Analytics** - Track user behavior
5. **PWA** - Progressive web app features

## Related Documentation

- [README.md](../README.md) - Project overview
- [SETUP.md](../SETUP.md) - Development setup
- [CHECKLIST.md](../CHECKLIST.md) - Implementation status