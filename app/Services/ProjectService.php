<?php

namespace App\Services;

use App\Models\GridStatus;
use App\Models\Installer;
use App\Models\Inverter;
use App\Models\Project;
use App\Models\PropertyOwner;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ProjectService
{
    public function create(array $data): Project
    {
        return DB::transaction(function () use ($data) {
            $data = $this->sanitize($data);
            $data = $this->resolveRelations($data);
            $this->checkConstraints($data);

            return Project::create($data);
        });
    }

    public function update(int $id, array $data): Project
    {
        return DB::transaction(function () use ($id, $data) {
            $project = Project::findOrFail($id);

            $data = $this->sanitize($data);
            $data = $this->resolveRelations($data);
            $this->checkConstraints($data);

            $project->update($data);

            return $project->refresh();
        });
    }

    private function sanitize(array $data): array
    {
        foreach ([
            'property_owner',
            'inverter',
            'installer',
            'grid_status',
            'installation_address',
            'grid_permit_no',
        ] as $field) {
            if (isset($data[$field])) {
                $data[$field] = Str::squish($data[$field]);
            }
        }

        return $data;
    }

    private function resolveRelations(array $data): array
    {
        $data['property_owner_id'] = PropertyOwner::firstOrCreate([
            'property_owner' => $data['property_owner'],
        ])->id;
        $data['grid_status_id'] = GridStatus::firstOrCreate([
            'grid_status' => $data['grid_status'],
        ])->id;

        $data['inverter_id'] = $this->resolveOptionalRelation(
            Inverter::class,
            'inverter_model',
            $data['inverter'] ?? null,
        );
        $data['installer_id'] = $this->resolveOptionalRelation(
            Installer::class,
            'lead_installer',
            $data['installer'] ?? null,
        );

        unset($data['property_owner'], $data['inverter'], $data['installer'], $data['grid_status']);

        return $data;
    }

    private function resolveOptionalRelation(string $modelClass, string $attribute, ?string $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        return $modelClass::firstOrCreate([$attribute => $value])->id;
    }

    private function checkConstraints(array $data): void
    {
        if (isset($data['panel_count']) && $data['panel_count'] < 1) {
            throw ValidationException::withMessages([
                'panel_count' => 'At least one solar panel is required.',
            ]);
        }

        if (
            isset($data['total_capacity_kw'])
            && $data['total_capacity_kw'] <= 0
        ) {
            throw ValidationException::withMessages([
                'total_capacity_kw' => 'Capacity must be greater than zero.',
            ]);
        }

        if (isset($data['project_cost']) && $data['project_cost'] < 0) {
            throw ValidationException::withMessages([
                'project_cost' => 'Project cost cannot be negative.',
            ]);
        }
    }
}