<?php

namespace Database\Seeders;

use App\Models\Announcement;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
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
