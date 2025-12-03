# Naturals Salon - Kanjirappally

A comprehensive web application for the Naturals Salon in Kanjirappally, featuring a public-facing booking platform and a three-tiered administration dashboard for the Owner, Manager, and Staff.

## 🏗️ Architecture

This project follows a **modern, scalable React architecture** with TypeScript, featuring:

- ✅ **Feature-based organization** with clear separation of concerns
- ✅ **Custom hooks** for reusable logic
- ✅ **Centralized type definitions** for type safety
- ✅ **Path aliases** (`@/`) for clean imports
- ✅ **Utility functions** separated from components
- ✅ **Global state management** with React Context

📖 **See [ARCHITECTURE.md](./ARCHITECTURE.md)** for detailed structure documentation  
🔄 **See [MIGRATION.md](./MIGRATION.md)** for migration guide from old structure

## 🚀 Features Overview

### 🌐 Public Customer Portal
*   **Modern UI/UX:** Dark mode support, responsive design, and smooth animations.
*   **Dynamic Homepage:** Features an immersive hero slider, curated service blocks, and sections for "Value Combos" and "Popular Services".
*   **Advanced Service & Offers Menu:** Browse all services with detailed descriptions, advanced filtering (category, price, duration), and sorting.
*   **Multi-Step Booking Wizard:** A seamless flow for selecting multiple services, choosing a date/time, applying coupons, and confirming appointments for the Kanjirappally salon.
*   **Contact & About Pages:** Detailed information about the salon's story and location.

### 🔐 Admin Portals (Role-Based)

A unified login page routes users to specific dashboards based on their role.

#### 1. 👑 Owner Dashboard
*Focus: Full strategic and financial control of the salon.*
*   **Business Overview:** High-level analytics on sales, appointments, and staff performance.
*   **Financial Reports:** Access to detailed financial summaries and analytics.
*   **Service Management:** Full CRUD (Create, Read, Update, Delete) control over the salon's service menu, including pricing and descriptions.
*   **Master Access:** Can view and perform all actions available to the Manager.

#### 2. 🏢 Manager / Receptionist Dashboard
*Focus: Complete operational control of the Kanjirappally salon.*
*   **Branch Overview:** At-a-glance stats for daily sales, appointments, active staff, and pending leave requests.
*   **Appointment Manager:** A master calendar to manage all bookings, create walk-in appointments, and reassign stylists.
*   **Staff Management:** View all staff and approve/deny leave requests.
*   **Point of Sale (POS):** A billing interface to generate invoices for services.

#### 3. 👤 Staff / Stylist Dashboard
*Focus: Personal workflow and daily tasks.*
*   **My Dashboard:** A personalized view of their appointments for the day (Total, Completed, Pending).
*   **My Schedule:** A detailed list of all assigned appointments with filters.
*   **Task Management:** View customer notes and mark appointments as "Completed".
*   **Leave Management:** Request time off and view the status of past requests.

## 🛠 Tech Stack
*   **Frontend:** React 19.2 (TypeScript)
*   **Build Tool:** Vite 6.2
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **State Management:** React Context API & Custom Hooks

## 📁 Project Structure

```
src/
├── components/      # All React components
├── hooks/           # Custom React hooks (useTheme, useAuth, useBooking, etc.)
├── store/           # Global state management
├── types/           # TypeScript type definitions
├── utils/           # Utility functions (formatCurrency, formatDate, etc.)
├── services/        # API and external services
├── constants/       # Application constants
├── lib/             # External libraries and mock data
├── App.tsx          # Main application wrapper
├── AppContent.tsx   # Main application content
└── main.tsx         # Application entry point
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:3000`

## 🔑 Demo Credentials

Access the admin portal via the "Admin Login" link in the footer.

| Role | Email | Password |
| :--- | :--- | :--- |
| **Owner** | `owner@naturals.com` | `password` |
| **Manager** | `admin@naturals.com` | `password` |
| **Staff** | `staff@naturals.com` | `password` |

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed project structure and patterns
- **[MIGRATION.md](./MIGRATION.md)** - Migration guide from old structure
- **[feature.md](./feature.md)** - Feature specifications and backend requirements
 - **Copilot Instructions** - See `copilot-instructions.md` for strict development workflow

## Key Workflow & API Integration (Concise)

- Frontend: React + Vite + Tailwind v3.4; Context + hooks.
- Auth: JWT; token in `localStorage`. `useAuth` exposes `userProfile`.
- Appointments: `DataContext` fetches via `appointmentService`. Admin can cancel/reschedule/reassign; user views are scoped.
- Inventory: Updated via `inventoryService.update`; status auto-derives from stock.
- Styling: Follow existing components and dark mode via `useTheme`.

## Recent Changes (Summary)

- Replaced mock user data with real `userProfile` throughout booking.
- Filtered user appointments; auto-refresh on login.
- Admin dashboard refreshes appointments and inventory on mount.
- Admin actions show toasts; reschedule/staff reassignment use `updateAppointment`.

## Upcoming Enhancements (Short)

- Booking UX: success toast + redirect to dashboard after confirm.
- Staff availability checks to prevent overlapping times.
- Admin filters (branch/date) and pagination for large lists.

## 🎯 Development Guidelines

### Import Pattern
Use path aliases for cleaner imports:
```typescript
// ✅ Good
import { useTheme } from '@/hooks';
import type { Service } from '@/types';
import { formatCurrency } from '@/utils';

// ❌ Avoid
import { useTheme } from '../../hooks/useTheme';
```

### Custom Hooks Available
- `useTheme()` - Dark mode management
- `useAuth()` - Authentication state and handlers
- `useNavigation()` - View navigation and routing
- `useBooking()` - Booking flow state management
- `useToggle()` - Simple toggle state helper

### Type Definitions
All types are centralized in `/src/types`:
```typescript
import type { 
  Service, 
  Appointment, 
  UserProfile,
  AdminUser,
  ViewType 
} from '@/types';
```

## 🚀 Features Roadmap

- ✅ Complete frontend UI/UX
- ✅ Role-based dashboards (Owner, Manager, Staff)
- ✅ Multi-step booking wizard
- ✅ Service browsing and filtering
- ✅ Dark mode support
- ⏳ Backend API integration (PHP/Laravel + PostgreSQL)
- ⏳ Payment gateway integration
- ⏳ Real-time updates with WebSockets
- ⏳ Customer reviews and ratings

---
*Designed for elegance. Built for performance.*