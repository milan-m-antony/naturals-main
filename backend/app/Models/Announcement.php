<?php

/**
 * copilot:follow
 * This module is MARKED AS DONE.
 * It is protected. Do NOT modify unless the user explicitly asks.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'text',
        'icon',
        'action',
        'link_target',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];
}
