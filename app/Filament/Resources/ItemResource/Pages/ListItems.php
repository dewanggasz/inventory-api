<?php

namespace App\Filament\Resources\ItemResource\Pages;

use App\Filament\Resources\ItemResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListItems extends ListRecords
{
    protected static string $resource = ItemResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),

            Actions\Action::make('export_excel')
                ->label('Export ke Excel')
                ->icon('heroicon-o-document-arrow-down')
                ->color('success')
                ->url(route('items.export.excel'))
                ->openUrlInNewTab(),

            // -- TOMBOL AKSI BARU --
            Actions\Action::make('print_all_barcodes')
                ->label('Cetak Semua Barcode')
                ->icon('heroicon-o-qr-code')
                ->color('info')
                ->url(route('items.print-all-barcodes'))
                ->openUrlInNewTab(),
        ];
    }
}
