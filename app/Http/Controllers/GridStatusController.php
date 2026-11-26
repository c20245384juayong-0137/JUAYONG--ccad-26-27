<?php

namespace App\Http\Controllers;

use App\Models\GridStatus;
use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GridStatusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
        ]);
        $search = trim($validated['search'] ?? '');

        $projectsQuery = Project::with(['propertyOwner', 'installer', 'gridStatus']); // need further optimization

        if ($search !== '') {
            $projectsQuery->where(function ($query) use ($search) {
                $like = '%' . $search . '%';

                $query->where('project_name', 'like', $like)
                    ->orWhere('installation_address', 'like', $like)
                    ->orWhereHas('propertyOwner', fn ($query) => $query->where('property_owner', 'like', $like))
                    ->orWhereHas('installer', fn ($query) => $query->where('lead_installer', 'like', $like))
                    ->orWhereHas('gridStatus', fn ($query) => $query->where('grid_status', 'like', $like));
            });
        }

        $projects = $projectsQuery
            ->orderBy('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('grid-status/index', [
            'projects' => $projects,
            'filters' => ['search' => $search],
            'statusCounts' => [
                'total' => Project::count(),
                'connected' => Project::withGridStatus('connected')->count(),
                'pending' => Project::withGridStatus('pending')->count(),
                'disconnected' => Project::withGridStatus('disconnected')->count(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(GridStatus $gridStatus)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(GridStatus $gridStatus)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project, ProjectService $projectService): RedirectResponse
    {
        //transfer this to a form request class
        $validated = $request->validate([
            'grid_status' => ['required', 'string', 'max:255'],
        ]);

        $projectService->updateGridStatus($project, $validated['grid_status']);

        return redirect()->route('grid-status.index')->with('success', 'Grid status updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GridStatus $gridStatus)
    {
        //
    }
}
