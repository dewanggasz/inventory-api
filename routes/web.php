<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BarcodeController; // <-- Impor controller

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

// Rute untuk menampilkan halaman cetak barcode
Route::get('/items/{item}/print-barcode', [BarcodeController::class, 'print'])
    ->name('items.print-barcode'); // Beri nama agar mudah dipanggil
