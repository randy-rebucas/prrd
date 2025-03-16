<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\GalleryController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('/gallery', [GalleryController::class, 'index'])
    ->name('gallery.index');

Route::post('/gallery/upload', [GalleryController::class, 'upload'])
    ->name('gallery.upload');

Route::get('/gallery/images', [GalleryController::class, 'getImages'])
    ->name('gallery.images');

Route::delete('/gallery/images/{id}', [GalleryController::class, 'delete'])
    ->name('gallery.delete');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
