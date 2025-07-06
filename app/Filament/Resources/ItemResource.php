<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ItemResource\Pages;
use App\Models\Item;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ItemResource extends Resource
{
    protected static ?string $model = Item::class;
    protected static ?string $navigationIcon = 'heroicon-o-archive-box';
    protected static ?string $navigationGroup = 'Manajemen Barang';

   public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),

                // Field Kode dan Barcode sekarang otomatis dan tidak bisa diisi manual
                Forms\Components\TextInput::make('code')
                    ->label('Kode Unik')
                    ->disabled()
                    ->dehydrated() // Memastikan field tetap dikirim saat create
                    ->maxLength(255)
                    ->unique(ignoreRecord: true),

                Forms\Components\TextInput::make('barcode_path')
                    ->label('Barcode')
                    ->disabled()
                    ->dehydrated()
                    ->maxLength(255)
                    ->unique(ignoreRecord: true),

                Forms\Components\Select::make('category_id')
                    ->relationship('category', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),

                Forms\Components\Select::make('location_id')
                    ->relationship('location', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),

                // -- Field Baru untuk Status Awal --
                Forms\Components\Select::make('status')
                    ->label('Status Awal')
                    ->options([
                        'Baik' => 'Baik',
                        'Rusak' => 'Rusak',
                        'Perbaikan' => 'Perbaikan',
                        'Hilang' => 'Hilang',
                    ])
                    ->required()
                    ->default('Baik')
                    ->live() // Agar form bereaksi terhadap perubahan
                    ->visibleOn('create'), // Hanya muncul di halaman create

                Forms\Components\Textarea::make('note')
                    ->label('Catatan Awal')
                    ->placeholder('Contoh: Barang baru diterima dari supplier.')
                    ->visible(fn ($get) => $get('status') !== 'Baik') // Muncul jika status bukan 'Baik'
                    ->required(fn ($get) => $get('status') !== 'Baik') // Wajib diisi jika status bukan 'Baik'
                    ->visibleOn('create'),
            ]);
    }


    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('code')
                    ->label('Kode Unik')
                    ->searchable(),
                Tables\Columns\TextColumn::make('category.name')
                    ->sortable(),
                Tables\Columns\TextColumn::make('location.name')
                    ->sortable(),
                Tables\Columns\TextColumn::make('latestStatus.status')
                    ->label('Status Terakhir')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Baik' => 'success',
                        'Rusak' => 'warning',
                        'Hilang' => 'danger',
                        'Perbaikan' => 'info',
                        default => 'gray',
                    }),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('print_barcode')
                ->label('Cetak PDF') // <-- Ubah label
                ->icon('heroicon-o-printer')
                ->url(fn (Item $record): string => route('items.print-barcode', $record))
                ->openUrlInNewTab(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListItems::route('/'),
            'create' => Pages\CreateItem::route('/create'),
            'edit' => Pages\EditItem::route('/{record}/edit'),
        ];
    }
}