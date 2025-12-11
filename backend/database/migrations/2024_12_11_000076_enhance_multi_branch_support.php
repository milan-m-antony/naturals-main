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
        // Enhance branches table
        Schema::table('branches', function (Blueprint $table) {
            if (!Schema::hasColumn('branches', 'postal_code')) {
                $table->string('postal_code')->nullable();
            }
            if (!Schema::hasColumn('branches', 'latitude')) {
                $table->decimal('latitude', 10, 8)->nullable();
            }
            if (!Schema::hasColumn('branches', 'longitude')) {
                $table->decimal('longitude', 11, 8)->nullable();
            }
            if (!Schema::hasColumn('branches', 'manager_id')) {
                $table->foreignId('manager_id')->nullable()->constrained('users')->onDelete('set null');
            }
            if (!Schema::hasColumn('branches', 'opening_time')) {
                $table->time('opening_time')->nullable();
            }
            if (!Schema::hasColumn('branches', 'closing_time')) {
                $table->time('closing_time')->nullable();
            }
            if (!Schema::hasColumn('branches', 'description')) {
                $table->text('description')->nullable();
            }
        });

        // Create branch_services table for service availability per branch
        Schema::create('branch_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
            $table->foreignId('service_id')->constrained('services')->onDelete('cascade');
            $table->boolean('is_available')->default(true);
            $table->timestamps();

            $table->unique(['branch_id', 'service_id']);
            $table->index('branch_id');
            $table->index('service_id');
        });

        // Create staff_branches table (staff can work at multiple branches)
        Schema::create('staff_branches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('staff_id')->constrained('staff')->onDelete('cascade');
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
            $table->boolean('is_primary')->default(false)->comment('Primary branch for staff');
            $table->timestamps();

            $table->unique(['staff_id', 'branch_id']);
            $table->index('staff_id');
            $table->index('branch_id');
        });

        // Add branch_id to appointments if not exists
        Schema::table('appointments', function (Blueprint $table) {
            if (!Schema::hasColumn('appointments', 'branch_id')) {
                $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('cascade');
            }
        });

        // Add branch_id to inventory if not exists
        Schema::table('inventory', function (Blueprint $table) {
            if (!Schema::hasColumn('inventory', 'branch_id')) {
                $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staff_branches');
        Schema::dropIfExists('branch_services');

        Schema::table('inventory', function (Blueprint $table) {
            if (Schema::hasColumn('inventory', 'branch_id')) {
                $table->dropForeign(['branch_id']);
                $table->dropColumn('branch_id');
            }
        });

        Schema::table('appointments', function (Blueprint $table) {
            if (Schema::hasColumn('appointments', 'branch_id')) {
                $table->dropForeign(['branch_id']);
                $table->dropColumn('branch_id');
            }
        });

        Schema::table('branches', function (Blueprint $table) {
            $columns = ['postal_code', 'latitude', 'longitude', 'manager_id', 'opening_time', 'closing_time', 'description'];
            $existingColumns = array_filter($columns, fn($col) => Schema::hasColumn('branches', $col));
            
            if (!empty($existingColumns)) {
                foreach ($existingColumns as $column) {
                    if ($column === 'manager_id') {
                        $table->dropForeign(['manager_id']);
                    }
                    $table->dropColumn($column);
                }
            }
        });
    }
};
