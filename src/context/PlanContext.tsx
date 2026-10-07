"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
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

const subscribeToHydration = () => () => {};
const getHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export function useIsHydrated() {
  return useSyncExternalStore(
    subscribeToHydration,
    getHydrationSnapshot,
    getServerHydrationSnapshot,
  );
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<PlanWorkout[]>([]);
  const [saved, setSaved] = useState<Workout[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedPlan = localStorage.getItem("fitlog-plan");
      const storedSaved = localStorage.getItem("fitlog-saved");

      if (storedPlan) {
        const parsedPlan: unknown = JSON.parse(storedPlan);
        if (!Array.isArray(parsedPlan)) {
          throw new Error("Stored workout plan must be an array.");
        }
        // Restore client storage after mount to keep server and client renders aligned.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPlan(parsedPlan as PlanWorkout[]);
      }

      if (storedSaved) {
        const parsedSaved: unknown = JSON.parse(storedSaved);
        if (!Array.isArray(parsedSaved)) {
          throw new Error("Stored saved workouts must be an array.");
        }
        setSaved(parsedSaved as Workout[]);
      }
    } catch (error) {
      console.error("Failed to restore workouts from localStorage.", error);
      toast.error("Could not restore saved workouts.");
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem("fitlog-plan", JSON.stringify(plan));
      } catch (error) {
        console.error("Failed to save workout plan to localStorage.", error);
        toast.error("Could not save your workout plan.");
      }
    }
  }, [plan, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem("fitlog-saved", JSON.stringify(saved));
      } catch (error) {
        console.error("Failed to save workouts to localStorage.", error);
        toast.error("Could not save your saved workouts.");
      }
    }
  }, [saved, isHydrated]);

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