import client from './client';
import type { WorkoutPlan, CreateWorkoutPlanPayload } from '../types';

export async function getWorkoutPlans(): Promise<WorkoutPlan[]> {
  const response = await client.get<WorkoutPlan[]>('/workout-plans');
  return response.data;
}

export async function getWorkoutPlan(id: number): Promise<WorkoutPlan> {
  const response = await client.get<WorkoutPlan>(`/workout-plans/${id}`);
  return response.data;
}

export async function createWorkoutPlan(payload: CreateWorkoutPlanPayload): Promise<WorkoutPlan> {
  const response = await client.post<WorkoutPlan>('/workout-plans', payload);
  return response.data;
}

export async function updateWorkoutPlan(
  id: number,
  payload: Partial<CreateWorkoutPlanPayload>
): Promise<WorkoutPlan> {
  const response = await client.put<WorkoutPlan>(`/workout-plans/${id}`, payload);
  return response.data;
}

export async function deleteWorkoutPlan(id: number): Promise<void> {
  await client.delete(`/workout-plans/${id}`);
}
