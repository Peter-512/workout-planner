<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import { cn, drops, formatDuration, stars, thumbnailUrl } from '$lib/utils';
	import type { Workout } from '$lib/types';
	import type { ClassValue } from 'clsx';
	import type { ComponentProps } from 'svelte';

	let {
		title,
		intensity,
		rating,
		duration,
		type,
		videoId,
		url,
		class: className,
		...props
	}: Omit<Workout, 'id' | 'url'> & { url?: Workout['url'] } & {
		class?: ClassValue | null | undefined;
	} & ComponentProps<typeof Card> = $props();
</script>

<Card target="_blank" href={url} class={cn('p-4 shadow-sm', className)} {...props}>
	<div class="flex items-start justify-between gap-3">
		<div class="flex-1">
			<h2 class="text-base font-semibold">{title}</h2>
			<div class="mt-2 flex flex-wrap items-center gap-2 text-xs">
				<div class="flex flex-col gap-1">
					<span class="font-medium">{drops(intensity)}</span>
					{#if rating != null}
						<span class="font-medium">{stars(rating)}</span>
					{/if}
				</div>
				<span aria-hidden="true">•</span>
				<span>{formatDuration(duration)}</span>
				<span aria-hidden="true">•</span>
				<span class="capitalize text-primary">{type}</span>
			</div>
		</div>
		<img
			src={thumbnailUrl(videoId)}
			alt="YouTube thumbnail"
			class="w-20 h-14 rounded object-cover"
			loading="lazy"
		/>
	</div>
</Card>
