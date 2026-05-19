<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            ExerciseCategorySeeder::class, // Must run first — exercises depend on categories
            ExerciseSeeder::class,          // Must run before plans/logs
            DemoUserSeeder::class,          // Creates demo + admin users
            WorkoutPlanSeeder::class,       // Creates demo workout plans
            WorkoutLogSeeder::class,        // Creates demo workout history
        ]);
    }
}
