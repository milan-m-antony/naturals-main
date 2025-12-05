# Content Management API Documentation

## Overview
This documentation covers the new Content Management API endpoints for managing homepage content including service categories, hero slides, promotional banners, coupons, and media library.

---

## Service Categories

### Get All Categories
```http
GET /api/service-categories
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Hair Care",
    "image": "/storage/media/uuid.jpg",
    "sort_order": 0,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
]
```

### Create Category (Admin/Owner)
```http
POST /api/service-categories
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "Hair Care",
  "image": "/storage/media/uuid.jpg",
  "sort_order": 0,
  "is_active": true
}
```

### Update Category (Admin/Owner)
```http
PUT /api/service-categories/{id}
Authorization: Bearer {token}
```

### Delete Category (Admin/Owner)
```http
DELETE /api/service-categories/{id}
Authorization: Bearer {token}
```

---

## Hero Slides

### Get All Slides
```http
GET /api/hero-slides
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Transform Your Look",
    "subtitle": "Premium Hair & Beauty Services",
    "description": "Experience luxury treatments",
    "accent_color": "#10B981",
    "badge": "NEW",
    "price": "Starting from ₹299",
    "image": "/storage/media/uuid.jpg",
    "sort_order": 0,
    "is_active": true
  }
]
```

### Create Slide (Admin/Owner)
```http
POST /api/hero-slides
Authorization: Bearer {token}
```

### Update Slide (Admin/Owner)
```http
PUT /api/hero-slides/{id}
Authorization: Bearer {token}
```

### Delete Slide (Admin/Owner)
```http
DELETE /api/hero-slides/{id}
Authorization: Bearer {token}
```

---

## Promotional Banners

### Get All Banners
```http
GET /api/promotional-banners
```

**Response:**
```json
[
  {
    "id": 1,
    "tag": "SPECIAL OFFER",
    "title": "50% Off First Visit",
    "subtitle": "Book Now and Save",
    "bg_color": "#8B5CF6",
    "text_color": "#FFFFFF",
    "bg_image": "/storage/media/uuid.jpg",
    "sort_order": 0,
    "is_active": true
  }
]
```

### Create Banner (Admin/Owner)
```http
POST /api/promotional-banners
Authorization: Bearer {token}
```

### Update Banner (Admin/Owner)
```http
PUT /api/promotional-banners/{id}
Authorization: Bearer {token}
```

### Delete Banner (Admin/Owner)
```http
DELETE /api/promotional-banners/{id}
Authorization: Bearer {token}
```

---

## Coupons

### Get Active Coupons
```http
GET /api/coupons
```

**Response:**
```json
[
  {
    "id": 1,
    "code": "FIRST50",
    "title": "50% Off First Visit",
    "description": "Valid for new customers only",
    "discount_type": "percentage",
    "discount_value": 50.00,
    "min_purchase": 500.00,
    "max_discount": 300.00,
    "usage_limit": 100,
    "usage_count": 25,
    "color_theme": "purple",
    "valid_from": "2024-01-01",
    "valid_until": "2024-12-31",
    "is_active": true
  }
]
```

### Validate Coupon
```http
POST /api/coupons/validate
```

**Request Body:**
```json
{
  "code": "FIRST50",
  "amount": 1000
}
```

**Response:**
```json
{
  "valid": true,
  "coupon": { /* coupon object */ },
  "discount": 300.00,
  "final_amount": 700.00
}
```

### Create Coupon (Admin/Owner)
```http
POST /api/coupons
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "code": "FIRST50",
  "title": "50% Off First Visit",
  "description": "Valid for new customers only",
  "discount_type": "percentage",
  "discount_value": 50,
  "min_purchase": 500,
  "max_discount": 300,
  "usage_limit": 100,
  "color_theme": "purple",
  "valid_from": "2024-01-01",
  "valid_until": "2024-12-31",
  "is_active": true
}
```

### Update Coupon (Admin/Owner)
```http
PUT /api/coupons/{id}
Authorization: Bearer {token}
```

### Apply Coupon (Admin/Owner)
```http
POST /api/coupons/{id}/apply
Authorization: Bearer {token}
```

### Delete Coupon (Admin/Owner)
```http
DELETE /api/coupons/{id}
Authorization: Bearer {token}
```

---

## Media Library

### Get All Media
```http
GET /api/media?category=service
```

**Query Parameters:**
- `category` (optional): Filter by category (service, banner, gallery, staff, product, hero, category, other)

**Response:**
```json
[
  {
    "id": 1,
    "name": "hero-image.jpg",
    "file_path": "/storage/media/uuid.jpg",
    "file_type": "image/jpeg",
    "file_size": 245760,
    "category": "hero",
    "alt_text": "Hero banner image",
    "description": "Main hero slide image",
    "created_at": "2024-01-01T00:00:00.000000Z"
  }
]
```

### Upload Media File (Admin/Owner)
```http
POST /api/media
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [image file]
category: service
alt_text: Hero banner image
description: Main hero slide image
```

### Upload Base64 Image (Admin/Owner)
```http
POST /api/media/base64
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "name": "hero-image.jpg",
  "category": "hero",
  "alt_text": "Hero banner image",
  "description": "Main hero slide image"
}
```

### Update Media (Admin/Owner)
```http
PUT /api/media/{id}
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "updated-name.jpg",
  "category": "service",
  "alt_text": "Updated alt text",
  "description": "Updated description"
}
```

### Delete Media (Admin/Owner)
```http
DELETE /api/media/{id}
Authorization: Bearer {token}
```

---

## Database Schema

### service_categories
- `id` - Primary key
- `name` - Category name
- `image` - Image URL/path
- `sort_order` - Display order
- `is_active` - Active status
- `timestamps`

### hero_slides
- `id` - Primary key
- `title` - Slide title
- `subtitle` - Slide subtitle
- `description` - Slide description
- `accent_color` - Hex color code
- `badge` - Badge text
- `price` - Price text
- `image` - Image URL/path
- `sort_order` - Display order
- `is_active` - Active status
- `timestamps`

### promotional_banners
- `id` - Primary key
- `tag` - Banner tag
- `title` - Banner title
- `subtitle` - Banner subtitle
- `bg_color` - Background color (hex)
- `text_color` - Text color (hex)
- `bg_image` - Background image URL/path
- `sort_order` - Display order
- `is_active` - Active status
- `timestamps`

### coupons
- `id` - Primary key
- `code` - Unique coupon code
- `title` - Coupon title
- `description` - Coupon description
- `discount_type` - percentage or fixed
- `discount_value` - Discount amount
- `min_purchase` - Minimum purchase amount
- `max_discount` - Maximum discount amount
- `usage_limit` - Maximum usage count
- `usage_count` - Current usage count
- `color_theme` - Color theme name
- `valid_from` - Start date
- `valid_until` - End date
- `is_active` - Active status
- `timestamps`

### media_library
- `id` - Primary key
- `name` - File name
- `file_path` - File storage path
- `file_type` - MIME type
- `file_size` - File size in bytes
- `category` - Media category
- `alt_text` - Alt text for images
- `description` - File description
- `timestamps`

---

## Migration Commands

Run these commands in the backend directory:

```bash
# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Fresh migration (caution: deletes all data)
php artisan migrate:fresh
```

---

## Storage Setup

Ensure the storage link is created:

```bash
php artisan storage:link
```

This creates a symbolic link from `public/storage` to `storage/app/public`.

---

## Notes

1. All admin/owner routes require authentication via Bearer token
2. Image uploads support up to 10MB file size
3. Base64 uploads are useful for frontend image editors
4. Media library supports automatic categorization
5. Coupons have built-in validation logic
6. All content endpoints support sort_order for custom ordering
