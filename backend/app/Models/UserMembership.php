<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class UserMembership extends Model
{
    protected $fillable = [
        'user_id',
        'membership_plan_id',
        'started_at',
        'expires_at',
        'status',
        'services_used',
        'free_services_remaining',
        'total_savings',
        'cancelled_at',
        'cancellation_reason',
    ];

    protected $casts = [
        'started_at' => 'date',
        'expires_at' => 'date',
        'cancelled_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(MembershipPlan::class, 'membership_plan_id');
    }

    // Check if membership is active
    public function isActive(): bool
    {
        return $this->status === 'active' && $this->expires_at->isFuture();
    }

    // Get days remaining
    public function getDaysRemainingAttribute(): int
    {
        if (!$this->isActive()) {
            return 0;
        }
        return $this->expires_at->diffInDays(Carbon::today());
    }

    // Get discount amount for appointment
    public function getDiscount(float $appointmentPrice): float
    {
        if (!$this->isActive()) {
            return 0;
        }

        $discountAmount = ($appointmentPrice * $this->plan->discount_percentage) / 100;
        
        // Apply free services if available
        if ($this->free_services_remaining > 0) {
            return $appointmentPrice; // Free service
        }

        return $discountAmount;
    }

    // Use a free service
    public function useService(): void
    {
        if ($this->free_services_remaining > 0) {
            $this->decrement('free_services_remaining');
        }
        $this->increment('services_used');
    }

    // Cancel membership
    public function cancel(string $reason = null): void
    {
        $this->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $reason,
        ]);
    }

    // Renew membership
    public function renew(): void
    {
        $newExpiry = $this->expires_at->addDays($this->plan->duration_days);
        
        $this->update([
            'status' => 'active',
            'expires_at' => $newExpiry,
            'services_used' => 0,
            'free_services_remaining' => $this->plan->free_services,
        ]);
    }
}
