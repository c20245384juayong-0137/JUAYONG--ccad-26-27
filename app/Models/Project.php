<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Project extends Model
{   protected $table = ['projects'];

    protected $fillable = [
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
        return $this->belongsTo(GridStatus::class);
    }
}
