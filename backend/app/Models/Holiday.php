<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Holiday extends Model
{
    protected $fillable = [
        'branch_id',
        'name',
        'date',
        'description',
        'is_optional',
    ];

    protected $casts = [
        'date' => 'date',
        'is_optional' => 'boolean',
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    // Check if a date is a holiday
    public static function isHoliday(int $branchId, Carbon|string $date): bool
    {
        $date = $date instanceof Carbon ? $date->toDateString() : $date;

        return self::where('branch_id', $branchId)
            ->where('date', $date)
            ->where('is_optional', false)
            ->exists();
    }

    // Get holidays for a month
    public static function getMonthHolidays(int $branchId, int $year, int $month)
    {
        $startDate = Carbon::createFromDate($year, $month, 1);
        $endDate = $startDate->copy()->endOfMonth();

        return self::where('branch_id', $branchId)
            ->whereBetween('date', [$startDate, $endDate])
            ->get();
    }
}
