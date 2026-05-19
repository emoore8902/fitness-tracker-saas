<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Exercise::class);
    }
}
