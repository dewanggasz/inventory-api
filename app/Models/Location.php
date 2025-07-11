<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    /**
     * Get all of the items for the Location
     */
    public function items()
    {
        return $this->hasMany(Item::class);
    }
}