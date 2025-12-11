<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Branch;
use App\Models\Service;
use App\Models\Staff;
use App\Models\Appointment;
use App\Models\Inventory;
use App\Models\ServiceReview;
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
            'name' => 'Branch Manager',
            'email' => 'admin@naturals.in',
            'password' => Hash::make('password'),
            'phone' => '+91 98765 43211',
            'role' => 'admin',
        ]);

        $receptionistUser = User::create([
            'name' => 'Receptionist',
            'email' => 'receptionist@naturals.in',
            'password' => Hash::make('password'),
            'phone' => '+91 98765 43212',
            'role' => 'staff',
        ]);

        $staffUser1 = User::create([
            'name' => 'Priya Sharma',
            'email' => 'priya@naturals.in',
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
        $receptionistStaff = Staff::create([
            'user_id' => $receptionistUser->id,
            'branch_id' => 1,
            'specialty' => 'Receptionist',
            'rating' => 4.9,
        ]);

        $staff1 = Staff::create([
            'user_id' => $staffUser1->id,
            'branch_id' => 1,
            'specialty' => 'Service Provider (Staff)',
            'rating' => 4.8,
        ]);

        // Create services
        $services = [];

        foreach ($services as $serviceData) {
            Service::create($serviceData);
        }

        // Create sample appointments
        // (Removed - no services available)

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
