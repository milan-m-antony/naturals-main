<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    protected $fillable = [
        'name',
        'report_type',
        'description',
        'filters',
        'generated_by',
        'status',
        'file_path',
        'exported_format',
        'row_count',
    ];

    protected $casts = [
        'filters' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user who generated the report
     */
    public function generatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }

    /**
     * Get reports by type
     */
    public function scopeByType($query, $type)
    {
        return $query->where('report_type', $type);
    }

    /**
     * Get reports by status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Mark report as completed
     */
    public function markCompleted($filePath = null, $format = 'pdf', $rowCount = 0)
    {
        $this->update([
            'status' => 'completed',
            'file_path' => $filePath,
            'exported_format' => $format,
            'row_count' => $rowCount,
        ]);
    }

    /**
     * Mark report as failed
     */
    public function markFailed()
    {
        $this->update(['status' => 'failed']);
    }
}
