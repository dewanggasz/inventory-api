<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Location;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Location::create(['name' => 'Gudang Utama']);
        Location::create(['name' => 'Lantai 1 - Ruang A']);
        Location::create(['name' => 'Lantai 2 - Ruang B']);
        Location::create(['name' => 'Ruang Server']);
    }
}