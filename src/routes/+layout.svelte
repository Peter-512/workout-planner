<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
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
