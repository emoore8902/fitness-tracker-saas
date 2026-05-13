<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\WorkoutLog;

class UserController extends Controller
{
    public function index()
    {
        // TODO: Gate behind an 'admin' middleware or Policy check before going live
        // TODO: Paginate results
        $users = User::all();

        return response()->json($users);
    }

    public function stats()
    {
        // TODO: Gate behind an 'admin' middleware or Policy check before going live
        // TODO: Add more aggregate stats (active plans, logs per week, etc.)
        return response()->json([
            'total_users'        => User::count(),
            'total_workout_logs' => WorkoutLog::count(),
        ]);
    }
}
