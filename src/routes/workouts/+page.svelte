<script lang="ts">
	import { getWorkouts } from '$lib/remote/workouts.remote';
	import { Card } from '$lib/components/ui/card';
	import Workout from '$lib/components/Workout.svelte';
	import LoadingScreen from '$lib/components/LoadingScreen.svelte';
</script>

<LoadingScreen />

<div class="min-h-screen w-full px-4 py-6">
	<div class="max-w-md mx-auto flex flex-col gap-3">
		{#each await getWorkouts() as { id, ...workout } (id)}
			<Workout workoutId={id} {...workout} />
		{:else}
			<Card class="p-6 text-center text-sm ">No workouts yet</Card>
		{/each}
	</div>
</div>
