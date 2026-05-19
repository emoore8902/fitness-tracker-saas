<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Exercise;
use App\Models\WorkoutPlan;

class WorkoutPlanSeeder extends Seeder
{
    public function run(): void
    {
        $demo = User::where('email', 'demo@example.com')->first();
        if (!$demo) return;

        // Helper: find exercise ID by name
        $ex = fn(string $name) => Exercise::where('name', $name)->value('id');

        // ── Plan 1: Push / Pull / Legs ──────────────────────────────────────────
        $ppl = WorkoutPlan::create([
            'user_id'      => $demo->id,
            'name'         => 'Push / Pull / Legs',
            'description'  => 'A classic 6-day split targeting each muscle group twice per week.',
            'goal'         => 'Hypertrophy',
            'days_per_week' => 6,
        ]);

        $ppl->exercises()->createMany([
            ['exercise_id' => $ex('Bench Press'),    'day_of_week' => 'Mon', 'sets' => 4, 'reps' => 10, 'target_weight' => 80,  'sort_order' => 0],
            ['exercise_id' => $ex('Overhead Press'), 'day_of_week' => 'Mon', 'sets' => 3, 'reps' => 10, 'target_weight' => 50,  'sort_order' => 1],
            ['exercise_id' => $ex('Lateral Raise'),  'day_of_week' => 'Mon', 'sets' => 3, 'reps' => 15, 'target_weight' => 12,  'sort_order' => 2],
            ['exercise_id' => $ex('Pull-Up'),        'day_of_week' => 'Tue', 'sets' => 4, 'reps' => 8,  'target_weight' => null, 'sort_order' => 0],
            ['exercise_id' => $ex('Barbell Row'),    'day_of_week' => 'Tue', 'sets' => 4, 'reps' => 10, 'target_weight' => 70,  'sort_order' => 1],
            ['exercise_id' => $ex('Barbell Squat'),  'day_of_week' => 'Wed', 'sets' => 4, 'reps' => 8,  'target_weight' => 100, 'sort_order' => 0],
            ['exercise_id' => $ex('Romanian Deadlift'), 'day_of_week' => 'Wed', 'sets' => 3, 'reps' => 10, 'target_weight' => 80, 'sort_order' => 1],
            ['exercise_id' => $ex('Leg Press'),      'day_of_week' => 'Wed', 'sets' => 3, 'reps' => 12, 'target_weight' => 140, 'sort_order' => 2],
        ]);

        // ── Plan 2: Full Body Starter ────────────────────────────────────────────
        $fullBody = WorkoutPlan::create([
            'user_id'      => $demo->id,
            'name'         => 'Full Body Starter',
            'description'  => 'A beginner-friendly 3-day full body program focusing on compound lifts.',
            'goal'         => 'Strength',
            'days_per_week' => 3,
        ]);

        $fullBody->exercises()->createMany([
            ['exercise_id' => $ex('Barbell Squat'),  'day_of_week' => 'Mon', 'sets' => 3, 'reps' => 5,  'target_weight' => 60,  'sort_order' => 0],
            ['exercise_id' => $ex('Bench Press'),    'day_of_week' => 'Mon', 'sets' => 3, 'reps' => 5,  'target_weight' => 60,  'sort_order' => 1],
            ['exercise_id' => $ex('Deadlift'),       'day_of_week' => 'Mon', 'sets' => 1, 'reps' => 5,  'target_weight' => 80,  'sort_order' => 2],
            ['exercise_id' => $ex('Barbell Squat'),  'day_of_week' => 'Wed', 'sets' => 3, 'reps' => 5,  'target_weight' => 62,  'sort_order' => 0],
            ['exercise_id' => $ex('Overhead Press'), 'day_of_week' => 'Wed', 'sets' => 3, 'reps' => 5,  'target_weight' => 40,  'sort_order' => 1],
            ['exercise_id' => $ex('Barbell Row'),    'day_of_week' => 'Wed', 'sets' => 3, 'reps' => 5,  'target_weight' => 50,  'sort_order' => 2],
            ['exercise_id' => $ex('Barbell Squat'),  'day_of_week' => 'Fri', 'sets' => 3, 'reps' => 5,  'target_weight' => 64,  'sort_order' => 0],
            ['exercise_id' => $ex('Bench Press'),    'day_of_week' => 'Fri', 'sets' => 3, 'reps' => 5,  'target_weight' => 62,  'sort_order' => 1],
            ['exercise_id' => $ex('Deadlift'),       'day_of_week' => 'Fri', 'sets' => 1, 'reps' => 5,  'target_weight' => 82,  'sort_order' => 2],
        ]);
    }
}
