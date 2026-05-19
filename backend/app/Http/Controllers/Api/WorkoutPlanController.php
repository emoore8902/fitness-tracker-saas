<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkoutPlan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkoutPlanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $plans = WorkoutPlan::where('user_id', $request->user()->id)
            ->with('exercises.exercise')
            ->get();

        return response()->json($plans);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'                          => ['required', 'string', 'max:255'],
            'description'                   => ['nullable', 'string'],
            'goal'                          => ['nullable', 'string', 'max:100'],
            'days_per_week'                 => ['nullable', 'integer', 'min:1', 'max:7'],
            'exercises'                     => ['nullable', 'array'],
            'exercises.*.exercise_id'       => ['required', 'exists:exercises,id'],
            'exercises.*.day_of_week'       => ['nullable', 'string', 'max:20'],
            'exercises.*.sets'              => ['nullable', 'integer', 'min:1'],
            'exercises.*.reps'              => ['nullable', 'integer', 'min:1'],
            'exercises.*.target_weight'     => ['nullable', 'numeric', 'min:0'],
            'exercises.*.sort_order'        => ['nullable', 'integer', 'min:0'],
        ]);

        $plan = WorkoutPlan::create([
            'user_id'      => $request->user()->id,
            'name'         => $validated['name'],
            'description'  => $validated['description'] ?? null,
            'goal'         => $validated['goal'] ?? null,
            'days_per_week' => $validated['days_per_week'] ?? null,
        ]);

        if (!empty($validated['exercises'])) {
            $rows = array_map(function ($ex, $index) {
                return [
                    'exercise_id'   => $ex['exercise_id'],
                    'day_of_week'   => $ex['day_of_week'] ?? null,
                    'sets'          => $ex['sets'] ?? null,
                    'reps'          => $ex['reps'] ?? null,
                    'target_weight' => $ex['target_weight'] ?? null,
                    'sort_order'    => $ex['sort_order'] ?? $index,
                ];
            }, $validated['exercises'], array_keys($validated['exercises']));

            $plan->exercises()->createMany($rows);
        }

        return response()->json($plan->load('exercises.exercise'), 201);
    }

    public function show(Request $request, WorkoutPlan $workoutPlan): JsonResponse
    {
        if ($workoutPlan->user_id !== $request->user()->id) {
            abort(403, 'You do not have permission to view this workout plan.');
        }

        return response()->json($workoutPlan->load('exercises.exercise'));
    }

    public function update(Request $request, WorkoutPlan $workoutPlan): JsonResponse
    {
        if ($workoutPlan->user_id !== $request->user()->id) {
            abort(403, 'You do not have permission to update this workout plan.');
        }

        $validated = $request->validate([
            'name'                          => ['sometimes', 'string', 'max:255'],
            'description'                   => ['nullable', 'string'],
            'goal'                          => ['nullable', 'string', 'max:100'],
            'days_per_week'                 => ['nullable', 'integer', 'min:1', 'max:7'],
            'exercises'                     => ['nullable', 'array'],
            'exercises.*.exercise_id'       => ['required', 'exists:exercises,id'],
            'exercises.*.day_of_week'       => ['nullable', 'string', 'max:20'],
            'exercises.*.sets'              => ['nullable', 'integer', 'min:1'],
            'exercises.*.reps'              => ['nullable', 'integer', 'min:1'],
            'exercises.*.target_weight'     => ['nullable', 'numeric', 'min:0'],
            'exercises.*.sort_order'        => ['nullable', 'integer', 'min:0'],
        ]);

        $workoutPlan->update([
            'name'          => $validated['name'] ?? $workoutPlan->name,
            'description'   => array_key_exists('description', $validated) ? $validated['description'] : $workoutPlan->description,
            'goal'          => array_key_exists('goal', $validated) ? $validated['goal'] : $workoutPlan->goal,
            'days_per_week' => array_key_exists('days_per_week', $validated) ? $validated['days_per_week'] : $workoutPlan->days_per_week,
        ]);

        // If exercises key is present (even as empty array), sync completely
        if (array_key_exists('exercises', $validated)) {
            $workoutPlan->exercises()->delete();

            if (!empty($validated['exercises'])) {
                $rows = array_map(function ($ex, $index) {
                    return [
                        'exercise_id'   => $ex['exercise_id'],
                        'day_of_week'   => $ex['day_of_week'] ?? null,
                        'sets'          => $ex['sets'] ?? null,
                        'reps'          => $ex['reps'] ?? null,
                        'target_weight' => $ex['target_weight'] ?? null,
                        'sort_order'    => $ex['sort_order'] ?? $index,
                    ];
                }, $validated['exercises'], array_keys($validated['exercises']));

                $workoutPlan->exercises()->createMany($rows);
            }
        }

        return response()->json($workoutPlan->load('exercises.exercise'));
    }

    public function destroy(Request $request, WorkoutPlan $workoutPlan): JsonResponse
    {
        if ($workoutPlan->user_id !== $request->user()->id) {
            abort(403, 'You do not have permission to delete this workout plan.');
        }

        // Cascade delete on workout_plan_exercises is handled by the database FK constraint
        $workoutPlan->delete();

        return response()->json(['message' => 'Workout plan deleted.']);
    }
}
