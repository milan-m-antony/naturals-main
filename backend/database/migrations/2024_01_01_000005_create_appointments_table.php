<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('branch_id')->constrained()->onDelete('cascade');
            $table->foreignId('staff_id')->constrained('staff')->onDelete('cascade');
            $table->date('date');
            $table->time('time');
            $table->string('customer_name');
            $table->string('customer_phone')->nullable();
            $table->string('customer_email')->nullable();
            $table->enum('status', ['Scheduled', 'Completed', 'Cancelled', 'Pending', 'In Progress'])->default('Scheduled');
            $table->enum('payment_status', ['Paid', 'Pending', 'Refunded'])->default('Pending');
            $table->enum('payment_method', ['Card', 'UPI', 'Cash', 'Pay at Venue'])->default('Pay at Venue');
            $table->decimal('total_price', 10, 2);
            $table->text('notes')->nullable();
            $table->integer('rating')->nullable();
            $table->text('review')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
