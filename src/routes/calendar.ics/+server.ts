import type { RequestHandler } from '@sveltejs/kit';
import { getActivities } from '$lib/remote/activities.remote';

function icsEscape(value: string): string {
	return value
		.replace(/\\/g, '\\\\')
		.replace(/,/g, '\,')
		.replace(/;/g, '\;')
		.replace(/\r?\n/g, '\n');
}

function nextDate(dateStr: string): string {
	// dateStr = YYYYMMDD
	const y = Number(dateStr.slice(0, 4));
	const m = Number(dateStr.slice(4, 6)) - 1;
	const d = Number(dateStr.slice(6, 8));

	const dt = new Date(Date.UTC(y, m, d));
	dt.setUTCDate(dt.getUTCDate() + 1);

	return dt.toISOString().slice(0, 10).replace(/-/g, '');
}

function utcStamp(): string {
	// Return DTSTAMP in UTC format YYYYMMDDTHHMMSSZ
	const now = new Date();
	const iso = new Date(
		Date.UTC(
			now.getUTCFullYear(),
			now.getUTCMonth(),
			now.getUTCDate(),
			now.getUTCHours(),
			now.getUTCMinutes(),
			now.getUTCSeconds()
		)
	).toISOString();
	return iso.replace(/[-:]/g, '').replace(/\..*/, ''); // YYYYMMDDTHHMMSSZ
}

async function generateICS(): Promise<string> {
	const activities = await getActivities();

	const lines: string[] = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//YourOrg//WorkoutCalendar//EN',
		'CALSCALE:GREGORIAN',
		'METHOD:PUBLISH'
	];

	const dtstamp = utcStamp();

	for (const activity of activities) {
		const workout = activity.workout;
		if (!workout) continue;

		const uid = `${activity.workout_id}@workout-planner`;
		const summary = icsEscape(workout.title);
		const description = icsEscape(`Workout: ${workout.title}\nYouTube: ${workout.url}`);
		const url = icsEscape(workout.url);

		// activity.date is ISO YYYY-MM-DD; convert to YYYYMMDD for all-day
		const start = String(activity.date).replace(/-/g, '');
		const end = nextDate(start); // exclusive end date

		lines.push(
			'BEGIN:VEVENT',
			`UID:${uid}`,
			`DTSTAMP:${dtstamp}`,
			`DTSTART;VALUE=DATE:${start}`,
			`DTEND;VALUE=DATE:${end}`,
			`SUMMARY:${summary}`,
			`DESCRIPTION:${description}`,
			`URL:${url}`,
			'END:VEVENT'
		);
	}

	lines.push('END:VCALENDAR', '');

	return lines.join('\r\n');
}

export const GET: RequestHandler = async () => {
	const ics = await generateICS();

	return new Response(ics, {
		status: 200,
		headers: {
			'Content-Type': 'text/calendar; charset=utf-8',
			'Content-Disposition': 'inline; filename="workouts.ics"'
		}
	});
};
