import { PUBLIC_VAPID_PUBLIC_KEY } from '$env/static/public';
import type { PushSubscription as WebPushSubscription } from 'web-push';
import { subscribeToNotifications } from '$lib/remote/notifications.remote';

export const notificationsSupported =
	typeof window !== 'undefined' &&
	'Notification' in window &&
	typeof Notification?.requestPermission === 'function' &&
	'serviceWorker' in navigator &&
	'PushManager' in window;

export const subscribeAfterPermission = async () => {
	const reg = await navigator.serviceWorker.ready;

	const existing = await reg.pushManager.getSubscription();
	const subscription =
		existing ??
		(await reg.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: PUBLIC_VAPID_PUBLIC_KEY
		}));

	const pushSubscription: WebPushSubscription = {
		endpoint: subscription.endpoint,
		expirationTime: subscription.expirationTime,
		keys: {
			p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))),
			auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!)))
		}
	};
	await subscribeToNotifications(pushSubscription);
};
