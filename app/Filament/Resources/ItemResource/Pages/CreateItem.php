<?php

namespace App\Filament\Resources\ItemResource\Pages;

use App\Filament\Resources\ItemResource;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class CreateItem extends CreateRecord
{
    protected static string $resource = ItemResource::class;

    protected function handleRecordCreation(array $data): Model
    {
        // 1. Pisahkan data untuk Item dan Status
        $itemData = collect($data)->except(['status', 'note'])->toArray();
        $statusData = collect($data)->only(['status', 'note'])->toArray();

        // 2. Buat record Item terlebih dahulu
        $item = static::getModel()::create($itemData);

        // 3. Buat record Status awal yang terhubung dengan Item baru
        if (!empty($statusData['status'])) {
            $item->statuses()->create([
                'status' => $statusData['status'],
                'note' => $statusData['note'] ?? null,
                'user_id' => Auth::id(), // Ambil ID user admin yang sedang login
            ]);
        }

        return $item;
    }
}