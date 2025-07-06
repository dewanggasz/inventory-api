<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Spatie\LaravelPdf\Facades\Pdf;

class BarcodeController extends Controller
{
    public function print(Item $item)
    {
        // Generate PDF dari view 'barcode.print' dengan data item
        return Pdf::view('barcode.print', compact('item'))
            // ->format('A7') // <-- HAPUS BARIS INI juga untuk menghindari error
            ->name("barcode-{$item->code}.pdf")
            ->inline();
    }
}
