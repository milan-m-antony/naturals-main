<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE services ALTER COLUMN image TYPE TEXT');
        } elseif ($driver === 'mysql') {
            DB::statement('ALTER TABLE services MODIFY image TEXT');
        }
    }

    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'pgsql') {
            DB::statement("ALTER TABLE services ALTER COLUMN image TYPE VARCHAR(255)");
        } elseif ($driver === 'mysql') {
            DB::statement('ALTER TABLE services MODIFY image VARCHAR(255)');
        }
    }
};
