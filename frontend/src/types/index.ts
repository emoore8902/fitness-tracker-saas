export interface User {
  id: number;
  name: string;
  email: string;
  is_admin?: boolean;
  created_at?: string;
  weekly_workout_goal?: number;
  weight_unit?: 'lbs' | 'kg';
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export interface ExerciseCategory {
  id: number;
  name: string;
}

export interface Exercise {
  id: number;
  name: string;
  muscle_group: string | null;
  equipment: string | null;
  instructions: string | null;
  exercise_category_id: number | null;
  category?: ExerciseCategory;
  user_id: number | null;
}

export interface WorkoutPlanExercise {
  id: number;
  workout_plan_id: number;
  exercise_id: number;
  day_of_week: string | null;
  sets: number | null;
  reps: number | null;
  target_weight: number | null;
  sort_order: number;
  exercise?: Exercise;
}

export interface WorkoutPlanExercisePayload {
  exercise_id: number;
  day_of_week: string;
  sets: number | '';
  reps: number | '';
  target_weight: number | '';
  sort_order: number;
}

export interface CreateWorkoutPlanPayload {
  name: string;
  description: string;
  goal: string;
  days_per_week: number | '';
  exercises: WorkoutPlanExercisePayload[];
}

export interface WorkoutPlan {
  id: number;
  name: string;
  description: string | null;
  goal: string | null;
  days_per_week: number | null;
  exercises?: WorkoutPlanExercise[];
}

export interface WorkoutLogExercise {
  id: number;
  workout_log_id: number;
  exercise_id: number;
  sets: number | null;
  reps: number | null;
  weight: number | null;
  duration_minutes: number | null;
  notes: string | null;
  exercise?: Exercise;
}

export interface WorkoutLogExercisePayload {
  exercise_id: number;
  sets: number | '';
  reps: number | '';
  weight: number | '';
  duration_minutes: number | '';
  notes: string;
}

export interface CreateWorkoutLogPayload {
  workout_plan_id: number | '';
  performed_at: string;
  notes: string;
  exercises: WorkoutLogExercisePayload[];
}

export interface WorkoutLog {
  id: number;
  user_id: number;
  workout_plan_id: number | null;
  performed_at: string;
  notes: string | null;
  plan?: Pick<WorkoutPlan, 'id' | 'name'>;
  exercises?: WorkoutLogExercise[];
}

export interface DashboardStats {
  workouts_this_week: number;
  total_volume_kg: number;
  current_streak: number;
  favorite_exercise: string | null;
}

export interface RecentWorkout {
  id: number;
  plan_name: string | null;
  performed_at: string;
  exercise_count: number;
}

export interface WeeklyActivityDay {
  day: string;
  workouts: number;
}

export interface AdminStats {
  total_users: number;
  total_workout_logs: number;
  total_exercises: number;
  total_workout_plans: number;
}

export interface ExerciseProgress {
  exercise: string;
  starting_weight: number;
  latest_weight: number;
  change: number;
  change_label: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recent_workouts: RecentWorkout[];
  weekly_activity: WeeklyActivityDay[];
  weekly_goal: number;
  progress: ExerciseProgress | null;
}
