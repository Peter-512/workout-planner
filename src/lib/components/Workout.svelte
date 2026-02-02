<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import { cn, drops, formatDuration, stars, thumbnailUrl } from '$lib/utils';
	import type { Workout } from '$lib/types';
	import type { ClassValue } from 'clsx';
	import type { ComponentProps } from 'svelte';

	let {
		workoutId,
		title,
		intensity,
		rating,
		duration,
		type,
		videoId,
		url,
		editHref,
		links = true,
		class: className,
		...props
	}: Omit<Workout, 'id'> & {
		workoutId: Workout['id'];
		editHref?: string;
		links?: boolean;
		class?: ClassValue | null | undefined;
	} & ComponentProps<typeof Card> = $props();
</script>

<Card class={cn('p-4 shadow-sm', className)} {...props}>
	<div class="flex items-start justify-between gap-3">
		{#if links}
			{@const editLink = editHref ?? (workoutId ? `/workouts/${workoutId}/edit` : undefined)}
			{#if editLink}
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve-->
				<a class="flex-1" href={editLink}>
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
				</a>
			{:else}
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
			{/if}
		{:else}
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
		{/if}

		{#if links && url}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve-->
			<a href={url} target="_blank" rel="noreferrer">
				<img
					src={thumbnailUrl(videoId)}
					alt="YouTube thumbnail"
					class="w-20 h-14 rounded object-cover"
					loading="lazy"
				/>
			</a>
		{:else}
			<img
				src={thumbnailUrl(videoId)}
				alt="YouTube thumbnail"
				class="w-20 h-14 rounded object-cover"
				loading="lazy"
			/>
		{/if}
	</div>
</Card>
