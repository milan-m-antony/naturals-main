# Image Upload Features Documentation

## Overview
All admin modules now support direct image upload functionality. Admins can upload images directly while creating/editing content, without needing to visit the Media Library separately.

## Modules with Image Upload

### 1. Service Management (`OwnerServices.tsx`)
**Location:** Owner Dashboard → Service Menu

**Features:**
- Direct image upload button in service creation/edit form
- Upload instantly saves to Media Library under "service" category
- Image picker displays all service images from Media Library
- Click any image to select it for the service
- Real-time preview of selected image

**How to Use:**
1. Click "Create Service" or edit existing service
2. In the form, find "Service Image" section
3. Click "Upload New Image" button to select from your device
4. Uploaded image automatically appears in the grid
5. Click any image from grid to select it
6. Submit form to save service with image

### 2. Banner Management (`OwnerBanners.tsx`)
**Location:** Owner/Admin Dashboard → Promotional Banners

**Features:**
- Create custom promotional banners for homepage carousel
- Direct landscape image upload
- Customize tag label, title, subtitle, description
- Choose tag background color (7 color options)
- Choose subtitle text color (6 color options)
- Real-time preview before saving
- Banners automatically appear on homepage

**How to Use:**
1. Navigate to "Promotional Banners" in dashboard
2. Click "Add Banner"
3. Upload landscape image (recommended: 1600x600px)
4. Fill in banner details:
   - Tag Label (e.g., "Limited Time")
   - Main Title (e.g., "Mega Beauty Sale")
   - Subtitle (e.g., "UP TO 50% OFF")
   - Description
   - CTA Button Text
5. Select tag background color
6. Select subtitle text color
7. Click "Create Banner"

**Banner Structure:**
```typescript
{
  tag: "Limited Time",
  title: "Mega Beauty Sale",
  subtitle: "UP TO 50% OFF",
  description: "Brief description...",
  bgImage: "base64 or URL",
  ctaText: "Explore Deals",
  theme: {
    tagBg: "bg-red-500",
    subtitleColor: "text-yellow-300"
  }
}
```

### 3. Media Library (`AdminMedia.tsx`)
**Location:** Owner/Admin Dashboard → Media Library

**Categories:**
- **service** - Images for service menu items
- **banner** - Homepage promotional banners (landscape)
- **gallery** - General gallery images
- **staff** - Staff member photos
- **product** - Product/inventory images

**Features:**
- Multi-file upload
- Drag & drop support
- Category filtering
- Search functionality
- Grid/List view modes
- Bulk selection and delete
- Image preview modal
- Real-time stats

## Technical Implementation

### Image Upload Flow
```
User selects file → 
FileReader converts to base64 → 
Create MediaItem object → 
Save to localStorage → 
Update state → 
Component re-renders → 
Image available across all modules
```

### Storage Structure

**Media Library (localStorage key: `media_library`):**
```typescript
[
  {
    id: 1640000000000,
    url: "data:image/jpeg;base64,...",
    name: "haircut.jpg",
    type: "service",
    size: "245.3 KB",
    uploadedAt: "2025-12-05T10:30:00.000Z",
    usedIn: ["Service: Haircut & Style"]
  }
]
```

**Banners (localStorage key: `banners`):**
```typescript
[
  {
    id: 1640000000001,
    tag: "Limited Time",
    title: "Mega Sale",
    subtitle: "50% OFF",
    description: "...",
    bgImage: "data:image/jpeg;base64,...",
    ctaText: "Explore Now",
    theme: {
      tagBg: "bg-red-500",
      subtitleColor: "text-yellow-300"
    }
  }
]
```

### Real-Time Updates

All components use `useEffect` to listen for state changes:

```typescript
// Load on mount
const [images, setImages] = useState(() => {
  const saved = localStorage.getItem('media_library');
  return saved ? JSON.parse(saved) : [];
});

// Auto-save on change
useEffect(() => {
  localStorage.setItem('media_library', JSON.stringify(images));
}, [images]);
```

### Homepage Integration

The `OffersPoster` component automatically loads banners:

```typescript
useEffect(() => {
  const saved = localStorage.getItem('banners');
  if (saved) {
    const banners = JSON.parse(saved);
    if (banners.length > 0) {
      setPOSTERS(banners); // Use custom banners
    }
  }
  // Falls back to default banners if none created
}, []);
```

## Image Specifications

### Service Images
- **Type:** Square or portrait
- **Recommended Size:** 800x800px
- **Aspect Ratio:** 1:1 or 4:5
- **Format:** JPG, PNG, WebP
- **Max File Size:** 5MB

### Banner Images
- **Type:** Landscape
- **Recommended Size:** 1600x600px
- **Aspect Ratio:** 8:3
- **Format:** JPG, PNG, WebP
- **Max File Size:** 5MB
- **Note:** Should have good contrast for text overlay

### Gallery/Staff/Product Images
- **Type:** Any orientation
- **Recommended Size:** 1200x1200px max
- **Format:** JPG, PNG, WebP
- **Max File Size:** 3MB

## Browser Compatibility

- **FileReader API:** All modern browsers
- **Base64 Encoding:** Universal support
- **localStorage:** 5-10MB limit (browser dependent)

## Best Practices

1. **Image Optimization:**
   - Compress images before upload
   - Use appropriate resolution (not too high)
   - Consider using WebP format for better compression

2. **Storage Management:**
   - Regularly clean up unused images in Media Library
   - Delete old banners that are no longer active
   - Monitor localStorage usage

3. **Banner Design:**
   - Use high-contrast text colors for readability
   - Keep text concise and impactful
   - Test on mobile devices (banners are responsive)
   - Ensure images work with text overlay

4. **Service Images:**
   - Use professional, high-quality photos
   - Maintain consistent style across services
   - Show the actual service result when possible

## Future Enhancements (Requires Backend)

- [ ] Server-side image storage (AWS S3, Cloudinary)
- [ ] Image compression and optimization on upload
- [ ] Multiple image sizes (thumbnails, medium, full)
- [ ] CDN integration for faster loading
- [ ] Image cropping and editing tools
- [ ] Bulk upload with progress bar
- [ ] Usage tracking ("Used in 3 services")
- [ ] Image search by tags/metadata
- [ ] Automatic format conversion (to WebP)
- [ ] Lazy loading for large galleries

## Troubleshooting

**Issue:** Images not appearing after upload
- **Solution:** Check browser console for errors, verify localStorage is enabled

**Issue:** Upload button not responding
- **Solution:** Check file size (may be too large), verify file format is supported

**Issue:** Banners not showing on homepage
- **Solution:** Ensure at least one banner is created and saved, refresh homepage

**Issue:** localStorage quota exceeded
- **Solution:** Delete unused images from Media Library, clear browser cache

## Summary

✅ Direct image upload in service creation
✅ Complete banner management system
✅ Real-time updates across all modules
✅ localStorage persistence
✅ Mobile responsive
✅ Dark mode support
✅ Professional UI/UX
