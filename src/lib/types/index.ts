import type { Database } from 'supabase.ts';

export type Workout = Database['public']['Tables']['workout']['Row'];

export type WorkoutActivity = Database['public']['Tables']['workout_activity']['Row'];

export type ActivityWithWorkout = WorkoutActivity & {
	workout: Workout;
};
