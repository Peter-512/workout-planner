<script lang="ts">
	import { getActivities } from '$lib/remote/activities.remote';
	import LoadingScreen from '$lib/components/LoadingScreen.svelte';
	import { Card } from '$lib/components/ui/card';
	import type { ActivityWithWorkout } from '$lib/types';
	import Workout from '$lib/components/Workout.svelte';

	function groupByDay(items: ActivityWithWorkout[]) {
		const groups: Record<string, ActivityWithWorkout[]> = {};
		for (const item of items) {
			const key = item.date; // ISO yyyy-mm-dd
			(groups[key] ??= []).push(item);
		}
		// Sort days descending (latest first)
		const entries = Object.entries(groups).sort(([a], [b]) => (a < b ? 1 : a > b ? -1 : 0));
		return entries;
	}

	function formatDayLabel(isoDate: string) {
		const d = new Date(isoDate + 'T00:00:00');
		return d.toLocaleDateString(undefined, {
			weekday: 'long',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<LoadingScreen />

<div class="min-h-screen w-full px-4 py-6">
	<div class="max-w-md mx-auto flex flex-col gap-4">
		{#await getActivities() then activities}
			{#if activities?.length}
				{#each groupByDay(activities) as [day, items] (day)}
					<h2 class="text-sm font-semibold tracking-wide text-muted-foreground">
						{formatDayLabel(day)}
					</h2>
					<div class="flex flex-col gap-3">
						{#each items as { id: activityId, workout: { id, ...rest } } (`activity-${activityId}-workout-${id}`)}
							<Workout {...rest} />
						{/each}
					</div>
				{/each}
			{:else}
				<Card class="p-6 text-center text-sm">No activities yet</Card>
			{/if}
		{/await}
	</div>
</div>
