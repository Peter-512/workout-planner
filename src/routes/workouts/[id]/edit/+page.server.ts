import { error, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { supabase } from '$lib/server/db';
import { YOUTUBE_API_KEY } from '$env/static/private';

const workoutTypes = ['cardio', 'strength', 'stretching', 'dance party', 'yoga', 'mobility'] as const;

const updateWorkoutSchema = z.object({
	id: z.coerce.number().int().positive(),
	url: z.string().url(),
	intensity: z.coerce.number().int().min(1).max(5),
	rating: z.coerce.number().int().min(1).max(5),
	type: z.enum(workoutTypes)
});

function extractYouTubeId(url: string): string | null {
	try {
		const u = new URL(url);
		if (u.hostname === 'youtu.be') {
			return u.pathname.slice(1) || null;
		}
		if (
			u.hostname === 'www.youtube.com' ||
			u.hostname === 'youtube.com' ||
			u.hostname.endsWith('.youtube.com')
		) {
			if (u.pathname === '/watch') {
				return u.searchParams.get('v');
			}
			if (u.pathname.startsWith('/embed/')) {
				return u.pathname.split('/')[2] || null;
			}
			if (u.pathname.startsWith('/shorts/')) {
				return u.pathname.split('/')[2] || null;
			}
		}
		return null;
	} catch {
		return null;
	}
}

function parseIsoDurationToSeconds(iso: string): number {
	const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
	if (!match) return 0;
	const hours = parseInt(match[1] || '0', 10);
	const minutes = parseInt(match[2] || '0', 10);
	const seconds = parseInt(match[3] || '0', 10);
	return hours * 3600 + minutes * 60 + seconds;
}

async function getYouTubeVideoInfo(videoId: string) {
	if (!YOUTUBE_API_KEY) {
		error(500, 'Missing YOUTUBE_API_KEY');
	}
	const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${encodeURIComponent(videoId)}&key=${YOUTUBE_API_KEY}`;
	const res = await fetch(url);
	if (!res.ok) {
		const text = await res.text();
		error(503, `YouTube API error ${res.status}: ${text}`);
	}
	const json = await res.json();
	const item = json.items?.[0];
	if (!item) {
		error(404, 'Video not found');
	}
	const title: string = item.snippet?.title ?? '';
	const durationIso: string = item.contentDetails?.duration ?? 'PT0S';
	const durationSeconds = parseIsoDurationToSeconds(durationIso);
	return { title, durationSeconds };
}

export const load = async ({ params }) => {
	const id = Number(params.id);
	if (!Number.isFinite(id)) {
		error(400, 'Invalid workout id');
	}

	const { data, error: dbError } = await supabase
		.from('workout')
		.select('*')
		.eq('id', id)
		.single();

	if (dbError) {
		error(404, 'Workout not found');
	}

	return { workout: data };
};

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const parsed = updateWorkoutSchema.safeParse({
			id: formData.get('id'),
			url: formData.get('url'),
			intensity: formData.get('intensity'),
			rating: formData.get('rating'),
			type: formData.get('type')
		});

		if (!parsed.success) {
			error(400, 'Invalid form data');
		}

		const { id, url, intensity, rating, type } = parsed.data;
		const videoId = extractYouTubeId(url);
		if (!videoId) {
			error(400, 'Invalid YouTube URL');
		}
		const info = await getYouTubeVideoInfo(videoId);

		const { error: dbError } = await supabase
			.from('workout')
			.update({
				url,
				intensity,
				rating,
				videoId,
				title: info.title,
				duration: info.durationSeconds,
				type
			})
			.eq('id', id);

		if (dbError) {
			error(500, `Database error: ${dbError.message}`);
		}

		redirect(303, '/workouts');
	}
};
