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
    public function index(): Response
    {
        $projects = Project::with(['propertyOwner', 'installer', 'gridStatus']) // need further optimization
            ->orderBy('id')
            ->paginate(10);

            //transfer this to a service class
        $countStatus = static function (string $status): int {
            return Project::whereHas('gridStatus', function ($query) use ($status) {
                $query->whereRaw('LOWER(grid_status) LIKE ?', ['%' . strtolower($status) . '%']);
            })->count();
        };

        return Inertia::render('grid-status/index', [
            'projects' => $projects,
            'statusCounts' => [
                'total' => Project::count(),
                'connected' => $countStatus('connected'),
                'pending' => $countStatus('pending'),
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
