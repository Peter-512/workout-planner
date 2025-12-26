import { command } from '$app/server';
import { supabase } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import webPush, { type PushSubscription } from 'web-push';
import { z } from 'zod';
import { VAPID_PRIVATE_KEY } from '$env/static/private';
import { PUBLIC_VAPID_PUBLIC_KEY } from '$env/static/public';
import { dev } from '$app/environment';
import favicon from '$lib/assets/favicon.svg';

const url = dev
	? 'mailto:peter.buschenreiter@gmail.com'
	: 'https://workout-planner-chi-three.vercel.app/';

const { sendNotification, setVapidDetails } = webPush;

setVapidDetails(`${url}/plan-activities`, PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export const subscribeToNotifications = command(
	'unchecked',
	async (subscription: PushSubscription) => {
		const { error: dbError } = await supabase.from('subscriptions').upsert({
			endpoint: subscription.endpoint,
			expiration_time: subscription.expirationTime,
			p256dh: subscription.keys.p256dh,
			auth: subscription.keys.auth
		});

		if (dbError) {
			error(500, `Database error: ${dbError.message}`);
		}
	}
);

export type Payload = {
	title: string;
	body: string;
	icon: string;
};

export const pushNotification = command(z.number(), async (amount) => {
	const { data, error: dbError } = await supabase.from('subscriptions').select('*');

	if (dbError) {
		error(500, `Database error: ${dbError.message}`);
	}

	const payload: Payload = {
		title: 'Congrats on another milestone! 🚀',
		body: `You have completed ${amount} workouts! Keep up the great work! 💪`,
		icon: favicon
	};

	for (const sub of data) {
		await sendNotification(
			{ ...sub, keys: { p256dh: sub.p256dh, auth: sub.auth } },
			JSON.stringify(payload)
		);
	}
});
