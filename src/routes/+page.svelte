<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	import { getTodaysActivity } from '$lib/activities.remote';
	import { formatDuration, stars, thumbnailUrl } from '$lib/utils';

	const activity = await getTodaysActivity();
</script>

<Button href="workouts" class="fixed top-4 right-4" variant="secondary">Workouts</Button>

<Card class="w-full max-w-sm mx-auto shadow-lg">
	<div class="px-6">
		{#if activity?.workout}
			<div class="flex items-start gap-3">
				<div class="flex-1">
					<div class="text-sm">Today’s activity</div>
					<h2 class="text-base font-semibold">{activity.workout.title}</h2>
					<div class="mt-1 flex items-center gap-2 text-xs ">
						<span class="font-medium text-yellow-400">{stars(activity.workout.intensity)}</span>
						<span aria-hidden="true">•</span>
						<span>{formatDuration(activity.workout.duration)}</span>
						{#if activity.workout.type}
							<span aria-hidden="true">•</span>
							<span class="capitalize text-primary">{activity.workout.type}</span>
						{/if}
					</div>
				</div>
			</div>
			<img src={thumbnailUrl(activity.workout.videoId)} alt="Workout thumbnail" class="rounded object-cover mt-2" loading="lazy" />
			<div class="mt-3">
				<Button target="_blank" href={activity.workout.url} variant="default" class="w-full">
					Start workout
				</Button>
			</div>
		{:else}
			<div class="mt-2 border-t pt-4 text-center text-sm ">It's a rest day today 😌</div>
		{/if}
	</div>
</Card>

<Button href="add-workout" class="fixed left-4 bottom-4 w-1/3 max-w-xs" variant="outline">Add workout</Button>
<Button href="plan-activities" class="fixed right-4 bottom-4 w-1/3 max-w-xs" variant="default">Plan activities</Button>
