# Copilot Instructions

## Stack & Structure
- Frontend: React 18 + TypeScript + Vite + Tailwind (src/). Key domains: booking wizard (components/booking), admin/owner modules (components/admin/modules), home sections (components/home), shared widgets (components/shared), layout (components/layout), services (services/api/*), context (context/DataContext.tsx), data mocks (data/mockData.ts).
- Backend: Laravel 10 + PostgreSQL (backend/). API routes in backend/routes/api.php, controllers under backend/app/Http/Controllers.
- Content management (Owner): hero carousel, service categories, curated services, website features, coupons, banners, media library. Admin/owner UI lives in components/admin/modules.

## Run & Build
- Backend: `cd backend; composer install; cp .env.example .env; php artisan key:generate; php artisan migrate --seed; php artisan serve` (defaults to :8000). Clear caches if odd: `php artisan config:clear` then `php artisan cache:clear`.
- Frontend: `npm install; npm run dev` (defaults to :3000, auto-shifts if busy). Prod build: `npm run build`.
- Payment is in bypass mode unless you disable in src/services/razorpayService.ts and add Razorpay keys in backend/.env.

## Data & Auth
- Auth: JWT token stored in localStorage; use useAuth/userProfile. Protected API calls go through services/api helpers.
- Hero slides API: services/api/heroSlideService.ts (maps accent_color ↔ accentColor). Backend controller: backend/app/Http/Controllers/HeroSlideController.php. Image column is TEXT (accepts base64) after migration 2025_12_12_165559_update_hero_slides_image_column_to_text.php.
- Seed data: backend database seeders include HeroSlideSeeder (sample slides). Use `php artisan db:seed --class=HeroSlideSeeder` after migrations.

## Frontend Patterns
- Styling: strict yellow/white/black theme (see copilot-instructions.md in root). Use Tailwind with dark: variants. Avoid new color schemes or gradients. Reuse existing component patterns (cards, buttons, badges) from existing modules.
- State/data: prefer hooks/context (DataContext, useAuth, useData, useBooking). API interactions go through services/api/*; avoid in-component fetches when a service exists.
- Admin/Owner modules follow CRUD pattern: list -> modal form -> service call -> optimistic state update. Keep forms in TS with typed payloads from src/types.

## Testing & Verification
- Run backend migrations before testing admin content features. Check backend logs at backend/storage/logs/laravel.log for 500s. Frontend errors: browser console (axios stack) or Vite terminal.
- Hero carousel is marked done; do not modify its code/logic unless explicitly requested. Track working items in CHECKLIST.md and avoid changes to checked items without approval.

## File References
- Frontend entry: App.tsx / index.tsx.
- Key services: src/services/api/*.ts (heroSlideService, appointmentService, inventoryService, etc.).
- Admin Owner Hero module: src/components/admin/modules/OwnerHero.tsx.
- Home hero display: src/components/home/Hero.tsx.

## Contribution Rules
- Do not restructure folders unless asked. Follow existing naming and placement conventions. No pushes to remote unless user explicitly instructs.

## Short Response Requirement
- ALWAYS keep responses short.
- No long paragraphs.
- Prefer concise code + brief notes only.

## Component Reuse Rule

Copilot must ALWAYS reuse existing components, services, types, context, and utilities whenever they already exist in the project.

Copilot must NOT create new files or components if an existing one can be extended or updated to solve the issue.

Copilot may only create a new component when:
- No component exists for that feature, and
- The user has not marked the feature as completed, and
- The user has not instructed to reuse existing components.

If unsure whether to reuse or create, Copilot must choose reuse by default.

## Module Completion Protection (Global Rule)

When the user says: **"Mark this as done - <Feature Name>"**, you MUST execute the following workflow step-by-step:

### 1. Update TODO.md (at workspace root)
- Change the feature's checkbox from `[ ]` to `[✅]`.
- Add link to completion file: `→ [completed/<feature-name>.md](completed/<feature-name>.md)`

### 2. Create a completion file (at workspace root)
- Generate a new file at workspace root: `C:\projects\NATURALS-MAIN\completed\<feature-name>.md`
- Path format: `completed/<feature-name>.md` (relative to workspace root, NOT .github folder)
- The file must contain:
  - Feature name
  - List of related files (ask user if not clear)
  - Protection rule:
    "This module is completed and protected. Do NOT modify it unless the user explicitly requests changes."

### 3. Insert protection header into each related file
Add this comment at the TOP of every file connected to the feature:
```
/* copilot:follow
This module is MARKED AS DONE.
It is protected. Do NOT modify unless the user explicitly asks.
*/
```

### 4. Lock the module
- Do NOT refactor, rewrite, or optimize any code in this module.
- If any future task touches this module, ask the user: "This module is marked as done. Do you want to modify it?"
- Only proceed if the user explicitly approves.

**Protected Modules:** Hero Carousel (see `completed/hero-carousel.md`)

---

## Universal Issue Troubleshooting Rule (Auto Fix Mode)

When the user reports ANY issue in natural language (e.g., "not showing", "not saving", "update not reflecting", "UI broken", "data not inserting", "API not working", "not loading", "delete failing"), Copilot must follow this workflow:

### Step 1 — Database Check
- Confirm whether expected data exists or is being inserted.
- Verify field names, types, migrations, and seeders.

### Step 2 — API Layer Check
- Verify correct endpoint (GET/POST/PUT/DELETE).
- Check request payload mapping.
- Validate controller logic, validation, and response format.

### Step 3 — Frontend Service Layer
- Confirm endpoint URL.
- Confirm payload fields match backend.
- Confirm response mapping to UI state.

### Step 4 — Admin UI Layer
- Check form bindings, event handlers, list rendering, and state updates.

### Step 5 — Public Frontend Display Layer
- Check components, props, state, conditional rendering, and data flows.

---

## Step 6 — Auto Diagnosis + Auto Fix (Full Action Mode)

After identifying the failing layer, Copilot must:
1. Automatically generate the correct fix.
2. Automatically edit and update ONLY the affected files.
3. Apply changes immediately with no confirmation required.
4. Avoid touching unrelated modules.
5. Respect protected modules.

---

## Step 6.1 — Terminal / Dev Server Actions (Full Freedom)

Copilot may run ANY terminal commands needed to complete a fix, including:
- Rebuilding
- Restarting dev servers
- Running migrations
- Clearing caches
- Installing dependencies
- Refreshing app state
- Watching for live errors

Copilot must STOP immediately if the user says: "stop".

---

## Step 6.2 — Error Feedback Loop

If fixes produce new errors:
- Copilot must continue diagnosing and auto-fixing until the project is error-free OR the user says "stop".

---

## Natural Language Issue Interpretation

The user may describe issues in normal language, such as:
- "Banner shows on website but not dashboard"
- "Coupon discount not saving"
- "Category missing in homepage"
- "Booking step stuck"
- "Not inserting into DB"

Copilot must interpret the meaning and automatically trigger the full troubleshooting + auto-fix workflow.

---

## Auto-Add to TODO Rule

When the user mentions:
- **New implementation** (e.g., "add dark mode toggle", "create payment page")
- **Existing feature not in TODO** (e.g., mentions a feature that isn't checked off)

Copilot must:
1. Check if the feature exists in TODO.md
2. If missing or unchecked, automatically add to appropriate section:
   - 👤 Customer Features
   - 👨‍💼 Staff Dashboard
   - 📞 Receptionist Dashboard
   - 🔧 Admin Dashboard
   - 👑 Owner Dashboard
   - 🔐 Auth & Payment
   - 🎨 UI/UX
3. Use format: `- [ ] Feature Name (brief description)`
4. Do NOT ask for confirmation — just add it
5. Commit and push if user asks to save progress

**Example:**
- User: "We need email notifications for bookings"
- Copilot: Adds `- [ ] Email Notifications (booking alerts)` to appropriate section, commits if requested


