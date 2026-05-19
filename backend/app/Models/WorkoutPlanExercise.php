<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkoutPlanExercise extends Model
{
    protected $fillable = [
        'workout_plan_id',
        'exercise_id',
        'day_of_week',
        'sets',
        'reps',
        'target_weight',
        'sort_order',
    ];

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Exercise::class);
    }
}
