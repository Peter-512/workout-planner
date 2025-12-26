<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/lightning.svg';
	import { notificationsSupported, subscribeAfterPermission } from './notifications.svelte';

	let { children } = $props();

	$effect(() => {
		const serviceWorkerInNavigator = 'serviceWorker' in navigator;
		const pushManagerInWindow = 'PushManager' in window;
		console.log({
			permission: Notification.permission,
			serviceWorkerInNavigator,
			pushManagerInWindow
		});
		if (notificationsSupported && Notification.permission === 'default') {
			Notification.requestPermission().then((permission) => {
				if (permission === 'granted') {
					subscribeAfterPermission();
				}
			});
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Workout Planner</title>
	<link rel="manifest" href="/manifest.json" />
	<link rel="apple-touch-icon" href={favicon} />
	<meta name="theme-color" content="#0ea5e9" />
</svelte:head>

<main class="min-h-screen min-w-full flex flex-col items-center justify-center">
	<svelte:boundary>
		{#snippet pending()}
			<div class="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
				<div class="animate-pulse font-medium">Loading…</div>
			</div>
		{/snippet}
		{@render children()}
	</svelte:boundary>
</main>
