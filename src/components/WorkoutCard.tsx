import Image from "next/image";
import Link from "next/link";
import type { Workout } from "@/types";

export default function WorkoutCard({ workout }: { workout: Workout }) {
  return (
    <Link
      href={`/workout/${workout.id}`}
      className="group block overflow-hidden rounded-xl border border-line bg-card transition hover:-translate-y-1 hover:border-accent/50"
    >
      <div className="relative h-40 overflow-hidden">
        <Image
          src={workout.image}
          alt={workout.name}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          {workout.muscleGroups.map((muscleGroup) => (
            <span
              key={muscleGroup}
              className="rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase text-accent-text"
            >
              {muscleGroup}
            </span>
          ))}
        </div>
        <h2 className="mt-3 font-heading text-xl font-semibold uppercase text-white">
          {workout.name}
        </h2>
        <p className="mt-1 truncate text-sm text-gray-500">
          {workout.equipment}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-sm text-gray-400">
          <span>{workout.duration} min</span>
          <span>{workout.caloriesBurned} kcal</span>
          <span className="text-accent">★ {workout.rating}</span>
        </div>
      </div>
    </Link>
  );
}
