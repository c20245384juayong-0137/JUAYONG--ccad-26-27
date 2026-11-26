<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'project_name' => 'required|string|max:255',
            'property_owner' => 'required|string|max:255',
            'inverter' => 'nullable|string|max:255',
            'installer' => 'nullable|string|max:255',
            'grid_status' => 'required|string|max:255',
            'installation_address' => 'required|string|max:255',
            'panel_count' => 'required|integer|min:1|max:1000000',
            'total_capacity_kw' => 'required|numeric|min:0.1|max:1000000',
            'install_date' => 'required|date',
            'project_cost' => 'required|numeric|min:0|max:9999999999999.99',
            'grid_permit_no' => 'sometimes|nullable|string|max:100|unique:projects,grid_permit_no',
        ];
    }

    public function messages(): array
    {
        return [
            'project_name.required' => 'Enter the project name.',
            'project_name.max' => 'Project name cannot exceed 255 characters.',
            'property_owner.required' => 'Enter the property owner.',
            'inverter.max' => 'The inverter cannot exceed 255 characters.',
            'installer.max' => 'The installer cannot exceed 255 characters.',
            'grid_status.required' => 'Enter the grid status.',
            'installation_address.required' => 'Enter the installation address.',
            'panel_count.min' => 'At least one panel is required.',
            'total_capacity_kw.gt' => 'Capacity must be greater than zero.',
            'install_date.required' => 'Enter the installation date.',
            'project_cost.min' => 'Project cost cannot be negative.',
        ];
    }
}
