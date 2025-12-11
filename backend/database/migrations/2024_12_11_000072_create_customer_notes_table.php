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
        Schema::create('customer_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->text('note');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->boolean('is_internal')->default(false)->comment('Internal notes not visible to customer');
            $table->integer('importance')->default(1)->comment('1-5 importance level');
            $table->timestamps();

            $table->index('user_id');
            $table->index('created_by');
            $table->index('importance');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_notes');
    }
};
