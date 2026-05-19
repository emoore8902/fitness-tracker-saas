<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExerciseController extends Controller
{
    public function index(): JsonResponse
    {
        $exercises = Exercise::whereNull('user_id')
            ->with('category:id,name')
            ->orderBy('name')
            ->get();

        return response()->json($exercises);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'                 => ['required', 'string', 'max:255'],
            'exercise_category_id' => ['required', 'exists:exercise_categories,id'],
            'muscle_group'         => ['nullable', 'string', 'max:100'],
            'equipment'            => ['nullable', 'string', 'max:100'],
            'instructions'         => ['nullable', 'string'],
        ]);

        $exercise = Exercise::create([...$validated, 'user_id' => null]);

        return response()->json($exercise->load('category:id,name'), 201);
    }

    public function update(Request $request, Exercise $exercise): JsonResponse
    {
        $validated = $request->validate([
            'name'                 => ['sometimes', 'string', 'max:255'],
            'exercise_category_id' => ['sometimes', 'exists:exercise_categories,id'],
            'muscle_group'         => ['nullable', 'string', 'max:100'],
            'equipment'            => ['nullable', 'string', 'max:100'],
            'instructions'         => ['nullable', 'string'],
        ]);

        $exercise->update($validated);

        return response()->json($exercise->load('category:id,name'));
    }

    public function destroy(Exercise $exercise): JsonResponse
    {
        $exercise->delete();

        return response()->json(['message' => 'Exercise deleted.']);
    }
}
