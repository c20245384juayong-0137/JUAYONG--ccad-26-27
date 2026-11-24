<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GridStatusController;
use App\Http\Controllers\ProjectController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {

    // Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Solar Projects
    Route::resource('projects', ProjectController::class);

    // Property Owners
    Route::resource('property-owners', App\Http\Controllers\PropertyOwnerController::class);

    // Grid Status
    Route::get('/grid-status', [GridStatusController::class, 'index'])->name('grid-status.index');
    Route::patch('/projects/{project}/grid-status', [GridStatusController::class, 'update'])
        ->name('projects.grid-status.update');

});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';