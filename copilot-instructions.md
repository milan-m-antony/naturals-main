# Copilot Instructions (Strict)

## Design System - NATURALS Theme

**Color Palette (LOCKED):**
- Primary Accent: Yellow (`#facc15` / `bg-yellow-400`)
- Background: White (`#ffffff` / `bg-white`)
- Text/CTA: Black (`#000000` / `text-black`)
- Secondary: Neutral grays for borders and secondary text

**Component Patterns:**
- Cards: `border-2 border-gray-200 dark:border-neutral-700 rounded-lg` with `hover:border-yellow-400`
- Buttons: `bg-yellow-400 text-black` for primary CTAs
- Icons: `bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400`
- No multi-color gradients; use simple yellow accents only
- Dark mode: All components prefixed with `dark:` classes

**DO NOT:**
- Use multi-color gradients (pink, blue, green, purple, etc.)
- Create complex gradient overlays or decorative elements
- Introduce new color schemes; stick to yellow/white/black
- Duplicate features already in admin fields

## Frontend Development Guidelines

- Follow existing UI/UX patterns; do not introduce new design systems.
- Create/modify components to match current styling and structure (yellow/white/black theme).
- Keep answers short and clear; avoid bulky explanations.
- Use React + TypeScript + Tailwind v3.4; reuse hooks and context.
- State: Use `DataContext` and custom hooks (`useAuth`, `useData`, `useBooking`).
- Auth: Respect JWT token in `localStorage`; use `userProfile` from `useAuth`.
- API: Use services under `src/services/api/*` (`appointmentService`, `inventoryService`, etc.).
- Booking: After confirmation, refresh appointments and redirect to dashboard.
- Admin: Use `updateAppointment` for reschedule/staff reassignment; call refresh after updates; show lightweight toasts.


## Git & Version Control Rules

**CRITICAL:** Do NOT push to GitHub without explicit user approval.

### Workflow
1. Make code changes
2. Test locally
3. Run: `git add .`
4. Run: `git commit -m "Clear message"`
5. **STOP** - Wait for user approval before pushing

## Recently Implemented Features (Session 7)

### 1. Service Review System
- **Location:** User Dashboard → My Bookings (completed appointments)
- **How:** Click "Rate" → Select 1-5 stars → Write review → Submit
- **Features:**
  - Per-service ratings (separate from appointment reviews)
  - Service rating auto-calculated (average of all reviews)
  - Ratings display on service cards as "⭐ 4.9 (128 Reviews)"
  - Review text optional, max 1000 chars
  - Service name shown in rating modal

### 2. My Reviews Dashboard Tab
- **Location:** User Dashboard → My Reviews (new sidebar menu item)
- **Shows:** All reviews customer submitted
- **Features:**
  - Search by service name
  - Sort by: Recent, High Rated, Low Rated
  - Display: Service name, stars, review text, date

### 3. Appointment Reschedule System
- **Location:** User Dashboard → My Bookings (upcoming appointments)
- **How:** Click "Reschedule" → Pick date → Pick time → Add reason → Submit
- **Features:**
  - Date picker (future dates only)
  - Time picker (HH:MM format)
  - Reason field (optional)
  - Request status: Pending → Approved/Rejected
  - Auto-navigate to booking page after submit
  - Appointment auto-updates when approved

### 4. Admin Reschedule Management
- **Location:** Admin Dashboard → "Reschedule Requests" (sidebar)
- **Features:**
  - View all pending reschedule requests
  - Filter by status: All, Pending, Approved, Rejected
  - Search by customer name or service
  - Approve/Reject with optional admin notes
  - Auto-update appointment if approved

### 5. Database Tables (New)
- `service_reviews` - Stores per-service ratings and reviews
- `appointment_reschedules` - Tracks reschedule requests and status

### 6. New API Endpoints
- `POST /api/services/{id}/reviews` - Submit service review
- `GET /api/services/{id}/reviews` - Get service reviews
- `GET /api/my-reviews` - Get user's reviews
- `POST /api/appointments/{id}/reschedule` - Request reschedule
- `GET /api/reschedule-requests` - Get reschedule requests
- `PATCH /api/reschedule-requests/{id}` - Approve/reject reschedule

### 7. New Components & Services
- `UserReviews.tsx` - View and manage customer reviews
- `AdminRescheduleRequests.tsx` - Admin reschedule management
- `serviceReviewService.ts` - Review API calls
- `rescheduleService.ts` - Reschedule API calls

### 8. Modified Components
- `ServiceCard.tsx` - Added rating display (⭐ X.X (count))
- `UserBookings.tsx` - Added reschedule modal, service review submission
- `Step0_Dashboard.tsx` - Added "My Reviews" tab + navigation
- `OwnerDashboard.tsx` - Added "Reschedule Requests" menu








