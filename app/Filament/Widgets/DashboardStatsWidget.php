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
    protected static ?int $sort = 2;
    protected int | string | array $columnSpan = 6;
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
            // PERBAIKAN: Angka utama sekarang adalah total barang dengan status terakhir ini
            $total = Item::whereHas('latestStatus', fn($q) => $q->where('status', $status))->count();

            // Angka kecil di deskripsi adalah jumlah perubahan di periode ini
            $change = Status::where('status', $status)
                            ->whereYear('created_at', $year)
                            ->whereMonth('created_at', $month)
                            ->count();

            return ['total' => $total, 'change' => $change];
        };

        $baikData = $getStatData('Baik');
        $rusakData = $getStatData('Rusak');
        $perbaikanData = $getStatData('Perbaikan');
        $hilangData = $getStatData('Hilang');

        return [
            // PERBAIKAN: Angka utama sekarang adalah $data['total']
            Stat::make('Total Barang Baik', $baikData['total'])
                ->description($baikData['change'] . ' perubahan di periode ini')
                ->descriptionIcon($baikData['change'] > 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-minus')
                ->color('success'),

            Stat::make('Total Barang Rusak', $rusakData['total'])
                ->description($rusakData['change'] . ' perubahan di periode ini')
                ->descriptionIcon($rusakData['change'] > 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-minus')
                ->color('warning'),

            Stat::make('Total Dalam Perbaikan', $perbaikanData['total'])
                ->description($perbaikanData['change'] . ' perubahan di periode ini')
                ->descriptionIcon($perbaikanData['change'] > 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-minus')
                ->color('info'),

            Stat::make('Total Barang Hilang', $hilangData['total'])
                ->description($hilangData['change'] . ' perubahan di periode ini')
                ->descriptionIcon($hilangData['change'] > 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-minus')
                ->color('danger'),
        ];
    }
}
