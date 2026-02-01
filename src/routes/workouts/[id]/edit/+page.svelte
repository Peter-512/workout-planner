<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import LoadingScreen from '$lib/components/LoadingScreen.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const workout = $derived(data.workout);

	let url = $state('');
	let intensity = $state('1');
	let rating = $state('1');
	let type = $state('cardio');

	onMount(() => {
		url = workout.url;
		intensity = String(workout.intensity);
		rating = String(workout.rating ?? 3);
		type = workout.type ?? 'cardio';
	});
</script>

<LoadingScreen />

<form method="POST" class="flex flex-col gap-4 p-4 w-full max-w-md mx-auto">
	<input type="hidden" name="id" value={workout.id} />

	<label class="flex flex-col gap-1">
		<span class="text-sm font-medium">Workout URL</span>
		<input
			class="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
			name="url"
			required
			bind:value={url}
			placeholder="https://example.com/workout"
		/>
	</label>

	<label class="flex flex-col gap-1">
		<span class="text-sm font-medium">Intensity</span>
		<select
			class="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
			name="intensity"
			required
			bind:value={intensity}
		>
			<option value="1">1 💧</option>
			<option value="2">2 💧💧</option>
			<option value="3">3 💧💧💧</option>
			<option value="4">4 💧💧💧💧</option>
			<option value="5">5 💧💧💧💧💧</option>
		</select>
	</label>

	<label class="flex flex-col gap-1">
		<span class="text-sm font-medium">Enjoyment rating</span>
		<select
			class="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
			name="rating"
			required
			bind:value={rating}
		>
			<option value="1">1 ⭐</option>
			<option value="2">2 ⭐⭐</option>
			<option value="3">3 ⭐⭐⭐</option>
			<option value="4">4 ⭐⭐⭐⭐</option>
			<option value="5">5 ⭐⭐⭐⭐⭐</option>
		</select>
	</label>

	<label class="flex flex-col gap-1">
		<span class="text-sm font-medium">Workout type</span>
		<select
			class="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
			name="type"
			required
			bind:value={type}
		>
			<option value="cardio">Cardio</option>
			<option value="strength">Strength</option>
			<option value="stretching">Stretching</option>
			<option value="dance party">Dance party</option>
			<option value="yoga">Yoga</option>
			<option value="mobility">Mobility</option>
		</select>
	</label>

	<Button type="submit" class="w-full">Save changes</Button>
</form>
