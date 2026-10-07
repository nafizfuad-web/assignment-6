"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import type { PlanWorkout, Workout } from "@/types";

interface PlanMetrics {
  totalWorkouts: number;
  completedWorkouts: number;
  totalDuration: number;
  totalCalories: number;
}

interface PlanContextType {
  plan: PlanWorkout[];
  saved: Workout[];
  addToPlan: (workout: Workout) => void;
  addToSaved: (workout: Workout) => void;
  removeFromPlan: (id: number) => void;
  removeFromSaved: (id: number) => void;
  markAsDone: (id: number) => void;
  metrics: PlanMetrics;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<PlanWorkout[]>([]);
  const [saved, setSaved] = useState<Workout[]>([]);

  function addToPlan(workout: Workout) {
    if (plan.some((item) => item.id === workout.id)) {
      toast.error("Workout is already in your plan.");
      return;
    }

    setPlan((currentPlan) => [...currentPlan, { ...workout, isDone: false }]);
    toast.success("Workout added to your plan.");
  }

  function addToSaved(workout: Workout) {
    if (saved.some((item) => item.id === workout.id)) {
      toast.error("Workout is already saved.");
      return;
    }

    setSaved((currentSaved) => [...currentSaved, workout]);
    toast.success("Workout saved.");
  }

  function removeFromPlan(id: number) {
    setPlan((currentPlan) => currentPlan.filter((item) => item.id !== id));
  }

  function removeFromSaved(id: number) {
    setSaved((currentSaved) => currentSaved.filter((item) => item.id !== id));
  }

  function markAsDone(id: number) {
    setPlan((currentPlan) =>
      currentPlan.map((item) =>
        item.id === id ? { ...item, isDone: true } : item,
      ),
    );
  }

  const metrics = useMemo<PlanMetrics>(
    () => ({
      totalWorkouts: plan.length,
      completedWorkouts: plan.filter((workout) => workout.isDone).length,
      totalDuration: plan.reduce(
        (total, workout) => total + workout.duration,
        0,
      ),
      totalCalories: plan.reduce(
        (total, workout) => total + workout.caloriesBurned,
        0,
      ),
    }),
    [plan],
  );

  return (
    <PlanContext.Provider
      value={{
        plan,
        saved,
        addToPlan,
        addToSaved,
        removeFromPlan,
        removeFromSaved,
        markAsDone,
        metrics,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error("usePlan must be used within a PlanProvider.");
  }

  return context;
}