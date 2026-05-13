<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Exercise;
use App\Models\ExerciseCategory;

class ExerciseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $chest = ExerciseCategory::where('name', 'Chest')->first();
        $legs = ExerciseCategory::where('name', 'Legs')->first();

        Exercise::create([
            'exercise_category_id' => $chest->id,
            'name' => 'Bench Press',
            'muscle_group' => 'Chest',
            'equipment' => 'Barbell',
            'instructions' => 'Lower the bar to your chest and press upward.',
        ]);

        Exercise::create([
            'exercise_category_id' => $chest->id,
            'name' => 'Push-Up',
            'muscle_group' => 'Chest',
            'equipment' => 'Bodyweight',
            'instructions' => 'Lower body to floor and push back up.',
        ]);

        Exercise::create([
            'exercise_category_id' => $legs->id,
            'name' => 'Barbell Squat',
            'muscle_group' => 'Legs',
            'equipment' => 'Barbell',
            'instructions' => 'Squat down until thighs are parallel and stand back up.',
        ]);

        Exercise::create([
            'exercise_category_id' => $legs->id,
            'name' => 'Lunges',
            'muscle_group' => 'Legs',
            'equipment' => 'Dumbbells',
            'instructions' => 'Step forward and lower into a lunge position.',
        ]);
    }
}
