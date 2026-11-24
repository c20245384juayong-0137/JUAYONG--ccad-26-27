<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $projects = Project::with([
            'propertyOwner', // need further optimization
            'inverter', // need further optimization
            'installer', // need further optimization
            'gridStatus', // need further optimization
        ])->orderBy('id')->paginate(10); // need further optimization

        return Inertia::render('projects/index', [
            'projects' => $projects,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('projects/create');
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
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project, ProjectService $projectService): RedirectResponse
    {
        $projectService->update($project->id, $request->validated());

        return redirect()->route('projects.show', $project)->with('success', 'Solar project updated successfully.');
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
