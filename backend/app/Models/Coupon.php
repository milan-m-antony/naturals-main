<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Coupon extends Model
{
    protected $fillable = [
        'code',
        'description',
        'discount_type',
        'discount_value',
        'min_purchase',
        'max_discount',
        'usage_limit',
        'usage_per_customer',
        'times_used',
        'valid_from',
        'valid_until',
        'is_active',
    ];

    protected $casts = [
        'valid_from' => 'date',
        'valid_until' => 'date',
        'is_active' => 'boolean',
    ];

    public function usages(): HasMany
    {
        return $this->hasMany(CouponUsage::class);
    }

    // Check if coupon is valid
    public function isValid(): bool
    {
        $today = Carbon::today();
        
        return $this->is_active 
            && $this->valid_from <= $today 
            && $this->valid_until >= $today
            && ($this->usage_limit === null || $this->times_used < $this->usage_limit);
    }

    // Calculate discount for given amount
    public function calculateDiscount(float $amount): float
    {
        if ($amount < $this->min_purchase) {
            return 0;
        }

        if ($this->discount_type === 'percentage') {
            $discount = ($amount * $this->discount_value) / 100;
            
            if ($this->max_discount) {
                $discount = min($discount, $this->max_discount);
            }
            
            return $discount;
        }

        return min($this->discount_value, $amount);
    }

    // Check if user can use this coupon
    public function canUseUser($userId): bool
    {
        $userUsageCount = $this->usages()
            ->where('user_id', $userId)
            ->count();

        return $userUsageCount < $this->usage_per_customer;
    }
}
