<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'status',
        'user_id',
        'note',
        'photo_path',
        'location_id' // <-- Tambahkan ini
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // --- TAMBAHKAN RELASI BARU INI ---
    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}
