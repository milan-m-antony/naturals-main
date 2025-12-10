<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppointmentReschedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_id',
        'original_date',
        'original_time',
        'new_date',
        'new_time',
        'reason',
        'status',
        'staff_id',
        'admin_notes',
    ];

    protected $casts = [
        'original_date' => 'datetime',
        'new_date' => 'datetime',
    ];

    // Relationships
    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }
}
