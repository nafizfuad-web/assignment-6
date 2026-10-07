## Project name

FitLog

## Short description

FitLog is a workout library for discovering exercises, viewing workout details,
and organizing a personal training plan.

## Technologies used

- Next.js App Router
- React
- TypeScript
- Tailwind CSS 4
- DaisyUI
- FitLog Workout API

## 5 key features

1. Browse workouts with duration, calories, equipment, and ratings.
2. View detailed information and instructions for each workout.
3. Add workouts to today's plan or save them for later.
4. Mark planned workouts as complete, remove them, and review plan metrics.
5. Sort workouts and persist the plan and saved workouts in browser storage.

## Requirements

- Node.js and npm

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create the local environment file from the example:

   ```bash
   cp .env.example .env.local
   ```

   On Windows PowerShell, use:

   ```powershell
   Copy-Item .env.example .env.local
   ```

3. Check that `NEXT_PUBLIC_WORKOUT_API_URL` in `.env.local` points to the
   workout API base URL.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

Restart the development server after changing environment variables. The
`.env.local` file is ignored by Git; do not commit secrets in environment files.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Project structure

```text
src/
  app/          App Router pages and global styles
  components/   Shared UI components
  context/      Workout plan and saved-workout state
  types/        TypeScript data types
  utils/        API helpers
```
