/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

// @ts-expect-error types missing?
import { files } from '$service-worker';

self.addEventListener('push', (event) => {
	console.log({ event });
	// Parse payload defensively and keep types narrow
	const payload = (() => {
		try {
			const raw = event.data ? event.data.json?.() : {};
			return typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {};
		} catch {
			return {} as Record<string, unknown>;
		}
	})();
	console.log({ files });

	const title = typeof payload.title === 'string' ? payload.title : 'Notification';
	const options: NotificationOptions = {
		silent: false,
		body: typeof payload.body === 'string' ? payload.body : '',
		icon: typeof payload.icon === 'string' ? payload.icon : files[0]
	};

	event.waitUntil((self as ServiceWorkerGlobalScope).registration.showNotification(title, options));
});

export {};
