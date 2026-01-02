<script lang="ts">
	import { getActivities } from '$lib/remote/activities.remote';
	import LoadingScreen from '$lib/components/LoadingScreen.svelte';
	import type { ActivityWithWorkout } from '$lib/types';
	import Workout from '$lib/components/Workout.svelte';
	import { Separator } from '$lib/components/ui/separator';

	function groupByDate(items: ActivityWithWorkout[]) {
		return Object.entries(Object.groupBy(items, (activity) => activity.date));
	}

	function formatDayLabel(isoDate: string) {
		const d = new Date(isoDate);
		return d.toLocaleDateString('en', {
			weekday: 'long',
			month: 'short',
			day: 'numeric'
		});
	}

	function formatShort(isoDate: string) {
		const d = new Date(isoDate);
		return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
	}

	function daysBetween(a: string, b: string) {
		const ad = new Date(a);
		const bd = new Date(b);
		const ms = Math.abs(ad.getTime() - bd.getTime());
		return Math.floor(ms / (1000 * 60 * 60 * 24));
	}
</script>

<LoadingScreen />

<div class="min-h-screen w-full px-4 py-6">
	<div class="max-w-md mx-auto flex flex-col gap-4">
		{#each groupByDate(await getActivities()) as [day, items], i (`day-group-${day}`)}
			{#if i > 0}
				<!-- Insert rest day divider for gap between previous day and this day -->
				{@const [prevDay] = groupByDate(getActivities().current ?? [])[i - 1]}
				{@const gap = daysBetween(prevDay, day) - 1}
				{#if gap > 0}
					<div class="flex items-center gap-2 text-xs text-muted-foreground py-1">
						<div class="flex-1"><Separator /></div>
						{#if gap === 1}
							<span>Rest day · {formatShort(prevDay)}</span>
						{:else}
							<span>Rest days · {formatShort(day)} – {formatShort(prevDay)}</span>
						{/if}
						<div class="flex-1"><Separator /></div>
					</div>
				{/if}
			{/if}

			<h2 class="text-sm font-semibold tracking-wide text-muted-foreground">
				{formatDayLabel(day)}
			</h2>
			<div class="flex flex-col gap-3">
				{#each items as { id: activityId, workout: { id, ...rest } } (`activity-${activityId}-workout-${id}`)}
					<Workout {...rest} />
				{/each}
			</div>
		{/each}
	</div>
</div>
