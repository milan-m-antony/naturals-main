# Naturals Salon - Full Stack Application

Complete salon management system with React frontend and Laravel backend.

## Tech Stack

### Frontend
- **React 19.2** - UI library
- **TypeScript** - Type safety
- **Vite 6.2** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Laravel 10** - PHP framework
- **PostgreSQL** - Database
- **JWT Auth** - Authentication
- **Laravel Sanctum** - API tokens

## Prerequisites

- **Node.js** 18+ and npm/yarn
- **PHP** 8.1 or higher
- **Composer** 2.x
- **PostgreSQL** 14+
- **Git**

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd NATURALS-MAIN
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your API URL
# VITE_API_URL=http://localhost:8000/api

# Start development server
npm run dev
```

The frontend will run on **http://localhost:3001**

### 3. Backend Setup

```bash
cd backend

# Install PHP dependencies
composer install

# Create environment file
cp .env.example .env

# Update .env with your database credentials:
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=naturals_salon
# DB_USERNAME=your_db_user
# DB_PASSWORD=your_db_password

# Generate application key
php artisan key:generate

# Generate JWT secret
php artisan jwt:secret

# Create database (PostgreSQL)
# psql -U postgres
# CREATE DATABASE naturals_salon;
# \q

# Run migrations
php artisan migrate

# Seed database with sample data
php artisan db:seed

# Start Laravel development server
php artisan serve
```

The backend API will run on **http://localhost:8000**

## Database Schema

The system includes the following tables:

- **users** - User accounts (customers, staff, admin, owner)
- **branches** - Salon branch locations
- **services** - Service catalog
- **staff** - Staff information and assignments
- **appointments** - Customer appointments
- **appointment_services** - Services booked in appointments
- **inventory** - Product inventory management
- **leave_requests** - Staff leave management
- **user_favorites** - Customer favorite services

## Default Users

After seeding, you can login with:

**Owner Account:**
- Email: owner@naturals.in
- Password: password

**Admin Account:**
- Email: admin@naturals.in
- Password: password

**Staff Account:**
- Email: priya@naturals.in
- Password: password

**Customer Account:**
- Email: customer@example.com
- Password: password

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login
- `POST /api/logout` - Logout (auth required)
- `GET /api/me` - Get current user (auth required)
- `POST /api/refresh` - Refresh JWT token (auth required)

### Services
- `GET /api/services` - List all services
- `GET /api/services/{id}` - Get service details
- `POST /api/services` - Create service (admin/owner)
- `PUT /api/services/{id}` - Update service (admin/owner)
- `DELETE /api/services/{id}` - Delete service (admin/owner)

### Appointments
- `GET /api/appointments` - List appointments (filtered by role)
- `GET /api/appointments/{id}` - Get appointment details
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/{id}` - Update appointment
- `PATCH /api/appointments/{id}/status` - Update appointment status
- `DELETE /api/appointments/{id}` - Cancel appointment

### Branches
- `GET /api/branches` - List all branches
- `GET /api/branches/{id}` - Get branch details
- `POST /api/branches` - Create branch (admin/owner)
- `PUT /api/branches/{id}` - Update branch (admin/owner)
- `DELETE /api/branches/{id}` - Delete branch (admin/owner)

### Staff
- `GET /api/staff` - List all staff
- `GET /api/staff/{id}` - Get staff details
- `GET /api/leave-requests` - List leave requests
- `POST /api/leave-requests` - Submit leave request (staff)
- `PATCH /api/leave-requests/{id}` - Approve/Reject leave (admin/owner)

### Inventory
- `GET /api/inventory` - List inventory items (admin/owner)
- `GET /api/inventory/{id}` - Get inventory item (admin/owner)
- `POST /api/inventory` - Create inventory item (admin/owner)
- `PUT /api/inventory/{id}` - Update inventory item (admin/owner)
- `DELETE /api/inventory/{id}` - Delete inventory item (admin/owner)

## Features

### Customer Portal
- Browse services by category
- Book appointments
- View booking history
- Manage favorites
- View membership details
- Track spending and visits

### Staff Dashboard
- View assigned appointments
- Update appointment status
- Submit leave requests
- View schedule

### Admin/Manager Dashboard
- Appointment management
- Service management
- Staff management
- Inventory tracking
- Branch management
- Reports and analytics

### Owner Dashboard
- All admin features
- Business overview
- Multi-branch management
- Financial reports
- System settings

## Development

### Frontend Development
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development
```bash
php artisan serve                    # Start dev server
php artisan migrate                  # Run migrations
php artisan db:seed                  # Seed database
php artisan migrate:fresh --seed     # Reset & seed
php artisan route:list               # List all routes
php artisan make:controller Name     # Create controller
php artisan make:model Name -m       # Create model with migration
```

## Project Structure

```
NATURALS-MAIN/
├── backend/                 # Laravel backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/ # API controllers
│   │   │   ├── Middleware/  # Custom middleware
│   │   │   └── Kernel.php   # HTTP kernel
│   │   └── Models/          # Eloquent models
│   ├── config/              # Configuration files
│   ├── database/
│   │   ├── migrations/      # Database migrations
│   │   └── seeders/         # Database seeders
│   └── routes/
│       └── api.php          # API routes
│
├── src/                     # React frontend
│   ├── components/          # React components
│   │   ├── admin/          # Admin dashboard
│   │   ├── booking/        # Booking wizard
│   │   ├── home/           # Home page sections
│   │   ├── layout/         # Layout components
│   │   ├── pages/          # Page components
│   │   ├── service/        # Service components
│   │   ├── shared/         # Shared components
│   │   └── user/           # User dashboard
│   ├── hooks/              # Custom React hooks
│   ├── services/
│   │   └── api/            # API integration
│   ├── store/              # Global state
│   ├── types/              # TypeScript types
│   └── styles/             # Global styles
│
└── public/                 # Static assets
```

## Troubleshooting

### Frontend Issues

**Port already in use:**
```bash
# Change port in vite.config.ts
server: { port: 3002 }
```

**Module not found:**
```bash
npm install
```

### Backend Issues

**Database connection failed:**
- Check PostgreSQL is running
- Verify .env database credentials
- Ensure database exists

**JWT Secret not set:**
```bash
php artisan jwt:secret
```

**Migration errors:**
```bash
php artisan migrate:fresh
```

**Composer dependencies:**
```bash
composer install
composer update
```

## License

Proprietary - Naturals Salon Management System

## Support

For issues or questions, contact the development team.
