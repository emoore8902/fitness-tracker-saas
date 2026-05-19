<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ExerciseCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExerciseCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = ExerciseCategory::withCount('exercises')
            ->orderBy('name')
            ->get();

        return response()->json($categories);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:exercise_categories,name'],
        ]);

        $category = ExerciseCategory::create($validated);

        return response()->json(
            $category->loadCount('exercises'),
            201
        );
    }

    public function update(Request $request, ExerciseCategory $exerciseCategory): JsonResponse
    {
        $validated = $request->validate([
            'name' => [
                'required', 'string', 'max:100',
                'unique:exercise_categories,name,' . $exerciseCategory->id,
            ],
        ]);

        $exerciseCategory->update($validated);

        return response()->json($exerciseCategory->loadCount('exercises'));
    }

    public function destroy(ExerciseCategory $exerciseCategory): JsonResponse
    {
        // Prevent deletion if exercises exist in this category
        if ($exerciseCategory->exercises()->exists()) {
            return response()->json([
                'message' => 'Cannot delete a category that has exercises. Remove or reassign the exercises first.',
            ], 422);
        }

        $exerciseCategory->delete();

        return response()->json(['message' => 'Exercise category deleted.']);
    }
}
