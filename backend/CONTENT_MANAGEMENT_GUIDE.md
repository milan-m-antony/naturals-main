# Content Management System - Complete Guide

## Overview
The Naturals platform includes a comprehensive content management system (CMS) for managing:
- **Hero Slides** - Homepage carousel content
- **Promotional Banners** - Marketing banners with positioning
- **Coupons & Discounts** - Promotional codes and offers
- **Service Categories** - Service classification and organization
- **Media Library** - Image and file management
- **Features** - Homepage feature flags and ordering
- **Curated Services** - Featured service combinations

---

## API Endpoints

### Hero Slides Management
Manage homepage carousel slides

```
GET    /api/admin/hero-slides          - List all hero slides
POST   /api/admin/hero-slides          - Create new hero slide
PUT    /api/admin/hero-slides/{id}     - Update hero slide
DELETE /api/admin/hero-slides/{id}     - Delete hero slide
```

**Request Body (POST/PUT):**
```json
{
  "title": "Summer Specials",
  "subtitle": "Up to 50% Off",
  "description": "Limited time offer on all services",
  "accent_color": "#FF6B6B",
  "badge": "TRENDING",
  "price": "₹999",
  "image": "base64_or_url_string",
  "sort_order": 1,
  "is_active": true
}
```

---

### Promotional Banners
Manage marketing banners with positioning

```
GET    /api/admin/promotional-banners          - List all banners
POST   /api/admin/promotional-banners          - Create new banner
PUT    /api/admin/promotional-banners/{id}     - Update banner
DELETE /api/admin/promotional-banners/{id}     - Delete banner
```

**Request Body (POST/PUT):**
```json
{
  "tag": "SALE",
  "title": "Mega Sale on All Services",
  "subtitle": "Only this weekend",
  "bg_color": "#2C3E50",
  "text_color": "#FFFFFF",
  "bg_image": "base64_or_url_string",
  "sort_order": 1,
  "is_active": true
}
```

**Banner Positioning System:**
Banners can be positioned in:
- `header` - Top navigation area
- `hero` - Hero section overlay
- `home_top` - Below hero section
- `home_middle` - Middle of homepage
- `home_bottom` - Below services
- `sidebar` - Sidebar placement
- `modal` - Popup/modal display
- `footer` - Footer section

---

### Coupons & Discounts
Manage promotional coupons

```
GET    /api/admin/coupons           - List all coupons
POST   /api/admin/coupons           - Create new coupon
PUT    /api/admin/coupons/{id}      - Update coupon
DELETE /api/admin/coupons/{id}      - Delete coupon
POST   /api/coupons/validate        - Validate coupon code
```

**Request Body (POST/PUT):**
```json
{
  "code": "SUMMER50",
  "title": "Summer Special - 50% Off",
  "description": "Get 50% discount on selected services",
  "discount_type": "percentage",
  "discount_value": 50,
  "min_purchase": 1000,
  "max_discount": 5000,
  "usage_limit": 100,
  "color_theme": "success",
  "valid_from": "2024-06-01",
  "valid_until": "2024-08-31",
  "is_active": true
}
```

**Coupon Validation Endpoint:**
```
POST /api/coupons/validate
{
  "code": "SUMMER50",
  "amount": 1500
}

Response:
{
  "valid": true,
  "discount": 750,
  "final_amount": 750,
  "message": "Coupon applied successfully"
}
```

---

### Service Categories
Manage service categories

```
GET    /api/admin/service-categories              - List categories
POST   /api/admin/service-categories              - Create category
PUT    /api/admin/service-categories/{id}         - Update category
DELETE /api/admin/service-categories/{id}         - Delete category
PUT    /api/admin/service-categories/{id}/reorder - Reorder categories
```

**Request Body (POST/PUT):**
```json
{
  "name": "Hair Care",
  "description": "All hair-related services",
  "image": "base64_or_url_string",
  "sort_order": 1,
  "is_active": true
}
```

---

### Media Library
Upload and manage media files

```
GET    /api/admin/media                    - List media files
POST   /api/admin/media                    - Upload file
POST   /api/admin/media/upload-base64      - Upload base64 image
DELETE /api/admin/media/{id}               - Delete media
```

**File Upload (POST):**
Form Data:
```
file: <file>
category: service | banner | gallery | staff | product | hero | category | other
alt_text: Optional description
description: Optional long description
```

**Base64 Upload (POST /api/admin/media/upload-base64):**
```json
{
  "image": "data:image/png;base64,iVBORw0KGgo...",
  "name": "banner-image.png",
  "category": "banner",
  "alt_text": "Banner image",
  "description": "Main promotional banner"
}
```

---

### Features Management
Manage homepage feature flags and ordering

```
GET    /api/admin/features              - List all features
POST   /api/admin/features              - Create feature
PUT    /api/admin/features/{id}         - Update feature
DELETE /api/admin/features/{id}         - Delete feature
PUT    /api/admin/features/{id}/toggle  - Toggle feature active status
```

**Request Body (POST/PUT):**
```json
{
  "name": "Summer Collection",
  "description": "Showcase new summer services",
  "icon": "star",
  "is_active": true,
  "sort_order": 1
}
```

---

### Curated Services
Manage featured service combinations

```
GET    /api/admin/curated-services           - List curated services
POST   /api/admin/curated-services           - Create curated service
PUT    /api/admin/curated-services/{id}      - Update
DELETE /api/admin/curated-services/{id}      - Delete
```

**Request Body (POST/PUT):**
```json
{
  "title": "Bridal Package",
  "description": "Complete bridal beauty package",
  "service_ids": [1, 2, 3],
  "total_price": 5000,
  "discount_percentage": 20,
  "image": "base64_or_url_string",
  "is_active": true,
  "sort_order": 1
}
```

---

## Text Fields Management

### Editable Text Fields
For managing text content across the platform:

```
GET    /api/admin/text-fields          - List all text fields
POST   /api/admin/text-fields          - Create/update text field
GET    /api/admin/text-fields/{key}    - Get specific text field
```

**Common Text Field Keys:**
```
home.hero.title
home.hero.subtitle
home.about.title
home.about.description
home.services.title
home.services.subtitle
footer.description
footer.contact_info
terms_of_service
privacy_policy
faq_content
```

**Request Body:**
```json
{
  "key": "home.hero.title",
  "value": "Welcome to Naturals Salon",
  "section": "home",
  "description": "Hero section main title"
}
```

---

## Advertisements Management

### Ad Placements
Manage advertisements across the platform

```
GET    /api/admin/advertisements              - List ads
POST   /api/admin/advertisements              - Create ad
PUT    /api/admin/advertisements/{id}         - Update ad
DELETE /api/admin/advertisements/{id}         - Delete ad
```

**Request Body:**
```json
{
  "title": "Premium Membership",
  "description": "Exclusive benefits for members",
  "image": "base64_or_url_string",
  "placement": "sidebar",
  "target_audience": "all|new_customers|members|staff",
  "priority": 1,
  "valid_from": "2024-06-01",
  "valid_until": "2024-08-31",
  "is_active": true
}
```

**Placement Options:**
- `sidebar` - Right sidebar
- `modal` - Popup/modal
- `banner_top` - Top banner
- `banner_bottom` - Bottom banner
- `widget` - Widget area
- `email` - Email newsletters

---

## Admin Dashboard Integration

### Content Management Module
The Admin Dashboard includes a Content Management module with:

1. **Dashboard Overview**
   - Active content count
   - Recent updates
   - Performance metrics

2. **Hero Slides Module**
   - Create/edit slides
   - Drag-to-reorder
   - Preview functionality
   - Image optimization

3. **Banners Module**
   - Create/edit banners
   - Multiple positioning options
   - Color theme selection
   - Campaign tracking

4. **Coupons Module**
   - Create promotional codes
   - Set validity periods
   - Track usage statistics
   - Bulk operations

5. **Media Library**
   - Browse uploaded files
   - Bulk upload
   - Image optimization
   - Category filtering

6. **Text Fields Editor**
   - Edit page content directly
   - Preview changes
   - Version history

7. **Advertisements Manager**
   - Create ad campaigns
   - Set placements and scheduling
   - Track performance metrics

---

## Frontend Integration

### Using Content in React Components

**Hero Slides:**
```typescript
import { useEffect, useState } from 'react';

export default function HeroSlides() {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    fetch('/api/hero-slides')
      .then(res => res.json())
      .then(data => setSlides(data));
  }, []);

  return (
    <Carousel>
      {slides.map(slide => (
        <div key={slide.id} style={{ backgroundColor: slide.accent_color }}>
          <img src={slide.image} alt={slide.title} />
          <h1>{slide.title}</h1>
          <p>{slide.subtitle}</p>
        </div>
      ))}
    </Carousel>
  );
}
```

**Promotional Banners:**
```typescript
export default function PromoSection() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetch('/api/promotional-banners')
      .then(res => res.json())
      .then(data => setBanners(data));
  }, []);

  return (
    <div className="promo-section">
      {banners.map(banner => (
        <div key={banner.id} 
             style={{
               backgroundColor: banner.bg_color,
               color: banner.text_color
             }}>
          <h2>{banner.title}</h2>
          <p>{banner.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
```

**Coupons:**
```typescript
async function applyCoupon(code: string, amount: number) {
  const response = await fetch('/api/coupons/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, amount })
  });
  
  const data = await response.json();
  if (data.valid) {
    // Apply discount
    return data.discount;
  }
}
```

---

## Database Schema

### Hero Slides Table
```sql
CREATE TABLE hero_slides (
  id BIGINT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description LONGTEXT,
  accent_color VARCHAR(7),
  badge VARCHAR(255),
  price VARCHAR(255),
  image LONGTEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Promotional Banners Table
```sql
CREATE TABLE promotional_banners (
  id BIGINT PRIMARY KEY,
  tag VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  bg_color VARCHAR(7),
  text_color VARCHAR(7),
  bg_image LONGTEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Coupons Table
```sql
CREATE TABLE coupons (
  id BIGINT PRIMARY KEY,
  code VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT,
  discount_type ENUM('percentage', 'fixed'),
  discount_value DECIMAL(10,2),
  min_purchase DECIMAL(10,2),
  max_discount DECIMAL(10,2),
  usage_limit INT,
  color_theme VARCHAR(50),
  valid_from DATE,
  valid_until DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## Best Practices

### Image Optimization
1. **File Size**: Keep images under 1MB for optimal loading
2. **Format**: Use PNG for graphics, JPG for photos
3. **Dimensions**: 
   - Hero slides: 1920x600px
   - Banners: 1200x300px
   - Category icons: 200x200px
   - Media: Vary based on usage

### Content Guidelines
1. **Hero Slides**: Maximum 5-6 active slides
2. **Banners**: Rotate monthly campaigns
3. **Coupons**: Clear validity periods
4. **Features**: Update quarterly
5. **Text Fields**: Keep concise and SEO-friendly

### Admin Checklist
- [ ] Update hero slides quarterly
- [ ] Review coupon usage monthly
- [ ] Optimize images before upload
- [ ] Keep text fields updated
- [ ] Archive old campaigns
- [ ] Monitor banner performance
- [ ] Regular content backups

---

## Error Responses

### Validation Errors
```json
{
  "message": "Validation failed",
  "errors": {
    "code": ["The code field is required"],
    "discount_value": ["The discount value must be numeric"]
  }
}
```

### Authorization Errors
```json
{
  "message": "Unauthorized",
  "error": "Only admin users can manage content"
}
```

### Resource Not Found
```json
{
  "message": "Hero slide not found",
  "error": "The requested resource does not exist"
}
```

---

## Seeding Initial Content

Run migrations:
```bash
php artisan migrate
```

Seed sample data:
```bash
php artisan db:seed --class=ContentSeeder
```

---

## Performance Tips

1. **Pagination**: Use pagination for large content lists
2. **Caching**: Cache frequently accessed content
3. **CDN**: Store media on CDN for faster delivery
4. **Database Indexing**: Index frequently queried fields
5. **API Rate Limiting**: Protect admin endpoints

---

## Support

For issues or questions regarding the CMS:
- Check database migrations in `database/migrations`
- Review controller implementations in `app/Http/Controllers`
- Consult model relationships in `app/Models`
- Test endpoints in Postman/Insomnia
