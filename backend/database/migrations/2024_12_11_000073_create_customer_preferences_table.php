<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('customer_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->foreignId('preferred_staff_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('preferred_time_slot')->nullable()->comment('morning, afternoon, evening');
            $table->string('communication_preference')->default('email')->comment('email, sms, whatsapp, both, all');
            $table->boolean('appointment_reminders')->default(true);
            $table->integer('reminder_advance_days')->default(1);
            $table->json('special_requirements')->nullable()->comment('Array of special requirements');
            $table->json('allergies')->nullable()->comment('Array of known allergies');
            $table->string('skin_type')->nullable()->comment('oily, dry, combination, sensitive');
            $table->json('preferred_services')->nullable()->comment('Array of preferred service IDs');
            $table->boolean('do_not_contact')->default(false)->comment('Customer opted out of all communication');
            $table->foreignId('preferred_branch_id')->nullable()->constrained('branches')->onDelete('set null');
            $table->timestamps();

            $table->index('user_id');
            $table->index('preferred_staff_id');
            $table->index('do_not_contact');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_preferences');
    }
};
