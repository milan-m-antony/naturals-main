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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('report_type')->comment('revenue, staff_performance, service_analytics, customer_insights');
            $table->text('description')->nullable();
            $table->json('filters')->nullable()->comment('Date range, staff, service, branch filters');
            $table->foreignId('generated_by')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
            $table->string('file_path')->nullable()->comment('Path to generated PDF/Excel file');
            $table->string('exported_format')->nullable()->comment('pdf, excel, csv');
            $table->integer('row_count')->nullable()->comment('Number of rows in report');
            $table->timestamps();

            $table->index('report_type');
            $table->index('status');
            $table->index('generated_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
