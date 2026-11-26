<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Installer;
use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
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

        $projectsQuery = Project::query()
        ->with([
            'propertyOwner',
            'inverter',
            'installer',
            'gridStatus',
        ]);

        if ($search !== '') {
            $projectsQuery->where(function ($query) use ($search) {
                $like = '%' . $search . '%';

                $query->where('project_name', 'like', $like)
                    ->orWhere('installation_address', 'like', $like)
                    ->orWhere('grid_permit_no', 'like', $like)
                    ->orWhereHas('propertyOwner', fn ($query) => $query->where('property_owner', 'like', $like))
                    ->orWhereHas('inverter', fn ($query) => $query->where('inverter_model', 'like', $like))
                    ->orWhereHas('installer', fn ($query) => $query->where('lead_installer', 'like', $like))
                    ->orWhereHas('gridStatus', fn ($query) => $query->where('grid_status', 'like', $like));
            });
        }

        $projects = $projectsQuery
            ->orderBy('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('projects/index', [
            'projects' => $projects,
            'filters' => ['search' => $search],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(ProjectService $projectService): Response
    {
        return Inertia::render('projects/create', [
            'installers' => Installer::orderBy('lead_installer')->get(['id', 'lead_installer']),
            'gridPermitNo' => $projectService->generateGridPermitNo(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request, ProjectService $projectService): RedirectResponse
    {
        $projectService->create($request->validated()); // correct

        return redirect()->route('projects.index')->with('success', 'Solar project created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project): Response
    {
        return Inertia::render('projects/show', [
            'project' => $project->load(['propertyOwner', 'inverter', 'installer', 'gridStatus']), // need further optimization
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project): Response
    {
        return Inertia::render('projects/edit', [
            'project' => $project->load(['propertyOwner', 'inverter', 'installer', 'gridStatus']), // need further optimization
            'installers' => Installer::orderBy('lead_installer')->get(['id', 'lead_installer']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project, ProjectService $projectService): RedirectResponse
    {
        $validated = $request->validated();
        unset($validated['grid_permit_no']);

        $projectService->update($project->id, $validated);

        return redirect()->route('projects.index')->with('success', 'Solar project updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project): RedirectResponse
    {
        $project->delete();

        return redirect()->route('projects.index')->with('success', 'Solar project deleted successfully.');
    }
}
