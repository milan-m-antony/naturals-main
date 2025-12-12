<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\ServiceCategoryController;
use App\Http\Controllers\HeroSlideController;
use App\Http\Controllers\PromotionalBannerController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\MediaLibraryController;
use App\Http\Controllers\CuratedServiceController;
use App\Http\Controllers\FeatureController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\MembershipController;
use App\Http\Controllers\BusinessConfigController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\CRMController;
use App\Http\Controllers\AnalyticsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public service routes
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);
Route::post('/services', [ServiceController::class, 'store']);
Route::put('/services/{id}', [ServiceController::class, 'update']);
Route::delete('/services/{id}', [ServiceController::class, 'destroy']);

// Public branch routes
Route::get('/branches', [BranchController::class, 'index']);
Route::get('/branches/{id}', [BranchController::class, 'show']);

// Public staff routes
Route::get('/staff', [StaffController::class, 'index']);
Route::get('/staff/{id}', [StaffController::class, 'show']);

// Public content routes (for homepage)
Route::get('/service-categories', [ServiceCategoryController::class, 'index']);
Route::get('/service-categories/{category}', [ServiceCategoryController::class, 'show']);
Route::get('/hero-slides', [HeroSlideController::class, 'index']);
Route::get('/promotional-banners', [PromotionalBannerController::class, 'index']);
Route::get('/coupons', [CouponController::class, 'index']);
Route::post('/coupons/validate', [CouponController::class, 'validateCoupon']);
Route::get('/media', [MediaLibraryController::class, 'index']);
Route::get('/curated-services', [CuratedServiceController::class, 'index']);
Route::get('/features', [FeatureController::class, 'index']);
Route::get('/reviews', [AppointmentController::class, 'getReviews']);

// Public announcements
Route::get('/announcements', [AnnouncementController::class, 'index']);

// Public business config routes
Route::get('/branches/{branchId}/business-hours', [BusinessConfigController::class, 'getBusinessHours']);
Route::get('/branches/{branchId}/holidays', [BusinessConfigController::class, 'getHolidays']);
Route::post('/branches/{branchId}/check-availability', [BusinessConfigController::class, 'checkAvailability']);

// Protected routes
Route::middleware('auth:api')->group(function () {
    
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/me/profile', [AuthController::class, 'updateProfile']);
    Route::put('/me/password', [AuthController::class, 'updatePassword']);

    // Appointment routes (all authenticated users)
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::get('/appointments/{id}', [AppointmentController::class, 'show']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::put('/appointments/{id}', [AppointmentController::class, 'update']);
    Route::patch('/appointments/{id}/status', [AppointmentController::class, 'updateStatus']);
    Route::post('/appointments/{id}/review', [AppointmentController::class, 'submitReview']);
    Route::post('/appointments/{id}/reschedule', [AppointmentController::class, 'requestReschedule']);

    Route::get('/reschedule-requests', [AppointmentController::class, 'getRescheduleRequests']);
    Route::get('/my-reviews', [AppointmentController::class, 'getUserReviews']);
    Route::delete('/appointments/{id}', [AppointmentController::class, 'destroy']);

    // Service reviews
    Route::post('/services/{serviceId}/reviews', [AppointmentController::class, 'submitServiceReview']);
    Route::get('/services/{serviceId}/reviews', [AppointmentController::class, 'getServiceReviews']);

    // Staff leave requests
    Route::get('/leave-requests', [StaffController::class, 'leaveRequests']);
    Route::post('/leave-requests', [StaffController::class, 'submitLeaveRequest']);
    Route::patch('/leave-requests/{id}', [StaffController::class, 'updateLeaveRequest']);

    // Staff profile image
    Route::post('/staff/{id}/avatar', [StaffController::class, 'uploadAvatar']);

    // Reschedule approvals (staff/admin)
    Route::patch('/reschedule-requests/{id}', [AppointmentController::class, 'approveReschedule']);

    // Payment routes
    Route::post('/payments/create-order', [PaymentController::class, 'createOrder']);
    Route::post('/payments/verify', [PaymentController::class, 'verify']);
    Route::get('/payments/{appointmentId}/status', [PaymentController::class, 'getStatus']);
    Route::post('/payments/{paymentId}/refund', [PaymentController::class, 'refund']);

    // Membership routes
    Route::get('/my-membership', [MembershipController::class, 'getUserMembership']);
    Route::post('/memberships/subscribe', [MembershipController::class, 'subscribe']);
    Route::post('/memberships/cancel', [MembershipController::class, 'cancel']);
    Route::post('/memberships/renew', [MembershipController::class, 'renew']);

    // CRM routes (authenticated users)
    Route::get('/customers/{userId}/profile', [CRMController::class, 'getCustomerProfile']);
    Route::get('/customers/{userId}/preferences', [CRMController::class, 'updatePreferences']);
    Route::put('/customers/{userId}/preferences', [CRMController::class, 'updatePreferences']);
    Route::post('/customers/{userId}/notes', [CRMController::class, 'addNote']);
    Route::get('/customers/{userId}/notes', [CRMController::class, 'getNotes']);
    Route::put('/customers/{userId}/notes/{noteId}', [CRMController::class, 'updateNote']);
    Route::delete('/customers/{userId}/notes/{noteId}', [CRMController::class, 'deleteNote']);
    Route::post('/customers/{userId}/interactions', [CRMController::class, 'logInteraction']);
    Route::get('/customers/{userId}/interactions', [CRMController::class, 'getInteractions']);
    Route::get('/customers/{userId}/lifecycle', [CRMController::class, 'getCustomerLifecycle']);
    Route::get('/customers/search', [CRMController::class, 'searchCustomers']);
    Route::get('/customers/by-preference', [CRMController::class, 'getCustomersByPreference']);

    // Analytics & Reports routes (admin/owner only)
    Route::get('/analytics/revenue', [AnalyticsController::class, 'revenueAnalytics']);
    Route::get('/analytics/staff-performance', [AnalyticsController::class, 'staffPerformance']);
    Route::get('/analytics/services', [AnalyticsController::class, 'serviceAnalytics']);
    Route::get('/analytics/customers', [AnalyticsController::class, 'customerInsights']);
    Route::get('/analytics/appointments', [AnalyticsController::class, 'appointmentAnalytics']);
    Route::get('/analytics/dashboard', [AnalyticsController::class, 'dashboardOverview']);
    Route::post('/reports', [AnalyticsController::class, 'generateReport']);
    Route::get('/reports/{reportId}', [AnalyticsController::class, 'getReport']);
    Route::get('/reports', [AnalyticsController::class, 'listReports']);
    Route::delete('/reports/{reportId}', [AnalyticsController::class, 'deleteReport']);

    // Admin/Owner only routes
    Route::middleware('role:admin,owner')->group(function () {
        
        // Staff management
        Route::post('/staff', [StaffController::class, 'store']);
        Route::put('/staff/{id}', [StaffController::class, 'update']);
        Route::delete('/staff/{id}', [StaffController::class, 'destroy']);
        Route::patch('/staff/{id}/toggle-availability', [StaffController::class, 'toggleAvailability']);
        
        // Branch management
        Route::post('/branches', [BranchController::class, 'store']);
        Route::put('/branches/{id}', [BranchController::class, 'update']);
        Route::delete('/branches/{id}', [BranchController::class, 'destroy']);

        // Inventory management
        Route::get('/inventory', [InventoryController::class, 'index']);
        Route::get('/inventory/{id}', [InventoryController::class, 'show']);
        Route::post('/inventory', [InventoryController::class, 'store']);
        Route::put('/inventory/{id}', [InventoryController::class, 'update']);
        Route::delete('/inventory/{id}', [InventoryController::class, 'destroy']);

        // Content Management
        // Service Categories
        Route::post('/service-categories', [ServiceCategoryController::class, 'store']);
        Route::put('/service-categories/{category}', [ServiceCategoryController::class, 'update']);
        Route::delete('/service-categories/{category}', [ServiceCategoryController::class, 'destroy']);
        Route::patch('/service-categories/bulk-status', [ServiceCategoryController::class, 'bulkUpdateStatus']);
        Route::patch('/service-categories/reorder', [ServiceCategoryController::class, 'reorder']);

        // Hero Slides
        Route::post('/hero-slides', [HeroSlideController::class, 'store']);
        Route::put('/hero-slides/{slide}', [HeroSlideController::class, 'update']);
        Route::delete('/hero-slides/{slide}', [HeroSlideController::class, 'destroy']);

        // Promotional Banners
        Route::post('/promotional-banners', [PromotionalBannerController::class, 'store']);
        Route::put('/promotional-banners/{banner}', [PromotionalBannerController::class, 'update']);
        Route::delete('/promotional-banners/{banner}', [PromotionalBannerController::class, 'destroy']);

        // Announcements
        Route::post('/announcements', [AnnouncementController::class, 'store']);
        Route::put('/announcements/{announcement}', [AnnouncementController::class, 'update']);
        Route::delete('/announcements/{announcement}', [AnnouncementController::class, 'destroy']);

        // Coupons
        Route::post('/coupons', [CouponController::class, 'store']);
        Route::put('/coupons/{coupon}', [CouponController::class, 'update']);
        Route::delete('/coupons/{coupon}', [CouponController::class, 'destroy']);
        Route::post('/coupons/{coupon}/apply', [CouponController::class, 'apply']);

        // Media Library
        Route::post('/media', [MediaLibraryController::class, 'store']);
        Route::post('/media/base64', [MediaLibraryController::class, 'storeBase64']);
        Route::put('/media/{media}', [MediaLibraryController::class, 'update']);
        Route::delete('/media/{media}', [MediaLibraryController::class, 'destroy']);

        // Curated Services
        Route::post('/curated-services', [CuratedServiceController::class, 'store']);
        Route::put('/curated-services/{curatedService}', [CuratedServiceController::class, 'update']);

        // Features Management
        Route::get('/features/admin', [FeatureController::class, 'index']);
        Route::get('/features/{feature}', [FeatureController::class, 'show']);
        Route::post('/features', [FeatureController::class, 'store']);
        Route::put('/features/{feature}', [FeatureController::class, 'update']);
        Route::delete('/features/{feature}', [FeatureController::class, 'destroy']);
        Route::patch('/features/bulk-status', [FeatureController::class, 'bulkUpdateStatus']);
        Route::patch('/features/reorder', [FeatureController::class, 'reorder']);

        // Membership Plans Management
        Route::post('/membership-plans', [MembershipController::class, 'storePlan']);
        Route::put('/membership-plans/{plan}', [MembershipController::class, 'updatePlan']);
        Route::delete('/membership-plans/{plan}', [MembershipController::class, 'destroyPlan']);
        Route::get('/memberships', [MembershipController::class, 'listMemberships']);

        // Business Configuration (admin only)
        Route::post('/branches/{branchId}/business-hours', [BusinessConfigController::class, 'setBusinessHours']);
        Route::post('/branches/{branchId}/holidays', [BusinessConfigController::class, 'addHoliday']);
        Route::delete('/branches/{branchId}/holidays/{holidayId}', [BusinessConfigController::class, 'deleteHoliday']);
    });
});
