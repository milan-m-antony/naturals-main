export const APP_CONFIG = {
  APP_NAME: 'Naturals Salon',
  APP_DESCRIPTION: 'Premium beauty services and salon booking platform',
  LOCATION: 'Kanjirappally',
  PHONE: '+91 1234567890',
  EMAIL: 'info@naturals.com',
  WHATSAPP: '+911234567890',
} as const;

export const DEMO_CREDENTIALS = {
  OWNER: {
    EMAIL: 'owner@naturals.com',
    PASSWORD: 'password',
  },
  ADMIN: {
    EMAIL: 'admin@naturals.com',
    PASSWORD: 'password',
  },
  STAFF: {
    EMAIL: 'staff@naturals.com',
    PASSWORD: 'password',
  },
} as const;

export const ROUTES = {
  HOME: 'home',
  SERVICES: 'services',
  DISCOUNTS: 'discounts',
  CONTACT: 'contact',
  ABOUT: 'about',
  MEMBERSHIP: 'membership',
  BOOKING: 'booking',
  ADMIN_LOGIN: 'admin-login',
} as const;

export const BOOKING_STEPS = {
  DASHBOARD: 0,
  SERVICES: 1,
  SCHEDULE: 2,
  CONFIRM: 3,
  SUCCESS: 4,
} as const;
