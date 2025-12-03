<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Branch;
use App\Models\Service;
use App\Models\Staff;
use App\Models\Appointment;
use App\Models\Inventory;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create branches
        $branches = [
            [
                'name' => 'Naturals Indiranagar',
                'address' => '100 Feet Road, HAL 2nd Stage',
                'city' => 'Bangalore',
                'state' => 'Karnataka',
                'phone' => '+91 80 4112 3456',
                'email' => 'indiranagar@naturals.in',
            ],
            [
                'name' => 'Naturals Koramangala',
                'address' => '5th Block, 80 Feet Road',
                'city' => 'Bangalore',
                'state' => 'Karnataka',
                'phone' => '+91 80 4112 3457',
                'email' => 'koramangala@naturals.in',
            ],
        ];

        foreach ($branches as $branchData) {
            Branch::create($branchData);
        }

        // Create users
        $owner = User::create([
            'name' => 'Admin Owner',
            'email' => 'owner@naturals.in',
            'password' => Hash::make('password'),
            'phone' => '+91 98765 43210',
            'role' => 'owner',
        ]);

        $admin = User::create([
            'name' => 'Admin Manager',
            'email' => 'admin@naturals.in',
            'password' => Hash::make('password'),
            'phone' => '+91 98765 43211',
            'role' => 'admin',
        ]);

        $staffUser1 = User::create([
            'name' => 'Priya Sharma',
            'email' => 'priya@naturals.in',
            'password' => Hash::make('password'),
            'phone' => '+91 98765 43212',
            'role' => 'staff',
        ]);

        $staffUser2 = User::create([
            'name' => 'Anjali Reddy',
            'email' => 'anjali@naturals.in',
            'password' => Hash::make('password'),
            'phone' => '+91 98765 43213',
            'role' => 'staff',
        ]);

        $customer = User::create([
            'name' => 'John Doe',
            'email' => 'customer@example.com',
            'password' => Hash::make('password'),
            'phone' => '+91 98765 43214',
            'role' => 'customer',
            'membership_tier' => 'Gold',
            'total_visits' => 15,
            'total_spent' => 12500.00,
        ]);

        // Create staff records
        $staff1 = Staff::create([
            'user_id' => $staffUser1->id,
            'branch_id' => 1,
            'specialty' => 'Hair Styling',
            'rating' => 4.8,
        ]);

        $staff2 = Staff::create([
            'user_id' => $staffUser2->id,
            'branch_id' => 1,
            'specialty' => 'Facial & Skin Care',
            'rating' => 4.9,
        ]);

        // Create services
        $services = [
            [
                'name' => 'Hair Cut & Style',
                'category' => 'Hair',
                'sub_category' => 'Cut & Style',
                'price' => 499,
                'duration' => 45,
                'description' => 'Professional haircut with styling',
                'slots' => 10,
                'discount' => 0,
                'rating' => 4.5,
                'reviews_count' => 234,
            ],
            [
                'name' => 'Hair Spa Treatment',
                'category' => 'Hair',
                'sub_category' => 'Treatment',
                'price' => 1299,
                'duration' => 90,
                'description' => 'Deep conditioning hair spa with massage',
                'slots' => 8,
                'discount' => 20,
                'rating' => 4.7,
                'reviews_count' => 189,
            ],
            [
                'name' => 'Facial - Gold',
                'category' => 'Skin',
                'sub_category' => 'Facial',
                'price' => 1999,
                'duration' => 60,
                'description' => 'Luxurious gold facial for glowing skin',
                'slots' => 6,
                'discount' => 15,
                'rating' => 4.8,
                'reviews_count' => 156,
            ],
            [
                'name' => 'Manicure & Pedicure',
                'category' => 'Hands & Feet',
                'sub_category' => 'Nail Care',
                'price' => 899,
                'duration' => 75,
                'description' => 'Complete nail care with polish',
                'slots' => 12,
                'discount' => 0,
                'rating' => 4.6,
                'reviews_count' => 298,
            ],
            [
                'name' => 'Bridal Makeup',
                'category' => 'Makeup',
                'sub_category' => 'Bridal',
                'price' => 8999,
                'duration' => 180,
                'description' => 'Complete bridal makeup package',
                'slots' => 2,
                'discount' => 10,
                'is_members_only' => true,
                'rating' => 4.9,
                'reviews_count' => 87,
            ],
        ];

        foreach ($services as $serviceData) {
            Service::create($serviceData);
        }

        // Create sample appointments
        $appointment = Appointment::create([
            'user_id' => $customer->id,
            'branch_id' => 1,
            'staff_id' => $staff1->id,
            'date' => now()->addDays(2),
            'time' => '14:00',
            'customer_name' => 'John Doe',
            'customer_phone' => '+91 98765 43214',
            'customer_email' => 'customer@example.com',
            'status' => 'Scheduled',
            'payment_status' => 'Pending',
            'payment_method' => 'Pay at Venue',
            'total_price' => 1299,
        ]);

        // Attach services to appointment
        $appointment->services()->attach(2, ['price' => 1299]);

        // Create inventory items
        $inventoryItems = [
            ['name' => 'Shampoo - Professional', 'category' => 'Hair Care', 'stock' => 45, 'unit' => 'Bottles', 'threshold' => 15],
            ['name' => 'Conditioner', 'category' => 'Hair Care', 'stock' => 38, 'unit' => 'Bottles', 'threshold' => 15],
            ['name' => 'Hair Color - Black', 'category' => 'Hair Color', 'stock' => 8, 'unit' => 'Packs', 'threshold' => 10],
            ['name' => 'Facial Cream', 'category' => 'Skin Care', 'stock' => 22, 'unit' => 'Jars', 'threshold' => 10],
            ['name' => 'Nail Polish - Red', 'category' => 'Nail Care', 'stock' => 15, 'unit' => 'Bottles', 'threshold' => 8],
            ['name' => 'Towels - White', 'category' => 'Supplies', 'stock' => 3, 'unit' => 'Pieces', 'threshold' => 20],
            ['name' => 'Disposable Gloves', 'category' => 'Supplies', 'stock' => 125, 'unit' => 'Boxes', 'threshold' => 30],
        ];

        foreach ($inventoryItems as $itemData) {
            Inventory::create($itemData);
        }
    }
}
