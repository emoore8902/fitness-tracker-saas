<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkoutLog;
use Illuminate\Http\Request;

class WorkoutLogController extends Controller
{
    public function index(Request $request)
    {
        // TODO: Paginate; support date-range filtering; eager-load log exercises
        $logs = WorkoutLog::where('user_id', $request->user()->id)
            ->latest('performed_at')
            ->get();

        return response()->json($logs);
    }

    public function store(Request $request)
    {
        // TODO: Accept and persist individual exercise sets/reps/weight as WorkoutLogExercise records
        $validated = $request->validate([
            'workout_plan_id' => ['nullable', 'exists:workout_plans,id'],
            'performed_at'    => ['required', 'date'],
            'notes'           => ['nullable', 'string'],
        ]);

        $log = WorkoutLog::create([...$validated, 'user_id' => $request->user()->id]);

        return response()->json($log, 201);
    }
}
