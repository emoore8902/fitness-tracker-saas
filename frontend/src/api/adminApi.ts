import client from './client';
import type { User, ExerciseCategory, Exercise, AdminStats } from '../types';

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getAdminUsers(): Promise<User[]> {
  const response = await client.get<User[]>('/admin/users');
  return response.data;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function getAdminStats(): Promise<AdminStats> {
  const response = await client.get<AdminStats>('/admin/stats');
  return response.data;
}

// ─── Exercise Categories ──────────────────────────────────────────────────────

export interface CategoryWithCount extends ExerciseCategory {
  exercises_count: number;
}

export async function getAdminCategories(): Promise<CategoryWithCount[]> {
  const response = await client.get<CategoryWithCount[]>('/admin/exercise-categories');
  return response.data;
}

export async function createAdminCategory(payload: { name: string }): Promise<CategoryWithCount> {
  const response = await client.post<CategoryWithCount>('/admin/exercise-categories', payload);
  return response.data;
}

export async function updateAdminCategory(
  id: number,
  payload: { name: string }
): Promise<CategoryWithCount> {
  const response = await client.put<CategoryWithCount>(`/admin/exercise-categories/${id}`, payload);
  return response.data;
}

export async function deleteAdminCategory(id: number): Promise<void> {
  await client.delete(`/admin/exercise-categories/${id}`);
}

// ─── Global Exercises ─────────────────────────────────────────────────────────

export interface AdminExercisePayload {
  name: string;
  exercise_category_id: number;
  muscle_group: string;
  equipment: string;
  instructions: string;
}

export async function getAdminExercises(): Promise<Exercise[]> {
  const response = await client.get<Exercise[]>('/admin/exercises');
  return response.data;
}

export async function createAdminExercise(payload: AdminExercisePayload): Promise<Exercise> {
  const response = await client.post<Exercise>('/admin/exercises', payload);
  return response.data;
}

export async function updateAdminExercise(
  id: number,
  payload: Partial<AdminExercisePayload>
): Promise<Exercise> {
  const response = await client.put<Exercise>(`/admin/exercises/${id}`, payload);
  return response.data;
}

export async function deleteAdminExercise(id: number): Promise<void> {
  await client.delete(`/admin/exercises/${id}`);
}
