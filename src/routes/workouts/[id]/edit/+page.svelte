<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import LoadingScreen from '$lib/components/LoadingScreen.svelte';
	import { deleteWorkout, getWorkoutById, updateWorkout } from '$lib/remote/workouts.remote';
	import { drops, formatDuration, stars } from '$lib/utils';

	const id = $derived(Number(page.params.id));
</script>

<LoadingScreen />

{#await getWorkoutById({ id })}
	<div class="p-4 text-sm text-gray-500">Loading workout…</div>
{:then workout}
	<div class="flex flex-col gap-4 p-4 w-full max-w-md mx-auto">
		<form {...updateWorkout} class="flex flex-col gap-4">
			<div class="flex items-start gap-3 flex-col">
				<div class="flex-1">
					<h2 class="text-base font-semibold">{workout.title}</h2>
					<p class="mt-1 text-xs text-muted-foreground">{formatDuration(workout.duration)}</p>
				</div>
				<img
					src={`https://img.youtube.com/vi/${workout.videoId}/hqdefault.jpg`}
					alt="YouTube thumbnail"
					class="rounded object-cover w-full"
					loading="lazy"
				/>
			</div>
			<input {...updateWorkout.fields.id.as('hidden', `${workout.id}`)} />

			<label class="flex flex-col gap-1">
				<span class="text-sm font-medium">Intensity</span>
				<select
					class="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					{...updateWorkout.fields.intensity.as('select')}
					required
				>
					{#each [1, 2, 3, 4, 5] as level (level)}
						{@const selectedIntensity = workout.intensity}
						<option selected={selectedIntensity === level} value={String(level)}
							>{level} {drops(level)}</option
						>
					{/each}
				</select>
			</label>
			{#each updateWorkout.fields.intensity.issues() as issue (issue.message)}
				<p class="issue">{issue.message}</p>
			{/each}

			<label class="flex flex-col gap-1">
				<span class="text-sm font-medium">Enjoyment rating</span>
				<select
					class="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					{...updateWorkout.fields.rating.as('select')}
					required
				>
					{#each [1, 2, 3, 4, 5] as rating (rating)}
						{@const selectedRating = workout.rating ?? 3}
						<option selected={selectedRating === rating} value={String(rating)}
							>{rating} {stars(rating)}</option
						>
					{/each}
				</select>
			</label>
			{#each updateWorkout.fields.rating.issues() as issue (issue.message)}
				<p class="issue">{issue.message}</p>
			{/each}

			<label class="flex flex-col gap-1">
				<span class="text-sm font-medium">Workout type</span>
				<select
					class="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					{...updateWorkout.fields.type.as('select')}
					required
				>
					{#each ['cardio', 'strength', 'stretching', 'dance party', 'yoga', 'mobility'] as type (type)}
						{@const selectedType = workout.type ?? 'cardio'}
						<option selected={selectedType === type} value={type}
							>{type.charAt(0).toUpperCase() + type.slice(1)}</option
						>
					{/each}
				</select>
			</label>
			{#each updateWorkout.fields.type.issues() as issue (issue.message)}
				<p class="issue">{issue.message}</p>
			{/each}

			<Button {...updateWorkout.fields.action.as('submit', 'update')} class="w-full"
				>Save changes</Button
			>
			<Button
				variant="destructive"
				{...updateWorkout.fields.action.as('submit', 'delete')}
				class="w-full">Delete workout</Button
			>
		</form>
	</div>
{:catch err}
	<div class="p-4 text-sm text-red-600">Failed to load workout: {err?.message}</div>
{/await}

<style>
	.issue {
		color: #dc2626;
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}
</style>
