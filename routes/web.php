<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BarcodeController; // <-- Impor controller
use App\Http\Controllers\Api\ExportController;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

// Rute untuk menampilkan halaman cetak PDF
Route::get('/items/{item}/print-pdf', [BarcodeController::class, 'printPdf'])
    ->name('items.print-pdf');

// Rute BARU untuk mengunduh gambar barcode
Route::get('/items/{item}/download-barcode', [BarcodeController::class, 'downloadImage'])
    ->name('items.download-barcode');

Route::middleware(['auth:sanctum', 'auth:web'])->group(function () {
Route::get('/items/export/excel', [ExportController::class, 'exportItems'])
    ->name('items.export.excel');
});