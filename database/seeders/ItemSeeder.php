<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Item;
use App\Models\Category;
use App\Models\Location;
use App\Models\User;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all();
        $locations = Location::all();
        $adminUser = User::where('role', 'admin')->first();

        if ($categories->isEmpty() || $locations->isEmpty() || !$adminUser) {
            $this->command->info('Tidak dapat menjalankan ItemSeeder. Pastikan User, Category, dan Location seeder sudah dijalankan.');
            return;
        }

        for ($i = 1; $i <= 20; $i++) {
            $item = Item::create([
                'name' => 'Barang Contoh ' . $i,
                'code' => 'ITEM-' . str_pad($i, 4, '0', STR_PAD_LEFT), // ITEM-0001
                'barcode_path' => (string) mt_rand(100000000000, 999999999999), // Barcode 12 digit acak
                'category_id' => $categories->random()->id,
                'location_id' => $locations->random()->id,
            ]);

            // Membuat status awal untuk setiap item
            $item->statuses()->create([
                'status' => 'Baik',
                'note' => 'Item baru ditambahkan ke sistem.',
                'user_id' => $adminUser->id,
            ]);
        }
    }
}
