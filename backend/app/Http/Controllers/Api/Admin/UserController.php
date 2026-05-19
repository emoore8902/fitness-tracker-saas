<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use App\Models\User;
use App\Models\WorkoutLog;
use App\Models\WorkoutPlan;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::orderBy('created_at', 'desc')->get();

        return response()->json($users);
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'total_users'         => User::count(),
            'total_workout_logs'  => WorkoutLog::count(),
            'total_exercises'     => Exercise::count(),
            'total_workout_plans' => WorkoutPlan::count(),
        ]);
    }
}
