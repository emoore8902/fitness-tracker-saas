import client from './client';
import type { Exercise } from '../types';

export async function getExercises(): Promise<Exercise[]> {
  const response = await client.get<Exercise[]>('/exercises');
  return response.data;
}
