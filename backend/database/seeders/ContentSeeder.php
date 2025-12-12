<?php

namespace Database\Seeders;

use App\Models\HeroSlide;
use App\Models\PromotionalBanner;
use App\Models\Coupon;
use App\Models\ServiceCategory;
use App\Models\Feature;
use App\Models\CuratedService;
use App\Models\Announcement;
use Illuminate\Database\Seeder;

class ContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedHeroSlides();
        $this->seedPromotionalBanners();
        $this->seedCoupons();
        $this->seedServiceCategories();
        $this->seedFeatures();
        $this->seedCuratedServices();
        $this->seedAnnouncements();
    }

    private function seedHeroSlides(): void
    {
        HeroSlide::create([
            'title' => 'Summer Collection 2024',
            'subtitle' => 'Discover Premium Beauty Services',
            'description' => 'Experience luxury beauty treatments with our expert stylists',
            'accent_color' => '#FF6B6B',
            'badge' => 'TRENDING',
            'price' => null,
            'image' => 'https://images.unsplash.com/photo-1552183794-5285034a0b0a?w=1920&h=600&fit=crop',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        HeroSlide::create([
            'title' => 'Special Bridal Packages',
            'subtitle' => 'Look Your Best on Your Special Day',
            'description' => 'Complete bridal beauty solutions with expert consultation',
            'accent_color' => '#FF69B4',
            'badge' => 'LIMITED OFFER',
            'price' => '₹9,999',
            'image' => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=600&fit=crop',
            'sort_order' => 2,
            'is_active' => true,
        ]);

        HeroSlide::create([
            'title' => 'Membership Benefits',
            'subtitle' => 'Get Exclusive Discounts & Rewards',
            'description' => 'Join our premium membership program today',
            'accent_color' => '#4ECDC4',
            'badge' => 'EXCLUSIVE',
            'price' => null,
            'image' => 'https://images.unsplash.com/photo-1487881594728-fc9dfb8fbf4d?w=1920&h=600&fit=crop',
            'sort_order' => 3,
            'is_active' => true,
        ]);
    }

    private function seedPromotionalBanners(): void
    {
        PromotionalBanner::create([
            'tag' => 'SUMMER SALE',
            'title' => 'Get 50% Off on Hair Services',
            'subtitle' => 'Valid till end of June',
            'bg_color' => '#2C3E50',
            'text_color' => '#FFFFFF',
            'bg_image' => 'https://images.unsplash.com/photo-1562258323-15503ef3d944?w=1200&h=300&fit=crop',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        PromotionalBanner::create([
            'tag' => 'NEW OFFER',
            'title' => 'Free Threading with Every Facial',
            'subtitle' => 'Book now and save more',
            'bg_color' => '#E67E22',
            'text_color' => '#FFFFFF',
            'bg_image' => 'https://images.unsplash.com/photo-1620331311671-df46aad21e30?w=1200&h=300&fit=crop',
            'sort_order' => 2,
            'is_active' => true,
        ]);

        PromotionalBanner::create([
            'tag' => 'FLASH DEAL',
            'title' => 'Buy 1 Get 1 Free on Makeup',
            'subtitle' => 'Limited time only',
            'bg_color' => '#9B59B6',
            'text_color' => '#FFFFFF',
            'bg_image' => null,
            'sort_order' => 3,
            'is_active' => true,
        ]);
    }

    private function seedCoupons(): void
    {
        Coupon::create([
            'code' => 'SUMMER50',
            'title' => 'Summer Special - 50% Off',
            'description' => 'Get 50% discount on all hair services',
            'discount_type' => 'percentage',
            'discount_value' => 50,
            'min_purchase' => 500,
            'max_discount' => 2500,
            'usage_limit' => 100,
            'color_theme' => 'success',
            'valid_from' => now(),
            'valid_until' => now()->addMonths(2),
            'is_active' => true,
        ]);

        Coupon::create([
            'code' => 'NEWUSER200',
            'title' => 'Welcome Offer - ₹200 Off',
            'description' => '₹200 discount on your first booking',
            'discount_type' => 'fixed',
            'discount_value' => 200,
            'min_purchase' => 1000,
            'max_discount' => 200,
            'usage_limit' => 1000,
            'color_theme' => 'info',
            'valid_from' => now(),
            'valid_until' => now()->addMonths(12),
            'is_active' => true,
        ]);

        Coupon::create([
            'code' => 'MEMBER20',
            'title' => 'Member Exclusive - 20% Off',
            'description' => '20% discount for all members',
            'discount_type' => 'percentage',
            'discount_value' => 20,
            'min_purchase' => 0,
            'max_discount' => 1000,
            'usage_limit' => null,
            'color_theme' => 'warning',
            'valid_from' => now(),
            'valid_until' => null,
            'is_active' => true,
        ]);

        Coupon::create([
            'code' => 'REFER500',
            'title' => 'Referral Bonus - ₹500 Off',
            'description' => 'Earn ₹500 for every friend you refer',
            'discount_type' => 'fixed',
            'discount_value' => 500,
            'min_purchase' => 2000,
            'max_discount' => 500,
            'usage_limit' => 50,
            'color_theme' => 'primary',
            'valid_from' => now(),
            'valid_until' => now()->addMonths(6),
            'is_active' => true,
        ]);
    }

    private function seedServiceCategories(): void
    {
        ServiceCategory::create([
            'name' => 'Hair Care',
            'description' => 'Complete hair treatment and styling services',
            'image' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        ServiceCategory::create([
            'name' => 'Facial & Skincare',
            'description' => 'Professional facial and skin treatment services',
            'image' => 'https://images.unsplash.com/photo-1516746933520-26ddb588cb58?w=400&h=400&fit=crop',
            'sort_order' => 2,
            'is_active' => true,
        ]);

        ServiceCategory::create([
            'name' => 'Makeup & Styling',
            'description' => 'Professional makeup application and styling',
            'image' => 'https://images.unsplash.com/photo-1487412992651-d8accf73c34e?w=400&h=400&fit=crop',
            'sort_order' => 3,
            'is_active' => true,
        ]);

        ServiceCategory::create([
            'name' => 'Body Spa',
            'description' => 'Relaxing body spa and massage services',
            'image' => 'https://images.unsplash.com/photo-1540555700212-9c21979e842f?w=400&h=400&fit=crop',
            'sort_order' => 4,
            'is_active' => true,
        ]);

        ServiceCategory::create([
            'name' => 'Threading & Waxing',
            'description' => 'Hair removal services',
            'image' => 'https://images.unsplash.com/photo-1552183794-5285034a0b0a?w=400&h=400&fit=crop',
            'sort_order' => 5,
            'is_active' => true,
        ]);

        ServiceCategory::create([
            'name' => 'Nail Care',
            'description' => 'Manicure, pedicure and nail art services',
            'image' => 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop',
            'sort_order' => 6,
            'is_active' => true,
        ]);
    }

    private function seedFeatures(): void
    {
        Feature::create([
            'name' => 'Expert Professionals',
            'description' => 'Highly trained and certified beauty experts',
            'icon' => 'star',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        Feature::create([
            'name' => 'Premium Products',
            'description' => 'Only the finest quality beauty products used',
            'icon' => 'sparkles',
            'is_active' => true,
            'sort_order' => 2,
        ]);

        Feature::create([
            'name' => 'Hygienic Environment',
            'description' => 'Strict hygiene and sterilization standards',
            'icon' => 'shield-check',
            'is_active' => true,
            'sort_order' => 3,
        ]);

        Feature::create([
            'name' => 'Personalized Service',
            'description' => 'Customized treatments for your needs',
            'icon' => 'heart',
            'is_active' => true,
            'sort_order' => 4,
        ]);

        Feature::create([
            'name' => 'Affordable Prices',
            'description' => 'Best value for money services',
            'icon' => 'credit-card',
            'is_active' => true,
            'sort_order' => 5,
        ]);

        Feature::create([
            'name' => '24/7 Support',
            'description' => 'Round the clock customer support',
            'icon' => 'headphones',
            'is_active' => true,
            'sort_order' => 6,
        ]);
    }

    private function seedCuratedServices(): void
    {
        // Note: Ensure service IDs 1, 2, 3 exist before running this seeder
        CuratedService::create([
            'title' => 'Bridal Beauty Package',
            'description' => 'Complete bridal beauty solutions including hair, makeup, and facial',
            'service_ids' => json_encode([1, 2, 3]),
            'total_price' => 15000,
            'discount_percentage' => 15,
            'image' => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
            'is_active' => true,
            'sort_order' => 1,
        ]);

        CuratedService::create([
            'title' => 'Corporate Wellness Package',
            'description' => 'Stress relief and wellness treatments for corporate clients',
            'service_ids' => json_encode([4, 5]),
            'total_price' => 8000,
            'discount_percentage' => 10,
            'image' => 'https://images.unsplash.com/photo-1540555700212-9c21979e842f?w=400&h=300&fit=crop',
            'is_active' => true,
            'sort_order' => 2,
        ]);

        CuratedService::create([
            'title' => 'Girl\'s Day Out',
            'description' => 'Party preparation package with hair, makeup, and styling',
            'service_ids' => json_encode([1, 3, 6]),
            'total_price' => 10000,
            'discount_percentage' => 12,
            'image' => 'https://images.unsplash.com/photo-1487412992651-d8accf73c34e?w=400&h=300&fit=crop',
            'is_active' => true,
            'sort_order' => 3,
        ]);

        CuratedService::create([
            'title' => 'Relaxation & Rejuvenation',
            'description' => 'Complete relaxation package with spa, massage, and facial',
            'service_ids' => json_encode([4, 5, 2]),
            'total_price' => 12000,
            'discount_percentage' => 18,
            'image' => 'https://images.unsplash.com/photo-1516746933520-26ddb588cb58?w=400&h=300&fit=crop',
            'is_active' => true,
            'sort_order' => 4,
        ]);
    }

    private function seedAnnouncements(): void
    {
        Announcement::create([
            'text' => 'Nature Sale! Up to 50% off on all signature treatments.',
            'icon' => 'Flame',
            'action' => 'Book Now',
            'link_target' => 'discounts',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        Announcement::create([
            'text' => 'New Bridal Packages Available. Get a free trial today!',
            'icon' => 'Sparkles',
            'action' => 'Explore',
            'link_target' => 'services',
            'sort_order' => 2,
            'is_active' => true,
        ]);

        Announcement::create([
            'text' => 'Happy Hours: 20% Off on Hair Spa (Mon-Thu, 11AM-4PM).',
            'icon' => 'Clock',
            'action' => 'Reserve Slot',
            'link_target' => 'booking',
            'sort_order' => 3,
            'is_active' => true,
        ]);

        Announcement::create([
            'text' => 'Student Special: Flat 15% off with valid ID card.',
            'icon' => 'GraduationCap',
            'action' => 'View Details',
            'link_target' => 'discounts',
            'sort_order' => 4,
            'is_active' => true,
        ]);

        Announcement::create([
            'text' => 'Gift the glow! Digital Gift Cards now available.',
            'icon' => 'Gift',
            'action' => 'Buy Now',
            'link_target' => 'services',
            'sort_order' => 5,
            'is_active' => true,
        ]);

        Announcement::create([
            'text' => 'Weekend Glow: Free Hydrating Mask with any Facial.',
            'icon' => 'Sun',
            'action' => 'Book Facial',
            'link_target' => 'booking',
            'sort_order' => 6,
            'is_active' => true,
        ]);
    }
}
