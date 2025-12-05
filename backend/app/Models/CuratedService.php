<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CuratedService extends Model
{
    use HasFactory;

    protected $fillable = [
        'section_title',
        'section_description',
        'hair_studio_images',
        'skin_features',
        'skin_image',
        'bridal_slides',
        'is_active',
    ];

    protected $casts = [
        'hair_studio_images' => 'array',
        'skin_features' => 'array',
        'bridal_slides' => 'array',
        'is_active' => 'boolean',
    ];
}
