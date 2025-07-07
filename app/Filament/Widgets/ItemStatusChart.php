<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;
use App\Models\Status;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ItemStatusChart extends ChartWidget
{
    protected static ?string $heading = 'Tren Perubahan Status Barang (12 Bulan Terakhir)';
    protected static ?string $maxHeight = '300px';
    protected static ?int $sort = 4;
    protected int | string | array $columnSpan = 6;

    protected function getData(): array
    {
        // 1. Ambil data jumlah perubahan status, dikelompokkan per tahun, bulan, dan status
        $data = Status::select(
            DB::raw('YEAR(created_at) as year'),
            DB::raw('MONTH(created_at) as month'),
            'status',
            DB::raw('count(*) as count')
        )
        ->where('created_at', '>=', now()->subYear())
        ->groupBy('year', 'month', 'status')
        ->orderBy('year', 'asc')
        ->orderBy('month', 'asc')
        ->get();

        // 2. Siapkan label dan array dataset
        $labels = [];
        $datasets = [
            'Baik' => array_fill(0, 12, 0),
            'Rusak' => array_fill(0, 12, 0),
            'Perbaikan' => array_fill(0, 12, 0),
            'Hilang' => array_fill(0, 12, 0),
        ];

        // 3. Buat label untuk 12 bulan terakhir (dari 11 bulan lalu hingga bulan ini)
        for ($i = 11; $i >= 0; $i--) {
            $labels[] = now()->subMonths($i)->format('M Y');
        }

        // 4. Isi dataset dengan data dari database
        foreach ($data as $record) {
            // Hitung indeks bulan yang benar untuk ditempatkan di array
            $monthIndex = (now()->diffInMonths(Carbon::create($record->year, $record->month))) % 12;
            $correctIndex = 11 - $monthIndex;

            if (isset($datasets[$record->status][$correctIndex])) {
                $datasets[$record->status][$correctIndex] = $record->count;
            }
        }

        // 5. Kembalikan data dalam format yang dibutuhkan oleh ChartWidget
        return [
            'datasets' => [
                [
                    'label' => 'Baik',
                    'data' => array_values($datasets['Baik']),
                    'borderColor' => 'rgb(34, 197, 94)',
                    'backgroundColor' => 'rgba(34, 197, 94, 0.2)',
                ],
                [
                    'label' => 'Rusak',
                    'data' => array_values($datasets['Rusak']),
                    'borderColor' => 'rgb(234, 179, 8)',
                    'backgroundColor' => 'rgba(234, 179, 8, 0.2)',
                ],
                [
                    'label' => 'Perbaikan',
                    'data' => array_values($datasets['Perbaikan']),
                    'borderColor' => 'rgb(59, 130, 246)',
                    'backgroundColor' => 'rgba(59, 130, 246, 0.2)',
                ],
                [
                    'label' => 'Hilang',
                    'data' => array_values($datasets['Hilang']),
                    'borderColor' => 'rgb(239, 68, 68)',
                    'backgroundColor' => 'rgba(239, 68, 68, 0.2)',
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        // Mengembalikan jenis diagram menjadi diagram garis
        return 'line';
    }
}
