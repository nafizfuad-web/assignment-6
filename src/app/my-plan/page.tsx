"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePlan } from "@/context/PlanContext";

type ActiveTab = "plan" | "saved";
type SortBy = "duration" | "calories" | "rating";

export default function MyPlanPage() {
  const {
    plan,
    saved,
    metrics,
    removeFromPlan,
    removeFromSaved,
    markAsDone,
  } = usePlan();

  const [activeTab, setActiveTab] = useState<ActiveTab>("plan");
  const [sortBy, setSortBy] = useState<SortBy>("duration");

  const currentList = activeTab === "plan" ? plan : saved;
  const sortedList = useMemo(
    () =>
      [...currentList].sort((a, b) => {
        if (sortBy === "duration") return a.duration - b.duration;
        if (sortBy === "calories") return b.caloriesBurned - a.caloriesBurned;
        return b.rating - a.rating;
      }),
    [currentList, sortBy],
  );

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-xs font-semibold tracking-[0.2em] text-accent">
        YOUR TRAINING
      </p>
      <h1 className="mt-2 font-heading text-4xl uppercase text-white">
        My Plan
      </h1>
      <p className="mt-1 text-gray-400">Your workouts for today.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Exercises" value={metrics.totalWorkouts} />
        <MetricCard label="Minutes" value={metrics.totalDuration} />
        <MetricCard label="Calories" value={metrics.totalCalories} />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2" role="tablist" aria-label="Workout lists">
          <button
            id="plan-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === "plan"}
            aria-controls="workout-list"
            onClick={() => setActiveTab("plan")}
            className={`rounded-lg px-4 py-2 text-sm transition ${
              activeTab === "plan"
                ? "bg-accent font-semibold text-black"
                : "border border-line text-gray-300 hover:border-accent"
            }`}
          >
            Today&apos;s Plan
          </button>
          <button
            id="saved-tab"
            type="button"
            role="tab"
            aria-selected={activeTab === "saved"}
            aria-controls="workout-list"
            onClick={() => setActiveTab("saved")}
            className={`rounded-lg px-4 py-2 text-sm transition ${
              activeTab === "saved"
                ? "bg-accent font-semibold text-black"
                : "border border-line text-gray-300 hover:border-accent"
            }`}
          >
            Saved
          </button>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-400">
          Sort by
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortBy)}
            className="rounded-lg border border-line bg-card px-3 py-2 text-white outline-none focus:border-accent"
          >
            <option value="duration">Duration</option>
            <option value="calories">Calories</option>
            <option value="rating">Rating</option>
          </select>
        </label>
      </div>

      <div
        id="workout-list"
        role="tabpanel"
        aria-labelledby={activeTab === "plan" ? "plan-tab" : "saved-tab"}
      >
        {sortedList.length === 0 ? (
          <div className="mt-6 rounded-xl border border-line bg-card px-4 py-16 text-center">
            <h2 className="font-heading text-2xl uppercase text-white">
              Nothing here yet
            </h2>
            <p className="mt-2 text-gray-400">
              Browse the library and add workouts.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-lg bg-accent px-5 py-2 font-semibold text-black transition hover:brightness-90"
            >
              Browse Library
            </Link>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {sortedList.map((item) => {
              const isDone =
                activeTab === "plan" &&
                "isDone" in item &&
                Boolean(item.isDone);

              return (
                <li
                  key={item.id}
                  className="flex flex-col gap-4 rounded-xl border border-line bg-card p-4 sm:flex-row sm:items-center"
                >
                  <Image
                    src={item.image}
                    alt=""
                    width={96}
                    height={96}
                    className="h-24 w-full rounded-lg object-cover sm:w-24"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-heading text-xl uppercase text-white">
                        {item.name}
                      </h2>
                      {isDone && (
                        <span className="rounded-full border border-accent/30 px-2 py-0.5 text-xs text-accent">
                          Done
                        </span>
                      )}
                    </div>
                    <p className="mt-1 truncate text-sm text-gray-500">
                      {item.equipment}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                      <span>{item.duration} min</span>
                      <span>{item.caloriesBurned} kcal</span>
                      <span className="text-accent">★ {item.rating}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <Link
                      href={`/workout/${item.id}`}
                      className="rounded-lg border border-line px-3 py-2 text-sm text-gray-200 transition hover:border-accent hover:text-accent"
                    >
                      View Details
                    </Link>
                    {activeTab === "plan" && !isDone && (
                      <button
                        type="button"
                        onClick={() => markAsDone(item.id)}
                        className="rounded-lg border border-accent/40 px-3 py-2 text-sm text-accent transition hover:bg-accent/10"
                      >
                        ✓ Done
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        activeTab === "plan"
                          ? removeFromPlan(item.id)
                          : removeFromSaved(item.id)
                      }
                      className="rounded-lg border border-line px-3 py-2 text-sm text-gray-400 transition hover:border-red-500 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-line bg-card p-4">
      <p className="text-xs uppercase text-gray-400">{label}</p>
      <p className="font-heading text-4xl text-accent">{value}</p>
    </div>
  );
}