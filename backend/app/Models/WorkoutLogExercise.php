<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkoutLogExercise extends Model
{
    protected $fillable = [
        'workout_log_id',
        'exercise_id',
        'sets',
        'reps',
        'weight',
        'duration_minutes',
        'notes',
    ];
}
