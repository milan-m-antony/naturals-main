# Service Management Guide

## Overview
The Service Management system allows you to manage all salon services, organized by categories. Services can be added, edited, and deleted from the Owner Dashboard.

## How to Access

1. Go to **Owner Dashboard** → **Service Menu**
2. Or navigate through **Content Management** → You can manage categories there

## Quick Start

### Load Default Hair Services
If you're starting fresh, click the **"Load Hair Services"** button to quickly populate 9 common hair services:

- Haircut (Women) - ₹499
- Haircut (Men) - ₹299
- Hair Styling (Blow-dry) - ₹399
- Hair Styling (Curls & Updos) - ₹599
- Hair Colouring & Highlights - ₹1299
- Beard Trim / Shave - ₹199
- Hair Spa & Nourishing Treatments - ₹799
- Hair Straightening / Smoothening - ₹1999
- Head Massage - ₹299

## Adding a Service

### Method 1: Add Individual Service
1. Click **"+ Add Service"** button
2. Fill in the details:
   - **Name**: Service name (e.g., "Haircut - Women")
   - **Category**: Select from dropdown (Hair Services, Skin Care, etc.)
   - **Price (₹)**: Service price
   - **Duration (min)**: How long the service takes
   - **Discount (%)**: Optional discount percentage
   - **Description**: Detailed service description
   - **Image**: Upload or select from Media Library

3. Click **"Create Service"**

### Method 2: Add with Quick Template
1. From the Service Menu, you can copy details from existing services
2. Modify and save as new service

## Organizing by Categories

### Adding New Categories
1. Go to **Content Management** → **Service Categories**
2. Click **"+ Add Category"**
3. Fill in:
   - **Name**: Category name (e.g., "Hair Services")
   - **Description**: What services are in this category
   - **Image**: Optional category image
   - **Active**: Toggle to enable/disable

### Grouping Services
- Services are automatically grouped by category
- Click on a category to expand/collapse and see all services in it
- When adding a service, select the appropriate category

## Example Service Structure

```
Hair Services (Category)
├── Haircut (Women) - ₹499
├── Haircut (Men) - ₹299
├── Hair Styling (Blow-dry) - ₹399
├── Hair Colouring - ₹1299
└── Hair Spa - ₹799

Skin Care (Category)
├── Brightening Facial - ₹1800
├── Gold Facial - ₹1999
└── De-Tan Pack - ₹600
```

## Editing Services

1. Navigate to the service in Service Menu
2. Click the **Edit** icon (pencil) on the service card
3. Modify the details
4. Click **"Update Service"**

## Deleting Services

1. Click the **Delete** icon (trash) on the service card
2. Confirm the deletion

## Best Practices

1. **Always set a category** - Services must belong to a category
2. **Use consistent pricing** - Keep similar services at competitive prices
3. **Add descriptions** - Help customers understand what they're getting
4. **Upload images** - Visual representation increases bookings
5. **Set realistic duration** - Affects staff scheduling and customer availability
6. **Regular updates** - Keep prices and descriptions current

## API Integration

Services are saved to your backend database and loaded via:
- **Frontend**: `useData()` hook fetches from API
- **Backend**: `/api/services` endpoint (Laravel)
- **Database**: PostgreSQL `services` table

## Service Fields Reference

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | Yes | Service name |
| category | string | Yes | Must match a category |
| price | number | Yes | Price in rupees |
| duration | number | Yes | Duration in minutes |
| description | string | Yes | Service details |
| discount | number | No | Discount percentage (0-100) |
| image | string | No | Image URL from Media Library |
| rating | number | No | Auto-calculated from reviews |
| reviews_count | number | No | Auto-calculated from bookings |

## Troubleshooting

### Services not showing?
- Check if category is set to "Active" in Service Categories
- Ensure backend is running and database is connected
- Check browser console for API errors

### Images not uploading?
- First upload to Media Library (Content Management → Media Library)
- Then select from available images in the Service form
- Or upload directly from the Service form

### Can't delete service?
- Check if it's linked to any appointments
- Active appointments might prevent deletion
- Contact support if persisted

## Next Steps

1. ✅ Add your services with accurate pricing and descriptions
2. ✅ Set up service categories that match your offerings
3. ✅ Add beautiful images from Media Library
4. ✅ Configure staff specializations for each service
5. ✅ Set up discounts and promotions through Coupons section
