<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use App\Models\Item;
use App\Models\Category;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        // Logika untuk menghitung jumlah barang dengan status terakhir 'Rusak'
        $jumlahBarangRusak = Item::whereHas('latestStatus', function ($query) {
            $query->where('status', 'Rusak');
        })->count();

         $getTotalByStatus = function (string $status) {
            return Item::whereHas('latestStatus', fn($q) => $q->where('status', $status))->count();
        };

        return [
            // Kartu 1: Total Barang
            Stat::make('Total Barang', Item::count())
                ->description('Jumlah semua item yang terdaftar')
                ->descriptionIcon('heroicon-m-archive-box')
                ->color('success'),

            // Kartu 2: Total Kategori
            Stat::make('Total Kategori', Category::count())
                ->description('Jumlah semua kategori barang')
                ->descriptionIcon('heroicon-m-tag')
                ->color('info'),

            // Kartu 3: Jumlah Barang Rusak
            Stat::make('Barang Baik', $getTotalByStatus('Baik'))
                ->description('Total barang dengan status "Baik"')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),

            Stat::make('Barang Rusak', $getTotalByStatus('Rusak'))
                ->description('Total barang dengan status "Rusak"')
                ->descriptionIcon('heroicon-m-exclamation-triangle')
                ->color('warning'),

            Stat::make('Dalam Perbaikan', $getTotalByStatus('Perbaikan'))
                ->description('Total barang dengan status "Perbaikan"')
                ->descriptionIcon('heroicon-m-wrench-screwdriver')
                ->color('info'),

            Stat::make('Barang Hilang', $getTotalByStatus('Hilang'))
                ->description('Total barang dengan status "Hilang"')
                ->descriptionIcon('heroicon-m-x-circle')
                ->color('danger'),
        ];
    }
}