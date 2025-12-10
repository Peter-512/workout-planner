<script lang="ts">
	import { getWorkouts } from '$lib/workouts.remote';
	import { Card } from '$lib/components/ui/card';
	import Workout from '$lib/Workout.svelte';

	const workouts = await getWorkouts();
</script>

<div class="min-h-screen w-full px-4 py-6">
	<div class="max-w-md mx-auto flex flex-col gap-3">
		{#each workouts as { id, ...workout } (id)}
			<Workout {...workout} />
		{:else}
			<Card class="p-6 text-center text-sm ">No workouts yet</Card>
		{/each}
	</div>
</div>
