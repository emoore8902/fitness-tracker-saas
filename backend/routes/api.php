<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ExerciseController;
use App\Http\Controllers\Api\WorkoutPlanController;
use App\Http\Controllers\Api\WorkoutLogController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\Admin\ExerciseCategoryController as AdminExerciseCategoryController;
use App\Http\Controllers\Api\Admin\ExerciseController as AdminExerciseController;

// --- Public Auth Routes ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --- Protected Routes ---
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Profile / Settings
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Exercises (full CRUD)
    Route::apiResource('exercises', ExerciseController::class);

    // Workout Plans (full CRUD)
    Route::apiResource('workout-plans', WorkoutPlanController::class);

    // Workout Logs (full CRUD)
    Route::apiResource('workout-logs', WorkoutLogController::class);

    // --- Admin Routes ---
    Route::prefix('admin')->name('admin.')->middleware('admin')->group(function () {
        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        Route::get('/stats', [AdminUserController::class, 'stats'])->name('users.stats');
        Route::apiResource('exercise-categories', AdminExerciseCategoryController::class);
        Route::apiResource('exercises', AdminExerciseController::class);
    });
});
