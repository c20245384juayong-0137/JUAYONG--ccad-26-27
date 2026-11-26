<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class GridStatusTest extends TestCase
{
    use RefreshDatabase;

    public function test_projects_appear_on_grid_status_page_and_status_can_be_updated_there(): void
    {
        $this->actingAs(User::factory()->create());

        $this->post('/projects', [
            'project_name' => 'Sunrise Villa',
            'property_owner' => 'Owner A',
            'inverter' => '',
            'installer' => 'Installer A',
            'grid_status' => 'Pending',
            'installation_address' => '123 Main St',
            'panel_count' => 12,
            'total_capacity_kw' => 4.5,
            'install_date' => '2026-11-12',
            'project_cost' => 25000,
        ])->assertRedirect('/projects');

        $project = Project::where('project_name', 'Sunrise Villa')->firstOrFail();

        $this->get('/grid-status')->assertInertia(fn (Assert $page) => $page
            ->component('grid-status/index')
            ->where('projects.data.0.project_name', 'Sunrise Villa')
            ->where('projects.data.0.property_owner.property_owner', 'Owner A')
            ->where('projects.data.0.grid_status.grid_status', 'Pending')
            ->where('statusCounts.total', 1)
            ->where('statusCounts.pending', 1)
        );

        $this->patch("/projects/{$project->id}/grid-status", [
            'grid_status' => 'Connected',
        ])->assertRedirect('/grid-status');

        $project->refresh()->load('gridStatus');
        $this->assertSame('Connected', $project->gridStatus->grid_status);

        app(\App\Services\ProjectService::class)->create([
            'project_name' => 'Disconnected project',
            'property_owner' => 'Owner B',
            'inverter' => '',
            'installer' => 'Installer B',
            'grid_status' => 'Disconnected',
            'installation_address' => '456 Main St',
            'panel_count' => 10,
            'total_capacity_kw' => 3.5,
            'install_date' => '2026-11-13',
            'project_cost' => 20000,
        ]);

        $this->get('/grid-status')->assertInertia(fn (Assert $page) => $page
            ->where('statusCounts.connected', 1)
            ->where('statusCounts.pending', 0)
            ->where('statusCounts.disconnected', 1)
        );

        $this->get('/grid-status?search=Disconnected')->assertInertia(fn (Assert $page) => $page
            ->where('filters.search', 'Disconnected')
            ->where('projects.total', 1)
            ->where('projects.data.0.project_name', 'Disconnected project')
        );
    }
}
