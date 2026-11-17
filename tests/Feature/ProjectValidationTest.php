<?php

namespace Tests\Feature;

use App\Models\GridStatus;
use App\Models\Installer;
use App\Models\Inverter;
use App\Models\PropertyOwner;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
}
