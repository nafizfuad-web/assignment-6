"use client";

import { useEffect, useState } from "react";
import WorkoutCard from "@/components/WorkoutCard";
import type { Workout } from "@/types";
import { getAllWorkouts } from "@/utils/api";

export default function LibrarySection() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadWorkouts() {
      try {
        const data = await getAllWorkouts();
        if (!cancelled) {
          setWorkouts(data);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to fetch workouts.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadWorkouts();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="library" className="mx-auto max-w-7xl scroll-mt-6 px-4 pb-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-accent">
            TRAIN YOUR WAY
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-white">
            THE LIBRARY
          </h2>
        </div>
        {!loading && !error && (
          <p className="text-sm text-gray-500">
            {workouts.length} {workouts.length === 1 ? "workout" : "workouts"}
          </p>
        )}
      </div>

      {loading ? (
        <div
          className="flex justify-center py-20"
          role="status"
          aria-label="Loading workouts"
        >
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-accent" />
        </div>
      ) : error ? (
        <p className="rounded-xl border border-red-900 bg-card p-5 text-red-300">
          Unable to load workouts: {error}
        </p>
      ) : workouts.length === 0 ? (
        <p className="rounded-xl border border-line bg-card p-5 text-gray-400">
          No workouts are available right now.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      )}
    </section>
  );
}
