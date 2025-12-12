<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class HeroSlideSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        DB::table('hero_slides')->insert([
            [
                'image' => 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=1200',
                'title' => 'Natural',
                'subtitle' => 'Elegance.',
                'description' => 'Premium hair care that enhances your natural beauty. Expert stylists, organic products.',
                'accent_color' => '#FCD34D',
                'badge' => 'Hair Spa',
                'price' => 'Starting @ ₹1500',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1200',
                'title' => 'Radiant',
                'subtitle' => 'Glow.',
                'description' => 'Rejuvenating skin treatments designed to restore your inner shine.',
                'accent_color' => '#F9A8D4',
                'badge' => 'Facials',
                'price' => 'Starting @ ₹2500',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200',
                'title' => 'Holistic',
                'subtitle' => 'Peace.',
                'description' => 'Escape the chaos with our therapeutic spa rituals. Blend of traditional healing.',
                'accent_color' => '#34D399',
                'badge' => 'Body Spa',
                'price' => 'Starting @ ₹3000',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1632345031635-7b800099cdeb?auto=format&fit=crop&q=80&w=1200',
                'title' => 'Pristine',
                'subtitle' => 'Details.',
                'description' => 'Discover perfection with our meticulous manicure and pedicure services.',
                'accent_color' => '#C4B5FD',
                'badge' => 'Nail Art',
                'price' => 'Starting @ ₹1200',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=1200',
                'title' => 'Pure',
                'subtitle' => 'Essence.',
                'description' => 'Shop our curated collection of premium, organic beauty products.',
                'accent_color' => '#14B8A6',
                'badge' => 'Retail',
                'price' => 'Shop Now',
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }
}
