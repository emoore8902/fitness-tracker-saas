<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use Illuminate\Http\Request;

class ExerciseController extends Controller
{
    public function index(Request $request)
    {
        // TODO: Return global exercises (user_id = null) + user's own custom exercises
        $exercises = Exercise::all();
        return response()->json($exercises);
    }

    public function store(Request $request)
    {
        // TODO: Validate and create a user-owned exercise
        $validated = $request->validate([
            'name'                 => ['required', 'string', 'max:255'],
            'exercise_category_id' => ['nullable', 'exists:exercise_categories,id'],
            'muscle_group'         => ['nullable', 'string'],
            'equipment'            => ['nullable', 'string'],
            'instructions'         => ['nullable', 'string'],
        ]);

        $exercise = Exercise::create([...$validated, 'user_id' => $request->user()->id]);

        return response()->json($exercise, 201);
    }

    public function show(Exercise $exercise)
    {
        // TODO: Authorize — global exercises are public; user-owned are private
        return response()->json($exercise);
    }

    public function update(Request $request, Exercise $exercise)
    {
        // TODO: Authorize — only the owner may update
        $validated = $request->validate([
            'name'         => ['sometimes', 'string', 'max:255'],
            'muscle_group' => ['nullable', 'string'],
            'equipment'    => ['nullable', 'string'],
            'instructions' => ['nullable', 'string'],
        ]);

        $exercise->update($validated);

        return response()->json($exercise);
    }

    public function destroy(Exercise $exercise)
    {
        // TODO: Authorize — only the owner may delete
        $exercise->delete();

        return response()->json(['message' => 'Exercise deleted.']);
    }
}
