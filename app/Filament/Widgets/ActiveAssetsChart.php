<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;
use App\Models\Item;
use App\Models\Status;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ActiveAssetsChart extends ChartWidget
{
    protected static ?string $heading = 'Pertumbuhan Aset Aktif (Total Barang - Barang Hilang)';
    protected static ?string $maxHeight = '300px';
    protected static ?int $sort = 3;
    protected int | string | array $columnSpan = 6;


    protected function getData(): array
    {
        // 1. Ambil jumlah item BARU per bulan
        $newItemsPerMonth = Item::select(
            DB::raw('YEAR(created_at) as year'),
            DB::raw('MONTH(created_at) as month'),
            DB::raw('count(*) as count')
        )
        ->where('created_at', '>=', now()->subMonths(11)->startOfMonth())
        ->groupBy('year', 'month')
        ->get()
        ->keyBy(fn ($item) => Carbon::create($item->year, $item->month)->format('Y-m'));

        // 2. Ambil jumlah item yang BARU ditandai "Hilang" per bulan
        $lostItemsPerMonth = Status::where('status', 'Hilang')
            ->select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('count(DISTINCT item_id) as count') // Hitung item unik
            )
            ->where('created_at', '>=', now()->subMonths(11)->startOfMonth())
            ->groupBy('year', 'month')
            ->get()
            ->keyBy(fn ($item) => Carbon::create($item->year, $item->month)->format('Y-m'));

        // 3. Hitung kondisi awal sebelum periode 12 bulan ini
        $initialTotalItems = Item::where('created_at', '<', now()->subMonths(11)->startOfMonth())->count();
        $initialLostItems = Status::where('status', 'Hilang')
                                ->where('created_at', '<', now()->subMonths(11)->startOfMonth())
                                ->distinct('item_id')
                                ->count();
        $initialActiveItems = $initialTotalItems - $initialLostItems;

        // 4. Siapkan label dan array data
        $labels = [];
        $cumulativeData = [];
        $currentTotal = $initialActiveItems;

        // 5. Loop selama 12 bulan terakhir untuk membangun data kumulatif aset aktif
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthKey = $date->format('Y-m');
            $labels[] = $date->format('M Y');

            // Tambahkan item baru dari bulan ini
            $currentTotal += $newItemsPerMonth[$monthKey]->count ?? 0;
            // Kurangi item yang hilang di bulan ini
            $currentTotal -= $lostItemsPerMonth[$monthKey]->count ?? 0;

            $cumulativeData[] = $currentTotal;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Total Aset Aktif',
                    'data' => $cumulativeData,
                    'backgroundColor' => 'rgba(59, 130, 246, 0.5)',
                    'borderColor' => 'rgb(59, 130, 246)',
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
