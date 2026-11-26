<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\ProjectService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $this->get('/dashboard')->assertRedirect('/login');
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        $this->actingAs($user = User::factory()->create());

        $this->get('/dashboard')->assertOk();
    }

    public function test_dashboard_displays_project_data_and_exact_grid_status_counts(): void
    {
        $this->actingAs(User::factory()->create());

        $this->createProject('Connected project', 'Connected');
        $this->createProject('Pending project', 'Pending');
        $this->createProject('Disconnected project', 'Disconnected');
        $this->createProject('Most recent project', 'disconnected');

        $this->get('/dashboard')->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('statusCounts.total', 4)
            ->where('statusCounts.connected', 1)
            ->where('statusCounts.pending', 1)
            ->where('statusCounts.disconnected', 2)
            ->where('recentProjects.0.project_name', 'Pending project')
            ->where('recentProjects.1.project_name', 'Disconnected project')
            ->where('recentProjects.2.project_name', 'Most recent project')
            ->has('recentProjects', 3)
        );
    }

    private function createProject(string $name, string $gridStatus): void
    {
        app(ProjectService::class)->create([
            'project_name' => $name,
            'property_owner' => 'Owner',
            'inverter' => '',
            'installer' => 'Installer',
            'grid_status' => $gridStatus,
            'installation_address' => '123 Main St',
            'panel_count' => 12,
            'total_capacity_kw' => 4.5,
            'install_date' => '2026-11-12',
            'project_cost' => 25000,
        ]);
    }
}
