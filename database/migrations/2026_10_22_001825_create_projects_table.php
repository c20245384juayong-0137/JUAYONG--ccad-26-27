<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('property_owner_id');   // no foreign key for now
            $table->string('installation_address');
            $table->string('panel_count');
            $table->string('total_capacity_kw');
            $table->date('install_date');
            $table->string('project_cost');
            $table->string('grid_permit_no');
            $table->unsignedBigInteger('grid_status_id');      // no foreign key for now
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
