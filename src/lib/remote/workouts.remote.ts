import { form, query } from '$app/server';
import { z } from 'zod';
import { YOUTUBE_API_KEY } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';
import { supabase } from '../server/db';
import type { Workout } from '$lib/types';

// Helper: extract YouTube video ID from various URL formats
function extractYouTubeId(url: string): string | null {
	try {
		const u = new URL(url);
		// youtu.be/<id>
		if (u.hostname === 'youtu.be') {
			return u.pathname.slice(1) || null;
		}
		// youtube.com/watch?v=<id>
		if (
			u.hostname === 'www.youtube.com' ||
			u.hostname === 'youtube.com' ||
			u.hostname.endsWith('.youtube.com')
		) {
			if (u.pathname === '/watch') {
				return u.searchParams.get('v');
			}
			// embed or shorts
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

// Helper: parse ISO8601 duration to seconds (e.g., PT1H2M30S)
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
	return { title, durationIso, durationSeconds };
}

export const createWorkout = form(
	z.object({
		url: z.url(),
		intensity: z.enum(['1', '2', '3', '4', '5']),
		type: z.enum(['cardio', 'strength', 'stretching'])
	}),
	async ({ url, intensity, type }) => {
		const videoId = extractYouTubeId(url);
		if (!videoId) {
			error(400, 'Invalid YouTube URL');
		}
		const info = await getYouTubeVideoInfo(videoId);
		const enriched = {
			url,
			intensity: parseInt(intensity, 10),
			videoId,
			title: info.title,
			duration: info.durationSeconds,
			type
		};
		console.log(enriched);

		const { error: dbError } = await supabase.from('workout').insert({ ...enriched });
		if (dbError) {
			error(500, `Database error: ${dbError.message}`);
		}

		redirect(303, '/');
	}
);

export const getWorkouts = query(async (): Promise<Workout[]> => {
	const { data, error: dbError } = await supabase
		.from('workout')
		.select('*')
		.order('created_at', { ascending: false });

	if (dbError) {
		error(500, `Database error: ${dbError.message}`);
	}

	return data;
});
