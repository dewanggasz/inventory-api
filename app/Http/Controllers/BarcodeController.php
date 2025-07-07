<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Spatie\LaravelPdf\Facades\Pdf;
use Illuminate\Support\Facades\Response;
use Milon\Barcode\Facades\DNS2DFacade;

class BarcodeController extends Controller
{
    // Method untuk membuat file PDF satu per satu
    public function printPdf(Item $item)
    {
        return Pdf::view('barcode.print', compact('item'))
            ->name("barcode-{$item->code}.pdf")
            ->inline();
    }

    // Method untuk mengunduh gambar barcode satu per satu
    public function downloadImage(Item $item)
    {
        $barcodeImage = base64_decode(DNS2DFacade::getBarcodePNG($item->barcode_path, 'QRCODE'));
        $filename = "barcode-image-{$item->code}.png";
        return Response::make($barcodeImage, 200, [
            'Content-Type' => 'image/png',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"'
        ]);
    }

    // -- METHOD BARU UNTUK CETAK SEMUA --
    public function printAll()
    {
        $items = Item::all();
        return Pdf::view('barcode.print-all', compact('items'))
            ->format('A4') // Gunakan kertas ukuran A4
            ->name('semua-barcode-barang.pdf')
            ->inline();
    }
}
