<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // User Admin
        User::create([
            'name' => 'Admin',
            'email' => 'admin@inventory.com',
            'password' => Hash::make('password'), // password: password
            'role' => 'admin',
        ]);

        // User Biasa
        User::create([
            'name' => 'John Doe',
            'email' => 'user@inventory.com',
            'password' => Hash::make('password'), // password: password
            'role' => 'user',
        ]);
    }
}