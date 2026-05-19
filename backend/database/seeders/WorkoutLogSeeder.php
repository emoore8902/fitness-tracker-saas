<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Exercise;
use App\Models\WorkoutPlan;
use App\Models\WorkoutLog;
use Illuminate\Support\Carbon;

class WorkoutLogSeeder extends Seeder
{
    public function run(): void
    {
        $demo = User::where('email', 'demo@example.com')->first();
        if (!$demo) return;

        $plan = WorkoutPlan::where('user_id', $demo->id)
            ->where('name', 'Push / Pull / Legs')
            ->first();

        // Helper: find exercise ID by name
        $ex = fn(string $name) => Exercise::where('name', $name)->value('id');

        $sessions = [
            // Day offset from today, plan_id (null = free session), notes, exercises array
            [0, $plan?->id, 'Felt strong today. Hit a new PR on bench.', [
                [$ex('Bench Press'),    4, 10, 82.5],
                [$ex('Overhead Press'), 3, 10, 52.5],
                [$ex('Lateral Raise'),  3, 15, 12],
                [$ex('Cable Fly'),      3, 12, 20],
            ]],
            [2, $plan?->id, 'Back and biceps. Pull-ups felt solid.', [
                [$ex('Pull-Up'),       4, 8,  null],
                [$ex('Barbell Row'),   4, 10, 70],
                [$ex('Lat Pulldown'),  3, 12, 60],
                [$ex('Barbell Curl'),  3, 12, 30],
            ]],
            [4, $plan?->id, 'Leg day. Squats felt heavy but form was good.', [
                [$ex('Barbell Squat'),      4, 8,  102.5],
                [$ex('Romanian Deadlift'),  3, 10, 80],
                [$ex('Leg Press'),          3, 12, 140],
                [$ex('Calf Raise'),         4, 15, 60],
            ]],
            [7, $plan?->id, 'Push session. Kept rest times short.', [
                [$ex('Bench Press'),    4, 10, 80],
                [$ex('Incline Dumbbell Press'), 3, 12, 28],
                [$ex('Overhead Press'), 3, 10, 50],
                [$ex('Tricep Pushdown'), 3, 15, 35],
            ]],
            [9, $plan?->id, 'Pull session. Added face pulls for shoulder health.', [
                [$ex('Pull-Up'),        4, 8,  null],
                [$ex('Barbell Row'),    3, 10, 72.5],
                [$ex('Seated Cable Row'), 3, 12, 55],
                [$ex('Face Pull'),      3, 15, 20],
                [$ex('Hammer Curl'),    3, 12, 16],
            ]],
            [11, $plan?->id, 'Leg day again. Focused on depth.', [
                [$ex('Barbell Squat'),     4, 8,  100],
                [$ex('Walking Lunge'),     3, 12, 20],
                [$ex('Leg Curl'),          3, 12, 45],
                [$ex('Hanging Leg Raise'), 3, 15, null],
            ]],
            [13, null, 'Quick cardio and core session.', [
                [$ex('Running'),      null, null, null],
                [$ex('Plank'),        3,    null, null],
                [$ex('Crunch'),       3,    20,   null],
                [$ex('Russian Twist'), 3,   20,   null],
            ]],
            [14, null, 'Active recovery — stretching and light cardio.', [
                [$ex('Cycling'),             null, null, null],
                [$ex('Hip Flexor Stretch'),  3,    null, null],
                [$ex('Hamstring Stretch'),   3,    null, null],
                [$ex('Chest Opener Stretch'), 2,   null, null],
            ]],
        ];

        foreach ($sessions as $i => [$daysAgo, $planId, $notes, $exercises]) {
            $log = WorkoutLog::create([
                'user_id'         => $demo->id,
                'workout_plan_id' => $planId,
                'performed_at'    => Carbon::now()->subDays($daysAgo)->setTime(8 + $i, 0, 0),
                'notes'           => $notes,
            ]);

            $rows = [];
            foreach ($exercises as $j => [$exerciseId, $sets, $reps, $weight]) {
                if (!$exerciseId) continue;
                $rows[] = [
                    'exercise_id'      => $exerciseId,
                    'sets'             => $sets,
                    'reps'             => $reps,
                    'weight'           => $weight,
                    'duration_minutes' => null,
                    'notes'            => null,
                ];
            }

            if (!empty($rows)) {
                $log->exercises()->createMany($rows);
            }
        }
    }
}
