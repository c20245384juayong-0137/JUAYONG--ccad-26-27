<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Inverter extends Model
{
       protected $table = 'inverters';

   

    protected $fillable = [
        'inverter_model',
    ];

    public function Project(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}
