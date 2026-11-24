<?php

namespace Tests\Feature;

use App\Models\GridStatus;
use App\Models\Installer;
use App\Models\Inverter;
use App\Models\Project;
use App\Models\PropertyOwner;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProjectValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_typed_relation_names_are_saved_as_existing_lookup_relations(): void
    {
        $this->actingAs(User::factory()->create());

        $response = $this->post('/projects', [
            'project_name' => 'Sunrise Villa',
            'property_owner' => 'Owner A',
            'inverter' => 'Inverter A',
            'installer' => 'Installer A',
            'grid_status' => 'Connected',
            'installation_address' => '123 Main St',
            'panel_count' => 12,
            'total_capacity_kw' => 4.5,
            'install_date' => '2026-11-12',
            'project_cost' => 25000,
            'grid_permit_no' => '',
        ]);

        $response->assertRedirect('/projects');
        $propertyOwner = PropertyOwner::where('property_owner', 'Owner A')->firstOrFail();
        $inverter = Inverter::where('inverter_model', 'Inverter A')->firstOrFail();
        $installer = Installer::where('lead_installer', 'Installer A')->firstOrFail();
        $gridStatus = GridStatus::where('grid_status', 'Connected')->firstOrFail();

        $this->assertDatabaseHas('projects', [
            'project_name' => 'Sunrise Villa',
            'property_owner_id' => $propertyOwner->id,
            'inverter_id' => $inverter->id,
            'installer_id' => $installer->id,
            'grid_status_id' => $gridStatus->id,
            'installation_address' => '123 Main St',
            'panel_count' => 12,
        ]);
    }

    public function test_inverter_and_installer_can_be_left_blank(): void
    {
        $this->actingAs(User::factory()->create());

        $response = $this->post('/projects', [
            'project_name' => 'Sunrise Villa',
            'property_owner' => 'Owner A',
            'inverter' => '',
            'installer' => '',
            'grid_status' => 'Connected',
            'installation_address' => '123 Main St',
            'panel_count' => 12,
            'total_capacity_kw' => 4.5,
            'install_date' => '2026-11-12',
            'project_cost' => 25000,
            'grid_permit_no' => '',
        ]);

        $response->assertRedirect('/projects');
        $this->assertDatabaseHas('projects', [
            'project_name' => 'Sunrise Villa',
            'inverter_id' => null,
            'installer_id' => null,
        ]);
    }

    public function test_project_update_changes_installer_and_grid_status(): void
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
            'grid_permit_no' => 'WP-1001',
        ]);

        $project = Project::where('project_name', 'Sunrise Villa')->firstOrFail();

        $response = $this->put("/projects/{$project->id}", [
            'project_name' => 'Sunrise Villa',
            'property_owner' => 'Owner A',
            'inverter' => '',
            'installer' => 'Installer B',
            'grid_status' => 'Connected',
            'installation_address' => '123 Main St',
            'panel_count' => 12,
            'total_capacity_kw' => 4.5,
            'install_date' => '2026-11-12',
            'project_cost' => 25000,
            'grid_permit_no' => 'WP-1001',
        ]);

        $response->assertRedirect("/projects/{$project->id}");
        $project->refresh()->load(['installer', 'gridStatus']);

        $this->assertSame('Installer B', $project->installer->lead_installer);
        $this->assertSame('Connected', $project->gridStatus->grid_status);
    }

    public function test_project_list_is_ordered_by_id_and_includes_property_owner(): void
    {
        $this->actingAs(User::factory()->create());

        foreach ([
            ['project_name' => 'Project One', 'property_owner' => 'Owner One'],
            ['project_name' => 'Project Two', 'property_owner' => 'Owner Two'],
        ] as $projectData) {
            $this->post('/projects', array_merge($projectData, [
                'inverter' => '',
                'installer' => '',
                'grid_status' => 'Pending',
                'installation_address' => '123 Main St',
                'panel_count' => 12,
                'total_capacity_kw' => 4.5,
                'install_date' => '2026-11-12',
                'project_cost' => 25000,
                'grid_permit_no' => $projectData['project_name'] === 'Project One' ? 'WP-1001' : 'WP-1002',
            ]))->assertRedirect('/projects');
        }

        $firstProject = Project::where('project_name', 'Project One')->firstOrFail();
        $secondProject = Project::where('project_name', 'Project Two')->firstOrFail();

        $this->get('/projects')->assertInertia(fn (Assert $page) => $page
            ->component('projects/index')
            ->where('projects.data.0.id', $firstProject->id)
            ->where('projects.data.0.property_owner.property_owner', 'Owner One')
            ->where('projects.data.1.id', $secondProject->id)
        );
    }
}
