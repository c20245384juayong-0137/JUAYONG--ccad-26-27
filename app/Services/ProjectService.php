<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ProjectService
{
    public function create(array $data): Project
    {
        return DB::transaction(function () use ($data) {
            $data = $this->sanitize($data);
            $this->checkConstraints($data);

            return Project::create($data);
        });
    }

    public function update(int $id, array $data): Project
    {
        return DB::transaction(function () use ($id, $data) {
            $project = Project::findOrFail($id);

            $data = $this->sanitize($data);
            $this->checkConstraints($data);

            $project->update($data);

            return $project->refresh();
        });
    }

    private function sanitize(array $data): array
    {
        foreach ([
            'installation_address',
            'grid_permit_no',
        ] as $field) {
            if (isset($data[$field])) {
                $data[$field] = Str::squish($data[$field]);
            }
        }

        return $data;
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