<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ExerciseCategory;

class ExerciseCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ExerciseCategory::create([
            'name' => 'Chest',
        ]);

        ExerciseCategory::create([
            'name' => 'Legs',
        ]);
    }
}
