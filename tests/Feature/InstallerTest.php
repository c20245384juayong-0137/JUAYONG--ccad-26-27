<?php

namespace Tests\Feature;

use App\Models\Installer;
use App\Models\Project;
use App\Models\User;
use App\Services\ProjectService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class InstallerTest extends TestCase
{
    use RefreshDatabase;

    public function test_installers_can_be_created_listed_updated_and_deleted(): void
    {
        $this->actingAs(User::factory()->create());

        $this->post('/installers', ['lead_installer' => ' Sunny Installations '])
            ->assertRedirect('/installers');

        $installer = Installer::where('lead_installer', 'Sunny Installations')->firstOrFail();

        $this->get('/installers')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('installers/index')
            ->where('installers.data.0.lead_installer', 'Sunny Installations')
            ->where('installers.total', 1)
        );

        $this->get('/installers?search=Sunny')->assertInertia(fn (Assert $page) => $page
            ->where('filters.search', 'Sunny')
            ->where('installers.total', 1)
            ->where('installers.data.0.lead_installer', 'Sunny Installations')
        );

        $this->put("/installers/{$installer->id}", ['lead_installer' => 'Bright Solar'])
            ->assertRedirect('/installers');
        $this->assertDatabaseHas('installers', ['id' => $installer->id, 'lead_installer' => 'Bright Solar']);

        app(ProjectService::class)->create([
            'project_name' => 'Sunrise Villa',
            'property_owner' => 'Owner A',
            'inverter' => '',
            'installer' => 'Bright Solar',
            'grid_status' => 'Connected',
            'installation_address' => '123 Main St',
            'panel_count' => 12,
            'total_capacity_kw' => 4.5,
            'install_date' => '2026-11-12',
            'project_cost' => 25000,
        ]);

        $this->delete("/installers/{$installer->id}")->assertRedirect('/installers');
        $this->assertDatabaseMissing('installers', ['id' => $installer->id]);
        $this->assertNull(Project::where('project_name', 'Sunrise Villa')->firstOrFail()->installer_id);
    }

    public function test_installer_name_is_required(): void
    {
        $this->actingAs(User::factory()->create());

        $this->post('/installers', ['lead_installer' => ''])
            ->assertSessionHasErrors('lead_installer');
    }
}
