<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkoutPlan;
use Illuminate\Http\Request;

class WorkoutPlanController extends Controller
{
    public function index(Request $request)
    {
        // TODO: Paginate; eager-load exercises
        $plans = WorkoutPlan::where('user_id', $request->user()->id)->get();
        return response()->json($plans);
    }

    public function store(Request $request)
    {
        // TODO: Optionally accept an exercises array to attach at creation time
        $validated = $request->validate([
            'name'         => ['required', 'string', 'max:255'],
            'description'  => ['nullable', 'string'],
            'goal'         => ['nullable', 'string'],
            'days_per_week' => ['nullable', 'integer', 'min:1', 'max:7'],
        ]);

        $plan = WorkoutPlan::create([...$validated, 'user_id' => $request->user()->id]);

        return response()->json($plan, 201);
    }

    public function show(Request $request, WorkoutPlan $workoutPlan)
    {
        // TODO: Authorize — only the owner may view; eager-load plan exercises
        return response()->json($workoutPlan);
    }

    public function update(Request $request, WorkoutPlan $workoutPlan)
    {
        // TODO: Authorize — only the owner may update
        $validated = $request->validate([
            'name'         => ['sometimes', 'string', 'max:255'],
            'description'  => ['nullable', 'string'],
            'goal'         => ['nullable', 'string'],
            'days_per_week' => ['nullable', 'integer', 'min:1', 'max:7'],
        ]);

        $workoutPlan->update($validated);

        return response()->json($workoutPlan);
    }

    public function destroy(WorkoutPlan $workoutPlan)
    {
        // TODO: Authorize — only the owner may delete
        $workoutPlan->delete();

        return response()->json(['message' => 'Workout plan deleted.']);
    }
}
