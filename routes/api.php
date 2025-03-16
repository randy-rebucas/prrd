<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GalleryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_middleware', 'api')
])->group(function () {
    Route::get('/gallery-images', [GalleryController::class, 'getImages']);
});

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_middleware', 'api')
])->group(function () {
    Route::post('/gallery/upload', [GalleryController::class, 'upload']);
});