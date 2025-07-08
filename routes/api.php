<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\CategoryController; // <-- Impor controller baru
use App\Http\Controllers\Api\LocationController; // <-- Impor controller baru


// Rute publik untuk login
Route::post('/login', [AuthController::class, 'login']);

// Rute yang dilindungi oleh Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/items', [ItemController::class, 'index']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/locations', [LocationController::class, 'index']);

    // Endpoint untuk Barang
    Route::get('/items/scan/{barcode}', [ItemController::class, 'scan']);
    Route::get('/items/{kode}', [ItemController::class, 'show']);
    Route::get('/items/{kode}/history', [ItemController::class, 'history']);
    Route::patch('/items/{id}/status', [ItemController::class, 'updateStatus']);
});
