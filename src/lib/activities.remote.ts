import { command, form, query } from '$app/server';
import { z } from 'zod';
import { supabase } from './server/db';
import { error, redirect } from '@sveltejs/kit';
import type { ActivityWithWorkout } from '$lib/types';

const createActivitiesSchema = z.object({
	date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' }),
	ids: z
		.array(z.string().refine((val) => Number(val)))
		.min(1, { message: 'At least one activity ID is required' })
});

export const createActivities = form(createActivitiesSchema, async ({ date, ids }) => {
	const activityDate = new Date(date);
	const workoutIds = ids.map((id) => Number(id));

	const rows = workoutIds.map((workout_id, i) => ({
		workout_id,
		date: activityDate
	}));

	const { error: dbError } = await supabase.from('workout_activity').insert(rows);

	if (dbError) {
		error(400, `Database error: ${dbError.message}`);
	}

	redirect(303, '/');
});

export const getTodaysActivities = query<ActivityWithWorkout[] | null>(async () => {
	const today = new Date().toISOString().split('T')[0];

	const { data, error: dbError } = await supabase
		.from('workout_activity')
		.select('*, workout(*)')
		.eq('date', today);

	if (dbError) {
		error(400, dbError.message);
	}

	return data;
});

export const getActivities = query<ActivityWithWorkout[]>(async () => {
	const { data, error: dbError } = await supabase
		.from('workout_activity')
		.select('workout_id, date, workout(id, title, url, videoId, duration, type, intensity)')
		.order('date', { ascending: false });

	if (dbError) {
		error(400, dbError.message);
	}

	return data;
});

export const completeActivity = command(z.number(), async (id) => {
	const { error: dbError } = await supabase
		.from('workout_activity')
		.update({ completed: true })
		.eq('id', id);

	if (dbError) {
		error(400, dbError.message);
	}

	void getTodaysActivities().refresh();
});
