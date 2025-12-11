<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Branch extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'city',
        'state',
        'postal_code',
        'phone',
        'email',
        'latitude',
        'longitude',
        'manager_id',
        'is_active',
        'opening_time',
        'closing_time',
        'description',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'opening_time' => 'datetime:H:i',
        'closing_time' => 'datetime:H:i',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the branch manager
     */
    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    /**
     * Get all staff assigned to this branch
     */
    public function staff(): HasMany
    {
        return $this->hasMany(Staff::class);
    }

    /**
     * Get all appointments for this branch
     */
    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    /**
     * Get all inventories for this branch
     */
    public function inventory(): HasMany
    {
        return $this->hasMany(Inventory::class);
    }

    /**
     * Get business hours for this branch
     */
    public function businessHours(): HasMany
    {
        return $this->hasMany(BusinessHours::class);
    }

    /**
     * Get holidays for this branch
     */
    public function holidays(): HasMany
    {
        return $this->hasMany(Holiday::class);
    }

    /**
     * Get services available at this branch
     */
    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'branch_services', 'branch_id', 'service_id')
            ->withPivot('is_available', 'created_at');
    }

    /**
     * Get customer preferences for this branch
     */
    public function customerPreferences(): HasMany
    {
        return $this->hasMany(CustomerPreference::class, 'preferred_branch_id');
    }

    /**
     * Get total revenue for this branch
     */
    public function getTotalRevenueAttribute()
    {
        return $this->appointments()
            ->where('status', 'completed')
            ->sum('total_amount') ?? 0;
    }

    /**
     * Get total appointments for this branch
     */
    public function getTotalAppointmentsAttribute()
    {
        return $this->appointments()->count();
    }

    /**
     * Get active staff count
     */
    public function getActiveStaffCountAttribute()
    {
        return $this->staff()
            ->whereHas('user', function ($query) {
                $query->where('is_active', true);
            })
            ->count();
    }

    /**
     * Check if branch is open now
     */
    public function isOpenNow(): bool
    {
        return BusinessHours::isOpenOnDate($this->id, now()->toDateString());
    }

    /**
     * Get location as coordinates
     */
    public function getLocationAttribute()
    {
        return [
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
        ];
    }

    /**
     * Get full address
     */
    public function getFullAddressAttribute()
    {
        return "{$this->address}, {$this->city}, {$this->state} {$this->postal_code}";
    }

    /**
     * Scope: Get active branches only
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope: Get branches in a city
     */
    public function scopeInCity($query, $city)
    {
        return $query->where('city', $city);
    }

    /**
     * Scope: Get branches in a state
     */
    public function scopeInState($query, $state)
    {
        return $query->where('state', $state);
    }
}
