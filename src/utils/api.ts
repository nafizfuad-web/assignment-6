import { Workout } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_WORKOUT_API_URL;

function getBaseUrl(): string {
  if (!BASE_URL) {
    throw new Error(
      "Missing NEXT_PUBLIC_WORKOUT_API_URL. Set it in the root .env.local file.",
    );
  }

  return BASE_URL.replace(/\/+$/, "");
}

export async function getAllWorkouts(): Promise<Workout[]> {
  const res = await fetch(getBaseUrl());
  if (!res.ok) throw new Error("Failed to fetch workouts");
  const data: Workout[] = await res.json();
  return data;
}

export async function getWorkoutById(id: string): Promise<Workout> {
  const res = await fetch(`${getBaseUrl()}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch workout");
  const data: Workout = await res.json();
  return data;
}