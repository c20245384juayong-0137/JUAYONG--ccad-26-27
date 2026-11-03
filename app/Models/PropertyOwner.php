<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class PropertyOwner extends Model
{
  protected $table = 'property_owners';

    protected $fillable = [
        'property_owner',
    ];

    public function Projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}
