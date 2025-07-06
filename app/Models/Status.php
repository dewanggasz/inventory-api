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
        'note'
    ];

    /**
     * Get the item that owns the Status
     */
    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    /**
     * Get the user that owns the Status
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}