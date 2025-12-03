<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category');
            $table->string('sub_category')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('duration'); // in minutes
            $table->text('description');
            $table->string('image')->nullable();
            $table->integer('slots')->default(10);
            $table->integer('discount')->default(0);
            $table->json('includes')->nullable();
            $table->boolean('is_members_only')->default(false);
            $table->date('offer_valid_until')->nullable();
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('reviews_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
