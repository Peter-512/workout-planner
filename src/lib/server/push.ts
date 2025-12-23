import { WebPushError, setVapidDetails, sendNotification } from 'web-push';
import { supabase } from '$lib/server/db';
import { VAPID_PRIVATE_KEY } from '$env/static/private';
import { PUBLIC_VAPID_PUBLIC_KEY } from '$env/static/public';

setVapidDetails('mailto:admin@example.com', PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

export async function sendMilestoneNotification(amount: number) {
	const { data, error: dbError } = await supabase.from('subscriptions').select('*');

	if (dbError) {
		throw dbError;
	}

	const payload = JSON.stringify({
		title: 'Congrats on another milestone! 🚀',
		body: `You have completed ${amount} workouts! Keep up the great work! 💪`
	});

	for (const sub of data) {
		try {
			await sendNotification(sub.data, payload);
		} catch (err: unknown) {
			if (!(err instanceof WebPushError)) {
				console.error('Unexpected error', err);
				continue;
			}
			// If the subscription is no longer valid, delete it
			if (err?.statusCode === 410 || err?.statusCode === 404) {
				await supabase.from('subscriptions').delete().eq('endpoint', sub.endpoint);
			} else {
				console.error('Push error', err);
			}
		}
	}
}
