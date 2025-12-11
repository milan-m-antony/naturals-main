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
        Schema::create('customer_interactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('interaction_type')->comment('call, inquiry, complaint, feedback, cancellation, reschedule');
            $table->text('description');
            $table->foreignId('appointment_id')->nullable()->constrained('appointments')->onDelete('set null');
            $table->foreignId('service_id')->nullable()->constrained('services')->onDelete('set null');
            $table->integer('rating')->nullable()->comment('1-5 star rating');
            $table->text('feedback')->nullable();
            $table->foreignId('staff_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('channel')->comment('phone, email, sms, whatsapp, in-person, web');
            $table->timestamp('interaction_date')->useCurrent();
            $table->timestamps();

            $table->index('user_id');
            $table->index('interaction_type');
            $table->index('channel');
            $table->index('interaction_date');
            $table->index('rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_interactions');
    }
};
