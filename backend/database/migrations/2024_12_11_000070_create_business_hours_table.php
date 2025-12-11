<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('business_hours', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
            $table->string('day_of_week'); // Monday, Tuesday, etc.
            $table->time('opening_time');
            $table->time('closing_time');
            $table->boolean('is_closed')->default(false); // For closed days
            $table->time('lunch_start')->nullable();
            $table->time('lunch_end')->nullable();
            $table->timestamps();
            $table->unique(['branch_id', 'day_of_week']);
            $table->index('branch_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('business_hours');
    }
};
