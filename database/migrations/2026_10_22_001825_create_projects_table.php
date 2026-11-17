
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('project_name');
            $table->string('property_owner_id');
            $table->unsignedBigInteger('inverter_id')->nullable();
            $table->unsignedBigInteger('installer_id')->nullable();
            $table->unsignedBigInteger('grid_status_id');

            $table->string('installation_address');
            $table->unsignedInteger('panel_count');
            $table->decimal('total_capacity_kw', 10, 2);
            $table->date('install_date');
            $table->decimal('project_cost', 15, 2)->nullable();
            $table->string('grid_permit_no')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
