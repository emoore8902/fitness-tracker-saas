<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkoutPlan extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'goal',
        'days_per_week',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function exercises()
    {
        return $this->hasMany(WorkoutPlanExercise::class);
    }

    public function logs()
    {
        return $this->hasMany(WorkoutLog::class);
    }
}
