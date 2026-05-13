export interface User {
  id: number;
  name: string;
  email: string;
  is_admin?: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
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

export interface WorkoutPlan {
  id: number;
  name: string;
  description: string | null;
  goal: string | null;
  days_per_week: number | null;
}

export interface WorkoutLog {
  id: number;
  workout_plan_id: number | null;
  performed_at: string;
  notes: string | null;
  plan?: WorkoutPlan;
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

export interface DashboardData {
  stats: DashboardStats;
  recent_workouts: RecentWorkout[];
  weekly_activity: WeeklyActivityDay[];
  progress: null; // TODO: type this once backend implements progress tracking
}
