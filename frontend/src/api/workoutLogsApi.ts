import client from './client';
import type { WorkoutLog, CreateWorkoutLogPayload } from '../types';

export async function getWorkoutLogs(): Promise<WorkoutLog[]> {
  const response = await client.get<WorkoutLog[]>('/workout-logs');
  return response.data;
}

export async function getWorkoutLog(id: number): Promise<WorkoutLog> {
  const response = await client.get<WorkoutLog>(`/workout-logs/${id}`);
  return response.data;
}

export async function createWorkoutLog(payload: CreateWorkoutLogPayload): Promise<WorkoutLog> {
  const response = await client.post<WorkoutLog>('/workout-logs', payload);
  return response.data;
}

export async function updateWorkoutLog(
  id: number,
  payload: Partial<CreateWorkoutLogPayload>
): Promise<WorkoutLog> {
  const response = await client.put<WorkoutLog>(`/workout-logs/${id}`, payload);
  return response.data;
}

export async function deleteWorkoutLog(id: number): Promise<void> {
  await client.delete(`/workout-logs/${id}`);
}
