<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create demo accounts
        User::factory()->teacher()->create([
            'name' => 'John Teacher',
            'email' => 'teacher@example.com',
        ]);

        User::factory()->student()->create([
            'name' => 'Jane Student',
            'email' => 'student@example.com',
        ]);

        // Seed attendance data
        $this->call([
            AttendanceSeeder::class,
        ]);
    }
}
