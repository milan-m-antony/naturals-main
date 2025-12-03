# Project Features & Backend Specifications (Single Shop Model)

This document outlines the implemented frontend features for a single-shop salon application, the required backend infrastructure, and a potential roadmap.

## 🛠️ Tech Stack

*   **Frontend:** React (TypeScript)
*   **Backend:** PHP/Laravel
*   **Database:** PostgreSQL

## Backend Implementation Guide

To power the interactive frontend, a robust backend is required. Below are the recommended data models and API endpoints for a single-shop system with a three-tiered admin structure.

### 1. Data Models (Database Schema)

*   **User:** Standard customer accounts.
*   **AdminUser:**
    *   `id` (PK), `name`, `email`, `password`, `role` (enum: 'owner', 'manager', 'staff').
*   **Service:** Master list of all services offered at the salon.
*   **Appointment:**
    *   `id` (PK), `userId` (FK), `staffId` (FK), `date`, `time`, `status`, `totalPrice`.
*   **AppointmentServices:** Junction table for multi-service bookings.
*   **Coupon:** For discounts.
*   **LeaveRequest:**
    *   `id` (PK), `staffId` (FK), `startDate`, `endDate`, `reason`, `status`.

### 2. API Endpoints (Role-Based)

Authorization should be handled via JWT, checking the user's role for each endpoint.

#### Authentication
*   `POST /api/auth/admin/login`: Log in an admin, return JWT with role.

#### Owner (`owner`)
*   `GET /api/owner/financial-reports`: Get advanced financial reports.
*   `GET /api/owner/services`: Get all services for management.
*   `POST /api/owner/services`: Create a new service.
*   `PUT /api/owner/services/:id`: Update an existing service.
*   `DELETE /api/owner/services/:id`: Delete a service.
*   *(Includes all Manager-level endpoints for full access).*

#### Manager (`manager`)
*   `GET /api/manager/overview`: Get dashboard stats for the salon.
*   `GET /api/manager/appointments`: Get all appointments.
*   `PATCH /api/manager/appointments/:id`: Update an appointment (e.g., reassign staff).
*   `GET /api/manager/staff`: Get all staff.
*   `GET /api/manager/leaves`: Get leave requests.
*   `PATCH /api/manager/leaves/:id`: Approve/deny a leave request.
*   `POST /api/manager/pos/invoice`: Create a new invoice.

#### Staff (`staff`)
*   `GET /api/staff/my-appointments`: Get appointments assigned to the logged-in staff member.
*   `PATCH /api/staff/appointments/:id/complete`: Mark an appointment as complete.
*   `POST /api/staff/leaves`: Submit a new leave request.
*   `GET /api/staff/my-leaves`: View status of own leave requests.

---

## ✅ Currently Built UI Features

### Public Portal
- **Homepage & Core Pages:** Fully responsive UI for browsing services, offers, and salon info.
- **Booking Wizard:** Complete multi-step booking flow for the single salon.

### Authenticated Areas
- **User Authentication:** Modals for customer sign-in/up.
- **Admin Authentication:** A dedicated login page supporting Owner, Manager, and Staff roles.
- **Role-Based Admin Dashboards (UI Ready):**
    - **Owner Dashboard:** UI for strategic oversight, financials, and service management.
    - **Manager Dashboard:** UI for all salon operations, including calendar, staff, and POS.
    - **Staff Dashboard:** UI for personal schedules and leave management.

---

## 🗺️ Future Roadmap

- **Payment Gateway Integration:** Integrate Stripe or Razorpay.
- **Real-time Updates:** Implement WebSockets for live dashboard updates.
- **Customer Reviews & Ratings:** Allow users to rate services post-appointment.