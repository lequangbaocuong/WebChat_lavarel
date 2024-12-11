<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create multiple users using the factory
        User::factory(10)->create();

        // Create a specific test user
        User::factory()->create([
            'username' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'), // or use Hash::make('password')
            'role_id' => 1, // Assuming 1 is the ID for Admin role
        ]);
    }
}