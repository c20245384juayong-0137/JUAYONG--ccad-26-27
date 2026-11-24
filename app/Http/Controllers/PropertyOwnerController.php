<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePropertyOwnerRequest;
use App\Http\Requests\UpdatePropertyOwnerRequest;
use App\Models\PropertyOwner;
use App\Services\PropertyOwnerService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PropertyOwnerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('PropertyOwners/Index', [ // no jsx page
            'propertyOwners' => PropertyOwner::orderBy('property_owner')->get(), // need further optimization
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('PropertyOwners/Index', [
            'propertyOwners' => PropertyOwner::orderBy('property_owner')->get(), // need further optimization
            'propertyOwner' => null,
        ]);
    }

    public function store(StorePropertyOwnerRequest $request, PropertyOwnerService $service): RedirectResponse
    {
        $service->create($request->validated());

        return redirect()->route('property-owners.index')->with('success', 'Property owner added successfully.');
    }

    public function edit(PropertyOwner $propertyOwner): Response
    {
        return Inertia::render('PropertyOwners/Index', [
            'propertyOwners' => PropertyOwner::orderBy('property_owner')->get(), // need further optimization
            'propertyOwner' => $propertyOwner,
        ]);
    }

    public function update(UpdatePropertyOwnerRequest $request, PropertyOwner $propertyOwner, PropertyOwnerService $service): RedirectResponse
    {
        $service->update($propertyOwner->id, $request->validated());

        return redirect()->route('property-owners.index')->with('success', 'Property owner updated successfully.');
    }

    public function destroy(PropertyOwner $propertyOwner): RedirectResponse
    {
        $propertyOwner->delete();

        return redirect()->route('property-owners.index')->with('success', 'Property owner deleted successfully.');
    }
}
