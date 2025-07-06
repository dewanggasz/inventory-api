<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::create(['name' => 'Elektronik']);
        Category::create(['name' => 'Perabotan Kantor']);
        Category::create(['name' => 'Alat Tulis Kantor (ATK)']);
        Category::create(['name' => 'Aset Lainnya']);
    }
}