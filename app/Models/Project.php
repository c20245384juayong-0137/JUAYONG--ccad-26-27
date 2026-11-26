<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Project extends Model
{
    protected $table = 'projects';

    protected $fillable = [
        'project_name',
        'property_owner_id',
        'inverter_id',
        'installer_id',
        'grid_status_id',
        'installation_address',
        'panel_count',
        'total_capacity_kw',
        'install_date',
        'project_cost',
        'grid_permit_no',
    ];

    protected $casts = [
        'install_date' => 'date',
        'panel_count' => 'integer',
        'total_capacity_kw' => 'decimal:2',
        'project_cost' => 'decimal:2',
    ];


    public function propertyOwner(): BelongsTo
    {
        return $this->belongsTo(PropertyOwner::class);
    }

    public function inverter(): BelongsTo
    {
        return $this->belongsTo(Inverter::class);
    }

    public function installer(): BelongsTo
    {
        return $this->belongsTo(Installer::class);
    }

    public function gridStatus(): BelongsTo
    {
        return $this->belongsTo(GridStatus::class, 'grid_status_id');
    }

    public function scopeWithGridStatus(Builder $query, string $status): Builder
    {
        return $query->whereHas('gridStatus', function (Builder $query) use ($status) {
            $query->whereRaw('LOWER(TRIM(grid_status)) = ?', [strtolower(trim($status))]);
        });
    }
}
