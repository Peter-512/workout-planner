<script lang="ts">
	import type { HTMLAnchorAttributes, HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		href = undefined,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> &
		WithElementRef<HTMLAnchorAttributes> = $props();
</script>

{#if href}
	<a
		{href}
		bind:this={ref}
		data-slot="card"
		class={cn(
			'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
			className
		)}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<div
		bind:this={ref}
		data-slot="card"
		class={cn(
			'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
			className
		)}
		{...restProps}
	>
		{@render children?.()}
	</div>
{/if}
