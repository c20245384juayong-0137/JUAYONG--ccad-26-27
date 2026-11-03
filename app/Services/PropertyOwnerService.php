<?php

namespace App\Services;


use App\Models\PropertyOwner;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PropertyOwnerService
{
    public function create(array $data): PropertyOwner
    {
        return DB::transaction(function () use ($data) {
            $data = $this->sanitize($data);

            return PropertyOwner::create($data);
        });
    }

    public function update(int $id, array $data): PropertyOwner
    {
        return DB::transaction(function () use ($id, $data) {
            $owner = PropertyOwner::findOrFail($id);

            $data = $this->sanitize($data);
            $owner->update($data);

            return $owner->refresh();
        });
    }

    private function sanitize(array $data): array
    {
        if (isset($data['property_owner'])) {
            $data['property_owner'] = Str::squish(
                $data['property_owner']
            );
        }

        return $data;
    }
}