<script lang="ts">
	import { getActivities } from '$lib/remote/activities.remote';
	import LoadingScreen from '$lib/components/LoadingScreen.svelte';
	import type { ActivityWithWorkout } from '$lib/types';
	import Workout from '$lib/components/Workout.svelte';
	import { getLocalTimeZone, today } from '@internationalized/date';

	function groupByDate(items: ActivityWithWorkout[]) {
		return Object.entries(Object.groupBy(items, (activity) => activity.date));
	}

	function sortByDate(items: ActivityWithWorkout[], ascending: boolean) {
		return [...items].sort((a, b) =>
			ascending ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)
		);
	}

	const todayIso = today(getLocalTimeZone()).toString();

	function getUpcomingActivities(items: ActivityWithWorkout[]) {
		return sortByDate(
			items.filter((activity) => activity.date >= todayIso),
			true
		);
	}

	function getPastCompletedActivities(items: ActivityWithWorkout[]) {
		return sortByDate(
			items.filter((activity) => activity.date < todayIso && activity.completed),
			false
		);
	}

	function formatDayLabel(isoDate: string) {
		const d = new Date(isoDate);
		return d.toLocaleDateString('en', {
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
			{@const upcomingByDate = groupByDate(getUpcomingActivities(activities))}
			{@const pastCompletedByDate = groupByDate(getPastCompletedActivities(activities))}

			<section class="rounded-xl border border-primary/25 bg-primary/5 p-4">
				<div class="mb-3 flex items-center justify-between gap-2">
					<h2 class="text-sm font-semibold tracking-wide text-primary">Upcoming Workouts</h2>
					<span
						class="inline-flex items-center rounded-full border border-primary/35 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary"
					>
						Upcoming
					</span>
				</div>

				{#if upcomingByDate.length === 0}
					<p class="text-sm text-muted-foreground">No upcoming workouts planned.</p>
				{:else}
					<div class="flex flex-col gap-4">
						{#each upcomingByDate as [day, items] (`upcoming-day-${day}`)}
							<div class="flex flex-col gap-3">
								<h3 class="text-xs font-semibold tracking-wide text-muted-foreground">
									{formatDayLabel(day)}
								</h3>
								<div class="flex flex-col gap-3">
									{#each items as { id: activityId, workout: { id, ...rest } } (`upcoming-activity-${activityId}-workout-${id}`)}
										<Workout workoutId={id} {...rest} class="border-primary/30 bg-primary/5" />
									{/each}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</section>

			<section
				class="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20"
			>
				<div class="mb-3 flex items-center justify-between gap-2">
					<h2 class="text-sm font-semibold tracking-wide text-emerald-700 dark:text-emerald-300">
						Past Completed
					</h2>
					<span
						class="inline-flex items-center rounded-full border border-emerald-300 bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:border-emerald-700/60 dark:bg-emerald-900/40 dark:text-emerald-300"
					>
						Completed
					</span>
				</div>

				{#if pastCompletedByDate.length === 0}
					<p class="text-sm text-muted-foreground">No completed workouts in the past yet.</p>
				{:else}
					<div class="flex flex-col gap-4">
						{#each pastCompletedByDate as [day, items] (`past-day-${day}`)}
							<div class="flex flex-col gap-3">
								<h3 class="text-xs font-semibold tracking-wide text-muted-foreground">
									{formatDayLabel(day)}
								</h3>
								<div class="flex flex-col gap-3">
									{#each items as { id: activityId, workout: { id, ...rest } } (`past-activity-${activityId}-workout-${id}`)}
										<Workout
											workoutId={id}
											{...rest}
											class="border-emerald-200 bg-emerald-50/80 dark:border-emerald-900/45 dark:bg-emerald-950/25"
										/>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</section>
		{/await}
	</div>
</div>
