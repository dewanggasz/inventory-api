<?php

namespace App\Filament\Widgets;

use Filament\Widgets\Widget;
use Filament\Forms\Components\Select;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Components\Grid;
use Carbon\Carbon;

class DashboardFiltersWidget extends Widget implements HasForms
{
    use InteractsWithForms;
    protected static ?int $sort = 1;
    protected int | string | array $columnSpan = 6;
    protected static string $view = 'filament.widgets.dashboard-filters-widget';

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill([
            'year' => now()->year,
            'month' => now()->month,
        ]);
    }

    public function form(\Filament\Forms\Form $form): \Filament\Forms\Form
    {
        return $form
            ->statePath('data')
            ->schema([
                // PERBAIKAN: Gunakan Grid untuk menata filter secara horizontal
                Grid::make()->schema([
                    Select::make('year')
                        ->label('Tahun')
                        ->options(collect(range(0, 4))->mapWithKeys(fn($i) => [now()->subYears($i)->year => now()->subYears($i)->year]))
                        ->live()
                        ->afterStateUpdated(fn () => $this->dispatch('updateStatsWidget', filters: $this->form->getState())),
                    Select::make('month')
                        ->label('Bulan')
                        ->options(collect(range(1, 12))->mapWithKeys(fn($m) => [$m => Carbon::create()->month($m)->format('F')]))
                        ->live()
                        ->afterStateUpdated(fn () => $this->dispatch('updateStatsWidget', filters: $this->form->getState())),
                ])->columns(2), // Atur agar grid memiliki 2 kolom
            ]);
    }
}