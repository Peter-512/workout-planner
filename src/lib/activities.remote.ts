import { form } from '$app/server';
import { z } from 'zod';
import { supabase } from './server/db';
import type { Database } from '$lib/types/supabase.ts';
import { error, redirect } from '@sveltejs/kit';

const createActivitiesSchema = z.object({
	date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' }),
	ids: z
		.array(z.string().refine((val) => Number(val)))
		.min(1, { message: 'At least one activity ID is required' })
});

const addDays = (date: Date, days: number) => {
	const next = new Date(date);
	next.setDate(next.getDate() + days);
	return next;
};

export const createActivities = form(createActivitiesSchema, async ({ date, ids }) => {
	const startDate = new Date(date);
	const workoutIds = ids.map((id) => Number(id));

	const rows = workoutIds.map((workout_id, i) => ({
		workout_id,
		date: addDays(startDate, i)
	}));

	const { error: dbError } = await supabase.from('workout_activity').insert(rows);

	if (dbError) {
		error(400, `Database error: ${dbError.message}`);
	}

	redirect(303, '/');
});
