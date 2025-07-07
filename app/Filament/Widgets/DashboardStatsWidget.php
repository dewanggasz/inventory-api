<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use App\Models\Item;
use App\Models\Status;
use Livewire\Attributes\On;
use Carbon\Carbon;

class DashboardStatsWidget extends BaseWidget
{
    public ?string $year = null;
    public ?string $month = null;

    public function mount(): void
    {
        $this->year = now()->year;
        $this->month = now()->month;
    }

    #[On('updateStatsWidget')]
    public function updateStats($filters): void
    {
        $this->year = $filters['year'];
        $this->month = $filters['month'];
    }

    protected function getStats(): array
    {
        $year = $this->year;
        $month = $this->month;

        $getStatData = function (string $status) use ($year, $month) {
            $total = Item::whereHas('latestStatus', fn($q) => $q->where('status', $status))->count();
            $change = Status::where('status', $status)
                            ->whereYear('created_at', $year)
                            ->whereMonth('created_at', $month)
                            ->count();
            return ['total' => $total, 'change' => $change];
        };

        // Hitung setiap status secara terpisah
        $baikData = $getStatData('Baik');
        $dipinjamData = $getStatData('Dipinjam');
        $rusakData = $getStatData('Rusak');
        $perbaikanData = $getStatData('Perbaikan');
        $hilangData = $getStatData('Hilang');
        $rusakTotalData = $getStatData('Rusak Total');

        // Gabungkan "Baik" dan "Dipinjam" untuk Aset Baik
        $totalAsetBaik = $baikData['total'] + $dipinjamData['total'];
        $perubahanAsetBaik = $baikData['change'] + $dipinjamData['change'];

        return [
            Stat::make('Total Aset Baik', $totalAsetBaik)
                ->description($baikData['total'] . ' tersedia, ' . $dipinjamData['total'] . ' dipinjam')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),

            Stat::make('Total Barang Rusak', $rusakData['total'])
                ->description($rusakData['change'] . ' perubahan di periode ini')
                ->descriptionIcon('heroicon-m-exclamation-triangle')
                ->color('warning'),

            Stat::make('Total Dalam Perbaikan', $perbaikanData['total'])
                ->description($perbaikanData['change'] . ' perubahan di periode ini')
                ->descriptionIcon('heroicon-m-wrench-screwdriver')
                ->color('info'),

            Stat::make('Total Rusak Total', $rusakTotalData['total'])
                ->description($rusakTotalData['change'] . ' perubahan di periode ini')
                ->descriptionIcon('heroicon-m-archive-box-x-mark')
                ->color('danger'),

            Stat::make('Total Barang Hilang', $hilangData['total'])
                ->description($hilangData['change'] . ' perubahan di periode ini')
                ->descriptionIcon('heroicon-m-x-circle')
                ->color('danger'),
        ];
    }
}
