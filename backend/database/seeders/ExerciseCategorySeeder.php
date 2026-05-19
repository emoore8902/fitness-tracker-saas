<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ExerciseCategory;

class ExerciseCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Chest',
            'Back',
            'Legs',
            'Shoulders',
            'Arms',
            'Core',
            'Cardio',
            'Flexibility',
        ];

        foreach ($categories as $name) {
            ExerciseCategory::firstOrCreate(['name' => $name]);
        }
    }
}
