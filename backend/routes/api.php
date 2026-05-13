<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ExerciseController;
use App\Http\Controllers\Api\WorkoutPlanController;
use App\Http\Controllers\Api\WorkoutLogController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;

// --- Public Auth Routes ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// --- Protected Routes ---
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Exercises (full CRUD)
    Route::apiResource('exercises', ExerciseController::class);

    // Workout Plans (full CRUD)
    Route::apiResource('workout-plans', WorkoutPlanController::class);

    // Workout Logs (index + store only for now)
    Route::get('/workout-logs', [WorkoutLogController::class, 'index']);
    Route::post('/workout-logs', [WorkoutLogController::class, 'store']);

    // --- Admin Routes ---
    // TODO: Replace inner auth:sanctum with a dedicated 'admin' middleware
    Route::prefix('admin')->name('admin.')->middleware('auth:sanctum')->group(function () {
        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        Route::get('/stats', [AdminUserController::class, 'stats'])->name('users.stats');
    });
});
