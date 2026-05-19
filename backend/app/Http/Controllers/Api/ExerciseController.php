<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use Illuminate\Http\Request;

class ExerciseController extends Controller
{
    public function index(Request $request)
    {
        $exercises = Exercise::where(function ($query) use ($request) {
                $query->whereNull('user_id')
                      ->orWhere('user_id', $request->user()->id);
            })
            ->with('category:id,name')
            ->orderBy('name')
            ->get();

        return response()->json($exercises);
    }

    public function store(Request $request)
    {
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

    public function show(Request $request, Exercise $exercise)
    {
        if ($exercise->user_id !== null && $exercise->user_id !== $request->user()->id) {
            abort(403);
        }

        return response()->json($exercise);
    }

    public function update(Request $request, Exercise $exercise)
    {
        if ($exercise->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name'         => ['sometimes', 'string', 'max:255'],
            'muscle_group' => ['nullable', 'string'],
            'equipment'    => ['nullable', 'string'],
            'instructions' => ['nullable', 'string'],
        ]);

        $exercise->update($validated);

        return response()->json($exercise);
    }

    public function destroy(Request $request, Exercise $exercise)
    {
        if ($exercise->user_id !== $request->user()->id) {
            abort(403);
        }

        $exercise->delete();

        return response()->json(['message' => 'Exercise deleted.']);
    }
}
