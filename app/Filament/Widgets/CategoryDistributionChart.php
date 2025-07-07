<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;
use App\Models\Category;

class CategoryDistributionChart extends ChartWidget
{
    protected static ?string $heading = 'Distribusi Barang per Kategori';
    protected static ?string $maxHeight = '300px';
    protected static ?int $sort = 5;
    protected int | string | array $columnSpan = 6;

    protected function getData(): array
    {
        // 1. Ambil semua kategori dengan jumlah item di dalamnya
        $categories = Category::withCount('items')->get();

        // 2. Siapkan array untuk label dan data
        $labels = $categories->pluck('name');
        $data = $categories->pluck('items_count');

        // 3. Siapkan palet warna yang menarik
        $colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#C9CBCF', '#7BC225'
        ];

        return [
            'datasets' => [
                [
                    'label' => 'Jumlah Barang',
                    'data' => $data,
                    'backgroundColor' => $colors,
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }
}
