"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlan } from "@/context/PlanContext";

export default function Navbar() {
  const pathname = usePathname();
  const { plan, saved } = usePlan();

  return (
    <header className="border-b border-line bg-bg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-2xl text-white"
          aria-label="FitLog home"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6 text-accent"
          >
            <path
              d="M4 9v6m4-9v12m8-12v12m4-9v6M2 12h20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          FITLOG
        </Link>

        <div className="hidden items-center gap-8 sm:flex">
          <Link
            href="/"
            className={
              pathname === "/" ? "text-accent" : "text-gray-400 transition hover:text-white"
            }
          >
            Workout
          </Link>
          <Link
            href="/my-plan"
            className={
              pathname === "/my-plan"
                ? "text-accent"
                : "text-gray-400 transition hover:text-white"
            }
          >
            My Plan
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/my-plan"
            className="rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-bg transition hover:brightness-90"
          >
            Plan <span aria-label={`${plan.length} workouts`}>{plan.length}</span>
          </Link>
          <Link
            href="/my-plan"
            className="rounded-full border border-line px-3 py-1.5 text-sm text-gray-300 transition hover:border-accent hover:text-accent"
          >
            Saved{" "}
            <span aria-label={`${saved.length} saved workouts`}>
              {saved.length}
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
