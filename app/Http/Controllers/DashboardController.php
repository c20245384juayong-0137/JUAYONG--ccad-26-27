<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $statusCounts = [
            'total' => Project::count(),
            'connected' => Project::withGridStatus('connected')->count(),
            'pending' => Project::withGridStatus('pending')->count(),
            'disconnected' => Project::withGridStatus('disconnected')->count(),
        ];

        return Inertia::render('dashboard', [
            'statusCounts' => $statusCounts,
            'recentProjects' => Project::with('gridStatus')
                ->orderByDesc('id')
                ->limit(3)
                ->get(['id', 'project_name', 'grid_status_id'])
                ->sortBy('id')
                ->values(),
        ]);
    }
}
