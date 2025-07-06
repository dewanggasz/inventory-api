<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'item_id',
        'action'
    ];

    /**
     * Get the user that owns the Log
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the item that owns the Log
     */
    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
