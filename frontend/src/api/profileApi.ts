import client from './client';
import type { User } from '../types';

export async function getProfile(): Promise<User> {
  const res = await client.get<User>('/profile');
  return res.data;
}

export async function updateProfile(payload: {
  weekly_workout_goal?: number;
  weight_unit?: 'lbs' | 'kg';
}): Promise<User> {
  const res = await client.put<User>('/profile', payload);
  return res.data;
}
