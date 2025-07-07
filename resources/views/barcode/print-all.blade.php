<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cetak Semua Barcode</title>
    <style>
        @page {
            margin: 1cm; /* Margin halaman PDF */
        }
        body {
            font-family: 'Arial', sans-serif;
        }
        .grid-container {
            display: grid;
            grid-template-columns: 1fr 1fr; /* 2 kolom */
            gap: 10px;
        }
        .label {
            padding: 10px;
            border: 1px solid #ccc;
            text-align: center;
            break-inside: avoid; /* Mencegah label terpotong saat pindah halaman */
        }
        .item-name {
            font-size: 14px;
            font-weight: bold;
            margin: 0 0 5px 0;
            word-wrap: break-word;
        }
        .item-code {
            font-size: 10px;
            margin: 0 0 10px 0;
        }
        .barcode {
            padding: 5px 0;
        }
    </style>
</head>
<body>
    <div class="grid-container">
        @foreach ($items as $item)
            <div class="label">
                <p class="item-name">{{ $item->name }}</p>
                <p class="item-code">{{ $item->code }}</p>
                <div class="barcode">
                    {!! \Milon\Barcode\Facades\DNS2DFacade::getBarcodeHTML($item->barcode_path, 'QRCODE', 4, 4) !!}
                </div>
            </div>
        @endforeach
    </div>
</body>
</html>