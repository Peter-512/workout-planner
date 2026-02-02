<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/lightning.svg';
	import { notificationsSupported, subscribeAfterPermission } from './notifications.svelte';
	import { Spinner } from '$lib/components/ui/spinner';
	import { ModeWatcher } from 'mode-watcher';
	import { page } from '$app/state';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Slash } from '@lucide/svelte';
	import { resolve } from '$app/paths';
	import { cn } from '$lib/utils';

	let { children } = $props();
	const pathSegments = $derived(
		page.url.pathname
			.split('/')
			.filter(Boolean)
			.map((segment) => decodeURIComponent(segment))
	);

	const segmentLabel = (segment: string) => segment.split('-').join(' ');

	$effect(() => {
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

<ModeWatcher />
<main class="min-h-screen min-w-full flex flex-col items-center justify-center">
	<svelte:boundary>
		{#snippet pending()}
			<div class="fixed inset-0 flex items-center justify-center backdrop-blur-sm gap-2">
				<Spinner class="text-primary size-6" />
				<div class="animate-pulse font-medium">Loading…</div>
			</div>
		{/snippet}

		{#if page.route.id !== '/'}
			<Breadcrumb.Root
				class={cn('self-start top-0 left-0 mt-4 ml-4', {
					absolute:
						page.route.id === '/goal-setting' ||
						page.route.id === '/add-workout' ||
						page.route.id?.endsWith('edit') ||
						page.route.id === '/plan-activities'
				})}
			>
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href={resolve('/')}>Home</Breadcrumb.Link>
					</Breadcrumb.Item>
					{#each pathSegments as segment, index (segment)}
						<Breadcrumb.Separator>
							<Slash />
						</Breadcrumb.Separator>
						{#if index < pathSegments.length - 1}
							<Breadcrumb.Item>
								<Breadcrumb.Link href={`/${pathSegments.slice(0, index + 1).join('/')}`}>
									{segmentLabel(segment)}
								</Breadcrumb.Link>
							</Breadcrumb.Item>
						{:else}
							<Breadcrumb.Item>
								<Breadcrumb.Page>{segmentLabel(segment)}</Breadcrumb.Page>
							</Breadcrumb.Item>
						{/if}
					{/each}
				</Breadcrumb.List>
			</Breadcrumb.Root>
		{/if}

		{@render children()}
	</svelte:boundary>
</main>
