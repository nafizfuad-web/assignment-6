"use client";

import { Suspense, use, useEffect, useState } from "react";
import Link from "next/link";
import { usePlan } from "@/context/PlanContext";
import { getWorkoutById } from "@/utils/api";
import type { Workout } from "@/types";

export default function WorkoutDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div
          className="flex justify-center py-20"
          role="status"
          aria-label="Loading workout"
        >
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-accent" />
        </div>
      }
    >
      <WorkoutDetailsContent params={params} />
    </Suspense>
  );
}

function WorkoutDetailsContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { plan, addToPlan, addToSaved } = usePlan();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadWorkout() {
      setLoading(true);
      setWorkout(null);
      setError(null);

      try {
        const data = await getWorkoutById(id);
        if (!cancelled) {
          setWorkout(data);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to fetch workout.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadWorkout();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div
        className="flex justify-center py-20"
        role="status"
        aria-label="Loading workout"
      >
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-accent" />
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="mb-4 text-gray-300">
          {error ? "Unable to load this workout." : "Workout not found."}
        </p>
        <Link href="/" className="text-accent hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  const isPlanFull = plan.length >= 5;
  const isAlreadyInPlan = plan.some((item) => item.id === workout.id);

  const specs = [
    ["Equipment", workout.equipment],
    ["Difficulty", workout.difficulty],
    ["Duration", `${workout.duration} min`],
    ["Sets", String(workout.sets)],
    ["Reps", workout.reps],
    ["Calories", `${workout.caloriesBurned} kcal`],
    ["Rating", `★ ${workout.rating}`],
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
      <Link
        href="/"
        className="mb-6 inline-flex text-sm text-gray-400 transition hover:text-accent"
      >
        &larr; Back to workouts
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="h-fit overflow-hidden rounded-2xl border border-line bg-card">
          <img
            src={workout.image}
            alt={workout.name}
            className="max-h-[680px] w-full object-cover"
          />
        </div>

        <div>
          <h1 className="font-heading text-4xl font-bold uppercase text-white sm:text-5xl">
            {workout.name}
          </h1>
          <p className="mt-4 leading-7 text-gray-400">{workout.description}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {workout.muscleGroups.map((muscleGroup) => (
              <span
                key={muscleGroup}
                className="rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase text-black"
              >
                {muscleGroup}
              </span>
            ))}
          </div>

          <dl className="mt-7 grid grid-cols-1 divide-y divide-line overflow-hidden rounded-xl border border-line bg-card sm:grid-cols-2 sm:divide-y-0">
            {specs.map(([label, value], index) => (
              <div
                key={label}
                className={`flex items-center justify-between gap-4 px-4 py-3 ${
                  index % 2 === 0 ? "sm:border-r sm:border-line" : ""
                } ${index >= 2 ? "sm:border-t sm:border-line" : ""}`}
              >
                <dt className="text-sm text-gray-500">{label}</dt>
                <dd className="text-right text-sm font-medium text-white">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-7">
            <h2 className="font-heading text-2xl font-semibold text-white">
              Instructions
            </h2>
            <ol className="mt-4 space-y-3">
              {workout.instructions.map((step, index) => (
                <li key={`${index}-${step}`} className="flex gap-3 text-gray-400">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-line text-sm font-semibold text-accent">
                    {index + 1}
                  </span>
                  <span className="pt-0.5 leading-6">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => addToPlan(workout)}
              disabled={isPlanFull || isAlreadyInPlan}
              className="rounded-lg bg-accent px-5 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isAlreadyInPlan
                ? "Already in Plan"
                : isPlanFull
                  ? "Plan Full"
                  : "Add to today's plan"}
            </button>
            <button
              onClick={() => addToSaved(workout)}
              className="rounded-lg border border-line px-5 py-3 text-white transition hover:border-accent hover:text-accent"
            >
              Save for later
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}