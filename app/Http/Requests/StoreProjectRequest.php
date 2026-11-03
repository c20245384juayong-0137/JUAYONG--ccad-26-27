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
            'property_owner_id' => 'required|integer|exists:property_owners,id',
            'inverter_id' => 'required|integer|exists:inverters,id',
            'installer_id' => 'required|integer|exists:installers,id',
            'grid_status_id' => 'required|integer|exists:grid_statuses,id',
            'installation_address' => 'required|string|max:255',
            'panel_count' => 'required|integer|min:1',
            'total_capacity_kw' => 'required|numeric|gt:0',
            'install_date' => 'required|date',
            'project_cost' => 'required|numeric|min:0',
            'grid_permit_no' => 'required|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'property_owner_id.required' => 'Select a property owner.',
            'property_owner_id.exists' => 'The selected owner does not exist.',
            'inverter_id.exists' => 'The selected inverter does not exist.',
            'installer_id.exists' => 'The selected installer does not exist.',
            'grid_status_id.exists' => 'The selected grid status does not exist.',
            'installation_address.required' => 'Enter the installation address.',
            'panel_count.min' => 'At least one panel is required.',
            'total_capacity_kw.gt' => 'Capacity must be greater than zero.',
            'install_date.required' => 'Enter the installation date.',
            'project_cost.min' => 'Project cost cannot be negative.',
            'grid_permit_no.required' => 'Enter the grid permit number.',
        ];
    }
}
