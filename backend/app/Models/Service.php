<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'sub_category',
        'price',
        'duration',
        'description',
        'image',
        'slots',
        'discount',
        'includes',
        'is_members_only',
        'offer_valid_until',
        'rating',
        'reviews_count',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'rating' => 'decimal:2',
        'includes' => 'array',
        'is_members_only' => 'boolean',
        'is_active' => 'boolean',
        'offer_valid_until' => 'date',
    ];

    // Relationships
    public function appointments()
    {
        return $this->belongsToMany(Appointment::class, 'appointment_services')
            ->withPivot('price')
            ->withTimestamps();
    }

    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'user_favorites');
    }

    public function reviews()
    {
        return $this->hasMany(ServiceReview::class);
    }

    public function getAverageRatingAttribute()
    {
        return $this->reviews()->avg('rating') ?? 0;
    }

    public function getTotalReviewsAttribute()
    {
        return $this->reviews()->count();
    }
}
