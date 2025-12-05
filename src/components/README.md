# Components Directory

## Structure

### `/admin`
Admin dashboard and management interfaces with role-based access control.

### `/booking`
Multi-step booking wizard (5 steps: Dashboard → Services → Schedule → Confirm → Success).

### `/home`
Homepage sections: Hero, Categories, Curated Services, Combo Offers, Promotions.

### `/layout`
Global layout: Header, Footer, Bottom Navigation, Mobile Menu, Announcement Bar.

### `/pages`
Full-page views: About, Contact, Membership.

### `/service`
Service browsing: ServiceMenu, ServiceCard, ServiceModal.

### `/shared`
Reusable widgets: AuthModal, ChatWidget, WhatsApp, PromoWidget, ShareMenu.

### `/user`
User profile and account: Dashboard, Profile, Bookings, Favorites, Offers, Spending.

## Mobile Optimizations

- **Grid Layout**: 2 columns on mobile, 3 on desktop
- **Card Height**: 280px (optimized for mobile)
- **Bottom Padding**: 32px (clears bottom navigation)
- **Sticky Header**: Positioned at top-20 on mobile, top-32 on desktop
- **Viewport**: User scaling disabled, max-scale 1.0

## Key Features

- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Full dark theme support
- **Type-Safe**: All props properly typed
- **State Management**: Context-based, localStorage persistence
- **Accessibility**: Touch-friendly targets (44x44px min)

## Import Pattern

Always use path aliases:
```
import Component from '@/components/...';
```

Never use relative paths.
