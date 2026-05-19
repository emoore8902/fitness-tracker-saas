<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'weekly_workout_goal' => ['sometimes', 'integer', 'min:1', 'max:14'],
            'weight_unit'         => ['sometimes', 'string', 'in:lbs,kg'],
        ]);

        $request->user()->update($validated);

        return response()->json($request->user()->fresh());
    }
}
