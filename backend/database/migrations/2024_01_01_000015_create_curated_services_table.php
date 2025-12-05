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
        Schema::create('curated_services', function (Blueprint $table) {
            $table->id();
            $table->string('section_title')->default('Curated Services');
            $table->text('section_description')->nullable();
            $table->json('hair_studio_images')->nullable(); // Array of image objects with pins
            $table->json('skin_features')->nullable(); // Array of feature text
            $table->string('skin_image')->nullable();
            $table->json('bridal_slides')->nullable(); // Array of slide objects
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('curated_services');
    }
};
