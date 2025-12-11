<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class MembershipPlan extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price',
        'duration_days',
        'discount_percentage',
        'free_services',
        'priority_booking',
        'free_extensions',
        'max_concurrent_bookings',
        'benefits',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'benefits' => 'json',
        'is_active' => 'boolean',
        'priority_booking' => 'boolean',
        'free_extensions' => 'boolean',
    ];

    public function memberships(): HasMany
    {
        return $this->hasMany(UserMembership::class);
    }

    public function getFormattedPriceAttribute(): string
    {
        return '₹' . number_format($this->price, 2);
    }

    public function getDurationLabelAttribute(): string
    {
        $days = $this->duration_days;
        if ($days === 30) return '1 Month';
        if ($days === 90) return '3 Months';
        if ($days === 365) return '1 Year';
        return "{$days} Days";
    }
}
