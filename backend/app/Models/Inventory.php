<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    protected $table = 'inventory';

    protected $fillable = [
        'name',
        'category',
        'stock',
        'unit',
        'threshold',
        'status',
    ];

    // Automatically update status based on stock
    protected static function booted()
    {
        static::saving(function ($inventory) {
            if ($inventory->stock <= 0) {
                $inventory->status = 'Critical';
            } elseif ($inventory->stock <= $inventory->threshold) {
                $inventory->status = 'Low Stock';
            } else {
                $inventory->status = 'In Stock';
            }
        });
    }
}
