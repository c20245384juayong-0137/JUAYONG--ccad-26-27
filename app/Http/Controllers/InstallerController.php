<?php

namespace App\Http\Controllers;

use App\Models\Installer;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class InstallerController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
        ]);
        $search = trim($validated['search'] ?? '');

        return Inertia::render('installers/index', [
            'installers' => Installer::query()
                ->when($search !== '', fn ($query) => $query->where('lead_installer', 'like', '%' . $search . '%'))
                ->orderBy('lead_installer')
                ->paginate(10)
                ->withQueryString(),
            'filters' => ['search' => $search],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'lead_installer' => ['required', 'string', 'max:255'],
        ]);

        Installer::create([
            'lead_installer' => Str::squish($validated['lead_installer']),
        ]);

        return redirect()->route('installers.index')->with('success', 'Installer added successfully.');
    }

    public function update(Request $request, Installer $installer): RedirectResponse
    {
        $validated = $request->validate([
            'lead_installer' => ['required', 'string', 'max:255'],
        ]);

        $installer->update([
            'lead_installer' => Str::squish($validated['lead_installer']),
        ]);

        return redirect()->route('installers.index')->with('success', 'Installer updated successfully.');
    }

    public function destroy(Installer $installer): RedirectResponse
    {
        DB::transaction(function () use ($installer) {
            Project::where('installer_id', $installer->id)->update(['installer_id' => null]);
            $installer->delete();
        });

        return redirect()->route('installers.index')->with('success', 'Installer deleted successfully.');
    }
}
