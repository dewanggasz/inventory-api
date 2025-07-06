<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Exports\ItemsExport;
use Maatwebsite\Excel\Facades\Excel;

class ExportController extends Controller
{
    public function exportItems()
    {
        $filename = 'laporan-barang-' . now()->format('Y-m-d') . '.xlsx';
        return Excel::download(new ItemsExport(), $filename);
    }
}
