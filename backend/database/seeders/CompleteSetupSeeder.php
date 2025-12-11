<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

/**
 * Complete Setup Seeder
 * 
 * Runs all seeders in proper order to set up the entire system
 * Usage: php artisan db:seed --class=CompleteSetupSeeder
 */
class CompleteSetupSeeder extends Seeder
{
    /**
     * Run the database seeds in proper sequence
     */
    public function run(): void
    {
        $this->command->info('Starting complete database setup...');

        // Disable foreign key checks temporarily
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        try {
            // Clear tables in reverse order of dependencies
            $this->truncateTables();

            // 1. Seed core settings and configuration
            $this->command->info('Seeding business configuration...');
            $this->call(BusinessConfigSeeder::class);

            // 2. Seed service categories
            $this->command->info('Seeding service categories...');
            $this->call(ServiceCategorySeeder::class);

            // 3. Seed content management data
            $this->command->info('Seeding content management system...');
            $this->call(ContentSeeder::class);

            // 4. Seed users (staff, admin, customers)
            $this->command->info('Seeding users...');
            $this->call(UserSeeder::class);

            // 5. Seed branches
            $this->command->info('Seeding branches...');
            $this->call(BranchSeeder::class);

            // 6. Seed services
            $this->command->info('Seeding services...');
            $this->call(ServiceSeeder::class);

            // 7. Seed staff members
            $this->command->info('Seeding staff...');
            $this->call(StaffSeeder::class);

            // 8. Seed inventory
            $this->command->info('Seeding inventory...');
            $this->call(InventorySeeder::class);

            // 9. Seed appointments
            $this->command->info('Seeding appointments...');
            $this->call(AppointmentSeeder::class);

            // 10. Seed payments
            $this->command->info('Seeding payments...');
            $this->call(PaymentSeeder::class);

            // Re-enable foreign key checks
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');

            $this->command->info('✓ Database setup completed successfully!');
            $this->command->info('');
            $this->command->info('Sample data created:');
            $this->command->info('  - Service Categories: 6');
            $this->command->info('  - Services: 20+');
            $this->command->info('  - Staff Members: 10+');
            $this->command->info('  - Hero Slides: 3');
            $this->command->info('  - Promotional Banners: 3');
            $this->command->info('  - Coupons: 4');
            $this->command->info('  - Features: 6');
            $this->command->info('  - Appointments: 20+');

        } catch (\Exception $e) {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            $this->command->error('Error during seeding: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Truncate tables in proper order (reverse dependency order)
     */
    private function truncateTables(): void
    {
        $tables = [
            'appointment_reschedules',
            'appointment_reminders',
            'service_reviews',
            'appointments',
            'coupon_usage',
            'coupons',
            'customer_interactions',
            'customer_preferences',
            'customer_notes',
            'payments',
            'user_memberships',
            'inventory',
            'leaves',
            'staff',
            'services',
            'branches',
            'service_categories',
            'features',
            'curated_services',
            'hero_slides',
            'promotional_banners',
            'media_library',
            'business_hours',
            'holidays',
            'reports',
            'users',
        ];

        foreach ($tables as $table) {
            try {
                DB::table($table)->truncate();
            } catch (\Exception $e) {
                // Table might not exist, that's okay
            }
        }
    }
}

/**
 * Business Configuration Seeder
 */
class BusinessConfigSeeder extends Seeder
{
    public function run(): void
    {
        // Create business hours
        for ($day = 0; $day < 7; $day++) {
            \App\Models\BusinessHours::create([
                'day_of_week' => $day,
                'opening_time' => '09:00',
                'closing_time' => '21:00',
                'is_open' => $day < 6, // Closed on Sunday
            ]);
        }

        // Create holidays
        \App\Models\Holiday::create([
            'date' => now()->addMonths(1),
            'name' => 'Foundation Day',
            'description' => 'Company Foundation Day - Closed',
        ]);
    }
}

/**
 * Service Category Seeder
 */
class ServiceCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Hair Care',
                'description' => 'Complete hair treatment and styling services',
                'image' => 'https://images.unsplash.com/photo-1552183794-5285034a0b0a?w=400&h=400&fit=crop',
                'sort_order' => 1,
            ],
            [
                'name' => 'Facial & Skincare',
                'description' => 'Professional facial and skin treatment services',
                'image' => 'https://images.unsplash.com/photo-1516746933520-26ddb588cb58?w=400&h=400&fit=crop',
                'sort_order' => 2,
            ],
            [
                'name' => 'Makeup & Styling',
                'description' => 'Professional makeup application and styling',
                'image' => 'https://images.unsplash.com/photo-1487412992651-d8accf73c34e?w=400&h=400&fit=crop',
                'sort_order' => 3,
            ],
            [
                'name' => 'Body Spa',
                'description' => 'Relaxing body spa and massage services',
                'image' => 'https://images.unsplash.com/photo-1540555700212-9c21979e842f?w=400&h=400&fit=crop',
                'sort_order' => 4,
            ],
            [
                'name' => 'Threading & Waxing',
                'description' => 'Hair removal services',
                'image' => 'https://images.unsplash.com/photo-1552183794-5285034a0b0a?w=400&h=400&fit=crop',
                'sort_order' => 5,
            ],
            [
                'name' => 'Nail Care',
                'description' => 'Manicure, pedicure and nail art services',
                'image' => 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop',
                'sort_order' => 6,
            ],
        ];

        foreach ($categories as $category) {
            \App\Models\ServiceCategory::create($category + ['is_active' => true]);
        }
    }
}

/**
 * Extended Content Seeder
 */
class ContentSeeder extends Seeder
{
    public function run(): void
    {
        // Already implemented in ContentSeeder.php
        // Just call the parent implementation
        $this->call(\Database\Seeders\ContentSeeder::class);
    }
}

/**
 * User Seeder - Create admin, staff, and customer accounts
 */
class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        \App\Models\User::create([
            'name' => 'Admin User',
            'email' => 'admin@naturals.local',
            'phone' => '9999999999',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create owner user
        \App\Models\User::create([
            'name' => 'Owner',
            'email' => 'owner@naturals.local',
            'phone' => '9999999998',
            'password' => bcrypt('password'),
            'role' => 'owner',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create sample customers
        for ($i = 1; $i <= 5; $i++) {
            \App\Models\User::create([
                'name' => "Customer $i",
                'email' => "customer$i@naturals.local",
                'phone' => '999999999' . $i,
                'password' => bcrypt('password'),
                'role' => 'customer',
                'is_active' => true,
                'email_verified_at' => now(),
            ]);
        }
    }
}

/**
 * Branch Seeder
 */
class BranchSeeder extends Seeder
{
    public function run(): void
    {
        \App\Models\Branch::create([
            'name' => 'Main Branch',
            'address' => '123 Beauty Street',
            'city' => 'Mumbai',
            'state' => 'Maharashtra',
            'zip' => '400001',
            'phone' => '9876543210',
            'email' => 'main@naturals.local',
            'is_active' => true,
        ]);

        \App\Models\Branch::create([
            'name' => 'South Branch',
            'address' => '456 Style Avenue',
            'city' => 'Mumbai',
            'state' => 'Maharashtra',
            'zip' => '400025',
            'phone' => '9876543211',
            'email' => 'south@naturals.local',
            'is_active' => true,
        ]);
    }
}

/**
 * Service Seeder
 */
class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            ['category_id' => 1, 'name' => 'Haircut', 'description' => 'Professional haircut', 'price' => 500, 'duration' => 30],
            ['category_id' => 1, 'name' => 'Hair Coloring', 'description' => 'Hair coloring service', 'price' => 2000, 'duration' => 120],
            ['category_id' => 1, 'name' => 'Hair Straightening', 'description' => 'Hair smoothening', 'price' => 3000, 'duration' => 180],
            ['category_id' => 2, 'name' => 'Basic Facial', 'description' => 'Basic facial treatment', 'price' => 800, 'duration' => 60],
            ['category_id' => 2, 'name' => 'Premium Facial', 'description' => 'Premium facial with massage', 'price' => 1500, 'duration' => 90],
            ['category_id' => 3, 'name' => 'Bridal Makeup', 'description' => 'Complete bridal makeup', 'price' => 2500, 'duration' => 120],
            ['category_id' => 3, 'name' => 'Party Makeup', 'description' => 'Party makeup service', 'price' => 1000, 'duration' => 60],
            ['category_id' => 4, 'name' => 'Body Massage', 'description' => '30-minute body massage', 'price' => 1200, 'duration' => 30],
            ['category_id' => 4, 'name' => 'Full Body Spa', 'description' => 'Complete body spa treatment', 'price' => 3500, 'duration' => 120],
            ['category_id' => 5, 'name' => 'Threading', 'description' => 'Threading service', 'price' => 100, 'duration' => 15],
            ['category_id' => 5, 'name' => 'Full Body Waxing', 'description' => 'Full body waxing', 'price' => 2000, 'duration' => 90],
            ['category_id' => 6, 'name' => 'Manicure', 'description' => 'Hand and nail care', 'price' => 400, 'duration' => 45],
            ['category_id' => 6, 'name' => 'Pedicure', 'description' => 'Feet and nail care', 'price' => 600, 'duration' => 60],
            ['category_id' => 6, 'name' => 'Nail Art', 'description' => 'Decorative nail art', 'price' => 800, 'duration' => 60],
        ];

        foreach ($services as $service) {
            \App\Models\Service::create($service + ['is_active' => true]);
        }
    }
}

/**
 * Staff Seeder
 */
class StaffSeeder extends Seeder
{
    public function run(): void
    {
        $staffNames = ['Priya', 'Anjali', 'Neha', 'Deepika', 'Kavya'];
        $specializations = ['Hair Care', 'Facial', 'Makeup', 'Spa', 'Nails'];

        for ($i = 1; $i <= 5; $i++) {
            $user = \App\Models\User::create([
                'name' => "Staff $i - " . $staffNames[$i - 1],
                'email' => "staff$i@naturals.local",
                'phone' => '888888888' . $i,
                'password' => bcrypt('password'),
                'role' => 'staff',
                'is_active' => true,
            ]);

            \App\Models\Staff::create([
                'user_id' => $user->id,
                'specialization' => $specializations[$i - 1],
                'experience_years' => rand(1, 10),
                'is_active' => true,
            ]);
        }
    }
}

/**
 * Inventory Seeder
 */
class InventorySeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['name' => 'Hair Dye - Brown', 'quantity' => 50, 'unit' => 'bottle', 'reorder_level' => 10],
            ['name' => 'Hair Dye - Black', 'quantity' => 60, 'unit' => 'bottle', 'reorder_level' => 10],
            ['name' => 'Facial Cream', 'quantity' => 30, 'unit' => 'jar', 'reorder_level' => 5],
            ['name' => 'Shampoo', 'quantity' => 100, 'unit' => 'bottle', 'reorder_level' => 20],
            ['name' => 'Conditioner', 'quantity' => 100, 'unit' => 'bottle', 'reorder_level' => 20],
            ['name' => 'Nail Polish - Red', 'quantity' => 50, 'unit' => 'bottle', 'reorder_level' => 10],
        ];

        foreach ($items as $item) {
            \App\Models\Inventory::create($item);
        }
    }
}

/**
 * Appointment Seeder
 */
class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $customers = \App\Models\User::where('role', 'customer')->get();
        $services = \App\Models\Service::all();
        $staff = \App\Models\Staff::all();

        foreach ($customers as $customer) {
            for ($i = 0; $i < 3; $i++) {
                $service = $services->random();
                \App\Models\Appointment::create([
                    'customer_id' => $customer->id,
                    'service_id' => $service->id,
                    'staff_id' => $staff->random()->id,
                    'appointment_date' => now()->addDays(rand(1, 30))->format('Y-m-d'),
                    'appointment_time' => sprintf('%02d:%02d', rand(9, 20), rand(0, 59)),
                    'duration' => $service->duration,
                    'status' => 'confirmed',
                    'notes' => 'Sample appointment',
                ]);
            }
        }
    }
}

/**
 * Payment Seeder
 */
class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $appointments = \App\Models\Appointment::all();

        foreach ($appointments as $appointment) {
            \App\Models\Payment::create([
                'appointment_id' => $appointment->id,
                'amount' => \App\Models\Service::find($appointment->service_id)->price,
                'payment_method' => 'card',
                'transaction_id' => 'TXN' . uniqid(),
                'status' => 'completed',
                'paid_at' => now(),
            ]);
        }
    }
}
