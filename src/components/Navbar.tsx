"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsHydrated, usePlan } from "@/context/PlanContext";

export default function Navbar() {
  const pathname = usePathname();
  const { plan, saved } = usePlan();
  const isHydrated = useIsHydrated();

  const planCount = isHydrated ? plan.length : 0;
  const savedCount = isHydrated ? saved.length : 0;

  return (
    <header className="border-b border-line bg-bg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1 whitespace-nowrap"
          aria-label="FitLog home"
        >
          <Image
            src="/assets/logo.png"
            alt=""
            aria-hidden="true"
            width={28}
            height={28}
            priority
          />
          <span className="font-heading text-xl text-white">FITLOG</span>
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
            className="rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-accent-text transition hover:brightness-90"
          >
            Plan <span aria-label={`${planCount} workouts`}>{planCount}</span>
          </Link>
          <Link
            href="/my-plan"
            className="rounded-full border border-line px-3 py-1.5 text-sm text-gray-300 transition hover:border-accent hover:text-accent"
          >
            Saved{" "}
            <span aria-label={`${savedCount} saved workouts`}>
              {savedCount}
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
