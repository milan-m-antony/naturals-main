<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // e.g., SAVE50, HOLIDAY20
            $table->text('description')->nullable();
            $table->enum('discount_type', ['percentage', 'fixed']); // % or ₹
            $table->decimal('discount_value', 8, 2); // 50 for 50% or ₹50
            $table->decimal('min_purchase', 8, 2)->default(0); // Minimum order value
            $table->decimal('max_discount', 8, 2)->nullable(); // Maximum discount amount (for %)
            $table->integer('usage_limit')->nullable(); // Total uses allowed
            $table->integer('usage_per_customer')->default(1); // Uses per customer
            $table->integer('times_used')->default(0);
            $table->date('valid_from');
            $table->date('valid_until');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->index('code');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};
