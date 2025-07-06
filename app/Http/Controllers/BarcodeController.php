<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Spatie\LaravelPdf\Facades\Pdf;
use Illuminate\Support\Facades\Response;
// Kita tidak lagi memerlukan "use Milon\Barcode\Facades\DNS2D;"

class BarcodeController extends Controller
{
    // Method untuk membuat file PDF
    public function printPdf(Item $item)
    {
        return Pdf::view('barcode.print', compact('item'))
            ->name("barcode-{$item->code}.pdf")
            ->inline();
    }

    // Method untuk mengunduh gambar barcode
    public function downloadImage(Item $item)
    {
        // PERBAIKAN: Panggil kelas fasad secara lengkap untuk menghindari masalah alias
        $barcodeImage = base64_decode(\Milon\Barcode\Facades\DNS2DFacade::getBarcodePNG($item->barcode_path, 'QRCODE'));

        // Buat nama file
        $filename = "barcode-image-{$item->code}.png";

        // Kembalikan sebagai respons gambar untuk diunduh
        return Response::make($barcodeImage, 200, [
            'Content-Type' => 'image/png',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"'
        ]);
    }
}