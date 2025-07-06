<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cetak Barcode - {{ $item->name }}</title>
    <style>
        /* PERBAIKAN: Atur semua properti halaman PDF melalui CSS */
        @page {
            size: A7; /* <-- Tambahkan ukuran kertas di sini */
            margin: 5mm;
        }
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
        }
        .label {
            width: 40%;
            padding: 5px;
            border: 1px solid #000;
            text-align: left;
            display: flex;
            align-items: flex-end;
            gap: 10px;
            justify-content: flex-start;
            box-sizing: border-box;
        }
        .item-name {
            font-size: 16px;
            font-weight: bold;
            margin: 0 0 5px 0;
            word-wrap: break-word;
        }
        .item-code {
            font-size: 12px;
            margin: 0 0 10px 0;
        }
        .barcode {
            padding: 10px 0;

        }
    </style>
</head>
<body>
    <div class="label">
        <div class="barcode">
            {{-- Generate Barcode 2D (QR Code) agar lebih mudah di-scan HP --}}
            {!! \Milon\Barcode\Facades\DNS2DFacade::getBarcodeHTML($item->barcode_path, 'QRCODE', 5, 5) !!}
        </div>
        <div class="itemContainer">
            <p class="item-name">{{ $item->name }}</p>
            <p class="item-code">{{ $item->code }}</p>
        </div>
    </div>
</body>
</html>
