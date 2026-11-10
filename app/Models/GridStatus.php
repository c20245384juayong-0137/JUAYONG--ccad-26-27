<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class GridStatus extends Model
{
    protected $table = 'grid_statuses';

    protected $fillable = [
        'grid_status',
    ];

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class, 'grid_status_id');
    }
}
