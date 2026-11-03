<?php

namespace App\Http\Requests;


use Illuminate\Foundation\Http\FormRequest;

class StorePropertyOwnerRequest extends FormRequest
{
   public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'property_owner' => 'required|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'property_owner.required' => 'Enter the property owner name.',
            'property_owner.string' => 'The owner name must be text.',
            'property_owner.max' => 'The owner name cannot exceed 255 characters.',
        ];
    }
}


