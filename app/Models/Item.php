<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'barcode_path',
        'category_id',
        'location_id'
    ];

    /**
     * Get the category that owns the Item
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the location that owns the Item
     */
    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    /**
     * Get all of the statuses for the Item
     */
    public function statuses()
    {
        return $this->hasMany(Status::class)->latest(); // Tampilkan riwayat terbaru dulu
    }

    /**
     * Get the item's most recent status.
     */
    public function latestStatus()
    {
        return $this->hasOne(Status::class)->latestOfMany();
    }

    /**
     * Get all of the logs for the Item
     */
    public function logs()
    {
        return $this->hasMany(Log::class);
    }
}
