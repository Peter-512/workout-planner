/// <reference lib="webworker" />

import type { Payload } from './lib/remote/notifications.remote';

declare const self: ServiceWorkerGlobalScope;

self.addEventListener('push', (event) => {
	const payload: Payload | null = event.data?.json();

	if (payload == null) {
		return;
	}

	const { title, body, icon } = payload;

	const options: NotificationOptions = {
		silent: false,
		body,
		icon
	};

	event.waitUntil((self as ServiceWorkerGlobalScope).registration.showNotification(title, options));
});

export {};
