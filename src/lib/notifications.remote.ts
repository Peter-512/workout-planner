import { command } from '$app/server';
import { supabase } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import webPush, { type PushSubscription, WebPushError } from 'web-push';
import { z } from 'zod';
import { VAPID_PRIVATE_KEY } from '$env/static/private';
import { PUBLIC_VAPID_PUBLIC_KEY } from '$env/static/public';
import { dev } from '$app/environment';
import favicon from '$lib/assets/lightning.svg';
import type { Subscription } from '$lib/types';
import { ResultAsync } from 'neverthrow';

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

const PayloadSchema = z.object({
	title: z.string(),
	body: z.string(),
	icon: z.string()
});

export type Payload = z.infer<typeof PayloadSchema>;

export const notifyMilestoneReached = command(z.number(), async (amount) => {
	const payload: Payload = {
		title: 'Congrats on another milestone! 🚀',
		body: `You have completed ${amount} workouts! Keep up the great work! 💪`,
		icon: favicon
	};

	pushNotification(payload);
});

export const notifyWeeklyGoalReached = command(async () => {
	const payload: Payload = {
		title: 'Weekly Goal Achieved! 🎉',
		body: `You've hit your weekly workout goal! Time to celebrate your dedication! 🥳`,
		icon: favicon
	};

	pushNotification(payload);
});

const pushNotification = command(PayloadSchema, async (payload) => {
	const { data, error: dbError } = await supabase.from('subscriptions').select('*');

	if (dbError) {
		error(500, `Database error: ${dbError.message}`);
	}
	for (const sub of data) {
		const result = await notify(sub, payload);
		if (result.isErr()) {
			await deleteSubscription(sub.id);
		}
	}
});

const notify = async (sub: Subscription, payload: Payload) => {
	return ResultAsync.fromPromise(
		sendNotification(
			{ ...sub, keys: { p256dh: sub.p256dh, auth: sub.auth } },
			JSON.stringify(payload)
		),
		(e) => e as WebPushError
	);
};

const deleteSubscription = command(z.number(), async (id) => {
	const { error: dbError } = await supabase.from('subscriptions').delete().eq('id', id);

	if (dbError) {
		error(500, `Database error: ${dbError.message}`);
	}
});
