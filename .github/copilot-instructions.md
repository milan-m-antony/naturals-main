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


