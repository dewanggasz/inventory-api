<?php

namespace App\Exports;

use App\Models\Item;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ItemsExport implements FromCollection, WithHeadings, WithMapping
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        // Ambil semua item beserta relasi yang dibutuhkan
        return Item::with(['category', 'location', 'latestStatus.user'])->get();
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        // Definisikan judul untuk setiap kolom di file Excel
        return [
            'Kode Unik',
            'Nama Barang',
            'Barcode',
            'Kategori',
            'Lokasi',
            'Status Terakhir',
            'Catatan Terakhir',
            'Diupdate Oleh',
            'Tanggal Update Terakhir',
        ];
    }

    /**
     * @param mixed $item
     *
     * @return array
     */
    public function map($item): array
    {
        // Petakan data dari setiap item ke kolom yang sesuai
        return [
            $item->code,
            $item->name,
            $item->barcode_path,
            $item->category->name ?? 'N/A',
            $item->location->name ?? 'N/A',
            $item->latestStatus->status ?? 'N/A',
            $item->latestStatus->note ?? '',
            $item->latestStatus->user->name ?? 'N/A',
            $item->latestStatus ? $item->latestStatus->created_at->format('Y-m-d H:i:s') : 'N/A',
        ];
    }
}