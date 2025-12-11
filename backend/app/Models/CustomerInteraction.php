<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerInteraction extends Model
{
    protected $fillable = [
        'user_id',
        'interaction_type',
        'description',
        'appointment_id',
        'service_id',
        'rating',
        'feedback',
        'staff_id',
        'channel',
        'interaction_date',
    ];

    protected $casts = [
        'interaction_date' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the customer (user) associated with this interaction
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the related appointment
     */
    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }

    /**
     * Get the related service
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Get the staff member involved
     */
    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    /**
     * Get interactions by type
     */
    public function scopeByType($query, $type)
    {
        return $query->where('interaction_type', $type);
    }

    /**
     * Get interactions from a specific channel (call, email, sms, whatsapp, in-person)
     */
    public function scopeFromChannel($query, $channel)
    {
        return $query->where('channel', $channel);
    }

    /**
     * Get rated interactions
     */
    public function scopeRated($query)
    {
        return $query->whereNotNull('rating')->where('rating', '>', 0);
    }

    /**
     * Get recent interactions
     */
    public static function recentForCustomer($userId, $limit = 10)
    {
        return self::where('user_id', $userId)
            ->orderBy('interaction_date', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get average rating for a customer
     */
    public static function averageRating($userId): float
    {
        return self::where('user_id', $userId)
            ->whereNotNull('rating')
            ->where('rating', '>', 0)
            ->avg('rating') ?? 0;
    }
}
