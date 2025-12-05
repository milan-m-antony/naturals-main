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

// Public branch routes
Route::get('/branches', [BranchController::class, 'index']);
Route::get('/branches/{id}', [BranchController::class, 'show']);

// Public staff routes
Route::get('/staff', [StaffController::class, 'index']);
Route::get('/staff/{id}', [StaffController::class, 'show']);

// Public content routes (for homepage)
Route::get('/service-categories', [ServiceCategoryController::class, 'index']);
Route::get('/hero-slides', [HeroSlideController::class, 'index']);
Route::get('/promotional-banners', [PromotionalBannerController::class, 'index']);
Route::get('/coupons', [CouponController::class, 'index']);
Route::post('/coupons/validate', [CouponController::class, 'validate']);
Route::get('/media', [MediaLibraryController::class, 'index']);
Route::get('/curated-services', [CuratedServiceController::class, 'index']);

// Protected routes
Route::middleware('auth:api')->group(function () {
    
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/me', [AuthController::class, 'me']);

    // Appointment routes (all authenticated users)
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::get('/appointments/{id}', [AppointmentController::class, 'show']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::put('/appointments/{id}', [AppointmentController::class, 'update']);
    Route::patch('/appointments/{id}/status', [AppointmentController::class, 'updateStatus']);
    Route::delete('/appointments/{id}', [AppointmentController::class, 'destroy']);

    // Staff leave requests
    Route::get('/leave-requests', [StaffController::class, 'leaveRequests']);
    Route::post('/leave-requests', [StaffController::class, 'submitLeaveRequest']);
    Route::patch('/leave-requests/{id}', [StaffController::class, 'updateLeaveRequest']);

    // Admin/Owner only routes
    Route::middleware('role:admin,owner')->group(function () {
        
        // Service management
        Route::post('/services', [ServiceController::class, 'store']);
        Route::put('/services/{id}', [ServiceController::class, 'update']);
        Route::delete('/services/{id}', [ServiceController::class, 'destroy']);

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

        // Hero Slides
        Route::post('/hero-slides', [HeroSlideController::class, 'store']);
        Route::put('/hero-slides/{slide}', [HeroSlideController::class, 'update']);
        Route::delete('/hero-slides/{slide}', [HeroSlideController::class, 'destroy']);

        // Promotional Banners
        Route::post('/promotional-banners', [PromotionalBannerController::class, 'store']);
        Route::put('/promotional-banners/{banner}', [PromotionalBannerController::class, 'update']);
        Route::delete('/promotional-banners/{banner}', [PromotionalBannerController::class, 'destroy']);

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
    });
});
