<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_memberships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('membership_plan_id')->constrained('membership_plans')->onDelete('cascade');
            $table->date('started_at');
            $table->date('expires_at');
            $table->enum('status', ['active', 'expired', 'cancelled'])->default('active');
            $table->integer('services_used')->default(0); // This month
            $table->integer('free_services_remaining')->default(0);
            $table->decimal('total_savings', 10, 2)->default(0);
            $table->timestamp('cancelled_at')->nullable();
            $table->string('cancellation_reason')->nullable();
            $table->timestamps();
            $table->index('user_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_memberships');
    }
};
