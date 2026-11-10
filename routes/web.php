<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
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

    // Grid Status
    Route::get('/grid-status', function () {
        return Inertia::render('grid-status/index');
    })->name('grid-status.index');

});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';