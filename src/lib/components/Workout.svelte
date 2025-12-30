<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import { cn, formatDuration, stars, thumbnailUrl } from '$lib/utils';
	import type { Workout } from '$lib/types';
	import type { ClassValue } from 'clsx';
	import type { ComponentProps } from 'svelte';

	let {
		title,
		intensity,
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
			<div class="mt-2 flex items-center gap-2 text-xs">
				<span class="font-medium text-yellow-400">{stars(intensity)}</span>
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
