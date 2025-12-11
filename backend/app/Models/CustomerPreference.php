<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerPreference extends Model
{
    protected $fillable = [
        'user_id',
        'preferred_staff_id',
        'preferred_time_slot',
        'communication_preference',
        'appointment_reminders',
        'reminder_advance_days',
        'special_requirements',
        'allergies',
        'skin_type',
        'preferred_services',
        'do_not_contact',
        'preferred_branch_id',
    ];

    protected $casts = [
        'appointment_reminders' => 'boolean',
        'do_not_contact' => 'boolean',
        'special_requirements' => 'array',
        'preferred_services' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the customer (user) associated with this preference
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the preferred staff member
     */
    public function preferredStaff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'preferred_staff_id');
    }

    /**
     * Get the preferred branch
     */
    public function preferredBranch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'preferred_branch_id');
    }

    /**
     * Check if customer accepts email communication
     */
    public function acceptsEmail(): bool
    {
        return !$this->do_not_contact && 
               in_array($this->communication_preference, ['email', 'both', 'all']);
    }

    /**
     * Check if customer accepts SMS communication
     */
    public function acceptsSms(): bool
    {
        return !$this->do_not_contact && 
               in_array($this->communication_preference, ['sms', 'both', 'all']);
    }

    /**
     * Check if customer accepts WhatsApp communication
     */
    public function acceptsWhatsApp(): bool
    {
        return !$this->do_not_contact && 
               in_array($this->communication_preference, ['whatsapp', 'all']);
    }

    /**
     * Get customer's allergy information
     */
    public function getAllergies(): array
    {
        return is_array($this->allergies) ? $this->allergies : [];
    }

    /**
     * Get customer's special requirements
     */
    public function getSpecialRequirements(): array
    {
        return $this->special_requirements ?? [];
    }

    /**
     * Get customer's favorite services
     */
    public function getFavoriteServices(): array
    {
        return $this->preferred_services ?? [];
    }
}
