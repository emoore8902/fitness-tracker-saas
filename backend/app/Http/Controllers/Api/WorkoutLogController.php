<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkoutLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkoutLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $logs = WorkoutLog::where('user_id', $request->user()->id)
            ->with(['plan:id,name', 'exercises.exercise'])
            ->latest('performed_at')
            ->get();

        return response()->json($logs);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'workout_plan_id'            => ['nullable', 'exists:workout_plans,id'],
            'performed_at'               => ['required', 'date'],
            'notes'                      => ['nullable', 'string'],
            'exercises'                  => ['nullable', 'array'],
            'exercises.*.exercise_id'    => ['required', 'exists:exercises,id'],
            'exercises.*.sets'           => ['nullable', 'integer', 'min:1'],
            'exercises.*.reps'           => ['nullable', 'integer', 'min:1'],
            'exercises.*.weight'         => ['nullable', 'numeric', 'min:0'],
            'exercises.*.duration_minutes' => ['nullable', 'integer', 'min:0'],
            'exercises.*.notes'          => ['nullable', 'string'],
        ]);

        $log = WorkoutLog::create([
            'user_id'         => $request->user()->id,
            'workout_plan_id' => $validated['workout_plan_id'] ?? null,
            'performed_at'    => $validated['performed_at'],
            'notes'           => $validated['notes'] ?? null,
        ]);

        if (!empty($validated['exercises'])) {
            $rows = array_map(fn ($ex) => [
                'exercise_id'      => $ex['exercise_id'],
                'sets'             => $ex['sets'] ?? null,
                'reps'             => $ex['reps'] ?? null,
                'weight'           => $ex['weight'] ?? null,
                'duration_minutes' => $ex['duration_minutes'] ?? null,
                'notes'            => $ex['notes'] ?? null,
            ], $validated['exercises']);

            $log->exercises()->createMany($rows);
        }

        return response()->json($log->load(['plan:id,name', 'exercises.exercise']), 201);
    }

    public function show(Request $request, WorkoutLog $workoutLog): JsonResponse
    {
        if ($workoutLog->user_id !== $request->user()->id) {
            abort(403, 'You do not have permission to view this workout log.');
        }

        return response()->json($workoutLog->load(['plan:id,name', 'exercises.exercise']));
    }

    public function update(Request $request, WorkoutLog $workoutLog): JsonResponse
    {
        if ($workoutLog->user_id !== $request->user()->id) {
            abort(403, 'You do not have permission to update this workout log.');
        }

        $validated = $request->validate([
            'workout_plan_id'            => ['nullable', 'exists:workout_plans,id'],
            'performed_at'               => ['sometimes', 'date'],
            'notes'                      => ['nullable', 'string'],
            'exercises'                  => ['nullable', 'array'],
            'exercises.*.exercise_id'    => ['required', 'exists:exercises,id'],
            'exercises.*.sets'           => ['nullable', 'integer', 'min:1'],
            'exercises.*.reps'           => ['nullable', 'integer', 'min:1'],
            'exercises.*.weight'         => ['nullable', 'numeric', 'min:0'],
            'exercises.*.duration_minutes' => ['nullable', 'integer', 'min:0'],
            'exercises.*.notes'          => ['nullable', 'string'],
        ]);

        $workoutLog->update([
            'workout_plan_id' => array_key_exists('workout_plan_id', $validated)
                ? $validated['workout_plan_id']
                : $workoutLog->workout_plan_id,
            'performed_at'    => $validated['performed_at'] ?? $workoutLog->performed_at,
            'notes'           => array_key_exists('notes', $validated)
                ? $validated['notes']
                : $workoutLog->notes,
        ]);

        // If exercises key present (even as []), sync completely
        if (array_key_exists('exercises', $validated)) {
            $workoutLog->exercises()->delete();

            if (!empty($validated['exercises'])) {
                $rows = array_map(fn ($ex) => [
                    'exercise_id'      => $ex['exercise_id'],
                    'sets'             => $ex['sets'] ?? null,
                    'reps'             => $ex['reps'] ?? null,
                    'weight'           => $ex['weight'] ?? null,
                    'duration_minutes' => $ex['duration_minutes'] ?? null,
                    'notes'            => $ex['notes'] ?? null,
                ], $validated['exercises']);

                $workoutLog->exercises()->createMany($rows);
            }
        }

        return response()->json($workoutLog->load(['plan:id,name', 'exercises.exercise']));
    }

    public function destroy(Request $request, WorkoutLog $workoutLog): JsonResponse
    {
        if ($workoutLog->user_id !== $request->user()->id) {
            abort(403, 'You do not have permission to delete this workout log.');
        }

        // Cascade delete on workout_log_exercises is handled by the database FK constraint
        $workoutLog->delete();

        return response()->json(['message' => 'Workout log deleted.']);
    }
}
