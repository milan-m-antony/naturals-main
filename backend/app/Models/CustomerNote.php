<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerNote extends Model
{
    protected $fillable = [
        'user_id',
        'note',
        'created_by',
        'is_internal',
        'importance',
    ];

    protected $casts = [
        'is_internal' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the customer (user) associated with this note
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the staff member who created this note
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get recent notes for a customer
     */
    public static function forCustomer($userId, $limit = 10)
    {
        return self::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get high-importance notes
     */
    public function scopeImportant($query)
    {
        return $query->where('importance', '>=', 3);
    }

    /**
     * Get public-facing notes (non-internal)
     */
    public function scopePublic($query)
    {
        return $query->where('is_internal', false);
    }
}
