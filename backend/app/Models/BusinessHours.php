<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class BusinessHours extends Model
{
    protected $fillable = [
        'branch_id',
        'day_of_week',
        'opening_time',
        'closing_time',
        'is_closed',
        'lunch_start',
        'lunch_end',
    ];

    protected $casts = [
        'is_closed' => 'boolean',
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    // Check if salon is open on a given date
    public static function isOpenOnDate(int $branchId, Carbon|string $date): bool
    {
        $date = $date instanceof Carbon ? $date : Carbon::parse($date);
        $dayOfWeek = $date->format('l'); // Full day name (Monday, Tuesday, etc.)

        $hours = self::where('branch_id', $branchId)
            ->where('day_of_week', $dayOfWeek)
            ->first();

        return $hours && !$hours->is_closed;
    }

    // Get opening time for a day
    public static function getOpeningTime(int $branchId, Carbon|string $date): ?string
    {
        $date = $date instanceof Carbon ? $date : Carbon::parse($date);
        $dayOfWeek = $date->format('l');

        $hours = self::where('branch_id', $branchId)
            ->where('day_of_week', $dayOfWeek)
            ->first();

        return $hours ? $hours->opening_time : null;
    }

    // Get closing time for a day
    public static function getClosingTime(int $branchId, Carbon|string $date): ?string
    {
        $date = $date instanceof Carbon ? $date : Carbon::parse($date);
        $dayOfWeek = $date->format('l');

        $hours = self::where('branch_id', $branchId)
            ->where('day_of_week', $dayOfWeek)
            ->first();

        return $hours ? $hours->closing_time : null;
    }
}
