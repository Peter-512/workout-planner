import { command, form, query } from '$app/server';
import { z } from 'zod';
import { supabase } from '../server/db';
import { error, redirect } from '@sveltejs/kit';
import type { ActivityWithWorkout } from '$lib/types';
import { notifyMilestoneReached, notifyWeeklyGoalReached } from '$lib/remote/notifications.remote';
import { endOfWeek, fromDate, getLocalTimeZone, startOfWeek, today } from '@internationalized/date';

const createActivitiesSchema = z.object({
	date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' }),
	ids: z
		.array(z.string().refine((val) => Number(val)))
		.min(1, { message: 'At least one activity ID is required' })
});

export const createActivities = form(createActivitiesSchema, async ({ date, ids }) => {
	const currentDate = today(getLocalTimeZone());
	const calDate = fromDate(new Date(date), getLocalTimeZone());
	const isDateInThePast = currentDate.compare(calDate) > 0;
	const rows = ids.map((workout_id) => ({
		workout_id: Number(workout_id),
		date,
		completed: isDateInThePast
	}));

	const { error: dbError } = await supabase.from('workout_activity').insert(rows);

	if (dbError) {
		error(400, `Database error: ${dbError.message}`);
	}

	redirect(303, '/');
});

export const getTodaysActivities = query<ActivityWithWorkout[] | null>(async () => {
	const date = today(getLocalTimeZone()).toString();
	const { data, error: dbError } = await supabase
		.from('workout_activity')
		.select('*, workout(*)')
		.eq('date', date)
		.order('id');

	if (dbError) {
		error(400, dbError.message);
	}

	return data;
});

export const getActivities = query<ActivityWithWorkout[]>(async () => {
	const { data, error: dbError } = await supabase
		.from('workout_activity')
		.select('*, workout(*)')
		.order('date', { ascending: false });

	if (dbError) {
		error(400, dbError.message);
	}

	return data;
});

const mileStones = [
	10, 25, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000
];

export const completeActivity = command(
	z.object({
		id: z.number(),
		goal: z.number()
	}),
	async ({ id, goal }) => {
		const { error: dbError } = await supabase
			.from('workout_activity')
			.update({ completed: true })
			.eq('id', id);

		if (dbError) {
			error(400, dbError.message);
		}

		void getTodaysActivities().refresh();
		void getThisWeeksCompletedActivitiesCount().refresh();

		const activities = await getActivities();
		const completedCount = activities.filter((activity) => activity.completed).length;
		if (mileStones.includes(completedCount)) {
			notifyMilestoneReached(completedCount);
		}

		const thisWeeksCount = await getThisWeeksCompletedActivitiesCount();
		if (thisWeeksCount === goal) {
			notifyWeeklyGoalReached();
		}
	}
);

export const getThisWeeksCompletedActivitiesCount = query(async () => {
	const now = today(getLocalTimeZone());
	const weekStart = startOfWeek(now, getLocalTimeZone(), 'mon');
	const weekEnd = endOfWeek(now, getLocalTimeZone(), 'mon');

	const { error: dbError, data } = await supabase
		.from('workout_activity')
		.select('*')
		.gte('date', weekStart.toString())
		.lte('date', weekEnd.toString())
		.eq('completed', true);

	if (dbError) {
		error(400, dbError.message);
	}

	const uniqueDates = new Set(data?.map((activity) => activity.date));

	return uniqueDates.size;
});
