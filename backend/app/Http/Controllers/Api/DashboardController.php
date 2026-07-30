<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkoutLog;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user   = $request->user();
        $userId = $user->id;

        // --- Stats ---

        $startOfWeek = Carbon::now()->startOfWeek(Carbon::MONDAY);
        $endOfWeek   = Carbon::now()->endOfWeek(Carbon::SUNDAY);

        $workoutsThisWeek = WorkoutLog::where('user_id', $userId)
            ->whereBetween('performed_at', [$startOfWeek, $endOfWeek])
            ->count();

        // Total volume: sum of weight * sets * reps across all the user's logged exercises
        $totalVolume = DB::table('workout_log_exercises')
            ->join('workout_logs', 'workout_log_exercises.workout_log_id', '=', 'workout_logs.id')
            ->where('workout_logs.user_id', $userId)
            ->whereNotNull('workout_log_exercises.weight')
            ->selectRaw('SUM(
                COALESCE(workout_log_exercises.weight, 0) *
                COALESCE(workout_log_exercises.sets, 1) *
                COALESCE(workout_log_exercises.reps, 1)
            ) as total')
            ->value('total') ?? 0;

        // Favorite exercise: most-logged exercise name for this user
        $favoriteExercise = DB::table('workout_log_exercises')
            ->join('workout_logs', 'workout_log_exercises.workout_log_id', '=', 'workout_logs.id')
            ->join('exercises', 'workout_log_exercises.exercise_id', '=', 'exercises.id')
            ->where('workout_logs.user_id', $userId)
            ->selectRaw('exercises.name, COUNT(*) as log_count')
            ->groupBy('exercises.id', 'exercises.name')
            ->orderByDesc('log_count')
            ->limit(1)
            ->value('name');

        $currentStreak = $this->calculateStreak($userId);

        // --- Recent Workouts (last 5) ---

        $recentWorkouts = WorkoutLog::where('user_id', $userId)
            ->with('plan:id,name')
            ->withCount('exercises')
            ->orderByDesc('performed_at')
            ->limit(5)
            ->get()
            ->map(fn ($log) => [
                'id'             => $log->id,
                'plan_name'      => $log->plan?->name,
                'performed_at'   => $log->performed_at,
                'exercise_count' => $log->exercises_count,
            ]);

        // --- Weekly Activity (Mon–Sun of current week) ---

        $weeklyActivity = collect(range(0, 6))->map(function ($offset) use ($userId, $startOfWeek) {
            $date      = $startOfWeek->copy()->addDays($offset);
            $dayLabel  = $date->format('D'); // Mon, Tue, …
            $workouts  = WorkoutLog::where('user_id', $userId)
                ->whereDate('performed_at', $date->toDateString())
                ->count();

            return ['day' => $dayLabel, 'workouts' => $workouts];
        });

        // --- Progress ---
        // Find the exercise the user has logged with weight data in the most distinct sessions (≥ 2)
        $topExercise = DB::table('workout_log_exercises')
            ->join('workout_logs', 'workout_log_exercises.workout_log_id', '=', 'workout_logs.id')
            ->join('exercises', 'workout_log_exercises.exercise_id', '=', 'exercises.id')
            ->where('workout_logs.user_id', $userId)
            ->whereNotNull('workout_log_exercises.weight')
            ->select('exercises.id', 'exercises.name')
            ->selectRaw('COUNT(DISTINCT workout_logs.id) as session_count')
            ->groupBy('exercises.id', 'exercises.name')
            ->havingRaw('COUNT(DISTINCT workout_logs.id) >= 2')
            ->orderByRaw('COUNT(DISTINCT workout_logs.id) DESC')
            ->first();

        if (!$topExercise) {
            $progress = null;
        } else {
            $sessions = DB::table('workout_log_exercises')
                ->join('workout_logs', 'workout_log_exercises.workout_log_id', '=', 'workout_logs.id')
                ->where('workout_logs.user_id', $userId)
                ->where('workout_log_exercises.exercise_id', $topExercise->id)
                ->whereNotNull('workout_log_exercises.weight')
                ->select('workout_logs.id')
                ->selectRaw('MAX(workout_log_exercises.weight) as max_weight')
                ->selectRaw('MIN(workout_logs.performed_at) as performed_at')
                ->groupBy('workout_logs.id')
                ->orderBy('performed_at')
                ->get();

            $earliest = $sessions->first();
            $latest   = $sessions->last();
            $change   = round((float) $latest->max_weight - (float) $earliest->max_weight, 1);

            $progress = [
                'exercise'        => $topExercise->name,
                'starting_weight' => (float) $earliest->max_weight,
                'latest_weight'   => (float) $latest->max_weight,
                'change'          => $change,
                'change_label'    => ($change >= 0 ? '+' : '') . $change . ' kg',
            ];
        }

        return response()->json([
            'stats' => [
                'workouts_this_week' => $workoutsThisWeek,
                'total_volume_kg'    => round((float) $totalVolume, 1),
                'current_streak'     => $currentStreak,
                'favorite_exercise'  => $favoriteExercise,
            ],
            'recent_workouts' => $recentWorkouts,
            'weekly_activity' => $weeklyActivity,
            'weekly_goal'     => $user->weekly_workout_goal ?? 3,
            'progress'        => $progress,
        ]);
    }

    /**
     * Calculate the user's current workout streak in days.
     *
     * Walks backwards from today, counting consecutive days on which
     * at least one WorkoutLog was recorded.
     */
    private function calculateStreak(int $userId): int
    {
        $dates = WorkoutLog::where('user_id', $userId)
            ->selectRaw('DATE(performed_at) as workout_date')
            ->distinct()
            ->orderByDesc('workout_date')
            ->pluck('workout_date');

        if ($dates->isEmpty()) {
            return 0;
        }

        $streak = 0;
        $today  = Carbon::today();

        foreach ($dates as $dateStr) {
            $date     = Carbon::parse($dateStr);
            $expected = $today->copy()->subDays($streak);

            if ($date->isSameDay($expected)) {
                $streak++;
            } else {
                break;
            }
        }

        return $streak;
    }
}
