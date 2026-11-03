<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Installer extends Model
{
    protected $table = 'installers';

    protected $fillable = [
        'lead_installer',
    ];

    public function Projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}

