<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ComprehensiveServicesSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            // 💇‍♂️ 1. Hair Services
            [
                'name' => "Women's Haircut",
                'category' => 'Hair Services',
                'price' => 575,
                'duration' => 45,
                'description' => 'Professional haircut with styling customized to your face shape and preferences',
                'discount' => 15,
            ],
            [
                'name' => "Men's Haircut",
                'category' => 'Hair Services',
                'price' => 450,
                'duration' => 30,
                'description' => 'Sharp, clean haircut for men with professional grooming and precision',
                'discount' => 10,
            ],
            [
                'name' => 'Hair Color (Standard)',
                'category' => 'Hair Services',
                'price' => 1750,
                'duration' => 120,
                'description' => 'Professional hair coloring with premium products - single tone coloring',
                'discount' => 18,
            ],
            [
                'name' => 'Highlights / Global Color',
                'category' => 'Hair Services',
                'price' => 3500,
                'duration' => 150,
                'description' => 'Highlights and global color treatment for dimensional and custom looks',
                'discount' => 12,
            ],
            [
                'name' => 'Hair Spa',
                'category' => 'Hair Services',
                'price' => 1050,
                'duration' => 60,
                'description' => 'Deep conditioning hair spa with massage - nourishes and rejuvenates dry hair',
                'discount' => 15,
            ],
            [
                'name' => 'Keratin / Straightening',
                'category' => 'Hair Services',
                'price' => 6500,
                'duration' => 180,
                'description' => 'Keratin treatment or straightening for smooth, manageable hair',
                'discount' => 20,
            ],
            [
                'name' => 'Scalp Treatment',
                'category' => 'Hair Services',
                'price' => 1600,
                'duration' => 75,
                'description' => 'Deep scalp treatment and therapy for hair health and growth',
                'discount' => 12,
            ],

            // 💆‍♀️ 2. Skin & Facial Services
            [
                'name' => 'Basic Facial',
                'category' => 'Skin Care',
                'price' => 1100,
                'duration' => 60,
                'description' => 'Professional basic facial with cleansing, exfoliation, and moisturizing',
                'discount' => 15,
            ],
            [
                'name' => 'Deep Clean / Black Facial',
                'category' => 'Skin Care',
                'price' => 2100,
                'duration' => 75,
                'description' => 'Deep cleansing blackhead removal and pore purification treatment',
                'discount' => 18,
            ],
            [
                'name' => 'Luxury / Glow Facial',
                'category' => 'Skin Care',
                'price' => 3000,
                'duration' => 90,
                'description' => 'Premium brightening and anti-aging facial with premium products',
                'discount' => 15,
            ],
            [
                'name' => 'Anti-Aging / Special Facials',
                'category' => 'Skin Care',
                'price' => 3500,
                'duration' => 90,
                'description' => 'Advanced anti-aging treatment with specialized serums and techniques',
                'discount' => 20,
            ],

            // 💅 3. Body & Grooming
            [
                'name' => 'Threading (Eyebrow / Face)',
                'category' => 'Threading',
                'price' => 95,
                'duration' => 20,
                'description' => 'Traditional threading for eyebrow shaping and facial hair removal',
                'discount' => 10,
            ],
            [
                'name' => 'Waxing (Half / Full)',
                'category' => 'Waxing',
                'price' => 625,
                'duration' => 30,
                'description' => 'Hair removal waxing for various body parts - half or full body',
                'discount' => 12,
            ],
            [
                'name' => 'Manicure',
                'category' => 'Hands & Feet Care',
                'price' => 650,
                'duration' => 45,
                'description' => 'Professional manicure with nail polish and hand care',
                'discount' => 15,
            ],
            [
                'name' => 'Pedicure',
                'category' => 'Hands & Feet Care',
                'price' => 800,
                'duration' => 60,
                'description' => 'Professional pedicure with foot care, massage, and nail polish',
                'discount' => 12,
            ],
            [
                'name' => 'Head / Shoulder Massage',
                'category' => 'Body Care',
                'price' => 600,
                'duration' => 45,
                'description' => 'Relaxing head and shoulder massage therapy',
                'discount' => 15,
            ],

            // 💄 4. Bridal & Makeup
            [
                'name' => 'Bridal Makeup',
                'category' => 'Bridal & Grooming',
                'price' => 7000,
                'duration' => 120,
                'description' => 'Complete bridal makeup with hair and styling for your special day',
                'discount' => 0,
            ],
            [
                'name' => 'Party / Event Makeup',
                'category' => 'Bridal & Grooming',
                'price' => 2750,
                'duration' => 90,
                'description' => 'Glamorous party and event makeup for any occasion',
                'discount' => 15,
            ],
            [
                'name' => 'Groom Grooming',
                'category' => 'Bridal & Grooming',
                'price' => 3500,
                'duration' => 75,
                'description' => 'Complete grooming package for grooms including haircut, styling, and makeup',
                'discount' => 10,
            ],
        ];

        // Insert services into database
        foreach ($services as $service) {
            Service::updateOrCreate(
                ['name' => $service['name'], 'category' => $service['category']],
                $service
            );
        }

        $this->command->info('Comprehensive services seeded successfully!');
    }
}
