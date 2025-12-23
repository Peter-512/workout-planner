import { command } from '$app/server';
import { supabase } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PushSubscription } from 'web-push';

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
