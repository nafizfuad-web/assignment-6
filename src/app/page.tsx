import { Suspense } from "react";
import { getAllWorkouts } from "@/utils/api";

async function WorkoutCount() {
  const workouts = await getAllWorkouts();
  return <p className="mt-2">Total workouts: {workouts.length}</p>;
}

export default function Home() {
  return (
    <div className="p-10">
      <h1 className="font-heading text-5xl text-accent">FITLOG</h1>
      <Suspense fallback={<p className="mt-2">Loading workouts...</p>}>
        <WorkoutCount />
      </Suspense>
    </div>
  );
}