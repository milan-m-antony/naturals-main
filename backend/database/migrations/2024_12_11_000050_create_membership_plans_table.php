<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('membership_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Silver, Gold, Platinum
            $table->text('description')->nullable();
            $table->decimal('price', 8, 2);
            $table->integer('duration_days'); // 30, 90, 365
            $table->decimal('discount_percentage', 5, 2)->default(0); // 10% off, etc
            $table->integer('free_services')->default(0); // Number of free services per month
            $table->boolean('priority_booking')->default(false);
            $table->boolean('free_extensions')->default(false);
            $table->integer('max_concurrent_bookings')->nullable();
            $table->text('benefits')->nullable(); // JSON benefits list
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('membership_plans');
    }
};
