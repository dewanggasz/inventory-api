<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BarcodeController; // <-- Impor controller

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

// Rute untuk menampilkan halaman cetak PDF
Route::get('/items/{item}/print-pdf', [BarcodeController::class, 'printPdf'])
    ->name('items.print-pdf');

// Rute BARU untuk mengunduh gambar barcode
Route::get('/items/{item}/download-barcode', [BarcodeController::class, 'downloadImage'])
    ->name('items.download-barcode');